function getSongInfoJson(title,artist,callWait){
	var songInfoJson = {"lrcLink":"","songLink":""} ;
	var songId = getSongId(title,artist);
	var resp = '';
	var xhr = new XMLHttpRequest();
	var url = encodeURI("http://music.baidu.com/song/"+songId);
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		  	resp = xhr.responseText;
			var _lyricAHtml = resp.match("<a.*class=.*down-lrc-btn.*data-lyricdata=.*>.*</a>");
			if(typeof(_lyricAHtml) != 'undefined' && _lyricAHtml != null){
				var _lyricHref = _lyricAHtml.toString().match(":\".*\.lrc\"");
				songInfoJson.lrcLink = "http://music.baidu.com" + _lyricHref.toString().substring(2,_lyricHref.toString().length-1);
			}
			
		  }else {
		  	if(typeof(callWait) == 'function'){
				callWait();
			}
		  }
		}
		xhr.send();

	return songInfoJson;
}
function getSongId(title,artist,callWait){
	//alert("getSongId");
	var songId;
	var xhr = new XMLHttpRequest();
	var url = encodeURI("http://qianqianmini.baidu.com/app/search/searchList.php?qword="+title+" "+artist);
	//xhr.open("GET", "http://qianqianmini.baidu.com/app/search/searchList.php?qword=%E8%90%BD%E8%8A%B1%E6%B5%81%E6%B0%B4%20%E9%99%88%E5%A5%95%E8%BF%85", false);
	xhr.open("GET",url,false);
	xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			var resp = xhr.responseText;
			//alert(resp.match("<input id=\"\\d{2,10}\" type=\'checkbox\'  class=\'sCheckBox\' \/>"));
			var divElem = document.createElement('div');
			divElem.id = "searchList";
			document.body.appendChild(divElem);
			$("#searchList").html(resp.match("<input id=\"\\d{2,10}\" type=\'checkbox\'  class=\'sCheckBox\' \/>"));
			$("#searchList").find(":checkbox.sCheckBox").each(function(item,value){
				songId = $(value).attr("id");
			});
		  }else{
			if(typeof(callWait) == 'function'){
				callWait();
			}
		}
	}
	xhr.send();

	return songId;
}
function getLyricLink(title,artist,callWait){
	var songJson = getSongInfoJson(title,artist,callWait);
	return songJson.lrcLink;
}