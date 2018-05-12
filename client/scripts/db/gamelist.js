'use strict';

export { getAllNames, getByName };

const wpcGames = [
  {
    name: 'Hurricane',
    version: 'L-2',
    url: 'https://s3-eu-west-1.amazonaws.com/foo-temp/hurcnl_2.rom',
    switchMapping: [
      { id: 11, name: 'RIGHT FLIPPER' },
      { id: 12, name: 'LEFT FLIPPER' },
      { id: 13, name: 'CREDIT BUTTON' },
      { id: 14, name: 'PLUMB BOB TILT' },
      { id: 15, name: 'OUTHOLE' },
      { id: 16, name: 'THROUGH 1' },
      { id: 17, name: 'THROUGH 2' },
      { id: 18, name: 'THROUGH 3' },
      { id: 21, name: 'SLAM TILT' },
      { id: 22, name: 'COIN DOOR CLOSED' },
      { id: 23, name: 'TICKED OPTQ' },
      { id: 25, name: 'RIGHT SLING' },
      { id: 26, name: 'RIGHT RETURN' },
      { id: 27, name: 'RIGHT OUTLANE' },
      { id: 28, name: 'BALL SHOOTER' },
      { id: 31, name: 'FERRIS WHEEL' },
      { id: 33, name: 'L DROP 1' },
      { id: 34, name: 'L DROP 2' },
      { id: 35, name: 'L DROP 3' },
      { id: 36, name: 'LEFT SLING' },
      { id: 37, name: 'LEFT RETURN' },
      { id: 38, name: 'LEFT OUTLANE' },
      { id: 42, name: 'RIGHT STANDUP 1' },
      { id: 43, name: 'RIGHT STANDUP 2' },
      { id: 44, name: 'RIGHT STANDUP 3' },
      { id: 45, name: 'RIGHT STANDUP 4' },
      { id: 51, name: 'LEFT JET' },
      { id: 53, name: 'RIGHT JET' },
      { id: 55, name: 'DUNK THE DUMMY' },
      { id: 56, name: 'LEFT JUGGLER' },
      { id: 57, name: 'RIGHT JUGGLER' },
      { id: 61, name: 'HURRICANE ENTRY' },
      { id: 62, name: 'HURRICANE EXIT' },
      { id: 63, name: 'COMET ENTRY' },
      { id: 64, name: 'COMET EXIT' },
    ],
    skipWmcRomCheck: true,
    initialise: {
      closedSwitches: [ 16, 17, 18 ],
      initialAction: [
        {
          delayMs: 1000,
          source: 'cabinetInput',
          value: 16
        }
      ],
    }
  },
  {
    name: 'Terminator 2',
    version: 'L-8',
    url: 'https://s3-eu-west-1.amazonaws.com/foo-temp/t2_l8.rom',
    switchMapping: [
      { id: 11, name: 'RIGHT FLIPPER' },
      { id: 12, name: 'LEFT FLIPPER' },
      { id: 13, name: 'START BUTTON' },
      { id: 14, name: 'PLUMB BOB TILT' },
      { id: 15, name: 'THROUGH LEFT' },
      { id: 16, name: 'THROUGH CENTER' },
      { id: 17, name: 'THROUGH RIGHT' },
      { id: 18, name: 'OUTHOLE' },
      { id: 21, name: 'SLAM TILT' },
      { id: 22, name: 'COIN DOOR CLOSED' },
      { id: 23, name: 'TICKED OPTQ' },
      { id: 25, name: 'LEFT OUT LANE' },
      { id: 26, name: 'LEFT RET. LANE' },
      { id: 27, name: 'RIGHT RET. LANE' },
      { id: 28, name: 'RIGHT OUT LANE' },
      { id: 31, name: 'GUN LOADED' },
      { id: 32, name: 'GUN MARK' },
      { id: 33, name: 'GUN HOME' },
      { id: 34, name: 'GRIP TRIGGER' },
      { id: 36, name: 'STAND MID LEFT' },
      { id: 37, name: 'STAND MID CENTER' },
      { id: 38, name: 'STAND MID RIGHT' },
      { id: 41, name: 'LEFT JET' },
      { id: 42, name: 'RIGHT JET' },
      { id: 43, name: 'BOTTOM JET' },
      { id: 44, name: 'LEFT SLING' },
      { id: 45, name: 'RIGHT SLING' },
      { id: 46, name: 'STAND RIGHT TOP' },
      { id: 47, name: 'STAND RIGHT MID' },
      { id: 48, name: 'STAND RIGHT BOT' },
      { id: 51, name: 'LEFT LOCK' },
      { id: 53, name: 'LO ESCAPE ROUTE' },
      { id: 54, name: 'HI ESCAPE ROUTE' },
      { id: 55, name: 'TOP LOCK' },
      { id: 56, name: 'TOP LANE LEFT' },
      { id: 57, name: 'TOP LANE CENTER' },
      { id: 58, name: 'TOP LANE RIGHT' },
      { id: 61, name: 'LEFT RAMP ENTRY' },
      { id: 62, name: 'LEFT RAMP MADE' },
      { id: 63, name: 'RIGHT RAMP ENTRY' },
      { id: 64, name: 'RIGHT RAMP MADE' },
      { id: 65, name: 'LO CHASE LOOP' },
      { id: 66, name: 'HI CHASE LOOP' },
      { id: 71, name: 'TARGET 1 HI' },
      { id: 72, name: 'TARGET 2' },
      { id: 73, name: 'TARGET 3' },
      { id: 74, name: 'TARGET 4' },
      { id: 75, name: 'TARGET 5 LOW' },
      { id: 76, name: 'BALL POPPER' },
      { id: 77, name: 'DROP TARGET' },
      { id: 78, name: 'SHOOTER' },
    ],
    skipWmcRomCheck: true,
    initialise: {
      closedSwitches: [ 15, 16, 17 ],
      initialAction: [
        {
          delayMs: 1000,
          source: 'cabinetInput',
          value: 16
        }
      ],
    }
  },
  {
    name: 'Fish Tales',
    version: 'L-8',
    url: 'https://s3-eu-west-1.amazonaws.com/foo-temp/ft_p4.u6',
  },
  {
    name: 'Indiana Jones: The Pinball Adventure',
    version: 'L-7',
    url: 'https://s3-eu-west-1.amazonaws.com/foo-temp/ijone_l7.rom',
  },
  {
    name: 'Gilligan\'s Island',
    version: 'L-9',
    url: 'https://s3-eu-west-1.amazonaws.com/foo-temp/gilli_l9.rom',
  },
  {
    name: 'FreeWPC T2',
    version: 'FreeWPC 1.00',
    url: 'https://s3-eu-west-1.amazonaws.com/foo-temp/ft20_32.rom',
  },
];

function getAllNames() {
  return wpcGames.map((entry) => entry.name);
}

function getByName(name) {
  return wpcGames.find((entry) => entry.name === name);
}

// HINT: make sure CORS is correct
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/ft20_32.rom')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/tz_h8.u6')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/PZ_U6.L2')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/U6-LA3.ROM')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/hshot_p8.u6')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/getaw_l5.rom')
