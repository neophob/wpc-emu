'use strict';

import viewTpl from './main.view.tpl';
import { replaceNode } from './htmlselector';

export { populateControlUiView };

function addEmulatorControls() {
  const div = document.createElement('div');
  div.insertAdjacentHTML('afterbegin', viewTpl);
  replaceNode('rootNode', div);
}

function addGameSpecificControls(gameEntry) {
  const element = document.getElementById('pinball-specfic-switch-input');
  if (Array.isArray(gameEntry.switchMapping)) {
    gameEntry.switchMapping.forEach((mapping) => {
      const child = document.createElement('button');
      child.innerHTML = mapping.name;
      child.className = 'button-black button-outline button-small black';
      child.addEventListener('click', () => {
        window.wpcInterface.wpcSystem.setInput(mapping.id);
      });
      element.appendChild(child);
    });
  }
}

function populateControlUiView(gameEntry) {
  console.log(gameEntry);
  addEmulatorControls();
  addGameSpecificControls(gameEntry);
}
