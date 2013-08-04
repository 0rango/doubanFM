var songTitle = '';
var songArtist = '';

function initPage(){
  $('#fm-section3 ft-ads-slot').html('');
	$('#user_info').find('[id="user_play_record"]').append("<li>"+"|	"+"<a id=\"showLyrics\" href=\"#\">显示歌词</a>"+"</li>");
}
$('body').ready(doubanFMLyr);

function doubanFMLyr(){
	//加载js文件
	var hackPlayInfoUrl = "https://raw.github.com/0rango/doubanFM/master/hackPlayInfo.js";
	
	$('body').attr('onload','$(\"body\").append(\"<script type=\\\"text/javascript\\\" src=\\\"'+hackPlayInfoUrl+'\\\"></script>\")');

	//初始化页面
	initPage();

	//初始化歌词dialog
	initLrcDialog();

	//初始化资源
	initResource();

	setInterval(function(){
		var newTitle = $('#songTitle').val();
		var newArtist = $('#songArtist').val();

		//alert(newTitle+newArtist);
		if(newTitle !== songTitle){
			readerLyricsAsText();

			songTitle = newTitle;
			songArtist = newArtist;
		}
	},1000t0);
}
function initLrcDialog(){
	$('body').append("<div id=\"dialog\" title=\"显示歌词\"><div id=\"lyrDiv\">正在加载歌词...<\/div><\/div>");

	$( "#dialog" ).dialog({
		autoOpen: false,
		width: 510,
		height: 240,
		modual: true,
		position: [577,339],
	});
}
function initResource(){
	songTitle = $('#songTitle').val();
	songArtist = $('#songArtist').val();

	$('#showLyrics').click(function(event){
		/*var title = $('#songTitle').val();
		var artist = $('#songArtist').val();

		getSongInfoJson(title,artist);*/
		openLyricsDialog(event);
	});
}
function openLyricsDialog(event){

	$( "#dialog" ).dialog( "open" );
	event.preventDefault();

	readerLyricsAsText();

	var obj = $('#songTitle');//the element I want to monitor
	obj.bind('DOMNodeInserted', function(e) {
	    alert('element now contains: ' + $(e.target).val());
	});
}
function readerLyricsAsText(){
	var title = $('#songTitle').val();
	var artist = $('#songArtist').val();

	var lrcLink = getLyricLink(title,artist);
	//alert(lrcLink);

	if(lrcLink == ''){
		$('#lyrDiv').html('歌词未找到！');
	}else{
		var xhr = new XMLHttpRequest();
		var url = encodeURI(lrcLink);
		xhr.open("GET", url, false);
		xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
			  	var resp = xhr.responseText;
			  	//alert(resp);
			  	resp = resp.replace(/\[\d{2}:-?\d{2}.\d{2}]/g, "<br>");
			  	$('#lyrDiv').html("<a id='downLrc' href='#'>歌词下载</a><br>"+resp);
			  }
			}
			xhr.send();
		
		$('#downLrc').click(function(){
			window.open(lrcLink);
		});
	}
	/*var fso = new ActiveXObject("Scripting.FileSystemObject");

	var file = fso.GetFile(lrcLink);

	var reader = new FileReader();

	reader.readAsText(file);

	reader.onerror = function(){
		$('#lyrDiv').html("Could not read file, error code is "+reader.error.code);
	}

	reader.onload = function(){
		$('lyrDiv').html(reader.result);
	}*/

}
function getLyricLink(title,artist){
	var songJson = getSongInfoJson(title,artist);
	//alert(songJson);
	var _json = JSON.parse(songJson);
	return _json[0].fileslist[0].lrcLink;

}
