#ifdef FAKE_PINBALL_ENABLED

hw_timer_t * timer = NULL;

void IRAM_ATTR onTimer(){
  fakeTimer++;
}


void initTimer() {
  // Use 1st timer of 4 (counted from zero).
  // Set 80 divider for prescaler (see ESP32 Technical Reference Manual for more info).
  timer = timerBegin(0, 80, true);

  // Attach onTimer function to our timer.
  timerAttachInterrupt(timer, &onTimer, true);

  // Set alarm to call onTimer function every second (value in microseconds).
  // Repeat the alarm (third parameter)
  // 1000000
  timerAlarmWrite(timer, 16667, true);

  // Start an alarm
  timerAlarmEnable(timer);
}

#endif
