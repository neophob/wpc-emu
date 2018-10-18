#!/bin/bash

echo "create WPC-EMU dump files, make sure the following roms exists in the rom directory:"
echo "- HURCNL_2.ROM (Hurricane)"
echo "- ftz1_00.rom (FreeWPC T2)"
echo "- john1_2r.rom (Johnny Mnemonic)"

echo "DUMP in progress..."

# NOTE: because i'm lazy, tracer writes to stdout - so console.log of the emu do not influence the output
env STEPS=500000 node index.js 2> dump/HURCNL_2_wpc.dump
env ROMFILE=../../rom/ftz1_00.rom STEPS=500000 node index.js 2> dump/ftz1_00_wpc.dump
env ROMFILE=../../rom/john1_2r.rom HAS_SECURITY_FEATURE=true STEPS=500000 node index.js 2> dump/john1_2r_wpc.dump
echo "DONE!"

echo "run git diff ."
