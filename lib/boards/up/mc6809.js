//source: https://github.com/naughton/mc6809

/* Instruction timing for single-byte opcodes */
var c6809Cycles = [
    6, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 0, 6, 6, 3, 6,
    0, 0, 2, 4, 0, 0, 5, 9, 0, 2, 3, 0, 3, 2, 8, 6,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 5, 5, 5, 5, 0, 5, 3, 6, 9, 11, 0, 19,
    2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2,
    2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2,
    6, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 0, 6, 6, 3, 6,
    7, 0, 0, 7, 7, 0, 7, 7, 7, 7, 7, 0, 7, 7, 4, 7,
    2, 2, 2, 4, 2, 2, 2, 0, 2, 2, 2, 2, 4, 7, 3, 0,
    4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 7, 5, 5,
    4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 7, 5, 5,
    5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 7, 8, 6, 6,
    2, 2, 2, 4, 2, 2, 2, 0, 2, 2, 2, 2, 3, 0, 3, 0,
    4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5,
    4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5,
    5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6
];

/* Instruction timing for the two-byte opcodes */
var c6809Cycles2 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 4, 0,
    0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 6, 6,
    0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 6, 6,
    0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 7, 7,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7
];

/* Pending interrupt bits */
var INT_NMI = 1;
var INT_FIRQ = 2;
var INT_IRQ = 4;

function makeSignedByte(x) {
    return x << 24 >> 24;
}

function makeSignedWord(x) {
    return x << 16 >> 16;
}

function SET_V8(a, b, r) {
    // TODO: might need to mask & 0xff each param.
    return (((a ^ b ^ r ^ (r >> 1)) & 0x80) >> 6);
}

function SET_V16(a, b, r) {
    // TODO: might need to mask & 0xffff each param.
    return (((a ^ b ^ r ^ (r >> 1)) & 0x8000) >> 14);
}

module.exports = {
  getInstance,
};

function getInstance(memoryWriteFunction, memoryReadFunction) {
  return new Cpu6809(memoryWriteFunction, memoryReadFunction);
}

class Cpu6809 {
  constructor(memoryWriteFunction, memoryReadFunction) {
    this.M6809WriteByte = memoryWriteFunction;
    this.M6809ReadByte = memoryReadFunction;
    this.pcCount = 0;
  //  this.counts = {};
  //  this.inorder = [];
    this.iClocks = 0;
  //  this.debug = false;
    this.halted = false;
    this.tickCount = 0;
    this.regCC = 0;
    this.irqCount = 0;
    this.firqCount = 0;
    this.nmiCount = 0;
    this.missedIRQ = 0;
    this.interruptRequest = 0;
    this.missedFIRQ = 0;
    this.instructions11 = [];
    this.mnemonics11 = [];
    this.instructions10 = [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, this.lbrn, this.lbhi, this.lbls, this.lbcc, this.lbcs, this.lbne, this.lbeq,
        this.lbvc, this.lbvs, this.lbpl, this.lbmi, this.lbge, this.lblt, this.lbgt, this.lble,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, this.swi2,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, this.cmpd, null, null, null, null,
        null, null, null, null, this.cmpy, null, this.ldy, null,
        null, null, null, this.cmpdd, null, null, null, null,
        null, null, null, null, this.cmpyd, null, this.ldyd, this.sty,
        null, null, null, this.cmpdi, null, null, null, null,
        null, null, null, null, this.cmpyi, null, this.ldyi, this.styi,
        null, null, null, this.cmpde, null, null, null, null,
        null, null, null, null, this.cmpye, null, this.ldye, this.stye,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, this.lds, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, this.ldsd, this.stsd,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, this.ldsi, this.stsi,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, this.ldse, this.stse
    ];
    this.mnemonics10 = [
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', 'lbrn ', 'lbhi ', 'lbls ', 'lbcc ', 'lbcs ', 'lbne ', 'lbeq ',
        'lbvc ', 'lbvs ', 'lbpl ', 'lbmi ', 'lbge ', 'lblt ', 'lbgt ', 'lble ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', 'swi2 ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', 'cmpd ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', 'cmpy ', '     ', 'ldy  ', '     ',
        '     ', '     ', '     ', 'cmpdd', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', 'cmpyd', '     ', 'ldyd ', 'sty  ',
        '     ', '     ', '     ', 'cmpdi', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', 'cmpyi', '     ', 'ldyi ', 'styi ',
        '     ', '     ', '     ', 'cmpde', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', 'cmpye', '     ', 'ldye ', 'stye ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', 'lds  ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', 'ldsd ', 'stsd ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', 'ldsi ', 'stsi ',
        '     ', '     ', '     ', '     ', '     ', '     ', '     ', '     ',
        '     ', '     ', '     ', '     ', '     ', '     ', 'ldse ', 'stse '
    ];
    this.instructions = [
        this.neg, null, null, this.com, this.lsr, null, this.ror, this.asr,
        this.asl, this.rol, this.dec, null, this.inc, this.tst, this.jmp, this.clr,
        this.p10, this.p11, this.nop, this.sync, null, null, this.lbra, this.lbsr,
        null, this.daa, this.orcc, null, this.andcc, this.sex, this.exg, this.tfr,
        this.bra, this.brn, this.bhi, this.bls, this.bcc, this.bcs, this.bne, this.beq,
        this.bvc, this.bvs, this.bpl, this.bmi, this.bge, this.blt, this.bgt, this.ble,
        this.leax, this.leay, this.leas, this.leau, this.pshs, this.puls, this.pshu, this.pulu,
        null, this.rts, this.abx, this.rti, this.cwai, this.mul, null, this.swi,
        this.nega, null, null, this.coma, this.lsra, null, this.rora, this.asra,
        this.asla, this.rola, this.deca, null, this.inca, this.tsta, null, this.clra,
        this.negb, null, null, this.comb, this.lsrb, null, this.rorb, this.asrb,
        this.aslb, this.rolb, this.decb, null, this.incb, this.tstb, null, this.clrb,
        this.negi, null, null, this.comi, this.lsri, null, this.rori, this.asri,
        this.asli, this.roli, this.deci, null, this.inci, this.tsti, this.jmpi, this.clri,
        this.nege, null, null, this.come, this.lsre, null, this.rore, this.asre,
        this.asle, this.role, this.dece, null, this.ince, this.tste, this.jmpe, this.clre,
        this.suba, this.cmpa, this.sbca, this.subd, this.anda, this.bita, this.lda, null,
        this.eora, this.adca, this.ora, this.adda, this.cmpx, this.bsr, this.ldx, null,
        this.subad, this.cmpad, this.sbcad, this.subdd, this.andad, this.bitad, this.ldad, this.stad,
        this.eorad, this.adcad, this.orad, this.addad, this.cmpxd, this.jsrd, this.ldxd, this.stxd,
        this.subax, this.cmpax, this.sbcax, this.subdx, this.andax, this.bitax, this.ldax, this.stax,
        this.eorax, this.adcax, this.orax, this.addax, this.cmpxx, this.jsrx, this.ldxx, this.stxx,
        this.subae, this.cmpae, this.sbcae, this.subde, this.andae, this.bitae, this.ldae, this.stae,
        this.eorae, this.adcae, this.orae, this.addae, this.cmpxe, this.jsre, this.ldxe, this.stxe,
        this.subb, this.cmpb, this.sbcb, this.addd, this.andb, this.bitb, this.ldb, this.eorb,
        this.eorb, this.adcb, this.orb, this.addb, this.ldd, null, this.ldu, null,
        this.sbbd, this.cmpbd, this.sbcd, this.adddd, this.andbd, this.bitbd, this.ldbd, this.stbd,
        this.eorbd, this.adcbd, this.orbd, this.addbd, this.lddd, this.stdd, this.ldud, this.stud,
        this.subbx, this.cmpbx, this.sbcbx, this.adddx, this.andbx, this.bitbx, this.ldbx, this.stbx,
        this.eorbx, this.adcbx, this.orbx, this.addbx, this.lddx, this.stdx, this.ldux, this.stux,
        this.subbe, this.cmpbe, this.sbcbe, this.addde, this.andbe, this.bitbe, this.ldbe, this.stbe,
        this.eorbe, this.adcbe, this.orbe, this.addbe, this.ldde, this.stde, this.ldue, this.stue
    ];
    this.mnemonics = [
        'neg  ', '     ', '     ', 'com  ', 'lsr  ', '     ', 'ror  ', 'asr  ',
        'asl  ', 'rol  ', 'dec  ', '     ', 'inc  ', 'tst  ', 'jmp  ', 'clr  ',
        'p10  ', 'p11  ', 'nop  ', 'sync ', '     ', '     ', 'lbra ', 'lbsr ',
        '     ', 'daa  ', 'orcc ', '     ', 'andcc', 'sex  ', 'exg  ', 'tfr  ',
        'bra  ', 'brn  ', 'bhi  ', 'bls  ', 'bcc  ', 'bcs  ', 'bne  ', 'beq  ',
        'bvc  ', 'bvs  ', 'bpl  ', 'bmi  ', 'bge  ', 'blt  ', 'bgt  ', 'ble  ',
        'leax ', 'leay ', 'leas ', 'leau ', 'pshs ', 'puls ', 'pshu ', 'pulu ',
        '     ', 'rts  ', 'abx  ', 'rti  ', 'cwai ', 'mul  ', '     ', 'swi  ',
        'nega ', '     ', '     ', 'coma ', 'lsra ', '     ', 'rora ', 'asra ',
        'asla ', 'rola ', 'deca ', '     ', 'inca ', 'tsta ', '     ', 'clra ',
        'negb ', '     ', '     ', 'comb ', 'lsrb ', '     ', 'rorb ', 'asrb ',
        'aslb ', 'rolb ', 'decb ', '     ', 'incb ', 'tstb ', '     ', 'clrb ',
        'negi ', '     ', '     ', 'comi ', 'lsri ', '     ', 'rori ', 'asri ',
        'asli ', 'roli ', 'deci ', '     ', 'inci ', 'tsti ', 'jmpi ', 'clri ',
        'nege ', '     ', '     ', 'come ', 'lsre ', '     ', 'rore ', 'asre ',
        'asle ', 'role ', 'dece ', '     ', 'ince ', 'tste ', 'jmpe ', 'clre ',
        'suba ', 'cmpa ', 'sbca ', 'subd ', 'anda ', 'bita ', 'lda  ', '     ',
        'eora ', 'adca ', 'ora  ', 'adda ', 'cmpx ', 'bsr  ', 'ldx  ', '     ',
        'subad', 'cmpad', 'sbcad', 'subdd', 'andad', 'bitad', 'ldad ', 'stad ',
        'eorad', 'adcad', 'orad ', 'addad', 'cmpxd', 'jsrd ', 'ldxd ', 'stxd ',
        'subax', 'cmpax', 'sbcax', 'subdx', 'andax', 'bitax', 'ldax ', 'stax ',
        'eorax', 'adcax', 'orax ', 'addax', 'cmpxx', 'jsrx ', 'ldxx ', 'stxx ',
        'subae', 'cmpae', 'sbcae', 'subde', 'andae', 'bitae', 'ldae ', 'stae ',
        'eorae', 'adcae', 'orae ', 'addae', 'cmpxe', 'jsre ', 'ldxe ', 'stxe ',
        'subb ', 'cmpb ', 'sbcb ', 'addd ', 'andb ', 'bitb ', 'ldb  ', 'eorb ',
        'eorb ', 'adcb ', 'orb  ', 'addb ', 'ldd  ', '     ', 'ldu  ', '     ',
        'sbbd ', 'cmpbd', 'sbcd ', 'adddd', 'andbd', 'bitbd', 'ldbd ', 'stbd ',
        'eorbd', 'adcbd', 'orbd ', 'addbd', 'lddd ', 'stdd ', 'ldud ', 'stud ',
        'subbx', 'cmpbx', 'sbcbx', 'adddx', 'andbx', 'bitbx', 'ldbx ', 'stbx ',
        'eorbx', 'adcbx', 'orbx ', 'addbx', 'lddx ', 'stdx ', 'ldux ', 'stux ',
        'subbe', 'cmpbe', 'sbcbe', 'addde', 'andbe', 'bitbe', 'ldbe ', 'stbe ',
        'eorbe', 'adcbe', 'orbe ', 'addbe', 'ldde ', 'stde ', 'ldue ', 'stue '
    ];
    this.init11();
  }

  getRegD() {
      return 0xffff & (this.regA << 8 | this.regB & 0xff);
  }
  setRegD(value) {
      this.regB = value & 0xff;
      this.regA = (value >> 8) & 0xff;
  }

  hex(v, width) {
                var s = v.toString(16);
                if (!width)
                    width = 2;
                while (s.length < width) {
                    s = '0' + s;
                }
                return s;
  }
  stateToString() {
      return 'pc:' + this.hex(this.regPC, 4) + ' s:' + this.hex(this.regS, 4) + ' u:' + this.hex(this.regU, 4) + ' x:' + this.hex(this.regX, 4) + ' y:' + this.hex(this.regY, 4) + ' a:' + this.hex(this.regA, 2) + ' b:' + this.hex(this.regB, 2) + ' d:' + this.hex(this.getRegD(), 4) + ' dp:' + this.hex(this.regDP, 2) + ' cc:' + this.flagsToString();
  }
  nextOp() {
      var pc = this.regPC;

      var nextop = this.M6809ReadByte(pc);
      var mn = this.mnemonics;
      if (nextop == 0x10) {
          mn = this.mnemonics10;
          nextop = this.M6809ReadByte(++pc);
      } else if (nextop == 0x11) {
          mn = this.mnemonics11;
          nextop = this.M6809ReadByte(++pc);
      }
      return mn[nextop];
  }
  state() {
      var pc = this.regPC;

      var nextop = this.M6809ReadByte(pc);
      var mn = this.mnemonics;
      if (nextop == 0x10) {
          mn = this.mnemonics10;
          nextop = this.M6809ReadByte(++pc);
      } else if (nextop == 0x11) {
          mn = this.mnemonics11;
          nextop = this.M6809ReadByte(++pc);
      }

      var ret = this.hex(pc, 4) + ' ' + mn[nextop] + ' ' + this.hex(this.readByteROM(pc + 1), 2) + ' ' + this.hex(this.readByteROM(pc + 2), 2) + ' ';

      ret += ' s:' + this.hex(this.regS, 4) + ' u:' + this.hex(this.regU, 4) + ' x:' + this.hex(this.regX, 4) + ' y:' + this.hex(this.regY, 4) + ' a:' + this.hex(this.regA, 2) + ' b:' + this.hex(this.regB, 2) + ' d:' + this.hex(this.getRegD(), 4) + ' dp:' + this.hex(this.regDP, 2) + ' cc:' + this.flagsToString() + '  [' + this.pcCount + ']';

      return ret;
  }
  flagsToString() {
      return ((this.regCC & 8 /* NEGATIVE */) ? 'N' : '-') + ((this.regCC & 4 /* ZERO */) ? 'Z' : '-') + ((this.regCC & 1 /* CARRY */) ? 'C' : '-') + ((this.regCC & 16 /* IRQMASK */) ? 'I' : '-') + ((this.regCC & 32 /* HALFCARRY */) ? 'H' : '-') + ((this.regCC & 2 /* OVERFLOW */) ? 'V' : '-') + ((this.regCC & 64 /* FIRQMASK */) ? 'C' : '-') + ((this.regCC & 128 /* ENTIRE */) ? 'E' : '-');
  }
  execute(iClocks) {
    /*
    const preTicks = this.tickCount;
    while (ticks > 0) {
      ticks -= this.step();
    }
    return this.tickCount - preTicks;
*/
      this.iClocks = iClocks;

      while (this.iClocks > 0) {
          this.handleIRQ();

          var mn = this.nextOp();
/*          if (this.counts.hasOwnProperty(mn)) {
              this.counts[mn]++;
          } else {
              this.inorder.push(mn);
              this.counts[mn] = 1;
          }*/

          var ucOpcode = this.nextPCByte();
          this.iClocks -= c6809Cycles[ucOpcode]; /* Subtract execution time */
          if (this.debug)
              console.log((this.regPC - 1).toString(16) + ': ' + this.mnemonics[ucOpcode]);

          var instruction = this.instructions[ucOpcode];
          if (instruction == null) {
              console.log('*** illegal opcode: ' + ucOpcode.toString(16) + ' at ' + (this.regPC - 1).toString(16));
              this.iClocks = 0;
              this.halt();
          } else {
              instruction.bind(this)();
          }
      }
      const executed = iClocks - this.iClocks;
      this.tickCount += executed;
//      console.log('exec', {iClocks, iclk: this.iClocks, executed });
      return executed;
  }
  readByteROM(addr) {
    return this.M6809ReadByte(addr);
  }
  reset() {
      this.regX = 0;
      this.regY = 0;
      this.regU = 0;
      this.regS = 0;
      this.regA = 0;
      this.regB = 0;
      this.regDP = 0;
      this.regCC = 64 /* FIRQMASK */ | 16 /* IRQMASK */;
      this.regPC = 0;
      this.interruptRequest = 0;
      this._goto(this.M6809ReadWord(0xfffe));
//      this._goto((this.readByteROM(0xfffe) << 8) | this.readByteROM(0xffff));
  }
  setStackAddress(addr) {
      this.stackAddress = addr;
  }

  halt() {
      this.halted = true;
      this.iClocks = 0;
      console.log("halted.");
  }
  nextPCByte() {
      this.pcCount++;
      return this.M6809ReadByte(this.regPC++);
  }
  nextPCWord() {
      var word = this.M6809ReadWord(this.regPC);
      this.regPC += 2;
      this.pcCount += 2;
      return word;
  }
    M6809ReadWord(addr) {
        var hi = this.M6809ReadByte(addr);
        var lo = this.M6809ReadByte(addr + 1);
        return hi << 8 | lo;
    }
    M6809WriteWord(addr, usWord) {
        this.M6809WriteByte(addr, usWord >> 8);
        this.M6809WriteByte(addr + 1, usWord);
    }
    pushByte(ucByte, user) {
        var addr = user ? --this.regU : --this.regS;
        this.M6809WriteByte(addr, ucByte);
    }
    M6809PUSHBU(ucByte) {
        this.pushByte(ucByte, true);
    }
    M6809PUSHB(ucByte) {
        this.pushByte(ucByte, false);
    }
    M6809PUSHW(usWord) {
        // push lo byte first.
        this.M6809PUSHB(usWord);
        this.M6809PUSHB(usWord >> 8);
    }
    M6809PUSHWU(usWord) {
        // push lo byte first.
        this.M6809PUSHBU(usWord);
        this.M6809PUSHBU(usWord >> 8);
    }
    pullByte(user) {
        var addr = user ? this.regU : this.regS;
        var val = this.M6809ReadByte(addr);
        if (user)
            ++this.regU;
        else
            ++this.regS;
        return val;
    }
    M6809PULLB () {
        return this.pullByte(false);
    }
    M6809PULLBU  () {
        return this.pullByte(true);
    }
    M6809PULLW  () {
        var hi = this.M6809PULLB();
        var lo = this.M6809PULLB();
        return hi << 8 | lo;
    }
    M6809PULLWU  () {
        var hi = this.M6809PULLBU();
        var lo = this.M6809PULLBU();
        return hi << 8 | lo;
    }
    M6809PostByte  () {
        var pReg, usAddr, sTemp;
        var ucPostByte = this.nextPCByte();
        switch (ucPostByte & 0x60) {
            case 0:
                pReg = 'X';
                break;
            case 0x20:
                pReg = 'Y';
                break;
            case 0x40:
                pReg = 'U';
                break;
            case 0x60:
                pReg = 'S';
                break;
        }
        pReg = 'reg' + pReg;

        if ((ucPostByte & 0x80) == 0) {
            /* Just a 5 bit signed offset + register */
            var sByte = ucPostByte & 0x1f;
            if (sByte > 15)
                sByte -= 32;
            this.iClocks -= 1;
            return this[pReg] + sByte;
        }

        switch (ucPostByte & 0xf) {
            case 0:
                usAddr = this[pReg];
                this[pReg] += 1;
                this.iClocks -= 2;
                break;
            case 1:
                usAddr = this[pReg];
                this[pReg] += 2;
                this.iClocks -= 3;
                break;
            case 2:
                this[pReg] -= 1;
                usAddr = this[pReg];
                this.iClocks -= 2;
                break;
            case 3:
                this[pReg] -= 2;
                usAddr = this[pReg];
                this.iClocks -= 3;
                break;
            case 4:
                usAddr = this[pReg];
                break;
            case 5:
                usAddr = this[pReg] + makeSignedByte(this.regB);
                this.iClocks -= 1;
                break;
            case 6:
                usAddr = this[pReg] + makeSignedByte(this.regA);
                this.iClocks -= 1;
                break;
            case 7:
                console.log('illegal postbyte pattern 7 at ' + (this.regPC - 1).toString(16));
                this.halt();
                usAddr = 0;
                break;
            case 8:
                usAddr = this[pReg] + makeSignedByte(this.nextPCByte());
                this.iClocks -= 1;
                break;
            case 9:
                usAddr = this[pReg] + makeSignedWord(this.nextPCWord());
                this.iClocks -= 4;
                break;
            case 0xA:
                console.log('illegal postbyte pattern 0xA' + (this.regPC - 1).toString(16));
                this.halt();
                usAddr = 0;
                break;
            case 0xB:
                this.iClocks -= 4;
                usAddr = this[pReg] + this.getRegD();
                break;
            case 0xC:
                sTemp = makeSignedByte(this.nextPCByte());
                usAddr = this.regPC + sTemp;
                this.iClocks -= 1;
                break;
            case 0xD:
                sTemp = makeSignedWord(this.nextPCWord());
                usAddr = this.regPC + sTemp;
                this.iClocks -= 5;
                break;
            case 0xE:
                console.log('illegal postbyte pattern 0xE' + (this.regPC - 1).toString(16));
                this.halt();
                usAddr = 0;
                break;
            case 0xF:
                this.iClocks -= 5;
                usAddr = this.nextPCWord();
                break;
        }

        if (ucPostByte & 0x10) {
            usAddr = this.M6809ReadWord(usAddr & 0xffff);
            this.iClocks -= 3;
        }
        return usAddr & 0xffff;
    }
            M6809PSHS  (ucTemp) {
                var i = 0;

                if (ucTemp & 0x80) {
                    this.M6809PUSHW(this.regPC);
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    this.M6809PUSHW(this.regU);
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    this.M6809PUSHW(this.regY);
                    i += 2;
                }
                if (ucTemp & 0x10) {
                    this.M6809PUSHW(this.regX);
                    i += 2;
                }
                if (ucTemp & 0x8) {
                    this.M6809PUSHB(this.regDP);
                    i++;
                }
                if (ucTemp & 0x4) {
                    this.M6809PUSHB(this.regB);
                    i++;
                }
                if (ucTemp & 0x2) {
                    this.M6809PUSHB(this.regA);
                    i++;
                }
                if (ucTemp & 0x1) {
                    this.M6809PUSHB(this.regCC);
                    i++;
                }
                this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            }
            M6809PSHU  (ucTemp) {
                var i = 0;

                if (ucTemp & 0x80) {
                    this.M6809PUSHWU(this.regPC);
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    this.M6809PUSHWU(this.regU);
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    this.M6809PUSHWU(this.regY);
                    i += 2;
                }
                if (ucTemp & 0x10) {
                    this.M6809PUSHWU(this.regX);
                    i += 2;
                }
                if (ucTemp & 0x8) {
                    this.M6809PUSHBU(this.regDP);
                    i++;
                }
                if (ucTemp & 0x4) {
                    this.M6809PUSHBU(this.regB);
                    i++;
                }
                if (ucTemp & 0x2) {
                    this.M6809PUSHBU(this.regA);
                    i++;
                }
                if (ucTemp & 0x1) {
                    this.M6809PUSHBU(this.regCC);
                    i++;
                }
                this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            }
            M6809PULS  (ucTemp) {
                var i = 0;
                if (ucTemp & 0x1) {
                    this.regCC = this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x2) {
                    this.regA = this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x4) {
                    this.regB = this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x8) {
                    this.regDP = this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x10) {
                    this.regX = this.M6809PULLW();
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    this.regY = this.M6809PULLW();
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    this.regU = this.M6809PULLW();
                    i += 2;
                }
                if (ucTemp & 0x80) {
                    this._goto(this.M6809PULLW());
                    i += 2;
                }
                this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            }
            M6809PULU  (ucTemp) {
                var i = 0;
                if (ucTemp & 0x1) {
                    this.regCC = this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x2) {
                    this.regA = this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x4) {
                    this.regB = this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x8) {
                    this.regDP = this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x10) {
                    this.regX = this.M6809PULLWU();
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    this.regY = this.M6809PULLWU();
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    this.regS = this.M6809PULLWU();
                    i += 2;
                }
                if (ucTemp & 0x80) {
                    this._goto(this.M6809PULLWU());
                    i += 2;
                }
                this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            }
            irq() {
              if (this.interruptRequest & INT_IRQ) {
                this.missedIRQ++;
              }
              this.interruptRequest = this.interruptRequest | INT_IRQ;
            }
            firq() {
              if (this.interruptRequest & INT_FIRQ) {
                this.missedFIRQ++;
              }
              this.interruptRequest = this.interruptRequest | INT_FIRQ;
            }
            clearIrqMasking () {
              console.log('clear irq');
              // clear F_IRQMASK flag
              this.regCC &= ~16;
            }
            clearFirqMasking () {
              console.log('clear Firq');
              // clear F_FIRQMASK flag
              this.regCC &= ~64;
            }

            handleIRQ() {
                /* NMI is highest priority */
                if (this.interruptRequest & INT_NMI) {
                  this.nmiCount++;
                    console.log("taking NMI!!!!", interruptRequest);
                    this.M6809PUSHW(this.regPC);
                    this.M6809PUSHW(this.regU);
                    this.M6809PUSHW(this.regY);
                    this.M6809PUSHW(this.regX);
                    this.M6809PUSHB(this.regDP);
                    this.M6809PUSHB(this.regB);
                    this.M6809PUSHB(this.regA);
                    this.regCC |= 0x80; /* Set bit indicating machine state on stack */
                    this.M6809PUSHB(this.regCC);
                    this.regCC |= 64 /* FIRQMASK */ | 16 /* IRQMASK */; /* Mask interrupts during service routine */
                    this.iClocks -= 19;
                    this._goto(this.M6809ReadWord(0xfffc));
                    this.interruptRequest &= ~INT_NMI; /* clear this bit */
                    console.log(this.state());
                    return;
                }

                /* Fast IRQ is next priority */
                if (this.interruptRequest & INT_FIRQ && (this.regCC & 64 /* FIRQMASK */) === 0) {
                    this.firqCount++;
                    console.log("taking FIRQ!!!!");
                    this.M6809PUSHW(this.regPC);
                    this.regCC &= 0x7f; /* Clear bit indicating machine state on stack */
                    this.M6809PUSHB(this.regCC);
                    this.interruptRequest &= ~INT_FIRQ; /* clear this bit */
                    this.regCC |= 64 /* FIRQMASK */ | 16 /* IRQMASK */; /* Mask interrupts during service routine */
                    this.iClocks -= 10;
                    this._goto(this.M6809ReadWord(0xfff6));
                    //console.log(this.state());
                    return;
                }

                /* IRQ is lowest priority */
                if (this.interruptRequest & INT_IRQ && (this.regCC & 16 /* IRQMASK */) === 0) {
                    this.irqCount++;
                    console.log("taking IRQ!!!!");
                    this.M6809PUSHW(this.regPC);
                    this.M6809PUSHW(this.regU);
                    this.M6809PUSHW(this.regY);
                    this.M6809PUSHW(this.regX);
                    this.M6809PUSHB(this.regDP);
                    this.M6809PUSHB(this.regB);
                    this.M6809PUSHB(this.regA);
                    this.regCC |= 0x80; /* Set bit indicating machine state on stack */
                    this.M6809PUSHB(this.regCC);
                    this.regCC |= 16 /* IRQMASK */; /* Mask interrupts during service routine */
                    this._goto(this.M6809ReadWord(0xfff8));
                    this.interruptRequest &= ~INT_IRQ; /* clear this bit */
                    this.iClocks -= 19;
                    //console.log(this.state());
                    return;
                }
            }
            toggleDebug() {
                this.debug = !this.debug;
                console.log("debug " + this.debug);
            }
            _goto(usAddr) {
/*                if (usAddr == 0xFFB3) {
                    console.log("PC from " + this.regPC.toString(16) + " -> " + usAddr.toString(16));
                    if (this.getRegD() > 0x9800) {
                        console.log('off screen??? ' + this.getRegD().toString(16));
                    }
                }*/
                this.regPC = usAddr;
            }
            _flagnz(val) {
                if ((val & 0xff) == 0)
                    this.regCC |= 4 /* ZERO */;
                else if (val & 0x80)
                    this.regCC |= 8 /* NEGATIVE */;
            }
            _flagnz16  (val) {
                if ((val & 0xffff) == 0)
                    this.regCC |= 4 /* ZERO */;
                else if (val & 0x8000)
                    this.regCC |= 8 /* NEGATIVE */;
            }
            _neg(val) {
                this.regCC &= ~(1 /* CARRY */ | 4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                if (val == 0x80)
                    this.regCC |= 2 /* OVERFLOW */;
                val = ~val + 1;
                val &= 0xff;
                this._flagnz(val);
                if (this.regCC & 8 /* NEGATIVE */)
                    this.regCC |= 1 /* CARRY */;
                return val;
            }
            _com(val) {
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this.regCC |= 1 /* CARRY */;
                val = ~val;
                val &= 0xff;
                this._flagnz(val);
                return val;
            }
            _lsr(val) {
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                if (val & 1)
                    this.regCC |= 1 /* CARRY */;
                val >>= 1;
                val &= 0xff;
                if (val == 0)
                    this.regCC |= 4 /* ZERO */;
                return val;
            }
            _ror(val) {
                var oldc = this.regCC & 1 /* CARRY */;
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                if (val & 1)
                    this.regCC |= 1 /* CARRY */;
                val = val >> 1 | oldc << 7;
                val &= 0xff;
                this._flagnz(val);
                return val;
            }
            _asr(val) {
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                if (val & 1)
                    this.regCC |= 1 /* CARRY */;
                val = val & 0x80 | val >> 1;
                val &= 0xff;
                this._flagnz(val);
                return val;
            }
            _asl(val) {
                var oldval = val;
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                if (val & 0x80)
                    this.regCC |= 1 /* CARRY */;
                val <<= 1;
                val &= 0xff;
                this._flagnz(val);
                if ((oldval ^ val) & 0x80)
                    this.regCC |= 2 /* OVERFLOW */;
                return val;
            }
            _rol(val) {
                var oldval = val;
                var oldc = this.regCC & 1 /* CARRY */;
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                if (val & 0x80)
                    this.regCC |= 1 /* CARRY */;
                val = val << 1 | oldc;
                val &= 0xff;
                this._flagnz(val);
                if ((oldval ^ val) & 0x80)
                    this.regCC |= 2 /* OVERFLOW */;
                return val;
            }
            _dec(val) {
                val--;
                val &= 0xff;
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(val);
                if (val == 0x7f || val == 0xff)
                    this.regCC |= 2 /* OVERFLOW */;
                return val;
            }
            _inc(val) {
                val++;
                val &= 0xff;
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(val);
                if (val == 0x80 || val == 0)
                    this.regCC |= 2 /* OVERFLOW */;
                return val;
            }
            _tst(val) {
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(val);
                return val;
            }
            _clr(addr) {
                this.M6809WriteByte(addr, 0);

                /* clear N,V,C, set Z */
                this.regCC &= ~(1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this.regCC |= 4 /* ZERO */;
            }
            _or(ucByte1, ucByte2) {
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                var ucTemp = ucByte1 | ucByte2;
                this._flagnz(ucTemp);
                return ucTemp;
            }
            _eor(ucByte1, ucByte2) {
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                var ucTemp = ucByte1 ^ ucByte2;
                this._flagnz(ucTemp);
                return ucTemp;
            }
            _and(ucByte1, ucByte2) {
                this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                var ucTemp = ucByte1 & ucByte2;
                this._flagnz(ucTemp);
                return ucTemp;
            }
            _cmp(ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) - (ucByte2 & 0xff);
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(sTemp);
                if (sTemp & 0x100)
                    this.regCC |= 1 /* CARRY */;
                this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
            }
            _setcc16  (usWord1, usWord2, lTemp) {
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz16(lTemp);
                if (lTemp & 0x10000)
                    this.regCC |= 1 /* CARRY */;
                this.regCC |= SET_V16(usWord1 & 0xffff, usWord2 & 0xffff, lTemp & 0x1ffff);
            }
            _cmp16  (usWord1, usWord2) {
                var lTemp = (usWord1 & 0xffff) - (usWord2 & 0xffff);
                this._setcc16(usWord1, usWord2, lTemp);
            }
            _sub(ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) - (ucByte2 & 0xff);
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(sTemp);
                if (sTemp & 0x100)
                    this.regCC |= 1 /* CARRY */;
                this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                return sTemp & 0xff;
            }
            _sub16  (usWord1, usWord2) {
                var lTemp = (usWord1 & 0xffff) - (usWord2 & 0xffff);
                this._setcc16(usWord1, usWord2, lTemp);
                return lTemp & 0xffff;
            }
            _sbc(ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) - (ucByte2 & 0xff) - (this.regCC & 1);
                this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(sTemp);
                if (sTemp & 0x100)
                    this.regCC |= 1 /* CARRY */;
                this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                return sTemp & 0xff;
            }
            _add(ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) + (ucByte2 & 0xff);
                this.regCC &= ~(32 /* HALFCARRY */ | 4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(sTemp);
                if (sTemp & 0x100)
                    this.regCC |= 1 /* CARRY */;
                this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                if ((sTemp ^ ucByte1 ^ ucByte2) & 0x10)
                    this.regCC |= 32 /* HALFCARRY */;
                return sTemp & 0xff;
            }
            _add16  (usWord1, usWord2) {
                var lTemp = (usWord1 & 0xffff) + (usWord2 & 0xffff);
                this._setcc16(usWord1, usWord2, lTemp);
                return lTemp & 0xffff;
            }
            _adc(ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) + (ucByte2 & 0xff) + (this.regCC & 1);
                this.regCC &= ~(32 /* HALFCARRY */ | 4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this._flagnz(sTemp);
                if (sTemp & 0x100)
                    this.regCC |= 1 /* CARRY */;
                this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                if ((sTemp ^ ucByte1 ^ ucByte2) & 0x10)
                    this.regCC |= 32 /* HALFCARRY */;
                return sTemp & 0xff;
            }
            dpAddr() {
                return (this.regDP << 8) + this.nextPCByte();
            }
            dpOp(func) {
                var addr = this.dpAddr();
                var val = this.M6809ReadByte(addr);
                this.M6809WriteByte(addr, () => {func(val) });
            }
            /* direct page addressing */
            neg() {
                this.dpOp(this._neg);
            }
            com() {
                this.dpOp(this._com);
            }
            lsr() {
                this.dpOp(this._lsr);
            }
            ror() {
                this.dpOp(this._ror);
            }
            asr() {
                this.dpOp(this._asr);
            }
            asl() {
                this.dpOp(this._asl);
            }
            rol() {
                this.dpOp(this._rol);
            }
            dec() {
                this.dpOp(this._dec);
            }
            inc() {
                this.dpOp(this._inc);
            }
            tst() {
                this.dpOp(this._tst);
            }
            jmp() {
                this._goto(this.dpAddr());
            }
            clr() {
                this._clr(this.dpAddr());
            }
            /* P10  extended Op codes */
            lbrn() {
                this.regPC += 2;
            }
            lbhi() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!(this.regCC & (1 /* CARRY */ | 4 /* ZERO */))) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbls() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (this.regCC & (1 /* CARRY */ | 4 /* ZERO */)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbcc() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!(this.regCC & 1 /* CARRY */)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbcs() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (this.regCC & 1 /* CARRY */) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbne() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!(this.regCC & 4 /* ZERO */)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbeq() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (this.regCC & 4 /* ZERO */) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbvc() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!(this.regCC & 2 /* OVERFLOW */)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbvs() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (this.regCC & 2 /* OVERFLOW */) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbpl() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!(this.regCC & 8 /* NEGATIVE */)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbmi() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (this.regCC & 8 /* NEGATIVE */) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbge() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!((this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lblt() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if ((this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lbgt() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if (!((this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2 || this.regCC & 4 /* ZERO */)) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            lble() {
                var sTemp = makeSignedWord(this.nextPCWord());
                if ((this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2 || this.regCC & 4 /* ZERO */) {
                    this.iClocks -= 1; /* Extra clock if branch taken */
                    this.regPC += sTemp;
                }
            }
            swi2() {
                this.regCC |= 0x80; /* Entire machine state stacked */
                this.M6809PUSHW(this.regPC);
                this.M6809PUSHW(this.regU);
                this.M6809PUSHW(this.regY);
                this.M6809PUSHW(this.regX);
                this.M6809PUSHB(this.regDP);
                this.M6809PUSHB(this.regA);
                this.M6809PUSHB(this.regB);
                this.M6809PUSHB(this.regCC);
                this._goto(this.M6809ReadWord(0xfff4));
            }
            cmpd() {
                var usTemp = this.nextPCWord();
                this._cmp16(this.getRegD(), usTemp);
            }
            cmpy() {
                var usTemp = this.nextPCWord();
                this._cmp16(this.regY, usTemp);
            }
            ldy() {
                this.regY = this.nextPCWord();
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            cmpdd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.getRegD(), usTemp);
            }
            cmpyd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regY, usTemp);
            }
            ldyd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.regY = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            sty() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809WriteWord(usAddr, this.regY);
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            cmpdi() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.getRegD(), usTemp);
            }
            cmpyi() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regY, usTemp);
            }
            ldyi() {
                var usAddr = this.M6809PostByte();
                this.regY = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            styi() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteWord(usAddr, this.regY);
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            cmpde() {
                var usAddr = this.nextPCWord();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.getRegD(), usTemp);
            }
            cmpye() {
                var usAddr = this.nextPCWord();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regY, usTemp);
            }
            ldye() {
                var usAddr = this.nextPCWord();
                this.regY = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stye() {
                var usAddr = this.nextPCWord();
                this.M6809WriteWord(usAddr, this.regY);
                this._flagnz16(this.regY);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            lds() {
                this.regS = this.nextPCWord();
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldsd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.regS = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stsd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809WriteWord(usAddr, this.regS);
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldsi() {
                var usAddr = this.M6809PostByte();
                this.regS = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stsi() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteWord(usAddr, this.regS);
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldse() {
                var usAddr = this.nextPCWord();
                this.regS = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stse() {
                var usAddr = this.nextPCWord();
                this.M6809WriteWord(usAddr, this.regS);
                this._flagnz16(this.regS);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            p10() {
                var op = this.nextPCByte();
                this.iClocks -= c6809Cycles2[op]; /* Subtract execution time */
                if (this.debug)
                    console.log((this.regPC - 1).toString(16) + ': ' + this.mnemonics10[op]);
                var instruction = this.instructions10[op];
                if (instruction == null) {
                    console.log('*** illegal p10 opcode: ' + op.toString(16) + ' at ' + (this.regPC - 1).toString(16));
                    this.halt();
                } else {
//                    instruction();
                    instruction.bind(this)();
                }
            }

            /* P10 end */
            /* P11 start */
            swi3  () {
                this.regCC |= 0x80; /* Set entire flag to indicate whole machine state on stack */
                this.M6809PUSHW(this.regPC);
                this.M6809PUSHW(this.regU);
                this.M6809PUSHW(this.regY);
                this.M6809PUSHW(this.regX);
                this.M6809PUSHB(this.regDP);
                this.M6809PUSHB(this.regA);
                this.M6809PUSHB(this.regB);
                this.M6809PUSHB(this.regCC);
                this._goto(this.M6809ReadWord(0xfff2));
            }
            cmpu() {
                var usTemp = this.nextPCWord();
                this._cmp16(this.regU, usTemp);
            }
            cmps() {
                var usTemp = this.nextPCWord();
                this._cmp16(this.regS, usTemp);
            }
            cmpud() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regU, usTemp);
            }
            cmpsd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regS, usTemp);
            }
            cmpui() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regU, usTemp);
            }
            cmpsi() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regS, usTemp);
            }
            cmpue() {
                var usAddr = this.nextPCWord();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regU, usTemp);
            }
            cmpse() {
                var usAddr = this.nextPCWord();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regS, usTemp);
            }
            add11  (op, name) {
                this.instructions11[op] = this[name];
                this.mnemonics11[op] = name;
            }
            init11  () {
                for (var i = 0; i < 256; i++) {
                    this.instructions11[i] = null;
                    this.mnemonics11[i] = '     ';
                }

                [
                  { op: 0x3f, name: 'swi3' },
                  { op: 0x83, name: 'cmpu' },
                  { op: 0x8c, name: 'cmps' },
                  { op: 0x93, name: 'cmpud' },
                  { op: 0x9c, name: 'cmpsd' },
                  { op: 0xa3, name: 'cmpui' },
                  { op: 0xac, name: 'cmpsi' },
                  { op: 0xb3, name: 'cmpue' },
                  { op: 0xbc, name: 'cmpse' }
                ].forEach((i) => {
                    this.instructions11[i.op] = this[i.name];
                    this.mnemonics11[i.op] = i.name;
                });
            }
            p11() {
                var op = this.nextPCByte();
                this.iClocks -= c6809Cycles2[op]; /* Subtract execution time */
                if (this.debug)
                    console.log((this.regPC - 1).toString(16) + ': ' + this.mnemonics11[op]);
                var instruction = this.instructions11[op];
                if (instruction == null) {
                    console.log('*** illegal p11 opcode: ' + op.toString(16));
                    this.halt();
                } else {
//                    instruction();
                  instruction.bind(this)();
                }
            }
            /* p11 end */
            nop() {
            }
            sync() {
            }
            lbra() {
                /* LBRA - relative jump */
                var sTemp = makeSignedWord(this.nextPCWord());
                this.regPC += sTemp;
            }
            lbsr() {
                /* LBSR - relative call */
                var sTemp = makeSignedWord(this.nextPCWord());
                this.M6809PUSHW(this.regPC);
                this.regPC += sTemp;
            }
            daa() {
                var cf = 0;
                var msn = this.regA & 0xf0;
                var lsn = this.regA & 0x0f;
                if (lsn > 0x09 || this.regCC & 0x20)
                    cf |= 0x06;
                if (msn > 0x80 && lsn > 0x09)
                    cf |= 0x60;
                if (msn > 0x90 || this.regCC & 0x01)
                    cf |= 0x60;
                var usTemp = cf + this.regA;
                this.regCC &= ~(1 /* CARRY */ | 8 /* NEGATIVE */ | 4 /* ZERO */ | 2 /* OVERFLOW */);
                if (usTemp & 0x100)
                    this.regCC |= 1 /* CARRY */;
                this.regA = usTemp & 0xff;
                this._flagnz(this.regA);
            }
            orcc() {
              this.regCC |= this.nextPCByte();
            }
            andcc() {
                this.regCC &= this.nextPCByte();
            }
            sex() {
                this.regA = (this.regB & 0x80) ? 0xFF : 0x00;
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */);
                var d = this.getRegD();
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            _setreg(name, value) {
                // console.log(name + '=' + value.toString(16));
                if (name == 'D') {
                    this.setRegD(value);
                } else {
                  console.log('PRE', this["reg" + name]);
                    this["reg" + name] = value;
                    console.log('POST', this["reg" + name]);
                }
            }
            M6809TFREXG  (ucPostByte, bExchange) {
                var ucTemp = ucPostByte & 0x88;
                if (ucTemp == 0x80 || ucTemp == 0x08) {
                    console.log("**** M6809TFREXG problem...");
                    ucTemp = 0; /* PROBLEM! */
                }
                var srname, srcval;
                switch (ucPostByte & 0xf0) {
                    case 0x00:
                        srname = 'D';
                        srcval = this.getRegD();
                        break;
                    case 0x10:
                        srname = 'X';
                        srcval = this.regX;
                        break;
                    case 0x20:
                        srname = 'Y';
                        srcval = this.regY;
                        break;
                    case 0x30:
                        srname = 'U';
                        srcval = this.regU;
                        break;
                    case 0x40:
                        srname = 'S';
                        srcval = this.regS;
                        break;
                    case 0x50:
                        srname = 'PC';
                        srcval = this.regPC;
                        break;
                    case 0x80:
                        srname = 'A';
                        srcval = this.regA;
                        break;
                    case 0x90:
                        srname = 'B';
                        srcval = this.regB;
                        break;
                    case 0xA0:
                        srname = 'CC';
                        srcval = this.regCC;
                        break;
                    case 0xB0:
                        srname = 'DP';
                        srcval = this.regDP;
                        break;
                    default:
                        console.log("illegal src register in M6809TFREXG");
                        this.halt();
                        break;
                }

                switch (ucPostByte & 0xf) {
                    case 0x00:
                        // console.log('EXG dst: D=' + this.getRegD().toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.getRegD());
                        } else {
                          this.setRegD(srcval);
                        }
                        break;
                    case 0x1:
                        // console.log('EXG dst: X=' + this.regX.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regX);
                        } else {
                          this.regX = srcval;
                        }
                        break;
                    case 0x2:
                        // console.log('EXG dst: Y=' + this.regY.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regY);
                        } else {
                          this.regY = srcval;
                        }
                        break;
                    case 0x3:
                        // console.log('EXG dst: U=' + this.regU.toString(16));
                        if (bExchange) {
                          this._setreg(srname, this.regU);
                        } else {
                          this.regU = srcval;
                        }
                        break;
                    case 0x4:
                        // console.log('EXG dst: S=' + this.regS.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regS);
                        } else {
                          this.regS = srcval;
                        }
                        break;
                    case 0x5:
                        // console.log('EXG dst: PC=' + this.regPC.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regPC);
                        } else {
                          this._goto(srcval);
                        }
                        break;
                    case 0x8:
                        // console.log('EXG dst: A=' + this.regA.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regA);
                        } else {
                          this.regA = 0xff & srcval;
                        }
                        break;
                    case 0x9:
                        // console.log('EXG dst: B=' + this.regB.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regB);
                        } else {
                          this.regB = 0xff & srcval;
                        }
                        break;
                    case 0xA:
                        // console.log('EXG dst: CC=' + this.regCC.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regCC);
                        } else {
                          this.regCC = 0xff & srcval;
                        }
                        break;
                    case 0xB:
                        // console.log('EXG dst: DP=' + this.regDP.toString(16));
                        if (bExchange) {
                            this._setreg(srname, this.regDP);
                        } else {
                          this.regDP = srcval;
                        }
                        break;
                    default:
                        console.log("illegal dst register in M6809TFREXG");
                        this.halt();
                        break;
                }
            }
            exg() {
                var ucTemp = this.nextPCByte();
                this.M6809TFREXG(ucTemp, true);
            }
            tfr() {
                var ucTemp = this.nextPCByte();
                this.M6809TFREXG(ucTemp, false);
            }
            bra() {
                var offset = makeSignedByte(this.nextPCByte());
                this.regPC += offset;
            }
            brn() {
                this.regPC++; // never.
            }
            bhi() {
                var offset = makeSignedByte(this.nextPCByte());
                if (!(this.regCC & (1 /* CARRY */ | 4 /* ZERO */)))
                    this.regPC += offset;
            }
            bls() {
                var offset = makeSignedByte(this.nextPCByte());
                if (this.regCC & (1 /* CARRY */ | 4 /* ZERO */))
                    this.regPC += offset;
            }
            branchIf(go) {
                var offset = makeSignedByte(this.nextPCByte());
                if (go)
                    this.regPC += offset;
            }
            branch(flag, ifSet) {
                this.branchIf((this.regCC & flag) == (ifSet ? flag : 0));
            }
            bcc() {
                this.branch(1 /* CARRY */, false);
            }
            bcs() {
                this.branch(1 /* CARRY */, true);
            }
            bne() {
                this.branch(4 /* ZERO */, false);
            }
            beq() {
                this.branch(4 /* ZERO */, true);
            }
            bvc() {
                this.branch(2 /* OVERFLOW */, false);
            }
            bvs() {
                this.branch(2 /* OVERFLOW */, true);
            }
            bpl() {
                this.branch(8 /* NEGATIVE */, false);
            }
            bmi() {
                this.branch(8 /* NEGATIVE */, true);
            }
            bge() {
                var go = !((this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2);
                this.branchIf(go);
            }
            blt() {
                var go = (this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2;
                this.branchIf(go != 0);
            }
            bgt() {
                var bit = (this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2;
                var go = bit == 0 || (this.regCC & 4 /* ZERO */) != 0;
                this.branchIf(go);
            }
            ble() {
                var bit = (this.regCC & 8 /* NEGATIVE */) ^ (this.regCC & 2 /* OVERFLOW */) << 2;
                var go = bit != 0 || (this.regCC & 4 /* ZERO */) != 0;
                this.branchIf(go);
            }
            leax() {
                this.regX = this.M6809PostByte();
                this.regCC &= ~4 /* ZERO */;
                if (this.regX == 0)
                    this.regCC |= 4 /* ZERO */;
            }
            leay() {
                this.regY = this.M6809PostByte();
                this.regCC &= ~4 /* ZERO */;
                if (this.regY == 0)
                    this.regCC |= 4 /* ZERO */;
            }
            leas() {
                this.regS = this.M6809PostByte();
            }
            leau() {
                this.regU = this.M6809PostByte();
            }
            pshs() {
                var ucTemp = this.nextPCByte();
                this.M6809PSHS(ucTemp);
            }
            puls() {
                var ucTemp = this.nextPCByte();
                this.M6809PULS(ucTemp);
            }
            pshu() {
                var ucTemp = this.nextPCByte();
                this.M6809PSHU(ucTemp);
            }
            pulu() {
                var ucTemp = this.nextPCByte();
                this.M6809PULU(ucTemp);
            }
            rts() {
                this._goto(this.M6809PULLW());
            }
            abx() {
                this.regX += this.regB;
            }
            rti() {
                this.regCC = this.M6809PULLB();
                if (this.regCC & 0x80) {
                    this.iClocks -= 9;
                    this.regA = this.M6809PULLB();
                    this.regB = this.M6809PULLB();
                    this.regDP = this.M6809PULLB();
                    this.regX = this.M6809PULLW();
                    this.regY = this.M6809PULLW();
                    this.regU = this.M6809PULLW();
                }
                this._goto(this.M6809PULLW());
            }
            cwai() {
              console.log('cwai');
                this.regCC &= this.nextPCByte();
            }
            mul() {
                var usTemp = this.regA * this.regB;
                if (usTemp)
                    this.regCC &= ~4 /* ZERO */;
                else
                    this.regCC |= 4 /* ZERO */;
                if (usTemp & 0x80)
                    this.regCC |= 1 /* CARRY */;
                else
                    this.regCC &= ~1 /* CARRY */;
                this.setRegD(usTemp);
            }
            swi() {
              //console.log('swi', new Error('').stack);
                this.regCC |= 0x80; /* Indicate whole machine state is stacked */
                this.M6809PUSHW(this.regPC);
                this.M6809PUSHW(this.regU);
                this.M6809PUSHW(this.regY);
                this.M6809PUSHW(this.regX);
                this.M6809PUSHB(this.regDP);
                this.M6809PUSHB(this.regB);
                this.M6809PUSHB(this.regA);
                this.M6809PUSHB(this.regCC);
                this.regCC |= 0x50; /* Disable further interrupts */
                this._goto(this.M6809ReadWord(0xfffa));
            }
            nega() {
                this.regA = this._neg(this.regA);
            }
            coma() {
                this.regA = this._com(this.regA);
            }
            lsra() {
                this.regA = this._lsr(this.regA);
            }
            rora() {
                this.regA = this._ror(this.regA);
            }
            asra() {
                this.regA = this._asr(this.regA);
            }
            asla() {
                this.regA = this._asl(this.regA);
            }
            rola() {
                this.regA = this._rol(this.regA);
            }
            deca() {
                this.regA = this._dec(this.regA);
            }
            inca() {
                this.regA = this._inc(this.regA);
            }
            tsta() {
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            clra() {
                this.regA = 0;
                this.regCC &= ~(8 /* NEGATIVE */ | 2 /* OVERFLOW */ | 1 /* CARRY */);
                this.regCC |= 4 /* ZERO */;
            }
            negb() {
                this.regB = this._neg(this.regB);
            }
            comb() {
                this.regB = this._com(this.regB);
            }
            lsrb() {
                this.regB = this._lsr(this.regB);
            }
            rorb() {
                this.regB = this._ror(this.regB);
            }
            asrb() {
                this.regB = this._asr(this.regB);
            }
            aslb() {
                this.regB = this._asl(this.regB);
            }
            rolb() {
                this.regB = this._rol(this.regB);
            }
            decb() {
                this.regB = this._dec(this.regB);
            }
            incb() {
                this.regB = this._inc(this.regB);
            }
            tstb() {
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            clrb() {
                this.regB = 0;
                this.regCC &= ~(8 /* NEGATIVE */ | 2 /* OVERFLOW */ | 1 /* CARRY */);
                this.regCC |= 4 /* ZERO */;
            }
            negi() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._neg(ucTemp));
            }
            comi() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._com(ucTemp));
            }
            lsri() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._lsr(ucTemp));
            }
            rori() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._ror(ucTemp));
            }
            asri() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._asr(ucTemp));
            }
            asli() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._asl(ucTemp));
            }
            roli() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._rol(ucTemp));
            }
            deci() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._dec(ucTemp));
            }
            inci() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.M6809WriteByte(usAddr, this._inc(ucTemp));
            }
            tsti() {
                var usAddr = this.M6809PostByte();
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                var val = this.M6809ReadByte(usAddr);
                this._flagnz(val);
            }
            jmpi() {
                this._goto(this.M6809PostByte());
            }
            clri() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteByte(usAddr, 0);
                this.regCC &= ~(2 /* OVERFLOW */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                this.regCC |= 4 /* ZERO */;
            }
            nege() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._neg(this.M6809ReadByte(usAddr)));
            }
            come() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._com(this.M6809ReadByte(usAddr)));
            }
            lsre() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._lsr(this.M6809ReadByte(usAddr)));
            }
            rore() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._ror(this.M6809ReadByte(usAddr)));
            }
            asre() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._asr(this.M6809ReadByte(usAddr)));
            }
            asle() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._asl(this.M6809ReadByte(usAddr)));
            }
            role() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._rol(this.M6809ReadByte(usAddr)));
            }
            dece() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._dec(this.M6809ReadByte(usAddr)));
            }
            ince() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this._inc(this.M6809ReadByte(usAddr)));
            }
            tste() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(ucTemp);
            }
            jmpe() {
                this._goto(this.M6809ReadWord(this.regPC));
            }
            clre() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, 0);
                this.regCC &= ~(1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                this.regCC |= 4 /* ZERO */;
            }
            suba() {
                this.regA = this._sub(this.regA, this.nextPCByte());
            }
            cmpa() {
                var ucTemp = this.nextPCByte();
                this._cmp(this.regA, ucTemp);
            }
            sbca() {
                var ucTemp = this.nextPCByte();
                this.regA = this._sbc(this.regA, ucTemp);
            }
            subd() {
                var usTemp = this.nextPCWord();
                this.setRegD(this._sub16(this.getRegD(), usTemp));
            }
            anda() {
                var ucTemp = this.nextPCByte();
                this.regA = this._and(this.regA, ucTemp);
            }
            bita() {
                var ucTemp = this.nextPCByte();
                this._and(this.regA, ucTemp);
            }
            lda() {
                this.regA = this.nextPCByte();
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            eora() {
                var ucTemp = this.nextPCByte();
                this.regA = this._eor(this.regA, ucTemp);
            }
            adca() {
                var ucTemp = this.nextPCByte();
                this.regA = this._adc(this.regA, ucTemp);
            }
            ora() {
                var ucTemp = this.nextPCByte();
                this.regA = this._or(this.regA, ucTemp);
            }
            adda() {
                var ucTemp = this.nextPCByte();
                this.regA = this._add(this.regA, ucTemp);
            }
            cmpx() {
                var usTemp = this.nextPCWord();
                this._cmp16(this.regX, usTemp);
            }
            bsr() {
                var sTemp = makeSignedByte(this.nextPCByte());
                this.M6809PUSHW(this.regPC);
                this.regPC += sTemp;
            }
            ldx() {
                var usTemp = this.nextPCWord();
                this.regX = usTemp;
                this._flagnz16(usTemp);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            subad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._sub(this.regA, ucTemp);
            }
            cmpad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._cmp(this.regA, ucTemp);
            }
            sbcad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._sbc(this.regA, ucTemp);
            }
            subdd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this.setRegD(this._sub16(this.getRegD(), usTemp));
            }
            andad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._and(this.regA, ucTemp);
            }
            bitad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._and(this.regA, ucTemp);
            }
            ldad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.regA = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            stad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809WriteByte(usAddr, this.regA);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            eorad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._eor(this.regA, ucTemp);
            }
            adcad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._adc(this.regA, ucTemp);
            }
            orad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._or(this.regA, ucTemp);
            }
            addad() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._add(this.regA, ucTemp);
            }
            cmpxd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regX, usTemp);
            }
            jsrd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809PUSHW(this.regPC);
                this._goto(usAddr);
            }
            ldxd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.regX = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regX);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stxd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809WriteWord(usAddr, this.regX);
                this._flagnz16(this.regX);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            subax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._sub(this.regA, ucTemp);
            }
            cmpax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._cmp(this.regA, ucTemp);
            }
            sbcax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._sbc(this.regA, ucTemp);
            }
            subdx() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this.setRegD(this._sub16(this.getRegD(), usTemp));
            }
            andax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._and(this.regA, ucTemp);
            }
            bitax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._and(this.regA, ucTemp);
            }
            ldax() {
                var usAddr = this.M6809PostByte();
                this.regA = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            stax() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteByte(usAddr, this.regA);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            eorax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._eor(this.regA, ucTemp);
            }
            adcax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._adc(this.regA, ucTemp);
            }
            orax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._or(this.regA, ucTemp);
            }
            addax() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regA = this._add(this.regA, ucTemp);
            }
            cmpxx() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this._cmp16(this.regX, usTemp);
            }
            jsrx() {
                var usAddr = this.M6809PostByte();
                this.M6809PUSHW(this.regPC);
                this._goto(usAddr);
            }
            ldxx() {
                var usAddr = this.M6809PostByte();
                this.regX = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regX);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stxx() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteWord(usAddr, this.regX);
                this._flagnz16(this.regX);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            subae() {
                var usAddr = this.nextPCWord();
                this.regA = this._sub(this.regA, this.M6809ReadByte(usAddr));
            }
            cmpae() {
                var usAddr = this.nextPCWord();
                this._cmp(this.regA, this.M6809ReadByte(usAddr));
            }
            sbcae() {
                var usAddr = this.nextPCWord();
                this.regA = this._sbc(this.regA, this.M6809ReadByte(usAddr));
            }
            subde() {
                var usAddr = this.nextPCWord();
                this.setRegD(this._sub16(this.getRegD(), this.M6809ReadWord(usAddr)));
            }
            andae() {
                var usAddr = this.nextPCWord();
                this.regA = this._and(this.regA, this.M6809ReadByte(usAddr));
            }
            bitae() {
                var usAddr = this.nextPCWord();
                this._and(this.regA, this.M6809ReadByte(usAddr));
            }
            ldae() {
                var usAddr = this.nextPCWord();
                this.regA = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            stae() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this.regA);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regA);
            }
            eorae() {
                var usAddr = this.nextPCWord();
                this.regA = this._eor(this.regA, this.M6809ReadByte(usAddr));
            }
            adcae() {
                var usAddr = this.nextPCWord();
                this.regA = this._adc(this.regA, this.M6809ReadByte(usAddr));
            }
            orae() {
                var usAddr = this.nextPCWord();
                this.regA = this._or(this.regA, this.M6809ReadByte(usAddr));
            }
            addae() {
                var usAddr = this.nextPCWord();
                this.regA = this._add(this.regA, this.M6809ReadByte(usAddr));
            }
            cmpxe() {
                var usAddr = this.nextPCWord();
                this._cmp16(this.regX, this.M6809ReadWord(usAddr));
            }
            jsre() {
                var usAddr = this.nextPCWord();
                this.M6809PUSHW(this.regPC);
                this._goto(usAddr);
            }
            ldxe() {
                var usAddr = this.nextPCWord();
                this.regX = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regX);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stxe() {
                var usAddr = this.nextPCWord();
                this.M6809WriteWord(usAddr, this.regX);
                this._flagnz16(this.regX);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            subb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._sub(this.regB, ucTemp);
            }
            cmpb() {
                var ucTemp = this.nextPCByte();
                this._cmp(this.regB, ucTemp);
            }
            sbcb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._sbc(this.regB, ucTemp);
            }
            addd() {
                var usTemp = this.nextPCWord();
                this.setRegD(this._add16(this.getRegD(), usTemp));
            }
            andb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._and(this.regB, ucTemp);
            }
            bitb() {
                var ucTemp = this.nextPCByte();
                this._and(this.regB, ucTemp);
            }
            ldb() {
                this.regB = this.nextPCByte();
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            eorb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._eor(this.regB, ucTemp);
            }
            adcb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._adc(this.regB, ucTemp);
            }
            orb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._or(this.regB, ucTemp);
            }
            addb() {
                var ucTemp = this.nextPCByte();
                this.regB = this._add(this.regB, ucTemp);
            }
            ldd() {
                var d = this.nextPCWord();
                this.setRegD(d);
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldu() {
                this.regU = this.nextPCWord();
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            sbbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._sub(this.regB, ucTemp);
            }
            cmpbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._cmp(this.regB, ucTemp);
            }
            sbcd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._sbc(this.regB, ucTemp);
            }
            adddd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this.setRegD(this._add16(this.getRegD(), usTemp));
            }
            andbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._and(this.regB, ucTemp);
            }
            bitbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._and(this.regB, ucTemp);
            }
            ldbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.regB = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            stbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809WriteByte(usAddr, this.regB);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            eorbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._eor(this.regB, ucTemp);
            }
            adcbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._adc(this.regB, ucTemp);
            }
            orbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._or(this.regB, ucTemp);
            }
            addbd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._add(this.regB, ucTemp);
            }
            lddd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var d = this.M6809ReadWord(usAddr);
                this.setRegD(d);
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stdd() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                var d = this.getRegD();
                this.M6809WriteWord(usAddr, d);
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldud() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.regU = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stud() {
                var usAddr = this.regDP * 256 + this.nextPCByte();
                this.M6809WriteWord(usAddr, this.regU);
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            subbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._sub(this.regB, ucTemp);
            }
            cmpbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._cmp(this.regB, ucTemp);
            }
            sbcbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._sbc(this.regB, ucTemp);
            }
            adddx() {
                var usAddr = this.M6809PostByte();
                var usTemp = this.M6809ReadWord(usAddr);
                this.setRegD(this._add16(this.getRegD(), usTemp));
            }
            andbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._and(this.regB, ucTemp);
            }
            bitbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._and(this.regB, ucTemp);
            }
            ldbx() {
                var usAddr = this.M6809PostByte();
                this.regB = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            stbx() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteByte(usAddr, this.regB);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            eorbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._eor(this.regB, ucTemp);
            }
            adcbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._adc(this.regB, ucTemp);
            }
            orbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._or(this.regB, ucTemp);
            }
            addbx() {
                var usAddr = this.M6809PostByte();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._add(this.regB, ucTemp);
            }
            lddx() {
                var usAddr = this.M6809PostByte();
                var d = this.M6809ReadWord(usAddr);
                this.setRegD(d);
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stdx() {
                var usAddr = this.M6809PostByte();
                var d = this.getRegD();
                this.M6809WriteWord(usAddr, d);
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldux() {
                var usAddr = this.M6809PostByte();
                this.regU = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stux() {
                var usAddr = this.M6809PostByte();
                this.M6809WriteWord(usAddr, this.regU);
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            subbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._sub(this.regB, ucTemp);
            }
            cmpbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._cmp(this.regB, ucTemp);
            }
            sbcbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._sbc(this.regB, ucTemp);
            }
            addde() {
                var usAddr = this.nextPCWord();
                var usTemp = this.M6809ReadWord(usAddr);
                this.setRegD(this._add16(this.getRegD(), usTemp));
            }
            andbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._and(this.regB, ucTemp);
            }
            bitbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this._and(this.regB, ucTemp);
            }
            ldbe() {
                var usAddr = this.nextPCWord();
                this.regB = this.M6809ReadByte(usAddr);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            stbe() {
                var usAddr = this.nextPCWord();
                this.M6809WriteByte(usAddr, this.regB);
                this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                this._flagnz(this.regB);
            }
            eorbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._eor(this.regB, ucTemp);
            }
            adcbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._adc(this.regB, ucTemp);
            }
            orbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._or(this.regB, ucTemp);
            }
            addbe() {
                var usAddr = this.nextPCWord();
                var ucTemp = this.M6809ReadByte(usAddr);
                this.regB = this._add(this.regB, ucTemp);
            }
            ldde() {
                var usAddr = this.nextPCWord();
                var val = this.M6809ReadWord(usAddr);
                this.setRegD(val);
                this._flagnz16(val);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stde() {
                var usAddr = this.nextPCWord();
                var d = this.getRegD();
                this.M6809WriteWord(usAddr, d);
                this._flagnz16(d);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            ldue() {
                var usAddr = this.nextPCWord();
                this.regU = this.M6809ReadWord(usAddr);
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }
            stue() {
                var usAddr = this.nextPCWord();
                this.M6809WriteWord(usAddr, this.regU);
                this._flagnz16(this.regU);
                this.regCC &= ~2 /* OVERFLOW */;
            }

            status() {
              return {
                pc: this.regPC,
                sp: this.regS,
                u: this.regU,
                a: this.regA,
                b: this.regB,
                x: this.regX,
                y: this.regY,
                dp: this.regDP,
                flags: this.regCC,
                irqPendingNMI: this.irqPendingNMI,
                irqPendingFIRQ: this.irqPendingFIRQ,
                irqPendingIRQ: this.irqPendingIRQ,
                missedIRQ: this.missedIRQ,
                missedFIRQ: this.missedFIRQ,
                irqCount: this.irqCount,
                firqCount: this.firqCount,
                nmiCount: this.nmiCount,
              };
            }
        }
