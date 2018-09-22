//source: https://github.com/naughton/mc6809
/// <reference path="references.ts" />
var mc6809;
(function (mc6809) {
    var F;
    (function (F) {
        F[F["CARRY"] = 1] = "CARRY";
        F[F["OVERFLOW"] = 2] = "OVERFLOW";
        F[F["ZERO"] = 4] = "ZERO";
        F[F["NEGATIVE"] = 8] = "NEGATIVE";
        F[F["IRQMASK"] = 16] = "IRQMASK";
        F[F["HALFCARRY"] = 32] = "HALFCARRY";
        F[F["FIRQMASK"] = 64] = "FIRQMASK";
        F[F["ENTIRE"] = 128] = "ENTIRE";
    })(F || (F = {}));

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

    var MEM_ROM = 0x00000;
    var MEM_RAM = 0x10000;
    var MEM_FLAGS = 0x20000;

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

    var MemBlock = (function () {
        function MemBlock(start, len, read, write) {
            this.start = start;
            this.len = len;
            this.read = read;
            this.write = write;
        }
        return MemBlock;
    })();
    mc6809.MemBlock = MemBlock;

    var ROM = (function () {
        function ROM(name, mem) {
            this.name = name;
            this.mem = mem;
        }
        return ROM;
    })();
    mc6809.ROM = ROM;

    var Emulator = (function () {
        function Emulator() {
            var _this = this;
            this.getRegD = function () {
                return 0xffff & (_this.regA << 8 | _this.regB & 0xff);
            };
            this.setRegD = function (value) {
                _this.regB = value & 0xff;
                _this.regA = (value >> 8) & 0xff;
            };
            this.pcCount = 0;
            this.memHandler = [];
            this.counts = {};
            this.inorder = [];
            this.debug = false;
            this.hex = function (v, width) {
                var s = v.toString(16);
                if (!width)
                    width = 2;
                while (s.length < width) {
                    s = '0' + s;
                }
                return s;
            };
            this.stateToString = function () {
                return 'pc:' + _this.hex(_this.regPC, 4) + ' s:' + _this.hex(_this.regS, 4) + ' u:' + _this.hex(_this.regU, 4) + ' x:' + _this.hex(_this.regX, 4) + ' y:' + _this.hex(_this.regY, 4) + ' a:' + _this.hex(_this.regA, 2) + ' b:' + _this.hex(_this.regB, 2) + ' d:' + _this.hex(_this.getRegD(), 4) + ' dp:' + _this.hex(_this.regDP, 2) + ' cc:' + _this.flagsToString();
            };
            this.nextOp = function () {
                var pc = _this.regPC;

                var nextop = _this.M6809ReadByte(pc);
                var mn = _this.mnemonics;
                if (nextop == 0x10) {
                    mn = _this.mnemonics10;
                    nextop = _this.M6809ReadByte(++pc);
                } else if (nextop == 0x11) {
                    mn = _this.mnemonics11;
                    nextop = _this.M6809ReadByte(++pc);
                }
                return mn[nextop];
            };
            this.state = function () {
                var pc = _this.regPC;

                var nextop = _this.M6809ReadByte(pc);
                var mn = _this.mnemonics;
                if (nextop == 0x10) {
                    mn = _this.mnemonics10;
                    nextop = _this.M6809ReadByte(++pc);
                } else if (nextop == 0x11) {
                    mn = _this.mnemonics11;
                    nextop = _this.M6809ReadByte(++pc);
                }

                var ret = _this.hex(pc, 4) + ' ' + mn[nextop] + ' ' + _this.hex(_this.readByteROM(pc + 1), 2) + ' ' + _this.hex(_this.readByteROM(pc + 2), 2) + ' ';

                ret += ' s:' + _this.hex(_this.regS, 4) + ' u:' + _this.hex(_this.regU, 4) + ' x:' + _this.hex(_this.regX, 4) + ' y:' + _this.hex(_this.regY, 4) + ' a:' + _this.hex(_this.regA, 2) + ' b:' + _this.hex(_this.regB, 2) + ' d:' + _this.hex(_this.getRegD(), 4) + ' dp:' + _this.hex(_this.regDP, 2) + ' cc:' + _this.flagsToString() + '  [' + _this.pcCount + ']';

                return ret;
            };
            this.flagsToString = function () {
                return ((_this.regCC & 8 /* NEGATIVE */) ? 'N' : '-') + ((_this.regCC & 4 /* ZERO */) ? 'Z' : '-') + ((_this.regCC & 1 /* CARRY */) ? 'C' : '-') + ((_this.regCC & 16 /* IRQMASK */) ? 'I' : '-') + ((_this.regCC & 32 /* HALFCARRY */) ? 'H' : '-') + ((_this.regCC & 2 /* OVERFLOW */) ? 'V' : '-') + ((_this.regCC & 64 /* FIRQMASK */) ? 'C' : '-') + ((_this.regCC & 128 /* ENTIRE */) ? 'E' : '-');
            };
            this.execute = function (iClocks, interruptRequest, breakpoint) {
                _this.iClocks = iClocks;
                if (breakpoint) {
                    console.log("breakpoint set: " + breakpoint.toString(16));
                }

                while (_this.iClocks > 0) {
                    if (breakpoint && _this.regPC == breakpoint) {
                        console.log('hit breakpoint at ' + breakpoint.toString(16));
                        _this.halt();
                        break;
                    }

                    interruptRequest = _this.handleIRQ(interruptRequest);

                    var mn = _this.nextOp();
                    if (_this.counts.hasOwnProperty(mn)) {
                        _this.counts[mn]++;
                    } else {
                        _this.inorder.push(mn);
                        _this.counts[mn] = 1;
                    }

                    var ucOpcode = _this.nextPCByte();
                    _this.iClocks -= c6809Cycles[ucOpcode]; /* Subtract execution time */
                    if (_this.debug)
                        console.log((_this.regPC - 1).toString(16) + ': ' + _this.mnemonics[ucOpcode]);

                    var instruction = _this.instructions[ucOpcode];
                    if (instruction == null) {
                        console.log('*** illegal opcode: ' + ucOpcode.toString(16) + ' at ' + (_this.regPC - 1).toString(16));
                        _this.iClocks = 0;
                        _this.halt();
                    } else {
                        instruction();
                    }
                }
            };
            this.readByteROM = function (addr) {
                var ucByte = _this.mem[MEM_ROM + addr];

                // console.log("Read ROM: " + addr.toString(16) + " -> " + ucByte.toString(16));
                return ucByte;
            };
            this.reset = function () {
                _this.regX = 0;
                _this.regY = 0;
                _this.regU = 0;
                _this.regS = _this.stackAddress;
                _this.regA = 0;
                _this.regB = 0;
                _this.regDP = 0;
                _this.regCC = 64 /* FIRQMASK */ | 16 /* IRQMASK */;
                _this.regPC = 0;
                _this._goto((_this.readByteROM(0xfffe) << 8) | _this.readByteROM(0xffff));
            };
            this.setStackAddress = function (addr) {
                _this.stackAddress = addr;
            };
            this.loadMemory = function (bytes, addr) {
                _this.mem.set(bytes, addr);
            };
            this.setMemoryMap = function (map) {
                $.each(map, function (index, block) {
                    for (var i = 0; i < block.len; i++) {
                        _this.mem[MEM_FLAGS + block.start + i] = index;
                    }
                    if (index > 1) {
                        _this.memHandler.push(block);
                    }
                });
            };
            this.halted = false;
            this.halt = function () {
                _this.halted = true;
                _this.iClocks = 0;
                console.log("halted.");
            };
            this.nextPCByte = function () {
                _this.pcCount++;
                return _this.M6809ReadByte(_this.regPC++);
            };
            this.nextPCWord = function () {
                var word = _this.M6809ReadWord(_this.regPC);
                _this.regPC += 2;
                _this.pcCount += 2;
                return word;
            };
            this.M6809ReadByte = function (addr) {
                var c = _this.mem[addr + MEM_FLAGS];
                switch (c) {
                    case 0:
                        var ucByte = _this.mem[addr + MEM_RAM];

                        // console.log("Read RAM: " + addr.toString(16) + " -> " + ucByte.toString(16));
                        return ucByte;
                    case 1:
                        var ucByte = _this.mem[addr + MEM_ROM];

                        //  console.log("Read ROM: " + addr.toString(16) + " -> " + ucByte.toString(16));
                        return ucByte;
                    default:
                        var handler = _this.memHandler[c - 2];
                        if (handler == undefined) {
                            console.log('need read handler at ' + (c - 2));
                            return 0;
                        }
                        return handler.read(addr);
                }
            };
            this.M6809WriteByte = function (addr, ucByte) {
                var c = _this.mem[addr + MEM_FLAGS];
                switch (c) {
                    case 0:
                        // console.log("Write RAM: " + addr.toString(16) + " = " + (ucByte & 0xff).toString(16));
                        _this.mem[addr + MEM_RAM] = ucByte & 0xff;
                        break;
                    case 1:
                        console.log("******** Write ROM: from PC: " + _this.regPC.toString(16) + "   " + addr.toString(16) + " = " + (ucByte & 0xff).toString(16));
                        _this.mem[addr + MEM_ROM] = ucByte & 0xff; // write it to ROM anyway...
                        break;
                    default:
                        var handler = _this.memHandler[c - 2];
                        if (handler == undefined) {
                            console.log('need write handler at ' + (c - 2));
                        } else
                            handler.write(addr, ucByte & 0xff);
                        break;
                }
            };
            this.M6809ReadWord = function (addr) {
                var hi = _this.M6809ReadByte(addr);
                var lo = _this.M6809ReadByte(addr + 1);
                return hi << 8 | lo;
            };
            this.M6809WriteWord = function (addr, usWord) {
                _this.M6809WriteByte(addr, usWord >> 8);
                _this.M6809WriteByte(addr + 1, usWord);
            };
            this.pushByte = function (ucByte, user) {
                var addr = user ? --_this.regU : --_this.regS;
                _this.M6809WriteByte(addr, ucByte);
            };
            this.M6809PUSHBU = function (ucByte) {
                _this.pushByte(ucByte, true);
            };
            this.M6809PUSHB = function (ucByte) {
                _this.pushByte(ucByte, false);
            };
            this.M6809PUSHW = function (usWord) {
                // push lo byte first.
                _this.M6809PUSHB(usWord);
                _this.M6809PUSHB(usWord >> 8);
            };
            this.M6809PUSHWU = function (usWord) {
                // push lo byte first.
                _this.M6809PUSHBU(usWord);
                _this.M6809PUSHBU(usWord >> 8);
            };
            this.pullByte = function (user) {
                var addr = user ? _this.regU : _this.regS;
                var val = _this.M6809ReadByte(addr);
                if (user)
                    ++_this.regU;
                else
                    ++_this.regS;
                return val;
            };
            this.M6809PULLB = function () {
                return _this.pullByte(false);
            };
            this.M6809PULLBU = function () {
                return _this.pullByte(true);
            };
            this.M6809PULLW = function () {
                var hi = _this.M6809PULLB();
                var lo = _this.M6809PULLB();
                return hi << 8 | lo;
            };
            this.M6809PULLWU = function () {
                var hi = _this.M6809PULLBU();
                var lo = _this.M6809PULLBU();
                return hi << 8 | lo;
            };
            this.M6809PostByte = function () {
                var pReg, usAddr, sTemp;
                var ucPostByte = _this.nextPCByte();
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
                    _this.iClocks -= 1;
                    return _this[pReg] + sByte;
                }

                switch (ucPostByte & 0xf) {
                    case 0:
                        usAddr = _this[pReg];
                        _this[pReg] += 1;
                        _this.iClocks -= 2;
                        break;
                    case 1:
                        usAddr = _this[pReg];
                        _this[pReg] += 2;
                        _this.iClocks -= 3;
                        break;
                    case 2:
                        _this[pReg] -= 1;
                        usAddr = _this[pReg];
                        _this.iClocks -= 2;
                        break;
                    case 3:
                        _this[pReg] -= 2;
                        usAddr = _this[pReg];
                        _this.iClocks -= 3;
                        break;
                    case 4:
                        usAddr = _this[pReg];
                        break;
                    case 5:
                        usAddr = _this[pReg] + makeSignedByte(_this.regB);
                        _this.iClocks -= 1;
                        break;
                    case 6:
                        usAddr = _this[pReg] + makeSignedByte(_this.regA);
                        _this.iClocks -= 1;
                        break;
                    case 7:
                        console.log('illegal postbyte pattern 7 at ' + (_this.regPC - 1).toString(16));
                        _this.halt();
                        usAddr = 0;
                        break;
                    case 8:
                        usAddr = _this[pReg] + makeSignedByte(_this.nextPCByte());
                        _this.iClocks -= 1;
                        break;
                    case 9:
                        usAddr = _this[pReg] + makeSignedWord(_this.nextPCWord());
                        _this.iClocks -= 4;
                        break;
                    case 0xA:
                        console.log('illegal postbyte pattern 0xA' + (_this.regPC - 1).toString(16));
                        _this.halt();
                        usAddr = 0;
                        break;
                    case 0xB:
                        _this.iClocks -= 4;
                        usAddr = _this[pReg] + _this.getRegD();
                        break;
                    case 0xC:
                        sTemp = makeSignedByte(_this.nextPCByte());
                        usAddr = _this.regPC + sTemp;
                        _this.iClocks -= 1;
                        break;
                    case 0xD:
                        sTemp = makeSignedWord(_this.nextPCWord());
                        usAddr = _this.regPC + sTemp;
                        _this.iClocks -= 5;
                        break;
                    case 0xE:
                        console.log('illegal postbyte pattern 0xE' + (_this.regPC - 1).toString(16));
                        _this.halt();
                        usAddr = 0;
                        break;
                    case 0xF:
                        _this.iClocks -= 5;
                        usAddr = _this.nextPCWord();
                        break;
                }

                if (ucPostByte & 0x10) {
                    usAddr = _this.M6809ReadWord(usAddr & 0xffff);
                    _this.iClocks -= 3;
                }
                return usAddr & 0xffff;
            };
            this.M6809PSHS = function (ucTemp) {
                var i = 0;

                if (ucTemp & 0x80) {
                    _this.M6809PUSHW(_this.regPC);
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    _this.M6809PUSHW(_this.regU);
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    _this.M6809PUSHW(_this.regY);
                    i += 2;
                }
                if (ucTemp & 0x10) {
                    _this.M6809PUSHW(_this.regX);
                    i += 2;
                }
                if (ucTemp & 0x8) {
                    _this.M6809PUSHB(_this.regDP);
                    i++;
                }
                if (ucTemp & 0x4) {
                    _this.M6809PUSHB(_this.regB);
                    i++;
                }
                if (ucTemp & 0x2) {
                    _this.M6809PUSHB(_this.regA);
                    i++;
                }
                if (ucTemp & 0x1) {
                    _this.M6809PUSHB(_this.regCC);
                    i++;
                }
                _this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            };
            this.M6809PSHU = function (ucTemp) {
                var i = 0;

                if (ucTemp & 0x80) {
                    _this.M6809PUSHWU(_this.regPC);
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    _this.M6809PUSHWU(_this.regU);
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    _this.M6809PUSHWU(_this.regY);
                    i += 2;
                }
                if (ucTemp & 0x10) {
                    _this.M6809PUSHWU(_this.regX);
                    i += 2;
                }
                if (ucTemp & 0x8) {
                    _this.M6809PUSHBU(_this.regDP);
                    i++;
                }
                if (ucTemp & 0x4) {
                    _this.M6809PUSHBU(_this.regB);
                    i++;
                }
                if (ucTemp & 0x2) {
                    _this.M6809PUSHBU(_this.regA);
                    i++;
                }
                if (ucTemp & 0x1) {
                    _this.M6809PUSHBU(_this.regCC);
                    i++;
                }
                _this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            };
            this.M6809PULS = function (ucTemp) {
                var i = 0;
                if (ucTemp & 0x1) {
                    _this.regCC = _this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x2) {
                    _this.regA = _this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x4) {
                    _this.regB = _this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x8) {
                    _this.regDP = _this.M6809PULLB();
                    i++;
                }
                if (ucTemp & 0x10) {
                    _this.regX = _this.M6809PULLW();
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    _this.regY = _this.M6809PULLW();
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    _this.regU = _this.M6809PULLW();
                    i += 2;
                }
                if (ucTemp & 0x80) {
                    _this._goto(_this.M6809PULLW());
                    i += 2;
                }
                _this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            };
            this.M6809PULU = function (ucTemp) {
                var i = 0;
                if (ucTemp & 0x1) {
                    _this.regCC = _this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x2) {
                    _this.regA = _this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x4) {
                    _this.regB = _this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x8) {
                    _this.regDP = _this.M6809PULLBU();
                    i++;
                }
                if (ucTemp & 0x10) {
                    _this.regX = _this.M6809PULLWU();
                    i += 2;
                }
                if (ucTemp & 0x20) {
                    _this.regY = _this.M6809PULLWU();
                    i += 2;
                }
                if (ucTemp & 0x40) {
                    _this.regU = _this.M6809PULLWU();
                    i += 2;
                }
                if (ucTemp & 0x80) {
                    _this._goto(_this.M6809PULLWU());
                    i += 2;
                }
                _this.iClocks -= i; /* Add extra clock cycles (1 per byte) */
            };
            this.handleIRQ = function (interruptRequest) {
                /* NMI is highest priority */
                if (interruptRequest & INT_NMI) {
                    console.log("taking NMI!!!!");
                    _this.M6809PUSHW(_this.regPC);
                    _this.M6809PUSHW(_this.regU);
                    _this.M6809PUSHW(_this.regY);
                    _this.M6809PUSHW(_this.regX);
                    _this.M6809PUSHB(_this.regDP);
                    _this.M6809PUSHB(_this.regB);
                    _this.M6809PUSHB(_this.regA);
                    _this.regCC |= 0x80; /* Set bit indicating machine state on stack */
                    _this.M6809PUSHB(_this.regCC);
                    _this.regCC |= 64 /* FIRQMASK */ | 16 /* IRQMASK */; /* Mask interrupts during service routine */
                    _this.iClocks -= 19;
                    _this._goto(_this.M6809ReadWord(0xfffc));
                    interruptRequest &= ~INT_NMI; /* clear this bit */
                    console.log(_this.state());
                    return interruptRequest;
                }

                /* Fast IRQ is next priority */
                if (interruptRequest & INT_FIRQ && (_this.regCC & 64 /* FIRQMASK */) == 0) {
                    console.log("taking FIRQ!!!!");
                    _this.M6809PUSHW(_this.regPC);
                    _this.regCC &= 0x7f; /* Clear bit indicating machine state on stack */
                    _this.M6809PUSHB(_this.regCC);
                    interruptRequest &= ~INT_FIRQ; /* clear this bit */
                    _this.regCC |= 64 /* FIRQMASK */ | 16 /* IRQMASK */; /* Mask interrupts during service routine */
                    _this.iClocks -= 10;
                    _this._goto(_this.M6809ReadWord(0xfff6));
                    console.log(_this.state());
                    return interruptRequest;
                }

                /* IRQ is lowest priority */
                if (interruptRequest & INT_IRQ && (_this.regCC & 16 /* IRQMASK */) == 0) {
                    console.log("taking IRQ!!!!");
                    _this.M6809PUSHW(_this.regPC);
                    _this.M6809PUSHW(_this.regU);
                    _this.M6809PUSHW(_this.regY);
                    _this.M6809PUSHW(_this.regX);
                    _this.M6809PUSHB(_this.regDP);
                    _this.M6809PUSHB(_this.regB);
                    _this.M6809PUSHB(_this.regA);
                    _this.regCC |= 0x80; /* Set bit indicating machine state on stack */
                    _this.M6809PUSHB(_this.regCC);
                    _this.regCC |= 16 /* IRQMASK */; /* Mask interrupts during service routine */
                    _this._goto(_this.M6809ReadWord(0xfff8));
                    interruptRequest &= ~INT_IRQ; /* clear this bit */
                    _this.iClocks -= 19;
                    console.log(_this.state());
                    return interruptRequest;
                }
                return interruptRequest;
            };
            this.toggleDebug = function () {
                _this.debug = !_this.debug;
                console.log("debug " + _this.debug);
            };
            this._goto = function (usAddr) {
                if (usAddr == 0xFFB3) {
                    console.log("PC from " + _this.regPC.toString(16) + " -> " + usAddr.toString(16));
                    if (_this.getRegD() > 0x9800) {
                        console.log('off screen??? ' + _this.getRegD().toString(16));
                    }
                }
                _this.regPC = usAddr;
            };
            this._flagnz = function (val) {
                if ((val & 0xff) == 0)
                    _this.regCC |= 4 /* ZERO */;
                else if (val & 0x80)
                    _this.regCC |= 8 /* NEGATIVE */;
            };
            this._flagnz16 = function (val) {
                if ((val & 0xffff) == 0)
                    _this.regCC |= 4 /* ZERO */;
                else if (val & 0x8000)
                    _this.regCC |= 8 /* NEGATIVE */;
            };
            this._neg = function (val) {
                _this.regCC &= ~(1 /* CARRY */ | 4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                if (val == 0x80)
                    _this.regCC |= 2 /* OVERFLOW */;
                val = ~val + 1;
                val &= 0xff;
                _this._flagnz(val);
                if (_this.regCC & 8 /* NEGATIVE */)
                    _this.regCC |= 1 /* CARRY */;
                return val;
            };
            this._com = function (val) {
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this.regCC |= 1 /* CARRY */;
                val = ~val;
                val &= 0xff;
                _this._flagnz(val);
                return val;
            };
            this._lsr = function (val) {
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                if (val & 1)
                    _this.regCC |= 1 /* CARRY */;
                val >>= 1;
                val &= 0xff;
                if (val == 0)
                    _this.regCC |= 4 /* ZERO */;
                return val;
            };
            this._ror = function (val) {
                var oldc = _this.regCC & 1 /* CARRY */;
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                if (val & 1)
                    _this.regCC |= 1 /* CARRY */;
                val = val >> 1 | oldc << 7;
                val &= 0xff;
                _this._flagnz(val);
                return val;
            };
            this._asr = function (val) {
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                if (val & 1)
                    _this.regCC |= 1 /* CARRY */;
                val = val & 0x80 | val >> 1;
                val &= 0xff;
                _this._flagnz(val);
                return val;
            };
            this._asl = function (val) {
                var oldval = val;
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                if (val & 0x80)
                    _this.regCC |= 1 /* CARRY */;
                val <<= 1;
                val &= 0xff;
                _this._flagnz(val);
                if ((oldval ^ val) & 0x80)
                    _this.regCC |= 2 /* OVERFLOW */;
                return val;
            };
            this._rol = function (val) {
                var oldval = val;
                var oldc = _this.regCC & 1 /* CARRY */;
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                if (val & 0x80)
                    _this.regCC |= 1 /* CARRY */;
                val = val << 1 | oldc;
                val &= 0xff;
                _this._flagnz(val);
                if ((oldval ^ val) & 0x80)
                    _this.regCC |= 2 /* OVERFLOW */;
                return val;
            };
            this._dec = function (val) {
                val--;
                val &= 0xff;
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(val);
                if (val == 0x7f || val == 0xff)
                    _this.regCC |= 2 /* OVERFLOW */;
                return val;
            };
            this._inc = function (val) {
                val++;
                val &= 0xff;
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(val);
                if (val == 0x80 || val == 0)
                    _this.regCC |= 2 /* OVERFLOW */;
                return val;
            };
            this._tst = function (val) {
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(val);
                return val;
            };
            this._clr = function (addr) {
                _this.M6809WriteByte(addr, 0);

                /* clear N,V,C, set Z */
                _this.regCC &= ~(1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this.regCC |= 4 /* ZERO */;
            };
            this._or = function (ucByte1, ucByte2) {
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                var ucTemp = ucByte1 | ucByte2;
                _this._flagnz(ucTemp);
                return ucTemp;
            };
            this._eor = function (ucByte1, ucByte2) {
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                var ucTemp = ucByte1 ^ ucByte2;
                _this._flagnz(ucTemp);
                return ucTemp;
            };
            this._and = function (ucByte1, ucByte2) {
                _this.regCC &= ~(4 /* ZERO */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                var ucTemp = ucByte1 & ucByte2;
                _this._flagnz(ucTemp);
                return ucTemp;
            };
            this._cmp = function (ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) - (ucByte2 & 0xff);
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(sTemp);
                if (sTemp & 0x100)
                    _this.regCC |= 1 /* CARRY */;
                _this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
            };
            this._setcc16 = function (usWord1, usWord2, lTemp) {
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz16(lTemp);
                if (lTemp & 0x10000)
                    _this.regCC |= 1 /* CARRY */;
                _this.regCC |= SET_V16(usWord1 & 0xffff, usWord2 & 0xffff, lTemp & 0x1ffff);
            };
            this._cmp16 = function (usWord1, usWord2) {
                var lTemp = (usWord1 & 0xffff) - (usWord2 & 0xffff);
                _this._setcc16(usWord1, usWord2, lTemp);
            };
            this._sub = function (ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) - (ucByte2 & 0xff);
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(sTemp);
                if (sTemp & 0x100)
                    _this.regCC |= 1 /* CARRY */;
                _this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                return sTemp & 0xff;
            };
            this._sub16 = function (usWord1, usWord2) {
                var lTemp = (usWord1 & 0xffff) - (usWord2 & 0xffff);
                _this._setcc16(usWord1, usWord2, lTemp);
                return lTemp & 0xffff;
            };
            this._sbc = function (ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) - (ucByte2 & 0xff) - (_this.regCC & 1);
                _this.regCC &= ~(4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(sTemp);
                if (sTemp & 0x100)
                    _this.regCC |= 1 /* CARRY */;
                _this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                return sTemp & 0xff;
            };
            this._add = function (ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) + (ucByte2 & 0xff);
                _this.regCC &= ~(32 /* HALFCARRY */ | 4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(sTemp);
                if (sTemp & 0x100)
                    _this.regCC |= 1 /* CARRY */;
                _this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                if ((sTemp ^ ucByte1 ^ ucByte2) & 0x10)
                    _this.regCC |= 32 /* HALFCARRY */;
                return sTemp & 0xff;
            };
            this._add16 = function (usWord1, usWord2) {
                var lTemp = (usWord1 & 0xffff) + (usWord2 & 0xffff);
                _this._setcc16(usWord1, usWord2, lTemp);
                return lTemp & 0xffff;
            };
            this._adc = function (ucByte1, ucByte2) {
                var sTemp = (ucByte1 & 0xff) + (ucByte2 & 0xff) + (_this.regCC & 1);
                _this.regCC &= ~(32 /* HALFCARRY */ | 4 /* ZERO */ | 1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this._flagnz(sTemp);
                if (sTemp & 0x100)
                    _this.regCC |= 1 /* CARRY */;
                _this.regCC |= SET_V8(ucByte1, ucByte2, sTemp);
                if ((sTemp ^ ucByte1 ^ ucByte2) & 0x10)
                    _this.regCC |= 32 /* HALFCARRY */;
                return sTemp & 0xff;
            };
            this.dpAddr = function () {
                return (_this.regDP << 8) + _this.nextPCByte();
            };
            this.dpOp = function (func) {
                var addr = _this.dpAddr();
                var val = _this.M6809ReadByte(addr);
                _this.M6809WriteByte(addr, func(val));
            };
            /* direct page addressing */
            this.neg = function () {
                _this.dpOp(_this._neg);
            };
            this.com = function () {
                _this.dpOp(_this._com);
            };
            this.lsr = function () {
                _this.dpOp(_this._lsr);
            };
            this.ror = function () {
                _this.dpOp(_this._ror);
            };
            this.asr = function () {
                _this.dpOp(_this._asr);
            };
            this.asl = function () {
                _this.dpOp(_this._asl);
            };
            this.rol = function () {
                _this.dpOp(_this._rol);
            };
            this.dec = function () {
                _this.dpOp(_this._dec);
            };
            this.inc = function () {
                _this.dpOp(_this._inc);
            };
            this.tst = function () {
                _this.dpOp(_this._tst);
            };
            this.jmp = function () {
                _this._goto(_this.dpAddr());
            };
            this.clr = function () {
                _this._clr(_this.dpAddr());
            };
            /* P10  extended Op codes */
            this.lbrn = function () {
                _this.regPC += 2;
            };
            this.lbhi = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!(_this.regCC & (1 /* CARRY */ | 4 /* ZERO */))) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbls = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (_this.regCC & (1 /* CARRY */ | 4 /* ZERO */)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbcc = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!(_this.regCC & 1 /* CARRY */)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbcs = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (_this.regCC & 1 /* CARRY */) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbne = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!(_this.regCC & 4 /* ZERO */)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbeq = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (_this.regCC & 4 /* ZERO */) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbvc = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!(_this.regCC & 2 /* OVERFLOW */)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbvs = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (_this.regCC & 2 /* OVERFLOW */) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbpl = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!(_this.regCC & 8 /* NEGATIVE */)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbmi = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (_this.regCC & 8 /* NEGATIVE */) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbge = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!((_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lblt = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if ((_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lbgt = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if (!((_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2 || _this.regCC & 4 /* ZERO */)) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.lble = function () {
                var sTemp = makeSignedWord(_this.nextPCWord());
                if ((_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2 || _this.regCC & 4 /* ZERO */) {
                    _this.iClocks -= 1; /* Extra clock if branch taken */
                    _this.regPC += sTemp;
                }
            };
            this.swi2 = function () {
                _this.regCC |= 0x80; /* Entire machine state stacked */
                _this.M6809PUSHW(_this.regPC);
                _this.M6809PUSHW(_this.regU);
                _this.M6809PUSHW(_this.regY);
                _this.M6809PUSHW(_this.regX);
                _this.M6809PUSHB(_this.regDP);
                _this.M6809PUSHB(_this.regA);
                _this.M6809PUSHB(_this.regB);
                _this.M6809PUSHB(_this.regCC);
                _this._goto(_this.M6809ReadWord(0xfff4));
            };
            this.cmpd = function () {
                var usTemp = _this.nextPCWord();
                _this._cmp16(_this.getRegD(), usTemp);
            };
            this.cmpy = function () {
                var usTemp = _this.nextPCWord();
                _this._cmp16(_this.regY, usTemp);
            };
            this.ldy = function () {
                _this.regY = _this.nextPCWord();
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.cmpdd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.getRegD(), usTemp);
            };
            this.cmpyd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regY, usTemp);
            };
            this.ldyd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.regY = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.sty = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809WriteWord(usAddr, _this.regY);
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.cmpdi = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.getRegD(), usTemp);
            };
            this.cmpyi = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regY, usTemp);
            };
            this.ldyi = function () {
                var usAddr = _this.M6809PostByte();
                _this.regY = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.styi = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteWord(usAddr, _this.regY);
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.cmpde = function () {
                var usAddr = _this.nextPCWord();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.getRegD(), usTemp);
            };
            this.cmpye = function () {
                var usAddr = _this.nextPCWord();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regY, usTemp);
            };
            this.ldye = function () {
                var usAddr = _this.nextPCWord();
                _this.regY = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stye = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteWord(usAddr, _this.regY);
                _this._flagnz16(_this.regY);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.lds = function () {
                _this.regS = _this.nextPCWord();
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldsd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.regS = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stsd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809WriteWord(usAddr, _this.regS);
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldsi = function () {
                var usAddr = _this.M6809PostByte();
                _this.regS = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stsi = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteWord(usAddr, _this.regS);
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldse = function () {
                var usAddr = _this.nextPCWord();
                _this.regS = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stse = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteWord(usAddr, _this.regS);
                _this._flagnz16(_this.regS);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.p10 = function () {
                var op = _this.nextPCByte();
                _this.iClocks -= c6809Cycles2[op]; /* Subtract execution time */
                if (_this.debug)
                    console.log((_this.regPC - 1).toString(16) + ': ' + _this.mnemonics10[op]);
                var instruction = _this.instructions10[op];
                if (instruction == null) {
                    console.log('*** illegal p10 opcode: ' + op.toString(16) + ' at ' + (_this.regPC - 1).toString(16));
                    _this.halt();
                } else {
                    instruction();
                }
            };
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
            /* P10 end */
            /* P11 start */
            this.swi3 = function () {
                _this.regCC |= 0x80; /* Set entire flag to indicate whole machine state on stack */
                _this.M6809PUSHW(_this.regPC);
                _this.M6809PUSHW(_this.regU);
                _this.M6809PUSHW(_this.regY);
                _this.M6809PUSHW(_this.regX);
                _this.M6809PUSHB(_this.regDP);
                _this.M6809PUSHB(_this.regA);
                _this.M6809PUSHB(_this.regB);
                _this.M6809PUSHB(_this.regCC);
                _this._goto(_this.M6809ReadWord(0xfff2));
            };
            this.cmpu = function () {
                var usTemp = _this.nextPCWord();
                _this._cmp16(_this.regU, usTemp);
            };
            this.cmps = function () {
                var usTemp = _this.nextPCWord();
                _this._cmp16(_this.regS, usTemp);
            };
            this.cmpud = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regU, usTemp);
            };
            this.cmpsd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regS, usTemp);
            };
            this.cmpui = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regU, usTemp);
            };
            this.cmpsi = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regS, usTemp);
            };
            this.cmpue = function () {
                var usAddr = _this.nextPCWord();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regU, usTemp);
            };
            this.cmpse = function () {
                var usAddr = _this.nextPCWord();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regS, usTemp);
            };
            this.instructions11 = [];
            this.mnemonics11 = [];
            this.add11 = function (op, name) {
                _this.instructions11[op] = _this[name];
                _this.mnemonics11[op] = name;
            };
            this.init11 = function () {
                for (var i = 0; i < 256; i++) {
                    _this.instructions11[i] = null;
                    _this.mnemonics11[i] = '     ';
                }
                var x = [
                    { op: 0x3f, name: 'swi3' },
                    { op: 0x83, name: 'cmpu' },
                    { op: 0x8c, name: 'cmps' },
                    { op: 0x93, name: 'cmpud' },
                    { op: 0x9c, name: 'cmpsd' },
                    { op: 0xa3, name: 'cmpui' },
                    { op: 0xac, name: 'cmpsi' },
                    { op: 0xb3, name: 'cmpue' },
                    { op: 0xbc, name: 'cmpse' }
                ];
                $.each(x, function (i, o) {
                    _this.instructions11[o.op] = _this[o.name];
                    _this.mnemonics11[o.op] = o.name;
                });
            };
            this.p11 = function () {
                var op = _this.nextPCByte();
                _this.iClocks -= c6809Cycles2[op]; /* Subtract execution time */
                if (_this.debug)
                    console.log((_this.regPC - 1).toString(16) + ': ' + _this.mnemonics11[op]);
                var instruction = _this.instructions11[op];
                if (instruction == null) {
                    console.log('*** illegal p11 opcode: ' + op.toString(16));
                    _this.halt();
                } else {
                    instruction();
                }
            };
            /* p11 end */
            this.nop = function () {
            };
            this.sync = function () {
            };
            this.lbra = function () {
                /* LBRA - relative jump */
                var sTemp = makeSignedWord(_this.nextPCWord());
                _this.regPC += sTemp;
            };
            this.lbsr = function () {
                /* LBSR - relative call */
                var sTemp = makeSignedWord(_this.nextPCWord());
                _this.M6809PUSHW(_this.regPC);
                _this.regPC += sTemp;
            };
            this.daa = function () {
                var cf = 0;
                var msn = _this.regA & 0xf0;
                var lsn = _this.regA & 0x0f;
                if (lsn > 0x09 || _this.regCC & 0x20)
                    cf |= 0x06;
                if (msn > 0x80 && lsn > 0x09)
                    cf |= 0x60;
                if (msn > 0x90 || _this.regCC & 0x01)
                    cf |= 0x60;
                var usTemp = cf + _this.regA;
                _this.regCC &= ~(1 /* CARRY */ | 8 /* NEGATIVE */ | 4 /* ZERO */ | 2 /* OVERFLOW */);
                if (usTemp & 0x100)
                    _this.regCC |= 1 /* CARRY */;
                _this.regA = usTemp & 0xff;
                _this._flagnz(_this.regA);
            };
            this.orcc = function () {
                _this.regCC |= _this.nextPCByte();
            };
            this.andcc = function () {
                _this.regCC &= _this.nextPCByte();
            };
            this.sex = function () {
                _this.regA = (_this.regB & 0x80) ? 0xFF : 0x00;
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */);
                var d = _this.getRegD();
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this._setreg = function (name, value) {
                // console.log(name + '=' + value.toString(16));
                if (name == 'D') {
                    _this.setRegD(value);
                } else {
                    _this["reg" + name] = value;
                }
            };
            this.M6809TFREXG = function (ucPostByte, bExchange) {
                var ucTemp = ucPostByte & 0x88;
                if (ucTemp == 0x80 || ucTemp == 0x08) {
                    console.log("**** M6809TFREXG problem...");
                    ucTemp = 0; /* PROBLEM! */
                }
                var srname, srcval;
                switch (ucPostByte & 0xf0) {
                    case 0x00:
                        srname = 'D';
                        srcval = _this.getRegD();
                        break;
                    case 0x10:
                        srname = 'X';
                        srcval = _this.regX;
                        break;
                    case 0x20:
                        srname = 'Y';
                        srcval = _this.regY;
                        break;
                    case 0x30:
                        srname = 'U';
                        srcval = _this.regU;
                        break;
                    case 0x40:
                        srname = 'S';
                        srcval = _this.regS;
                        break;
                    case 0x50:
                        srname = 'PC';
                        srcval = _this.regPC;
                        break;
                    case 0x80:
                        srname = 'A';
                        srcval = _this.regA;
                        break;
                    case 0x90:
                        srname = 'B';
                        srcval = _this.regB;
                        break;
                    case 0xA0:
                        srname = 'CC';
                        srcval = _this.regCC;
                        break;
                    case 0xB0:
                        srname = 'DP';
                        srcval = _this.regDP;
                        break;
                    default:
                        console.log("illegal src register in M6809TFREXG");
                        _this.halt();
                        break;
                }

                switch (ucPostByte & 0xf) {
                    case 0x00:
                        // console.log('EXG dst: D=' + this.getRegD().toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.getRegD());
                        }
                        _this.setRegD(srcval);
                        break;
                    case 0x1:
                        // console.log('EXG dst: X=' + this.regX.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regX);
                        }
                        _this.regX = srcval;
                        break;
                    case 0x2:
                        // console.log('EXG dst: Y=' + this.regY.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regY);
                        }
                        _this.regY = srcval;
                        break;
                    case 0x3:
                        // console.log('EXG dst: U=' + this.regU.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regU);
                        }
                        _this.regU = srcval;
                        break;
                    case 0x4:
                        // console.log('EXG dst: S=' + this.regS.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regS);
                        }
                        _this.regS = srcval;
                        break;
                    case 0x5:
                        // console.log('EXG dst: PC=' + this.regPC.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regPC);
                        }
                        _this._goto(srcval);
                        break;
                    case 0x8:
                        // console.log('EXG dst: A=' + this.regA.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regA);
                        }
                        _this.regA = 0xff & srcval;
                        break;
                    case 0x9:
                        // console.log('EXG dst: B=' + this.regB.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regB);
                        }
                        _this.regB = 0xff & srcval;
                        break;
                    case 0xA:
                        // console.log('EXG dst: CC=' + this.regCC.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regCC);
                        }
                        _this.regCC = 0xff & srcval;
                        break;
                    case 0xB:
                        // console.log('EXG dst: DP=' + this.regDP.toString(16));
                        if (bExchange) {
                            _this._setreg(srname, _this.regDP);
                        }
                        _this.regDP = srcval;
                        break;
                    default:
                        console.log("illegal dst register in M6809TFREXG");
                        _this.halt();
                        break;
                }
            };
            this.exg = function () {
                var ucTemp = _this.nextPCByte();
                _this.M6809TFREXG(ucTemp, true);
            };
            this.tfr = function () {
                var ucTemp = _this.nextPCByte();
                _this.M6809TFREXG(ucTemp, false);
            };
            this.bra = function () {
                var offset = makeSignedByte(_this.nextPCByte());
                _this.regPC += offset;
            };
            this.brn = function () {
                _this.regPC++; // never.
            };
            this.bhi = function () {
                var offset = makeSignedByte(_this.nextPCByte());
                if (!(_this.regCC & (1 /* CARRY */ | 4 /* ZERO */)))
                    _this.regPC += offset;
            };
            this.bls = function () {
                var offset = makeSignedByte(_this.nextPCByte());
                if (_this.regCC & (1 /* CARRY */ | 4 /* ZERO */))
                    _this.regPC += offset;
            };
            this.branchIf = function (go) {
                var offset = makeSignedByte(_this.nextPCByte());
                if (go)
                    _this.regPC += offset;
            };
            this.branch = function (flag, ifSet) {
                _this.branchIf((_this.regCC & flag) == (ifSet ? flag : 0));
            };
            this.bcc = function () {
                _this.branch(1 /* CARRY */, false);
            };
            this.bcs = function () {
                _this.branch(1 /* CARRY */, true);
            };
            this.bne = function () {
                _this.branch(4 /* ZERO */, false);
            };
            this.beq = function () {
                _this.branch(4 /* ZERO */, true);
            };
            this.bvc = function () {
                _this.branch(2 /* OVERFLOW */, false);
            };
            this.bvs = function () {
                _this.branch(2 /* OVERFLOW */, true);
            };
            this.bpl = function () {
                _this.branch(8 /* NEGATIVE */, false);
            };
            this.bmi = function () {
                _this.branch(8 /* NEGATIVE */, true);
            };
            this.bge = function () {
                var go = !((_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2);
                _this.branchIf(go);
            };
            this.blt = function () {
                var go = (_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2;
                _this.branchIf(go != 0);
            };
            this.bgt = function () {
                var bit = (_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2;
                var go = bit == 0 || (_this.regCC & 4 /* ZERO */) != 0;
                _this.branchIf(go);
            };
            this.ble = function () {
                var bit = (_this.regCC & 8 /* NEGATIVE */) ^ (_this.regCC & 2 /* OVERFLOW */) << 2;
                var go = bit != 0 || (_this.regCC & 4 /* ZERO */) != 0;
                _this.branchIf(go);
            };
            this.leax = function () {
                _this.regX = _this.M6809PostByte();
                _this.regCC &= ~4 /* ZERO */;
                if (_this.regX == 0)
                    _this.regCC |= 4 /* ZERO */;
            };
            this.leay = function () {
                _this.regY = _this.M6809PostByte();
                _this.regCC &= ~4 /* ZERO */;
                if (_this.regY == 0)
                    _this.regCC |= 4 /* ZERO */;
            };
            this.leas = function () {
                _this.regS = _this.M6809PostByte();
            };
            this.leau = function () {
                _this.regU = _this.M6809PostByte();
            };
            this.pshs = function () {
                var ucTemp = _this.nextPCByte();
                _this.M6809PSHS(ucTemp);
            };
            this.puls = function () {
                var ucTemp = _this.nextPCByte();
                _this.M6809PULS(ucTemp);
            };
            this.pshu = function () {
                var ucTemp = _this.nextPCByte();
                _this.M6809PSHU(ucTemp);
            };
            this.pulu = function () {
                var ucTemp = _this.nextPCByte();
                _this.M6809PULU(ucTemp);
            };
            this.rts = function () {
                _this._goto(_this.M6809PULLW());
            };
            this.abx = function () {
                _this.regX += _this.regB;
            };
            this.rti = function () {
                _this.regCC = _this.M6809PULLB();
                if (_this.regCC & 0x80) {
                    _this.iClocks -= 9;
                    _this.regA = _this.M6809PULLB();
                    _this.regB = _this.M6809PULLB();
                    _this.regDP = _this.M6809PULLB();
                    _this.regX = _this.M6809PULLW();
                    _this.regY = _this.M6809PULLW();
                    _this.regU = _this.M6809PULLW();
                }
                _this._goto(_this.M6809PULLW());
            };
            this.cwai = function () {
                _this.regCC &= _this.nextPCByte();
            };
            this.mul = function () {
                var usTemp = _this.regA * _this.regB;
                if (usTemp)
                    _this.regCC &= ~4 /* ZERO */;
                else
                    _this.regCC |= 4 /* ZERO */;
                if (usTemp & 0x80)
                    _this.regCC |= 1 /* CARRY */;
                else
                    _this.regCC &= ~1 /* CARRY */;
                _this.setRegD(usTemp);
            };
            this.swi = function () {
                _this.regCC |= 0x80; /* Indicate whole machine state is stacked */
                _this.M6809PUSHW(_this.regPC);
                _this.M6809PUSHW(_this.regU);
                _this.M6809PUSHW(_this.regY);
                _this.M6809PUSHW(_this.regX);
                _this.M6809PUSHB(_this.regDP);
                _this.M6809PUSHB(_this.regB);
                _this.M6809PUSHB(_this.regA);
                _this.M6809PUSHB(_this.regCC);
                _this.regCC |= 0x50; /* Disable further interrupts */
                _this._goto(_this.M6809ReadWord(0xfffa));
            };
            this.nega = function () {
                _this.regA = _this._neg(_this.regA);
            };
            this.coma = function () {
                _this.regA = _this._com(_this.regA);
            };
            this.lsra = function () {
                _this.regA = _this._lsr(_this.regA);
            };
            this.rora = function () {
                _this.regA = _this._ror(_this.regA);
            };
            this.asra = function () {
                _this.regA = _this._asr(_this.regA);
            };
            this.asla = function () {
                _this.regA = _this._asl(_this.regA);
            };
            this.rola = function () {
                _this.regA = _this._rol(_this.regA);
            };
            this.deca = function () {
                _this.regA = _this._dec(_this.regA);
            };
            this.inca = function () {
                _this.regA = _this._inc(_this.regA);
            };
            this.tsta = function () {
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.clra = function () {
                _this.regA = 0;
                _this.regCC &= ~(8 /* NEGATIVE */ | 2 /* OVERFLOW */ | 1 /* CARRY */);
                _this.regCC |= 4 /* ZERO */;
            };
            this.negb = function () {
                _this.regB = _this._neg(_this.regB);
            };
            this.comb = function () {
                _this.regB = _this._com(_this.regB);
            };
            this.lsrb = function () {
                _this.regB = _this._lsr(_this.regB);
            };
            this.rorb = function () {
                _this.regB = _this._ror(_this.regB);
            };
            this.asrb = function () {
                _this.regB = _this._asr(_this.regB);
            };
            this.aslb = function () {
                _this.regB = _this._asl(_this.regB);
            };
            this.rolb = function () {
                _this.regB = _this._rol(_this.regB);
            };
            this.decb = function () {
                _this.regB = _this._dec(_this.regB);
            };
            this.incb = function () {
                _this.regB = _this._inc(_this.regB);
            };
            this.tstb = function () {
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.clrb = function () {
                _this.regB = 0;
                _this.regCC &= ~(8 /* NEGATIVE */ | 2 /* OVERFLOW */ | 1 /* CARRY */);
                _this.regCC |= 4 /* ZERO */;
            };
            this.negi = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._neg(ucTemp));
            };
            this.comi = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._com(ucTemp));
            };
            this.lsri = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._lsr(ucTemp));
            };
            this.rori = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._ror(ucTemp));
            };
            this.asri = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._asr(ucTemp));
            };
            this.asli = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._asl(ucTemp));
            };
            this.roli = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._rol(ucTemp));
            };
            this.deci = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._dec(ucTemp));
            };
            this.inci = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.M6809WriteByte(usAddr, _this._inc(ucTemp));
            };
            this.tsti = function () {
                var usAddr = _this.M6809PostByte();
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                var val = _this.M6809ReadByte(usAddr);
                _this._flagnz(val);
            };
            this.jmpi = function () {
                _this._goto(_this.M6809PostByte());
            };
            this.clri = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteByte(usAddr, 0);
                _this.regCC &= ~(2 /* OVERFLOW */ | 1 /* CARRY */ | 8 /* NEGATIVE */);
                _this.regCC |= 4 /* ZERO */;
            };
            this.nege = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._neg(_this.M6809ReadByte(usAddr)));
            };
            this.come = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._com(_this.M6809ReadByte(usAddr)));
            };
            this.lsre = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._lsr(_this.M6809ReadByte(usAddr)));
            };
            this.rore = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._ror(_this.M6809ReadByte(usAddr)));
            };
            this.asre = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._asr(_this.M6809ReadByte(usAddr)));
            };
            this.asle = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._asl(_this.M6809ReadByte(usAddr)));
            };
            this.role = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._rol(_this.M6809ReadByte(usAddr)));
            };
            this.dece = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._dec(_this.M6809ReadByte(usAddr)));
            };
            this.ince = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this._inc(_this.M6809ReadByte(usAddr)));
            };
            this.tste = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(ucTemp);
            };
            this.jmpe = function () {
                _this._goto(_this.M6809ReadWord(_this.regPC));
            };
            this.clre = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, 0);
                _this.regCC &= ~(1 /* CARRY */ | 2 /* OVERFLOW */ | 8 /* NEGATIVE */);
                _this.regCC |= 4 /* ZERO */;
            };
            this.suba = function () {
                _this.regA = _this._sub(_this.regA, _this.nextPCByte());
            };
            this.cmpa = function () {
                var ucTemp = _this.nextPCByte();
                _this._cmp(_this.regA, ucTemp);
            };
            this.sbca = function () {
                var ucTemp = _this.nextPCByte();
                _this.regA = _this._sbc(_this.regA, ucTemp);
            };
            this.subd = function () {
                var usTemp = _this.nextPCWord();
                _this.setRegD(_this._sub16(_this.getRegD(), usTemp));
            };
            this.anda = function () {
                var ucTemp = _this.nextPCByte();
                _this.regA = _this._and(_this.regA, ucTemp);
            };
            this.bita = function () {
                var ucTemp = _this.nextPCByte();
                _this._and(_this.regA, ucTemp);
            };
            this.lda = function () {
                _this.regA = _this.nextPCByte();
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.eora = function () {
                var ucTemp = _this.nextPCByte();
                _this.regA = _this._eor(_this.regA, ucTemp);
            };
            this.adca = function () {
                var ucTemp = _this.nextPCByte();
                _this.regA = _this._adc(_this.regA, ucTemp);
            };
            this.ora = function () {
                var ucTemp = _this.nextPCByte();
                _this.regA = _this._or(_this.regA, ucTemp);
            };
            this.adda = function () {
                var ucTemp = _this.nextPCByte();
                _this.regA = _this._add(_this.regA, ucTemp);
            };
            this.cmpx = function () {
                var usTemp = _this.nextPCWord();
                _this._cmp16(_this.regX, usTemp);
            };
            this.bsr = function () {
                var sTemp = makeSignedByte(_this.nextPCByte());
                _this.M6809PUSHW(_this.regPC);
                _this.regPC += sTemp;
            };
            this.ldx = function () {
                var usTemp = _this.nextPCWord();
                _this.regX = usTemp;
                _this._flagnz16(usTemp);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.subad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._sub(_this.regA, ucTemp);
            };
            this.cmpad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._cmp(_this.regA, ucTemp);
            };
            this.sbcad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._sbc(_this.regA, ucTemp);
            };
            this.subdd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this.setRegD(_this._sub16(_this.getRegD(), usTemp));
            };
            this.andad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._and(_this.regA, ucTemp);
            };
            this.bitad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._and(_this.regA, ucTemp);
            };
            this.ldad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.regA = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.stad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809WriteByte(usAddr, _this.regA);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.eorad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._eor(_this.regA, ucTemp);
            };
            this.adcad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._adc(_this.regA, ucTemp);
            };
            this.orad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._or(_this.regA, ucTemp);
            };
            this.addad = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._add(_this.regA, ucTemp);
            };
            this.cmpxd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regX, usTemp);
            };
            this.jsrd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809PUSHW(_this.regPC);
                _this._goto(usAddr);
            };
            this.ldxd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.regX = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regX);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stxd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809WriteWord(usAddr, _this.regX);
                _this._flagnz16(_this.regX);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.subax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._sub(_this.regA, ucTemp);
            };
            this.cmpax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._cmp(_this.regA, ucTemp);
            };
            this.sbcax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._sbc(_this.regA, ucTemp);
            };
            this.subdx = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this.setRegD(_this._sub16(_this.getRegD(), usTemp));
            };
            this.andax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._and(_this.regA, ucTemp);
            };
            this.bitax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._and(_this.regA, ucTemp);
            };
            this.ldax = function () {
                var usAddr = _this.M6809PostByte();
                _this.regA = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.stax = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteByte(usAddr, _this.regA);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.eorax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._eor(_this.regA, ucTemp);
            };
            this.adcax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._adc(_this.regA, ucTemp);
            };
            this.orax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._or(_this.regA, ucTemp);
            };
            this.addax = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regA = _this._add(_this.regA, ucTemp);
            };
            this.cmpxx = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this._cmp16(_this.regX, usTemp);
            };
            this.jsrx = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809PUSHW(_this.regPC);
                _this._goto(usAddr);
            };
            this.ldxx = function () {
                var usAddr = _this.M6809PostByte();
                _this.regX = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regX);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stxx = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteWord(usAddr, _this.regX);
                _this._flagnz16(_this.regX);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.subae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._sub(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.cmpae = function () {
                var usAddr = _this.nextPCWord();
                _this._cmp(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.sbcae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._sbc(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.subde = function () {
                var usAddr = _this.nextPCWord();
                _this.setRegD(_this._sub16(_this.getRegD(), _this.M6809ReadWord(usAddr)));
            };
            this.andae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._and(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.bitae = function () {
                var usAddr = _this.nextPCWord();
                _this._and(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.ldae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.stae = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this.regA);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regA);
            };
            this.eorae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._eor(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.adcae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._adc(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.orae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._or(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.addae = function () {
                var usAddr = _this.nextPCWord();
                _this.regA = _this._add(_this.regA, _this.M6809ReadByte(usAddr));
            };
            this.cmpxe = function () {
                var usAddr = _this.nextPCWord();
                _this._cmp16(_this.regX, _this.M6809ReadWord(usAddr));
            };
            this.jsre = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809PUSHW(_this.regPC);
                _this._goto(usAddr);
            };
            this.ldxe = function () {
                var usAddr = _this.nextPCWord();
                _this.regX = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regX);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stxe = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteWord(usAddr, _this.regX);
                _this._flagnz16(_this.regX);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.subb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._sub(_this.regB, ucTemp);
            };
            this.cmpb = function () {
                var ucTemp = _this.nextPCByte();
                _this._cmp(_this.regB, ucTemp);
            };
            this.sbcb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._sbc(_this.regB, ucTemp);
            };
            this.addd = function () {
                var usTemp = _this.nextPCWord();
                _this.setRegD(_this._add16(_this.getRegD(), usTemp));
            };
            this.andb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._and(_this.regB, ucTemp);
            };
            this.bitb = function () {
                var ucTemp = _this.nextPCByte();
                _this._and(_this.regB, ucTemp);
            };
            this.ldb = function () {
                _this.regB = _this.nextPCByte();
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.eorb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._eor(_this.regB, ucTemp);
            };
            this.adcb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._adc(_this.regB, ucTemp);
            };
            this.orb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._or(_this.regB, ucTemp);
            };
            this.addb = function () {
                var ucTemp = _this.nextPCByte();
                _this.regB = _this._add(_this.regB, ucTemp);
            };
            this.ldd = function () {
                var d = _this.nextPCWord();
                _this.setRegD(d);
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldu = function () {
                _this.regU = _this.nextPCWord();
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.sbbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._sub(_this.regB, ucTemp);
            };
            this.cmpbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._cmp(_this.regB, ucTemp);
            };
            this.sbcd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._sbc(_this.regB, ucTemp);
            };
            this.adddd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this.setRegD(_this._add16(_this.getRegD(), usTemp));
            };
            this.andbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._and(_this.regB, ucTemp);
            };
            this.bitbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._and(_this.regB, ucTemp);
            };
            this.ldbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.regB = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.stbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809WriteByte(usAddr, _this.regB);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.eorbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._eor(_this.regB, ucTemp);
            };
            this.adcbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._adc(_this.regB, ucTemp);
            };
            this.orbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._or(_this.regB, ucTemp);
            };
            this.addbd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._add(_this.regB, ucTemp);
            };
            this.lddd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var d = _this.M6809ReadWord(usAddr);
                _this.setRegD(d);
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stdd = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                var d = _this.getRegD();
                _this.M6809WriteWord(usAddr, d);
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldud = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.regU = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stud = function () {
                var usAddr = _this.regDP * 256 + _this.nextPCByte();
                _this.M6809WriteWord(usAddr, _this.regU);
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.subbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._sub(_this.regB, ucTemp);
            };
            this.cmpbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._cmp(_this.regB, ucTemp);
            };
            this.sbcbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._sbc(_this.regB, ucTemp);
            };
            this.adddx = function () {
                var usAddr = _this.M6809PostByte();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this.setRegD(_this._add16(_this.getRegD(), usTemp));
            };
            this.andbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._and(_this.regB, ucTemp);
            };
            this.bitbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._and(_this.regB, ucTemp);
            };
            this.ldbx = function () {
                var usAddr = _this.M6809PostByte();
                _this.regB = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.stbx = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteByte(usAddr, _this.regB);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.eorbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._eor(_this.regB, ucTemp);
            };
            this.adcbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._adc(_this.regB, ucTemp);
            };
            this.orbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._or(_this.regB, ucTemp);
            };
            this.addbx = function () {
                var usAddr = _this.M6809PostByte();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._add(_this.regB, ucTemp);
            };
            this.lddx = function () {
                var usAddr = _this.M6809PostByte();
                var d = _this.M6809ReadWord(usAddr);
                _this.setRegD(d);
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stdx = function () {
                var usAddr = _this.M6809PostByte();
                var d = _this.getRegD();
                _this.M6809WriteWord(usAddr, d);
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldux = function () {
                var usAddr = _this.M6809PostByte();
                _this.regU = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stux = function () {
                var usAddr = _this.M6809PostByte();
                _this.M6809WriteWord(usAddr, _this.regU);
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.subbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._sub(_this.regB, ucTemp);
            };
            this.cmpbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._cmp(_this.regB, ucTemp);
            };
            this.sbcbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._sbc(_this.regB, ucTemp);
            };
            this.addde = function () {
                var usAddr = _this.nextPCWord();
                var usTemp = _this.M6809ReadWord(usAddr);
                _this.setRegD(_this._add16(_this.getRegD(), usTemp));
            };
            this.andbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._and(_this.regB, ucTemp);
            };
            this.bitbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this._and(_this.regB, ucTemp);
            };
            this.ldbe = function () {
                var usAddr = _this.nextPCWord();
                _this.regB = _this.M6809ReadByte(usAddr);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.stbe = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteByte(usAddr, _this.regB);
                _this.regCC &= ~(4 /* ZERO */ | 8 /* NEGATIVE */ | 2 /* OVERFLOW */);
                _this._flagnz(_this.regB);
            };
            this.eorbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._eor(_this.regB, ucTemp);
            };
            this.adcbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._adc(_this.regB, ucTemp);
            };
            this.orbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._or(_this.regB, ucTemp);
            };
            this.addbe = function () {
                var usAddr = _this.nextPCWord();
                var ucTemp = _this.M6809ReadByte(usAddr);
                _this.regB = _this._add(_this.regB, ucTemp);
            };
            this.ldde = function () {
                var usAddr = _this.nextPCWord();
                var val = _this.M6809ReadWord(usAddr);
                _this.setRegD(val);
                _this._flagnz16(val);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stde = function () {
                var usAddr = _this.nextPCWord();
                var d = _this.getRegD();
                _this.M6809WriteWord(usAddr, d);
                _this._flagnz16(d);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.ldue = function () {
                var usAddr = _this.nextPCWord();
                _this.regU = _this.M6809ReadWord(usAddr);
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
            this.stue = function () {
                var usAddr = _this.nextPCWord();
                _this.M6809WriteWord(usAddr, _this.regU);
                _this._flagnz16(_this.regU);
                _this.regCC &= ~2 /* OVERFLOW */;
            };
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
            this.buffer = new ArrayBuffer(0x30000);
            this.mem = new Uint8Array(this.buffer);
            this.view = new DataView(this.buffer, 0);
            this.init11();
        }
        Emulator.prototype.dumpmem = function (addr, count) {
            for (var a = addr; a < addr + count; a++) {
                console.log(a.toString(16) + " " + this.hex(this.M6809ReadByte(a), 2));
            }
        };

        Emulator.prototype.dumpstack = function (count) {
            var addr = this.regS;
            for (var i = 0; i < count; i++) {
                console.log(this.hex(this.M6809ReadWord(addr), 4));
                addr += 2;
            }
        };
        return Emulator;
    })();
    mc6809.Emulator = Emulator;
})(mc6809 || (mc6809 = {}));