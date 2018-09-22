var __extends = this && this.__extends || function(t, e) {
    function i() {
      this.constructor = t
    }
    for (var s in e) e.hasOwnProperty(s) && (t[s] = e[s]);
    t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i)
  },
  FM;
! function(t) {
  "use strict";
  t.FM_PGBITS = 9, t.FM_RATIOBITS = 7, t.FM_LFOBITS = 8, t.FM_TLBITS = 7, t.FM_TLENTS = 1 << t.FM_TLBITS, t.FM_LFOENTS = 1 << t.FM_LFOBITS, t.FM_CLENTS = 8192, t.FM_OPSINBITS = 10, t.FM_OPSINENTS = 1 << t.FM_OPSINBITS, t.FM_EG_BOTTOM = 955, t.IS2EC_SHIFT = 20 + t.FM_PGBITS - 13
}(FM || (FM = {}));
var FM;
! function(t) {
  "use strict";

  function e() {
    if (!t.tablemade) {
      t.tablemade = !0;
      var e, i, s = [
          [0, 1 / 360, 2 / 360, 3 / 360, 4 / 360, 6 / 360, 12 / 360, 24 / 360],
          [0, 1 / 480, 2 / 480, 4 / 480, 10 / 480, 20 / 480, 80 / 480, 140 / 480]
        ],
        h = [
          [31, 6, 4, 3],
          [31, 2, 1, 0]
        ];
      t.pmtable = new Array(2), t.amtable = new Array(2);
      for (var a = 0; 2 > a; a++) {
        for (t.pmtable[a] = new Array(8), e = 0; 8 > e; e++) {
          var o = s[a][e];
          for (t.pmtable[a][e] = new Array(t.FM_LFOENTS), i = 0; i < t.FM_LFOENTS; i++) {
            var n = (Math.pow(2, o * (2 * i - t.FM_LFOENTS + 1) / (t.FM_LFOENTS - 1)), .6 * o * Math.sin(2 * i * Math.PI / t.FM_LFOENTS) + 1);
            t.pmtable[a][e][i] = 65536 * (n - 1) | 0
          }
        }
        for (t.amtable[a] = new Array(4), e = 0; 4 > e; e++)
          for (t.amtable[a][e] = new Array(t.FM_LFOENTS), i = 0; i < t.FM_LFOENTS; i++) t.amtable[a][e][i] = 2 * (4 * i >> h[a][e]) << 2
      }
    }
  }! function(t) {
    t[t.typeN = 0] = "typeN", t[t.typeM = 1] = "typeM"
  }(t.OpType || (t.OpType = {}));
  t.OpType;
  t.tablemade = !1;
  var i = function() {
    function e() {
      this.chip_ = null, this.out_ = 0, this.out2_ = 0, this.in2_ = 0, this.dp_ = 0, this.detune_ = 0, this.detune2_ = 0, this.multiple_ = 0, this.pg_count_ = 0, this.pg_diff_ = 0, this.pg_diff_lfo_ = 0, this.bn_ = 0, this.eg_level_ = 0, this.eg_level_on_next_phase_ = 0, this.eg_count_ = 0, this.eg_count_diff_ = 0, this.eg_out_ = 0, this.tl_out_ = 0, this.eg_rate_ = 0, this.eg_curve_count_ = 0, this.key_scale_rate_ = 0, this.eg_phase_ = e.EGPhase.next, this.ms_ = 0, this.tl_ = 0, this.tl_latch_ = 0, this.ar_ = 0, this.dr_ = 0, this.sr_ = 0, this.sl_ = 0, this.rr_ = 0, this.ks_ = 0, this.keyon_ = !1, this.amon_ = !1, this.param_changed_ = !1, this.mute_ = !1, this.dbgopout_ = 0, this.dbgpgout_ = 0, e.tablehasmade || this.MakeTable(), this.ar_ = this.dr_ = this.sr_ = this.rr_ = this.key_scale_rate_ = 0, this.ams_ = t.amtable[0][0], this.mute_ = !1, this.keyon_ = !1, this.tl_out_ = 0, this.multiple_ = 0, this.detune_ = 0, this.detune2_ = 0, this.ms_ = 0
    }
    return e.prototype.SetChip = function(t) {
      this.chip_ = t
    }, e.prototype.Reset = function() {
      this.tl_ = this.tl_latch_ = 127, this.ShiftPhase(e.EGPhase.off), this.eg_count_ = 0, this.eg_curve_count_ = 0, this.pg_count_ = 0, this.out_ = this.out2_ = 0, this.param_changed_ = !0
    }, e.prototype.MakeTable = function() {
      var i, s = 0;
      for (i = 0; 256 > i; i++) {
        var h = Math.floor(Math.pow(2, 13 - i / 256));
        h = h + 2 & -4, e.cltable[s++] = h, e.cltable[s++] = -h
      }
      for (; s < t.FM_CLENTS;) e.cltable[s] = e.cltable[s - 512] / 2 | 0, s++;
      for (i = 0; i < t.FM_OPSINENTS / 2; i++) {
        var a = (2 * i + 1) * Math.PI / t.FM_OPSINENTS,
          o = -256 * Math.log(Math.sin(a)) / Math.LN2,
          n = Math.floor(o + .5) + 1;
        e.sinetable[i] = 2 * n, e.sinetable[t.FM_OPSINENTS / 2 + i] = 2 * n + 1
      }
      t.MakeLFOTable(), e.tablehasmade = !0
    }, e.prototype.SetDPBN = function(t, e) {
      this.dp_ = t, this.bn_ = e, this.param_changed_ = !0
    }, e.prototype.Prepare = function() {
      if (this.param_changed_) {
        switch (this.param_changed_ = !1, this.pg_diff_ = (this.dp_ + e.dttable[this.detune_ + this.bn_]) * this.chip_.GetMulValue(this.detune2_, this.multiple_), this.pg_diff_lfo_ = this.pg_diff_ >> 11, this.key_scale_rate_ = this.bn_ >> 3 - this.ks_, this.tl_out_ = this.mute_ ? 1023 : 8 * this.tl_, this.eg_phase_) {
          case e.EGPhase.attack:
            this.SetEGRate(this.ar_ ? Math.min(63, this.ar_ + this.key_scale_rate_) : 0);
            break;
          case e.EGPhase.decay:
            this.SetEGRate(this.dr_ ? Math.min(63, this.dr_ + this.key_scale_rate_) : 0), this.eg_level_on_next_phase_ = 8 * this.sl_;
            break;
          case e.EGPhase.sustain:
            this.SetEGRate(this.sr_ ? Math.min(63, this.sr_ + this.key_scale_rate_) : 0);
            break;
          case e.EGPhase.release:
            this.SetEGRate(Math.min(63, this.rr_ + this.key_scale_rate_))
        }
        this.ams_ = t.amtable[this.type_][this.amon_ ? this.ms_ >> 4 & 3 : 0], this.EGUpdate(), this.dbgopout_ = 0
      }
    }, e.prototype.ShiftPhase = function(i) {
      switch (i) {
        case e.EGPhase.attack:
          if (this.ar_ + this.key_scale_rate_ < 62) {
            this.SetEGRate(this.ar_ ? Math.min(63, this.ar_ + this.key_scale_rate_) : 0), this.eg_phase_ = e.EGPhase.attack;
            break
          }
        case e.EGPhase.decay:
          if (this.sl_) {
            this.eg_level_ = 0, this.eg_level_on_next_phase_ = 8 * this.sl_, this.SetEGRate(this.dr_ ? Math.min(63, this.dr_ + this.key_scale_rate_) : 0), this.eg_phase_ = e.EGPhase.decay;
            break
          }
        case e.EGPhase.sustain:
          this.eg_level_ = 8 * this.sl_, this.eg_level_on_next_phase_ = 1024, this.SetEGRate(this.sr_ ? Math.min(63, this.sr_ + this.key_scale_rate_) : 0), this.eg_phase_ = e.EGPhase.sustain;
          break;
        case e.EGPhase.release:
          if (this.eg_phase_ === e.EGPhase.attack || this.eg_level_ < t.FM_EG_BOTTOM) {
            this.eg_level_on_next_phase_ = 1024, this.SetEGRate(Math.min(63, this.rr_ + this.key_scale_rate_)), this.eg_phase_ = e.EGPhase.release;
            break
          }
        case e.EGPhase.off:
        default:
          this.eg_level_ = t.FM_EG_BOTTOM, this.eg_level_on_next_phase_ = t.FM_EG_BOTTOM, this.EGUpdate(), this.SetEGRate(0), this.eg_phase_ = e.EGPhase.off
      }
    }, e.prototype.SetFNum = function(t) {
      this.dp_ = (2047 & t) << (t >> 11 & 7), this.bn_ = e.notetable[t >> 7 & 127], this.param_changed_ = !0
    }, e.prototype.LogToLin = function(i) {
      return i < t.FM_CLENTS ? e.cltable[i] : 0
    }, e.prototype.EGUpdate = function() {
      this.eg_out_ = Math.min(this.tl_out_ + this.eg_level_, 1023) << 3
    }, e.prototype.SetEGRate = function(t) {
      this.eg_rate_ = t, this.eg_count_diff_ = e.decaytable2[t >> 2] * this.chip_.GetRatio()
    }, e.prototype.EGCalc = function() {
      if (this.eg_count_ = 6141 << t.FM_RATIOBITS, this.eg_phase_ === e.EGPhase.attack) {
        var i = e.attacktable[this.eg_rate_][7 & this.eg_curve_count_];
        i >= 0 && (this.eg_level_ -= 1 + (this.eg_level_ >> i), this.eg_level_ <= 0 && this.ShiftPhase(e.EGPhase.decay)), this.EGUpdate()
      } else this.eg_level_ += e.decaytable1[this.eg_rate_][7 & this.eg_curve_count_], this.eg_level_ >= this.eg_level_on_next_phase_ && this.ShiftPhase(this.eg_phase_ + 1), this.EGUpdate();
      this.eg_curve_count_++
    }, e.prototype.EGStep = function() {
      this.eg_count_ -= this.eg_count_diff_, this.eg_count_ <= 0 && this.EGCalc()
    }, e.prototype.PGCalc = function() {
      var t = this.pg_count_;
      return this.pg_count_ += this.pg_diff_, this.dbgpgout_ = t, t
    }, e.prototype.PGCalcL = function() {
      var t = this.pg_count_;
      return this.pg_count_ += this.pg_diff_ + (this.pg_diff_lfo_ * this.chip_.GetPMV() >> 5), this.dbgpgout_ = t, t
    }, e.prototype.Calc = function(i) {
      this.EGStep(), this.out2_ = this.out_;
      var s = this.PGCalc() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
      return s += i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS - (2 + t.IS2EC_SHIFT), this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[s & t.FM_OPSINENTS - 1]), this.dbgopout_ = this.out_, this.out_
    }, e.prototype.CalcL = function(i) {
      this.EGStep();
      var s = this.PGCalcL() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
      return s += i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS - (2 + t.IS2EC_SHIFT), this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[s & t.FM_OPSINENTS - 1] + this.ams_[this.chip_.GetAML()]), this.dbgopout_ = this.out_, this.out_
    }, e.prototype.CalcN = function(t) {
      this.EGStep();
      var e = Math.max(0, 1023 - (this.tl_out_ + this.eg_level_)) << 1;
      return t = (1 & t) - 1, this.out_ = e + t ^ t, this.dbgopout_ = this.out_, this.out_
    }, e.prototype.CalcFB = function(i) {
      this.EGStep();
      var s = this.out_ + this.out2_;
      this.out2_ = this.out_;
      var h = this.PGCalc() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
      return 31 > i && (h += s << 1 + t.IS2EC_SHIFT >> i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS), this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[h & t.FM_OPSINENTS - 1]), this.dbgopout_ = this.out2_, this.out2_
    }, e.prototype.CalcFBL = function(i) {
      this.EGStep();
      var s = this.out_ + this.out2_;
      this.out2_ = this.out_;
      var h = this.PGCalcL() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
      return 31 > i && (h += s << 1 + t.IS2EC_SHIFT >> i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS), this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[h & t.FM_OPSINENTS - 1] + this.ams_[this.chip_.GetAML()]), this.dbgopout_ = this.out_, this.out_
    }, e.prototype.ResetFB = function() {
      this.out_ = this.out2_ = 0
    }, e.prototype.KeyOn = function() {
      this.keyon_ || (this.keyon_ = !0, this.eg_phase_ !== e.EGPhase.off && this.eg_phase_ !== e.EGPhase.release || (this.ShiftPhase(e.EGPhase.attack), this.EGUpdate(), this.in2_ = this.out_ = this.out2_ = 0, this.pg_count_ = 0))
    }, e.prototype.KeyOff = function() {
      this.keyon_ && (this.keyon_ = !1, this.ShiftPhase(e.EGPhase.release))
    }, e.prototype.IsOn = function() {
      return this.eg_phase_ - e.EGPhase.off
    }, e.prototype.SetDT = function(t) {
      this.detune_ = 32 * t, this.param_changed_ = !0
    }, e.prototype.SetDT2 = function(t) {
      this.detune2_ = 3 & t, this.param_changed_ = !0
    }, e.prototype.SetMULTI = function(t) {
      this.multiple_ = t, this.param_changed_ = !0
    }, e.prototype.SetTL = function(t) {
      this.tl_ = t, this.param_changed_ = !0
    }, e.prototype.SetAR = function(t) {
      this.ar_ = t, this.param_changed_ = !0
    }, e.prototype.SetDR = function(t) {
      this.dr_ = t, this.param_changed_ = !0
    }, e.prototype.SetSR = function(t) {
      this.sr_ = t, this.param_changed_ = !0
    }, e.prototype.SetSL = function(t) {
      this.sl_ = t, this.param_changed_ = !0
    }, e.prototype.SetRR = function(t) {
      this.rr_ = t, this.param_changed_ = !0
    }, e.prototype.SetKS = function(t) {
      this.ks_ = t, this.param_changed_ = !0
    }, e.prototype.SetAMON = function(t) {
      this.amon_ = t, this.param_changed_ = !0
    }, e.prototype.Mute = function(t) {
      this.mute_ = t, this.param_changed_ = !0
    }, e.prototype.SetMS = function(t) {
      this.ms_ = t, this.param_changed_ = !0
    }, e.prototype.Out = function() {
      return this.out_
    }, e.notetable = [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 9, 10, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 17, 18, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 21, 22, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 25, 26, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 29, 30, 31, 31, 31, 31, 31, 31, 31], e.dttable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 12, 12, 14, 16, 16, 16, 16, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 12, 12, 14, 16, 16, 18, 20, 22, 24, 26, 28, 32, 32, 32, 32, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 12, 12, 14, 16, 16, 18, 20, 22, 24, 26, 28, 32, 34, 38, 40, 44, 44, 44, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, -2, -2, -2, -2, -4, -4, -4, -4, -4, -6, -6, -6, -8, -8, -8, -10, -10, -12, -12, -14, -16, -16, -16, -16, -2, -2, -2, -2, -4, -4, -4, -4, -4, -6, -6, -6, -8, -8, -8, -10, -10, -12, -12, -14, -16, -16, -18, -20, -22, -24, -26, -28, -32, -32, -32, -32, -4, -4, -4, -4, -4, -6, -6, -6, -8, -8, -8, -10, -10, -12, -12, -14, -16, -16, -18, -20, -22, -24, -26, -28, -32, -34, -38, -40, -44, -44, -44, -44], e.decaytable1 = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 1, 1, 1, 2, 1, 1, 1],
      [2, 1, 2, 1, 2, 1, 2, 1],
      [2, 2, 2, 1, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [4, 2, 2, 2, 4, 2, 2, 2],
      [4, 2, 4, 2, 4, 2, 4, 2],
      [4, 4, 4, 2, 4, 4, 4, 2],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [8, 4, 4, 4, 8, 4, 4, 4],
      [8, 4, 8, 4, 8, 4, 8, 4],
      [8, 8, 8, 4, 8, 8, 8, 4],
      [16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16]
    ], e.decaytable2 = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2047, 2047, 2047, 2047, 2047], e.attacktable = [
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, -1, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, -1, 4, -1],
      [4, 4, 4, -1, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, -1],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [3, 4, 4, 4, 3, 4, 4, 4],
      [3, 4, 3, 4, 3, 4, 3, 4],
      [3, 3, 3, 4, 3, 3, 3, 4],
      [3, 3, 3, 3, 3, 3, 3, 3],
      [2, 3, 3, 3, 2, 3, 3, 3],
      [2, 3, 2, 3, 2, 3, 2, 3],
      [2, 2, 2, 3, 2, 2, 2, 3],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 2, 2, 1, 2, 2, 2],
      [1, 2, 1, 2, 1, 2, 1, 2],
      [1, 1, 1, 2, 1, 1, 1, 2],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ], e.tablehasmade = !1, e.sinetable = new Array(1024), e.cltable = new Array(t.FM_CLENTS), e.EGPhase = {
      next: 0,
      attack: 1,
      decay: 2,
      sustain: 3,
      release: 4,
      off: 5
    }, e
  }();
  t.Operator = i;
  var s = function() {
    function e() {
      this.op = [new i, new i, new i, new i], this.tablehasmade = !1, this.fb = 0, this.buf = new Array(4), this.inop = new Array(3), this.outop = new Array(3), this.algo_ = 0, this.chip_ = null, this.tablehasmade || this.MakeTable(), this.SetAlgorithm(0), this.pms = t.pmtable[0][0]
    }
    return e.prototype.MakeTable = function() {
      for (var t = 0; 64 > t; t++) e.kftable[t] = 65536 * Math.pow(2, t / 768) | 0
    }, e.prototype.SetChip = function(t) {
      this.chip_ = t;
      for (var e = 0; 4 > e; e++) this.op[e].SetChip(t)
    }, e.prototype.Reset = function() {
      for (var t = 0; 4 > t; t++) this.op[t].Reset()
    }, e.prototype.Prepare = function() {
      for (var e = 0; 4 > e; e++) this.op[e].Prepare();
      this.pms = t.pmtable[this.op[0].type_][7 & this.op[0].ms_];
      var i = this.op[0].IsOn() | this.op[1].IsOn() | this.op[2].IsOn() | this.op[3].IsOn() ? 1 : 0,
        s = this.op[0].ms_ & (this.op[0].amon_ || this.op[1].amon_ || this.op[2].amon_ || this.op[3].amon_ ? 55 : 7) ? 2 : 0;
      return i | s
    }, e.prototype.SetFNum = function(t) {
      for (var e = 0; 4 > e; e++) this.op[e].SetFNum(t)
    }, e.prototype.SetKCKF = function(t, i) {
      var s = [5197, 5506, 5833, 6180, 6180, 6547, 6937, 7349, 7349, 7786, 8249, 8740, 8740, 9259, 9810, 10394],
        h = 19 - (t >> 4 & 7),
        a = s[15 & t];
      a = 4 * ((a + 2) / 4 | 0);
      var o = a * e.kftable[63 & i];
      o >>= 19, o <<= 19, o >>= h;
      var n = t >> 2 & 31;
      this.op[0].SetDPBN(o, n), this.op[1].SetDPBN(o, n), this.op[2].SetDPBN(o, n), this.op[3].SetDPBN(o, n)
    }, e.prototype.KeyControl = function(t) {
      1 & t ? this.op[0].KeyOn() : this.op[0].KeyOff(), 2 & t ? this.op[1].KeyOn() : this.op[1].KeyOff(), 4 & t ? this.op[2].KeyOn() : this.op[2].KeyOff(), 8 & t ? this.op[3].KeyOn() : this.op[3].KeyOff()
    }, e.prototype.SetAlgorithm = function(t) {
      var e = [
        [0, 1, 1, 2, 2, 3],
        [1, 0, 0, 1, 1, 2],
        [1, 1, 1, 0, 0, 2],
        [0, 1, 2, 1, 1, 2],
        [0, 1, 2, 2, 2, 1],
        [0, 1, 0, 1, 0, 1],
        [0, 1, 2, 1, 2, 1],
        [1, 0, 1, 0, 1, 0]
      ];
      this.inop[0] = e[t][0], this.outop[0] = e[t][1], this.inop[1] = e[t][2], this.outop[1] = e[t][3], this.inop[2] = e[t][4], this.outop[2] = e[t][5], this.op[0].ResetFB(), this.algo_ = t
    }, e.prototype.Calc = function() {
      var t;
      switch (this.algo_) {
        case 0:
          this.op[2].Calc(this.op[1].Out()), this.op[1].Calc(this.op[0].Out()), t = this.op[3].Calc(this.op[2].Out()), this.op[0].CalcFB(this.fb);
          break;
        case 1:
          this.op[2].Calc(this.op[0].Out() + this.op[1].Out()), this.op[1].Calc(0), t = this.op[3].Calc(this.op[2].Out()), this.op[0].CalcFB(this.fb);
          break;
        case 2:
          this.op[2].Calc(this.op[1].Out()), this.op[1].Calc(0), t = this.op[3].Calc(this.op[0].Out() + this.op[2].Out()), this.op[0].CalcFB(this.fb);
          break;
        case 3:
          this.op[2].Calc(0), this.op[1].Calc(this.op[0].Out()), t = this.op[3].Calc(this.op[1].Out() + this.op[2].Out()), this.op[0].CalcFB(this.fb);
          break;
        case 4:
          this.op[2].Calc(0), t = this.op[1].Calc(this.op[0].Out()), t += this.op[3].Calc(this.op[2].Out()), this.op[0].CalcFB(this.fb);
          break;
        case 5:
          t = this.op[2].Calc(this.op[0].Out()), t += this.op[1].Calc(this.op[0].Out()), t += this.op[3].Calc(this.op[0].Out()), this.op[0].CalcFB(this.fb);
          break;
        case 6:
          t = this.op[2].Calc(0), t += this.op[1].Calc(this.op[0].Out()), t += this.op[3].Calc(0), this.op[0].CalcFB(this.fb);
          break;
        case 7:
          t = this.op[2].Calc(0), t += this.op[1].Calc(0), t += this.op[3].Calc(0), t += this.op[0].CalcFB(this.fb)
      }
      return t
    }, e.prototype.CalcL = function() {
      this.chip_.SetPMV(this.pms[this.chip_.GetPML()]);
      var t;
      switch (this.algo_) {
        case 0:
          this.op[2].CalcL(this.op[1].Out()), this.op[1].CalcL(this.op[0].Out()), t = this.op[3].CalcL(this.op[2].Out()), this.op[0].CalcFBL(this.fb);
          break;
        case 1:
          this.op[2].CalcL(this.op[0].Out() + this.op[1].Out()), this.op[1].CalcL(0), t = this.op[3].CalcL(this.op[2].Out()), this.op[0].CalcFBL(this.fb);
          break;
        case 2:
          this.op[2].CalcL(this.op[1].Out()), this.op[1].CalcL(0), t = this.op[3].CalcL(this.op[0].Out() + this.op[2].Out()), this.op[0].CalcFBL(this.fb);
          break;
        case 3:
          this.op[2].CalcL(0), this.op[1].CalcL(this.op[0].Out()), t = this.op[3].CalcL(this.op[1].Out() + this.op[2].Out()), this.op[0].CalcFBL(this.fb);
          break;
        case 4:
          this.op[2].CalcL(0), t = this.op[1].CalcL(this.op[0].Out()), t += this.op[3].CalcL(this.op[2].Out()), this.op[0].CalcFBL(this.fb);
          break;
        case 5:
          t = this.op[2].CalcL(this.op[0].Out()), t += this.op[1].CalcL(this.op[0].Out()), t += this.op[3].CalcL(this.op[0].Out()), this.op[0].CalcFBL(this.fb);
          break;
        case 6:
          t = this.op[2].CalcL(0), t += this.op[1].CalcL(this.op[0].Out()), t += this.op[3].CalcL(0), this.op[0].CalcFBL(this.fb);
          break;
        case 7:
          t = this.op[2].CalcL(0), t += this.op[1].CalcL(0), t += this.op[3].CalcL(0), t += this.op[0].CalcFBL(this.fb)
      }
      return t
    }, e.prototype.CalcN = function(t) {
      this.buf[1] = this.buf[2] = this.buf[3] = 0, this.buf[0] = this.op[0].out_, this.op[0].CalcFB(this.fb), this.buf[this.outop[0]] += this.op[1].Calc(this.buf[this.inop[0]]), this.buf[this.outop[1]] += this.op[2].Calc(this.buf[this.inop[1]]);
      var e = this.op[3].out_;
      return this.op[3].CalcN(t), this.buf[this.outop[2]] + e
    }, e.prototype.CalcLN = function(t) {
      this.chip_.SetPMV(this.pms[this.chip_.GetPML()]), this.buf[1] = this.buf[2] = this.buf[3] = 0, this.buf[0] = this.op[0].out_, this.op[0].CalcFBL(this.fb), this.buf[this.outop[0]] += this.op[1].CalcL(this.buf[this.inop[0]]), this.buf[this.outop[1]] += this.op[2].CalcL(this.buf[this.inop[1]]);
      var e = this.op[3].out_;
      return this.op[3].CalcN(t), this.buf[this.outop[2]] + e
    }, e.prototype.SetType = function(t) {
      for (var e = 0; 4 > e; e++) this.op[e].type_ = t
    }, e.prototype.SetFB = function(t) {
      this.fb = e.fbtable[t]
    }, e.prototype.SetMS = function(t) {
      for (var e = 0; 4 > e; e++) this.op[e].SetMS(t)
    }, e.prototype.Mute = function(t) {
      for (var e = 0; 4 > e; e++) this.op[e].Mute(t)
    }, e.fbtable = [31, 7, 6, 5, 4, 3, 2, 1], e.kftable = new Array(64), e
  }();
  t.Channel4 = s;
  var h = function() {
    function e() {
      this.ratio_ = 0, this.aml_ = 0, this.pml_ = 0, this.pmv_ = 0
    }
    return e.prototype.SetRatio = function(t) {
      this.ratio_ !== t && (this.ratio_ = t, this.MakeTable())
    }, e.prototype.SetAML = function(e) {
      this.aml_ = e & t.FM_LFOENTS - 1
    }, e.prototype.SetPML = function(e) {
      this.pml_ = e & t.FM_LFOENTS - 1
    }, e.prototype.SetPMV = function(t) {
      this.pmv_ = t
    }, e.prototype.GetMulValue = function(t, e) {
      return this.multable_[t][e]
    }, e.prototype.GetAML = function() {
      return this.aml_
    }, e.prototype.GetPML = function() {
      return this.pml_
    }, e.prototype.GetPMV = function() {
      return this.pmv_
    }, e.prototype.GetRatio = function() {
      return this.ratio_
    }, e.prototype.MakeTable = function() {
      var e, i, s = [1, 1.414, 1.581, 1.732];
      for (this.multable_ = new Array(4), e = 0; 4 > e; e++) {
        var h = s[e] * this.ratio_ / (1 << 2 + t.FM_RATIOBITS - t.FM_PGBITS);
        for (this.multable_[e] = new Array(16), i = 0; 16 > i; i++) {
          var a = i ? 2 * i : 1;
          this.multable_[e][i] = a * h | 0
        }
      }
    }, e
  }();
  t.Chip = h, t.MakeLFOTable = e
}(FM || (FM = {}));
var FM;
! function(t) {
  "use strict";
  var e = function() {
    function t() {
      this.OPM_LFOENTS = 512, this.regtc = 0, this.regta = new Array(2), this.timera = 0, this.timera_count = 0, this.timerb = 0, this.timerb_count = 0, this.timer_step = 0
    }
    return t.prototype.Reset = function() {
      this.timera_count = 0, this.timerb_count = 0
    }, t.prototype.SetTimerControl = function(t) {
      var e = this.regtc ^ t;
      this.regtc = t, 16 & t && this.ResetStatus(1), 32 & t && this.ResetStatus(2), 1 & e && (this.timera_count = 1 & t ? this.timera : 0), 2 & e && (this.timerb_count = 2 & t ? this.timerb : 0)
    }, t.prototype.SetTimerA = function(t, e) {
      var i;
      this.regta[1 & t] = e, i = (this.regta[0] << 2) + (3 & this.regta[1]), this.timera = (1024 - i) * this.timer_step
    }, t.prototype.SetTimerB = function(t) {
      this.timerb = (256 - t) * this.timer_step
    }, t.prototype.Count = function(t) {
      var e = !1;
      if (this.timera_count && (this.timera_count -= t << 16, this.timera_count <= 0)) {
        for (e = !0, this.TimerA(); this.timera_count <= 0;) this.timera_count += this.timera;
        4 & this.regtc && this.SetStatus(1)
      }
      if (this.timerb_count && (this.timerb_count -= t << 12, this.timerb_count <= 0)) {
        for (e = !0; this.timerb_count <= 0;) this.timerb_count += this.timerb;
        8 & this.regtc && this.SetStatus(2)
      }
      return e
    }, t.prototype.GetNextEvent = function() {
      var t = (this.timera_count + 65535 >> 16) - 1,
        e = (this.timerb_count + 4095 >> 12) - 1;
      return (e > t ? t : e) + 1
    }, t.prototype.SetTimerBase = function(t) {
      this.timer_step = 65536e6 / t | 0
    }, t.prototype.SetStatus = function(t) {}, t.prototype.ResetStatus = function(t) {}, t.prototype.TimerA = function() {}, t
  }();
  t.Timer = e
}(FM || (FM = {}));
var FM;
! function(t) {
  "use strict";
  var e = function(e) {
    function i() {
      e.call(this), this.fmvolume = 0, this.clock = 0, this.rate = 0, this.pcmrate = 0, this.pmd = 0, this.amd = 0, this.lfocount = 0, this.lfodcount = 0, this.lfo_count_ = 0, this.lfo_count_diff_ = 0, this.lfo_step_ = 0, this.lfo_count_prev_ = 0, this.lfowaveform = 0, this.rateratio = 0, this.noise = 0, this.noisecount = 0, this.noisedelta = 0, this.interpolation = !1, this.lfofreq = 0, this.status = 0, this.reg01 = 0, this.kc = new Array(8), this.kf = new Array(8), this.pan = new Array(8), this.ch = [new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4], this.chip = new t.Chip, this.lfo_count_ = 0, this.lfo_count_prev_ = -1, this.BuildLFOTable();
      for (var i = 0; 8 > i; i++) this.ch[i].SetChip(this.chip), this.ch[i].SetType(t.OpType.typeM)
    }
    return __extends(i, e), i.prototype.Init = function(t, e) {
      return this.SetRate(t, e) ? (this.Reset(), this.SetVolume(0), this.SetChannelMask(0), !0) : !1
    }, i.prototype.SetRate = function(t, e) {
      return this.clock = t, this.pcmrate = e, this.rate = e, this.RebuildTimeTable(), !0
    }, i.prototype.SetChannelMask = function(t) {
      for (var e = 0; 8 > e; e++) this.ch[e].Mute(!!(t & 1 << e))
    }, i.prototype.Reset = function() {
      var t;
      for (t = 0; 256 > t; t++) this.SetReg(t, 0);
      for (this.SetReg(25, 128), e.prototype.Reset.call(this), this.status = 0, this.noise = 12345, this.noisecount = 0, t = 0; 8 > t; t++) this.ch[t].Reset()
    }, i.prototype.RebuildTimeTable = function() {
      var e = this.clock / 64 | 0;
      this.rateratio = ((e << t.FM_RATIOBITS) + this.rate / 2) / this.rate | 0, this.SetTimerBase(e), this.chip.SetRatio(this.rateratio)
    }, i.prototype.SetVolume = function(t) {
      t = Math.min(t, 20), t > -192 ? this.fmvolume = 16384 * Math.pow(10, t / 40) | 0 : this.fmvolume = 0
    }, i.prototype.SetStatus = function(t) {
      this.status & t || (this.status |= t, this.Intr(!0))
    }, i.prototype.ResetStatus = function(t) {
      this.status & t && (this.status &= ~t, this.status || this.Intr(!1))
    }, i.prototype.SetReg = function(e, i) {
      if (!(e >= 256)) {
        var s = 7 & e;
        switch (255 & e) {
          case 1:
            2 & i && (this.lfo_count_ = 0, this.lfo_count_prev_ = -1), this.reg01 = i;
            break;
          case 8:
            128 & this.regtc ? (s = 7 & i, 8 & i || this.ch[s].op[0].KeyOff(), 16 & i || this.ch[s].op[1].KeyOff(), 32 & i || this.ch[s].op[2].KeyOff(), 64 & i || this.ch[s].op[3].KeyOff()) : this.ch[7 & i].KeyControl(i >> 3);
            break;
          case 16:
          case 17:
            this.SetTimerA(e, i);
            break;
          case 18:
            this.SetTimerB(i);
            break;
          case 20:
            this.SetTimerControl(i);
            break;
          case 24:
            this.lfofreq = i, this.lfo_count_diff_ = this.rateratio * (16 + (15 & this.lfofreq) << 12 - t.FM_RATIOBITS) / (1 << 15 - (this.lfofreq >> 4)) | 0;
            break;
          case 25:
            0 !== (128 & i) ? this.pmd : this.amd = 127 & i;
            break;
          case 27:
            this.lfowaveform = 3 & i;
            break;
          case 32:
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
            this.ch[s].SetFB(i >> 3 & 7), this.ch[s].SetAlgorithm(7 & i), this.pan[s] = i >> 6 & 3;
            break;
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
            this.kc[s] = i, this.ch[s].SetKCKF(this.kc[s], this.kf[s]);
            break;
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
            this.kf[s] = i >> 2, this.ch[s].SetKCKF(this.kc[s], this.kf[s]);
            break;
          case 56:
          case 57:
          case 58:
          case 59:
          case 60:
          case 61:
          case 62:
          case 63:
            this.ch[s].SetMS(i << 4 | i >> 4);
            break;
          case 15:
            this.noisedelta = i, this.noisecount = 0;
            break;
          default:
            e >= 64 && this.SetParameter(e, i)
        }
      }
    }, i.prototype.SetParameter = function(t, e) {
      var i = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 124],
        s = [0, 2, 1, 3],
        h = s[t >> 3 & 3],
        a = this.ch[7 & t].op[h];
      switch (t >> 5 & 7) {
        case 2:
          a.SetDT(e >> 4 & 7), a.SetMULTI(15 & e);
          break;
        case 3:
          a.SetTL(127 & e);
          break;
        case 4:
          a.SetKS(e >> 6 & 3), a.SetAR(2 * (31 & e));
          break;
        case 5:
          a.SetDR(2 * (31 & e)), a.SetAMON(0 !== (128 & e));
          break;
        case 6:
          a.SetSR(2 * (31 & e)), a.SetDT2(e >> 6 & 3);
          break;
        case 7:
          a.SetSL(i[e >> 4 & 15]), a.SetRR(4 * (15 & e) + 2)
      }
    }, i.prototype.BuildLFOTable = function() {
      this.amtable = new Array(4), this.pmtable = new Array(4);
      for (var t = 0; 4 > t; t++) {
        var e = 0;
        this.amtable[t] = new Array(this.OPM_LFOENTS), this.pmtable[t] = new Array(this.OPM_LFOENTS);
        for (var i = 0; i < this.OPM_LFOENTS; i++) {
          var s, h;
          switch (t) {
            case 0:
              h = ((i + 256 & 511) / 2 | 0) - 128, s = 255 - (i / 2 | 0);
              break;
            case 1:
              s = 256 > i ? 255 : 0, h = 256 > i ? 127 : -128;
              break;
            case 2:
              h = i + 128 & 511, h = 256 > h ? h - 128 : 383 - h, s = 256 > i ? 255 - i : i - 256;
              break;
            case 3:
              3 & i || (e = 255 & ((32768 * Math.random() | 0) / 17 | 0)), s = e, h = e - 128
          }
          this.amtable[t][i] = s, this.pmtable[t][i] = -h - 1
        }
      }
    }, i.prototype.LFO = function() {
      var t;
      3 !== this.lfowaveform ? (t = this.lfo_count_ >> 15 & 510, this.chip.SetPML(this.pmtable[this.lfowaveform][t] * (this.pmd / 128 | 0) + 128), this.chip.SetAML(this.amtable[this.lfowaveform][t] * (this.amd / 128 | 0))) : -131072 & (this.lfo_count_ ^ this.lfo_count_prev_) && (t = 255 & ((32768 * Math.random() | 0) / 17 | 0), this.chip.SetPML(((t - 128) * this.pmd / 128 | 0) + 128), this.chip.SetAML(t * this.amd / 128 | 0)), this.lfo_count_prev_ = this.lfo_count_, this.lfo_step_++, 0 === (7 & this.lfo_step_) && (this.lfo_count_ += this.lfo_count_diff_)
    }, i.prototype.Noise = function() {
      if (this.noisecount += 2 * this.rateratio, this.noisecount >= 32 << t.FM_RATIOBITS) {
        var e = 32 - (31 & this.noisedelta);
        1 === e && (e = 2), this.noisecount = this.noisecount - (e << t.FM_RATIOBITS), 31 === (31 & this.noisedelta) && (this.noisecount -= t.FM_RATIOBITS), this.noise = this.noise >> 1 ^ (1 & this.noise ? 33800 : 0)
      }
      return this.noise
    }, i.prototype.MixSub = function(t, e) {
      16384 & t && (e[this.pan[0]] = this.ch[0].Calc()), 4096 & t && (e[this.pan[1]] += this.ch[1].Calc()), 1024 & t && (e[this.pan[2]] += this.ch[2].Calc()), 256 & t && (e[this.pan[3]] += this.ch[3].Calc()), 64 & t && (e[this.pan[4]] += this.ch[4].Calc()), 16 & t && (e[this.pan[5]] += this.ch[5].Calc()), 4 & t && (e[this.pan[6]] += this.ch[6].Calc()), 1 & t && (128 & this.noisedelta ? e[this.pan[7]] += this.ch[7].CalcN(this.Noise()) : e[this.pan[7]] += this.ch[7].Calc())
    }, i.prototype.MixSubL = function(t, e) {
      16384 & t && (e[this.pan[0]] = this.ch[0].CalcL()), 4096 & t && (e[this.pan[1]] += this.ch[1].CalcL()), 1024 & t && (e[this.pan[2]] += this.ch[2].CalcL()), 256 & t && (e[this.pan[3]] += this.ch[3].CalcL()), 64 & t && (e[this.pan[4]] += this.ch[4].CalcL()), 16 & t && (e[this.pan[5]] += this.ch[5].CalcL()), 4 & t && (e[this.pan[6]] += this.ch[6].CalcL()), 1 & t && (128 & this.noisedelta ? e[this.pan[7]] += this.ch[7].CalcLN(this.Noise()) : e[this.pan[7]] += this.ch[7].CalcL())
    }, i.prototype.Mix = function(t, e, i, s) {
      for (var h = 0, a = i + s, o = 0; 8 > o; o++) h = h << 2 | this.ch[o].Prepare();
      2 & this.reg01 && (h &= 21845);
      var n = new Array(4);
      for (o = i; a > o; o++) n[1] = n[2] = n[3] = 0, this.LFO(), 43690 & h ? this.MixSubL(h, n) : this.MixSub(h, n), t[o] = (n[1] + n[3]) / 49152, e[o] = (n[2] + n[3]) / 49152
    }, i.prototype.Intr = function(t) {}, i
  }(t.Timer);
  t.OPM = e
}(FM || (FM = {}));
var MXDRV;
! function(t) {
  "use strict";
  var e = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30, 32, 33, 34, 36, 37, 38, 40, 41, 42, 44, 45, 46, 48, 49, 50, 52, 53, 54, 56, 57, 58, 60, 61, 62, 64, 65, 66, 68, 69, 70, 72, 73, 74, 76, 77, 78, 80, 81, 82, 84, 85, 86, 88, 89, 90, 92, 93, 94, 96, 97, 98, 100, 101, 102, 104, 105, 106, 108, 109, 110, 112, 113, 114, 116, 117, 118, 120, 121, 122, 124, 125, 126],
    i = function() {
      function t() {
        this.pointer = 0, this.isEnd = !1, this.isKeyon = !1, this.keyonSkip = !1, this.keyonCommand = !1, this.tie = !1, this.panpot = 3, this.keyon_slot = 0, this.voice = 0, this.note = 0, this.detune = 0, this.portamento = !1, this.portamentoDelta = 0, this.portamentoOffset = 0, this.length = 0, this.duration = 0, this.quantize = 8, this.volume = 8, this.pmsams = 0, this.lfoDelay = 0, this.lfoDelayCounter = 0, this.mpFlg = !1, this.mpWave = 0, this.mpDelta = 0, this.mpOffset = 0, this.mpDeltaStart = 0, this.mpLength = 0, this.mpLength_ = 0, this.mpLengthCounter = 0, this.repeat = []
      }
      return t
    }();
  t.MXWORK_CH = i;
  var s = function() {
    function s(t) {
      var s = this;
      this.mdxdata = null, this.opm = new FM.OPM, this.playFlg = !1, this.stopFlg = !1, this.pointer = new Array(8), this.voice_index = new Array(256), this.channel = [new i, new i, new i, new i, new i, new i, new i, new i], this.sampleRate = t, this.opm.Init(4e6, t), this.tempoSet(200), this.opm.SetReg(20, 42), this.opm.Intr = function(t) {
        if (t) {
          var i;
          if (s.opm.SetReg(20, 32), s.stopFlg) {
            for (var h = 224; 256 > h; h++) s.opm.SetReg(h, 15);
            for (var a = 0; 8 > a; a++) s.opm.SetReg(8, a);
            s.stopFlg = !1
          } else if (s.playFlg)
            for (var a = 0; 8 > a; a++)
              if (i = s.channel[a], i.isEnd) i.isKeyon && (i.isKeyon = !1, s.opm.SetReg(8, a));
              else {
                for (i.length > 0 && (i.length--, i.duration--, i.portamento && (0 === i.length ? i.portamento = !1 : i.portamentoOffset += i.portamentoDelta)), i.mpFlg && (0 !== i.lfoDelayCounter && i.lfoDelayCounter--, 0 === i.lfoDelayCounter && s.modulationPitchStep(a)), i.isKeyon && i.duration <= 0 && (i.keyonSkip || (i.isKeyon = !1, s.opm.SetReg(8, a))); 0 === i.length && (s.execute(a), !i.isEnd););
                if (i.isKeyon || i.mpFlg) {
                  var o = i.note;
                  o += i.portamentoOffset >> 8, o += i.mpOffset >> 8, o > 8191 ? o = 8191 : 0 > o && (o = 0), s.opm.SetReg(40 + a, e[o >> 6]), s.opm.SetReg(48 + a, (63 & o) << 2)
                }
                i.isKeyon && (i.keyonCommand && (i.keyonCommand = !1, s.opm.SetReg(8, (i.keyon_slot << 3) + a)), i.tie && (i.tie = !1, i.keyonSkip = !0))
              }
          s.opm.SetReg(20, 42)
        }
      }
    }
    return s.prototype.setData = function(t) {
      this.mdxdata = t;
      for (var e, i = 0; 0 !== this.mdxdata[i];) i++;
      i++, e = i + this.getWord(this.mdxdata, i);
      var s = (this.mdxdata.byteLength - e) / 27 | 0;
      i += 2;
      for (var h = 0; s > h; h++) {
        var a = e + 27 * h;
        this.voice_index[this.mdxdata[a]] = a
      }
      for (var o = 0; 8 > o; o++) {
        var a = i + this.getWord(this.mdxdata, i + 2 * o);
        this.pointer[o] = a - 2
      }
    }, s.prototype.init = function() {
      for (var t = 0; 8 > t; t++) this.channel[t].pointer = this.pointer[t], this.channel[t].isEnd = !1, this.channel[t].isKeyon = !1, this.channel[t].keyonSkip = !1, this.channel[t].keyonCommand = !1, this.channel[t].tie = !1, this.channel[t].panpot = 3, this.channel[t].keyon_slot = 0, this.channel[t].voice = 0, this.channel[t].note = 0, this.channel[t].detune = 0, this.channel[t].portamento = !1, this.channel[t].portamentoDelta = 0, this.channel[t].portamentoOffset = 0, this.channel[t].length = 0, this.channel[t].duration = 0, this.channel[t].quantize = 8, this.channel[t].volume = 8, this.channel[t].pmsams = 0, this.channel[t].lfoDelay = 0, this.channel[t].lfoDelayCounter = 0, this.channel[t].mpFlg = !1, this.channel[t].mpWave = 0, this.channel[t].mpDelta = 0, this.channel[t].mpOffset = 0, this.channel[t].mpDeltaStart = 0, this.channel[t].mpLength = 0, this.channel[t].mpLength_ = 0, this.channel[t].mpLengthCounter = 0, this.channel[t].repeat = [], this.opm.SetReg(56 + t, 0);
      this.opm.SetReg(15, 0)
    }, s.prototype.play = function() {
      this.tempoSet(200), this.playFlg = !0
    }, s.prototype.stop = function() {
      this.stopFlg = !0, this.playFlg = !1
    }, s.prototype.execute = function(t) {
      var e = this.channel[t];
      switch (this.mdxdata[e.pointer]) {
        case 255:
          this.tempoSet(this.mdxdata[e.pointer + 1]), e.pointer += 2;
          break;
        case 254:
          this.opm.SetReg(this.mdxdata[e.pointer + 1], this.mdxdata[e.pointer + 2]), e.pointer += 3;
          break;
        case 253:
          e.voice = this.mdxdata[e.pointer + 1];
          var i = this.voice_index[e.voice];
          this.opm.SetReg(32 + t, this.mdxdata[i + 1]);
          for (var s = 0; 24 > s; s++) this.opm.SetReg(64 + t + 8 * s, this.mdxdata[i + 3 + s]);
          e.keyon_slot = this.mdxdata[i + 2], this.panpotSet(t), this.volumeSet(t), e.pointer += 2;
          break;
        case 252:
          e.panpot = this.mdxdata[e.pointer + 1], this.panpotSet(t), e.pointer += 2;
          break;
        case 251:
          e.volume = this.mdxdata[e.pointer + 1], this.volumeSet(t), e.pointer += 2;
          break;
        case 250:
          128 & e.volume ? (e.volume++, e.volume > 255 && (e.volume = 255)) : (e.volume--, e.volume < 0 && (e.volume = 0)), this.volumeSet(t), e.pointer++;
          break;
        case 249:
          128 & e.volume ? (e.volume--, e.volume < 128 && (e.volume = 128)) : (e.volume++, e.volume > 15 && (e.volume = 15)), this.volumeSet(t), e.pointer++;
          break;
        case 248:
          e.quantize = this.mdxdata[e.pointer + 1], e.pointer += 2;
          break;
        case 247:
          e.tie = !0, e.pointer++;
          break;
        case 246:
          var h = this.mdxdata[e.pointer + 1];
          e.repeat.push(h), e.pointer += 3;
          break;
        case 245:
          var h = this.getWord(this.mdxdata, e.pointer + 1, !0);
          e.pointer += 3, e.repeat[e.repeat.length - 1] > 1 ? (e.repeat[e.repeat.length - 1] --, e.pointer += h) : e.repeat.pop();
          break;
        case 244:
          var h = this.getWord(this.mdxdata, e.pointer + 1, !0);
          e.pointer += 3, 1 === e.repeat[e.repeat.length - 1] && (e.pointer += h - 1);
          break;
        case 243:
          var h = this.getWord(this.mdxdata, e.pointer + 1, !0);
          e.detune = h, e.pointer += 3;
          break;
        case 242:
          e.portamento = !0, e.portamentoDelta = this.getWord(this.mdxdata, e.pointer + 1, !0), e.pointer += 3;
          break;
        case 241:
          if (0 === this.mdxdata[e.pointer + 1]) e.isEnd = !0, e.pointer += 2;
          else {
            var h = this.getWord(this.mdxdata, e.pointer + 1, !0);
            e.pointer += h, e.pointer += 3
          }
          break;
        case 240:
          e.pointer += 2;
          break;
        case 239:
          e.pointer += 2;
          break;
        case 238:
          e.pointer++;
          break;
        case 237:
          this.opm.SetReg(15, this.mdxdata[e.pointer + 1]), e.pointer += 2;
          break;
        case 236:
          if (128 & this.mdxdata[e.pointer + 1]) 128 === this.mdxdata[e.pointer + 1] ? (e.mpFlg = !1, e.mpOffset = 0) : (e.mpFlg = !0, this.modulationPitchInit(t));
          else {
            switch (e.mpFlg = !0, e.mpWave = 3 & this.mdxdata[e.pointer + 1], e.mpLength = this.getWord(this.mdxdata, e.pointer + 2), e.mpDeltaStart = this.getWord(this.mdxdata, e.pointer + 4, !0), 4 & this.mdxdata[e.pointer + 1] && (e.mpDeltaStart <<= 8), e.mpWave) {
              case 0:
                e.mpLength >>= 1, e.mpLength_ = e.mpLength;
                break;
              case 1:
                e.mpLength_ = e.mpLength;
                break;
              case 2:
                e.mpLength_ = e.mpLength >> 1;
                break;
              case 3:
                e.mpLength_ = 1
            }
            this.modulationPitchInit(t)
          }
          e.pointer += 128 & this.mdxdata[e.pointer + 1] ? 2 : 6;
          break;
        case 235:
          e.pointer += 128 & this.mdxdata[e.pointer + 1] ? 2 : 6;
          break;
        case 234:
          128 & this.mdxdata[e.pointer + 1] ? 1 & this.mdxdata[e.pointer + 1] ? this.opm.SetReg(56 + t, e.pmsams) : this.opm.SetReg(56 + t, 0) : (this.opm.SetReg(27, 3 & this.mdxdata[e.pointer + 1]), this.opm.SetReg(24, this.mdxdata[e.pointer + 2]), this.opm.SetReg(25, this.mdxdata[e.pointer + 3]), this.opm.SetReg(25, this.mdxdata[e.pointer + 4]), e.pmsams = this.mdxdata[e.pointer + 5], this.opm.SetReg(56 + t, e.pmsams)), e.pointer += 128 & this.mdxdata[e.pointer + 1] ? 2 : 6;
          break;
        case 233:
          e.lfoDelay = this.mdxdata[e.pointer + 1], 0 === e.lfoDelay && (e.lfoDelayCounter = 0), e.pointer += 2;
          break;
        case 232:
          e.pointer++;
          break;
        case 231:
          e.pointer += 3;
          break;
        case 230:
        case 229:
        case 228:
        case 227:
        case 226:
        case 225:
        case 224:
          break;
        default:
          this.mdxdata[e.pointer] >= 128 ? (e.note = (127 & this.mdxdata[e.pointer++]) << 6, e.note += 5 + e.detune, e.portamentoOffset = 0, e.isKeyon = !0, e.keyonSkip || (e.keyonCommand = !0, e.mpFlg && (0 === e.lfoDelay ? e.lfoDelayCounter = 0 : (e.lfoDelayCounter = e.lfoDelay, this.modulationPitchInit(t)))), e.length = this.mdxdata[e.pointer++] + 1, e.duration = 128 & e.quantize ? e.length - (256 - e.quantize) : e.length * e.quantize >> 3) : (e.length = this.mdxdata[e.pointer++] + 1, e.duration = e.length), e.keyonSkip = !1
      }
    }, s.prototype.tempoSet = function(t) {
      this.opm.SetReg(18, t), this.stepTime = 256 * (256 - t), this.stepSamples = Math.round(this.stepTime * this.sampleRate / 1e6)
    }, s.prototype.panpotSet = function(t) {
      var e = this.channel[t].voice;
      if ("undefined" != typeof this.voice_index[e]) {
        var i = 63 & this.mdxdata[this.voice_index[e] + 1];
        i |= this.channel[t].panpot << 6, this.opm.SetReg(32 + t, i)
      }
    }, s.prototype.volumeSet = function(e) {
      var i = this.channel[e],
        s = i.voice,
        h = i.volume;
      if ("undefined" != typeof this.voice_index[s])
        for (var a = 7 & this.mdxdata[this.voice_index[s] + 1], o = 0; 4 > o; o++)
          if (t.Player.carrierSlot[a] & 1 << o) {
            var n = this.mdxdata[this.voice_index[s] + 7 + o];
            n += 128 & h ? h - 128 : t.Player.volume[h], n > 127 && (n = 127), this.opm.SetReg(96 + e + 8 * o, n)
          }
    }, s.prototype.modulationPitchInit = function(t) {
      var e = this.channel[t];
      e.mpOffset = 0, e.mpDelta = e.mpDeltaStart, e.mpLengthCounter = e.mpLength_
    }, s.prototype.modulationPitchStep = function(e) {
      var i = this.channel[e];
      switch (i.mpWave) {
        case 0:
          i.mpOffset += i.mpDelta, i.mpLengthCounter--, 0 === i.mpLengthCounter && (i.mpLengthCounter = i.mpLength, i.mpOffset = -i.mpOffset);
          break;
        case 1:
          i.mpOffset = i.mpDelta, i.mpLengthCounter--, 0 === i.mpLengthCounter && (i.mpLengthCounter = i.mpLength, i.mpDelta = -i.mpDelta);
          break;
        case 2:
          i.mpOffset += i.mpDelta, i.mpLengthCounter--, 0 === i.mpLengthCounter && (i.mpLengthCounter = i.mpLength, i.mpDelta = -i.mpDelta);
          break;
        case 3:
          if (i.mpLengthCounter--, 0 === i.mpLengthCounter) {
            var s = t.Player.randomseed;
            s *= 50505, s += 12, s &= 65535, t.Player.randomseed = s, s >= 32768 && (s -= 65536), i.mpOffset = s * i.mpDelta, i.mpLengthCounter = i.mpLength
          }
      }
    }, s.prototype.getWord = function(t, e, i) {
      void 0 === i && (i = !1);
      var s = (t[e] << 8) + t[e + 1];
      return i && s >= 32768 && (s -= 65536), s
    }, s.carrierSlot = [8, 8, 8, 8, 12, 14, 14, 15], s.volume = [42, 40, 37, 34, 32, 29, 26, 24, 21, 18, 16, 13, 10, 8, 5, 2], s.randomseed = 4660, s
  }();
  t.Player = s
}(MXDRV || (MXDRV = {})),
function(t) {
  "use strict";
  t(document).ready(function() {
    var e, i = new XMLHttpRequest;
    i.open("GET", "./YS2_01.MDX", !0), i.responseType = "arraybuffer", i.onload = function(s) {
      var h = i.response;
      if (h) {
        var a, o = new Uint8Array(h);
        if ("undefined" != typeof AudioContext) a = new AudioContext;
        else {
          if ("undefined" == typeof webkitAudioContext) throw new Error("AudioContext not supported. :(");
          a = new webkitAudioContext
        }
        var n = a.createBiquadFilter(),
          p = 2048,
          r = 2,
          c = 2,
          _ = a.createScriptProcessor(p, r, c),
          l = new MXDRV.Player(a.sampleRate);
        l.setData(o), n.type = "lowpass", n.frequency.value = .45 * a.sampleRate, n.Q.value = Math.SQRT1_2;
        var u = 0;
        _.onaudioprocess = function(t) {
          for (var e = t.outputBuffer, i = e.getChannelData(0), s = e.getChannelData(1), h = p, a = 0;;) {
            if (0 === u && (l.opm.Count(l.stepTime), u = l.stepSamples), !(h >= u)) {
              l.opm.Mix(i, s, a, h), u -= h;
              break
            }
            l.opm.Mix(i, s, a, u), a += u, h -= u, u = 0
          }
        }, t(window).on("unload", function() {
          _.disconnect(), _.onaudioprocess = null
        }), _.connect(n), n.connect(a.destination);
        var f = !1;
        t("#mdx-play").on("click", function() {
          f || (a.createBufferSource().start(0), f = !0), l.stop(), l.init(), l.play()
        }), t("#mdx-stop").on("click", function() {
          l.stop()
        }), t("#mdx-load").on("change", function(i) {
          var s = new FileReader;
          s.onload = function() {
            e = new Uint8Array(this.result), l.stop(), l.setData(e), t("#mdx-title").text(i.target.files[0].name)
          }, s.readAsArrayBuffer(i.target.files[0])
        })
      }
    }, i.send(null)
  })
}(jQuery);
