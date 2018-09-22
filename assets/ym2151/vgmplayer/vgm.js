(function() {
    function normalizeQ(a, b) {
        var r = [];
        var i = -1;
        while (++i < a.length) r[i] = (a[i] / b);
        return r;
    }

    function ByteStream(buffer) {
        var a = new Uint8Array(buffer);
        var offset = 0;
        this.readString = function(l) {
            var s = '';
            for (var i = 0; i < l; i++) {
                var c = this.readByte();
                s += String.fromCharCode(c);
            }
            return s;
        };
        this.readUnicodeCString = function() {
            var s = '';
            var c = this.readShort();
            while (c != 0) {
                s += String.fromCharCode(c);
                c = this.readShort();
            }
            return s;
        };
        this.readByte = function() {
            var v = a[offset + 0];
            offset += 1;
            return v;
        };
        this.skipByte = function(count) {
            if (count) {
                offset += count;
            } else {
                offset += 1;
            }
        };
        this.readShort = function() {
            var v = a[offset + 0] + (a[offset + 1] << 8);
            offset += 2;
            return v;
        };
        this.skipShort = function(count) {
            if (count) {
                offset += count * 2;
            } else {
                offset += 2;
            }
        };
        this.read24bit = function() {
            var v = a[offset + 0] + (a[offset + 1] << 8) + (a[offset + 2] << 16);
            offset += 3;
            return v;
        };
        this.skip24bit = function(count) {
            if (count) {
                offset += count * 3;
            } else {
                offset += 3;
            }
        };
        this.readLong = function() {
            var v = a[offset + 0] + (a[offset + 1] << 8) + (a[offset + 2] << 16) + (a[offset + 3] << 24);
            offset += 4;
            return v;
        };
        this.skipLong = function(count) {
            if (count) {
                offset += count * 4;
            } else {
                offset += 4;
            }
        };
        this.getOffset = function() {
            return offset;
        };
        this.seek = function(newOffset) {
            offset = newOffset;
        };
    }

    function PSG() {
        var clocksPerSample = false;
        var latched_channel, latched_volume;
        var channelVolume = Array(4);
        var channelFrequency = Array(4);
        var channelCounter = Array(4);
        var channelValue = Array(4);
        var whiteNoise;
        var noise_shift_register;
        var noise_feedback = 0x0009;
        var noise_shift_width = 16;
        var volumes_raw = [1516, 1205, 957, 760, 603, 479, 381, 303, 240, 191, 152, 120, 96, 76, 60, 0];
        var volumes = new Array(16);
        for (var i = 0; i < 16; i++) {
            volumes[i] = volumes_raw[i] / (16 * 1024);
        }
        this.reset = function(clock_rate, sample_rate) {
            clocksPerSample = (clock_rate / 16) / sample_rate;
            console.log('PSG::config(' + clock_rate + ',' + sample_rate + ',' + clocksPerSample + ')');
            for (var i = 0; i < 4; i++) {
                channelVolume[i] = 15;
                channelFrequency[i] = 1;
                channelCounter[i] = 0;
                channelValue[i] = 1;
            }
            latched_channel = 0;
            latched_volume = false;
            whiteNoise = false;
            noise_shift_register = 0x8000;
        };
        this.configure = function(new_noise_feedback, new_noise_shift_width) {
            noise_feedback = new_noise_feedback;
            noise_shift_width = new_noise_shift_width;
        };
        this.write = function(data) {
            if (data & 0x80) {
                latched_channel = (data & 0x60) >> 5;
                latched_volume = ((data & 0x10) == 0x10);
                if (latched_volume) {
                    channelVolume[latched_channel] = (data & 0x0F);
                } else if (latched_channel == 3) {
                    whiteNoise = ((data & 0x04) == 0x04);
                    channelFrequency[latched_channel] = 0x10 << (data & 0x03);
                    noise_shift_register = 0x8000;
                } else {
                    channelFrequency[latched_channel] = (channelFrequency[latched_channel] & 0x03F0) | (data & 0x000F);
                }
            } else {
                if (latched_volume) {
                    channelVolume[latched_channel] = (data & 0x0F);
                } else if (latched_channel == 3) {} else {
                    channelFrequency[latched_channel] = (channelFrequency[latched_channel] & 0x000F) | ((data & 0x003F) << 4);
                }
            }
        };
        this.emulateSamples = function(buffer, offset, count, channelCount) {
            if (!clocksPerSample) {
                throw new Error("PSG - not yet initialized!");
            }
            var ret = [],
                sample, nsr = [],
                fv = [],
                q = [];
            while (--count > -1) {
                sample = 0;
                q[0] = channelCounter[0].toFixed(2);
                q[1] = channelFrequency[0];
                q[2] = clocksPerSample / channelFrequency[0];
                for (var i = 0; i < 3; i++) {
                    sample += volumes[channelVolume[i]] * channelValue[i];
                    channelCounter[i] -= clocksPerSample;
                    if (channelCounter[i] < 0) {
                        channelCounter[i] += channelFrequency[i];
                        if (channelFrequency[i] > 6) {
                            channelValue[i] *= -1;
                        }
                    }
                }
                fv.push('[' + q.toString(',') + ']');
                var chn = volumes[channelVolume[3]] * ((noise_shift_register & 0x01) * 2 - 1);
                nsr.push(chn);
                sample += chn;
                channelCounter[3] -= clocksPerSample;
                if (channelCounter[3] < 0) {
                    channelValue[3] = -channelValue[3];
                    if (channelFrequency[3] == 0x80) {
                        channelCounter[3] += channelFrequency[2];
                    } else {
                        channelCounter[3] += channelFrequency[3];
                    }
                    if (channelValue[i] == 1) {
                        var feedback;
                        if (whiteNoise) {
                            feedback = noise_shift_register & noise_feedback;
                            feedback ^= feedback >> 8;
                            feedback ^= feedback >> 4;
                            feedback ^= feedback >> 2;
                            feedback ^= feedback >> 1;
                            feedback &= 1;
                        } else {
                            feedback = noise_shift_register & 0x01;
                        }
                        noise_shift_register = (noise_shift_register >> 1) | (feedback << (noise_shift_width - 1));
                    }
                }
                n = channelCount;
                while (--n > -1) {
                    buffer[offset] = sample;
                    ret[offset] = sample;
                    ++offset;
                }
            }
            return ret;
        };
    }

    function VgmFile(useDropIn) {
        var self = this;
        var isPlaying = false;
        var settings = {
            "strict": false
        };
        var header;
        var chips = {
            "psg": [],
            "ym2413": [],
            "ym2612": [],
            "ym2151": [],
            "c6280": [],
            "qsound": []
        };
        var canSN, can2413, can2612, can2151, can6280, canQS;
        var blocks = [];
        var Data = {
            "ENUM": {
                "YM2612": 0x00,
                "RF5C68": 0x01,
                "RF5C164": 0x02,
                "PWM": 0x03,
                "OKIM6258": 0x04,
                "HuC6280": 0x05,
                "SCSP": 0x06,
                "NES": 0x07,
                "SPCM": 0x80,
                "OKIM6295": 0x8b,
                "K054539": 0x8c,
                "C140": 0x8d,
                "K053260": 0x8e,
                "QSOUND": 0x8f
            },
            "Types": ["YM2612", "RF5C68", "RF5C164", "PWM", "OKIM6258", "HuC6280", "SCSP", "NES", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "cYM2612", "cRF5C68", "cRF5C164", "cPWM", "cOKIM6258", "cHuC6280", "cSCSP", "cNES", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SPCM", "YM2608dT", "YM2610", "YM2610dT", "YMF278B", "YMF271", "YMZ280B", "YMF278Br", "Y8950dT", "MPCM", "uPD7759", "OKIM6295", "K054539", "C140", "K053260", "QSound", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "RF5C68w", "RF5C164w", "NESw", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SCSPw", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        };
        self.outputSampleRate = 44100;
        self.playbackFactor = (48000 / 44100);
        this.onTagLoaded = function() {};
        var pos = 0,
            loop = 0;
        var mjazz = 0;

        function parse_tag() {
            var tagMagic = header.readString(4);
            if (tagMagic != 'Gd3 ') {
                throw new Error("VGM.js - Invalid GD3 header");
            }
            var tagVersion = header.readLong();
            if (tagVersion != 0x0100) {
                throw new Error("VGM.js - Unsupported GD3 version (x" + tagVersion.toString(16) + ")");
            }
            var tag = {
                en: {},
                ja: {}
            };
            tag.en.track = header.readUnicodeCString();
            tag.ja.track = header.readUnicodeCString();
            tag.en.game = header.readUnicodeCString();
            tag.ja.game = header.readUnicodeCString();
            tag.en.system = header.readUnicodeCString();
            tag.ja.system = header.readUnicodeCString();
            tag.en.author = header.readUnicodeCString();
            tag.ja.author = header.readUnicodeCString();
            tag.release = header.readUnicodeCString();
            tag.ripper = header.readUnicodeCString();
            tag.notes = header.readUnicodeCString();
            self.onTagLoaded(tag);
        }
        this.stop = function() {
            if (isPlaying) isPlaying = false;
        }
        this.load = function(buffer, wasDecompressed) {
            if (settings.strict) {
                try {
                    return this._load(buffer, wasDecompressed);
                } catch (e) {
                    alert("VGM::load - " + e);
                }
            } else return this._load(buffer, wasDecompressed);
        };
        this._load = function(buffer, wasDecompressed) {
            console.log("VGM::load", typeof buffer, buffer.byteLength, wasDecompressed);
            header = new ByteStream(buffer);
            blocks.length = 0;
            loop = 0;
            var magic = header.readString(4);
            if (magic != "Vgm ") {
                alert("Not a VGM file");
                throw new Error("VGM.js - Invalid VGM header (" + magic + ") or empty buffer (" + buffer.byteLength + ")");
                return false;
            }
            var eofOffset = header.readLong();
            var version = header.readLong();
            if (version > 0x0150) {
                console.log("VGM.js - Support not guaranteed for VGM version (x" + version.toString(16) + ")");
            }
            settings = {
                frame_rate: 60,
                version: version || 0x150,
                wait: {
                    NTSC: 735,
                    PAL: 882
                },
                loop: {
                    offset: null
                },
                psg: {
                    clock: 0,
                    feedback: 0x0009,
                    shift_width: 16,
                    flags: 0,
                    type: window.SN76489 ? 1 : 0
                },
                ym2413: {
                    clock: 0,
                    type: window.YM2413 && useDropIn ? 1 : 0
                },
                ym2612: {
                    clock: 0,
                    type: window.YM2612 && useDropIn ? 1 : 0,
                    data: {
                        index: -1,
                        pointer: -1,
                        current: 128
                    }
                },
                ym2151: {
                    clock: 0,
                    type: window.FM && useDropIn ? 1 : 0
                },
                spcm: {
                    clock: 0,
                    type: 0,
                    reg: 0
                },
                c6280: {
                    clock: 0,
                    type: window.C6280 && useDropIn ? 1 : 0
                },
                qsound: {
                    clock: 0,
                    type: window.QSound && useDropIn ? 1 : 0
                }
            };
            self.playbackFactor = (self.outputSampleRate / 44100.0);
            var psg_clock = header.readLong();
            if (psg_clock > 0) {
                settings.psg.clock = psg_clock;
            }
            var ym2413_clock = header.readLong();
            var tag_offset = header.readLong();
            pos = 0;
            settings.sample_count = header.readLong();
            settings.loop_offset = header.readLong() + 0x1c;
            settings.loop_samples = header.readLong();
            if (version >= 0x0101) {
                settings.frame_rate = header.readLong();
            } else {
                header.skipLong();
            }
            if (version >= 0x0110) {
                settings.psg.feedback = header.readShort();
                settings.psg.shift_width = header.readByte();
            } else {
                header.skipShort();
                header.skipByte();
            }
            canSN = false;
            if (settings.psg.type) {
                chips['psg'][0] = new SN76489();
                chips['psg'][0].init(settings.psg.clock, self.outputSampleRate);
                chips['psg'][0].config(chips['psg'][0].ENUM.mute_values.MUTE_ALLON, chips['psg'][0].ENUM.boost_modes.BOOST_OFF, chips['psg'][0].ENUM.volume_modes.VOL_FULL, settings.psg.feedback, settings.psg.shift_width);
                canSN = !!(settings.psg.clock && settings.psg.type);
            } else {
                chips['psg'][0] = new PSG();
                chips['psg'][0].reset(settings.psg.clock, self.outputSampleRate);
                chips['psg'][0].configure(settings.psg.feedback, settings.psg.shift_width);
            }
            if (version >= 0x0151) {
                settings.psg.flags = header.readByte();
            } else header.skipByte();
            settings.ym2413.clock = ym2413_clock;
            can2413 = false;
            if (settings.ym2413.type) {
                chips['ym2413'][0] = new YM2413();
                chips['ym2413'][0].init(settings.ym2413.clock, self.outputSampleRate);
                chips['ym2413'][0].reset();
                can2413 = !!(settings.ym2413.clock && settings.ym2413.type);
            } else chips['ym2413'][0] = null;
            var ym2612_clock = 0;
            if (version >= 0x0110) ym2612_clock = header.readLong();
            else header.skipLong();
            settings.ym2612.clock = ym2612_clock;
            can2612 = false;
            if (mjazz > 2) mjazz = 2;
            if (settings.ym2612.type && settings.ym2612.clock > 0) {
                if (mjazz) console.log("Experimental YM2612 'MJazz' activated");
                var _mj = -1;
                while (++_mj < (mjazz + 1)) {
                    if (chips['ym2612'][_mj]) delete chips['ym2612'][_mj];
                    chips['ym2612'][_mj] = new YM2612();
                    chips['ym2612'][_mj].init(settings.ym2612.clock, self.outputSampleRate << _mj);
                    chips['ym2612'][_mj].config(9);
                    chips['ym2612'][_mj].reset();
                    chips['ym2612'][_mj].write(0x28, 0x00);
                }
                can2612 = !!(settings.ym2612.clock && settings.ym2612.type);
            } else chips['ym2612'].length = 0;
            var ym2151_clock = 0;
            if (version >= 0x0110) ym2151_clock = header.readLong();
            else header.skipLong();
            settings.ym2151.clock = ym2151_clock;
            can2151 = false;
            if (settings.ym2151.type && settings.ym2151.clock > 0) {
                chips['ym2151'][0] = new FM.OPM;
                chips['ym2151'][0].Init(settings.ym2151.clock, self.outputSampleRate);
                chips['ym2151'][0].SetReg(20, 42);
                for (var q = 0; q < 8; ++q) chips['ym2151'][0].SetReg(56 + q, 0);
                chips['ym2151'][0].SetReg(15, 0);
                can2151 = !!(settings.ym2151.clock && settings.ym2151.type);
            } else chips['ym2151'][0] = null;
            var data_offset = 0x40;
            if (version >= 0x0150) {
                var new_data_offset = header.readLong();
                if (new_data_offset > 0) {
                    data_offset = 0x34 + new_data_offset;
                }
                var spcm_clock = header.readLong(),
                    spcm_reg = header.readLong();
                if (version > 0x150) {
                    settings.spcm.clock = spcm_clock;
                    settings.spcm.reg = spcm_reg;
                }
            }
            can6280 = false;
            canQS = false;
            if (version > 0x0150) {
                console.log("TODO: load version", version.toString(16));
                var rf5c68_clock = header.readLong(),
                    ym2203_clock = header.readLong(),
                    ym2608_clock = header.readLong(),
                    ym2610_clock = header.readLong(),
                    ym3812_clock = header.readLong(),
                    ym3526_clock = header.readLong(),
                    y8950_clock = header.readLong(),
                    ymf262_clock = header.readLong(),
                    ymf278b_clock = header.readLong(),
                    ymf271_clock = header.readLong(),
                    ymz280b_clock = header.readLong(),
                    rf5c164_clock = header.readLong(),
                    pwm_clock = header.readLong(),
                    ay8910_clock = header.readLong();
                var ay_type = header.readByte(),
                    ay_flags = header.readByte(),
                    ay_ym2203_flags = header.readByte(),
                    ay_ym2608_flags = header.readByte();
                var vol_mod = header.readByte(),
                    res_x7D = header.readByte(),
                    loop_base = header.readByte(),
                    loop_mod = header.readByte();
                if (version > 0x0160) {
                    var dmg_clock = header.readLong(),
                        nes_clock = header.readLong(),
                        mpcm_clock = header.readLong(),
                        upd7759_clock = header.readLong(),
                        m6258_clock = header.readLong(),
                        m6258_flags = header.readByte(),
                        k054539_flags = header.readByte(),
                        c140_type = header.readByte(),
                        res_x97 = header.readByte(),
                        m6295_clock = header.readLong(),
                        k051649_clock = header.readLong(),
                        k054539_clock = header.readLong(),
                        c6280_clock = header.readLong(),
                        c140_clock = header.readLong(),
                        k053260_clock = header.readLong(),
                        pokey_clock = header.readLong(),
                        qsound_clock = header.readLong();
                    settings.c6280.clock = c6280_clock;
                    if (settings.c6280.type && settings.c6280.clock > 0) {
                        chips['c6280'][0] = new C6280(settings.c6280.clock, self.outputSampleRate);
                        chips['c6280'][0].reset();
                        can6280 = !!(settings.c6280.type && settings.c6280.clock);
                    } else chips['c6280'][0] = null;
                    settings.qsound.clock = qsound_clock;
                    if (settings.qsound.type && settings.qsound.clock > 0) {
                        if (chips['qsound'][0]) delete chips['qsound'][0];
                        chips['qsound'][0] = new QSound();
                        chips['qsound'][0].init(settings.qsound.clock, self.outputSampleRate);
                        canQS = !!(settings.qsound.type && settings.qsound.clock);
                    }
                }
            } else console.log("VGM version", version.toString(16));
            if (tag_offset > 0) {
                header.seek(0x14 + tag_offset);
                parse_tag();
            }
            header.seek(data_offset);
            isPlaying = true;
            return true;
        }
        this.__defineGetter__('length', function() {
            return (settings.sample_count * self.playbackFactor) | 0;
        });
        this.__defineGetter__('position', function() {
            return pos % settings.sample_count;
        });
        this.__defineGetter__('sample', function() {
            if (settings.loop.offset === null || pos < settings.sample_count) return pos % settings.sample_count;
            else return settings.loop.offset + (pos - settings.loop.offset) % settings.loop_samples;
        });
        this.__defineGetter__('psgClock', function() {
            return settings.psg.clock;
        });
        this.__defineGetter__('playing', function() {
            return isPlaying;
        });
        this.__defineGetter__('loopOffset', function() {
            return settings.loop_offset;
        });
        this.__defineGetter__('loopSamples', function() {
            return settings.loop_samples;
        });
        this.toggle = function(c, ch, m) {
            if (chips[c].length > 0 && chips[c][0]) {
                chips[c][0].toggle(ch, m);
            }
        };
        this.togglePSG = function(m) {
            if (settings.psg.type) {
                chips['psg'][0].config(m & 0xf, chips['psg'][0].ENUM.boost_modes.BOOST_OFF, chips['psg'][0].ENUM.volume_modes.VOL_FULL, settings.psg.feedback, settings.psg.shift_width);
            }
        };
        this.debug = function(c, wh) {
            if (chips[c] && chips[c].length > wh && chips[c][wh] !== null) return chips[c][wh].toString();
            else return "N/A";
        };

        function nextCommand() {
            var _of = header.getOffset(),
                command = header.readByte();
            if (_of === settings.loop_offset && settings.loop.offset === null) settings.loop.offset = pos;
            var c = (command & 0xF0);
            if (c === 0x70) return 1 + (command & 0x0F);
            else if (command === 0x62) return settings.wait.NTSC;
            else if (command === 0x63) return settings.wait.PAL;
            else if (command === 0x61) return header.readShort();
            else if (c === 0x80) {
                if (settings.ym2612.data.index > -1) {
                    if (settings.ym2612.data.pointer < blocks[settings.ym2612.data.index].data.length - 1) {
                        settings.ym2612.data.current = blocks[settings.ym2612.data.index].data.charCodeAt(settings.ym2612.data.pointer++);
                    } else settings.ym2612.data.current = 128;
                } else {
                    settings.ym2612.data.current = 128;
                }
                if (can2612) chips['ym2612'][0].write(0x2A, settings.ym2612.data.current);
                return (command & 0x0f);
            }
            var b;
            switch (command) {
                case 0x66:
                    if (settings.loop_samples > 0) {
                        ++loop;
                        header.seek(settings.loop_offset);
                    } else {
                        isPlaying = false;
                    }
                    return 0;
                case 0x67:
                    b = [header.readByte(), header.readByte(), header.readLong()];
                    if (settings.strict && b[0] !== 0x66) throw new Error("VGM::read - invalid data block header (not 0x66)");
                    var n = blocks.length;
                    blocks[n] = {
                        "type": b[1],
                        "data": header.readString(b[2]),
                        "muted": 0
                    };
                    if (b[1] === 0 && settings.ym2612.data.index === -1) settings.ym2612.data.index = n;
                    else if (b[1] >= 0x80 && b[1] < 0xc0) {
                        var z, l, st, d;
                        switch (b[1]) {
                            case Data.ENUM.QSOUND:
                                if (canQS) {
                                    z = blocks[n].data.charCodeAt(0) + (blocks[n].data.charCodeAt(1) << 8) + (blocks[n].data.charCodeAt(2) << 16) + (blocks[n].data.charCodeAt(3) << 24);
                                    st = blocks[n].data.charCodeAt(4) + (blocks[n].data.charCodeAt(5) << 8) + (blocks[n].data.charCodeAt(6) << 16) + (blocks[n].data.charCodeAt(7) << 24);
                                    l = b[2] - 8;
                                    d = blocks[n].data.substr(8, l);
                                    chips['qsound'][0].set(z, st, l, d);
                                } else if (settings.strict) throw new Error("VGM::read - attempted to read QSound data block without QSound support");
                                break;
                            default:
                                break;
                        }
                    } else console.log('@x' + _of.toString(16) + ', DATA(x' + (b[1].toString(16)) + '/' + Data.Types[b[1]] + ',' + b[2] + ')');
                    return 0;
                case 0x4f:
                    b = header.readByte();
                    if (canSN) chips['psg'][0].GGStereoWrite(b);
                    return 0;
                case 0x50:
                    b = header.readByte();
                    if (canSN) chips['psg'][0].write(b);
                    return 0;
                case 0x51:
                    b = [header.readByte(), header.readByte()];
                    if (can2413) {
                        chips['ym2413'][0].write(b[0], b[1]);
                    }
                    return 0;
                case 0x52:
                    b = [header.readByte(), header.readByte()];
                    if (can2612) {
                        var _mj = -1;
                        while (++_mj < (mjazz + 1)) {
                            chips['ym2612'][_mj].write(b[0], b[1]);
                        }
                    }
                    return 0;
                case 0x53:
                    b = [header.readByte(), header.readByte()];
                    if (can2612) {
                        var _mj = -1;
                        while (++_mj < (mjazz + 1)) {
                            chips['ym2612'][_mj].write(0x100 | b[0], b[1]);
                        }
                    }
                    return 0;
                case 0x54:
                    b = [header.readByte(), header.readByte()];
                    if (can2151) {
                        chips['ym2151'][0].SetReg(b[0], b[1]);
                    }
                    return 0;
                case 0x55:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x56:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x57:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x58:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x59:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x5a:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x5b:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x5c:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x5d:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x5e:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x5f:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0x64:
                    if (settings.version > 0x161) {
                        b = [header.readByte(), header.readShort()];
                        if (b[0] === 0x62) settings.wait.NTSC = b[1];
                        else if (b[0] === 0x63) settings.wait.PAL = b[1];
                    }
                    return 0;
                case 0x68:
                    b = [header.readByte(), header.readByte(), header.read24bit(), header.read24bit(), header.read24bit()];
                    console.log('@x' + _of.toString(16) + ', RAM(x' + (b[1].toString(16)) + '/' + Data.Types[b[1]] + ')');
                    return 0;
                case 0xe0:
                    b = header.readLong();
                    if (settings.ym2612.data.index > -1) settings.ym2612.data.pointer = b;
                    return 0;
                case 0xb7:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0xb8:
                    b = [header.readByte(), header.readByte()];
                    return 0;
                case 0xb9:
                    b = [header.readByte(), header.readByte()];
                    if (can6280) {
                        chips['c6280'][0].write(b[0], b[1]);
                    }
                    return 0;
                case 0x90:
                    b = [header.readByte(), header.readByte(), header.readByte(), header.readByte()];
                    return 0;
                case 0x91:
                    b = [header.readByte(), header.readByte(), header.readByte(), header.readByte()];
                    return 0;
                case 0x92:
                    b = [header.readByte(), header.readLong()];
                    return 0;
                case 0x93:
                    b = [header.readByte(), header.readLong(), header.readByte(), header.readLong()];
                    return 0;
                case 0x94:
                    b = header.readByte();
                    return 0;
                case 0x95:
                    b = [header.readByte(), header.readShort(), header.readByte()];
                    return 0;
                case 0xc4:
                    b = [header.readByte(), header.readByte(), header.readByte()];
                    if (canQS) {
                        chips['qsound'][0].write(b[2], (b[0] << 8) + b[1]);
                    }
                    return 0;
                default:
                    if ((command > 0x30) && (command <= 0x3f)) {
                        header.skipByte();
                    } else if ((command > 0x40) && (command <= 0x4e)) {
                        if (settings.version > 0x160) header.skipShort();
                        else header.skipByte();
                    } else if ((command > 0xa0) && (command <= 0xbf)) {
                        header.skipShort();
                    } else if ((command > 0xc0) && (command <= 0xdf)) {
                        header.skipByte();
                        header.skipShort();
                    } else if ((command > 0xe1) && (command <= 0xff)) {
                        header.skipLong();
                    }
                    return 0;
            }
        }
        var samples_remaining = 0;
        var _sc = {
            "psg": 1.0 / 16384,
            "ym2413": 1.0 / (1 << 16),
            "ym2612": 1.0 / (1 << 15),
            "dac_ym2612": 1.0 / 128,
            "ym2612_mjazz": 3.0 / (1 << 16),
            "ym2151": 1.0 / 49152
        };

        function _interpolateLinear(b, i) {
            var n = i | 0,
                q = i - n;
            var r = b[n] * (1.0 - q);
            if (++n < b.length) r = (r + b[n] * q);
            return r;
        }
        this.mixInterlaced = function(audioBuffer, channelCount) {
            if (!isPlaying) return audioBuffer;
            var n;
            while (isPlaying) {
                n = nextCommand();
                if (n > 0) {
                    break;
                }
            }
            return audioBuffer;
        };
        this.fillSamples = function(audioBuffer, channelCount) {
            if (!isPlaying) {
                return audioBuffer;
            }
            var offset = 0,
                n, z;
            var buffer_remaining = ((audioBuffer.length - offset) / channelCount) | 0,
                sample_count;
            var h = [],
                p, q, ch, v, i, iOPN, iOPNmj1, iOPNmj2, vOPN, qOPN, smpOPN, dOPN = settings.ym2612.data.index;
            var buf_psg = [
                    [],
                    []
                ],
                buf_opll = [
                    [],
                    []
                ],
                buf_opn = [
                    [],
                    []
                ],
                buf_opn_mjazz1 = [
                    [],
                    []
                ],
                buf_opn_mjazz2 = [
                    [],
                    []
                ],
                buf_opm = [
                    [],
                    []
                ],
                buf_c6280 = [
                    [],
                    []
                ],
                buf_qs = [
                    [],
                    []
                ];
            while (buffer_remaining > 0) {
                sample_count = (samples_remaining + 0.5) | 0;
                if (buffer_remaining < sample_count) sample_count = buffer_remaining;
                z = offset;
                if (sample_count > 0) {
                    if (canSN) {
                        chips['psg'][0].mixStereo(audioBuffer, sample_count, z);
                    } else if (settings.psg.clock) chips['psg'][0].emulateSamples(audioBuffer, offset, sample_count, channelCount);
                    if (can2413) {
                        chips['ym2413'][0].mixStereo(audioBuffer, sample_count, z);
                    }
                    if (can2612) {
                        if (chips['ym2612'][0].interval) {
                            chips['ym2612'][0].mixStereo(audioBuffer, sample_count, z);
                            if (mjazz) {
                                chips['ym2612'][1].mixStereo(audioBuffer, sample_count, z);
                                chips['ym2612'][2].mixStereo(audioBuffer, sample_count, z);
                            }
                        } else {
                            smpOPN = chips['ym2612'][0].interval ? sample_count : (sample_count * chips['ym2612'][0].chip.OPN.ST.scale + 0.5) | 0;
                            buf_opn = chips['ym2612'][0].update(smpOPN);
                            if (buf_opn[0].length < 1) console.log("Couldn't req(" + audioBuffer.length + ") OPN (scale=" + chips['ym2612'][0].chip.OPN.ST.scale + ", " + smpOPN + " adj smp)");
                            if (mjazz) {
                                smpOPN = chips['ym2612'][1].interval ? sample_count : (sample_count * chips['ym2612'][1].chip.OPN.ST.scale + 0.5) | 0;
                                buf_opn_mjazz1 = chips['ym2612'][1].update(smpOPN), smpOPN = chips['ym2612'][2].interval ? sample_count : (sample_count * chips['ym2612'][2].chip.OPN.ST.scale + 0.5) | 0;
                                buf_opn_mjazz2 = chips['ym2612'][2].update(smpOPN);
                            }
                        }
                    }
                    if (can2151) {
                        chips['ym2151'][0].mixStereo(audioBuffer, sample_count, z);
                    }
                    if (can6280) {
                        chips['c6280'][0].mixStereo(audioBuffer, sample_count, z);
                    }
                    if (canQS) {
                        chips['qsound'][0].mixStereo(audioBuffer, sample_count, z);
                    }
                    samples_remaining -= sample_count;
                    buffer_remaining -= sample_count;
                    offset += (channelCount * sample_count);
                    pos += sample_count;
                }
                if (samples_remaining > 0) {
                    break;
                }
                if (!isPlaying) {
                    samples_remaining = 0;
                    break;
                } else {
                    samples_remaining += (nextCommand() * self.playbackFactor);
                }
            }
            if (h.length) console.log("$$$(" + h.length + "):" + h.toString(','));
            return audioBuffer;
        };
    }
    window.VgmFile = VgmFile;
})();
