'use strict';

// YM2151 core is slightly modified from Kuma's MDX player.
// source: https://github.com/vgm/node-vgmplay/blob/master/res/js/vgm/ym2151.js

var __extends = this.__extends || function(t, e) {
	for (var i in e)
		if (e.hasOwnProperty(i)) t[i] = e[i];
	function s() {
		this.constructor = t
	}
	s.prototype = e.prototype;
	t.prototype = new s
};

(function(){

var FM;
(function(t) {
	t.FM_PGBITS = 9;
	t.FM_RATIOBITS = 7;
	t.FM_LFOBITS = 8;
	t.FM_TLBITS = 7;
	t.FM_TLENTS = 1 << t.FM_TLBITS;
	t.FM_LFOENTS = 1 << t.FM_LFOBITS;
	t.FM_CLENTS = 4096 * 2;
	t.FM_OPSINBITS = 10;
	t.FM_OPSINENTS = 1 << t.FM_OPSINBITS;
	t.FM_EG_BOTTOM = 955;
	t.IS2EC_SHIFT = 20 + t.FM_PGBITS - 13
})(FM || (FM = {}));
//var FM;
(function(t) {
	"use strict";
	(function(t) {
		t[t["typeN"] = 0] = "typeN";
		t[t["typeM"] = 1] = "typeM"
	})(t.OpType || (t.OpType = {}));
	var e = t.OpType;
	t.pmtable;
	t.amtable;
	t.tablemade = false;
	var i = function() {
		function e() {
			this.chip_ = null;
			this.out_ = 0;
			this.out2_ = 0;
			this.in2_ = 0;
			this.dp_ = 0;
			this.detune_ = 0;
			this.detune2_ = 0;
			this.multiple_ = 0;
			this.pg_count_ = 0;
			this.pg_diff_ = 0;
			this.pg_diff_lfo_ = 0;
			this.bn_ = 0;
			this.eg_level_ = 0;
			this.eg_level_on_next_phase_ = 0;
			this.eg_count_ = 0;
			this.eg_count_diff_ = 0;
			this.eg_out_ = 0;
			this.tl_out_ = 0;
			this.eg_rate_ = 0;
			this.eg_curve_count_ = 0;
			this.key_scale_rate_ = 0;
			this.eg_phase_ = e.EGPhase.next;
			this.ms_ = 0;
			this.tl_ = 0;
			this.tl_latch_ = 0;
			this.ar_ = 0;
			this.dr_ = 0;
			this.sr_ = 0;
			this.sl_ = 0;
			this.rr_ = 0;
			this.ks_ = 0;
			this.keyon_ = false;
			this.amon_ = false;
			this.param_changed_ = false;
			this.mute_ = false;
			this.dbgopout_ = 0;
			this.dbgpgout_ = 0;
			if (!e.tablehasmade) {
				this.MakeTable()
			}
			this.ar_ = this.dr_ = this.sr_ = this.rr_ = this.key_scale_rate_ = 0;
			this.ams_ = t.amtable[0][0];
			this.mute_ = false;
			this.keyon_ = false;
			this.tl_out_ = 0;
			this.multiple_ = 0;
			this.detune_ = 0;
			this.detune2_ = 0;
			this.ms_ = 0
		}
		e.prototype.SetChip = function(t) {
			this.chip_ = t
		};
		//TODO there are two e.prototype.Reset functions!
		e.prototype.Reset = function() {
			this.tl_ = this.tl_latch_ = 127;
			this.ShiftPhase(e.EGPhase.off);
			this.eg_count_ = 0;
			this.eg_curve_count_ = 0;
			this.pg_count_ = 0;
			this.out_ = this.out2_ = 0;
			this.param_changed_ = true
		};
		e.prototype.MakeTable = function() {
			var i = 0;
			var s;
			for (s = 0; s < 256; s++) {
				var a = Math.floor(Math.pow(2, 13 - s / 256));
				a = a + 2 & ~3;
				e.cltable[i++] = a;
				e.cltable[i++] = -a
			}
			while (i < t.FM_CLENTS) {
				e.cltable[i] = e.cltable[i - 512] / 2 | 0;
				i++
			}
			for (s = 0; s < t.FM_OPSINENTS / 2; s++) {
				var h = (s * 2 + 1) * Math.PI / t.FM_OPSINENTS;
				var o = -256 * Math.log(Math.sin(h)) / Math.LN2;
				var n = Math.floor(o + .5) + 1;
				e.sinetable[s] = n * 2;
				e.sinetable[t.FM_OPSINENTS / 2 + s] = n * 2 + 1
			}
			t.MakeLFOTable();
			e.tablehasmade = true
		};
		e.prototype.SetDPBN = function(t, e) {
			this.dp_ = t;
			this.bn_ = e;
			this.param_changed_ = true
		};
		e.prototype.Prepare = function() {
			if (this.param_changed_) {
				this.param_changed_ = false;
				this.pg_diff_ = (this.dp_ + e.dttable[this.detune_ + this.bn_]) * this.chip_.GetMulValue(this.detune2_, this.multiple_);
				this.pg_diff_lfo_ = this.pg_diff_ >> 11;
				this.key_scale_rate_ = this.bn_ >> 3 - this.ks_;
				this.tl_out_ = this.mute_ ? 1023 : this.tl_ * 8;
				switch (this.eg_phase_) {
					case e.EGPhase.attack:
						this.SetEGRate(this.ar_ ? Math.min(63, this.ar_ + this.key_scale_rate_) : 0);
						break;
					case e.EGPhase.decay:
						this.SetEGRate(this.dr_ ? Math.min(63, this.dr_ + this.key_scale_rate_) : 0);
						this.eg_level_on_next_phase_ = this.sl_ * 8;
						break;
					case e.EGPhase.sustain:
						this.SetEGRate(this.sr_ ? Math.min(63, this.sr_ + this.key_scale_rate_) : 0);
						break;
					case e.EGPhase.release:
						this.SetEGRate(Math.min(63, this.rr_ + this.key_scale_rate_));
						break
				}
				this.ams_ = t.amtable[this.type_][this.amon_ ? this.ms_ >> 4 & 3 : 0];
				this.EGUpdate();
				this.dbgopout_ = 0
			}
		};
		e.prototype.ShiftPhase = function(i) {
			switch (i) {
				case e.EGPhase.attack:
					if (this.ar_ + this.key_scale_rate_ < 62) {
						this.SetEGRate(
							this.ar_ ? Math.min(63, this.ar_ + this.key_scale_rate_) : 0
						);
						this.eg_phase_ = e.EGPhase.attack;
						break;
					}
				case e.EGPhase.decay:
					if (this.sl_) {
						this.eg_level_ = 0;
						this.eg_level_on_next_phase_ = this.sl_ * 8;
						this.SetEGRate(
							this.dr_ ? Math.min(63, this.dr_ + this.key_scale_rate_) : 0
						);
						this.eg_phase_ = e.EGPhase.decay;
						break;
					}
				case e.EGPhase.sustain:
					this.eg_level_ = this.sl_ * 8;
					this.eg_level_on_next_phase_ = 1024;
					this.SetEGRate(
						this.sr_ ? Math.min(63, this.sr_ + this.key_scale_rate_) : 0
					);
					this.eg_phase_ = e.EGPhase.sustain;
					break;
				case e.EGPhase.release:
					if (
						this.eg_phase_ === e.EGPhase.attack ||
						this.eg_level_ < t.FM_EG_BOTTOM
					) {
						this.eg_level_on_next_phase_ = 1024;
						this.SetEGRate(Math.min(63, this.rr_ + this.key_scale_rate_));
						this.eg_phase_ = e.EGPhase.release;
						break;
					}
				case e.EGPhase.off:
				default:
					this.eg_level_ = t.FM_EG_BOTTOM;
					this.eg_level_on_next_phase_ = t.FM_EG_BOTTOM;
					this.EGUpdate();
					this.SetEGRate(0);
					this.eg_phase_ = e.EGPhase.off;
					break;
			}
		};
		e.prototype.SetFNum = function(t) {
			this.dp_ = (t & 2047) << (t >> 11 & 7);
			this.bn_ = e.notetable[t >> 7 & 127];
			this.param_changed_ = true
		};
		e.prototype.LogToLin = function(i) {
			return i < t.FM_CLENTS ? e.cltable[i] : 0
		};
		e.prototype.EGUpdate = function() {
			this.eg_out_ = Math.min(this.tl_out_ + this.eg_level_, 1023) << 3
		};
		e.prototype.SetEGRate = function(t) {
			this.eg_rate_ = t;
			this.eg_count_diff_ = e.decaytable2[t >> 2] * this.chip_.GetRatio()
		};
		e.prototype.EGCalc = function() {
			this.eg_count_ = 2047 * 3 << t.FM_RATIOBITS;
			if (this.eg_phase_ === e.EGPhase.attack) {
				var i = e.attacktable[this.eg_rate_][this.eg_curve_count_ & 7];
				if (i >= 0) {
					this.eg_level_ -= 1 + (this.eg_level_ >> i);
					if (this.eg_level_ <= 0) {
						this.ShiftPhase(e.EGPhase.decay)
					}
				}
				this.EGUpdate()
			} else {
				this.eg_level_ += e.decaytable1[this.eg_rate_][this.eg_curve_count_ & 7];
				if (this.eg_level_ >= this.eg_level_on_next_phase_) {
					this.ShiftPhase(this.eg_phase_ + 1)
				}
				this.EGUpdate()
			}
			this.eg_curve_count_++
		};
		e.prototype.EGStep = function() {
			this.eg_count_ -= this.eg_count_diff_;
			if (this.eg_count_ <= 0) {
				this.EGCalc()
			}
		};
		e.prototype.PGCalc = function() {
			var t = this.pg_count_;
			this.pg_count_ += this.pg_diff_;
			this.dbgpgout_ = t;
			return t
		};
		e.prototype.PGCalcL = function() {
			var t = this.pg_count_;
			this.pg_count_ += this.pg_diff_ + (this.pg_diff_lfo_ * this.chip_.GetPMV() >> 5);
			this.dbgpgout_ = t;
			return t
		};
		e.prototype.Calc = function(i) {
			this.EGStep();
			this.out2_ = this.out_;
			var s = this.PGCalc() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
			s += i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS - (2 + t.IS2EC_SHIFT);
			this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[s & t.FM_OPSINENTS - 1]);
			this.dbgopout_ = this.out_;
			return this.out_
		};
		e.prototype.CalcL = function(i) {
			this.EGStep();
			var s = this.PGCalcL() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
			s += i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS - (2 + t.IS2EC_SHIFT);
			this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[s & t.FM_OPSINENTS - 1] + this.ams_[this.chip_.GetAML()]);
			this.dbgopout_ = this.out_;
			return this.out_
		};
		e.prototype.CalcN = function(t) {
			this.EGStep();
			var e = Math.max(0, 1023 - (this.tl_out_ + this.eg_level_)) << 1;
			t = (t & 1) - 1;
			this.out_ = e + t ^ t;
			this.dbgopout_ = this.out_;
			return this.out_
		};
		e.prototype.CalcFB = function(i) {
			this.EGStep();
			var s = this.out_ + this.out2_;
			this.out2_ = this.out_;
			var a = this.PGCalc() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
			if (i < 31) {
				a += s << 1 + t.IS2EC_SHIFT >> i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS
			}
			this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[a & t.FM_OPSINENTS - 1]);
			this.dbgopout_ = this.out2_;
			return this.out2_
		};
		e.prototype.CalcFBL = function(i) {
			this.EGStep();
			var s = this.out_ + this.out2_;
			this.out2_ = this.out_;
			var a = this.PGCalcL() >> 20 + t.FM_PGBITS - t.FM_OPSINBITS;
			if (i < 31) {
				a += s << 1 + t.IS2EC_SHIFT >> i >> 20 + t.FM_PGBITS - t.FM_OPSINBITS
			}
			this.out_ = this.LogToLin(this.eg_out_ + e.sinetable[a & t.FM_OPSINENTS - 1] + this.ams_[this.chip_.GetAML()]);
			this.dbgopout_ = this.out_;
			return this.out_
		};
		e.prototype.ResetFB = function() {
			this.out_ = this.out2_ = 0
		};
		e.prototype.KeyOn = function() {
			if (!this.keyon_) {
				this.keyon_ = true;
				if (this.eg_phase_ === e.EGPhase.off || this.eg_phase_ === e.EGPhase.release) {
					this.ShiftPhase(e.EGPhase.attack);
					this.EGUpdate();
					this.in2_ = this.out_ = this.out2_ = 0;
					this.pg_count_ = 0
				}
			}
		};
		e.prototype.KeyOff = function() {
			if (this.keyon_) {
				this.keyon_ = false;
				this.ShiftPhase(e.EGPhase.release)
			}
		};
		e.prototype.IsOn = function() {
			return this.eg_phase_ - e.EGPhase.off
		};
		e.prototype.SetDT = function(t) {
			this.detune_ = t * 32;
			this.param_changed_ = true
		};
		e.prototype.SetDT2 = function(t) {
			this.detune2_ = t & 3;
			this.param_changed_ = true
		};
		e.prototype.SetMULTI = function(t) {
			this.multiple_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetTL = function(t) {
			this.tl_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetAR = function(t) {
			this.ar_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetDR = function(t) {
			this.dr_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetSR = function(t) {
			this.sr_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetSL = function(t) {
			this.sl_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetRR = function(t) {
			this.rr_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetKS = function(t) {
			this.ks_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetAMON = function(t) {
			this.amon_ = t;
			this.param_changed_ = true
		};
		e.prototype.Mute = function(t) {
			this.mute_ = t;
			this.param_changed_ = true
		};
		e.prototype.SetMS = function(t) {
			this.ms_ = t;
			this.param_changed_ = true
		};
		e.prototype.Out = function() {
			return this.out_
		};
		e.notetable = [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 9, 10, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 17, 18, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 21, 22, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 25, 26, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 29, 30, 31, 31, 31, 31, 31, 31, 31];
		e.dttable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 12, 12, 14, 16, 16, 16, 16, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 12, 12, 14, 16, 16, 18, 20, 22, 24, 26, 28, 32, 32, 32, 32, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 10, 12, 12, 14, 16, 16, 18, 20, 22, 24, 26, 28, 32, 34, 38, 40, 44, 44, 44, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, -2, -2, -2, -2, -4, -4, -4, -4, -4, -6, -6, -6, -8, -8, -8, -10, -10, -12, -12, -14, -16, -16, -16, -16, -2, -2, -2, -2, -4, -4, -4, -4, -4, -6, -6, -6, -8, -8, -8, -10, -10, -12, -12, -14, -16, -16, -18, -20, -22, -24, -26, -28, -32, -32, -32, -32, -4, -4, -4, -4, -4, -6, -6, -6, -8, -8, -8, -10, -10, -12, -12, -14, -16, -16, -18, -20, -22, -24, -26, -28, -32, -34, -38, -40, -44, -44, -44, -44];
		e.decaytable1 = [
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
		];
		e.decaytable2 = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2047, 2047, 2047, 2047, 2047];
		e.attacktable = [
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
		];
		e.tablehasmade = false;
		e.sinetable = new Array(1024);
		e.cltable = new Array(t.FM_CLENTS);
		e.EGPhase = {
			next: 0,
			attack: 1,
			decay: 2,
			sustain: 3,
			release: 4,
			off: 5
		};
		return e
	}();

	t.Operator = i;

	var s = function() {
		function e() {
			this.op = [new i, new i, new i, new i];
			this.tablehasmade = false;
			this.fb = 0;
			this.buf = new Array(4);
			this.inop = new Array(3);
			this.outop = new Array(3);
			this.algo_ = 0;
			this.chip_ = null;
			if (!this.tablehasmade) {
				this.MakeTable()
			}
			this.SetAlgorithm(0);
			this.pms = t.pmtable[0][0]
		}
		e.prototype.MakeTable = function() {
			for (var t = 0; t < 64; t++) {
				e.kftable[t] = 65536 * Math.pow(2, t / 768) | 0
			}
		};
		e.prototype.SetChip = function(t) {
			this.chip_ = t;
			for (var e = 0; e < 4; e++) {
				this.op[e].SetChip(t)
			}
		};
		//TODO there are two e.prototype.Reset functions!
		e.prototype.Reset = function() {
			for (var t = 0; t < 4; t++) {
				this.op[t].Reset()
			}
		};
		e.prototype.Prepare = function() {
			for (var e = 0; e < 4; e++) {
				this.op[e].Prepare()
			}
			this.pms = t.pmtable[this.op[0].type_][this.op[0].ms_ & 7];
			var i = this.op[0].IsOn() | this.op[1].IsOn() | this.op[2].IsOn() | this.op[3].IsOn() ? 1 : 0;
			var s = this.op[0].ms_ & (this.op[0].amon_ || this.op[1].amon_ || this.op[2].amon_ || this.op[3].amon_ ? 55 : 7) ? 2 : 0;
			return i | s
		};
		e.prototype.SetFNum = function(t) {
			for (var e = 0; e < 4; e++) {
				this.op[e].SetFNum(t)
			}
		};
		e.prototype.SetKCKF = function(t, i) {
			var s = [5197, 5506, 5833, 6180, 6180, 6547, 6937, 7349, 7349, 7786, 8249, 8740, 8740, 9259, 9810, 10394];
			var a = 19 - (t >> 4 & 7);
			var h = s[t & 15];
			h = (h + 2) / 4 * 4;
			var o = h * e.kftable[i & 63];
			o >>= 16 + 3;
			o <<= 16 + 3;
			o >>= a;
			var n = t >> 2 & 31;
			this.op[0].SetDPBN(o, n);
			this.op[1].SetDPBN(o, n);
			this.op[2].SetDPBN(o, n);
			this.op[3].SetDPBN(o, n)
		};
		e.prototype.KeyControl = function(t) {
			if (t & 1) {
				this.op[0].KeyOn();
			} else {
				this.op[0].KeyOff();
			}
			if (t & 2) {
				this.op[1].KeyOn();
			} else {
				this.op[1].KeyOff();
			}
			if (t & 4) {
				this.op[2].KeyOn();
			} else {
				this.op[2].KeyOff();
			}
			if (t & 8) {
				this.op[3].KeyOn();
			} else {
				this.op[3].KeyOff();
			}
		};
		e.prototype.SetAlgorithm = function(t) {
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
			this.inop[0] = e[t][0];
			this.outop[0] = e[t][1];
			this.inop[1] = e[t][2];
			this.outop[1] = e[t][3];
			this.inop[2] = e[t][4];
			this.outop[2] = e[t][5];
			this.op[0].ResetFB();
			this.algo_ = t
		};
		e.prototype.Calc = function() {
			var t;
			switch (this.algo_) {
				case 0:
				this.op[2].Calc(this.op[1].Out());
				this.op[1].Calc(this.op[0].Out());
				t = this.op[3].Calc(this.op[2].Out());
				this.op[0].CalcFB(this.fb);
				break;
				case 1:
				this.op[2].Calc(this.op[0].Out() + this.op[1].Out());
				this.op[1].Calc(0);
				t = this.op[3].Calc(this.op[2].Out());
				this.op[0].CalcFB(this.fb);
				break;
				case 2:
				this.op[2].Calc(this.op[1].Out());
				this.op[1].Calc(0);
				t = this.op[3].Calc(this.op[0].Out() + this.op[2].Out());
				this.op[0].CalcFB(this.fb);
				break;
				case 3:
				this.op[2].Calc(0);
				this.op[1].Calc(this.op[0].Out());
				t = this.op[3].Calc(this.op[1].Out() + this.op[2].Out());
				this.op[0].CalcFB(this.fb);
				break;
				case 4:
				this.op[2].Calc(0);
				t = this.op[1].Calc(this.op[0].Out());
				t += this.op[3].Calc(this.op[2].Out());
				this.op[0].CalcFB(this.fb);
				break;
				case 5:
				t = this.op[2].Calc(this.op[0].Out());
				t += this.op[1].Calc(this.op[0].Out());
				t += this.op[3].Calc(this.op[0].Out());
				this.op[0].CalcFB(this.fb);
				break;
				case 6:
				t = this.op[2].Calc(0);
				t += this.op[1].Calc(this.op[0].Out());
				t += this.op[3].Calc(0);
				this.op[0].CalcFB(this.fb);
				break;
				case 7:
				t = this.op[2].Calc(0);
				t += this.op[1].Calc(0);
				t += this.op[3].Calc(0);
				t += this.op[0].CalcFB(this.fb);
				break
			}
			return t
		};
		e.prototype.CalcL = function() {
			this.chip_.SetPMV(this.pms[this.chip_.GetPML()]);
			var t;
			switch (this.algo_) {
				case 0:
				this.op[2].CalcL(this.op[1].Out());
				this.op[1].CalcL(this.op[0].Out());
				t = this.op[3].CalcL(this.op[2].Out());
				this.op[0].CalcFBL(this.fb);
				break;
				case 1:
				this.op[2].CalcL(this.op[0].Out() + this.op[1].Out());
				this.op[1].CalcL(0);
				t = this.op[3].CalcL(this.op[2].Out());
				this.op[0].CalcFBL(this.fb);
				break;
				case 2:
				this.op[2].CalcL(this.op[1].Out());
				this.op[1].CalcL(0);
				t = this.op[3].CalcL(this.op[0].Out() + this.op[2].Out());
				this.op[0].CalcFBL(this.fb);
				break;
				case 3:
				this.op[2].CalcL(0);
				this.op[1].CalcL(this.op[0].Out());
				t = this.op[3].CalcL(this.op[1].Out() + this.op[2].Out());
				this.op[0].CalcFBL(this.fb);
				break;
				case 4:
				this.op[2].CalcL(0);
				t = this.op[1].CalcL(this.op[0].Out());
				t += this.op[3].CalcL(this.op[2].Out());
				this.op[0].CalcFBL(this.fb);
				break;
				case 5:
				t = this.op[2].CalcL(this.op[0].Out());
				t += this.op[1].CalcL(this.op[0].Out());
				t += this.op[3].CalcL(this.op[0].Out());
				this.op[0].CalcFBL(this.fb);
				break;
				case 6:
				t = this.op[2].CalcL(0);
				t += this.op[1].CalcL(this.op[0].Out());
				t += this.op[3].CalcL(0);
				this.op[0].CalcFBL(this.fb);
				break;
				case 7:
				t = this.op[2].CalcL(0);
				t += this.op[1].CalcL(0);
				t += this.op[3].CalcL(0);
				t += this.op[0].CalcFBL(this.fb);
				break
			}
			return t
		};
		e.prototype.CalcN = function(t) {
			this.buf[1] = this.buf[2] = this.buf[3] = 0;
			this.buf[0] = this.op[0].out_;
			this.op[0].CalcFB(this.fb);
			this.buf[this.outop[0]] += this.op[1].Calc(this.buf[this.inop[0]]);
			this.buf[this.outop[1]] += this.op[2].Calc(this.buf[this.inop[1]]);
			var e = this.op[3].out_;
			this.op[3].CalcN(t);
			return this.buf[this.outop[2]] + e
		};
		e.prototype.CalcLN = function(t) {
			this.chip_.SetPMV(this.pms[this.chip_.GetPML()]);
			this.buf[1] = this.buf[2] = this.buf[3] = 0;
			this.buf[0] = this.op[0].out_;
			this.op[0].CalcFBL(this.fb);
			this.buf[this.outop[0]] += this.op[1].CalcL(this.buf[this.inop[0]]);
			this.buf[this.outop[1]] += this.op[2].CalcL(this.buf[this.inop[1]]);
			var e = this.op[3].out_;
			this.op[3].CalcN(t);
			return this.buf[this.outop[2]] + e
		};
		e.prototype.SetType = function(t) {
			for (var e = 0; e < 4; e++) {
				this.op[e].type_ = t
			}
		};
		e.prototype.SetFB = function(t) {
			this.fb = e.fbtable[t]
		};
		e.prototype.SetMS = function(t) {
			for (var e = 0; e < 4; e++) {
				this.op[e].SetMS(t)
			}
		};
		e.prototype.Mute = function(t) {
			for (var e = 0; e < 4; e++) {
				this.op[e].Mute(t)
			}
		};
		e.fbtable = [31, 7, 6, 5, 4, 3, 2, 1];
		e.kftable = new Array(64);
		e.muted = 0;	// +neo
		return e
	}();
	t.Channel4 = s;
	var a = function() {
		function e() {
			this.ratio_ = 0;
			this.aml_ = 0;
			this.pml_ = 0;
			this.pmv_ = 0
		}
		e.prototype.SetRatio = function(t) {
			t = Math.round(t);
			if (this.ratio_ !== t) {
				this.ratio_ = t;
				this.MakeTable()
			}
		};
		e.prototype.SetAML = function(e) {
			this.aml_ = e & t.FM_LFOENTS - 1
		};
		e.prototype.SetPML = function(e) {
			this.pml_ = e & t.FM_LFOENTS - 1
		};
		e.prototype.SetPMV = function(t) {
			this.pmv_ = t
		};
		e.prototype.GetMulValue = function(t, e) {
			return this.multable_[t][e]
		};
		e.prototype.GetAML = function() {
			return this.aml_
		};
		e.prototype.GetPML = function() {
			return this.pml_
		};
		e.prototype.GetPMV = function() {
			return this.pmv_
		};
		e.prototype.GetRatio = function() {
			return this.ratio_
		};
		e.prototype.MakeTable = function() {
			var e, i;
			var s = [1, 1.414, 1.581, 1.732];
			this.multable_ = new Array(4);
			for (e = 0; e < 4; e++) {
				var a = s[e] * this.ratio_ / (1 << 2 + t.FM_RATIOBITS - t.FM_PGBITS);
				this.multable_[e] = new Array(16);
				for (i = 0; i < 16; i++) {
					var h = i ? i * 2 : 1;
					this.multable_[e][i] = h * a | 0
				}
			}
		};
		return e
	}();
	t.Chip = a;

	function h() {
		if (t.tablemade) {
			return
		}
		t.tablemade = true;
		var e;
		var i = [
		[0, 1 / 360, 2 / 360, 3 / 360, 4 / 360, 6 / 360, 12 / 360, 24 / 360],
		[0, 1 / 480, 2 / 480, 4 / 480, 10 / 480, 20 / 480, 80 / 480, 140 / 480]
		];
		var s = [
		[31, 6, 4, 3],
		[31, 2, 1, 0]
		];
		t.pmtable = new Array(2);
		t.amtable = new Array(2);
		for (var a = 0; a < 2; a++) {
			t.pmtable[a] = new Array(8);
			for (e = 0; e < 8; e++) {
				var h = i[a][e];
				t.pmtable[a][e] = new Array(t.FM_LFOENTS);
				for (var o = 0; o < t.FM_LFOENTS; o++) {
					var n = Math.pow(2, h * (2 * o - t.FM_LFOENTS + 1) / (t.FM_LFOENTS - 1));
					var r = .6 * h * Math.sin(2 * o * Math.PI / t.FM_LFOENTS) + 1;
					t.pmtable[a][e][o] = 65536 * (r - 1) | 0
				}
			}
			t.amtable[a] = new Array(4);
			for (e = 0; e < 4; e++) {
				t.amtable[a][e] = new Array(t.FM_LFOENTS);
				for (var o = 0; o < t.FM_LFOENTS; o++) {
					t.amtable[a][e][o] = (o * 4 >> s[a][e]) * 2 << 2
				}
			}
		}
	}
	t.MakeLFOTable = h
})(FM || (FM = {}));

//var FM;
(function(t) {
	"use strict";
	var e = function() {
		function t() {
			this.OPM_LFOENTS = 512;
			this.regtc = 0;
			this.regta = new Array(2);
			this.timera = 0;
			this.timera_count = 0;
			this.timerb = 0;
			this.timerb_count = 0;
			this.timer_step = 0
		}
		t.prototype.Reset = function() {
			this.timera_count = 0;
			this.timerb_count = 0
		};
		t.prototype.SetTimerControl = function(t) {
			var e = this.regtc ^ t;
			this.regtc = t;
			if (t & 16) {
				this.ResetStatus(1)
			}
			if (t & 32) {
				this.ResetStatus(2)
			}
			if (e & 1) {
				this.timera_count = t & 1 ? this.timera : 0
			}
			if (e & 2) {
				this.timerb_count = t & 2 ? this.timerb : 0
			}
		};
		t.prototype.SetTimerA = function(t, e) {
			var i;
			this.regta[t & 1] = e;
			i = (this.regta[0] << 2) + (this.regta[1] & 3);
			this.timera = (1024 - i) * this.timer_step
		};
		t.prototype.SetTimerB = function(t) {
			this.timerb = (256 - t) * this.timer_step
		};
		t.prototype.Count = function(t) {
			var e = false;
			if (this.timera_count) {
				this.timera_count -= t << 16;
				if (this.timera_count <= 0) {
					e = true;
					this.TimerA();
					while (this.timera_count <= 0) {
						this.timera_count += this.timera
					}
					if (this.regtc & 4) {
						this.SetStatus(1)
					}
				}
			}
			if (this.timerb_count) {
				this.timerb_count -= t << 12;
				if (this.timerb_count <= 0) {
					e = true;
					while (this.timerb_count <= 0) {
						this.timerb_count += this.timerb
					}
					if (this.regtc & 8) {
						this.SetStatus(2)
					}
				}
			}
			return e
		};
		t.prototype.GetNextEvent = function() {
			var t = (this.timera_count + 65535 >> 16) - 1;
			var e = (this.timerb_count + 4095 >> 12) - 1;
			return (t < e ? t : e) + 1
		};
		t.prototype.SetTimerBase = function(t) {
			this.timer_step = 1e6 * 65536 / t | 0;
			console.log('YM2151: SetTimerBase', { param: t, stepsize: this.timer_step });
		};
		t.prototype.SetStatus = function(t) {
			console.log('t.prototype.SetStatus not impl', t);
		};
		t.prototype.ResetStatus = function(t) {
			console.log('t.prototype.ResetStatus not impl', t);
		};
		t.prototype.TimerA = function() {
			console.log('t.prototype.TimerA not impl', t);
		};
		return t
	}();
	t.Timer = e
})(FM || (FM = {}));
//var FM;
(function(t) {
	"use strict";
	var e = function(e) {
		__extends(i, e);

		function i() {
			e.call(this);
			this.fmvolume = 0;
			this.clock = 0;
			this.rate = 0;
			this.pcmrate = 0;
			this.pmd = 0;
			this.amd = 0;
			this.lfocount = 0;
			this.lfodcount = 0;
			this.lfo_count_ = 0;
			this.lfo_count_diff_ = 0;
			this.lfo_step_ = 0;
			this.lfo_count_prev_ = 0;
			this.lfowaveform = 0;
			this.rateratio = 0;
			this.noise = 0;
			this.noisecount = 0;
			this.noisedelta = 0;
			this.interpolation = false;
			this.lfofreq = 0;
			this.status = 0;
			this.reg01 = 0;
			this.kc = new Array(8);
			this.kf = new Array(8);
			this.pan = new Array(8);
			this.ch = [new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4, new t.Channel4];
			this.chip = new t.Chip;
			this.lfo_count_ = 0;
			this.lfo_count_prev_ = ~0;
			this.BuildLFOTable();
			for (var i = 0; i < 8; i++) {
				this.ch[i].SetChip(this.chip);
				this.ch[i].SetType(1)
			}
		}
		i.prototype.Init = function(clockrate, sampleRate) {
			if (!this.SetRate(clockrate, sampleRate)) {
				console.log('init:setRate failed!');
				return false
			}
			this.Reset();
			this.SetVolume(0);
			this.SetChannelMask(0);
			return true
		};
		i.prototype.SetRate = function(clockrate, sampleRate) {
			this.clock = clockrate;
			this.pcmrate = sampleRate;
			this.rate = sampleRate;
			this.RebuildTimeTable();
			return true
		};
		i.prototype.SetChannelMask = function(t) {
			for (var e = 0; e < 8; e++) {
				this.ch[e].Mute( !! (t & 1 << e))
			}
		};
		i.prototype.Reset = function() {
			console.log('YM2151: Reset', { clock: this.clock});
			var t;
			for (t = 0; t < 256; t++) {
				this.SetReg(t, 0)
			}
			this.SetReg(25, 128);
			e.prototype.Reset.call(this);
			this.status = 0;
			this.noise = 12345;
			this.noisecount = 0;
			for (t = 0; t < 8; t++) {
				this.ch[t].Reset()
			}
		};
		i.prototype.RebuildTimeTable = function() {
			var e = this.clock / 64;
			this.rateratio = ((e << t.FM_RATIOBITS) + this.rate / 2) / this.rate;
			this.SetTimerBase(e);
			console.log('YM2151: RebuildTimeTable', { clock: this.clock});
			this.chip.SetRatio(this.rateratio)
		};
		i.prototype.SetVolume = function(t) {
			t = Math.min(t, 20);
			if (t > -192) {
				this.fmvolume = 16384 * Math.pow(10, t / 40) | 0
			} else {
				this.fmvolume = 0
			}
		};
		i.prototype.SetStatus = function(t) {
			if (!(this.status & t)) {
				this.status |= t;
				this.Intr(true)
			}
		};
		i.prototype.ResetStatus = function(t) {
			if (this.status & t) {
				this.status &= ~t;
				if (!this.status) {
					this.Intr(false)
				}
			}
		};
		//YM2151WriteReg
		//e chip nr ???
		//i value
		i.prototype.SetReg = function(e, i) {
			//console.log('SetReg',e,i)
			if (e >= 256) {
				return;
			}
			var s = e & 7;
			switch (e & 255) {
				case 0x01:
					/* LFO reset(bit 1), Test Register (other bits) */
					if (i & 2) {
						this.lfo_count_ = 0;
						this.lfo_count_prev_ = ~0;
					}
					this.reg01 = i;
					break;
				case 0x08:
					/* PSG is used in KEY_ON macro */
					if (!(this.regtc & 128)) {
						this.ch[i & 7].KeyControl(i >> 3);
					} else {
						s = i & 7;
						if (!(i & 8)) {
							this.ch[s].op[0].KeyOff();
						}
						if (!(i & 16)) {
							this.ch[s].op[1].KeyOff();
						}
						if (!(i & 32)) {
							this.ch[s].op[2].KeyOff();
						}
						if (!(i & 64)) {
							this.ch[s].op[3].KeyOff();
						}
					}
					break;
        case 0x0f:
					/* noise mode enable, noise period */
					this.noisedelta = i;
					this.noisecount = 0;

					//TODO
					//chip->noise = v;
					//chip->noise_f = chip->noise_tab[ v & 0x1f ];
					break;
				case 0x10:
				case 0x11:
					this.SetTimerA(e, i);
					break;
				case 0x12:
					this.SetTimerB(i);
					break;
				case 0x14:
          /* CSM, irq flag reset, irq enable, timer start/stop */
					this.SetTimerControl(i);
					break;
				case 0x18:
          /* LFO frequency */
					this.lfofreq = i;
					this.lfo_count_diff_ =
						this.rateratio *
						((16 + (this.lfofreq & 15)) << (16 - 4 - t.FM_RATIOBITS)) /
						(1 << (15 - (this.lfofreq >> 4)));
					break;
				case 0x19:
          /* PMD (bit 7==1) or AMD (bit 7==0) */
					if ((i & 128) !== 0) {
						this.pmd = i & 127;
					} else {
						this.amd = i & 127;
					}
					break;
				case 0x1B:
          /* CT2, CT1, LFO waveform */
					this.lfowaveform = i & 3;
					break;
				case 0x20:
				case 0x21:
				case 0x22:
				case 0x23:
				case 0x24:
				case 0x25:
				case 0x26:
				case 0x27:
					this.ch[s].SetFB((i >> 3) & 7);
					this.ch[s].SetAlgorithm(i & 7);
					this.pan[s] = (i >> 6) & 3;
					break;
				case 0x28:
				case 0x29:
				case 0x2A:
				case 0x2B:
				case 0x2C:
				case 0x2D:
				case 0x2E:
				case 0x2F:
					this.kc[s] = i;
					this.ch[s].SetKCKF(this.kc[s], this.kf[s]);
					break;
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
					this.kf[s] = i >> 2;
					this.ch[s].SetKCKF(this.kc[s], this.kf[s]);
					break;
				case 56:
				case 57:
				case 58:
				case 59:
				case 60:
				case 61:
				case 62:
				case 63:
					this.ch[s].SetMS((i << 4) | (i >> 4));
					break;
				default:
					if (e >= 64) {
						this.SetParameter(e, i);
					}
					break;
			}
		};
		//t: channel
		i.prototype.SetParameter = function(t, e) {
			var i = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 124];
			var s = [0, 2, 1, 3];
			var a = s[(t >> 3) & 3];
			var h = this.ch[t & 7].op[a];
			switch ((t >> 5) & 7) {
				case 2:
					h.SetDT((e >> 4) & 7);
					h.SetMULTI(e & 15);
					break;
				case 3:
					h.SetTL(e & 127);
					break;
				case 4:
					h.SetKS((e >> 6) & 3);
					h.SetAR((e & 31) * 2);
					break;
				case 5:
					h.SetDR((e & 31) * 2);
					h.SetAMON((e & 128) !== 0);
					break;
				case 6:
					h.SetSR((e & 31) * 2);
					h.SetDT2((e >> 6) & 3);
					break;
				case 7:
					h.SetSL(i[(e >> 4) & 15]);
					h.SetRR((e & 15) * 4 + 2);
					break;
			}
		};
		i.prototype.BuildLFOTable = function() {
			this.amtable = new Array(4);
			this.pmtable = new Array(4);
			for (var t = 0; t < 4; t++) {
				var e = 0;
				this.amtable[t] = new Array(this.OPM_LFOENTS);
				this.pmtable[t] = new Array(this.OPM_LFOENTS);
				for (var i = 0; i < this.OPM_LFOENTS; i++) {
					var s, a;
					switch (t) {
						case 0:
							a = ((i + 256) & 511) / 2 - 128;
							s = 255 - i / 2;
							break;
						case 1:
							s = i < 256 ? 255 : 0;
							a = i < 256 ? 127 : -128;
							break;
						case 2:
							a = (i + 128) & 511;
							a = a < 256 ? a - 128 : 383 - a;
							s = i < 256 ? 255 - i : i - 256;
							break;
						case 3:
							if (!(i & 3)) {
								e = (((Math.random() * 32768) | 0) / 17) & 255;
							}
							s = e;
							a = e - 128;
							break;
					}
					this.amtable[t][i] = s | 0;
					this.pmtable[t][i] = (-a - 1) | 0;
				}
			}
		};
		i.prototype.LFO = function() {
			var t;
			if (this.lfowaveform !== 3) {
				t = (this.lfo_count_ >> 15) & 510;
				this.chip.SetPML(
					this.pmtable[this.lfowaveform][t] * this.pmd / 128 + 128
				);
				this.chip.SetAML(this.amtable[this.lfowaveform][t] * this.amd / 128);
			} else {
				if ((this.lfo_count_ ^ this.lfo_count_prev_) & ~((1 << 17) - 1)) {
					t = (((Math.random() * 32768) | 0) / 17) & 255;
					this.chip.SetPML((t - 128) * this.pmd / 128 + 128);
					this.chip.SetAML(t * this.amd / 128);
				}
			}
			this.lfo_count_prev_ = this.lfo_count_;
			this.lfo_step_++;
			if ((this.lfo_step_ & 7) === 0) {
				this.lfo_count_ += this.lfo_count_diff_;
			}
		};
		i.prototype.Noise = function() {
			this.noisecount += 2 * this.rateratio;
			if (this.noisecount >= 32 << t.FM_RATIOBITS) {
				var e = 32 - (this.noisedelta & 31);
				if (e === 1) {
					e = 2;
				}
				this.noisecount = this.noisecount - (e << t.FM_RATIOBITS);
				if ((this.noisedelta & 31) === 31) {
					this.noisecount -= t.FM_RATIOBITS;
				}
				this.noise = (this.noise >> 1) ^ (this.noise & 1 ? 33800 : 0);
			}
			return this.noise;
		};
		//// TODO: change Mix* to use this.ch[ch].muted
		i.prototype.MixSub = function(t, e) {
			if (/*t & 16384*/ !this.ch[0].muted) e[this.pan[0]] = this.ch[0].Calc();
			if (/*t & 4096*/ !this.ch[1].muted) e[this.pan[1]] += this.ch[1].Calc();
			if (/*t & 1024*/ !this.ch[2].muted) e[this.pan[2]] += this.ch[2].Calc();
			if (/*t & 256*/ !this.ch[3].muted) e[this.pan[3]] += this.ch[3].Calc();
			if (/*t & 64*/ !this.ch[4].muted) e[this.pan[4]] += this.ch[4].Calc();
			if (/*t & 16*/ !this.ch[5].muted) e[this.pan[5]] += this.ch[5].Calc();
			if (/*t & 4*/ !this.ch[6].muted) e[this.pan[6]] += this.ch[6].Calc();
			if (/*t & 1*/ !this.ch[7].muted) {
				if (this.noisedelta & 128) {
					e[this.pan[7]] += this.ch[7].CalcN(this.Noise());
				} else {
					e[this.pan[7]] += this.ch[7].Calc();
				}
			}
		};
		i.prototype.MixSubL = function(t, e) {
			if (/*t & 16384*/ !this.ch[0].muted)
				e[this.pan[0]] = this.ch[0].CalcL();
			if (/*t & 4096*/ !this.ch[1].muted)
				e[this.pan[1]] += this.ch[1].CalcL();
			if (/*t & 1024*/ !this.ch[2].muted)
				e[this.pan[2]] += this.ch[2].CalcL();
			if (/*t & 256*/ !this.ch[3].muted) e[this.pan[3]] += this.ch[3].CalcL();
			if (/*t & 64*/ !this.ch[4].muted) e[this.pan[4]] += this.ch[4].CalcL();
			if (/*t & 16*/ !this.ch[5].muted) e[this.pan[5]] += this.ch[5].CalcL();
			if (/*t & 4*/ !this.ch[6].muted) e[this.pan[6]] += this.ch[6].CalcL();
			if (/*t & 1*/ !this.ch[7].muted) {
				if (this.noisedelta & 128) {
					e[this.pan[7]] += this.ch[7].CalcLN(this.Noise());
				} else {
					e[this.pan[7]] += this.ch[7].CalcL();
				}
			}
		};
		i.prototype.Mix = function(t, e, i) {
			var s = 0;
			var _sc = 1.0 / this.attenuation;
			var _v = this.volume / 100.0;
			for (var a = 0; a < 8; a++) {
				s = (s << 2) | this.ch[a].Prepare();
			}
			if (this.reg01 & 2) {
				s &= 21845;
			}
			var h = new Array(4);
			for (a = 0; a < i; a++) {
				h[1] = h[2] = h[3] = 0;
				this.LFO();
				if (s & 43690) {
					this.MixSubL(s, h);
				} else {
					this.MixSub(s, h);
				}
				t[a] = (h[1] + h[3]) * _sc * _v;
				e[a] = (h[2] + h[3]) * _sc * _v;
			}
		};
		i.prototype.label = "YM2151";
		i.prototype.version = 0x102;
		i.prototype.attenuation = 49152;//(1<<16);
		i.prototype.volume = 100;
		i.prototype.mixStereo = function(t, i, e) {
			var s = 0;
			var _sc = 1.0/this.attenuation;
			var _v = this.volume/100.0;
			for (var a = 0; a < 8; a++) {
				s = s << 2 | this.ch[a].Prepare()
			}
			if (this.reg01 & 2) {
				s &= 21845
			}
			var h = new Array(4);
			var n = e|0;
			for (a = 0; a < i; a++) {
				h[1] = h[2] = h[3] = 0;
				this.LFO();
				if (s & 43690) {
					this.MixSubL(s, h)
				} else {
					this.MixSub(s, h)
				}
				t[n++] += (h[1] + h[3])*_sc*_v;
				t[n++] += (h[2] + h[3])*_sc*_v;
				//t[a] = h[1] + h[3];
				//e[a] = h[2] + h[3]
			}
		};
		i.prototype.Intr = function(t) {
			console.log('i.prototype.Intr not implemented');
		};
		i.prototype.toggle = function(ch,m) {
			this.ch[ch].muted = !m;
		};	// +neo
		return i
	}(t.Timer);
	t.OPM = e
})(FM || (FM = {}));


module.exports = {
	get label(){
    return "YM2151"
  },
	get channels(){
    return ["Ch 1","Ch 2","Ch 3","Ch 4","Ch 5","Ch 6","Ch 7","Ch 8"];
  },
	create: function(clockRateHz, sampleRateHz) {
		const ret = new FM.OPM();
		ret.Init(clockRateHz, sampleRateHz);
		ret.SetReg(20, 42);
		for (var q=0; q<8; ++q) {
      ret.SetReg(56+q, 0);
    }
		ret.SetReg(15,0);
		return ret;
	}
};
})();
