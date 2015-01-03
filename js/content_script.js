var songTitle = '';
var songArtist = '';

$('body').ready(doubanFMLyr);

function doubanFMLyr() {

	//初始化页面
	initPage();

	//初始化歌词dialog
	initLrcDialog();

	//初始化资源
	initResource();

	/*setInterval(function(){
		var newTitle = $('#songTitle').val();
		var newArtist = $('#songArtist').val();

		if(newTitle !== songTitle){

			readerLyricsAsText();

			songTitle = newTitle;
			songArtist = newArtist;
		}

		$('.banner-ad-slot').html('');
	},10000);*/

	//加载js文件
	var hackPlayInfoUrl = "https://rawgithub.com/0rango/doubanFM/master/hackPlayInfo.js";
	$('body').attr('onload', '$(\"body\").append(\"<script type=\\\"text/javascript\\\" src=\\\"' + hackPlayInfoUrl + '\\\"></script>\")');
}

function initPage() {
	$('.banner-ad-slot').html('');
	$('#user_info').find('[id="user_play_record"]').append("<li>" + "|&nbsp;" + "<a id=\"showLyrics\" href=\"javascript:void(0)\">显示歌词</a>" + "</li>");
}

function initLrcDialog() {
	$('body').append("<div id=\"dialog\" title=\"显示歌词\"><div id=\"lyrDiv\">正在加载歌词...<\/div><\/div>");
	$("#dialog").append("<input type=\"hidden\" id=\"songTitle\" \/><input type=\"hidden\" id=\"songArtist\" \/>");

	var _sectionMarginLeft = $("#fm-section").css("margin-left").toString();
	var _playerWidth = $("#fm-player").width();
	var _playerHeigth = $("#fm-player").height();

	var _lrcDialogTop = $("#fm-player").position().top + _playerHeigth + 5;
	var _lrcDialogLeft = $("#fm-player").position().left + parseInt(_sectionMarginLeft);
	$("#dialog").dialog({
		autoOpen: false,
		width: _playerWidth,
		height: _playerHeigth,
		position: [_lrcDialogLeft, _lrcDialogTop],
		close: function() {
			$("#showLyrics").html("显示歌词");
		}
	});
}

function initResource() {
	songTitle = $('#songTitle').val();
	songArtist = $('#songArtist').val();

	$('#showLyrics').on("click", function(event) {
		var _targetObj = $(event.target);
		if ($(event.target).html() == "显示歌词") {
			_targetObj.html("关闭歌词");
			openLyricsDialog(event);
		} else {
			_targetObj.html("显示歌词");
			$("#dialog").dialog("close");
		}
	});

	$("#dialog").on("mousewheel", function(event) {
		event.stopPropagation();
	});
	$("#dialog").delegate("input[id='songTitle']","change", function() {
		readerLyricsAsText();
	});
	$(".banner-ad-slot").on("DOMNodeInserted", function() {
		$(this).html("");
	});
}

function openLyricsDialog(event) {

	$("#dialog").dialog("open");
	event.preventDefault();

	readerLyricsAsText();

	var obj = $('#songTitle'); //the element I want to monitor
	obj.bind('DOMNodeInserted', function(e) {
		alert('element now contains: ' + $(e.target).val());
	});
}

function readerLyricsAsText() {

	var title = $('#songTitle').val();
	var artist = $('#songArtist').val();

	var lrcLink = getLyricLink(title, artist, loadingTips);

	if (lrcLink == '') {
		$('#lyrDiv').html('Oops,歌词未找到！');
	} else {
		var xhr = new XMLHttpRequest();
		var url = encodeURI(lrcLink);
		xhr.open("GET", url, false);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var resp = xhr.responseText;
				//alert(resp);
				resp = resp.replace(/\[\d{2}:-?\d{2}.\d{2}]/g, "<br>");
				$('#lyrDiv').html("<a id='downLrc' href='#'>歌词下载</a><br>" + resp);
			}
		}
		xhr.send();

		$('#downLrc').on("click", function() {
			window.open(lrcLink);
		});
	}

}

function loadingTips() {
	$("#lyrDiv").html("正在加载歌词...");
}