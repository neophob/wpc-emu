'use strict';

export { replaceNode };

function replaceNode(id, child) {
  const rootNode = document.getElementById(id);
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }
  rootNode.appendChild(child);
}
