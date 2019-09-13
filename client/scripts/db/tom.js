'use strict';

module.exports = {
  name: 'WPC-S: Theatre of Magic',
  version: '1.3X',
  rom: {
    u06: 'tom1_3x.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'LEFT RET LANE' },
    { id: 27, name: 'RIGHT RET LANE' },
    { id: 28, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 36, name: 'SUBWAY OPTO' },
    { id: 37, name: 'SPINNER' },
    { id: 38, name: 'RGT LOWER TGT' },

    { id: 41, name: 'LOCK 1' },
    { id: 42, name: 'LOCK 2' },
    { id: 43, name: 'LOCK 3' },
    { id: 44, name: 'POPPER' },
    { id: 45, name: 'LFT DRAIN EDDY' },
    { id: 47, name: 'SUBWAY MICRO' },
    { id: 48, name: 'RGT DRAIN EDDY' },

    { id: 51, name: 'L BANK TGT' },
    { id: 52, name: 'CAP BALL REST' },
    { id: 53, name: 'R LANE ENTER' },
    { id: 54, name: 'LEFT LANE ENTER' },
    { id: 55, name: 'CUBE POS 4' },
    { id: 56, name: 'CUBE POS 1' },
    { id: 57, name: 'CUBE POS 2' },
    { id: 58, name: 'CUBE POS 3' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGTH SLING' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 64, name: 'MIDDLE JET' },
    { id: 65, name: 'TOP JET' },
    { id: 66, name: 'TOP LANE 1' },
    { id: 67, name: 'TOP LANE 2' },

    { id: 71, name: 'CNTR RAMP EXIT' },
    { id: 73, name: 'R RAMP EXIT' },
    { id: 74, name: 'R RAMP EXIT 2' },
    { id: 75, name: 'CNTR RMP ENTER' },
    { id: 76, name: 'R RAMP ENTER' },
    { id: 77, name: 'CAP BALL TOP' },
    { id: 78, name: 'LOOP LEFT' },

    { id: 81, name: 'LOOP RIGHT' },
    { id: 82, name: 'CNTR RMP TGTS' },
    { id: 83, name: 'VANISH LOCK 1' },
    { id: 84, name: 'VANISH LOCK 2' },
    { id: 85, name: 'TRUNK EDDY' },
    { id: 86, name: 'R LANE EXIT' },
    { id: 87, name: 'LEFT LANE EXIT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-tom.jpg',
    lamps: [
      [{ x: 51, y: 257, color: 'RED' }],
      [{ x: 63, y: 254, color: 'RED' }],
      [{ x: 77, y: 252, color: 'RED' }],
      [{ x: 90, y: 252, color: 'RED' }],
      [{ x: 103, y: 252, color: 'RED' }],
      [{ x: 117, y: 256, color: 'RED' }],
      [{ x: 131, y: 257, color: 'RED' }],
      [{ x: 70, y: 235, color: 'LBLUE' }],

      [{ x: 133, y: 216, color: 'WHITE' }],
      [{ x: 129, y: 226, color: 'RED' }],
      [{ x: 126, y: 235, color: 'WHITE' }],
      [{ x: 123, y: 243, color: 'RED' }],
      [{ x: 150, y: 225, color: 'WHITE' }],
      [{ x: 140, y: 248, color: 'ORANGE' }, { x: 36, y: 215, color: 'ORANGE' }],
      [{ x: 75, y: 222, color: 'LBLUE' }],
      [{ x: 81, y: 136, color: 'RED' }], // 28

      [{ x: 91, y: 219, color: 'LBLUE' }],
      [{ x: 112, y: 235, color: 'LBLUE' }],
      [{ x: 101, y: 147, color: 'RED' }],
      [{ x: 100, y: 158, color: 'WHITE' }],
      [{ x: 99, y: 169, color: 'WHITE' }],
      [{ x: 104, y: 222, color: 'LBLUE' }],
      [{ x: 121, y: 17, color: 'YELLOW' }],
      [{ x: 141, y: 20, color: 'YELLOW' }], // 38

      [{ x: 16, y: 160, color: 'RED' }],
      [{ x: 24, y: 179, color: 'RED' }],
      [{ x: 30, y: 196, color: 'WHITE' }],
      [{ x: 75, y: 203, color: 'RED' }],
      [{ x: 128, y: 145, color: 'WHITE' }, { x: 41, y: 131, color: 'WHITE' }],
      [{ x: 37, y: 176, color: 'YELLOW' }],
      [{ x: 46, y: 148, color: 'RED' }],
      [{ x: 62, y: 138, color: 'RED' }], //  48

      [{ x: 71, y: 132, color: 'RED' }],
      [{ x: 74, y: 190, color: 'RED' }],
      [{ x: 74, y: 180, color: 'RED' }],
      [{ x: 51, y: 170, color: 'WHITE' }, { x: 126, y: 166, color: 'WHITE' }],
      [{ x: 73, y: 168, color: 'RED' }],
      [{ x: 71, y: 144, color: 'RED' }],
      [{ x: 72, y: 155, color: 'RED' }],
      [{ x: 44, y: 196, color: 'RED' }], // 58

      [{ x: 76, y: 279, color: 'YELLOW' }],
      [{ x: 76, y: 292, color: 'GREEN' }],
      [{ x: 90, y: 262, color: 'RED' }],
      [{ x: 76, y: 305, color: 'ORANGE' }],
      [{ x: 79, y: 318, color: 'RED' }],
      [{ x: 105, y: 279, color: 'YELLOW' }],
      [{ x: 105, y: 292, color: 'RED' }],
      [{ x: 105, y: 305, color: 'GREEN' }], // 68

      [{ x: 102, y: 318, color: 'LBLUE' }],
      [{ x: 129, y: 123, color: 'ORANGE' }],
      [{ x: 76, y: 337, color: 'RED' }],
      [{ x: 85, y: 341, color: 'RED' }],
      [{ x: 97, y: 341, color: 'ORANGE' }],
      [{ x: 106, y: 337, color: 'RED' }],
      [{ x: 163, y: 200, color: 'RED' }],
      [{ x: 34, y: 241, color: 'ORANGE' }], // 78

      [{ x: 16, y: 334, color: 'RED' }, { x: 165, y: 337, color: 'RED' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 63, y: 73, color: 'GREEN' }],
      [{ x: 90, y: 360, color: 'RED' }],
      [{ x: 160, y: 395, color: 'RED' }],
      [{ x: 40, y: 395, color: 'YELLOW' }],
    ],
    flashlamps: [
      { id: 20, x: 22, y: 319 },
      { id: 20, x: 160, y: 323 },
      { id: 23, x: 24, y: 148 },
      { id: 24, x: 144, y: 140 },
      { id: 25, x: 17, y: 105 },
      { id: 26, x: 24, y: 148 },
      { id: 27, x: 153, y: 64 },
      { id: 28, x: 111, y: 90 },
    ]
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 55, 56, 57, 58
      31, 36, 55, 56, 57, 58,
      'F2', 'F4',
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
    url: 'sound/tom.mp3',
    // Options:
    // - channel: 0 (background music), 1 (music snippet), undefined (sound fx). If channel is defined, the previous sample will be stopped
    // - loop: true (loop sample, used for background music), false (default, play once)
    // - sample: link to audio sprite name
    // - gain: increase or reduce volume of this sample. Range 0-1. 0.5 as normal
    // - TODO duck: reduce volume of the background music. Range 0-100 in percent
    // - TODO stop: stop playback of background music
    sample: {
      1: { channel: 0, loop: true },
      2: { channel: 0, loop: true },
      5: { channel: 0, loop: true },
      6: { channel: 0, loop: true },
      7: { channel: 0, loop: true },
      8: { channel: 0, loop: true },
      9: { channel: 0, loop: true },
      11: { channel: 0, loop: true },
      12: { channel: 0, loop: true },
      13: { channel: 0, loop: true },
      14: { channel: 0, loop: true },
      15: { channel: 0, loop: true },
      16: { channel: 0, loop: true },

      // music snippets
      50: { channel: 1 },
      51: { channel: 1 },
      52: { channel: 1 },
      56: { channel: 1 },
      57: { channel: 1 },
      58: { channel: 1 },
      59: { channel: 1 },
      60: { channel: 1 },
      61: { channel: 1 },
      62: { channel: 1 },
      63: { channel: 1 },
      70: { channel: 1 },
      71: { channel: 1 },
      300: { channel: 1 },
    },
    sprite: {
      snd50: [
        0,
        3034.557823129252
      ],
      snd51: [
        5000,
        4172.335600907029
      ],
      snd52: [
        11000,
        3260.9523809523803
      ],
      snd56: [
        16000,
        2700.7709750566883
      ],
      snd57: [
        20000,
        4723.809523809525
      ],
      snd58: [
        26000,
        5844.172335600909
      ],
      snd59: [
        33000,
        5844.172335600909
      ],
      snd60: [
        40000,
        2384.3990929705187
      ],
      snd61: [
        44000,
        3615.056689342403
      ],
      snd62: [
        49000,
        5844.172335600909
      ],
      snd63: [
        56000,
        2128.9795918367317
      ],
      snd70: [
        60000,
        1995.4648526077108
      ],
      snd71: [
        63000,
        2570.1587301587238
      ],
      snd300: [
        67000,
        5237.551020408162
      ],
      snd1: [
        74000,
        119983.31065759638
      ],
      snd2: [
        195000,
        120002.17687074831
      ],
      snd5: [
        317000,
        119980.40816326534
      ],
      snd6: [
        438000,
        119980.40816326534
      ],
      snd9: [
        559000,
        119977.50566893422
      ],
      snd11: [
        680000,
        119980.40816326534
      ],
      snd12: [
        801000,
        119980.40816326534
      ],
      snd13: [
        922000,
        119990.5668934241
      ],
      snd15: [
        1043000,
        119968.79818594106
      ],
      snd41: [
        1164000,
        2546.9387755101707
      ],
      snd53: [
        1168000,
        2291.519274376469
      ],
      snd54: [
        1172000,
        2529.52380952388
      ],
      snd55: [
        1176000,
        2291.519274376469
      ],
      snd100: [
        1180000,
        2337.959183673547
      ],
      snd101: [
        1184000,
        3382.8571428571195
      ],
      snd102: [
        1189000,
        1030.3854875282923
      ],
      snd103: [
        1192000,
        3824.036281179133
      ],
      snd104: [
        1197000,
        2117.369614512427
      ],
      snd105: [
        1201000,
        927.3469387755995
      ],
      snd107: [
        1203000,
        2384.399092970625
      ],
      snd108: [
        1207000,
        3954.648526077108
      ],
      snd109: [
        1212000,
        1687.8004535146829
      ],
      snd110: [
        1215000,
        1711.0204081632219
      ],
      snd111: [
        1218000,
        1365.623582766375
      ],
      snd112: [
        1221000,
        2410.5215419501747
      ],
      snd113: [
        1225000,
        5281.0884353741585
      ],
      snd114: [
        1232000,
        3046.1678004535315
      ],
      snd115: [
        1237000,
        1377.2335600906445
      ],
      snd116: [
        1240000,
        2541.1337868481496
      ],
      snd117: [
        1244000,
        2088.3446712018667
      ],
      snd118: [
        1248000,
        3568.6167800454314
      ],
      snd119: [
        1253000,
        1966.4399092971507
      ],
      snd120: [
        1256000,
        1850.3401360544558
      ],
      snd121: [
        1259000,
        3220.3174603173466
      ],
      snd122: [
        1264000,
        2520.816326530621
      ],
      snd123: [
        1268000,
        1551.3832199546869
      ],
      snd124: [
        1271000,
        944.76190476189
      ],
      snd125: [
        1273000,
        3452.5170068027364
      ],
      snd126: [
        1278000,
        2337.959183673547
      ],
      snd127: [
        1282000,
        1153.741496598741
      ],
      snd128: [
        1285000,
        2459.863945578263
      ],
      snd129: [
        1289000,
        1699.4104308389524
      ],
      snd130: [
        1292000,
        1800.9977324263673
      ],
      snd133: [
        1295000,
        1316.2811791382865
      ],
      snd134: [
        1298000,
        1525.2607709751373
      ],
      snd135: [
        1301000,
        3887.8911564625014
      ],
      snd136: [
        1306000,
        1153.741496598741
      ],
      snd138: [
        1309000,
        689.3424036281885
      ],
      snd142: [
        1311000,
        1920.0000000000728
      ],
      snd143: [
        1314000,
        1316.2811791382865
      ],
      snd144: [
        1317000,
        1461.4058956915414
      ],
      snd145: [
        1320000,
        277.1882086167352
      ],
      snd146: [
        1322000,
        1118.9115646259324
      ],
      snd147: [
        1325000,
        2470.0226757370274
      ],
      snd148: [
        1329000,
        1803.9002267573778
      ],
      snd149: [
        1332000,
        898.3219954648121
      ],
      snd152: [
        1334000,
        2454.0589569160147
      ],
      snd153: [
        1338000,
        1641.360544217605
      ],
      snd155: [
        1341000,
        1191.47392290256
      ],
      snd156: [
        1344000,
        2770.4308390023016
      ],
      snd157: [
        1348000,
        1641.360544217605
      ],
      snd158: [
        1351000,
        2665.941043083876
      ],
      snd199: [
        1355000,
        3005.532879818702
      ],
      snd200: [
        1360000,
        2082.5396825396183
      ],
      snd201: [
        1364000,
        1896.7800453515338
      ],
      snd207: [
        1367000,
        2779.1383219955605
      ],
      snd301: [
        1371000,
        1133.4240362812125
      ],
      snd302: [
        1374000,
        1362.7210884353644
      ],
      snd980: [
        1377000,
        69.65986394561696
      ],
      snd981: [
        1379000,
        85.62358276640225
      ],
      snd982: [
        1381000,
        307.6643990930279
      ],
      snd983: [
        1383000,
        262.6757369614552
      ],
      snd984: [
        1385000,
        579.0476190475147
      ],
      snd985: [
        1387000,
        124.80725623572653
      ],
      snd986: [
        1389000,
        124.80725623572653
      ],
      snd987: [
        1391000,
        364.2630385486427
      ],
      snd988: [
        1393000,
        246.7120181406699
      ],
      snd989: [
        1395000,
        689.3424036281885
      ],
      snd7: [
        1397000,
        11892.970521541883
      ],
      snd8: [
        1410000,
        119990.5668934241
      ],
      snd14: [
        1531000,
        1362.7210884353644
      ],
      snd16: [
        1534000,
        13689.614512471735
      ],
      snd151: [
        1549000,
        4195.555555555529
      ],
      snd159: [
        1555000,
        1269.8412698412085
      ],
      snd202: [
        1558000,
        1780.6802721088388
      ],
      snd203: [
        1561000,
        1034.7392290250355
      ],
      snd204: [
        1564000,
        1789.3877551020978
      ],
      snd205: [
        1567000,
        1359.818594104354
      ],
      snd206: [
        1570000,
        2105.7596371881573
      ],
      snd400: [
        1574000,
        2364.0816326530967
      ],
      snd500: [
        1578000,
        2500.4988662130927
      ],
      snd502: [
        1582000,
        1502.0408163265984
      ],
      snd503: [
        1585000,
        1026.0317460317765
      ],
      snd504: [
        1588000,
        1136.326530612223
      ],
      snd505: [
        1591000,
        967.981859410429
      ],
      snd506: [
        1593000,
        1414.9659863944635
      ],
      snd507: [
        1596000,
        1943.2199546486117
      ],
      snd510: [
        1599000,
        1740.0453514740093
      ],
      snd511: [
        1602000,
        2195.7369614513027
      ],
      snd512: [
        1606000,
        3139.0476190476875
      ],
      snd513: [
        1611000,
        2448.2539682539937
      ],
      snd514: [
        1615000,
        1708.1179138322113
      ],
      snd528: [
        1618000,
        1153.741496598741
      ],
      snd529: [
        1621000,
        1316.2811791382865
      ],
      snd530: [
        1624000,
        1237.913832199638
      ],
      snd531: [
        1627000,
        1150.839002267503
      ],
      snd532: [
        1630000,
        1452.6984126985099
      ],
      snd533: [
        1633000,
        1531.0657596371584
      ],
      snd534: [
        1636000,
        2102.8571428571468
      ],
      snd535: [
        1640000,
        1005.714285714248
      ],
      snd536: [
        1643000,
        1200.1814058955915
      ],
      snd537: [
        1646000,
        1362.7210884353644
      ],
      snd538: [
        1649000,
        1261.133786848177
      ],
      snd539: [
        1652000,
        1316.2811791382865
      ],
      snd540: [
        1655000,
        1383.038548752893
      ],
      snd541: [
        1658000,
        2143.4920634919763
      ],
      snd542: [
        1662000,
        1992.5623582767003
      ],
      snd543: [
        1665000,
        1873.5600907029948
      ],
      snd544: [
        1668000,
        1995.4648526077108
      ],
      snd546: [
        1671000,
        1960.6349206349023
      ],
      snd547: [
        1674000,
        2407.6190476189367
      ],
      snd548: [
        1678000,
        1783.5827664398494
      ],
      snd549: [
        1681000,
        1568.7981859409774
      ],
      snd550: [
        1684000,
        1815.5102040816473
      ],
      snd551: [
        1687000,
        1740.0453514740093
      ],
      snd552: [
        1690000,
        1629.7505668933354
      ],
      snd553: [
        1693000,
        1940.3174603173738
      ],
      snd554: [
        1696000,
        1499.1383219953605
      ],
      snd556: [
        1699000,
        2018.6848072562498
      ],
      snd557: [
        1703000,
        619.6825396825716
      ],
      snd558: [
        1705000,
        1356.9160997733434
      ],
      snd559: [
        1708000,
        2012.8798185940013
      ],
      snd560: [
        1712000,
        1687.8004535146829
      ],
      snd564: [
        1715000,
        2358.2766439908482
      ],
      snd567: [
        1719000,
        1673.2879818594029
      ],
      snd570: [
        1722000,
        1789.3877551020978
      ],
      snd571: [
        1725000,
        1908.3900226758033
      ],
      snd573: [
        1728000,
        1827.1201814059168
      ],
      snd574: [
        1731000,
        2099.954648526136
      ],
      snd577: [
        1735000,
        1214.693877551099
      ],
      snd578: [
        1738000,
        2558.54875283444
      ],
      snd580: [
        1742000,
        2291.519274376469
      ],
      snd583: [
        1746000,
        1414.9659863944635
      ],
      snd585: [
        1749000,
        2073.8321995465867
      ],
      snd586: [
        1753000,
        1246.6213151926695
      ],
      snd587: [
        1756000,
        1650.0680272108639
      ],
      snd588: [
        1759000,
        973.7868480724501
      ],
      snd589: [
        1761000,
        1214.693877551099
      ],
      snd590: [
        1764000,
        2549.841269841181
      ],
      snd591: [
        1768000,
        3348.027210884311
      ],
      snd592: [
        1773000,
        1800.9977324263673
      ],
      snd594: [
        1776000,
        1084.081632653124
      ],
      snd597: [
        1779000,
        2155.102040816246
      ],
      snd602: [
        1783000,
        2396.0090702948946
      ],
      snd604: [
        1787000,
        1255.3287981859285
      ],
      snd605: [
        1790000,
        1275.646258503457
      ],
      snd606: [
        1793000,
        1461.4058956915414
      ],
      snd607: [
        1796000,
        1496.23582766435
      ],
      snd608: [
        1799000,
        2117.369614512427
      ],
      snd609: [
        1803000,
        1322.086167800535
      ],
      snd610: [
        1806000,
        1452.6984126985099
      ],
      snd611: [
        1809000,
        1914.1950113378243
      ],
      snd612: [
        1812000,
        1719.7278911564808
      ],
      snd613: [
        1815000,
        2773.333333333312
      ],
      snd700: [
        1819000,
        2178.321995464785
      ],
      snd701: [
        1823000,
        387.4829931971817
      ],
      snd702: [
        1825000,
        683.5374149659401
      ],
      snd703: [
        1827000,
        596.4625850340326
      ],
      snd704: [
        1829000,
        689.3424036281885
      ],
      snd705: [
        1831000,
        689.3424036281885
      ],
      snd706: [
        1833000,
        918.6394557823405
      ],
      snd708: [
        1835000,
        2076.7346938775972
      ],
      snd711: [
        1839000,
        1354.0136054421055
      ],
      snd723: [
        1842000,
        2126.0770975056857
      ],
      snd724: [
        1846000,
        2114.4671201814162
      ],
      snd725: [
        1850000,
        1359.818594104354
      ],
      snd726: [
        1853000,
        1191.47392290256
      ],
      snd727: [
        1856000,
        1696.5079365079418
      ],
      snd728: [
        1859000,
        1728.4353741497398
      ],
      snd729: [
        1862000,
        1612.3356009070449
      ],
      snd730: [
        1865000,
        1176.9614512470525
      ],
      snd731: [
        1868000,
        985.3968253967196
      ],
      snd732: [
        1870000,
        1490.4308390023289
      ],
      snd733: [
        1873000,
        1731.3378684807503
      ],
      snd735: [
        1876000,
        480.36281179133766
      ],
      snd736: [
        1878000,
        1322.086167800535
      ],
      snd737: [
        1881000,
        1531.0657596371584
      ],
      snd738: [
        1884000,
        976.689342403688
      ],
      snd739: [
        1886000,
        1487.528344671091
      ],
      snd740: [
        1889000,
        1116.0090702946945
      ],
      snd741: [
        1892000,
        2070.929705215349
      ],
      snd742: [
        1896000,
        1452.6984126985099
      ],
      snd743: [
        1899000,
        1278.5487528344675
      ],
      snd744: [
        1902000,
        1052.154195011326
      ],
      snd746: [
        1905000,
        2140.5895691609658
      ],
      snd747: [
        1909000,
        1111.6553287981787
      ],
      snd749: [
        1912000,
        2738.5034013605036
      ],
      snd750: [
        1916000,
        2526.621315192642
      ],
      snd751: [
        1920000,
        2262.4943310656818
      ],
      snd752: [
        1924000,
        3002.630385487464
      ],
      snd753: [
        1929000,
        2346.6666666665787
      ],
      snd754: [
        1933000,
        689.3424036281885
      ],
      snd755: [
        1935000,
        1928.7074829931043
      ],
      snd756: [
        1938000,
        1641.360544217605
      ],
      snd759: [
        1941000,
        3054.8752834467905
      ],
      snd761: [
        1946000,
        1536.8707482994068
      ],
      snd762: [
        1949000,
        1641.360544217605
      ],
      snd764: [
        1952000,
        1539.7732426304174
      ],
      snd765: [
        1955000,
        1383.038548752893
      ],
      snd766: [
        1958000,
        1681.9954648526618
      ],
      snd768: [
        1961000,
        2416.3265306121957
      ],
      snd769: [
        1965000,
        1417.8684807257014
      ],
      snd772: [
        1968000,
        1246.6213151926695
      ],
      snd775: [
        1971000,
        1255.3287981859285
      ],
      snd776: [
        1974000,
        2277.006802721189
      ],
      snd777: [
        1978000,
        2303.1292517007387
      ],
      snd778: [
        1982000,
        1687.8004535146829
      ],
      snd779: [
        1985000,
        1063.7641723355955
      ],
      snd780: [
        1988000,
        1716.8253968254703
      ],
      snd801: [
        1991000,
        2906.8480725622976
      ],
      snd803: [
        1995000,
        1322.086167800535
      ],
      snd805: [
        1998000,
        1885.1700680272643
      ],
      snd807: [
        2001000,
        1681.9954648526618
      ],
      snd808: [
        2004000,
        1562.9931972789564
      ],
      snd809: [
        2007000,
        1414.9659863944635
      ],
      snd810: [
        2010000,
        1504.943310657609
      ],
      snd811: [
        2013000,
        2114.4671201814162
      ],
      snd812: [
        2017000,
        1107.301587301663
      ],
      snd813: [
        2020000,
        2117.369614512427
      ],
      snd814: [
        2024000,
        1943.2199546486117
      ],
      snd815: [
        2027000,
        1641.360544217605
      ],
      snd818: [
        2030000,
        2277.006802721189
      ],
    },
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1C61, dataEndOffset: 0x1C80, checksumOffset: 0x1C81, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1C83, dataEndOffset: 0x1D8A, checksumOffset: 0x1D8B, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B20, dataEndOffset: 0x1BF8, checksumOffset: 0x1BF9, checksum: '16bit', name: 'ADJUSTMENT' }
    ],
    knownValues: [
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      //{ offset: 0x326, name: 'TEXT', description: 'random visible text', type: 'string' },
      { offset: 0x3AF, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3B0, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x43B, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x629, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A6, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AC, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B2, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

/*
# BALL STATE TOM

INITIAL STATE
- TROUGH 1, TROUGH 2, TROUGH 3 and TROUGH 4 are off (OPTO)
- TROUGH JAM in on (OPTO)

BALL IN SHOOTER LANE
- TROUGH 1, TROUGH 2, and TROUGH 3 are off (OPTO)
- TROUGH JAM and THROUGH 4 are on (OPTO)
- RIGHT RETURN LANE is on

BALL IN GAME
- TROUGH 1, TROUGH 2, and TROUGH 3 are off (OPTO)
- TROUGH JAM and THROUGH 4 are on (OPTO)
- SHOOTER LANE is off

BALL DRAIN
- TROUGH 1, TROUGH 2, TROUGH 3 and TROUGH 4 are off (OPTO)
- TROUGH JAM is on (OPTO)
*/
