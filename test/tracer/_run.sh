#!/bin/bash

echo "UPDATE 0.3s ROM DUMPS (wpc-emu)"

echo "create WPC-EMU dump files, make sure the following roms exists in the rom directory:"
echo "- HURCNL_2.ROM (Hurricane)"
echo "- ftz1_00.rom (FreeWPC T2)"
echo "- john1_2r.rom (Johnny Mnemonic)"

STEPS=600000
OUTPUTDIR=./dump

echo "DUMP in progress, output directory: $OUTPUTDIR, steps: $STEPS"

# NOTE: because i'm lazy, tracer writes to stdout - so console.log of the emu do not influence the output
env ROMFILE=../../rom/HURCNL_2.ROM  STEPS=$STEPS  HAS_DMD_BOARD=true  node index.js 2> $OUTPUTDIR/HURCNL_2_wpc.dump
env ROMFILE=../../rom/ftz1_00.rom   STEPS=$STEPS  HAS_FLIPTRONICS_BOARD=true  node index.js 2> $OUTPUTDIR/ftz1_00_wpc.dump
env ROMFILE=../../rom/john1_2r.rom  STEPS=$STEPS  HAS_SECURITY_FEATURE=true   node index.js 2> $OUTPUTDIR/john1_2r_wpc.dump
echo "DONE!"

echo "run git diff ."
