import device from 'current-device';

export {isMobileBrowser};

function isMobileBrowser() {
  return device.mobile();
}
