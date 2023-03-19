import {
  findString,
  findUint8,
  findUint16,
  findUint32,
  findIdenticalOffsetInArray,
  findBCD,
} from './search';

export {
  memoryFindData,
  clearSearchResults,
};

let memorySearchResult = [];

function clearSearchResults() {
  memorySearchResult = [];
}

function memoryFindData(value, encoding = 'string', rememberResults, lastRamSnapshot) {
  switch (encoding) {
    case 'string':
      return findString(value, lastRamSnapshot);

    case 'uint8':
      let resultArray = findUint8(value, lastRamSnapshot);
      if (rememberResults) {
        const identicalResult = findIdenticalOffsetInArray(resultArray, memorySearchResult);
        memorySearchResult = identicalResult.length ? identicalResult : resultArray;
        resultArray = identicalResult;
      } else {
        clearSearchResults();
      }
      return resultArray;

    case 'uint16':
      return findUint16(value, lastRamSnapshot);

    case 'uint32':
      return findUint32(value, lastRamSnapshot);

    case 'bcd':
      return findBCD(String(value), lastRamSnapshot);

    default:
      console.warn('UNKNOWN_ENCODING', encoding);
      return [];
  }
}
