const wpcGames = [
  {
    name: 'Hurricane',
    version: 'L-2',
    filename: 'https://s3-eu-west-1.amazonaws.com/foo-temp/hurcnl_2.rom',
  },
  {
    name: 'Terminator 2',
    version: 'L-8',
    filename: 'https://s3-eu-west-1.amazonaws.com/foo-temp/t2_l8.rom',
  },
  {
    manager: 'Fish Tales',
    version: 'L-8',
    name: 'https://s3-eu-west-1.amazonaws.com/foo-temp/ft_p4.u6',
  },
  {
    manager: 'Indiana Jones: The Pinball Adventure',
    version: 'L-7',
    name: 'https://s3-eu-west-1.amazonaws.com/foo-temp/ijone_l7.rom',
  },
  {
    manager: 'Gilligan\'s Island',
    version: 'L-9',
    name: 'https://s3-eu-west-1.amazonaws.com/foo-temp/gilli_l9.rom',
  },
];

export default wpcGames;

// HINT: make sure CORS is correct
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/ft20_32.rom')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/tz_h8.u6')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/PZ_U6.L2')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/U6-LA3.ROM')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/hshot_p8.u6')
//downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/getaw_l5.rom')
