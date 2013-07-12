function initPage(){
	$('#fm-section3 #ft-ads-slot').remove();
	$('#user_info').find('[id="user_play_record"]').append("<li>"+"|	"+"<a id=\"showLyrics\" href=\"#\">显示歌词</a>"+"</li>");
}

$('body').ready(doubanFMLyr);

function doubanFMLyr(){
	//加载js文件
	var hackPlayInfoUrl = "https://raw.github.com/0rango/doubanFM/master/hackPlayInfo.js";
	
	$('body').attr('onload','$(\"body\").append(\"<script type=\\\"text/javascript\\\" src=\\\"'+hackPlayInfoUrl+'\\\"></script>\")');

	//初始化页面
	initPage();

	//初始化资源
	initResource();
}
function initResource(){
	$('#showLyrics').click(function(event){
		/*var title = $('#songTitle').val();
		var artist = $('#songArtist').val();

		getSongInfoJson(title,artist);*/
		openLyricsDialog(event);
	});
}
function openLyricsDialog(event){
	

	$('body').append("<div id=\"dialog\" title=\"显示歌词\"><div id=\"lyrDiv\">歌词<\/div><\/div>");

	$( "#dialog" ).dialog({
		autoOpen: false,
		width: 400,
		height: 300,
		modual: true,
	});

	$( "#dialog" ).dialog( "open" );
	event.preventDefault();

	readerLyricsAsText();
}
function readerLyricsAsText(){
	var title = $('#songTitle').val();
	var artist = $('#songArtist').val();

	var lrcLink = getLyricLink(title,artist);
	//alert(lrcLink);

	var xhr = new XMLHttpRequest();
	var url = encodeURI(lrcLink);
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		  	var resp = xhr.responseText;
		  	alert(resp);
		  	resp = resp.replace(/\[\d{2}:\d{2}.\d{2}]/g, "<br>");
		  	$('#lyrDiv').html(resp);
		  }
		}
		xhr.send();

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
	var _json = JSON.parse(songJson);
	return _json[0].fileslist[0].lrcLink;

}
