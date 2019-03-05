'use strict';

import viewTpl from './main.view.tpl';
import { replaceNode } from './htmlselector';
import { logicalIdToArrayOffset } from './switch-offset';

export { populateControlUiView, updateUiSwitchState };

let selectedIndex = -1;

const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];

const PINBALL_SWITCH_BUTTONS_ELEMENT = 'pinball-specific-switch-input';

function populateControlUiView(gameEntry, gameList, initialGameName) {
  console.log('gameEntry', gameEntry);
  addEmulatorControls();
  addGameSpecificControls(gameEntry);
  addGameTitles(gameList, initialGameName);
}

function updateUiSwitchState(packedSwitchInput) {
  const dataUnpacked = [];
  // row 0 are system button, row 9 is fliptronics
  for (let i = 1; i < 9; i++) {
    for (let j = 0; j < 8; j++) {
      const entry = packedSwitchInput[i] & BIT_ARRAY[j];
      dataUnpacked.push(entry > 0 ? true : false);
    }
  }
  const elements = document.getElementById(PINBALL_SWITCH_BUTTONS_ELEMENT);
  elements.childNodes.forEach((childNode) => {
    const rawId = parseInt(childNode.id.substring(PINBALL_SWITCH_BUTTONS_ELEMENT.length), 10);
    const id = logicalIdToArrayOffset(rawId);
    if (dataUnpacked[id]) {
      childNode.className = 'button-black button-small black';
    } else {
      childNode.className = 'button-black button-outline button-small black';
    }
  });
}

function addEmulatorControls() {
  const div = document.createElement('div');
  div.insertAdjacentHTML('afterbegin', viewTpl);
  replaceNode('rootNode', div);
}

function addGameSpecificControls(gameEntry) {
  //switch input
  if (Array.isArray(gameEntry.switchMapping)) {
    const element = document.getElementById(PINBALL_SWITCH_BUTTONS_ELEMENT);
    gameEntry.switchMapping.forEach((mapping) => {
      const child = document.createElement('button');
      child.textContent = mapping.name;
      child.id = PINBALL_SWITCH_BUTTONS_ELEMENT + mapping.id;
      child.className = 'button-black button-outline button-small black';
      child.addEventListener('click', () => {
        window.wpcInterface.wpcSystem.setInput(mapping.id);
      });
      element.append(child);
    });
  }

  //fliptronics input
  if (Array.isArray(gameEntry.fliptronicsMapping)) {
    const element = document.getElementById('pinball-specific-fliptronics-input');
    gameEntry.fliptronicsMapping.forEach((mapping) => {
      const child = document.createElement('button');
      child.textContent = mapping.name;
      child.className = 'button-black button-outline button-small black';
      child.addEventListener('click', () => {
        window.wpcInterface.wpcSystem.setFliptronicsInput(mapping.id);
      });
      element.appendChild(child);
    });
  } else {
    replaceNode('pinball-specific-fliptronics-root', document.createElement('div'));
  }
}

function loadROM(event) {
  const selectedRom = event.target.value;
  console.log('load ROM', selectedRom);
  selectedIndex = event.target.selectedIndex;
  wpcInterface.romSelection(selectedRom);
}

function addGameTitles(gameList, initialGameName) {
  const selectElementRoot = document.getElementById('game-selection');
  const selectElement = document.createElement('select');
  gameList.getAllNames().forEach((name, index) => {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    selectElement.add(option, null);
    if (selectedIndex === -1 && name === initialGameName) {
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
