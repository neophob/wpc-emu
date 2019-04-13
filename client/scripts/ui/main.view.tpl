<div class="row">
  <div class="column column-10">ROM</div>
  <div class="column column-40">
    <div id="game-selection"></div>
    <input id="romUpload" type="file" style="display:none">
  </div>
  <div class="column column-10">Meta</div>
  <div class="column column-40">
    <button class="button-black button-small black" id="wpc-release-info" onclick="location.href='https://github.com/neophob/wpc-emu'">WPC-EMU v0.X.Y</button>
    <button class="button-black button-outline button-small black" onclick="location.href='https://twitter.com/neophob'">TWITTER</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.toggleMidnightMadnessMode();">MIDNIGHT MADNESS</button>
    <button id="dmd-dump-text" class="button-black button-outline button-small black" onclick="wpcInterface.toggleDmdDump();">DMD DUMP</button>
  </div>
</div>

<div class="row">
  <div class="column column-10">Coindoor</div>
  <div class="column column-40">
    <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(1);">Coin#1</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(2);">Coin#2</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(4);">Coin#3</button>
    <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(16);">Escape</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(32);">-</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(64);">+</button>
    <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(128);">Enter</button>
  </div>
  <div class="column column-10">Emulator</div>
  <div class="column column-40">
    <button class="button-black button-small black" onclick="console.log('reset...'); wpcInterface.resetEmu();">RESET</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.pauseEmu();">Pause</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.resumeEmu();">Resume</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.loadState();">Load State</button>
    <button class="button-black button-outline button-small black" onclick="wpcInterface.saveState();">Save State</button>
  </div>
</div>

<div class="row">
  <div class="column column-10">Switch</div>
  <div class="column column-90" id="pinball-specific-switch-input"></div>
</div>

<div id="pinball-specific-fliptronics-root" class="row">
  <div class="column column-10">Fliptronics</div>
  <div class="column column-90" id="pinball-specific-fliptronics-input"></div>
</div>
