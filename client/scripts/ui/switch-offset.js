'use strict';

export { logicalIdToArrayOffset };

function logicalIdToArrayOffset(rawId) {
  if (rawId < 11 || rawId > 95) {
    return;
  }
  const row = parseInt(rawId / 10, 10) - 1;
  const column = parseInt(rawId % 10, 10);
  return row * 8 + column - 1;
}
