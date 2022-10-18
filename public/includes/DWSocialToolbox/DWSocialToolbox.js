/* Polyfill for browsers that don't support Object.create and Object.keys */
if(typeof Object.create != 'function') {
  Object.create = (function() {
	var Temp = function() {};
	return function (prototype) {
	  if (arguments.length > 1) {
		throw Error('Second argument not supported');
	  }
	  if (typeof prototype != 'object') {
		throw TypeError('Argument must be an object');
	  }
	  Temp.prototype = prototype;
	  var result = new Temp();
	  Temp.prototype = null;
	  return result;
	};
  })();
}
if(typeof Object.keys != 'function') { 
	Object.keys = function(o,k,r){r=[];for(k in o)r.hasOwnProperty.call(o,k)&&r.push(k);return r};
}
if (!String.prototype.trim) {
  (function() {
	// Make sure we trim BOM and NBSP
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	String.prototype.trim = function() {
	  return this.replace(rtrim, '');
	};
  })();
}

socialtoolbox_jQuery.fn.DWSocialToolbox = function() {
	if (!window[socialtoolbox_jQuery(this).attr('id')].init) {
		window[socialtoolbox_jQuery(this).attr('id')] = Object.create(socialToolboxModule);
	}
	window[socialtoolbox_jQuery(this).attr('id')].init(socialtoolbox_jQuery(this));
};
socialtoolbox_jQuery.fn.destroyDWSocialToolbox = function() {
	if (!window[socialtoolbox_jQuery(this).attr('id')].destroy) {
		window[socialtoolbox_jQuery(this).attr('id')] = Object.create(socialToolboxModule);
	}
	window[socialtoolbox_jQuery(this).attr('id')].destroy();
};
socialtoolbox_jQuery.fn.isAuto = function(){
	var originalHeight = this.height();
	this.append('<div id="test"></div>');
	var testHeight = originalHeight+500;
	$('#test').css({height: testHeight});
	var newTestHeight = $('#test').height();
	var newHeight = this.height();
	$('#test').remove();
	if(newHeight>originalHeight){
		return true;    
	}
	else{
		return false;
	}
};

var socialToolboxModule = (function($) {
	var options;
	var name;
	
	function init(elem) { 
		name = elem.attr('id');
		var xtdcode = '4b8e95204c';
		
		if (window.project && window.project.mediaQueryOrder) {
			options = $.extend({}, window.project.jsData);
		} else {
			options = $.extend({}, window[name+'_json']);
			if(options.xtdCode=="#xtd_code#" || xtdcode != options.xtdCode) {
				 makeTopVisible();
			}
		}
		
		if (is_touch_device()) {
			options.tab_action = 'tap';
		} else {
			options.tab_action = 'click';
		}
		
		if (elem.hasClass('fbWidget') || elem.hasClass('twWidget') || elem.hasClass('inWidget') || elem.hasClass('gpWidget') || elem.hasClass('piWidget')) {
			options.isWidget = true;
		}
		
		if (elem.hasClass('twTweet') || elem.hasClass('twVideo')) {
			options.url = options.url.split("/");
			options.url = options.url[options.url.length-1];
			options.url = options.url.split('?')[0];
			options.isWidget = true;
		}
		
		if (elem.hasClass('twTweet')) {
			twttr.widgets.createTweet(''+options.url, elem.get(0),{
				lang : ""+options.language,
				cards : ""+options.cards,
				conversation : ""+options.conversation,
				dnt : options.dnt,
				theme : ""+options.theme,
				linkColor : ""+options.linkColor,
				width : options.width,
				align : ""+options.align
			});
		}
		
		if (elem.hasClass('inWidget')) {
			var urlToRequest = "http://api.instagram.com/oembed?url="+options.url+"&omitscript=true&hidecaption="+options.hidecaption.toString();
			if (options.maxwidth && options.maxwidth!='' && parseInt(options.maxwidth)>320) {
				urlToRequest += "&maxwidth="+options.maxwidth;
			}
			$.ajax({
				type: "GET",
				url: urlToRequest,
				dataType: "jsonp",
				success: function(jsonText) {
					elem.html(jsonText.html);
					elem.addClass('inited');
					if (!$('.inWidget').not('.inited').length)
						instgrm.Embeds.process();
				}
			})
			options.isWidget = true;
		}
		
		if (elem.hasClass('twVideo')) {
			twttr.widgets.createVideo(''+options.url, elem.get(0),{
				lang : ""+options.language,
				status : ""+options.status
			});
		}
		
		if (!options.isWidget) {
			doNonWidget();
			$(window).unbind('resize.runtime orientationchange.runtime').bind('resize.runtime orientationchange.runtime', function() {
                doNonWidget();
            });
		}
		
		if (!options.isWidget && is_touch_device()) {
			var alignWrapper = elem.find('.DWSocialToolbox_alignWrapper');
			alignWrapper.touchwipe({
				wipeDown: function (dy) {
					if (!alignWrapper.data('prevTop')) {
						alignWrapper.data('prevTop', 0);
					}
					var newTop = parseInt(alignWrapper.css('top')) + alignWrapper.data('prevTop') - dy;
					if (newTop>0) {
						newTop = 0;
					}
					if (newTop < elem.height() - alignWrapper.height()) {
						newTop = elem.height() - alignWrapper.height();
					}
					alignWrapper.css('top', newTop+"px");
					alignWrapper.data('prevTop', dy);
				},
				wipeUp: function (dy) {
					if (!alignWrapper.data('prevTop')) {
						alignWrapper.data('prevTop', 0);
					}
					var newTop = parseInt(alignWrapper.css('top')) + alignWrapper.data('prevTop') - dy;
					if (newTop>0) {
						newTop = 0;
					}
					if (newTop < elem.height() - alignWrapper.height()) {
						newTop = elem.height() - alignWrapper.height()
					}
					alignWrapper.css('top', newTop+"px");
					alignWrapper.data('prevTop', dy);
				},
				preventDefaultEvents: true
			});
			alignWrapper.on("touchend", function() {
				alignWrapper.data('prevTop', 0);
			});
		}
	}
	
	function doNonWidget() {
		var elem = $("#"+name);
		elem.removeClass('shown');
		elem.find('.DWSocialToolbox_handler').remove();
		elem.css('max-height','');
		if (options.type=='layout') {
			elem.removeClass('floating');
		} else {
			elem.addClass('floating');
			elem.append('<div class="DWSocialToolbox_handler"></div>');
			elem.find(".DWSocialToolbox_handler").unbind(options.tab_action).bind(options.tab_action, function() {
				elem.toggleClass('shown');
				$(this).toggleClass('shown');
			});
			switch (options.openCloseVertical) {
				case "top":
					elem.find(".DWSocialToolbox_handler").css({
						"top":"0",
						"bottom":"auto"
					});
					break;
				case "middle":
					elem.find(".DWSocialToolbox_handler").css({
						"top":parseInt($(elem).height()/2 - elem.find(".DWSocialToolbox_handler").height()/2)+"px",
						"bottom":"auto"
					});
					break;
				case "bottom":
					elem.find(".DWSocialToolbox_handler").css({
						"top":"auto",
						"bottom":"0"
					});
					break;
			}
			if (options.floatingCenter) {
				if (window.project && window.project.mediaQueryOrder) {
					var top = $('.wrapper').outerHeight(true)/2 - elem.height()/2;
				} else {
					var top = $(window).height()/2 - elem.height()/2;
				}
				if (top<0) {
					top=0;
				}
				elem.css('top',  top+"px");
			} else {
				elem.css('top', '');
			}
			elem.css('max-height', $(window).height());
			setTimeout(function() {
				elem.toggleClass('shown');
				elem.find(".DWSocialToolbox_handler").toggleClass('shown');
			}, 200);
		}
	}
	
	function is_touch_device() {  
		try {  
			document.createEvent("TouchEvent");  
			return true;  
		} catch (e) {  
			return false;  
		}  
	}

	function destroy() {
		var elem = $("#"+name);
		elem.find(".DWSocialToolbox_navLink").unbind('click');
		elem.find(".DWSocialToolbox_navLink").unbind('mouseenter mouseleave');
		$(window).unbind('resize');
	}
	
	function makeTopVisible() {
		 if (!socialtoolbox_jQuery('.social-toolbox-banner-trial').length) {
			 var newTop = $('<div />');
			 var bgColor = (Browser.IsIe() && Browser.Version() <= 9) ? "#EAA249" : "rgba(183, 207, 35, 0.82)";
			 newTop.css({
				'display' : 'inline-block',
				'max-height' : '300px',
				'width' : '100%',
				'background-color' : bgColor,
				'padding': '10px 0px',
				'position': 'fixed',
				'top': '0px',
				'left': '0px',
				'z-index':'2147483647'
			 });
			 var textholder = $('<div></div>').css({
				'text-align' : 'center',
				'font-size' : '16px',
				'width' : '100%',
				'float' : 'left',
				'position' : 'relative',
				'display' : 'block',
				'color' : '#fff',
				'vertical-align' : 'middle',
				'font-family' : 'Tahoma, sans-serif'
			}).html(Base64.decode("U29jaWFsIGl0ZW0gY3JlYXRlZCB1c2luZyBEVyBTb2NpYWwgVG9vbGJveCAtIGZyZWUgdHJpYWwgdmVyc2lvbi4gUmVhZCBtb3JlIDxhIGhyZWY9Imh0dHA6Ly93d3cuZXh0ZW5kc3R1ZGlvLmNvbS8iPmh0dHA6Ly93d3cuZXh0ZW5kc3R1ZGlvLmNvbS88L2E+"));
			 newTop.append(textholder);

			 var closeButton = $('<div></div>')
			 .css({
				"background-position" : "center center",
				"background-repeat" : "no-repeat",
				"background-image" : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJEQUNFM0Y2MjMxQTExRTQ5RjBFOTZDMTFGMTUzNERFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJEQUNFM0Y3MjMxQTExRTQ5RjBFOTZDMTFGMTUzNERFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkRBQ0UzRjQyMzFBMTFFNDlGMEU5NkMxMUYxNTM0REUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkRBQ0UzRjUyMzFBMTFFNDlGMEU5NkMxMUYxNTM0REUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ceTilAAAA6klEQVR42uyUMQqDQBRExxCx9ggW2uhxPIGNXsZaG60ULDyOnYVHsBZWEmbRBRNFhW0C2WaYv/D4O/+r4fs+dJ3noi8NLOMBjefHYFVVoWka2La9qdOzXtf1dZhpmgiCAEVRKCCVnnXeX4YlSYK+7+F5ngQ4jiOVnvU4jvfHuezZ12qwk7Is4boupmmCZVkSFEURxnHcZR3CeNhR27YSRGAYhhiG4f6esbM0TRWISv85lNPM1rDXjNjRmiGffgTchWVZpkDMiE+j0jPDPM+vw+Z5Rtd1m7Cp9KwLIe5N8/+hn/4cDR2wtwADAM7VaD9mmmFzAAAAAElFTkSuQmCC')",
				"width" : "19px",
				"height" : "20px",
				"display" : "block",
				"position" : "absolute",
				"right" : "20px",
				"cursor" : "pointer"
			 }).click(function() {
				newTop.hide();
			 });
			newTop.addClass('social-toolbox-banner-trial');
			newTop.append(closeButton);

			 socialtoolbox_jQuery('body').prepend(newTop);
		 }
	}

	var Browser = {
		IsIe: function () {
			return navigator.appVersion.indexOf("MSIE") != -1;
		},
		Navigator: navigator.appVersion,
		Version: function() {
			var version = 999; // we assume a sane browser
			if (navigator.appVersion.indexOf("MSIE") != -1)
				// bah, IE again, lets downgrade version number
				version = parseFloat(navigator.appVersion.split("MSIE")[1]);
			return version;
		}
	};
	
	var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

!function(e){function t(){var e=c();e!==r&&(r=e,l.trigger("orientationchange"))}function a(t,a,n,o){var i=n.type;n.type=a,e.event.dispatch.call(t,n,o),n.type=i}e.attrFn=e.attrFn||{};var n=navigator.userAgent.toLowerCase(),o=n.indexOf("chrome")>-1&&(n.indexOf("windows")>-1||n.indexOf("macintosh")>-1||n.indexOf("linux")>-1)&&n.indexOf("mobile")<0&&n.indexOf("android")<0,i={tap_pixel_range:5,swipe_h_threshold:50,swipe_v_threshold:50,taphold_threshold:750,doubletap_int:500,touch_capable:window.navigator.msPointerEnabled?!1:"ontouchstart"in window&&!o,orientation_support:"orientation"in window&&"onorientationchange"in window,startevent:window.navigator.msPointerEnabled?"MSPointerDown":"ontouchstart"in window&&!o?"touchstart":"mousedown",endevent:window.navigator.msPointerEnabled?"MSPointerUp":"ontouchstart"in window&&!o?"touchend":"mouseup",moveevent:window.navigator.msPointerEnabled?"MSPointerMove":"ontouchstart"in window&&!o?"touchmove":"mousemove",tapevent:"ontouchstart"in window&&!o?"tap":"click",scrollevent:"ontouchstart"in window&&!o?"touchmove":"scroll",hold_timer:null,tap_timer:null};e.isTouchCapable=function(){return i.touch_capable},e.getStartEvent=function(){return i.startevent},e.getEndEvent=function(){return i.endevent},e.getMoveEvent=function(){return i.moveevent},e.getTapEvent=function(){return i.tapevent},e.getScrollEvent=function(){return i.scrollevent},e.each(["tapstart","tapend","tapmove","tap","tap2","tap3","tap4","singletap","doubletap","taphold","swipe","swipeup","swiperight","swipedown","swipeleft","swipeend","scrollstart","scrollend","orientationchange"],function(t,a){e.fn[a]=function(e){return e?this.on(a,e):this.trigger(a)},e.attrFn[a]=!0}),e.event.special.tapstart={setup:function(){var t=this,n=e(t);n.on(i.startevent,function(e){if(n.data("callee",arguments.callee),e.which&&1!==e.which)return!1;var o=e.originalEvent,s={position:{x:i.touch_capable?o.touches[0].screenX:e.screenX,y:i.touch_capable?o.touches[0].screenY:e.screenY},offset:{x:i.touch_capable?o.touches[0].pageX-o.touches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?o.touches[0].pageY-o.touches[0].target.offsetTop:e.offsetY},time:Date.now(),target:e.target};return a(t,"tapstart",e,s),!0})},remove:function(){e(this).off(i.startevent,e(this).data.callee)}},e.event.special.tapmove={setup:function(){var t=this,n=e(t);n.on(i.moveevent,function(e){n.data("callee",arguments.callee);var o=e.originalEvent,s={position:{x:i.touch_capable?o.touches[0].screenX:e.screenX,y:i.touch_capable?o.touches[0].screenY:e.screenY},offset:{x:i.touch_capable?o.touches[0].pageX-o.touches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?o.touches[0].pageY-o.touches[0].target.offsetTop:e.offsetY},time:Date.now(),target:e.target};return a(t,"tapmove",e,s),!0})},remove:function(){e(this).off(i.moveevent,e(this).data.callee)}},e.event.special.tapend={setup:function(){var t=this,n=e(t);n.on(i.endevent,function(e){n.data("callee",arguments.callee);var o=e.originalEvent,s={position:{x:i.touch_capable?o.changedTouches[0].screenX:e.screenX,y:i.touch_capable?o.changedTouches[0].screenY:e.screenY},offset:{x:i.touch_capable?o.changedTouches[0].pageX-o.changedTouches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?o.changedTouches[0].pageY-o.changedTouches[0].target.offsetTop:e.offsetY},time:Date.now(),target:e.target};return a(t,"tapend",e,s),!0})},remove:function(){e(this).off(i.endevent,e(this).data.callee)}},e.event.special.taphold={setup:function(){var t,n=this,o=e(n),s={x:0,y:0},c=0,r=0;o.on(i.startevent,function(e){if(e.which&&1!==e.which)return!1;o.data("tapheld",!1),t=e.target;var h=e.originalEvent,u=Date.now(),l={x:i.touch_capable?h.touches[0].screenX:e.screenX,y:i.touch_capable?h.touches[0].screenY:e.screenY},p={x:i.touch_capable?h.touches[0].pageX-h.touches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?h.touches[0].pageY-h.touches[0].target.offsetTop:e.offsetY};return s.x=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageX:e.pageX,s.y=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageY:e.pageY,c=s.x,r=s.y,i.hold_timer=window.setTimeout(function(){var g=s.x-c,d=s.y-r;if(e.target==t&&(s.x==c&&s.y==r||g>=-i.tap_pixel_range&&g<=i.tap_pixel_range&&d>=-i.tap_pixel_range&&d<=i.tap_pixel_range)){o.data("tapheld",!0);var f=Date.now(),v={x:i.touch_capable?h.touches[0].screenX:e.screenX,y:i.touch_capable?h.touches[0].screenY:e.screenY},w={x:i.touch_capable?h.touches[0].pageX-h.touches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?h.touches[0].pageY-h.touches[0].target.offsetTop:e.offsetY};duration=f-u;var _={startTime:u,endTime:f,startPosition:l,startOffset:p,endPosition:v,endOffset:w,duration:duration,target:e.target};o.data("callee1",arguments.callee),a(n,"taphold",e,_)}},i.taphold_threshold),!0}).on(i.endevent,function(){o.data("callee2",arguments.callee),o.data("tapheld",!1),window.clearTimeout(i.hold_timer)}).on(i.moveevent,function(e){o.data("callee3",arguments.callee),c=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageX:e.pageX,r=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageY:e.pageY})},remove:function(){e(this).off(i.startevent,e(this).data.callee1).off(i.endevent,e(this).data.callee2).off(i.moveevent,e(this).data.callee3)}},e.event.special.doubletap={setup:function(){var t,n,o,s,c,r=this,h=e(r),u=!1;h.on(i.startevent,function(e){return e.which&&1!==e.which?!1:(h.data("doubletapped",!1),t=e.target,h.data("callee1",arguments.callee),s=e.originalEvent,o={position:{x:i.touch_capable?s.touches[0].screenX:e.screenX,y:i.touch_capable?s.touches[0].screenY:e.screenY},offset:{x:i.touch_capable?s.touches[0].pageX-s.touches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?s.touches[0].pageY-s.touches[0].target.offsetTop:e.offsetY},time:Date.now(),target:e.target},!0)}).on(i.endevent,function(e){var s=Date.now(),l=h.data("lastTouch")||s+1,p=s-l;if(window.clearTimeout(n),h.data("callee2",arguments.callee),p<i.doubletap_int&&e.target==t&&p>100){h.data("doubletapped",!0),window.clearTimeout(i.tap_timer);var g={position:{x:i.touch_capable?e.originalEvent.changedTouches[0].screenX:e.screenX,y:i.touch_capable?e.originalEvent.changedTouches[0].screenY:e.screenY},offset:{x:i.touch_capable?e.originalEvent.changedTouches[0].pageX-e.originalEvent.changedTouches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?e.originalEvent.changedTouches[0].pageY-e.originalEvent.changedTouches[0].target.offsetTop:e.offsetY},time:Date.now(),target:e.target},d={firstTap:o,secondTap:g,interval:g.time-o.time};u||a(r,"doubletap",e,d),u=!0,c=window.setTimeout(function(){u=!1},i.doubletap_int)}else h.data("lastTouch",s),n=window.setTimeout(function(){window.clearTimeout(n)},i.doubletap_int,[e]);h.data("lastTouch",s)})},remove:function(){e(this).off(i.startevent,e(this).data.callee1).off(i.endevent,e(this).data.callee2)}},e.event.special.singletap={setup:function(){var t=this,n=e(t),o=null,s=null,c={x:0,y:0};n.on(i.startevent,function(e){return e.which&&1!==e.which?!1:(s=Date.now(),o=e.target,n.data("callee1",arguments.callee),c.x=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageX:e.pageX,c.y=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageY:e.pageY,!0)}).on(i.endevent,function(e){n.data("callee2",arguments.callee),e.target==o&&(end_pos_x=e.originalEvent.changedTouches?e.originalEvent.changedTouches[0].pageX:e.pageX,end_pos_y=e.originalEvent.changedTouches?e.originalEvent.changedTouches[0].pageY:e.pageY,i.tap_timer=window.setTimeout(function(){if(!n.data("doubletapped")&&!n.data("tapheld")&&c.x==end_pos_x&&c.y==end_pos_y){var o=e.originalEvent,r={position:{x:i.touch_capable?o.changedTouches[0].screenX:e.screenX,y:i.touch_capable?o.changedTouches[0].screenY:e.screenY},offset:{x:i.touch_capable?o.changedTouches[0].pageX-o.changedTouches[0].target.offsetLeft:e.offsetX,y:i.touch_capable?o.changedTouches[0].pageY-o.changedTouches[0].target.offsetTop:e.offsetY},time:Date.now(),target:e.target};r.time-s<i.taphold_threshold&&a(t,"singletap",e,r)}},i.doubletap_int))})},remove:function(){e(this).off(i.startevent,e(this).data.callee1).off(i.endevent,e(this).data.callee2)}},e.event.special.tap={setup:function(){var t,n,o=this,s=e(o),c=!1,r=null,h={x:0,y:0};s.on(i.startevent,function(e){return s.data("callee1",arguments.callee),e.which&&1!==e.which?!1:(c=!0,h.x=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageX:e.pageX,h.y=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageY:e.pageY,t=Date.now(),r=e.target,n=e.originalEvent.targetTouches?e.originalEvent.targetTouches:[e],!0)}).on(i.endevent,function(e){s.data("callee2",arguments.callee);var u,l=e.originalEvent.targetTouches?e.originalEvent.changedTouches[0].pageX:e.pageX,p=e.originalEvent.targetTouches?e.originalEvent.changedTouches[0].pageY:e.pageY,g=h.x-l,d=h.y-p;if(r==e.target&&c&&Date.now()-t<i.taphold_threshold&&(h.x==l&&h.y==p||g>=-i.tap_pixel_range&&g<=i.tap_pixel_range&&d>=-i.tap_pixel_range&&d<=i.tap_pixel_range)){for(var f=e.originalEvent,v=[],w=0;w<n.length;w++){var _={position:{x:i.touch_capable?f.changedTouches[w].screenX:e.screenX,y:i.touch_capable?f.changedTouches[w].screenY:e.screenY},offset:{x:i.touch_capable?f.changedTouches[w].pageX-f.changedTouches[w].target.offsetLeft:e.offsetX,y:i.touch_capable?f.changedTouches[w].pageY-f.changedTouches[w].target.offsetTop:e.offsetY},time:Date.now(),target:e.target};v.push(_)}switch(n.length){case 1:u="tap";break;case 2:u="tap2";break;case 3:u="tap3";break;case 4:u="tap4"}a(o,u,e,v)}})},remove:function(){e(this).off(i.startevent,e(this).data.callee1).off(i.endevent,e(this).data.callee2)}},e.event.special.swipe={setup:function(){function t(t){c=e(t.currentTarget),c.data("callee1",arguments.callee),u.x=t.originalEvent.targetTouches?t.originalEvent.targetTouches[0].pageX:t.pageX,u.y=t.originalEvent.targetTouches?t.originalEvent.targetTouches[0].pageY:t.pageY,l.x=u.x,l.y=u.y,r=!0;var a=t.originalEvent;o={position:{x:i.touch_capable?a.touches[0].screenX:t.screenX,y:i.touch_capable?a.touches[0].screenY:t.screenY},offset:{x:i.touch_capable?a.touches[0].pageX-a.touches[0].target.offsetLeft:t.offsetX,y:i.touch_capable?a.touches[0].pageY-a.touches[0].target.offsetTop:t.offsetY},time:Date.now(),target:t.target}}function a(t){c=e(t.currentTarget),c.data("callee2",arguments.callee),l.x=t.originalEvent.targetTouches?t.originalEvent.targetTouches[0].pageX:t.pageX,l.y=t.originalEvent.targetTouches?t.originalEvent.targetTouches[0].pageY:t.pageY;var a,n=c.parent().data("xthreshold")?c.parent().data("xthreshold"):c.data("xthreshold"),s=c.parent().data("ythreshold")?c.parent().data("ythreshold"):c.data("ythreshold"),p="undefined"!=typeof n&&n!==!1&&parseInt(n)?parseInt(n):i.swipe_h_threshold,g="undefined"!=typeof s&&s!==!1&&parseInt(s)?parseInt(s):i.swipe_v_threshold;if(u.y>l.y&&u.y-l.y>g&&(a="swipeup"),u.x<l.x&&l.x-u.x>p&&(a="swiperight"),u.y<l.y&&l.y-u.y>g&&(a="swipedown"),u.x>l.x&&u.x-l.x>p&&(a="swipeleft"),void 0!=a&&r){u.x=0,u.y=0,l.x=0,l.y=0,r=!1;var d=t.originalEvent;endEvnt={position:{x:i.touch_capable?d.touches[0].screenX:t.screenX,y:i.touch_capable?d.touches[0].screenY:t.screenY},offset:{x:i.touch_capable?d.touches[0].pageX-d.touches[0].target.offsetLeft:t.offsetX,y:i.touch_capable?d.touches[0].pageY-d.touches[0].target.offsetTop:t.offsetY},time:Date.now(),target:t.target};var f=Math.abs(o.position.x-endEvnt.position.x),v=Math.abs(o.position.y-endEvnt.position.y),w={startEvnt:o,endEvnt:endEvnt,direction:a.replace("swipe",""),xAmount:f,yAmount:v,duration:endEvnt.time-o.time};h=!0,c.trigger("swipe",w).trigger(a,w)}}function n(t){c=e(t.currentTarget);var a="";if(c.data("callee3",arguments.callee),h){var n=c.data("xthreshold"),s=c.data("ythreshold"),u="undefined"!=typeof n&&n!==!1&&parseInt(n)?parseInt(n):i.swipe_h_threshold,l="undefined"!=typeof s&&s!==!1&&parseInt(s)?parseInt(s):i.swipe_v_threshold,p=t.originalEvent;endEvnt={position:{x:i.touch_capable?p.changedTouches[0].screenX:t.screenX,y:i.touch_capable?p.changedTouches[0].screenY:t.screenY},offset:{x:i.touch_capable?p.changedTouches[0].pageX-p.changedTouches[0].target.offsetLeft:t.offsetX,y:i.touch_capable?p.changedTouches[0].pageY-p.changedTouches[0].target.offsetTop:t.offsetY},time:Date.now(),target:t.target},o.position.y>endEvnt.position.y&&o.position.y-endEvnt.position.y>l&&(a="swipeup"),o.position.x<endEvnt.position.x&&endEvnt.position.x-o.position.x>u&&(a="swiperight"),o.position.y<endEvnt.position.y&&endEvnt.position.y-o.position.y>l&&(a="swipedown"),o.position.x>endEvnt.position.x&&o.position.x-endEvnt.position.x>u&&(a="swipeleft");var g=Math.abs(o.position.x-endEvnt.position.x),d=Math.abs(o.position.y-endEvnt.position.y),f={startEvnt:o,endEvnt:endEvnt,direction:a.replace("swipe",""),xAmount:g,yAmount:d,duration:endEvnt.time-o.time};c.trigger("swipeend",f)}r=!1,h=!1}var o,s=this,c=e(s),r=!1,h=!1,u={x:0,y:0},l={x:0,y:0};c.on(i.startevent,t),c.on(i.moveevent,a),c.on(i.endevent,n)},remove:function(){e(this).off(i.startevent,e(this).data.callee1).off(i.moveevent,e(this).data.callee2).off(i.endevent,e(this).data.callee3)}},e.event.special.scrollstart={setup:function(){function t(e,t){n=t,a(s,n?"scrollstart":"scrollend",e)}var n,o,s=this,c=e(s);c.on(i.scrollevent,function(e){c.data("callee",arguments.callee),n||t(e,!0),clearTimeout(o),o=setTimeout(function(){t(e,!1)},50)})},remove:function(){e(this).off(i.scrollevent,e(this).data.callee)}};var s,c,r,h,u,l=e(window),p={0:!0,180:!0};if(i.orientation_support){var g=window.innerWidth||l.width(),d=window.innerHeight||l.height(),f=50;h=g>d&&g-d>f,u=p[window.orientation],(h&&u||!h&&!u)&&(p={"-90":!0,90:!0})}e.event.special.orientationchange=s={setup:function(){return i.orientation_support?!1:(r=c(),l.on("throttledresize",t),!0)},teardown:function(){return i.orientation_support?!1:(l.off("throttledresize",t),!0)},add:function(e){var t=e.handler;e.handler=function(e){return e.orientation=c(),t.apply(this,arguments)}}},e.event.special.orientationchange.orientation=c=function(){var e=!0,t=document.documentElement;return e=i.orientation_support?p[window.orientation]:t&&t.clientWidth/t.clientHeight<1.1,e?"portrait":"landscape"},e.event.special.throttledresize={setup:function(){e(this).on("resize",m)},teardown:function(){e(this).off("resize",m)}};var v,w,_,T=250,m=function(){w=Date.now(),_=w-x,_>=T?(x=w,e(this).trigger("throttledresize")):(v&&window.clearTimeout(v),v=window.setTimeout(t,T-_))},x=0;e.each({scrollend:"scrollstart",swipeup:"swipe",swiperight:"swipe",swipedown:"swipe",swipeleft:"swipe",swipeend:"swipe",tap2:"tap"},function(t,a){e.event.special[t]={setup:function(){e(this).on(a,e.noop)}}})}(socialtoolbox_jQuery);

$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){}, finishedWipe:function(){},preventDefaultEvents:false};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var endX; var endY; var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false}function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault()}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft()}else{config.wipeRight()}}else if(Math.abs(dy)>=config.min_move_y){if(dy>0){config.wipeDown(dy)}else{config.wipeUp(dy)}}}}function onTouchEnd(e) { if(e.touches.length==1) {endX = e.touches[0].pageX; endY = e.touches[0].pageY; cancelTouch(); config.finishedWipe();} } function onTouchStart(e){if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false)}}if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false)}});return this}

	return {
		init: init,
		destroy: destroy
	};

})(socialtoolbox_jQuery);

socialtoolbox_jQuery(document).ready(function() {
	var $ = socialtoolbox_jQuery;
	$(".DWSocialToolbox_container").each(function() {
		if ($(this).hasClass('fbWidget') || $(this).hasClass('twWidget') || $(this).hasClass('inWidget') || $(this).hasClass('gpWidget') || $(this).hasClass('piWidget')) {
			if (window.location.protocol=='file:' && (!window.project || (window.project && !window.project.mediaQueryOrder))) {
				$(this).append('<div style="position:absolute; top:0; bottom:0; right:0; left:0; padding: 10px; border: 1px solid #faebcc; border-radius: 4px; background-color: #fcf8e3; color: #8a6d3b; font-family: Helvetica,Arial,sans-serif; font-size: 14px; line-height: 1.42857143; z-index:2147483646;">Social widget is not visible when testing locally. Please upload the site to the web hosting server to see it.</div>');
				$(this).css('position', 'relative').css('min-height', '42px');
			}
		}
	});
});