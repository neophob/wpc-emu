export {replaceNode, replaceNodeAndResize};

function replaceNode(id, child) {
  const rootNode = document.getElementById(id);
  if (!rootNode) {
    return false;
  }

  while (rootNode.firstChild) {
    rootNode.firstChild.remove();
  }

  rootNode.append(child);
}

function replaceNodeAndResize(id, child, height) {
  const rootNode = document.getElementById(id);
  if (!rootNode) {
    return false;
  }

  while (rootNode.firstChild) {
    rootNode.firstChild.remove();
  }

  rootNode.style.height = height + 'px';
  rootNode.append(child);
}
