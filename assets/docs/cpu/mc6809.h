/********************************************
*
* Copyright 2012 by Sean Conner.  All Rights Reserved.
*
* This library is free software; you can redistribute it and/or modify it
* under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation; either version 3 of the License, or (at your
* option) any later version.
*
* This library is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
* License for more details.
*
* You should have received a copy of the GNU Lesser General Public License
* along with this library; if not, see <http://www.gnu.org/licenses/>.
*
* Comments, questions and criticisms can be sent to: sean@conman.org
*
*********************************************/

#ifndef MC6809_H
#define MC6809_H

#include <stdint.h>
#include <stdbool.h>
#include <setjmp.h>

#ifndef __GNUC__
#  define __attribute__(x)
#endif

#if defined(__i386)
#  define MSB 1
#  define LSB 0
#elif defined(__x86_64)
#  define MSB 1
#  define LSB 0
#else
#  error You need to define the byte order
#endif

/************************************************************************/

#define MC6809_VECTOR_RSVP      0xFFF0
#define MC6809_VECTOR_SWI3      0xFFF2
#define MC6809_VECTOR_SWI2      0xFFF4
#define MC6809_VECTOR_FIRQ      0xFFF6
#define MC6809_VECTOR_IRQ       0xFFF8
#define MC6809_VECTOR_SWI       0xFFFA
#define MC6809_VECTOR_NMI       0xFFFC
#define MC6809_VECTOR_RESET     0xFFFE

/************************************************************************/

typedef enum
{
  MC6809_FAULT_INTERNAL_ERROR = 1,
  MC6809_FAULT_INSTRUCTION,
  MC6809_FAULT_ADDRESS_MODE,
  MC6809_FAULT_EXG,
  MC6809_FAULT_TFR,
  MC6809_FAULT_user
} mc6809fault__t;

typedef uint8_t  mc6809byte__t;
typedef uint16_t mc6809addr__t;
typedef union
{
  mc6809byte__t b[2];
  mc6809addr__t w;
} mc6809word__t;

typedef struct mc6809
{
  mc6809word__t pc;
  mc6809word__t index[4];
  mc6809word__t d;
  mc6809byte__t dp;
  struct
  {
    bool e;
    bool f;
    bool h;
    bool i;
    bool n;
    bool z;
    bool v;
    bool c;
  } cc;
  
  unsigned long cycles;
  mc6809addr__t instpc;
  bool          nmi_armed;
  bool          nmi;
  bool          firq;
  bool          irq;
  bool          cwai;
  bool          sync;
  bool          page2;
  bool          page3;
  jmp_buf       err;
  
  void           *user;
  mc6809byte__t (*read) (struct mc6809 *,mc6809addr__t,bool);
  void          (*write)(struct mc6809 *,mc6809addr__t,mc6809byte__t);
  void          (*fault)(struct mc6809 *,mc6809fault__t);
} mc6809__t;

#define X       index[0]
#define Y       index[1]
#define U       index[2]
#define S       index[3]
#define A       d.b[MSB]
#define B       d.b[LSB]

/**********************************************************************/

extern void            mc6809_reset    (mc6809__t *) __attribute__((nonnull));
extern int             mc6809_run      (mc6809__t *) __attribute__((nonnull));
extern int             mc6809_step     (mc6809__t *) __attribute__((nonnull));

extern mc6809byte__t   mc6809_cctobyte (mc6809__t *)                     __attribute__((nonnull));
extern void            mc6809_bytetocc (mc6809__t *,mc6809byte__t const) __attribute__((nonnull));

extern mc6809addr__t   mc6809_direct   (mc6809__t *) __attribute__((nonnull));
extern mc6809addr__t   mc6809_relative (mc6809__t *) __attribute__((nonnull));
extern mc6809addr__t   mc6809_lrelative(mc6809__t *) __attribute__((nonnull));
extern mc6809addr__t   mc6809_extended (mc6809__t *) __attribute__((nonnull));
extern mc6809addr__t   mc6809_indexed  (mc6809__t *) __attribute__((nonnull));

/**********************************************************************/

#endif