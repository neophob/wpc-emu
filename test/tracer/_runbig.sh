#!/bin/bash

STEPS=4500000
OUTPUTDIR=./wpc-emu-dumps

WAIT_FOR_BG_JOBS() {
  FAIL=0
  for job in `jobs -p`
  do
      wait $job || let "FAIL+=1"
  done

  if [ "$FAIL" == "0" ];
  then
      echo "[$1 JOBS LGTM] NO ERRORS DETECTED"
  else
      echo "[$1 JOBS ERROR] FAILED JOBS DETECTED ($FAIL), EXIT NOW"
      exit 1
  fi
}

STATS() {
  DUMPFILE=$OUTPUTDIR/$2
  echo "## $1"
  ls -l "$DUMPFILE" | awk '{print "   Size: " $5 " bytes"}'
  echo "---------------------"
  cat $DUMPFILE | grep "\$3FF" | awk '{print $10}' | sort | uniq -c | awk '{print $1 "\t" $2}'
  echo ""
}

if [ "$1" ]; then
  echo "UPDATE DUMPS STATS (wpc-emu-dump)"

  echo "# OPS"

  echo "- WPC_LEDS: \$3FF2"
  echo "- WPC_RAM_BANK: \$3FF3"
  echo "- WPC_SHIFTADDRH: \$3FF4"
  echo "- WPC_SHIFTADDRL: \$3FF5"
  echo "- WPC_SHIFTBIT: \$3FF6"
  echo "- WPC_SHIFTBIT2: \$3FF7"
  echo "- WPC_PERIPHERAL_TIMER_FIRQ_CLEAR: \$3FF8"
  echo "- WPC_ROM_LOCK: \$3FF9"
  echo "- WPC_CLK_HOURS_DAYS: \$3FFA"
  echo "- WPC_CLK_MINS: \$3FFB"
  echo "- WPC_ROM_BANK: \$3FFC"
  echo "- WPC_RAM_LOCK: \$3FFD"
  echo "- WPC_RAM_LOCKSIZE: \$3FFE"
  echo "- WPC_ZEROCROSS_IRQ_CLEAR: \$3FFF"

  echo ""

  STATS "Hurricane WPC" HURCNL_2_wpc.dump
  STATS "Hurricane MAME" HURCNL_2_mame.dump
  echo ""

  STATS "Twilight Zone WPC" tz_wpc.dump
  STATS "Twilight Zone MAME" tz_mame.dump
  echo ""

  STATS "Indiana Jones WPC" ij_wpc.dump
  STATS "Indiana Jones MAME" ij_mame.dump
  echo ""

  STATS "Johnny Mnemonic WPC" john1_2r_wpc.dump
  STATS "Johnny Mnemonic MAME" john1_2r_mame.dump
  echo ""

  exit 0
fi

echo "UPDATE ROM DUMPS (wpc-emu-dump)"

echo "create WPC-EMU dump files, make sure the following roms exists in the rom directory:"
echo "- HURCNL_2.ROM (Hurricane)"
echo "- ftz1_00.rom (FreeWPC T2)"
echo "- tz_h8 (Twilight Zone)"
echo "- ijone_l7 (Indiana Jones)"
echo "- john1_2r.rom (Johnny Mnemonic)"

echo "DUMP in progress, output directory: $OUTPUTDIR, steps: $STEPS"
echo "---"

# NOTE: because i'm lazy, tracer writes to stdout - so console.log of the emu do not influence the output
env STEPS=$STEPS node index.js 2> $OUTPUTDIR/HURCNL_2_wpc.dump&
env ROMFILE=../../rom/ftz1_00.rom STEPS=$STEPS node index.js 2> $OUTPUTDIR/ftz1_00_wpc.dump&
env ROMFILE=../../rom/tz_h8.u6 STEPS=$STEPS node index.js 2> $OUTPUTDIR/tz_wpc.dump&
env ROMFILE=../../rom/ijone_l7.rom STEPS=$STEPS node index.js 2> $OUTPUTDIR/ij_wpc.dump&
env ROMFILE=../../rom/john1_2r.rom HAS_SECURITY_FEATURE=true STEPS=$STEPS node index.js 2> $OUTPUTDIR/john1_2r_wpc.dump&

WAIT_FOR_BG_JOBS "DUMP"
echo "DONE!"
