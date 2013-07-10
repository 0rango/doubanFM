window.extStatusHandler = function(o){
  hackPlayInfo(o);
}

function hackPlayInfo(_o){
  alert(_o);
  var o = eval('('+_o+')');
  alert(o.artist+a.title);
}
