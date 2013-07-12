window.extStatusHandler = function(o){
  hackPlayInfo(o);
}

function hackPlayInfo(_o){
  alert(_o);
  var o = eval('('+_o+')');
  
  if(o.type == 'start'){
    var s = o.song;
    alert(s.artist+s.title);
    getSongInfoJson(s.title,s.artist);
  }
}
function getSongInfoJson(title,artist){
	alert("getSongInfoJson");
	var songId = getSongId(title,artist);
	alert(songId);
	var xhr = new XMLHttpRequest();
	var url = encodeURI("http://qianqianmini.baidu.com/app/link/getLinks.php?songId="+songId+"&songArtist="+artist+"&songTitle="+title+"&linkType=0&isLogin=0&clientVer=7.0.2");
	alert(url);
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		  	alert(xhr.responseText);
			var resp = JSON.parse(xhr.responseText);
			//alert(resp[0].fileslist[0].lrcLink);
			window.open(resp[0].fileslist[0].lrcLink);
		  }
		}
		xhr.send();
}
function getSongId(title,artist){
	alert("getSongId");
	var songId;
	var xhr = new XMLHttpRequest();
	var url = encodeURI("http://qianqianmini.baidu.com/app/search/searchList.php?qword="+title+" "+artist);
	alert(url);
	//xhr.open("GET", "http://qianqianmini.baidu.com/app/search/searchList.php?qword=%E8%90%BD%E8%8A%B1%E6%B5%81%E6%B0%B4%20%E9%99%88%E5%A5%95%E8%BF%85", false);
	xhr.open("GET",url,false);
	xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			//var resp = JSON.parse(xhr.responseText);
			alert(xhr.responseText);
			/*var iframe = document.createElement('iframe');
			iframe.id = "songInfoIframe";
			iframe.name = "songInfoIframe";
			document.body.appendChild(iframe);
			var iframeDOM = window.frames["songInfoIframe"].document;
			iframeDOM.body.innerHTML = xhr.responseText;
			$(iframeDOM).find(":checkbox.sCheckBox").each(function(item,value){
				iframeDOM.body.innerHTML($(value).attr("id"));
			});*/
			var resp = xhr.responseText;
			//alert(resp.match("<input id=\"\\d{2,10}\" type=\'checkbox\'  class=\'sCheckBox\' \/>"));
			var divElem = document.createElement('div');
			divElem.id = "searchList";
			document.body.appendChild(divElem);
			$("#searchList").html(resp.match("<input id=\"\\d{2,10}\" type=\'checkbox\'  class=\'sCheckBox\' \/>"));
			$("#searchList").find(":checkbox.sCheckBox").each(function(item,value){
				songId = $(value).attr("id");
			});
		  }
		}
		xhr.send();

	alert(songId);
	return songId;
}
