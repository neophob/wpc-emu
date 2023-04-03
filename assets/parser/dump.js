const fs = require('fs');
const process = require('process');
const mapper = require('../../lib/boards/mapper/memory');
const hardwareMapper = require('../../lib/boards/mapper/hardware');

const hasAlphaNumbericDisplay = true;
let last = '';

/*
RW is as
@tomlogic
 describes : 0 to write, 1 to read
Once again, be aware that the data is not valid at the same time for a read or for a write
That's because when the CPU writes data, he already knows the address and data, but when he has to read something, he first sets the address on the bus and then has to wait fo the data to come from the peripheral
The 6809 datasheet has a memory access chronogram that gives detailed information about this
*/

function getHardwareAction(offset) {
  const address = hardwareMapper.getAddress(offset, hasAlphaNumbericDisplay);
  switch (address.subsystem) {
    case hardwareMapper.SUBSYSTEM_DISPLAY:
      return 'W_DIS_0x' + address.offset.toString(16);
    case hardwareMapper.SUBSYSTEM_EXTERNAL_IO:
      return 'W_IO_0x' + address.offset.toString(16);
    case hardwareMapper.SUBSYSTEM_SOUND:
      return 'W_SND_0x' + address.offset.toString(16);
    case hardwareMapper.SUBSYSTEM_WPCIO:
      return 'R_ASIC_0x' + address.offset.toString(16);
    default:
      console.log(JSON.stringify(address));
      throw new Error('CPUBOARD_INVALID_HW_WRITE');
  }

}

/**
 * Recorded as 32-bit samples
 * For each sample :
 * Data bus : bit 0 to 7
 * Address bus : bit 8 to 23 (0-15)
 * Clock : bit 24
 * R/W : bit 25
 */
function dumpData(uint32, offset) {
  const data = uint32 & 0xFF;
  const address = (uint32 >>> 8) & 0xFFFF;
  const clock = (uint32 & 0x1000000) > 0 ? 1 : 0;
  const rw = (uint32 & 0x2000000) > 0 ? 1 : 0;
  const irq = (uint32 & 0x8000000) > 0 ? 1 : 0;
  const firq = (uint32 & 0x10000000) > 0 ? 1 : 0;
  const current = ''+irq;//`${data}_${address}_${clock}_${rw}`;

  const target = mapper.getAddress(address);
  let action = '';
  switch (target.subsystem) {
    case mapper.SUBSYSTEM_RAM:
      action = 'R_RAM_0x' + target.offset.toString(16);
      break;
    case mapper.SUBSYSTEM_HARDWARE:
      action = getHardwareAction(target.offset);
      break;
    case mapper.SUBSYSTEM_BANKSWITCHED:
      action = 'R_BANK_0x' + target.offset.toString(16);
      break;
    case mapper.SUBSYSTEM_SYSTEMROM:
      action = 'R_ROM_0x' + target.offset.toString(16);
      break;
  }

  const newFrame = current !== last;
  if (newFrame) {
    console.log(`src: ${'0x'+offset.toString(16).padStart(4, '0')} | ` +
    `clk: ${clock} rw: ${rw} | ` +
    `0x${address.toString(16).padStart(4, '0')} -> 0x${data.toString(16).padStart(2, '0')} | ` +
    `${action} | ` +
    `${irq} ${firq}`
    //console.log(target.offset.toString(16))
    );
  }
  last = current;
}

const fileName = process.env.DUMPFILE;
if (!fileName) {
  throw new Error('DUMPFILE env var not set');
}
const buffer = fs.readFileSync(fileName);
const size = buffer.length;
console.log('size', size);

for (let n = 0; n < 1024*512; n+=4) {
  dumpData(buffer.readUint32LE(n), n);
}
