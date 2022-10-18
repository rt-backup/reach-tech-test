(function($) {


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


	$.fn.jQueryTabs = function() {
		initjQueryTabs($(this));	
	}


	function initjQueryTabs(elem) { 
		var name = elem.attr('id');
		
		var options = $.extend({}, window[name+'_json']);
		
		window[name+"Out"]="";
		window[name+"In"]="";
		window[name+"Height"]="";
		var hammertime = null;
		if (!(Browser.IsIe() && Browser.Version() <= 9) && Hammer_tabs) {
			var hammertime = new Hammer_tabs.Manager(elem.find(".jQueryTabs_navUL").get(0));
			hammertime.add(new Hammer_tabs.Pan({ threshold: 0, pointers: 0 }));

			hammertime.add(new Hammer_tabs.Swipe()).recognizeWith(hammertime.get('pan'));
		}
		
		var isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;
		if (isTouch) {
			options.tab_action='click';
		}
		
		var xtdcode = '23c57757d6';
		if(options.xtdCode=="#xtd_code#" || xtdcode != options.xtdCode) {
			 makeTopVisible();
		}
		
		if (Browser.IsIe() && Browser.Version() <= 8) {
			if (options.tab_action=='click') {
				elem.find(".jQueryTabs_navLI").unbind('mouseenter mouseleave').unbind('click').click(function(ev) {
					ev.stopPropagation();
					ev.preventDefault();
					if (!$(this).children('a').hasClass('selected')) {
						displayBehaviour($(this).children('a'), elem, options.effect, options.effectDuration, options.smooth_height);
						$('.jQueryTabs_navImg').each(function() {
							var elClass = $(this).attr('class');
							$(this).hide().removeAttr('class');
							var self = this;
							$(self).show().attr('class', elClass);
						});
					}
					return false;
				});
			} else {
				elem.find(".jQueryTabs_navLI").unbind('click').unbind('mouseenter mouseleave').hover(function() {
					if (!$(this).children('a').hasClass('selected')) {
						displayBehaviour($(this).children('a'), elem, options.effect, options.effectDuration, options.smooth_height);
						$('.jQueryTabs_navImg').each(function() {
							var elClass = $(this).attr('class');
							$(this).hide().removeAttr('class');
							var self = this;
							$(self).show().attr('class', elClass);
						});
					}
				});
			}
		} else {
			if (options.tab_action=='click') {
				elem.find(".jQueryTabs_navLink").unbind('mouseenter mouseleave').unbind('click').click(function(ev) {
					ev.stopPropagation();
					ev.preventDefault();
					if (!$(this).hasClass('selected')) {
						displayBehaviour($(this), elem, options.effect, options.effectDuration, options.smooth_height);
						if ($(window).width()<=parseInt(options.devices.mobile.width) && options.mobile_friendly && hammertime) {
							addHammer(elem, hammertime);
						}
					}
					return false;
				});
			} else {
				elem.find(".jQueryTabs_navLink").unbind('click').unbind('mouseenter mouseleave').hover(function() {
					if (!$(this).hasClass('selected')) {
						displayBehaviour($(this), elem, options.effect, options.effectDuration, options.smooth_height);
						if ($(window).width()<=parseInt(options.devices.mobile.width) && options.mobile_friendly && hammertime) {
							addHammer(elem, hammertime);
						}
					}
				});
			}
		}
		elem.find(".jQueryTabs_navLink, .jQueryTabs_navLI").bind('dragstart', function(){
			return false; 
		});
		if (!isTouch) {
			elem.find(".jQueryTabs_navLI").hover(function() {
				if (options.tab_action=='click' && !$(this).children('a').hasClass('selected')) {
					$(this).children('a').addClass('hover');
				}
			}, function() {
				if (options.tab_action=='click') {
					$(this).children('a').removeClass('hover');
				}
			});
		}
		
		if (!elem.find(".jQueryTabs_navUL").hasClass('hammer_on') && $(window).width()<=parseInt(options.devices.mobile.width) && options.mobile_friendly && hammertime) {
			addHammer(elem, hammertime);
		}
		
		
		$(window).resize(function() {
			if (options.mobile_friendly && !(Browser.IsIe() && Browser.Version() <= 9)) {
				if($(this).width()<=parseInt(options.devices.mobile.width)) {
					addHammer(elem, hammertime);
				} else {
					removeHammer(elem);
				}
			}
			elem.find('.jQueryTabs_content').removeAttr('style');
			if (options.smooth_height || elem.find('.jQueryTabs_content').isAuto()) {
				var height = elem.find(".jQueryTabs_contentDivs:visible").outerHeight();
				height = height + parseInt(elem.find(".jQueryTabs_contentDivs:visible").children().first().css('margin-top'));
				height = height + parseInt(elem.find(".jQueryTabs_contentDivs:visible").children().last().css('margin-bottom'));
				height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
				height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
				elem.find('.jQueryTabs_content').css('height', height+'px');
			}
		});
		
		if (elem.find('.jQueryTabs_content').isAuto()) {
			elem.find('.jQueryTabs_content').css('overflow', 'hidden');
		} else {
			elem.find('.jQueryTabs_content').css('overflow', 'auto');
		}
		
		if (options.smooth_height || elem.find('.jQueryTabs_content').isAuto()) {
			var height = elem.find(".jQueryTabs_contentDivs:visible").outerHeight();
			height = height + parseInt(elem.find(".jQueryTabs_contentDivs:visible").children().first().css('margin-top'));
			height = height + parseInt(elem.find(".jQueryTabs_contentDivs:visible").children().last().css('margin-bottom'));
			height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
			height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
			elem.find('.jQueryTabs_content').css('height', height+'px');
		}
		
		if (Browser.IsIe() && Browser.Version() <= 8) {
			$('.jQueryTabs_navImg').each(function() {
				var elClass = $(this).attr('class');
				$(this).hide().removeAttr('class');
				var self = this;
				$(self).show().attr('class', elClass);
			});
		}
		
		
		return hammertime;
	}

	function displayBehaviour(which, elem, effect, duration, doHeight) {
		clearTimeout(window[elem.attr('id')+"Out"]);
		clearTimeout(window[elem.attr('id')+"In"]);
		clearTimeout(window[elem.attr('id')+"Height"]);
		elem.find(".jQueryTabs_contentDivs").removeClass('fade-in').removeClass('fade-out');
		elem.find(".jQueryTabs_navLink").removeClass('selected');
		which.addClass('selected');
		var paddingTotal = parseInt(elem.find(".jQueryTabs_content").css('padding-top')) + parseInt(elem.find(".jQueryTabs_content").css('padding-bottom'));
		elem.find(".jQueryTabs_contentDivs:visible").addClass('fade-out');
		elem.find(which.attr('href')).addClass('fade-out');
		if (!(Browser.IsIe() && Browser.Version() <= 8)) {
			if (doHeight) {
				elem.find('.jQueryTabs_content').css('overflow', 'hidden');
				if (effect=='none') {
					elem.find(which.attr('href')).removeClass('hidden');
					elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs").addClass('hidden');
					elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs.fade-out").removeClass('fade-out');
					var height = elem.find(which.attr('href')).outerHeight();
					height = height + parseInt(elem.find(which.attr('href')).children().first().css('margin-top'));
					height = height + parseInt(elem.find(which.attr('href')).children().last().css('margin-bottom'));
					height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
					height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
					elem.find('.jQueryTabs_content').css('height', height+'px');
					window[elem.attr('id')+"Height"] = setTimeout(function() {
						elem.find(which.attr('href')).removeClass('fade-out');
					}, duration);
				} else {
					window[elem.attr('id')+"Out"] = setTimeout(function() {
						elem.find(which.attr('href')).removeClass('hidden');
						elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs").addClass('hidden');
						elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs.fade-out").removeClass('fade-out');
						var height = elem.find(which.attr('href')).outerHeight();
						height = height + parseInt(elem.find(which.attr('href')).children().first().css('margin-top'));
						height = height + parseInt(elem.find(which.attr('href')).children().last().css('margin-bottom'));
						height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
						height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
						elem.find('.jQueryTabs_content').css('height', height+'px');
						window[elem.attr('id')+"Height"] = setTimeout(function() {
							elem.find(which.attr('href')).removeClass('fade-out').addClass('fade-in');
							window[elem.attr('id')+"In"] = setTimeout(function() {
								elem.find(which.attr('href')).removeClass('fade-in');
							}, duration/3);
						}, duration/3);
					}, duration/3);
				}
			} else {
				elem.find('.jQueryTabs_content').removeAttr('style');
				elem.find('.jQueryTabs_content').css('overflow', 'auto');
				if (effect=='none') {
					elem.find(which.attr('href')).removeClass('hidden');
					if (elem.find('.jQueryTabs_content').isAuto()) {
						elem.find('.jQueryTabs_content').css('overflow', 'hidden');
						var height = elem.find(which.attr('href')).outerHeight();
						height = height + parseInt(elem.find(which.attr('href')).children().first().css('margin-top'));
						height = height + parseInt(elem.find(which.attr('href')).children().last().css('margin-bottom'));
						height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
						height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
						elem.find('.jQueryTabs_content').css('height', height+'px');
					}
					elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs").addClass('hidden');
					elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs.fade-out").removeClass('fade-out');
					elem.find(which.attr('href')).removeClass('fade-out');
					elem.find('.jQueryTabs_content').removeAttr('style');
				} else {
					window[elem.attr('id')+"Out"] = setTimeout(function() {
						elem.find(which.attr('href')).removeClass('hidden');
						if (elem.find('.jQueryTabs_content').isAuto()) {
							elem.find('.jQueryTabs_content').css('overflow', 'hidden');
							var height = elem.find(which.attr('href')).outerHeight();
							height = height + parseInt(elem.find(which.attr('href')).children().first().css('margin-top'));
							height = height + parseInt(elem.find(which.attr('href')).children().last().css('margin-bottom'));
							height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
							height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
							elem.find('.jQueryTabs_content').css('height', height+'px');
						}
						elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs").addClass('hidden');
						elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs.fade-out").removeClass('fade-out');
						elem.find(which.attr('href')).removeClass('fade-out').addClass('fade-in');
						window[elem.attr('id')+"In"] = setTimeout(function() {
							elem.find(which.attr('href')).removeClass('fade-in');
							elem.find('.jQueryTabs_content').removeAttr('style');
						}, duration/2);
					}, duration/2);
				}
			}
		} else {
			elem.find(which.attr('href')).removeClass('fade-out');
			elem.find(which.attr('href')).siblings(".jQueryTabs_contentDivs").addClass('hidden'); 
			elem.find(which.attr('href')).removeClass('hidden');
			setTimeout(function() { 
				var height = elem.find(which.attr('href')).outerHeight();
				height = height + parseInt(elem.find(".jQueryTabs_contentDivs:visible").children().first().css('margin-top'));
				height = height + parseInt(elem.find(".jQueryTabs_contentDivs:visible").children().last().css('margin-bottom'));
				height = height + parseInt(elem.find(".jQueryTabs_content").css('border-top-width'));
				height = height + parseInt(elem.find(".jQueryTabs_content").css('border-bottom-width'));
				elem.find('.jQueryTabs_content').css('height', height+'px'); 
				elem.find(".jQueryTabs_contentDivs").removeClass('hover');
			}, 0); 
		}
	}

	function addHammer(elem, hammertime) {
		var left;
		if (!elem.find(".jQueryTabs_navUL").hasClass('hammer_on')) {
			elem.find(".jQueryTabs_navUL").addClass('hammer_on');
			elem.find(".jQueryTabs_navUL").data('origLeft', parseInt(elem.find(".jQueryTabs_navUL").css('left')));
			elem.find(".jQueryTabs_navUL").data('direction', 'none');
			var distance = 1000;
			hammertime.on("swipeleft", function(ev) {
				left = parseInt(elem.find(".jQueryTabs_navUL").css('left'));
				
				var maxDistance = (-1) * (elem.find(".jQueryTabs_navUL").width() - elem.find(".jQueryTabs_navUL").parent().width());
				var newLeft = left - distance*Math.abs(ev.velocityX);
				if (newLeft < maxDistance) {
					elem.find(".jQueryTabs_navUL").css('left', maxDistance+"px");
					//elem.find(".jQueryTabs_navUL").stop().animate({"left" : maxDistance+"px"}, 300);
				} else {
					elem.find(".jQueryTabs_navUL").css('left', newLeft+"px");
					//elem.find(".jQueryTabs_navUL").stop().animate({"left" : newLeft+"px"}, 300);
				}
			});
			hammertime.on("swiperight", function(ev) {
				left = parseInt(elem.find(".jQueryTabs_navUL").css('left'));
				
				var newLeft = left + distance*Math.abs(ev.velocityX);
				if (newLeft >= 0) {
					elem.find(".jQueryTabs_navUL").css('left', "0px");
					//elem.find(".jQueryTabs_navUL").stop().animate({"left" : "0px"}, 300);
				} else {
					elem.find(".jQueryTabs_navUL").css('left', newLeft+"px");
					//elem.find(".jQueryTabs_navUL").stop().animate({"left" : newLeft+"px"}, 300);
				}
			});file:///C:/Users/Adrian/Documents/Unnamed%20Site%204/untitled.html#jQueryTabs16_content3
			hammertime.on("panleft", function(ev) {
				left = elem.find(".jQueryTabs_navUL").data('origLeft');
				
				var maxDistance = (-1) * (elem.find(".jQueryTabs_navUL").width() - elem.find(".jQueryTabs_navUL").parent().width());
				var newLeft = left + ev.deltaX;
				
				if (newLeft < maxDistance) {
					elem.find(".jQueryTabs_navUL").css('left', maxDistance+"px");
				} else if (newLeft >= 0) {
					elem.find(".jQueryTabs_navUL").css('left', "0px");
				} else {
					elem.find(".jQueryTabs_navUL").css('left', newLeft+"px");
				}
			});
			hammertime.on("panright", function(ev) {
				left = elem.find(".jQueryTabs_navUL").data('origLeft');
				
				var newLeft = left + ev.deltaX;
				var maxDistance = (-1) * (elem.find(".jQueryTabs_navUL").width() - elem.find(".jQueryTabs_navUL").parent().width());
				
				if (newLeft >= 0) {
					elem.find(".jQueryTabs_navUL").css('left', "0px");
				} else if (newLeft < maxDistance) {
					elem.find(".jQueryTabs_navUL").css('left', maxDistance+"px");
				} else {
					elem.find(".jQueryTabs_navUL").css('left', newLeft+"px");
				}
			});
			hammertime.on("panend", function() {
				elem.find(".jQueryTabs_navUL").data('origLeft', parseInt(elem.find(".jQueryTabs_navUL").css('left')))
			});
		} else {
			var selectedLeft = elem.find(".jQueryTabs_navLink.selected").offset().left;
			if (selectedLeft < 0 || (selectedLeft+elem.outerWidth()) > ((-1)*parseInt(elem.find(".jQueryTabs_navUL").css('left')) + elem.find(".jQueryTabs_navLink.selected").outerWidth())) {
				var newLeft = elem.find(".jQueryTabs_navLink.selected").position().left - elem.outerWidth()/2 + elem.find(".jQueryTabs_navLink.selected").outerWidth()/2;
				newLeft = newLeft*(-1);
				var maxDistance = (-1) * (elem.find(".jQueryTabs_navUL").width() - elem.find(".jQueryTabs_navUL").parent().width());
				if (newLeft < maxDistance) {
					newLeft = maxDistance;
				} else if (newLeft>0) {
					newLeft = 0;
				}
				elem.find(".jQueryTabs_navUL").css('left', newLeft+"px");
			}
			if ((-1)*parseInt(elem.find(".jQueryTabs_navUL").css('left')) >  elem.outerWidth()) {
				elem.find(".jQueryTabs_navUL").css('left', (elem.outerWidth()*(-1))+"px")
			}
		}
	}

	function removeHammer(elem) {
		if (elem.find(".jQueryTabs_navUL").hasClass('hammer_on')) {
			elem.find(".jQueryTabs_navUL").removeClass('hammer_on');
			elem.find(".jQueryTabs_navUL").css('left', '0px');
		}
	}

	function destroyjQueryTabs(hammertime, name) {
		var elem = $("#"+name);
		hammertime.destroy();
		elem.find(".jQueryTabs_navLink").unbind('click');
		elem.find(".jQueryTabs_navLink").unbind('mouseenter mouseleave');
		$(window).unbind('resize');
	}
	
	function makeTopVisible() {
		 if (!tabs_jQuery('.tabs-banner-trial').length) {
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
				'left': '0px'
			 });
			 var textholder = $('<div></div>').css({
				'text-align' : 'center',
				'font-size' : '16px',
				'width' : '100%',
				'float' : 'left',
				'position' : 'relative',
				'display' : 'block',
				'color' : '#fff',
				'height' : '20px',
				'vertical-align' : 'middle',
				'font-family' : 'Tahoma, sans-serif'
			}).html(Base64.decode("VGFiIGNyZWF0ZWQgdXNpbmcgRFcgU21hcnRUYWJzLSBmcmVlIHRyaWFsIHZlcnNpb24uIFJlYWQgbW9yZSA8YSBocmVmPSJodHRwOi8vd3d3LmV4dGVuZHN0dWRpby5jb20vIj5odHRwOi8vd3d3LmV4dGVuZHN0dWRpby5jb20vPC9hPg=="));
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
			newTop.addClass('tabs-banner-trial');
			newTop.append(closeButton);

			 tabs_jQuery('body').prepend(newTop);
		 }
      }

	$.fn.isAuto = function(){
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



	/*! Hammer.JS - v2.0.4 - 2014-09-28
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2014 Jorik Tangelder;
	 * Licensed under the MIT license */
	try {
		!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer_tabs"); 	
	} catch(e) {
		console.error('hammer js has not loaded');
	}


})(tabs_jQuery);

//# sourceMappingURL=hammer.min.map