'use strict';

export { findString, findUint8, findUint16, findUint32 };

const MAX_ELEMENTS_TO_SEARCH = 64;

function findString(stringToSearch, uint8Array) {
  const searchString = stringToSearch
    .split('')
    .map((char) => char.charCodeAt(0));

  let foundElements = 0;

  const maxIndex = uint8Array.length - stringToSearch.length;
  let index = -1;
  for (const char of uint8Array) {
    index++;
    if (index > maxIndex) {
      return foundElements;
    }
    if (char === searchString[0]) {
      if (_findString(searchString, index, uint8Array)) {
        console.log(stringToSearch, '(String) FOUND at position', '0x' + index.toString(16).toUpperCase());
        if (foundElements++ > MAX_ELEMENTS_TO_SEARCH) {
          console.warn('EXCEEDED_MAX_SEARCH_RESULTS')
          return foundElements;
        }
      }
    }
  };
  return foundElements;
}

function _findString(searchString, startPos, uint8Array) {
  for (let j = 1; j < searchString.length; j++) {
    if (uint8Array[startPos + j] !== searchString[j]) {
      return false;
    }
  }
  return true;
}

function findUint32(uint32ToSearch, uint8Array) {
  let foundElements = 0;
  const searchUint32 = uint32ToSearch & 0xFFFFFFFF;
  const dataView = new DataView(uint8Array.buffer);
  for (let offset = 0; offset < (uint8Array.length - 3); offset++) {
    if (dataView.getUint32(offset) === searchUint32) {
      console.log('0x' + searchUint32.toString(16), '(uint32) FOUND at position', '0x' + offset.toString(16).toUpperCase());
      if (foundElements++ > MAX_ELEMENTS_TO_SEARCH) {
        console.warn('EXCEEDED_MAX_SEARCH_RESULTS')
        return foundElements;
      }
    }
  }
  return foundElements;
}

function findUint16(uint16ToSearch, uint8Array) {
  let foundElements = 0;
  const searchUint16 = uint16ToSearch & 0xFFFF;
  const dataView = new DataView(uint8Array.buffer);
  for (let offset = 0; offset < (uint8Array.length - 1); offset++) {
    if (dataView.getUint16(offset) === searchUint16) {
      console.log('0x' + searchUint16.toString(16), '(uint16) FOUND at position', '0x' + offset.toString(16).toUpperCase());
      if (foundElements++ > MAX_ELEMENTS_TO_SEARCH) {
        console.warn('EXCEEDED_MAX_SEARCH_RESULTS')
        return foundElements;
      }
    }
  }
  return foundElements;
}

function findUint8(uint8ToSearch, uint8Array) {
  const searchUint8 = uint8ToSearch & 0xFF;
  let foundElements = 0;
  let index = -1;
  for (const char of uint8Array) {
    index++;
    if (char === searchUint8) {
      console.log('0x' + searchUint8.toString(16), '(uint8) FOUND at position', '0x' + index.toString(16).toUpperCase());
      if (foundElements++ > MAX_ELEMENTS_TO_SEARCH) {
        console.warn('EXCEEDED_MAX_SEARCH_RESULTS')
        return foundElements;
      }
    }
  };
  return foundElements;
}