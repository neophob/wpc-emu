'use strict';

export { replaceNode, replaceNodeAndResize };

function replaceNode(id, child) {
  const rootNode = document.getElementById(id);
  if (!rootNode) {
    return false;
  }
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }
  rootNode.appendChild(child);
}

function replaceNodeAndResize(id, child, height) {
  const rootNode = document.getElementById(id);
  if (!rootNode) {
    return false;
  }
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }
  rootNode.style.height = height + 'px';
  rootNode.appendChild(child);
}