$('body').ready(function(){
	if(typeof($('#songTitle') == 'undefined'){
		$('body').append("<input type=\"text\" id=\"songTitle\" \/>");
		$('body').append("<input type=\"text\" id=\"songArtist\" \/>");
	}
});
window.extStatusHandler = function(o){
  hackPlayInfo(o);
}

function hackPlayInfo(_o){
  alert(_o);
  var o = eval('('+_o+')');
  
  if(o.type == 'start'){
    var s = o.song;
    alert(s.artist+s.title);
    $('#songTitle').val(s.title);
    $('#songArtist').val(s.artist);
    //getSongInfoJson(s.title,s.artist);
  }
}
