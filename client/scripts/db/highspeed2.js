'use strict';

module.exports = {
  name: 'WPC-Fliptronics: High Speed II, The Getaway',
  version: 'L-5',
  rom: {
    u06: 'GETAW_L5.ROM',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT FREEWAY BOT' },
    { id: 16, name: 'LEFT FREEWAY TOP' },
    { id: 17, name: 'FREEWAY BOT' },
    { id: 18, name: 'FREEWAY TOP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'LEFT OUT LANE' },
    { id: 26, name: 'LEFT RET LANE' },
    { id: 27, name: 'RIGHT RET LANE' },
    { id: 28, name: 'RIGHT OUT LANE' },

    { id: 31, name: 'LEFT SLING' },
    { id: 32, name: 'RIGHT SLING' },
    { id: 33, name: 'GEAR SHIFTER LO' },
    { id: 34, name: 'GEAR SHIFTER HI' },
    { id: 36, name: 'TOP RED' },
    { id: 37, name: 'MIDDLE RED' },
    { id: 38, name: 'BOTTOM RED' },

    { id: 41, name: 'TOP YELLOW' },
    { id: 42, name: 'MID YELLOW' },
    { id: 43, name: 'BOT YELLOW' },
    { id: 44, name: 'R BANK BOT' },
    { id: 45, name: 'R BANK MID' },
    { id: 46, name: 'R BANK TOP' },

    { id: 51, name: 'TOP GREEN' },
    { id: 52, name: 'MIDDLE GREEN' },
    { id: 53, name: 'BOTTOM GREEN' },
    { id: 54, name: 'RAMP DOWN' },
    { id: 55, name: 'OUTHOLE' },
    { id: 56, name: 'LEFT TROUGH' },
    { id: 57, name: 'CENTER TROUGH' },
    { id: 58, name: 'RIGHT TROUGH' },

    { id: 61, name: 'TOP JET' },
    { id: 62, name: 'LEFT JET' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 65, name: 'MADE UP/DWN RAMP' },
    { id: 67, name: 'MADE L RAMP' },

    { id: 71, name: 'TOP LOOP' },
    { id: 72, name: 'MID LOOP' },
    { id: 73, name: 'BOT LOOP' },
    { id: 74, name: 'TOP LOCK' },
    { id: 75, name: 'MID LOCK' },
    { id: 76, name: 'BOT LOCK' },
    { id: 77, name: 'EJECT HOLE' },
    { id: 78, name: 'SHOOTER' },

    { id: 81, name: 'OPTO 1' },
    { id: 82, name: 'OPTO 2' },
    { id: 83, name: 'OPTO 3' },
    { id: 84, name: 'ENTER LEFT RAMP' },
    { id: 85, name: 'OPTO MADE LOOP' },
    { id: 86, name: 'L BANK BOT' },
    { id: 87, name: 'L BANK MID' },
    { id: 88, name: 'L BANK TOP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-getaway.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      22,
      55, 56, 57, 58,
      //OPTO SWITCH
      81, 82, 83, 84, 85,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
  memoryPosition: [

  ],

  /*
  	"last_game": [
		{"start": "0x200", "encoding": "bcd", "length": 4},
		{"start": "0x204", "encoding": "bcd", "length": 4},
		{"start": "0x208", "encoding": "bcd", "length": 4},
    {"start": "0x20C", "encoding": "bcd", "length": 4}

	"high_scores": [
		{	"label": "First Place", "short_label": "1st",
			"initials": {"start": "0x737", "encoding": "ch", "length": 3},
			"score": {"start": "0x727", "encoding": "bcd", "length": 4}
		},
		{	"label": "Second Place", "short_label": "2nd",
			"initials": {"start": "0x73A", "encoding": "ch", "length": 3},
			"score": {"start": "0x72B", "encoding": "bcd", "length": 4}
		},
		{	"label": "Third Place", "short_label": "3rd",
			"initials": {"start": "0x73D", "encoding": "ch", "length": 3},
			"score": {"start": "0x72F", "encoding": "bcd", "length": 4}
		},
		{	"label": "Fourth Place", "short_label": "4th",
			"initials": {"start": "0x740", "encoding": "ch", "length": 3},
			"score": {"start": "0x733", "encoding": "bcd", "length": 4}
		}
	],
	"_hideout_jackpot": {"start": "0x770", "encoding": "bcd", "length": 4}

*/
};
