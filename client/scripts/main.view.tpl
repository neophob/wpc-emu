  <div class="container">
    <div class="row">
      <div class="column column-10">Emulator</div>
      <div class="column">
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.irq();">IRQ</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.firq();">FIRQ</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.reset();">RESET</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.pauseEmu();">Pause</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.resumeEmu();">Resume</button>
        <button class="button-black button-outline button-small black" onclick="localStorage.debug = '*'; location.reload();">Enable Debug</button>
        <button class="button-black button-outline button-small black" onclick="localStorage.debug = ''; location.reload();">Disable Debug</button>
      </div>
    </div>

    <div class="row">
      <div class="column column-10">Coindoor</div>
      <div class="column">
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(16);">Escape</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(32);">-</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(64);">+</button>
        <button class="button-black button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(128);">Enter</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(1);">SLOT #1</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(2);">SLOT #2</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(4);">SLOT #3</button>
        <button class="button-black button-outline button-small black" onclick="wpcInterface.wpcSystem.setCabinetInput(8);">SLOT #4</button>
      </div>
    </div>

    <div class="row">
      <div class="column column-10">Switch</div>
      <div id="pinball-specfic-switch-input" class="column">
<!--        <button class="button-black button-small black" onclick="wpcSystem.setInput(12);">LEFT FLIPPER</button>
        <button class="button-black button-small black" onclick="wpcSystem.setInput(11);">RIGHT FLIPPER</button>
        <button class="button-black button-small black" onclick="wpcSystem.setInput(13);">START</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(28);">BALL SHOOTER</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(15);">TROUGH 0</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(16);">TROUGH 1</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(17);">TROUGH 2</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(18);">TROUGH 3</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(21);">SLAM TILT</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(31);">31</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(32);">32</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(33);">33</button>
        <button class="button-black button-outline button-small black" onclick="wpcSystem.setInput(34);">34</button>-->
      </div>
    </div>
  </div>
