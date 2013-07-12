// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
$(document).ready(function(){
$('body').append('<div>adsfd</div>');

var ex = Window.extStatusHandler;
$('body').append('<div>1</div>');
Window.extStatusHandler = function(info){
$('body').append('<div>2</div>');
	var song, albuminfo, o = info;
	log(o);
	o = JSON.parse(o);
	$('body').append('<div>3</div>');
	song = o.song || {};
	$('body').append('<div>1</div>');
}
$('body').append('<div>4</div>');
$('#user_info').append("<li><span>|<a href=\"http://www.google.com.hk\">显示歌词</a></span></li>");
$(".user-record").after("<li><span>|<a href=\"http://www.google.com.hk\">显示歌词</a></span></li>");
$("#fm-banner-ads").empty();
$("#fm-section3").css({"position":"fixed","padding-left":"100px"});
$("#fm-clients").css("padding-left","200px");
//$("#aw0").hide();
//$(".wrapper").css("display","none");
})
