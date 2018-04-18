/*

$3800-$39FF	    DMD Page 1
$3A00-$3BFF	    DMD Page 2
$3FBC-$3FBF	    DMD display control
                Address	  Format	 Description
                $3FBC     Byte     WPC_DMD_HIGH_PAGE
                                    3-0: W: The page of display RAM mapped into the 2nd (6th on WPC95) region, from 0x3A00-0x3BFF.
                $3FBD     Byte     WPC_DMD_SCANLINE
                                    7-0: W: Request an FIRQ after a particular scanline is drawn
                                    5-0: R: The last scanline that was drawn
                $3FBE     Byte     WPC_DMD_LOW_PAGE
                                    3-0: W: The page of display RAM mapped into the 1st (5th on WPC95) region, from 0x3800-0x39FF.
                $3FBF     Byte     WPC_DMD_ACTIVE_PAGE
                                    3-0: W: The page of display RAM to be used for refreshing the display.
                                    Writes to this register take effect just prior to drawing scanline 0.

*/
