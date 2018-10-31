#!/bin/bash

STEPS=4500000
OUTPUTDIR=./wpc-emu-dumps

echo "UPDATE 2s ROM DUMPS (wpc-emu-dump)"

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
  echo "## $1"
  echo "---------------------"
  cat $OUTPUTDIR/$2 | grep "\$3FF" | awk '{print $10}' | sort | uniq -c | awk '{print $1 "\t" $2}'
  echo ""
}

if [ "$1" ]; then
  echo "# OPS compare\n"
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
