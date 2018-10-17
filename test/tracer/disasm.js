params ='use strict';
//---------- Disassembler, source https://github.com/maly/6809js/blob/master/6809.js

module.exports = {
  disasm,
};


/*
ILLEGAL 0
DIRECT 1
INHERENT 2
BRANCH_REL_16 3
IMMEDIAT_8 4
BRANCH_REL_8 5
INDEXED 6
EXTENDED 7
IMMEDIAT_16 8
PSHS 10
PSHU 11
EXG, TFR 20
*/
var ds = [
[2,  1,"NEG"],
[1,  0,"???"],
[1,  0,"???"],
[2,  1,"COM"],
[2,  1,"LSR"],
[1,  0,"???"],
[2,  1,"ROR"],
[2,  1,"ASR"],
[2,  1,"LSL"],
[2,  1,"ROL"],
[2,  1,"DEC"],
[1,  0,"???"],
[2,  1,"INC"],
[2,  1,"TST"],
[2,  1,"JMP"],
[2,  1,"CLR"],
[1,  0,"Prefix"],
[1,  0,"Prefix"],
[1,  2,"NOP"],
[1,  2,"SYNC"],
[1,  0,"???"],
[1,  0,"???"],
[3,  3,"LBRA"],
[3,  3,"LBSR"],
[1,  0,"???"],
[1,  2,"DAA"],
[2,  4,"ORCC"],
[1,  0,"???"],
[2,  4,"ANDCC"],
[1,  2,"SEX"],
[2,  20,"EXG"],
[2,  20,"TFR"],
[2,  5,"BRA"],
[2,  5,"BRN"],
[2,  5,"BHI"],
[2,  5,"BLS"],
[2,  5,"BCC"],
[2,  5,"BCS"],
[2,  5,"BNE"],
[2,  5,"BEQ"],
[2,  5,"BVC"],
[2,  5,"BVS"],
[2,  5,"BPL"],
[2,  5,"BMI"],
[2,  5,"BGE"],
[2,  5,"BLT"],
[2,  5,"BGT"],
[2,  5,"BLE"],
[2,  6,"LEAX"],
[2,  6,"LEAY"],
[2,  6,"LEAS"],
[2,  6,"LEAU"],
[2,  10,"PSHS"],
[2,  10,"PULS"],
[2,  11,"PSHU"],
[2,  11,"PULU"],
[1,  0,"???"],
[1,  2,"RTS"],
[1,  2,"ABX"],
[1,  2,"RTI"],
[2,  2,"CWAI"],
[1,  2,"MUL"],
[1,  2,"RESET"],
[1,  2,"SWI1"],
[1,  2,"NEGA"],
[1,  0,"???"],
[1,  0,"???"],
[1,  2,"COMA"],
[1,  2,"LSRA"],
[1,  0,"???"],
[1,  2,"RORA"],
[1,  2,"ASRA"],
[1,  2,"ASLA"],
[1,  2,"ROLA"],
[1,  2,"DECA"],
[1,  0,"???"],
[1,  2,"INCA"],
[1,  2,"TSTA"],
[1,  0,"???"],
[1,  2,"CLRA"],
[1,  2,"NEGB"],
[1,  0,"???"],
[1,  0,"???"],
[1,  2,"COMB"],
[1,  2,"LSRB"],
[1,  0,"???"],
[1,  2,"RORB"],
[1,  2,"ASRB"],
[1,  2,"ASLB"],
[1,  2,"ROLB"],
[1,  2,"DECB"],
[1,  0,"???"],
[1,  2,"INCB"],
[1,  2,"TSTB"],
[1,  0,"???"],
[1,  2,"CLRB"],
[2,  6,"NEG"],
[1,  0,"???"],
[1,  0,"???"],
[2,  6,"COM"],
[2,  6,"LSR"],
[1,  0,"???"],
[2,  6,"ROR"],
[2,  6,"ASR"],
[2,  6,"LSL"],
[2,  6,"ROL"],
[2,  6,"DEC"],
[1,  0,"???"],
[2,  6,"INC"],
[2,  6,"TST"],
[2,  6,"JMP"],
[2,  6,"CLR"],
[3,  7,"NEG"],
[1,  0,"???"],
[1,  0,"???"],
[3,  7,"COM"],
[3,  7,"LSR"],
[1,  0,"???"],
[3,  7,"ROR"],
[3,  7,"ASR"],
[3,  7,"LSL"],
[3,  7,"ROL"],
[3,  7,"DEC"],
[1,  0,"???"],
[3,  7,"INC"],
[3,  7,"TST"],
[3,  7,"JMP"],
[3,  7,"CLR"],
[2,  4,"SUBA"],
[2,  4,"CMPA"],
[2,  4,"SBCA"],
[3,  8,"SUBD"],
[2,  4,"ANDA"],
[2,  4,"BITA"],
[2,  4,"LDA"],
[1,  0,"???"],
[2,  4,"EORA"],
[2,  4,"ADCA"],
[2,  4,"ORA"],
[2,  4,"ADDA"],
[3,  8,"CMPX"],
[2,  5,"BSR"],
[3,  8,"LDX"],
[1,  0,"???"],
[2,  1,"SUBA"],
[2,  1,"CMPA"],
[2,  1,"SBCA"],
[2,  1,"SUBd"],
[2,  1,"ANDA"],
[2,  1,"BITA"],
[2,  1,"LDA"],
[2,  1,"STA"],
[2,  1,"EORA"],
[2,  1,"ADCA"],
[2,  1,"ORA"],
[2,  1,"ADDA"],
[2,  1,"CMPX"],
[2,  1,"JSR"],
[2,  1,"LDX"],
[2,  1,"STX"],
[2,  6,"SUBA"],
[2,  6,"CMPA"],
[2,  6,"SBCA"],
[2,  6,"SUBD"],
[2,  6,"ANDA"],
[2,  6,"BITA"],
[2,  6,"LDA"],
[2,  6,"STA"],
[2,  6,"EORA"],
[2,  6,"ADCA"],
[2,  6,"ORA"],
[2,  6,"ADDA"],
[2,  6,"CMPX"],
[2,  6,"JSR"],
[2,  6,"LDX"],
[2,  6,"STX"],
[3,  7,"SUBA"],
[3,  7,"CMPA"],
[3,  7,"SBCA"],
[3,  7,"SUBD"],
[3,  7,"ANDA"],
[3,  7,"BITA"],
[3,  7,"LDA"],
[3,  7,"STA"],
[3,  7,"EORA"],
[3,  7,"ADCA"],
[3,  7,"ORA"],
[3,  7,"ADDA"],
[3,  7,"CMPX"],
[3,  7,"JSR"],
[3,  7,"LDX"],
[3,  7,"STX"],
[2,  4,"SUBB"],
[2,  4,"CMPB"],
[2,  4,"SBCB"],
[3,  8,"ADDD"],
[2,  4,"ANDB"],
[2,  4,"BITB"],
[2,  4,"LDB"],
[1,  0,"???"],
[2,  4,"EORB"],
[2,  4,"ADCB"],
[2,  4,"ORB"],
[2,  4,"ADDB"],
[3,  8,"LDD"],
[1,  0,"???"],
[3,  8,"LDU"],
[1,  0,"???"],
[2,  1,"SUBB"],
[2,  1,"CMPB"],
[2,  1,"SBCB"],
[2,  1,"ADDD"],
[2,  1,"ANDB"],
[2,  1,"BITB"],
[2,  1,"LDB"],
[2,  1,"STB"],
[2,  1,"EORB"],
[2,  1,"ADCB"],
[2,  1,"ORB "],
[2,  1,"ADDB"],
[2,  1,"LDD "],
[2,  1,"STD "],
[2,  1,"LDU "],
[2,  1,"STU "],
[2,  6,"SUBB"],
[2,  6,"CMPB"],
[2,  6,"SBCB"],
[2,  6,"ADDD"],
[2,  6,"ANDB"],
[2,  6,"BITB"],
[2,  6,"LDB"],
[2,  6,"STB"],
[2,  6,"EORB"],
[2,  6,"ADCB"],
[2,  6,"ORB"],
[2,  6,"ADDB"],
[2,  6,"LDD"],
[2,  6,"STD"],
[2,  6,"LDU"],
[2,  6,"STU"],
[3,  7,"SUBB"],
[3,  7,"CMPB"],
[3,  7,"SBCB"],
[3,  7,"ADDD"],
[3,  7,"ANDB"],
[3,  7,"BITB"],
[3,  7,"LDB"],
[3,  7,"STB"],
[3,  7,"EORB"],
[3,  7,"ADCB"],
[3,  7,"ORB"],
[3,  7,"ADDB"],
[3,  7,"LDD"],
[3,  7,"STD"],
[3,  7,"LDU"],
[3,  7,"STU"]
];

var ds11 = {
0x3F: [2,2,"SWI3"],
0x83: [4,8,"CMPU"],
0x8C: [4,8,"CMPS"],
0x93: [3,1,"CMPU"],
0x9C: [3,1,"CMPS"],
0xA3: [3,6,"CMPU"],
0xAC: [3,6,"CMPS"],
0xB3: [4,7,"CMPU"],
0xBC: [4,7,"CMPS"]
};

var ds10 = {
0x21:[5,3,"LBRN"],
0x22:[5,3,"LBHI"],
0x23:[5,3,"LBLS"],
0x24:[5,3,"LBCC"],
0x25:[5,3,"LBCS"],
0x26:[5,3,"LBNE"],
0x27:[5,3,"LBEQ"],
0x28:[5,3,"LBVC"],
0x29:[5,3,"LBVS"],
0x2a:[5,3,"LBPL"],
0x2b:[5,3,"LBMI"],
0x2c:[5,3,"LBGE"],
0x2d:[5,3,"LBLT"],
0x2e:[5,3,"LBGT"],
0x2f:[5,3,"LBLE"],
0x3F:[2,2,"SWI2"],
0x83:[4,8,"CMPD"],
0x8C:[4,8,"CMPY"],
0x8E:[4,8,"LDY"],
0x93:[3,1,"CMPD"],
0x9C:[3,1,"CMPY"],
0x9E:[3,1,"LDY"],
0x9F:[3,1,"STY"],
0xA3:[3,6,"CMPD"],
0xAC:[3,6,"CMPY"],
0xAE:[3,6,"LDY"],
0xAF:[3,6,"STY"],
0xB3:[4,7,"CMPD"],
0xBC:[4,7,"CMPY"],
0xBE:[4,7,"LDY"],
0xBF:[4,7,"STY"],
0xCE:[4,8,"LDS"],
0xDE:[3,1,"LDS"],
0xDF:[3,1,"STS"],
0xEE:[3,6,"LDS"],
0xEF:[3,6,"STS"],
0xFE:[4,7,"LDS"],
0xFF:[4,7,"STS"]
};
/*
ILLEGAL 0
DIRECT 1
INHERENT 2
BRANCH_REL_16 3
IMMEDIAT_8 4
BRANCH_REL_8 5
INDEXED 6
EXTENDED 7
IMMEDIAT_16 8
*/

function disasm(i, a, b, c, d, pc) {
    var toHexN = function(n,d) {
      var s = n.toString(16);
      while (s.length <d) {s = '0'+s;}
      return s.toUpperCase();
    };

    var toHex2 = function(n) {return toHexN(n & 0xff,2);};
    var toHex4 = function(n) {return toHexN(n,4);};
    var rx,ro,j;
      var sx = ds[i];
      if (i===0x10) {
        sx = ds10[a];
        if (sx===undefined) {
            return ["???",2];
        }
        i=a;a=b;b=c;c=d;
      }
      if (i===0x11) {
        sx = ds11[a];
        if (sx===undefined) {
            return ["???",2];
        }
        i=a;a=b;b=c;c=d;
      }
      var bytes = sx[0];
      var mode = sx[1];
      var mnemo = sx[2];
      var params = '';

      switch (mode) {
        case 0: //invalid
            break;
        case 1: //direct page
            params = "$"+toHex2(a);
            break;
        case 2: // inherent
            break;
        case 3: //brel16
            params = "$"+toHex4((a*256+b)<32768 ? (a*256+b+pc):(a*256+b+pc-65536));
            break;
        case 4: //imm8
            params = "#$"+toHex2(a);
            break;
        case 5: //brel8
            params = "$"+toHex4((a)<128 ? (a+pc+2):(a+pc-254));
            break;
        case 6: //indexed, postbyte etc.
            var pb = a;
            var ixr = ["X","Y","U","S"][(pb & 0x60)>>5];
            if (!(pb & 0x80)) {
                //direct5
                var disp = pb & 0x1f;
                if (disp>15) disp = disp-32;
                params = '$'+disp+','+ixr;
                break;
            }
            var ind = pb & 0x10;
            var mod = pb & 0x0f;
            var ofs8 = (b>127)?(b-256):b;
            var ofs16 = ((b*256+c)>32767)?((b*256+c)-65536):(b*256+c);
            if (!ind) {
                switch (mod) {
                    case 0: params =","+ixr+'+'; break;
                    case 1: params =","+ixr+'++'; break;
                    case 2: params =",-"+ixr; break;
                    case 3: params =",--"+ixr; break;
                    case 4: params =","+ixr; break;
                    case 5: params ="B,"+ixr; break;
                    case 6: params ="A,"+ixr; break;
                    case 7: params ="???"; break;
                    case 8: params =ofs8+","+ixr; bytes++; break;
                    case 9: params =ofs16+","+ixr; bytes+=2; break;
                    case 10: params ="???"; break;
                    case 11: params ="D,"+ixr; break;
                    case 12: params =ofs8+",PC"; bytes++; break;
                    case 13: params =ofs16+",PC"; bytes+=2; break;
                    case 14: params ="???"; break;
                    case 15: params ="$"+toHex4((b*256+c)); bytes+=2; break;
                }
            }  else {
                switch (mod) {
                    case 0: params ="???"; break;
                    case 1: params ="[,"+ixr+'++]'; break;
                    case 2: params ="???"; break;
                    case 3: params ="[,--"+ixr+']'; break;
                    case 4: params ="[,"+ixr+']'; break;
                    case 5: params ="[B,"+ixr+']'; break;
                    case 6: params ="[A,"+ixr+']'; break;
                    case 7: params ="???"; break;
                    case 8: params ="["+ofs8+","+ixr+']'; bytes++; break;
                    case 9: params ="["+ofs16+","+ixr+']'; bytes+=2; break;
                    case 10: params ="???"; break;
                    case 11: params ="[D,"+ixr+']'; break;
                    case 12: params ="["+ofs8+",PC]"; bytes++; break;
                    case 13: params ="["+ofs16+",PC]"; bytes+=2; break;
                    case 14: params ="???"; break;
                    case 15: params ="[$"+toHex4((b*256+c))+']'; bytes+=2; break;
                }
            }

            break;
        case 7: //extended
            params = "$"+toHex4(a*256+b);
            break;
        case 8: //imm16
            params = "#$"+toHex4(a*256+b);
            break;

        case 10: //pshs, puls
            rx = ['PC','U','Y','X','DP','B','A','CC'];
            ro = [];
            for (j=0;j<8;j++) {
                if ((a & 1)!==0) {ro.push(rx[7-j]);}
                a>>=1;
            }
            params = ro.join(',');
            break;
        case 11: //pshs, puls
            rx = ['PC','S','Y','X','DP','B','A','CC'];
            ro = [];
            for (j=0;j<8;j++) {
                if ((a & 1)!==0) {ro.push(rx[7-j]);}
                a>>=1;
            }
            params = ro.join(',');
            break;
        case 20: //TFR etc
            rx = ['D','X','Y','U','S','PC','?','?','A','B','CC','DP','?','?','?','?'];
            params = rx[a>>4]+','+rx[a&0x0f];
            break;
      }

      return { mnemo, params, bytes };
    };
