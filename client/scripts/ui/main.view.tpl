  <div class="container">
    <div class="row">
      <div class="column column-10">Emulator</div>
      <div class="column column-40">
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.reset();">RESET</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.pauseEmu();">Pause</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.resumeEmu();">Resume</button>
      </div>

      <div class="column column-10">Coindoor</div>
      <div class="column">
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(16);">Escape</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(32);">-</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(64);">+</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(128);">Enter</button>
      </div>
    </div>

    <div class="row">
      <div class="column column-10">Switch</div>
      <div id="pinball-specfic-switch-input" class="column">
      </div>
    </div>
  </div>
