'use strict';

module.exports = {
  name: 'WPC-Fliptronics: White Water',
  version: 'L-5',
  pinmame: {
    knownNames: [ 'ww_p1', 'ww_p2', 'ww_p8', 'ww_p9', 'ww_l2', 'ww_d2', 'ww_l3', 'ww_d3', 'ww_l4', 'ww_d4', 'ww_l5', 'ww_d5', 'ww_lh5', 'ww_lh6', 'ww_lh6c' ],
    gameName: 'White Water',
    id: 'ww',
    vpdbId: 'whitewater',
  },
  rom: {
    u06: 'wwatr_l5.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'LEFT JET' },
    { id: 17, name: 'RIGHT JET' },
    { id: 18, name: 'CENTER JET' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTO' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'LEFT FLIP LANE' },
    { id: 27, name: 'RIGHT FLIP LANE' },
    { id: 28, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'RIVER "R2"' },
    { id: 32, name: 'RIVER "E"' },
    { id: 33, name: 'RIVER "V"' },
    { id: 34, name: 'RIVER "I"' },
    { id: 35, name: 'RIVER "R1"' },
    { id: 36, name: 'THREE BANK TOP' },
    { id: 37, name: 'THREE BANK CNTR' },
    { id: 38, name: 'THREE BANK LOWER' },

    { id: 41, name: 'LIGHT LOCK LEFT' },
    { id: 42, name: 'LIGHT LOCK RIGHT' },
    { id: 43, name: 'LEFT LOOP' },
    { id: 44, name: 'RIGHT LOOP' },
    { id: 45, name: 'SECRET PASSAGE' },
    { id: 46, name: 'LFT RAMP ENTER' },
    { id: 47, name: 'RAPIDS ENTER' },
    { id: 48, name: 'CANYON ENTRANCE' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'BALLSHOOTER' },
    { id: 54, name: 'LOWER JET ARENA' },
    { id: 55, name: 'RIGHT JET ARENA' },
    { id: 56, name: 'EXTRA BALL' },
    { id: 57, name: 'CANYON MAIN' },
    { id: 58, name: 'BIGFOOT CAVE' },

    { id: 61, name: 'WHIRLPOOL POPPER' },
    { id: 62, name: 'WHIRLPOOL EXIT' },
    { id: 63, name: 'LOCKUP RIGHT' },
    { id: 64, name: 'LOCKUP CENTER' },
    { id: 65, name: 'LOCKUP LEFT' },
    { id: 66, name: 'LEFT RAMP MAIN' },
    { id: 68, name: 'DISAS DROP ENTER' },

    { id: 71, name: 'RAPIDS RAMP MAIN' },
    { id: 73, name: 'HOT FOOT UPPER' },
    { id: 74, name: 'HOT FOOT LOWER' },
    { id: 75, name: 'DISAS DROP MAIN' },
    { id: 76, name: 'RIGHT TROUGH' },
    { id: 77, name: 'CENTER TROUGH' },
    { id: 78, name: 'LEFT TROUGH' },

    { id: 86, name: 'BIGFOOT OPTO 1' },
    { id: 87, name: 'BIGFOOT OPTO 2' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ww.jpg',
    lamps: [
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 12, y: 316, color: 'YELLOW' }],
      [{ x: 12, y: 292, color: 'WHITE' }],
      [{ x: 30, y: 292, color: 'WHITE' }],
      [{ x: 154, y: 292, color: 'WHITE' }],
      [{ x: 171, y: 292, color: 'WHITE' }],
      [{ x: 63, y: 76, color: 'YELLOW' }],
      [{ x: 51, y: 274, color: 'RED' }],

      [{ x: 35, y: 202, color: 'LBLUE' }], //21
      [{ x: 35, y: 214, color: 'LBLUE' }],
      [{ x: 36, y: 224, color: 'LBLUE' }],
      [{ x: 36, y: 236, color: 'LBLUE' }],
      [{ x: 37, y: 246, color: 'LBLUE' }],
      [{ x: 73, y: 110, color: 'RED' }],
      [{ x: 75, y: 126, color: 'LBLUE' }],
      [{ x: 76, y: 133, color: 'LBLUE' }],

      [{ x: 66, y: 216, color: 'YELLOW' }], //31
      [{ x: 87, y: 192, color: 'YELLOW' }],
      [{ x: 80, y: 196, color: 'YELLOW' }],
      [{ x: 57, y: 181, color: 'YELLOW' }],
      [{ x: 52, y: 161, color: 'RED' }],
      [{ x: 63, y: 150, color: 'LBLUE' }],
      [{ x: 69, y: 322, color: 'WHITE' }],
      [{ x: 63, y: 310, color: 'LBLUE' }],

      [{ x: 109, y: 175, color: 'YELLOW' }], //41
      [{ x: 112, y: 185, color: 'YELLOW' }],
      [{ x: 77, y: 143, color: 'LBLUE' }],
      [{ x: 107, y: 165, color: 'YELLOW' }],
      [{ x: 101, y: 150, color: 'RED' }],
      [{ x: 90, y: 147, color: 'LBLUE' }],
      [{ x: 59, y: 297, color: 'YELLOW' }],
      [{ x: 55, y: 285, color: 'ORANGE' }],

      [{ x: 178, y: 172, color: 'RED' }], //51
      [{ x: 14, y: 120, color: 'RED' }],
      [{ x: 91, y: 91, color: 'RED' }],
      [{ x: 100, y: 83, color: 'RED' }],
      [{ x: 78, y: 50, color: 'YELLOW' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 127, y: 259, color: 'RED' }],
      [{ x: 130, y: 243, color: 'YELLOW' }],

      [{ x: 87, y: 310, color: 'YELLOW' }], //61
      [{ x: 118, y: 292, color: 'YELLOW' }],
      [{ x: 105, y: 270, color: 'YELLOW' }],
      [{ x: 81, y: 282, color: 'YELLOW' }],
      [{ x: 89, y: 257, color: 'YELLOW' }],
      [{ x: 94, y: 239, color: 'YELLOW' }],
      [{ x: 111, y: 231, color: 'YELLOW' }],
      [{ x: 117, y: 239, color: 'YELLOW' }],

      [{ x: 0, y: 0, color: 'BLACK' }], //71
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 123, y: 107, color: 'RED' }],
      [{ x: 133, y: 100, color: 'RED' }],

      [{ x: 144, y: 240, color: 'YELLOW' }], //81
      [{ x: 147, y: 222, color: 'YELLOW' }],
      [{ x: 163, y: 215, color: 'YELLOW' }],
      [{ x: 163, y: 195, color: 'YELLOW' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 20, y: 395, color: 'YELLOW' }],
    ],
    flashlamps: [
      { id: 17, x: 150, y: 77 },
      { id: 19, x: 23, y: 23 },
      { id: 20, x: 39, y: 37 },
      { id: 21, x: 10, y: 170 },
      { id: 22, x: 10, y: 238 },
      { id: 23, x: 134, y: 153 },
    ],
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#3662F1',
    '#CFBB3E',
    '#8EC0E0',
    '#C7B3B7',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 86, 87,
      76, 77, 78,
      86, 87,
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      },
      {
        description: 'enable free play',
        delayMs: 3000,
        source: 'writeMemory',
        offset: 0x1B9E,
        value: 0x01,
      },
    ],
  },
  audio: {
    url: 'sound/ww.mp3',
    // Options:
    // - channel: 0 (background music), 1 (music snippet), undefined (sound fx). If channel is defined, the previous sample will be stopped
    // - loop: true (loop sample, used for background music), false (default, play once)
    // - gain: increase or reduce volume of this sample. Range 0-1. 0.5 as normal
    // - TODO duck: reduce volume of the background music. Range 0-100 in percent
    // - TODO stop: stop playback of background music
    sample: {
      2: { channel: 0, loop: true },
      3: { channel: 0, loop: true },
      4: { channel: 0, loop: true },
      5: { channel: 0, loop: true },
      6: { channel: 0, loop: true },
      7: { channel: 0, loop: true },
      8: { channel: 0, loop: true },
      9: { channel: 0, loop: true },
      10: { channel: 0, loop: true },
      11: { channel: 0, loop: true },
      12: { channel: 0, loop: true },
      13: { channel: 0, loop: true },
      14: { channel: 0, loop: true },
      15: { channel: 0, loop: true },
      16: { channel: 0, loop: true },
      17: { channel: 0, loop: true },
      18: { channel: 0, loop: true },
      19: { channel: 0, loop: true },
      20: { channel: 0, loop: true },
      21: { channel: 0, loop: true },
      22: { channel: 0, loop: true },
      23: { channel: 0, loop: true },
      26: { channel: 0, loop: true },
      49: { channel: 0, loop: true },
      50: { channel: 0, loop: true },
      51: { channel: 0, loop: true },
      52: { channel: 0, loop: true },
      53: { channel: 0, loop: true },
      54: { channel: 0, loop: true },
      55: { channel: 0, loop: true },
      56: { channel: 0, loop: true },
      57: { channel: 0, loop: true },
      58: { channel: 0, loop: true },
      59: { channel: 0, loop: true },
      60: { channel: 0, loop: true },
      61: { channel: 0, loop: true },
      62: { channel: 0, loop: true },
      63: { channel: 0, loop: true },
      64: { channel: 0, loop: true },
      65: { channel: 0, loop: true },
      66: { channel: 0, loop: true },
      67: { channel: 0, loop: true },
      68: { channel: 0, loop: true },
      69: { channel: 0, loop: true },
      70: { channel: 0, loop: true },
      71: { channel: 0, loop: true },
      72: { channel: 0, loop: true },
      73: { channel: 0, loop: true },
      74: { channel: 0, loop: true },

      // music snippets
      48: { channel: 1 },
      134: { channel: 1 },
      156: { channel: 1 },
      180: { channel: 1 },
      208: { channel: 1 },
      212: { channel: 1 },

    },
    sprite: {
      snd48: [
        0,
        4072.857142857143
      ],
      snd134: [
        6000,
        119981.2925170068
      ],
      snd156: [
        127000,
        1401.1111111111063
      ],
      snd180: [
        130000,
        994.0136054421771
      ],
      snd208: [
        132000,
        7656.0770975056585
      ],
      snd212: [
        141000,
        4883.492063492071
      ],
      snd2: [
        147000,
        119981.26984126987
      ],
      snd3: [
        268000,
        119983.28798185941
      ],
      snd4: [
        389000,
        119983.08390022675
      ],
      snd5: [
        510000,
        119983.74149659867
      ],
      snd6: [
        631000,
        119981.29251700675
      ],
      snd7: [
        752000,
        119982.04081632651
      ],
      snd8: [
        873000,
        119981.17913832198
      ],
      snd9: [
        994000,
        119981.40589569153
      ],
      snd10: [
        1115000,
        119981.42857142852
      ],
      snd11: [
        1236000,
        119981.26984126975
      ],
      snd12: [
        1357000,
        119981.42857142852
      ],
      snd13: [
        1478000,
        119981.13378684797
      ],
      snd14: [
        1599000,
        119981.45124716552
      ],
      snd15: [
        1720000,
        119982.38095238093
      ],
      snd16: [
        1841000,
        119982.76643990926
      ],
      snd17: [
        1962000,
        119981.40589569174
      ],
      snd18: [
        2083000,
        119983.28798185958
      ],
      snd19: [
        2204000,
        119981.42857142875
      ],
      snd20: [
        2325000,
        119981.45124716575
      ],
      snd21: [
        2446000,
        119984.14965986376
      ],
      snd22: [
        2567000,
        119982.67573696148
      ],
      snd23: [
        2688000,
        119984.60317460331
      ],
      snd26: [
        2809000,
        2632.0861678004803
      ],
      snd49: [
        2813000,
        119982.67573696148
      ],
      snd50: [
        2934000,
        119981.20181405875
      ],
      snd51: [
        3055000,
        119983.83219954667
      ],
      snd52: [
        3176000,
        119982.06349206339
      ],
      snd53: [
        3297000,
        119981.26984126975
      ],
      snd54: [
        3418000,
        119981.36054421775
      ],
      snd55: [
        3539000,
        119981.42857142875
      ],
      snd56: [
        3660000,
        119981.11111111121
      ],
      snd57: [
        3781000,
        119981.20181405875
      ],
      snd58: [
        3902000,
        119980.86167800466
      ],
      snd59: [
        4023000,
        119982.97052154157
      ],
      snd60: [
        4144000,
        119980.09070294756
      ],
      snd61: [
        4265000,
        119982.81179138302
      ],
      snd62: [
        4386000,
        119982.99319727902
      ],
      snd63: [
        4507000,
        119985.35147392249
      ],
      snd64: [
        4628000,
        119983.78684807266
      ],
      snd65: [
        4749000,
        119982.81179138302
      ],
      snd66: [
        4870000,
        119984.67120181432
      ],
      snd67: [
        4991000,
        119981.2471655332
      ],
      snd69: [
        5112000,
        119981.88208616739
      ],
      snd70: [
        5233000,
        19253.129251700557
      ],
      snd71: [
        5254000,
        119982.74376417248
      ],
      snd72: [
        5375000,
        119981.3832199543
      ],
      snd73: [
        5496000,
        119981.42857142829
      ],
      snd74: [
        5617000,
        119981.29251700721
      ],
      snd29: [
        5738000,
        1405.238095238019
      ],
      snd30: [
        5741000,
        2833.197278911939
      ],
      snd80: [
        5745000,
        117.91383219951967
      ],
      snd81: [
        5747000,
        117.86848072551948
      ],
      snd82: [
        5749000,
        361.4285714284051
      ],
      snd83: [
        5751000,
        318.2086167798843
      ],
      snd84: [
        5753000,
        619.2290249437065
      ],
      snd85: [
        5755000,
        156.21315192765906
      ],
      snd86: [
        5757000,
        155.80498866256676
      ],
      snd87: [
        5759000,
        412.0181405896801
      ],
      snd88: [
        5761000,
        285.7142857146755
      ],
      snd89: [
        5763000,
        758.9569161000327
      ],
      snd128: [
        5765000,
        119979.95464852647
      ],
      snd131: [
        5886000,
        1994.4671201810706
      ],
      snd132: [
        5889000,
        1238.435374149958
      ],
      snd133: [
        5892000,
        1816.2585034015137
      ],
      snd135: [
        5895000,
        2350.362811791456
      ],
      snd136: [
        5899000,
        686.7120181404971
      ],
      snd137: [
        5901000,
        386.59863945576944
      ],
      snd138: [
        5903000,
        1212.607709750955
      ],
      snd139: [
        5906000,
        3022.5170068024454
      ],
      snd140: [
        5911000,
        1243.7641723354318
      ],
      snd141: [
        5914000,
        963.6507936511407
      ],
      snd142: [
        5916000,
        1089.5011337870528
      ],
      snd143: [
        5919000,
        839.3877551015976
      ],
      snd144: [
        5921000,
        511.63265306149697
      ],
      snd145: [
        5923000,
        383.1292517006659
      ],
      snd146: [
        5925000,
        1960.5895691611295
      ],
      snd147: [
        5928000,
        2729.2970521539246
      ],
      snd148: [
        5932000,
        2289.4557823128707
      ],
      snd149: [
        5936000,
        1968.6621315195225
      ],
      snd150: [
        5939000,
        1753.1065759640114
      ],
      snd151: [
        5942000,
        1412.0634920636803
      ],
      snd152: [
        5945000,
        1940.1360544216004
      ],
      snd153: [
        5948000,
        1938.616780045777
      ],
      snd154: [
        5951000,
        1939.1836734694152
      ],
      snd155: [
        5954000,
        1943.4013605441578
      ],
      snd157: [
        5957000,
        1110.9297052153124
      ],
      snd158: [
        5960000,
        1057.9138321991195
      ],
      snd159: [
        5963000,
        914.6938775511444
      ],
      snd160: [
        5965000,
        1194.5578231288891
      ],
      snd161: [
        5968000,
        1189.7732426305083
      ],
      snd162: [
        5971000,
        938.3446712017758
      ],
      snd163: [
        5973000,
        1190.3628117916014
      ],
      snd164: [
        5976000,
        1168.52607709734
      ],
      snd165: [
        5979000,
        1000.2494331065463
      ],
      snd166: [
        5982000,
        1263.7188208618682
      ],
      snd167: [
        5985000,
        1196.8253968252611
      ],
      snd168: [
        5988000,
        1042.6303854874277
      ],
      snd169: [
        5991000,
        1249.5464852609075
      ],
      snd170: [
        5994000,
        1173.7868480722682
      ],
      snd171: [
        5997000,
        1019.2743764173429
      ],
      snd172: [
        6000000,
        1271.9274376413523
      ],
      snd173: [
        6003000,
        1186.5986394559513
      ],
      snd174: [
        6006000,
        1027.5056689342819
      ],
      snd175: [
        6009000,
        1336.462585033587
      ],
      snd176: [
        6012000,
        2574.9886621315454
      ],
      snd177: [
        6016000,
        1988.911564625596
      ],
      snd178: [
        6019000,
        2469.2290249431608
      ],
      snd179: [
        6023000,
        2177.3922902493723
      ],
      snd181: [
        6027000,
        1288.1179138321386
      ],
      snd182: [
        6030000,
        2761.995464852589
      ],
      snd183: [
        6034000,
        1612.879818593683
      ],
      snd184: [
        6037000,
        1595.283446711619
      ],
      snd185: [
        6040000,
        1980.4081632655652
      ],
      snd186: [
        6043000,
        909.0929705216695
      ],
      snd187: [
        6045000,
        910.1133786844002
      ],
      snd188: [
        6047000,
        910.3401360544012
      ],
      snd189: [
        6049000,
        908.7074829931225
      ],
      snd190: [
        6051000,
        908.0952380954841
      ],
      snd191: [
        6053000,
        908.5714285711219
      ],
      snd192: [
        6055000,
        908.1632653060296
      ],
      snd193: [
        6057000,
        907.346938775845
      ],
      snd194: [
        6059000,
        907.7777777774827
      ],
      snd195: [
        6061000,
        906.8707482992977
      ],
      snd196: [
        6063000,
        906.6666666667516
      ],
      snd197: [
        6065000,
        907.1655328798442
      ],
      snd198: [
        6067000,
        1379.7732426301081
      ],
      snd199: [
        6070000,
        778.5941043084676
      ],
      snd200: [
        6072000,
        2114.9659863949637
      ],
      snd201: [
        6076000,
        1436.6893424039517
      ],
      snd202: [
        6079000,
        2924.19501133827
      ],
      snd203: [
        6083000,
        1303.7414965983771
      ],
      snd204: [
        6086000,
        1459.7278911560352
      ],
      snd205: [
        6089000,
        2743.854875283432
      ],
      snd206: [
        6093000,
        1532.4489795921181
      ],
      snd207: [
        6096000,
        1770.9070294786216
      ],
      snd209: [
        6099000,
        1582.8798185939377
      ],
      snd210: [
        6102000,
        473.71882086190453
      ],
      snd211: [
        6104000,
        468.0498866209746
      ],
      snd213: [
        6106000,
        2299.6371882081803
      ],
      snd214: [
        6110000,
        2142.7664399088826
      ],
      snd215: [
        6114000,
        2064.5578231296895
      ],
      snd216: [
        6118000,
        1986.6893424032241
      ],
      snd217: [
        6121000,
        3369.2063492062516
      ],
      snd218: [
        6126000,
        650.6349206347295
      ],
      snd219: [
        6128000,
        1202.5623582767366
      ],
      snd220: [
        6131000,
        1186.3038548754048
      ],
      snd222: [
        6134000,
        3020.0907029475275
      ],
      snd223: [
        6139000,
        1800.5668934238201
      ],
      snd224: [
        6142000,
        1164.6485260771442
      ],
      snd225: [
        6145000,
        1591.7913832199702
      ],
      snd226: [
        6148000,
        1446.303854875623
      ],
      snd227: [
        6151000,
        4519.727891156435
      ],
      snd228: [
        6157000,
        119980.72562358266
      ],
      snd229: [
        6278000,
        1147.0294784576254
      ],
      snd230: [
        6281000,
        636.4172335597686
      ],
      snd231: [
        6283000,
        2004.149659864197
      ],
      snd232: [
        6287000,
        1759.8185941042175
      ],
      snd233: [
        6290000,
        893.5827664399767
      ],
      snd234: [
        6292000,
        1100.7029478460026
      ],
      snd235: [
        6295000,
        1249.410430838907
      ],
      snd236: [
        6298000,
        1179.8185941042902
      ],
      snd237: [
        6301000,
        1030.566893424293
      ],
      snd31232: [
        6304000,
        134.7619047619446
      ],
      snd31236: [
        6306000,
        3305.1473922905643
      ],
      snd31237: [
        6311000,
        2084.852607709763
      ],
      snd31238: [
        6315000,
        2238.6848072565044
      ],
      snd31239: [
        6319000,
        2481.3605442177504
      ],
      snd31240: [
        6323000,
        2888.1179138325024
      ],
      snd31241: [
        6327000,
        2275.2607709753647
      ],
      snd31284: [
        6331000,
        766.4172335598778
      ],
      snd31285: [
        6333000,
        748.8888888892689
      ],
      snd31286: [
        6335000,
        1086.3492063490412
      ],
      snd31287: [
        6338000,
        1293.854875283614
      ],
      snd31288: [
        6341000,
        847.4149659859904
      ],
      snd31303: [
        6343000,
        1616.598639455333
      ],
      snd31307: [
        6346000,
        868.6394557826134
      ],
      snd31308: [
        6348000,
        931.0430839004766
      ],
      snd31309: [
        6350000,
        803.5827664398312
      ],
      snd31310: [
        6352000,
        472.6530612242641
      ],
      snd31312: [
        6354000,
        615.5328798186019
      ],
      snd31317: [
        6356000,
        2071.0430838998946
      ],
      snd31318: [
        6360000,
        2164.603174603144
      ],
      snd31325: [
        6364000,
        2850.6575963720024
      ],
      snd31326: [
        6368000,
        2125.8956916099123
      ],
      snd31327: [
        6372000,
        675.850340136094
      ],
      snd31331: [
        6374000,
        427.0294784582802
      ],
      snd31332: [
        6376000,
        728.8888888888323
      ],
      snd31333: [
        6378000,
        446.19047619016783
      ],
      snd31339: [
        6380000,
        1389.5011337872347
      ],
      snd31340: [
        6383000,
        556.4172335598414
      ],
      snd31341: [
        6385000,
        760.4308390018559
      ],
      snd31342: [
        6387000,
        875.9410430839125
      ],
      snd31343: [
        6389000,
        489.9092970517813
      ],
      snd31344: [
        6391000,
        453.2879818598303
      ],
      snd31345: [
        6393000,
        594.9206349205269
      ],
      snd31346: [
        6395000,
        532.2222222221171
      ],
      snd31356: [
        6397000,
        831.995464852298
      ],
      snd31358: [
        6399000,
        1439.7278911565081
      ],
      snd68: [
        6402000,
        15726.66666666646
      ],
      snd24: [
        6419000,
        2608.6167800449402
      ],
      snd25: [
        6423000,
        3302.811791383647
      ],
      snd27: [
        6428000,
        2175.668934240093
      ],
      snd28: [
        6432000,
        1294.4217687072523
      ],
      snd31: [
        6435000,
        5087.00680272068
      ],
      snd221: [
        6442000,
        5680.74829931993
      ],
      snd31233: [
        6449000,
        1900.3628117916378
      ],
      snd31234: [
        6452000,
        2512.1315192745897
      ],
      snd31235: [
        6456000,
        3232.766439909028
      ],
      snd31242: [
        6461000,
        609.2290249434882
      ],
      snd31243: [
        6463000,
        2443.5374149661584
      ],
      snd31244: [
        6467000,
        2604.489795918198
      ],
      snd31245: [
        6471000,
        2513.287981859321
      ],
      snd31246: [
        6475000,
        2936.303854875405
      ],
      snd31247: [
        6479000,
        2470.1360544213458
      ],
      snd31248: [
        6483000,
        1891.587301587606
      ],
      snd31249: [
        6486000,
        1864.625850340417
      ],
      snd31250: [
        6489000,
        2327.142857142462
      ],
      snd31251: [
        6493000,
        3045.850340135985
      ],
      snd31252: [
        6498000,
        2942.2902494334267
      ],
      snd31253: [
        6502000,
        1906.7120181407518
      ],
      snd31254: [
        6505000,
        2909.0702947842146
      ],
      snd31255: [
        6509000,
        1296.281179138532
      ],
      snd31256: [
        6512000,
        2183.5147392293948
      ],
      snd31257: [
        6516000,
        2628.979591836469
      ],
      snd31258: [
        6520000,
        2463.356009070594
      ],
      snd31259: [
        6524000,
        2403.9682539678324
      ],
      snd31260: [
        6528000,
        2529.024943311015
      ],
      snd31261: [
        6532000,
        2660.6122448984024
      ],
      snd31262: [
        6536000,
        2541.746031745788
      ],
      snd31263: [
        6540000,
        4149.297052153997
      ],
      snd31264: [
        6546000,
        2099.0249433107238
      ],
      snd31265: [
        6550000,
        2274.5124716557257
      ],
      snd31266: [
        6554000,
        2985.351473922492
      ],
      snd31267: [
        6558000,
        3214.988662131873
      ],
      snd31268: [
        6563000,
        2888.1405895690477
      ],
      snd31269: [
        6567000,
        2804.489795918016
      ],
      snd31270: [
        6571000,
        2054.7392290245625
      ],
      snd31271: [
        6575000,
        2263.3560090698666
      ],
      snd31272: [
        6579000,
        2023.6507936506314
      ],
      snd31273: [
        6583000,
        2242.4943310661547
      ],
      snd31274: [
        6587000,
        1927.7777777779193
      ],
      snd31275: [
        6590000,
        1852.5623582763728
      ],
      snd31276: [
        6593000,
        2674.920634920454
      ],
      snd31277: [
        6597000,
        1731.428571428296
      ],
      snd31278: [
        6600000,
        2594.444444444889
      ],
      snd31279: [
        6604000,
        3297.8004535143555
      ],
      snd31280: [
        6609000,
        1084.8979591837633
      ],
      snd31281: [
        6612000,
        5067.619047618791
      ],
      snd31282: [
        6619000,
        2848.7755102041774
      ],
      snd31283: [
        6623000,
        1393.3560090699757
      ],
      snd31289: [
        6626000,
        2117.8231292515193
      ],
      snd31290: [
        6630000,
        1489.2743764175975
      ],
      snd31291: [
        6633000,
        1515.0113378686
      ],
      snd31292: [
        6636000,
        2329.6145124713803
      ],
      snd31293: [
        6640000,
        2010.7256235824025
      ],
      snd31294: [
        6644000,
        887.8231292519558
      ],
      snd31295: [
        6646000,
        1214.7392290253265
      ],
      snd31296: [
        6649000,
        1055.5555555556566
      ],
      snd31297: [
        6652000,
        1616.3265306122412
      ],
      snd31298: [
        6655000,
        1224.8979591840907
      ],
      snd31299: [
        6658000,
        1650.8163265307303
      ],
      snd31300: [
        6661000,
        1201.3378684805502
      ],
      snd31301: [
        6664000,
        1294.2857142861612
      ],
      snd31302: [
        6667000,
        2259.9773242627634
      ],
      snd31304: [
        6671000,
        911.5192743765874
      ],
      snd31305: [
        6673000,
        664.4671201811434
      ],
      snd31306: [
        6675000,
        664.376417233143
      ],
      snd31311: [
        6677000,
        1845.3968253970743
      ],
      snd31314: [
        6680000,
        1738.2766439905026
      ],
      snd31315: [
        6683000,
        1915.0566893422365
      ],
      snd31316: [
        6686000,
        2194.4671201817982
      ],
      snd31320: [
        6690000,
        902.7891156465557
      ],
      snd31321: [
        6692000,
        1336.3265306124958
      ],
      snd31322: [
        6695000,
        463.21995464859356
      ],
      snd31323: [
        6697000,
        976.9841269844619
      ],
      snd31324: [
        6699000,
        544.7392290252537
      ],
      snd31328: [
        6701000,
        970.0000000002547
      ],
      snd31329: [
        6703000,
        572.9478458051744
      ],
      snd31330: [
        6705000,
        928.866213152105
      ],
      snd31334: [
        6707000,
        2538.3219954646847
      ],
      snd31335: [
        6711000,
        1150.0453514736364
      ],
      snd31336: [
        6714000,
        1105.78231292493
      ],
      snd31337: [
        6717000,
        2434.308390023034
      ],
      snd31338: [
        6721000,
        1301.3605442174594
      ],
      snd31347: [
        6724000,
        788.7755102037772
      ],
      snd31348: [
        6726000,
        1122.6077097508096
      ],
      snd31349: [
        6729000,
        2201.0657596374585
      ],
      snd31350: [
        6733000,
        1908.8888888891233
      ],
      snd31351: [
        6736000,
        1544.920634920345
      ],
      snd31352: [
        6739000,
        2002.3809523809177
      ],
      snd31353: [
        6743000,
        1238.979591837051
      ],
      snd31354: [
        6746000,
        2579.6598639453805
      ],
      snd31355: [
        6750000,
        1212.0634920638622
      ],
      snd31357: [
        6753000,
        1944.195011337797
      ],
      snd31359: [
        6756000,
        1661.9954648522253
      ],
    },
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1C61, dataEndOffset: 0x1C80, checksumOffset: 0x1C81, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1C83, dataEndOffset: 0x1C8A, checksumOffset: 0x1C8B, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B20, dataEndOffset: 0x1BF8, checksumOffset: 0x1BF9, checksum: '16bit', name: 'ADJUSTMENT' }
    ],
    knownValues: [
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x40F, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x410, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x48B, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x1730, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x1736, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x173C, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x1742, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

      { offset: 0x17A5, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

      { offset: 0x180C, name: 'STAT_GAME_ID', type: 'string' },
      { offset: 0x1883, name: 'STAT_GAMES_STARTED', type: 'uint8', length: 3 },
      { offset: 0x1889, name: 'STAT_TOTAL_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x188F, name: 'STAT_TOTAL_FREE_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x18BF, name: 'STAT_MINUTES_ON', description: 'Minutes powered on', type: 'uint8', length: 3 },
      { offset: 0x18B9, name: 'STAT_PLAYTIME', description: 'Minutes playing', type: 'uint8', length: 5 },
      { offset: 0x18C5, name: 'STAT_BALLS_PLAYED', type: 'uint8', length: 5 },
      { offset: 0x18CB, name: 'STAT_TILT_COUNTER', type: 'uint8', length: 5 },
      { offset: 0x18E9, name: 'STAT_1_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18EF, name: 'STAT_2_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18F5, name: 'STAT_3_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18FB, name: 'STAT_4_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },

      { offset: 0x1913, name: 'STAT_LEFT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x1919, name: 'STAT_RIGHT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x19FD, name: 'STAT_LEFT_FLIPPER_TRIG', type: 'uint8', length: 3 },
      { offset: 0x1A03, name: 'STAT_RIGHT_FLIPPER_TRIG', type: 'uint8', length: 3 },

      { offset: 0x1B20, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1B9E, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1C61, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C64, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C69, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C6C, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C71, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1C74, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C79, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1C7C, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C83, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C86, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

      { offset: 0x1C93, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1C94, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
