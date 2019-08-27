'use strict';

module.exports = {
  name: 'WPC-DCS: Demolition Man',
  version: 'LX-4',
  rom: {
    u06: 'dman_lx4.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 12, name: 'L HANDLE BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT INLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: 'CLAW RIGHT' },
    { id: 26, name: 'CLAW LEFT' },
    { id: 27, name: 'SHOOTER LANE' },

    { id: 31, name: 'TROUGH 1 (RIGHT)' },
    { id: 32, name: 'TROUGH 2' },
    { id: 33, name: 'TROUGH 3' },
    { id: 34, name: 'TROUGH 4' },
    { id: 35, name: 'TROUGH 5 (LEFT)' },
    { id: 36, name: 'TROUGH JAM' },
    { id: 38, name: 'STANDUP 5' },

    { id: 41, name: 'LEFT SLING' },
    { id: 42, name: 'RIGHT SLING' },
    { id: 43, name: 'LEFT JET' },
    { id: 44, name: 'TOP SLING' },
    { id: 45, name: 'LEFT JET' },
    { id: 46, name: 'R RAMP ENTERPOST' },
    { id: 47, name: 'R RAMP EXIT' },
    { id: 48, name: 'RIGHT LOOP' },

    { id: 51, name: 'L RAMP ENTER' },
    { id: 52, name: 'L RAMP EXIT' },
    { id: 53, name: 'CENTER RAMP' },
    { id: 54, name: 'UPPER REBOUND' },
    { id: 55, name: 'LEFT LOOP' },
    { id: 56, name: 'STANDUP 2' },
    { id: 57, name: 'STANDUP 3' },
    { id: 58, name: 'STANDUP 4' },

    { id: 61, name: 'SIDE RAMP ENTER' },
    { id: 62, name: 'SIDE RAMP EXIT' },
    { id: 63, name: '(M)TL ROLLOVER' },
    { id: 64, name: 'M(T)L ROLLOVER' },
    { id: 65, name: 'MT(L) ROLLOVER' },
    { id: 66, name: 'EJECT' },
    { id: 67, name: 'ELEVATOR INDEX' },

    { id: 71, name: 'CAR CRASH 1' },
    { id: 72, name: 'CAR CRASH 2' },
    { id: 73, name: 'TOP POPPER' },
    { id: 74, name: 'ELEVATOR HOLD' },
    { id: 76, name: 'BOTTOM POPPER' },
    { id: 77, name: 'EYEBALL STANDUP' },
    { id: 78, name: 'STANDUP 1' },

    { id: 81, name: 'CLAW "CAPT SIM"' },
    { id: 82, name: 'CLAW "SUP JETS"' },
    { id: 83, name: 'CLAW "PR BREAK"' },
    { id: 84, name: 'CLAW "FREEZE"' },
    { id: 85, name: 'CLAW "ACMAG"' },
    { id: 86, name: 'UL FLIPPER GATE' },
    { id: 87, name: 'CAR CR STANDUP' },
    { id: 88, name: 'LOWER REBOUND' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dm.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcDcs',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 25, 26, 31, 32, 33, 34, 35, 36, 67, 71, 72, 73, 74, 76
      25, 26, 36, 67, 71, 72, 73, 74, 76,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};

/*	"last_game": [
		{"start": "0x1730", "encoding": "bcd", "length": 6},
		{"start": "0x1737", "encoding": "bcd", "length": 6},
		{"start": "0x173E", "encoding": "bcd", "length": 6},
		{"start": "0x1745", "encoding": "bcd", "length": 6}
	],
	"high_scores": [
		{	"label": "Grand Champion", "short_label": "GC",
			"initials": {"start": "0x1C87", "encoding": "ch", "length": 3},
			"score": {"start": "0x1C8A", "encoding": "bcd", "length": 6}
		},
		{	"label": "First Place", "short_label": "1st",
			"initials": {"start": "0x1C61", "encoding": "ch", "length": 3},
			"score": {"start": "0x1C64", "encoding": "bcd", "length": 6}
		},
		{	"label": "Second Place", "short_label": "2nd",
			"initials": {"start": "0x1C6A", "encoding": "ch", "length": 3},
			"score": {"start": "0x1C6D", "encoding": "bcd", "length": 6}
		},
		{	"label": "Third Place", "short_label": "3rd",
			"initials": {"start": "0x1C73", "encoding": "ch", "length": 3},
			"score": {"start": "0x1C76", "encoding": "bcd", "length": 6}
		},
		{	"label": "Fourth Place", "short_label": "4th",
			"initials": {"start": "0x1C7C", "encoding": "ch", "length": 3},
			"score": {"start": "0x1C7F", "encoding": "bcd", "length": 6}
		}
	],
*/