#ifdef FAKE_PINBALL_ENABLED

//simulate 50hz zerocross counter
#define ONE_SECOND 1000000
#define INCREMENT_COUNTER_AFTER_uS (ONE_SECOND / 100)

hw_timer_t * timer = NULL;

void IRAM_ATTR onTimer(){
  fakeTimer++;
}


void initTimer() {
  // timer_id = 0; divider=80; countUp = true;
  // Set 80 divider for prescaler (see ESP32 Technical Reference Manual for more info).
  timer = timerBegin(0, 80, true);

  // Attach onTimer function to our timer.
  timerAttachInterrupt(timer, &onTimer, true);

  timerAlarmWrite(timer, INCREMENT_COUNTER_AFTER_uS, true);

  // Start an alarm
  timerAlarmEnable(timer);
}

#endif
