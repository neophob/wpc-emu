'use strict';

import viewTpl from './main.view.tpl';
import { replaceNode } from './htmlselector';

export { populateControlUiView };

const INITIAL_GAME = 'Hurricane';
let selectedIndex = 0;

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
      child.textContent = mapping.name;
      child.className = 'button-black button-outline button-small black';
      child.addEventListener('click', () => {
        window.wpcInterface.wpcSystem.setInput(mapping.id);
      });
      element.appendChild(child);
    });
  }
}

function loadROM(event) {
  const selectedRom = event.target.value;
  console.log('load ROM', selectedRom);
  selectedIndex = event.target.selectedIndex;
  wpcInterface.romSelection(selectedRom);
}

function addGameTitles(gameList) {
  const selectElementRoot = document.getElementById('game-selection');  
  const selectElement = document.createElement('select');  
  gameList.getAllNames().forEach((name, index) => {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    selectElement.add(option, null);
    if (name === INITIAL_GAME) {
      selectedIndex = index;
    }
  });
  selectElement.addEventListener('change', loadROM);
  selectElement.selectedIndex = selectedIndex;
  
  while (selectElementRoot.firstChild) {
    selectElementRoot.removeChild(selectElementRoot.firstChild);
  }
  selectElementRoot.appendChild(selectElement);
}

function populateControlUiView(gameEntry, gameList) {
  console.log(gameEntry);
  addEmulatorControls();
  addGameSpecificControls(gameEntry);
  addGameTitles(gameList);
}
