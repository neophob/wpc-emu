'use strict';

import viewTpl from './main.view.tpl';
import { replaceNode } from './htmlselector';

export { populateControlUiView };

let selectedIndex = -1;

function addEmulatorControls() {
  const div = document.createElement('div');
  div.insertAdjacentHTML('afterbegin', viewTpl);
  replaceNode('rootNode', div);
}

function addGameSpecificControls(gameEntry) {
  //switch input
  if (Array.isArray(gameEntry.switchMapping)) {
    const element = document.getElementById('pinball-specific-switch-input');
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

function populateControlUiView(gameEntry, gameList, initialGameName) {
  console.log(gameEntry);
  addEmulatorControls();
  addGameSpecificControls(gameEntry);
  addGameTitles(gameList, initialGameName);
}
