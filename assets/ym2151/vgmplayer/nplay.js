(function() {
    "use strict";
    var _att = null,
        _allowedAtt = [null, "jQuery", "document"];
    var _v = null,
        _i = null;
    var _i_xport = null,
        _ms_xport = 100;
    var sink = null;
    var ns = null;
    var pos = 0;
    var canPlay = 1;
    var _dbg_txt = "",
        _dbg_txt_last = "",
        _dbg_time = -1,
        _dbg_time_last = -2;
    var NPlay = {
        get attached() {
            return _att;
        },
        set attached(v) {
            _att = _allowedAtt.indexOf(v) > -1 ? v : null;
        },
        get position() {
            return pos || 0;
        },
        get length() {
            return _v && _v.length || 0;
        },
        "util": {
            "request": function(u, t, onSuccess, onFailure) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', u, true);
                xhr.responseType = t;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState !== 4) return;
                    else if ((xhr.status == 0) || (xhr.status == 200)) onSuccess(xhr.response);
                    else onFailure(u);
                }
                xhr.send(null);
            },
            "requestBinary": function(u, onSuccess, onFailure) {
                var d = new Date();
                this.request(u + "?ts=" + d.getTime(), 'arraybuffer', onSuccess, onFailure);
            },
            "requestText": function(u, onSuccess, onFailure) {
                this.request(u, 'text', onSuccess, onFailure);
            },
            "parseRows": function(txt) {
                return txt.split('\n').filter(function(e) {
                    return (e.length > 0);
                }).map(function(e) {
                    return e.trim();
                });
            }
        },
        "config": {
            'debug': false,
            'strict': false,
            'audio': {
                'rate': 44100,
                'buffer': {
                    'min': 4096,
                    'max': 44100
                },
                'channels': 2
            },
            "file": "games.txt",
            'dir': {
                'playlist': 'playlists',
                'music': 'music',
                'ss': 'screenshots'
            },
            'elements': {
                'progress': 'transport-progress',
                'previous': 'transport-prev',
                'next': 'transport-next',
                'play': 'transport-play',
                'pause': 'transport-pause'
            }
        },
        "init": function(cfg) {
            var N = this;

            function _fill(n) {
                function zeroed(n) {
                    var ret = [];
                    while (--n > -1) ret[n] = 0;
                    return ret;
                }
                if (_v) {
                    pos = _v.position;
                    if (_v.loopSamples > 0) pos = _v.sample;
                    else if (!_v.playing || _v.sample >= _v.length) {
                        if (_i_xport) setTimeout(function() {
                            clearInterval(_i_xport);
                        }, 10);
                        if (_i) setTimeout(function() {
                            clearInterval(_i);
                            console.log("VGM playback finished.");
                        }, 10);
                    }
                    if (n > 0) {
                        var b = zeroed(n),
                            s = _v.fillSamples(b, cfg.audio.channels);
                        if (cfg.debug) $('#xas-info-req').text(n + (_v.playing ? '@' + _v.sample + ', (' + (s && 'length' in s ? s.length : typeof s) + ' got)' : ' (VGM done)'));
                        return s;
                    }
                    return [];
                } else {
                    if (_i) clearInterval(_i);
                    console.log('No vgm to fill(' + n + ')');
                }
                return [];
            }

            function _fail() {
                if (canPlay) {
                    canPlay = 0;
                    alert('Could not fill audio buffer!');
                }
            }
            var N = this;
            if (window.NSink) ns = new NSink;
            if (ns) {
                ns.init();
                ns.setCallback(function(buf) {
                    pos = _v.position;
                    if (_v.loopSamples > 0) pos = _v.sample;
                    else if (!_v.playing || _v.sample >= _v.length) {
                        if (_i_xport) setTimeout(function() {
                            clearInterval(_i_xport);
                        }, 10);
                        setTimeout(function() {
                            ns.disconnect();
                            console.log("VGM playback finished.");
                        }, 10);
                    }
                    var s = _v.fillSamples(buf, cfg.audio.channels) || [];
                    if (N.config.debug) $('#xas-info-req').text((buf.length) + (_v.playing ? '@' + _v.sample + ', (' + (s && 'length' in s ? s.length : typeof s) + ' got)' : ' (VGM done)'));
                    return s;
                });
                console.log("NSink found");
                $(window).on("unload", function() {
                    ns.destroy();
                });
            }
            sink = new XAudioServer(cfg.audio.channels, cfg.audio.rate, cfg.audio.buffer.min, cfg.audio.buffer.max, _fill, 1.0, _fail);
            if (sink) {
                console.log("Audio server initialized: ch=" + cfg.audio.channels + ', rate=' + cfg.audio.rate + ', buf=[' + cfg.audio.buffer.min + ',' + cfg.audio.buffer.max + ']');
                $('#xas-info-rate').text(cfg.audio.rate);
                $('#xas-info-req').text('*');
                $('#xas-info-rem').text('-');
                return true;
            } else {
                if (canPlay) {
                    canPlay = 0;
                    alert('NPlay::init - Could not initialize audio server!');
                }
                return false;
            }
        },
        "toggleChannel": function(chip, ch, m) {
            if (_v) {
                _v.toggle(chip, ch, m);
            }
        },
        "update": function() {
            $('#' + this.config.elements.progress).attr('data-duration', _v ? _v.length : '').attr('data-elapsed', _v ? _v.sample : '');
        },
        "load": function(p) {
            var fn = this.config.file;
            if (this.init(this.config)) this.util.requestText(fn + '?t=' + (new Date().toString()), function(d) {
                NPlay.updateAlbums(p, NPlay.util.parseRows(d));
            }, function() {
                alert("NPlay::load - Can't load game list - " + fn);
            });
            else {
                $('#xas-info-rate').text('N/A');
                console.log("NPlay::load - Couldn't initialize audio server");
            }
        },
        "interval": function(p) {
            var N = this;
            return function() {
                if (N.config.debug) {
                    if (_v && _v.playing) {
                        var n = sink.remainingBuffer();
                        $('#xas-info-rem').text(n);
                    } else $('#xas-info-rem').text('(vgm done)');
                }
                sink.executeCallback();
            };
        },
        "pause": function() {
            if (_i_xport) clearInterval(_i_xport);
            if (ns) {
                ns.disconnect();
                if (_i) clearInterval(_i);
            } else if (_i) clearInterval(_i);
        },
        "unpause": function(p) {
            var N = this;
            if (_i_xport) clearInterval(_i_xport);
            _i_xport = setInterval(function() {
                N.updateTransport(p, pos);
            }, _ms_xport);
            if (ns) {
                ns.connect();
                if (_i) clearInterval(_i);
                _i = setInterval(function() {
                    if (N.config.debug) {
                        if (_v && _v.playing) {
                            _dbg_time = _v.sample / N.config.audio.rate;
                            _dbg_txt = 'SN76489:' + _v.debug('psg', 0) + "\n\n" +
                                'YM2413:' + _v.debug('ym2413', 0) + "\n\n" +
                                'YM2612:' + _v.debug('ym2612', 0) + "\n\n" +
                                'YM2151:' + _v.debug('ym2151', 0);
                            if (_dbg_time !== _dbg_time_last)
                                $('#xas-info-rem').text(_dbg_time.toFixed(3)), _dbg_time_last = _dbg_time;
                            if (_dbg_txt !== _dbg_txt_last)
                                $('#xas-info-chip').text(_dbg_txt), _dbg_txt_last = _dbg_txt;
                        } else $('#xas-info-rem').text('(vgm done)');
                    }
                }, 100);
            } else {
                if (_i) clearInterval(_i);
                if (sink) _i = setInterval(this.interval(p), 16);
            }
        },
        "play": function(p, d, gz) {
            if (_i) clearInterval(_i);
            if (_v) _v.stop();
            if (window.VgmFile) {
                var cfg = this.config;
                if (!_v) _v = new VgmFile(true);
                _v.outputSampleRate = cfg.audio.rate;
                if (_v.load(d, gz)) {
                    pos = 0;
                    console.log("Loaded as VGM", _v.outputSampleRate + "Hz", $('#' + cfg.elements.progress).data('duration'), $('#' + cfg.elements.progress).data('elapsed'));
                    if (ns) {
                        ns.reset();
                        console.log("Attached to NSink");
                    }
                    this.unpause(p);
                } else console.log(d);
            } else console.log("VGM processing not yet attached");
        },
        "loadSong": function(p, f) {
            var fn = this.config.dir.music + '/' + f;
            this.util.requestBinary(fn, function(d) {
                console.log("Loaded", d.byteLength, "byte(s)");
                var q, z, gz = 0;
                if (window.Zlib) {
                    var tmp = new Uint8Array(d);
                    var isZ = (tmp[0] === 0x1f && tmp[1] === 0x8b) || f.substr(-4) === '.vgz';
                    if (Zlib.Gunzip && isZ) {
                        q = new Zlib.Gunzip(tmp);
                        z = q.decompress();
                        gz = 1;
                        console.log("GZ signature detected, using gzip reader");
                    } else z = d, console.log("Couldn't read VGM using gzip reader:", !isZ ? "not VGZ" : "gzip reader not found");
                } else z = d;
                NPlay.play(p, z, gz);
                NPlay.updateSongTitle(p, f);
            }, function() {
                alert("NPlay::loadSong - Can't load file - " + fn);
            });
        },
        "loadPlaylist": function(p, f) {
            var fn = this.config.dir.playlist + '/' + f + '.m3u';
            this.util.requestText(fn + '?t=' + (new Date().toString()), function(d) {
                NPlay.updateAlbumArt(p, f);
                NPlay.updateSongTitle(p, "-");
                NPlay.updatePlaylist(p, NPlay.util.parseRows(d));
            }, function() {
                alert("NPlay::loadPlaylist - Can't load playlist - " + fn);
            });
        }
    };
    if (window.NPlay = NPlay) console.log("Attached NPlay to window");
    else console.log("Failed attaching NPlay");
})();
if (window.jQuery)(function($) {
    NPlay.updateTransport = function(p, f) {
        $(".transport .transport-bar", p).attr('data-elapsed', this.position);
        $(".transport .transport-bar .transport-position", p).css('width', (100 * this.position / this.length) + '%');
    };
    NPlay.updateSongTitle = function(p, f) {
        $(".albuminfo .songtitle", p).text(f);
        $(".transport .transport-bar", p).attr('data-duration', this.length).attr('data-elapsed', 0);
        $("input[type=checkbox][name|=mute]").prop('checked', 'checked');
        console.log("Track loaded");
    };
    NPlay.updateAlbumArt = function(p, f) {
        var fn = this.config.dir.ss + '/' + f + '.png';
        this.util.requestText(fn + '?t=' + (new Date().toString()), function(d) {
            $(".albuminfo .albumart", p).css({
                "backgroundImage": "url('" + fn + "')"
            }).find(".albumtitle").text(f);
        }, function() {
            console.log("Can't load album art - " + fn);
            $(".albuminfo .albumart", p).css({
                "backgroundImage": "none"
            }).find(".albumtitle").text(f);
        });
    };
    NPlay.updatePlaylist = function(p, f) {
        var t = "",
            d = this.config.dir.music;
        $.each(f, function(i, v) {
            t += "<li><a rel='pl-" + i + "' href='" + d + "/" + v + "' title='" + v + "'>" + v + "</a></li>";
        });
        if (t !== "") t += '<li class="more"><a href="#pl">&hellip;</a></li>';
        else t = '<li class="empty">No albums to list</li>';
        $(".playlist .tracklist", p).empty().append(t).find('a').click(function(e) {
            e.preventDefault();
            if ($(this).parent().is(".more")) $(this).parent().removeClass('hidden').siblings('li').removeClass('hidden selected');
            else {
                NPlay.loadSong(p, $(this).parent().addClass('selected').siblings('li').removeClass('selected').addClass('hidden').end().end().text());
                $(".transport", p).find('.play').hide().end().find('.pause').show();
            }
        });
        console.log("Track list loaded");
    };
    NPlay.updateAlbums = function(p, f) {
        var t = "",
            d = this.config.dir.playlist;
        $.each(f, function(i, v) {
            t += "<li><a rel='gl-" + i + "' href='" + d + "/" + v + ".m3u" + "' title='" + v + "'>" + v + "</a></li>";
        });
        if (t !== "") t += '<li class="more"><a href="#gl">&hellip;</a></li>';
        else t = '<li class="empty">No albums to list</li>';
        $(".playlist .albumlist", p).empty().append(t).find('a').click(function(e) {
            e.preventDefault();
            if ($(this).parent().is(".more")) $(this).parent().removeClass('hidden').siblings('li').removeClass('hidden selected');
            else NPlay.loadPlaylist(p, $(this).parent().addClass('selected').siblings('li').removeClass('selected').addClass('hidden').end().end().text());
        });
        console.log("Album list loaded");
    };
    NPlay.attached = "jQuery";
})(jQuery);
else(function() {
    NPlay.updateTransport = function(p, f) {
        console.log("TODO: define non-jQuery updateTransport");
    };
    NPlay.updateSongTitle = function(p, f) {
        console.log("TODO: define non-jQuery updateSongTitle");
    };
    NPlay.updateAlbumArt = function(p, f) {
        console.log("TODO: define non-jQuery updateAlbumArt");
    };
    NPlay.updatePlaylist = function(p, f) {
        console.log("TODO: define non-jQuery updatePlaylist");
    };
    NPlay.updateAlbums = function(p, f) {
        console.log("TODO: define non-jQuery updateAlbums");
    };
    NPlay.attached = "document";
})();
$(function() {
    var f = {
        "prev": function(a) {
            return function(e) {
                e.preventDefault();
                alert("TODO: stop current, load previous, play loaded for player " + a.attr("id"));
            };
        },
        "next": function(a) {
            return function(e) {
                e.preventDefault();
                alert("TODO: stop current, load next, play loaded for player " + a.attr("id"));
            };
        },
        "play": function(a) {
            return function(e) {
                e.preventDefault();
                if (!NPlay.config.strict) NPlay.unpause(a), $(".transport", a).find('.play').hide().end().find('.pause').show();
                else {
                    try {
                        NPlay.unpause(a);
                        $(".transport", a).find('.play').hide().end().find('.pause').show();
                    } catch (er) {
                        throw new Error("VGM play fail - " + er.message);
                    }
                }
            };
        },
        "pause": function(a) {
            return function(e) {
                e.preventDefault();
                if (!NPlay.config.strict) NPlay.pause(), $(".transport", a).find('.pause').hide().end().find('.play').show();
                else {
                    try {
                        NPlay.pause();
                        $(".transport", a).find('.pause').hide().end().find('.play').show();
                    } catch (er) {
                        throw new Error("VGM pause fail - " + er.message);
                    }
                }
            };
        }
    };
    $(".player .transport a").each(function(i, el) {
        var anc = $(this).parents(".player"),
            rel = $(this).attr("rel");
        if (rel !== '') $(el).click(f[rel](anc));
    });
    if (NPlay.attached !== null) console.log("NPlay attached via " + NPlay.attached);
    console.log("Attached transport functions");
});
