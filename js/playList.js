/*
 window.radio_getlist_bak = window.DBR.radio_getlist;
 window.DBR.radio_getlist = function(url){console.log(url);radio_getlist_bak(url.replace('fm/bak','fm'))};
 $('#fm-player .player-wrap object param[name="flashvars"]').val($('#fm-player .player-wrap object param[name="flashvars"]').val().replace('douban.fm','douban.fm/bak'));
 var flash = $('#fm-player .player-wrap object');
 $('#fm-player .player-wrap').html(flash);
 */
function hackPlaylist(_o){
	$('body').append('<div>hackPlaylist</div>');
    var o = eval('(' + _o + ')');
    if (o.type == 'start') {
        var s = o.song;
        songlist[s.sid] = _o;
        songarray.push(s);
        var songindex = songarray.length - 1;
        var songinfo = $('<li class="songinfo" sid="' + s.sid + '" ></li>');
        //专辑图片
        var cover = $('<div class="cover"></div>').append($('<img src="' + s.picture + '" />'));
        //歌名
        var title = $('<li><a href="#">' + s.title + '</a></li>').click(songindex, titleClicked).mouseover(scrollMouseover);
        //歌手
        var artist = $('<li>' + s.artist + '</li>');
        //专辑信息
        var album = $('<li><a href="http://www.douban.com' + s.album + '" target="_blank">' + s.albumtitle + '</a></li>').mouseover(scrollMouseover);
        //功能
        var functions = $('<li></li>');
        //喜欢功能
        if ($('#fm-user').text() != '') {
            $('<a href="#" class="likeBtn" title="' + (s.like ? '取消喜欢' : '喜欢') + '" like="' + (s.like ? 'like' : '') + '" ><img src="' + $((s.like ? '#likedImage' : '#likeImage')).attr('src') + '" /></a>').click(s.sid, likeEventListener).appendTo(functions);
        }
		
		if ($('#fm-user').text() != '' && o.channel == '0') {
            $('<a href="#" class="banBtn" title="不再播放" ><img src="' + $('#banImage').attr('src') + '" /></a>').click(s.sid, banEventListener).appendTo(functions);
        }
		
        //下载功能
        $('<a href="' + s.url + '" class="saveBtn"  target="_blank" title="右键另存为"><img src="' + $('#downloadImage').attr('src') + '"/></a>').mouseover(s.url, qrcodeGenerate).mouseout(function(){
            $('#songURLQRCodeImage').hide();
        }).appendTo(functions);
        //二维条码功能
		/*
        $('<a href="#" class="qrBtn" title="二维条码"><img src="' + $('#qrcodeImage').attr('src') + '"/></a>').mouseover(s.url, qrcodeGenerate).mouseout(function(){
            $('#songURLQRCodeImage').hide();
        }).click(function(){
            return false;
        }).appendTo(functions);
        */
        //新浪微博功能
        $('<a href="#" class="sinaBtn" title="转播到新浪微博"><img src="http://www.sinaimg.cn/blog/developer/wiki/16x16.png" border="0" /></a>').click(o, function(event){
            sinaWeibo(o);
            return false;
        }).appendTo(functions);
        //腾讯微博功能
        $('<a href="#" class="tencentBtn" title="转播到腾讯微博"><img src="http://v.t.qq.com/share/images/s/weiboicon16.png" border="0" /></a>').click(o, function(event){
            tencentWeibo(o);
            return false;
        }).appendTo(functions);
        songinfo.append(cover);
        $('<ul></ul>').append(title).append(artist).append(album).append(functions).appendTo(songinfo);
        songinfo.append('<div class="clear"/>').appendTo($('#songinfos'));
        $('#hackedPlaylist').scrollTop(10000);
    }
}

//QRCode图片生成
function qrcodeGenerate(event){
    var x = event.pageX - 210;
    var y = event.pageY - 210;
    var url = 'http://qrcode.kaywa.com/img.php?s=8&d=' + encodeURIComponent(event.data);
    $('#songURLQRCodeImage').attr('src', url);
    $('#songURLQRCodeImage').css({
        'left': x + 'px',
        'top': y + 'px'
    });
    $('#songURLQRCodeImage').fadeIn('slow');
}

//内容过长之后的滚动显示动画
function scrollMouseover(event){
    $(this).unbind('mouseover');
    var container = $(this);
    var child = $(this).children().get(0);
    //console.log('container-width:' + $(container).width());
    //console.log('child-width:' + $(child).width());
    if ($(child).width() > $(container).width()) {
        $(child).animate({
            marginLeft: $(container).width() - $(child).width()
        }, ($(child).width() - $(container).width()) * 20, function(){
            $(this).animate({
                marginLeft: 0
            }, ($(this).width() - $(this).parent().width()) * 20, function(){
                $(this).parent().mouseover(scrollMouseover);
            });
        });
    }
    else {
        $(this).mouseover(scrollMouseover);
    }
}

//点击歌名播放
function titleClicked(event){
    var songindex = event.data;
    currentSongIndex = songindex;
    hackerPlayer.play(songindex);
    return false;
}

//播放器
window.hackerPlayer = {
    //初始化
    init: function(){
        $('#hackedPlayer #playButton').click(function(){
            hackerPlayer.play();
        });
        $('#hackedPlayer #pauseButton').click(function(){
            hackerPlayer.pause();
        });
        $('#hackedPlayer #nextButton').click(function(){
            hackerPlayer.next();
        });
        $($('#hackedPlayer #playingSongTitle').parent()).mouseover(scrollMouseover);
        $($('#hackedPlayer #playingSongAlbum').parent()).mouseover(scrollMouseover);
        $($('#hackedPlayer audio')[0]).bind('ended', function(){
            hackerPlayer.next();
        });
    },
    //播放操作
    play: function(songindex){
    
        if (typeof(songindex) == 'undefined' && currentSong == null) {
            songindex = currentSongIndex;
        }
        if (typeof(songindex) != 'undefined') {
            var song = songarray[songindex];
            if (typeof(song) != 'undefined') {
                $('#hackedPlayer #playingSongTitle').html(song.title);
                $('#hackedPlayer #playingSongAlbum').html(song.albumtitle);
                $('#hackedPlayer #playingSongAlbum').attr('href', 'http://www.douban.com' + song.album);
                
                $('#hackedPlayer audio')[0].src = song.url;
                currentSong = song;
            }
            else {
                return false;
            }
        }
        $('#hackedPlayer audio')[0].play();
        $('#hackedPlayer #playButton').hide();
        $('#hackedPlayer #pauseButton').show();
        return true;
    },
    //暂停操作
    pause: function(){
        $('#hackedPlayer #pauseButton').hide();
        $('#hackedPlayer #playButton').show();
        $('#hackedPlayer audio')[0].pause();
    },
    //下一首操作
    next: function(){
        if (++currentSongIndex >= songarray.length) {
            currentSongIndex = 0;
        }
        hackerPlayer.play(currentSongIndex);
    }
};

//新浪微博分享
function sinaWeibo(o){
    var s = o.song;
    var _url = encodeURIComponent('http://douban.fm/?start=' + s.sid + 'g' + s.ssid + 'g' + o.channel + '&cid=' + o.channel);
    var _t = encodeURI('我正在收听 ' + s.artist + ' 的 《' + s.title + '》 （来自豆瓣FM-' + channelSet["ch_" + o.channel].name + '） ');
    var _pic = encodeURI(s.picture);
	var _appkey = encodeURI('3092420153');
    var _u = 'http://service.weibo.com/share/share.php?url=' + _url + '&title=' + _t + '&pic=' + _pic + '&appkey='+_appkey;
    window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}

//腾讯微博分享
function tencentWeibo(o){
    var s = o.song;
    var _t = encodeURI('我正在收听 ' + s.artist + ' 的 《' + s.title + '》 （来自豆瓣FM-' + channelSet["ch_" + o.channel].name + '） ');
    var _url = encodeURIComponent('http://douban.fm/?start=' + s.sid + 'g' + s.ssid + 'g' + o.channel + '&cid=' + o.channel);
    var _appkey = encodeURI("39ef552d94a9488f9e1bb39bf91fc1a8");//你从腾讯获得的appkey
    var _pic = encodeURI(s.picture);//（例如：var _pic='图片url1|图片url2|图片url3....）
    var _site = '';//你的网站地址
    var _u = 'http://v.t.qq.com/share/share.php?url=' + _url+'&appkey='+_appkey + '&site=' + _site + '&pic=' + _pic + '&title=' + _t;
    window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
}

//MD5引用http://code.google.com/p/crypto-js/项目代码
if (typeof Crypto == "undefined" || !Crypto.util) 
    (function(){
        var n = window.Crypto = {}, o = n.util = {
            rotl: function(g, i){
                return g << i | g >>> 32 - i
            },
            rotr: function(g, i){
                return g << 32 - i | g >>> i
            },
            endian: function(g){
                if (g.constructor == Number) 
                    return o.rotl(g, 8) & 16711935 | o.rotl(g, 24) & 4278255360;
                for (var i = 0; i < g.length; i++) 
                    g[i] = o.endian(g[i]);
                return g
            },
            randomBytes: function(g){
                for (var i = []; g > 0; g--) 
                    i.push(Math.floor(Math.random() * 256));
                return i
            },
            bytesToWords: function(g){
                for (var i = [], h = 0, a = 0; h < g.length; h++, a += 8) 
                    i[a >>> 5] |= g[h] <<
                    24 -
                    a % 32;
                return i
            },
            wordsToBytes: function(g){
                for (var i = [], h = 0; h < g.length * 32; h += 8) 
                    i.push(g[h >>> 5] >>> 24 - h % 32 & 255);
                return i
            },
            bytesToHex: function(g){
                for (var i = [], h = 0; h < g.length; h++) {
                    i.push((g[h] >>> 4).toString(16));
                    i.push((g[h] & 15).toString(16))
                }
                return i.join("")
            },
            hexToBytes: function(g){
                for (var i = [], h = 0; h < g.length; h += 2) 
                    i.push(parseInt(g.substr(h, 2), 16));
                return i
            },
            bytesToBase64: function(g){
                if (typeof btoa == "function") 
                    return btoa(p.bytesToString(g));
                for (var i = [], h = 0; h < g.length; h += 3) 
                    for (var a = g[h] << 16 |
                    g[h + 1] <<
                    8 |
                    g[h + 2], b = 0; b < 4; b++) 
                        h * 8 + b * 6 <= g.length * 8 ? i.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a >>> 6 * (3 - b) & 63)) : i.push("=");
                return i.join("")
            },
            base64ToBytes: function(g){
                if (typeof atob == "function") 
                    return p.stringToBytes(atob(g));
                g = g.replace(/[^A-Z0-9+\/]/ig, "");
                for (var i = [], h = 0, a = 0; h < g.length; a = ++h % 4) 
                    a != 0 &&
                    i.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(g.charAt(h - 1)) & Math.pow(2, -2 * a + 8) - 1) << a * 2 |
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(g.charAt(h)) >>>
                    6 - a * 2);
                return i
            }
        };
        n.mode = {};
        n = n.charenc = {};
        n.UTF8 = {
            stringToBytes: function(g){
                return p.stringToBytes(unescape(encodeURIComponent(g)))
            },
            bytesToString: function(g){
                return decodeURIComponent(escape(p.bytesToString(g)))
            }
        };
        var p = n.Binary = {
            stringToBytes: function(g){
                for (var i = [], h = 0; h < g.length; h++) 
                    i.push(g.charCodeAt(h) & 255);
                return i
            },
            bytesToString: function(g){
                for (var i = [], h = 0; h < g.length; h++) 
                    i.push(String.fromCharCode(g[h]));
                return i.join("")
            }
        }
    })();
(function(){
    var n = Crypto, o = n.util, p = n.charenc, g = p.UTF8, i = p.Binary, h = n.MD5 = function(a, b){
        var j = o.wordsToBytes(h._md5(a));
        return b && b.asBytes ? j : b && b.asString ? i.bytesToString(j) : o.bytesToHex(j)
    };
    h._md5 = function(a){
        if (a.constructor == String) 
            a = g.stringToBytes(a);
        var b = o.bytesToWords(a), j = a.length * 8;
        a = 1732584193;
        for (var d = -271733879, e = -1732584194, c = 271733878, f = 0; f < b.length; f++) 
            b[f] = (b[f] << 8 | b[f] >>> 24) & 16711935 | (b[f] << 24 | b[f] >>> 8) & 4278255360;
        b[j >>> 5] |= 128 << j % 32;
        b[(j + 64 >>> 9 << 4) + 14] = j;
        j = h._ff;
        var k = h._gg, l = h._hh, m = h._ii;
        for (f = 0; f < b.length; f += 16) {
            var q = a, r = d, s = e, t = c;
            a = j(a, d, e, c, b[f + 0], 7, -680876936);
            c = j(c, a, d, e, b[f + 1], 12, -389564586);
            e = j(e, c, a, d, b[f + 2], 17, 606105819);
            d = j(d, e, c, a, b[f + 3], 22, -1044525330);
            a = j(a, d, e, c, b[f + 4], 7, -176418897);
            c = j(c, a, d, e, b[f + 5], 12, 1200080426);
            e = j(e, c, a, d, b[f + 6], 17, -1473231341);
            d = j(d, e, c, a, b[f + 7], 22, -45705983);
            a = j(a, d, e, c, b[f + 8], 7, 1770035416);
            c = j(c, a, d, e, b[f + 9], 12, -1958414417);
            e = j(e, c, a, d, b[f + 10], 17, -42063);
            d = j(d, e, c, a, b[f + 11], 22, -1990404162);
            a = j(a, d, e, c, b[f + 12], 7, 1804603682);
            c = j(c, a, d, e, b[f + 13], 12, -40341101);
            e = j(e, c, a, d, b[f + 14], 17, -1502002290);
            d = j(d, e, c, a, b[f + 15], 22, 1236535329);
            a = k(a, d, e, c, b[f + 1], 5, -165796510);
            c = k(c, a, d, e, b[f + 6], 9, -1069501632);
            e = k(e, c, a, d, b[f + 11], 14, 643717713);
            d = k(d, e, c, a, b[f + 0], 20, -373897302);
            a = k(a, d, e, c, b[f + 5], 5, -701558691);
            c = k(c, a, d, e, b[f + 10], 9, 38016083);
            e = k(e, c, a, d, b[f + 15], 14, -660478335);
            d = k(d, e, c, a, b[f + 4], 20, -405537848);
            a = k(a, d, e, c, b[f + 9], 5, 568446438);
            c = k(c, a, d, e, b[f + 14], 9, -1019803690);
            e = k(e, c, a, d, b[f + 3], 14, -187363961);
            d = k(d, e, c, a, b[f + 8], 20, 1163531501);
            a = k(a, d, e, c, b[f + 13], 5, -1444681467);
            c = k(c, a, d, e, b[f + 2], 9, -51403784);
            e = k(e, c, a, d, b[f + 7], 14, 1735328473);
            d = k(d, e, c, a, b[f + 12], 20, -1926607734);
            a = l(a, d, e, c, b[f + 5], 4, -378558);
            c = l(c, a, d, e, b[f + 8], 11, -2022574463);
            e = l(e, c, a, d, b[f + 11], 16, 1839030562);
            d = l(d, e, c, a, b[f + 14], 23, -35309556);
            a = l(a, d, e, c, b[f + 1], 4, -1530992060);
            c = l(c, a, d, e, b[f + 4], 11, 1272893353);
            e = l(e, c, a, d, b[f + 7], 16, -155497632);
            d = l(d, e, c, a, b[f + 10], 23, -1094730640);
            a = l(a, d, e, c, b[f + 13], 4, 681279174);
            c = l(c, a, d, e, b[f + 0], 11, -358537222);
            e = l(e, c, a, d, b[f + 3], 16, -722521979);
            d = l(d, e, c, a, b[f + 6], 23, 76029189);
            a = l(a, d, e, c, b[f + 9], 4, -640364487);
            c = l(c, a, d, e, b[f + 12], 11, -421815835);
            e = l(e, c, a, d, b[f + 15], 16, 530742520);
            d = l(d, e, c, a, b[f + 2], 23, -995338651);
            a = m(a, d, e, c, b[f + 0], 6, -198630844);
            c = m(c, a, d, e, b[f + 7], 10, 1126891415);
            e = m(e, c, a, d, b[f + 14], 15, -1416354905);
            d = m(d, e, c, a, b[f + 5], 21, -57434055);
            a = m(a, d, e, c, b[f + 12], 6, 1700485571);
            c = m(c, a, d, e, b[f + 3], 10, -1894986606);
            e = m(e, c, a, d, b[f + 10], 15, -1051523);
            d = m(d, e, c, a, b[f + 1], 21, -2054922799);
            a = m(a, d, e, c, b[f + 8], 6, 1873313359);
            c = m(c, a, d, e, b[f + 15], 10, -30611744);
            e = m(e, c, a, d, b[f + 6], 15, -1560198380);
            d = m(d, e, c, a, b[f + 13], 21, 1309151649);
            a = m(a, d, e, c, b[f + 4], 6, -145523070);
            c = m(c, a, d, e, b[f + 11], 10, -1120210379);
            e = m(e, c, a, d, b[f + 2], 15, 718787259);
            d = m(d, e, c, a, b[f + 9], 21, -343485551);
            a = a + q >>> 0;
            d = d + r >>> 0;
            e = e + s >>> 0;
            c = c + t >>> 0
        }
        return o.endian([a, d, e, c])
    };
    h._ff = function(a, b, j, d, e, c, f){
        a = a + (b & j | ~ b & d) + (e >>> 0) + f;
        return (a << c | a >>> 32 - c) + b
    };
    h._gg = function(a, b, j, d, e, c, f){
        a = a + (b & d | j & ~ d) + (e >>> 0) + f;
        return (a << c | a >>> 32 - c) + b
    };
    h._hh = function(a, b, j, d, e, c, f){
        a = a + (b ^ j ^ d) + (e >>> 0) + f;
        return (a << c |
        a >>>
        32 - c) +
        b
    };
    h._ii = function(a, b, j, d, e, c, f){
        a = a + (j ^ (b | ~ d)) + (e >>> 0) + f;
        return (a << c | a >>> 32 - c) + b
    };
    h._blocksize = 16;
    h._digestsize = 16
})();

function banEventListener(event){
	var sid = event.data;
    var channel = eval('(' + songlist[sid] + ')').channel;
	var type = songStatusType.BAN;
	changeSongStatus(sid, type, channel);
}

//
function likeEventListener(event){
    var sid = event.data;
    var channel = eval('(' + songlist[sid] + ')').channel;
	var type = '';
    if ($('.songinfo[sid="' + sid + '"] .likeBtn').first().attr('like') == 'like') {
        type = songStatusType.UNLIKE;
    }
    else {
		type = songStatusType.LIKE;
    }
	changeSongStatus(sid, type, channel);
}

//歌曲状态变化
function changeSongStatus(sid, type, channel){
    var url = 'http://douban.fm/j/mine/playlist?type=' + type;
    url += '&sid=' + sid;
    url += '&h=';
    for (var i = 0, l = songarray.length; i < l; ++i) {
        if (sid == songarray[i].sid) {
            break;
        }
        else {
            url += '|' + songarray[i].sid + ':p';
        }
    }
    url += '|' + sid + ':' + type;
    url += '&channel=' + channel;
    url += '&r='+Crypto.MD5(url+'fr0d0', {
        asStrings: true
    }).substr(-10);
	
    $.ajax({
        url: url,
        context: {sid:sid,type:type},
        success: function(){
            var sid = this.sid;
			var type = this.type;
			
			if(type == songStatusType.LIKE){
				$('.songinfo[sid="' + sid + '"] .likeBtn').first().attr('like','like').attr('title','取消喜欢');
				$('.songinfo[sid="' + sid + '"] .likeBtn img').first().attr('src',$('#likedImage').attr('src'));
				return ;
			}
			
			if(type == songStatusType.UNLIKE){
				$('.songinfo[sid="' + sid + '"] .likeBtn').first().attr('like','').attr('title','喜欢');
				$('.songinfo[sid="' + sid + '"] .likeBtn img').first().attr('src',$('#likeImage').attr('src'));
				return ;
			}
			
			if(type == songStatusType.BAN){
				$('.songinfo[sid="' + sid + '"]').first().remove();
				delete songlist[sid];
				var idx = -1;
				for(var i=0,l=songarray.length;i<l;++i){
					if(songarray[i].sid == sid){
						idx = i;
						break;
					}
				}
				
				if(idx != -1){
					if(currentSongIndex == idx && !$('#hackedPlayer audio')[0].paused){
						if(songarray.length == 1){
							hackerPlayer.pause();
						}
						else{
							hackerPlayer.next();
						}
					}
					songarray.splice(idx,1);
				}
				return ;
			}
        }
    });
}

//$('#hacker').hide();
$('#hackedPlaylist').append('<ul class="songinfos" id="songinfos"></ul>');
window.songlist = Object();
window.songarray = Array();
window.currentSongIndex = 0;
window.currentSong = null;
hackerPlayer.init();

window.songStatusType = {
	LIKE:'r',
	UNLIKE:'u',
	BAN:'b'
};

$('#hackedPanel').toggle(function(){
	if(typeof($('#hackedPlaylist').attr('originalHeight')) == 'undefined'){
		$('#hackedPlaylist').attr('originalHeight',$('#hackedPlaylist').height());
	}
	$('#hackedPlaylist').animate({
            height: 0
        },'slow');
	$('#hackedPanel span').first().html('展开');
},function(){
	$('#hackedPlaylist').animate({
            height: $('#hackedPlaylist').attr('originalHeight')
        },'slow');
	$('#hackedPanel span').first().html('收起');
});

$('body').append('<div>playList.js</div>');
window.extStatusHandlerBak = window.extStatusHandler;
window.extStatusHandler = function(o){
    extStatusHandlerBak(o);
    hackPlaylist(o);
};
