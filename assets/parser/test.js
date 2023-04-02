const fs = require('fs');
const process = require('process');
const Emulator = require('../../lib/emulator');
const mapper = require('../../lib/boards/mapper/memory');

let last = '';
let lastIrq = 0;

function loadFile(fileName) {
  console.log('loadFile', fileName);
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(new Uint8Array(data));
    });
  });
}

function applyDumpData(wpcSystem, uint32, offset) {
  const data = uint32 & 0xFF;
  const address = (uint32 >>> 8) & 0xFFFF;
  const clock = (uint32 & 0x1000000) > 0 ? 1 : 0;
  const rw = (uint32 & 0x2000000) > 0 ? 1 : 0;
  const irq = (uint32 & 0x8000000) > 0 ? 1 : 0;
  const current = `${data}_${address}_${clock}_${rw}_${irq}`;

  const newFrame = current !== last;
  if (newFrame && rw) {
    const a = wpcSystem.getUiState();
    if (a.asic.dmd.dmdShadedBuffer) {
      let val = 0;
      a.asic.dmd.dmdShadedBuffer.forEach((v) => (val += v));
      console.log('DISPLAY:', val);
      let ofs = 0;
      for (let y=0; y<32; y++) {
        let line = '';
        for (let x=0; x<128; x++) {
          const entry = a.asic.dmd.dmdShadedBuffer[ofs++]
          switch (entry) {
            case 0:
              line += '.';
              break;
            case 1:
              line += ':';
              break;
            case 2:
              line += 'O';
              break;
            case 3:
              line += '$';
              break;
          }
        }
        console.log('   ' + line);
      }
    }
    console.log(`src: ${'0x'+offset.toString(16).padStart(4, '0')} | ` +
    `clk: ${clock} rw: ${rw} | ` +
    `0x${address.toString(16).padStart(4, '0')} -> 0x${data.toString(16).padStart(2, '0')} | `
    );/**/

    const target = mapper.getAddress(address);
    let processCommand = false;
    switch (target.subsystem) {
      case mapper.SUBSYSTEM_RAM:
      case mapper.SUBSYSTEM_HARDWARE:
        processCommand = true;
        break;
      case mapper.SUBSYSTEM_BANKSWITCHED:
      case mapper.SUBSYSTEM_SYSTEMROM:
        processCommand = false;
        break;
    }

    if (processCommand)
      wpcSystem.cpuBoard._write8(address, data);
    //TODO trigger irq, update ticksExecuted
  }
  last = current;
  const returnVal = lastIrq === 0 && irq === 1;
  lastIrq = irq;
  return returnVal;
}

const fileName = process.env.DUMPFILE;
if (!fileName) {
  throw new Error('DUMPFILE env var not set');
}
const buffer = fs.readFileSync(fileName);
const dumpSize = buffer.length;
console.log('DUMP size: ', dumpSize);

const romGamePath = process.env.ROMFILE;
if (!romGamePath) {
  throw new Error('ROMFILE env var not set');
}


loadFile(romGamePath)
  .then((u06Rom) => {
    const romData = {
      u06: u06Rom,
    };
    const metaData = {
      features: ['wpcAlphanumeric'], //'securityPic', 'wpc95', 'wpcFliptronics', 'wpcDmd', 'wpcSecure', 'wpcAlphanumeric'
      fileName: romGamePath,
      skipWpcRomCheck: true,
    };
    return Emulator.initVMwithRom(romData, metaData);
  })
  .then((wpcSystem) => {
    console.log('WPC System initialized');
    wpcSystem.start();

    const bootSeconds = 8;
    wpcSystem.executeCycle(34482*50*bootSeconds, 16);
    wpcSystem.reset();
    wpcSystem.executeCycle(34482*50*2, 16);

    console.log('------- apply dumped data');
    let nanosecond_tick_counter = 0;
    for (let n = 0; n < dumpSize-4; n+=4) {
      const triggerIrq = applyDumpData(wpcSystem, buffer.readUint32LE(n), n);
      nanosecond_tick_counter += 100;

      //CPU IRQ is called 976 times/s, that a IRQ call each 1025us
      /*if (nanosecond_tick_counter > 1025) {
        wpcSystem.cpuBoard.cpu.irq();
        nanosecond_tick_counter -= 1025;
      }*/
      if (triggerIrq) {
        console.log('IRQ TRIGGERED', n);
        wpcSystem.cpuBoard.cpu.irq();
      }

      //convert 100us to ticks, The CPU execute 2 cycles per us
      const singleTicks = 200;
      wpcSystem.cpuBoard.displayBoard.executeCycle(singleTicks);
      wpcSystem.cpuBoard.asic.executeCycle(singleTicks);



    }

  })
  .catch((error) => {
    console.log('EXCEPTION!', error.message);
    console.log(error.stack);
  });
