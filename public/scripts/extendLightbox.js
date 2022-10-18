(function($) {
	var tmp, loading, overlay, wrap, classWrapper, outer, content, close, title, nav_left, nav_right,

		selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

		ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,

		loadingTimer, loadingFrame = 1,

		titleHeight = 0, titleStr = '', start_pos, final_pos, busy = false, fx = $.extend($('<div/>')[0], { prop: 0 }),

		//		isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest,

		/*
		 * Private methods 
		 */

		_abort = function() {
			loading.hide();

			imgPreloader.onerror = imgPreloader.onload = null;

			if (ajaxLoader) {
				ajaxLoader.abort();
			}

			tmp.empty();
		},

		_error = function() {
			if (false === selectedOpts.onError(selectedArray, selectedIndex, selectedOpts)) {
				loading.hide();
				busy = false;
				return;
			}

			selectedOpts.titleShow = false;

			selectedOpts.width = 'auto';
			selectedOpts.height = 'auto';

			tmp.html( '<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>' );

			_process_inline();
		},

		_start = function() {
			var obj = selectedArray[ selectedIndex ],
				href, 
				type, 
				title,
				str,
				emb,
				ret;

			_abort();

			selectedOpts = $.extend({}, $.fn.xtd_fancybox.defaults, (typeof $(obj).data('fancybox') == 'undefined' ? selectedOpts : $(obj).data('fancybox')));

			ret = selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts);



			if (ret === false) {
				busy = false;
				return;
			} else if (typeof ret == 'object') {
				selectedOpts = $.extend(selectedOpts, ret);
			}

			classWrapper.removeAttr('class').addClass('fb-outer-wrapper').addClass(selectedOpts.selectedInstance);

			title = selectedOpts.title || (obj.nodeName ? $(obj).attr('title') : obj.title) || '';

			selectedOpts.hasControlsBar = !((!selectedOpts.showCaption || title == "" ) && selectedArray.length == 1) ;
			

			if (obj.nodeName && !selectedOpts.orig) {
				selectedOpts.orig = $(obj).children("img:first").length ? $(obj).children("img:first") : $(obj);
			}

			if (title === '' && selectedOpts.orig && selectedOpts.titleFromAlt) {
				title = selectedOpts.orig.attr('alt');
			}



			href = selectedOpts.href || (obj.nodeName ? $(obj).attr('href') : obj.href) || null;

			if ((/^(?:javascript)/i).test(href) || href == '#') {
				href = null;
			}

			if (selectedOpts.type) {
				type = selectedOpts.type;

				if (!href) {
					href = selectedOpts.content;
				}

			} else if (selectedOpts.content) {
				type = 'html';

			} else if (href) {
				if (href.match(imgRegExp)) {
					type = 'image';

				} else if (href.match(swfRegExp)) {
					type = 'swf';

				} else if ($(obj).hasClass("iframe")) {
					type = 'iframe';

				} else if (href.indexOf("#") === 0) {
					type = 'inline';

				} else {
					type = 'ajax';
				}
			}

			if (!type) {
				_error();
				return;
			}

			if (type == 'inline') {
				obj	= href.substr(href.indexOf("#"));
				type = $(obj).length > 0 ? 'inline' : 'ajax';
			}

			selectedOpts.type = type;
			selectedOpts.href = href;
			selectedOpts.title = title;

			if (selectedOpts.autoDimensions) {
				if (selectedOpts.type == 'html' || selectedOpts.type == 'inline' || selectedOpts.type == 'ajax') {
					selectedOpts.width = 'auto';
					selectedOpts.height = 'auto';
				} else {
					selectedOpts.autoDimensions = false;	
				}
			}

			if (selectedOpts.modal) {
				selectedOpts.overlayShow = true;
				selectedOpts.hideOnOverlayClick = false;
				selectedOpts.hideOnContentClick = false;
				selectedOpts.enableEscapeButton = false;
				selectedOpts.showCloseButton = false;
			}

			selectedOpts.padding = parseInt(selectedOpts.padding, 10);
			selectedOpts.margin = parseInt(selectedOpts.margin, 10);

			tmp.css('padding', (selectedOpts.padding + selectedOpts.margin));
			$('.fancybox-inline-tmp').replaceWith(content.children());
			/*$('.fancybox-inline-tmp').unbind('fancybox-cancel').bind('fancybox-change', function() {
				//$(this).replaceWith(content.children());				
			});*/

			switch (type) {
				case 'html' :
					tmp.html( selectedOpts.content );
					_process_inline();
				break;

				case 'inline' :
					if ( $(obj).parent().is('#fancybox-content') === true) {
						busy = false;
						return;
					}

					$('<div class="fancybox-inline-tmp" />')
						.hide()
						.insertBefore( $(obj) )
						.bind('fancybox-cleanup', function() {
							//$(this).replaceWith(content.children());
						}).bind('fancybox-cancel', function() {
							$(this).replaceWith(tmp.children());
						});
					$(obj).appendTo(tmp);

					_process_inline();
				break;

				case 'image':
					busy = false;

					$.xtd_fancybox.showActivity();

					imgPreloader = new Image();

					imgPreloader.onerror = function() {
						_error();
					};

					imgPreloader.onload = function() {
						busy = true;

						imgPreloader.onerror = imgPreloader.onload = null;

						_process_image();
					};

					imgPreloader.src = href;
				break;

				case 'swf':
					selectedOpts.scrolling = 'no';

					str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
					emb = '';

					$.each(selectedOpts.swf, function(name, val) {
						str += '<param name="' + name + '" value="' + val + '"></param>';
						emb += ' ' + name + '="' + val + '"';
					});

					str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

					tmp.html(str);

					_process_inline();
				break;

				case 'ajax':
					busy = false;

					$.xtd_fancybox.showActivity();

					selectedOpts.ajax.win = selectedOpts.ajax.success;

					ajaxLoader = $.ajax($.extend({}, selectedOpts.ajax, {
						url	: href,
						data : selectedOpts.ajax.data || {},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							if ( XMLHttpRequest.status > 0 ) {
								_error();
							}
						},
						success : function(data, textStatus, XMLHttpRequest) {
							var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;
							if (o.status == 200) {
								if ( typeof selectedOpts.ajax.win == 'function' ) {
									ret = selectedOpts.ajax.win(href, data, textStatus, XMLHttpRequest);

									if (ret === false) {
										loading.hide();
										return;
									} else if (typeof ret == 'string' || typeof ret == 'object') {
										data = ret;
									}
								}

								tmp.html( data );
								_process_inline();
							}
						}
					}));

				break;

				case 'iframe':
					_process_iframe();
				break;
			}
		},

		_process_iframe = function() {
			_show();
		},

		_process_inline = function() {
			
			var
				w = selectedOpts.width,
				h = selectedOpts.height;

			
			if (w.toString().indexOf('%') > -1) {
				w = parseInt( ($(window).width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + 'px';

			} else {
				w = w == 'auto' ? 'auto' : w + 'px';	
			}

			if (h.toString().indexOf('%') > -1) {
				h = parseInt( ($(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + 'px';

			} else {
				h = h == 'auto' ? 'auto' : h + 'px';	
			}

			var html = '<div style="width:' + w + ';height:' + h + ';overflow: ' + (selectedOpts.scrolling == 'auto' ? 'auto' : (selectedOpts.scrolling == 'yes' ? 'scroll' : 'hidden')) + ';position:relative;"></div>';
			
			tmp.wrapInner(html);

			selectedOpts.width = tmp.width();
			selectedOpts.height = tmp.height();
			
			_show();
		},

		_process_image = function() {
			selectedOpts.width = imgPreloader.width;
			selectedOpts.height = imgPreloader.height;

			$("<img />").attr({
				'id' : 'fancybox-img',
				'src' : imgPreloader.src,
				'alt' : selectedOpts.title
			}).appendTo( tmp );

			_show();
		},

		_show = function() {
			var pos, equal;

			loading.hide();

			if (wrap.is(":visible") && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
				$.event.trigger('fancybox-cancel');
				$('.fancybox-inline-tmp').replaceWith(content.children());
				busy = false;
				return;
			}

			busy = true;

			$(content.add( overlay )).unbind();

			$(window).unbind("resize.fb scroll.fb");
			$(document).unbind('keydown.fb');

			

			if (wrap.is(":visible") && currentOpts.titlePosition !== 'outside') {
				wrap.css('height', wrap.height());
			}

			currentArray = selectedArray;
			currentIndex = selectedIndex;
			currentOpts = selectedOpts;


			if (currentOpts.overlayShow) {
				overlay.css({
					'background-color' : currentOpts.overlayColor,
					'opacity' : currentOpts.overlayOpacity,
					'cursor' : currentOpts.hideOnOverlayClick ? 'pointer' : 'auto',
					'height' : $(document).height()
				});

				if (!overlay.is(':visible')) {
			//					if (isIE6) {
			//						$('select:not(#fancybox-tmp select)').filter(function() {
			//							return this.style.visibility !== 'hidden';
			//						}).css({'visibility' : 'hidden'}).one('fancybox-cleanup', function() {
			//							this.style.visibility = 'inherit';
			//						});
			//					}

					overlay.show();
				}
			} else {
				overlay.hide();
			}

			final_pos = _get_zoom_to();

			_process_title();

			if (wrap.is(":visible")) {
				$( close.add( nav_left ).add( nav_right ) ).hide();

				pos = wrap.position(),

				start_pos = {
					top	 : pos.top,
					left : pos.left,
					width : content.width() + (currentOpts.padding * 2),
					height : content.height() + (currentOpts.padding * 2)
				};

				equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

				content.fadeTo(currentOpts.changeFade, 0.3, function() {
					var finish_resizing = function() {
						content.html( tmp.contents() ).fadeTo(currentOpts.changeFade, 1, _finish);
					};


					$.event.trigger('fancybox-change');
				

					var calculatedHeight = final_pos.height - titleHeight - currentOpts.padding * 2;
					var view = _get_viewport()
					var gutter = view[1] < 500 ? 50 : 200;
					if($(window).height() - calculatedHeight < gutter && selectedOpts.hasControlsBar) { 
						calculatedHeight = $(window).height() - gutter;
					}

					content
						.empty()
						.removeAttr('filter')
						.css({
							'border-width' : currentOpts.padding,
							'width'	: final_pos.width - currentOpts.padding * 2,
							'height' : selectedOpts.autoDimensions ? 'auto' : calculatedHeight
						});

					if (equal) {
						finish_resizing();

					} else {
						fx.prop = 0;

						$(fx).animate({prop: 1}, {
							 duration : currentOpts.changeSpeed,
							 easing : currentOpts.easingChange,
							 step : _draw,
							 complete : finish_resizing
						});
					}
				});

				return;
			}

			wrap.removeAttr("style");

			content.css('border-width', currentOpts.padding);

			if (currentOpts.transitionIn == 'elastic') {
				start_pos = _get_zoom_from();

				content.html( tmp.contents() );

				wrap.show();

				if (currentOpts.opacity) {
					final_pos.opacity = 0;
				}

				fx.prop = 0;

				$(fx).animate({prop: 1}, {
					 duration : currentOpts.speedIn,
					 easing : currentOpts.easingIn,
					 step : _draw,
					 complete : _finish
				});

				return;
			}

			if (currentOpts.titlePosition == 'inside' && titleHeight > 0) {	
				title.show();	
			}
			

			var calculatedHeight = final_pos.height - titleHeight - currentOpts.padding * 2;
		//	console.log(calculatedHeight + " .. " +  $(window).height() + " .. " + (($(window).height() - calculatedHeight) < 200));
		/*	if(($(window).height() - calculatedHeight) < 200) { 
				calculatedHeight = $(window).height() - 200;
			}
*/
			//console.log('set ' + calculatedHeight);

			content.css({
					'width' : final_pos.width - currentOpts.padding * 2,
					'height' : selectedOpts.autoDimensions ? 'auto' : calculatedHeight
				})
				.html( tmp.contents() );
		

			wrap
				.css(final_pos)
				.fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
			
			
			
			
		},

		_format_title = function(title) {
			if (title && title.length) {
				if (currentOpts.titlePosition == 'float') {
					return '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + title + '</td><td id="fancybox-title-float-right"></td></tr></table>';
				}

				return '<div id="fancybox-title-' + currentOpts.titlePosition + '">' + title + '</div>';
			}

			return false;
		},

		_process_title = function() {
			titleStr = currentOpts.title || '';
			titleHeight = 0;

			title
				.empty()
				.removeAttr('style')
				.removeClass();

			if (currentOpts.titleShow === false) {
				title.hide();
				return;
			}
			
			titleStr = $.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(titleStr, currentArray, currentIndex, currentOpts) : _format_title(titleStr);

			if (!titleStr || titleStr === '') {
				title.hide();
				return;
			}

			title
				.addClass('fancybox-title-' + currentOpts.titlePosition)
				.html( titleStr )
				.appendTo( 'body' )
				.show();

			switch (currentOpts.titlePosition) {
				case 'inside':
					title
						.css({
							'width' : final_pos.width - (currentOpts.padding * 2),
							'marginLeft' : currentOpts.padding,
							'marginRight' : currentOpts.padding
						});

					titleHeight = title.outerHeight(true);

					title.appendTo( outer );

					final_pos.height += titleHeight;
				break;

				case 'over':
					title
						.css({
							'marginLeft' : currentOpts.padding,
							'width'	: final_pos.width - (currentOpts.padding * 2),
							'bottom' : currentOpts.padding
						})
						.appendTo( outer );
				break;

				case 'float':
					title
						.css('left', parseInt((title.width() - final_pos.width - 40)/ 2, 10) * -1)
						.appendTo( wrap );
				break;

				default:
					title
						.css({
							'width' : final_pos.width - (currentOpts.padding * 2),
							'paddingLeft' : currentOpts.padding,
							'paddingRight' : currentOpts.padding
						})
						.appendTo( wrap );
				//	titleHeight = title.outerHeight(true);
				break;
			}

			title.hide();
		},

		_set_navigation = function() {
			if (currentOpts.enableEscapeButton || currentOpts.enableKeyboardNav) {
				$(document).bind('keydown.fb', function(e) {
					if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
						e.preventDefault();
						$.xtd_fancybox.close();

					} else if ((e.keyCode == 37 || e.keyCode == 39) && currentOpts.enableKeyboardNav && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
						e.preventDefault();
						$.xtd_fancybox[ e.keyCode == 37 ? 'prev' : 'next']();
					}
				});
			}

			if (!currentOpts.showNavArrows) { 
				nav_left.hide();
				nav_right.hide();
				return;
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
				nav_left.show();
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length -1)) {
				nav_right.show();
			}
		},

		_finish = function () {
			if (!$.support.opacity) {
				content.get(0).style.removeAttribute('filter');
				wrap.get(0).style.removeAttribute('filter');
			}

			if (selectedOpts.autoDimensions) {
				content.css('height', 'auto');
			}

			wrap.css('height', 'auto');
            // ??

			if (titleStr && titleStr.length) {
				title.show();
			}

			if (currentOpts.showCloseButton) {
				close.show();
			}

			_set_navigation();
	
			if (currentOpts.hideOnContentClick)	{
				content.bind('click', $.xtd_fancybox.close);
			} else {
				content.bind('click', $.xtd_fancybox.next);
			}

			if (currentOpts.hideOnOverlayClick)	{
				overlay.bind('click', $.xtd_fancybox.close);
			}

			$(window).bind("resize.fb", $.xtd_fancybox.resize);

			if (currentOpts.centerOnScroll) {
				$(window).bind("scroll.fb", $.xtd_fancybox.center);
			}

			if (currentOpts.type == 'iframe') {
				$('<iframe id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '" frameborder="0" hspace="0" ' + 
				//($.browser.msie ? 'allowtransparency="true""' : '') + 
				' scrolling="' + selectedOpts.scrolling + '" src="' + currentOpts.href + '"  sandbox="allow-same-origin allow-scripts allow-popups"></iframe>').appendTo(content);
			}
            //add effect
			wrap.show().addClass('extend-effect');

			busy = false;

			$.xtd_fancybox.center();

			currentOpts.onComplete(currentArray, currentIndex, currentOpts);

			_preload_images();
		},

		_preload_images = function() {
			var href, 
				objNext;

			if ((currentArray.length -1) > currentIndex) {
				href = currentArray[ currentIndex + 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}

			if (currentIndex > 0) {
				href = currentArray[ currentIndex - 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}
		},

		_draw = function(pos) {
            var captionSize = parseInt($('#fancybox-title').height() / 2);
            var fixMargin = parseInt($(window).height() - $('#fancybox-xtdLightbox-effects').height()) /2 ;

			var dim = {
				width : parseInt(start_pos.width + (final_pos.width - start_pos.width) * pos, 10),
				height : parseInt(start_pos.height + (final_pos.height - start_pos.height) * pos, 10) ,

				top : parseInt(start_pos.top + (final_pos.top - start_pos.top) * pos, 10) ,
				left : parseInt(start_pos.left + (final_pos.left - start_pos.left) * pos, 10)
			};
			
			if (typeof final_pos.opacity !== 'undefined') {
				dim.opacity = pos < 0.5 ? 0.5 : pos;
			}
			
			wrap.css(dim);

			var calculatedHeight = dim.height - (titleHeight * pos) - currentOpts.padding * 2;
			var view = _get_viewport()
			var gutter = view[1] < 500 ? 50 : 200;
			if($(window).height() - calculatedHeight < gutter && selectedOpts.hasControlsBar) { 
				calculatedHeight = $(window).height() - gutter;
			}
			

			content.css({
				'width' : dim.width - currentOpts.padding * 2,
				'height' : calculatedHeight
			});
		},

		_get_viewport = function() {
			return [
				$(window).width() - (currentOpts.margin * 2),
				$(window).height() - (currentOpts.margin * 2),
				$(document).scrollLeft() + currentOpts.margin,
				$(document).scrollTop() + currentOpts.margin
			];
		},

		_get_zoom_to = function () {
			var view = _get_viewport(),
				to = {},
				resize = currentOpts.autoScale,
				double_padding = currentOpts.padding * 2,
				ratio;

			ratio = (currentOpts.width ) / currentOpts.height;

			if (currentOpts.width.toString().indexOf('%') > -1) {
				to.width = parseInt((view[0] * parseFloat(currentOpts.width)) / 100, 10);
			} else {
				to.width = parseInt(currentOpts.width) + double_padding;
			}

			
			if (currentOpts.height.toString().indexOf('%') > -1) {
				to.height = parseInt((view[1] * parseFloat(currentOpts.height)) / 100, 10);
			} else {
				to.height = parseInt(currentOpts.height) + double_padding;
				var gutter = view[1] < 500 ? 50 : 200;
				if (view[1] - to.height < gutter) {
					to.height = view[1]-gutter;
					to.width = parseInt(to.height * ratio);
				}
			}


			if (resize && (to.width > view[0] || to.height > view[1])) {
				if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
					
					if ((to.width ) > view[0]) {
						to.width = view[0];
						to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10);
					}
	
					if ((to.height) > view[1] - 200) {
						to.height = view[1] - 200;
						to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10);
					}

				} else {

					to.width = Math.min(to.width, view[0]);
					to.height = Math.min(to.height, view[1]);
				}
			}

			var topOffset = view[1] < 500 ? 20 : 120;
			to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - topOffset) * 0.5)), 10);
			to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 20) * 0.5)), 10);
			
			return to;
		},

		_get_obj_pos = function(obj) {
			var pos = obj.offset();

			pos.top += parseInt( obj.css('paddingTop'), 10 ) || 0;
			pos.left += parseInt( obj.css('paddingLeft'), 10 ) || 0;

			pos.top += parseInt( obj.css('border-top-width'), 10 ) || 0;
			pos.left += parseInt( obj.css('border-left-width'), 10 ) || 0;

			pos.width = obj.width();
			pos.height = obj.height();

			return pos;
		},

		_get_zoom_from = function() {
			var orig = selectedOpts.orig ? $(selectedOpts.orig) : false,
				from = {},
				pos,
				view;

			if (orig && orig.length) {
				pos = _get_obj_pos(orig);

				from = {
					width : pos.width + (currentOpts.padding * 2),
					height : pos.height + (currentOpts.padding * 2),
					top	: pos.top - currentOpts.padding - 20,
					left : pos.left - currentOpts.padding - 20
				};

			} else {
				view = _get_viewport();

				from = {
					width : currentOpts.padding * 2,
					height : currentOpts.padding * 2,
					top	: parseInt(view[3] + view[1] * 0.5, 10),
					left : parseInt(view[2] + view[0] * 0.5, 10)
				};
			}

			return from;
		},

		_animate_loading = function() {
			if (!loading.is(':visible')){
				clearInterval(loadingTimer);
				return;
			}

			$('div', loading).css('top', (loadingFrame * -40) + 'px');

			loadingFrame = (loadingFrame + 1) % 12;
		};

	/*
	 * Public methods 
	 */

	$.fn.xtd_fancybox = function(options) {
		if (!$(this).length) {
			return this;
		}

		options.selectedInstance = $(this).attr(options.relAttr);
		options.height = $(this).attr('data-height');
		options.width = $(this).attr('data-width');
		
		$(this)
			.data('fancybox', $.extend({}, options, ($.metadata ? $(this).metadata() : {})))
			.unbind('click.fb')
			.bind('click.fb', function(e) {
				e.preventDefault();

				if (busy) {
					return;
				}

				busy = true;

				$(this).blur();

				selectedArray = [];
				selectedIndex = 0;


				var rel = $(this).attr(options.relAttr) || '';

				if (!rel || rel == '' || rel === 'nofollow') {
					selectedArray.push(this);

				} else {
					selectedArray = $("a[" + options.relAttr + "=" + rel + "], area[" + options.relAttr + "=" + rel + "]").filter(function(){
						return $(this).data('fancybox');
					});
					selectedIndex = selectedArray.index( this );
				}

								

				selectedArray.length > 1

				var hrefArrays = [];
				var unique = [];
				var search;
				$.each(selectedArray, function(i, el){
					search = $.inArray(el.href, hrefArrays);
					if($.inArray(el.href, hrefArrays) === -1) {
						if ($(el).data('fancybox')) {
							unique.push(el);
							hrefArrays.push(el.href);
						}
						
					} else {
						if(i == selectedIndex) { 
							selectedIndex = search;
						}

					}
				})

				selectedArray = unique;

				_start();

				return;
			});

		return this;
	};

	$.xtd_fancybox = function(obj) {
		var opts;

		if (busy) {
			return;
		}

		busy = true;
		opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

		selectedArray = [];
		selectedIndex = parseInt(opts.index, 10) || 0;

		if ($.isArray(obj)) {
			for (var i = 0, j = obj.length; i < j; i++) {
				if (typeof obj[i] == 'object') {
					$(obj[i]).data('fancybox', $.extend({}, opts, obj[i]));
				} else {
					obj[i] = $({}).data('fancybox', $.extend({content : obj[i]}, opts));
				}
			}

			selectedArray = $.merge(selectedArray, obj);

		} else {
			if (typeof obj == 'object') {
				$(obj).data('fancybox', $.extend({}, opts, obj));
			} else {
				obj = $({}).data('fancybox', $.extend({content : obj}, opts));
			}

			selectedArray.push(obj);
		}

		if (selectedIndex > selectedArray.length || selectedIndex < 0) {
			selectedIndex = 0;
		}

		_start();
	};

	$.xtd_fancybox.showActivity = function() {
		clearInterval(loadingTimer);

		loading.show();
		loadingTimer = setInterval(_animate_loading, 66);
	};

	$.xtd_fancybox.hideActivity = function() {
		loading.hide();
	};

	$.xtd_fancybox.next = function() {
		return $.xtd_fancybox.pos( currentIndex + 1);
	};

	$.xtd_fancybox.prev = function() {
		return $.xtd_fancybox.pos( currentIndex - 1);
	};

	$.xtd_fancybox.pos = function(pos) {
		if (busy) {
			return;
		}

		pos = parseInt(pos);

		selectedArray = currentArray;

		if (pos > -1 && pos < currentArray.length) {
			selectedIndex = pos;
			_start();

		} else if (currentOpts.cyclic && currentArray.length > 1) {
			selectedIndex = pos >= currentArray.length ? 0 : currentArray.length - 1;
			_start();
		}

		return;
	};

	$.xtd_fancybox.cancel = function() {
		if (busy) {
			return;
		}

		busy = true;

		$.event.trigger('fancybox-cancel');

		_abort();

		selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);

		busy = false;
	};

	// Note: within an iframe use - parent.$.xtd_fancybox.close();
	$.xtd_fancybox.close = function() {
		if (busy || wrap.is(':hidden')) {
			return;
		}

		busy = true;

		if (currentOpts && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
			busy = false;
			return;
		}

		_abort();

		$(close.add( nav_left ).add( nav_right )).hide();

		$(content.add( overlay )).unbind();

		$(window).unbind("resize.fb scroll.fb");
		$(document).unbind('keydown.fb');

		

        //remove effect
        wrap.removeClass('extend-effect');

		//		content.find('iframe').attr('src', isIE6 && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank');

		if (currentOpts.titlePosition !== 'inside') {
			title.empty();
		}

		wrap.stop();

		function _cleanup() {
			overlay.fadeOut('fast');

			title.empty().hide();
			wrap.hide();

			$('.fancybox-inline-tmp').replaceWith(content.children());
			$.event.trigger('fancybox-cleanup');

			content.empty();

			currentOpts.onClosed(currentArray, currentIndex, currentOpts);
			
			currentArray = selectedOpts	= [];
			currentIndex = selectedIndex = 0;
			currentOpts = selectedOpts	= {};

			busy = false;
		}

		if (currentOpts.transitionOut == 'elastic') {
			start_pos = _get_zoom_from();

			var pos = wrap.position();

			final_pos = {
				top	 : pos.top ,
				left : pos.left,
				width :	wrap.width(),
				height : wrap.height()
			};

			if (currentOpts.opacity) {
				final_pos.opacity = 1;
			}

			title.empty().hide();

			fx.prop = 1;

			$(fx).animate({ prop: 0 }, {
				 duration : currentOpts.speedOut,
				 easing : currentOpts.easingOut,
				 step : _draw,
				 complete : _cleanup
			});

		} else {
			wrap.fadeOut( currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
		}


	};

	$.xtd_fancybox.resize = function() {
		if (overlay.is(':visible')) {
			overlay.css('height', $(document).height());
		}

		$.xtd_fancybox.center(true);
	};

	$.xtd_fancybox.center = function() {
		var view, align;
		if (busy) {
			return;	
		}

		align = arguments[0] === true ? 1 : 0;
		view = _get_viewport();

		if (!align && (wrap.width() > view[0] || wrap.height() > view[1])) {
			return;	
		}

		var contentHeight = content.height();
		var gutter = view[1] < 500 ? 50 : 200;
		if(view[1] - content.height() < gutter) { 
			contentHeight = view[1] - gutter;
		}

		var topOffset = view[1] < 500 ? 20 : 120;
        var captionSize = parseInt($('#fancybox-title').height() / 2);
		wrap
			.stop()
			.animate({
				'top' : parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - content.height() - topOffset) * 0.5) - currentOpts.padding)),
				'left' : parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - content.width() - 20) * 0.5) - currentOpts.padding))
			}, typeof arguments[0] == 'number' ? arguments[0] : 200);
	};

	$.xtd_fancybox.init = function() {
		if ($('.fb-outer-wrapper').length) {
			return;
		}
		classWrapper = $('<div class="fb-outer-wrapper"></div>')

		classWrapper.append(
			tmp	= $('<div id="fancybox-tmp"></div>'),
			loading	= $('<div id="fancybox-loading"><div></div></div>'),
			overlay	= $('<div id="fancybox-overlay" style="display:none;"></div>'),
			wrap = $('<div id="fancybox-wrap"></div>')
		);

		$('body').append(classWrapper);
		
        // effects wrapper
        wrap.wrap('<div id="perspective-fix"></div> ').wrap('<div id="fancybox-xtdLightbox-effects"></div>');

		outer = $('<div id="fancybox-outer"></div>')

			// Prevent appending out background-image based box shadow
			//			.append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>')
						.appendTo( wrap );

		outer.append(
			content = $('<div id="fancybox-content"></div>'),
			close = $('<a id="fancybox-close"></a>'),
			title = $('<div id="fancybox-title"></div>'),

			nav_left = $('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),
			nav_right = $('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')
		);

		close.click($.xtd_fancybox.close);
		loading.click($.xtd_fancybox.cancel);

		nav_left.click(function(e) {
			e.preventDefault();
			$.xtd_fancybox.prev();
		});

		nav_right.click(function(e) {
			e.preventDefault();
			$.xtd_fancybox.next();
		});

		if ($.fn.mousewheel) {
			wrap.bind('mousewheel.fb', function(e, delta) {
				if (busy) {
					e.preventDefault();

				} else if ($(e.target).get(0).clientHeight == 0 || $(e.target).get(0).scrollHeight === $(e.target).get(0).clientHeight) {
					e.preventDefault();
					$.xtd_fancybox[ delta > 0 ? 'prev' : 'next']();
				}
			});
		}

		if (!$.support.opacity) {
			wrap.addClass('fancybox-ie');
		}

		//		if (isIE6) {
		//			loading.addClass('fancybox-ie6');
		//			wrap.addClass('fancybox-ie6');
		//
		//			$('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(outer);
		//		}
	};

	$.fn.xtd_fancybox.defaults = {
		padding : 10,
		margin : 40,
		opacity : false,
		modal : false,
		cyclic : false,
		scrolling : 'auto',	// 'auto', 'yes' or 'no'

		width : 560,
		height : 340,

		autoScale : true,
		autoDimensions : true,
		centerOnScroll : false,

		ajax : {},
		swf : { wmode: 'transparent' },

		hideOnOverlayClick : true,
		hideOnContentClick : false,

		overlayShow : true,
		overlayOpacity : 0.7,
		overlayColor : '#777',

		titleShow : true,
		titlePosition : 'float', // 'float', 'outside', 'inside' or 'over'
		titleFormat : null,
		titleFromAlt : false,

		transitionIn : 'fade', // 'elastic', 'fade' or 'none'
		transitionOut : 'fade', // 'elastic', 'fade' or 'none'

		speedIn : 300,
		speedOut : 300,

		changeSpeed : 300,
		changeFade : 'fast',

		easingIn : 'swing',
		easingOut : 'swing',

		showCloseButton	 : true,
		showNavArrows : true,
		enableEscapeButton : true,
		enableKeyboardNav : true,

		onStart : function(){},
		onCancel : function(){},
		onComplete : function(){},
		onCleanup : function(){},
		onClosed : function(){},
		onError : function(){}
	};

	$(document).ready(function() {
		$.xtd_fancybox.init();
	});

})(menus_jQuery);




(function($) {

	/**
	Mobile support module for lightbox
		- creates HTML structure needed on mobile
		- initializes carousel pluggin
	*/


	var Mobify = window.Mobify = window.Mobify || {};
	Mobify.$ = Mobify.$ || window.Zepto || window.menus_jQuery;
	Mobify.UI = Mobify.UI ? Mobify.$.extend(Mobify.UI, { classPrefix: 'm-' }) : { classPrefix: 'm-' };

	(function($, document) {
	    $.support = $.support || {};

	    $.extend($.support, {
	        'touch': 'ontouchend' in document
	    });

	})(Mobify.$, document);



	/**
	    @module Holds common functions relating to UI.
	*/
	Mobify.UI.Utils = (function($) {
	    var exports = {}
	        , has = $.support
	        , ua = navigator.userAgent;

	    /**
	        Events (either touch or mouse)
	    */
	    exports.events = (has.touch)
	        ? {down: 'touchstart', move: 'touchmove', up: 'touchend'}
	        : {down: 'mousedown', move: 'mousemove', up: 'mouseup'};

	    /**
	        Returns the position of a mouse or touch event in (x, y)
	        @function
	        @param {Event} touch or mouse event
	        @returns {Object} X and Y coordinates
	    */
	    exports.getCursorPosition = (has.touch)
	        ? function(e) {e = e.originalEvent || e; return {x: e.touches[0].clientX, y: e.touches[0].clientY}}
	        : function(e) {return {x: e.clientX, y: e.clientY}};


	    /**
	        Returns prefix property for current browser.
	        @param {String} CSS Property Name
	        @return {String} Detected CSS Property Name
	    */
	    exports.getProperty = function(name) {
	        var prefixes = ['Webkit', 'Moz', 'O', 'ms', '']
	          , testStyle = document.createElement('div').style;
	        
	        for (var i = 0; i < prefixes.length; ++i) {
	            if (testStyle[prefixes[i] + name] !== undefined) {
	                return prefixes[i] + name;
	            }
	        }

	        // Not Supported
	        return;
	    };

	    $.extend(has, {
	        'transform': !! (exports.getProperty('Transform'))

	        // Usage of transform3d on *android* would cause problems for input fields:
	        // - https://coderwall.com/p/d5lmba
	        // - http://static.trygve-lie.com/bugs/android_input/
	      , 'transform3d': !! (window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix() && !/android\s+[1-2]/i.test(ua)) 
	    });

	    // translateX(element, delta)
	    // Moves the element by delta (px)
	    var transformProperty = exports.getProperty('Transform');
	    if (has.transform3d) {
	        exports.translateX = function(element, delta) {
	             if (typeof delta == 'number') delta = delta + 'px';
	             element.style[transformProperty] = 'translate3d(' + delta  + ',0,0)';
	        };
	    } else if (has.transform) {
	        exports.translateX = function(element, delta) {
	             if (typeof delta == 'number') delta = delta + 'px';
	             element.style[transformProperty] = 'translate(' + delta  + ',0)';
	        };
	    } else {
	        exports.translateX = function(element, delta) {
	            if (typeof delta == 'number') delta = delta + 'px';
	            element.style.left = delta;
	        };
	    }

	    // setTransitions
	    var transitionProperty = exports.getProperty('Transition')
	      , durationProperty = exports.getProperty('TransitionDuration');

	    exports.setTransitions = function(element, enable) {
	        if (enable) {
	            element.style[durationProperty] = '';
	        } else {
	            element.style[durationProperty] = '0s';
	        }
	    }


	    // Request Animation Frame
	    // courtesy of @paul_irish
	    exports.requestAnimationFrame = (function() {
	        var prefixed = (window.requestAnimationFrame       || 
	                        window.webkitRequestAnimationFrame || 
	                        window.mozRequestAnimationFrame    || 
	                        window.oRequestAnimationFrame      || 
	                        window.msRequestAnimationFrame     || 
	                        function( callback ){
	                            window.setTimeout(callback, 1000 / 60);
	                        });

	        var requestAnimationFrame = function() {
	            prefixed.apply(window, arguments);
	        };

	        return requestAnimationFrame;
	    })();

	    return exports;

	})(Mobify.$);

	Mobify.UI.Carousel = (function($, Utils) {
	    var defaults = {
	            dragRadius: 10
	          , moveRadius: 10
	          , classPrefix: undefined
	          , classNames: {
	                outer: 'carousel'
	              , inner: 'carousel-inner'
	              , item: 'item'
	              , center: 'center'
	              , touch: 'has-touch'
	              , dragging: 'dragging'
	              , active: 'active'
	              , fluid: 'fluid'
	            }
	        }
	       , has = $.support;

	    // Constructor
	    var Carousel = function(element, options) {
	        this.setOptions(options);
	        this.initElements(element);
	        this.initOffsets();
	        this.initAnimation();
	        this.bind();
	    };

	    // Expose Dfaults
	    Carousel.defaults = defaults;
	    
	    Carousel.prototype.setOptions = function(opts) {
	        var options = this.options || $.extend({}, defaults, opts);
	        
	        /* classNames requires a deep copy */
	        options.classNames = $.extend({}, options.classNames, opts.classNames || {});

	        /* By default, classPrefix is `undefined`, which means to use the Mobify-wide level prefix */
	        options.classPrefix = options.classPrefix || Mobify.UI.classPrefix;

	        
	        this.options = options;
	    };

	    Carousel.prototype.initElements = function(element) {
	        this._index = 1;  // 1-based index
	        
	        this.element = element;
	        this.$element = $(element);
	        this.$inner = this.$element.find('.' + this._getClass('inner'));

	        this.$items = this.$inner.children();
	        
	        this.$start = this.$items.eq(0);
	        this.$sec = this.$items.eq(1);
	        this.$current = this.$items.eq(this._index - 1);  // convert to 0-based index

	        this._length = this.$items.length;
	        this._alignment = this.$element.hasClass(this._getClass('center')) ? 0.5 : 0;

	        this._isFluid = this.$element.hasClass(this._getClass('fluid'));
	    };

	    Carousel.prototype.initOffsets = function() {
	        this._offsetDrag = 0;
	    }

	    Carousel.prototype.initAnimation = function() {
	        this.animating = false;
	        this.dragging = false;
	        this._needsUpdate = false;
	        this._enableAnimation();
	    };


	    Carousel.prototype._getClass = function(id) {
	        return this.options.classPrefix + this.options.classNames[id];
	    };


	    Carousel.prototype._enableAnimation = function() {
	        if (this.animating) {
	            return;
	        }

	        Utils.setTransitions(this.$inner[0], true);
	        this.$inner.removeClass(this._getClass('dragging'));
	        this.animating = true;
	    }

	    Carousel.prototype._disableAnimation = function() {
	        if (!this.animating) {
	            return;
	        }
	        
	        Utils.setTransitions(this.$inner[0], false);
	        this.$inner.addClass(this._getClass('dragging'));
	        this.animating = false;
	    }

	    Carousel.prototype.update = function() {
	        /* We throttle calls to the real `_update` for efficiency */
	        if (this._needsUpdate) {
	            return;
	        }

	        var self = this;
	        this._needsUpdate = true;
	        Utils.requestAnimationFrame(function() {
	            self._update();
	        });
	    }

	    Carousel.prototype._update = function() {
	        if (!this._needsUpdate) {
	            return;
	        }

	        var $current = this.$current
	          , $start = this.$start
	          , currentOffset = $current.prop('offsetLeft') + $current.prop('clientWidth') * this._alignment
	          , startOffset = $start.prop('offsetLeft') + $start.prop('clientWidth') * this._alignment
	          , x = Math.round(-(currentOffset - startOffset) + this._offsetDrag);

	        Utils.translateX(this.$inner[0], x);

	        this._needsUpdate = false;
	    }

	    Carousel.prototype.bind = function() {
	        var abs = Math.abs
	            , dragging = false
	            , canceled = false
	            , dragRadius = this.options.dragRadius
	            , xy
	            , dx
	            , dy
	            , dragThresholdMet
	            , self = this
	            , $element = this.$element
	            , $inner = this.$inner
	            , opts = this.options
	            , lockLeft = false
	            , lockRight = false
	            , windowWidth = $(window).width();

	        function start(e) {
	        	
	            if (!has.touch) e.preventDefault();
	            
	            dragging = true;
	            canceled = false;

	            xy = Utils.getCursorPosition(e);
	            dx = 0;
	            dy = 0;
	            dragThresholdMet = false;

	            // Disable smooth transitions
	            self._disableAnimation();

	            lockLeft = self._index == 1;
	            lockRight = self._index == self._length;
	        }

	        function drag(e) {
	        	
	            if (!dragging || canceled) return;

	            var newXY = Utils.getCursorPosition(e)
	              , dragLimit = self.$element.width();
	            dx = xy.x - newXY.x;
	            dy = xy.y - newXY.y;

	            if (dragThresholdMet || abs(dx) > abs(dy) && (abs(dx) > dragRadius)) {
	                dragThresholdMet = true;
	                e.preventDefault();
	                
	                if (lockLeft && (dx < 0)) {
	                    dx = dx * (-dragLimit)/(dx - dragLimit);
	                } else if (lockRight && (dx > 0)) {
	                    dx = dx * (dragLimit)/(dx + dragLimit);
	                }
	                self._offsetDrag = -dx;
	                self.update();
	            } else if ((abs(dy) > abs(dx)) && (abs(dy) > dragRadius)) {
	                canceled = true;
	            }
	        }

	        function end(e) {
	        	
	            if (!dragging) {
	                return;
	            }

	            dragging = false;
	            
	            self._enableAnimation();

	            if (!canceled && abs(dx) > opts.moveRadius) {
	                // Move to the next slide if necessary
	                if (dx > 0) {
	                    self.next();
	                } else {
	                    self.prev();
	                }
	            } else {
	                // Reset back to regular position
	                self._offsetDrag = 0;
	                self.update();
	            }

	        }

	        function click(e) {
	            if (dragThresholdMet) e.preventDefault();
	        }
	       
	        $inner
	            .bind(Utils.events.down + '.carousel', start)
	            .bind(Utils.events.move + '.carousel', drag)
	            .bind(Utils.events.up + '.carousel', end)
	            .bind('click.carousel', click)
	            .bind('mouseout.carousel', end);

	        $element.bind('click', '[data-slide]', function(e){
	            e.preventDefault();
	            var action = $(this).attr('data-slide')
	              , index = parseInt(action, 10);

	            if (isNaN(index)) {
	                self[action]();
	            } else {
	                self.move(index);
	            }
	        });

	        $element.on('afterSlide', function(e, previousSlide, nextSlide) {
	            self.$items.eq(previousSlide - 1).removeClass(self._getClass('active'));
	            self.$items.eq(nextSlide - 1).addClass(self._getClass('active'));

	            self.$element.find('[data-slide=\'' + previousSlide + '\']').removeClass(self._getClass('active'));
	            self.$element.find('[data-slide=\'' + nextSlide + '\']').addClass(self._getClass('active'));
	        });

	        $(window).on('resize orientationchange', function(e) {
	            // Disable animation for now to avoid seeing 
	            // the carousel sliding, as it updates its position.
	            // Animation will be enabled automatically when you're swiping.
	            // Don't update Carousel on window height change
	            if(windowWidth == $(window).width())
	                return;

	            self._disableAnimation();
	            windowWidth = $(window).width();
	            self.update();
	        });

	        $element.trigger('beforeSlide', [1, 1]);
	        $element.trigger('afterSlide', [1, 1]);

	        self.update();

	    };

	    Carousel.prototype.unbind = function() {
	        this.$inner.off();
	    }

	    Carousel.prototype.destroy = function() {
	        this.unbind();
	        this.$element.trigger('destroy');
	        this.$element.remove();
	        
	        // Cleanup
	        this.$element = null;
	        this.$inner = null;
	        this.$start = null;
	        this.$current = null;
	    }

	    Carousel.prototype.move = function(newIndex, opts) {
	        var $element = this.$element
	            , $inner = this.$inner
	            , $items = this.$items
	            , $start = this.$start
	            , $current = this.$current
	            , length = this._length
	            , index = this._index;
	                
	        opts = opts || {};

	        // Bound Values between [1, length];
	        if (newIndex < 1) {
	            newIndex = 1;
	        } else if (newIndex > this._length) {
	            newIndex = length;
	        }
	        
	        // Bail out early if no move is necessary.
	        if (newIndex == this._index) {
	            //return; // Return Type?
	        }

	        // Making sure that animation is enabled before moving
	        this._enableAnimation();

	        // Trigger beforeSlide event
	        $element.trigger('beforeSlide', [index, newIndex]);


	        // Index must be decremented to convert between 1- and 0-based indexing.
	        this.$current = $current = $items.eq(newIndex - 1);

	        this._offsetDrag = 0;
	        this._index = newIndex;
	        this.update();
	        // Trigger afterSlide event
	        $element.trigger('afterSlide', [index, newIndex]);
	    };

	    Carousel.prototype.next = function() {
	        this.move(this._index + 1);
	    };
	    
	    Carousel.prototype.prev = function() {
	        this.move(this._index - 1);
	    };

	    return Carousel;

	})(Mobify.$, Mobify.UI.Utils);

    /**
        jQuery interface to set up a carousel


        @param {String} [action] Action to perform. When no action is passed, the carousel is simply initialized.
        @param {Object} [options] Options passed to the action.
    */
    $.fn.carousel = function (action, options) {
        var initOptions = $.extend({}, $.fn.carousel.defaults);

        // Handle different calling conventions
        if (typeof action == 'object') {
            initOptions = $(initOptions, action);
            options = null;
            action = null;
        }

        this.each(function () {
            var $this = $(this)
              , carousel = this._carousel;

            
            if (!carousel) {
                carousel = new Mobify.UI.Carousel(this, initOptions);
            }

            if (action) {
                carousel[action](options);

                if (action === 'destroy') {
                    carousel = null;
                }
            }
            
            this._carousel = carousel;
        })

        return this;
    };

    $.fn.carousel.defaults = {};

})(menus_jQuery);



/**
	Extend Lightbox wrapper module
		- does device detection
		- initializes apropriate pluggin for detected device (fancybox or extendMobile)
*/

(function($) { 
	
	var createMobileMarkup = function(){
	   var markup =
              $('<div id="mobile-gallery">' +
                    '<div class="m-carousel m-fluid m-carousel-photos">' +
                        '<div id="m-carousel-inner" class="m-carousel-inner">' +
                        '</div>' +
                    '</div>' +
              '</div>');
        markup.appendTo('body');

    };
    var createCarousel = function(){
        var items = $('#mobile-tmp a');
        $(items.get()).each(function(){
            var index = $(this).index() + 1;
            var newHref = $(this).attr('href');
            var itemCaption = $(this).attr('title');
            var mitem = $('<div class="m-item"></div>');
            $('<img />')
                    .attr('src',newHref)
                    .appendTo(mitem)
                    .parent().append('<div class="item-caption xtd-mobile-caption-title">'
                            + itemCaption +  '<span class="xtd-mobile-caption-number">'+ index + '/' + items.length +  '</span></div>');
            $('#overlay-mobile').fadeIn(0);
            mitem.appendTo(".m-carousel-inner");


        });
    };



    function initCarousel(e){
       
        $(e).carousel({
            dragRadius: 200
            , moveRadius: 200
            , classPrefix: undefined
            , classNames: {
                outer: "carousel"
                , inner: "carousel-inner"
                , item: "item"
                , touch: "has-touch"
                , dragging: "dragging"
                , active: "active"
            }
        })
    }

     var centerMobileGalleryVertically = function(gallery){
    	var zoom = (window.screen.availHeight / window.innerHeight);
     	var zoomW = (window.screen.availWidth / window.innerWidth);
     	
         var self = $(this);
         var galleryImage = self.find('img');

         gallery.find('img').each(function(){
             $(this).load(function(){
             	//WIP -  set natural height & width on load as data attributes for correct centering 
                 $(this).parent().attr({
                     "data-image-width":$(this)[0].naturalWidth,
                     "data-image-height":$(this)[0].naturalHeight
                 })
                 .css({
                     'margin-top' : Math.abs(Math.round(parseInt(parseInt(window.innerHeight) - $(this).height())*0.5))
                 });
             });
         });
         //alert($(window).width()+ " .. " + window.innerWidth);
         gallery.css({
             'height' : Math.abs(Math.round(parseInt(window.innerHeight)))
         });
         gallery.css({
             'width' : Math.abs(Math.round(parseInt(window.innerWidth)))
         });

         gallery.find('.m-item').each(function(){
         	var self = this;
            $(this).css({
                'margin-top' : Math.abs(Math.round(parseInt(parseInt(window.innerHeight) - $(this).height())*0.5))
            })
         });
    };

     var centerMobileGallery = function(gallery){
    	// if(window.flexiCssMenus.browser.name != 'msie') { 
    	 	centerMobileGalleryVertically(gallery);
    	 	return;
    	// }
    	var zoom = (window.screen.availHeight / window.innerHeight);
     	var zoomW = (window.screen.availWidth / window.innerWidth);
     	
          var self = $(this);
         var galleryImage = self.find('img');
         gallery.find('img').each(function(){
             $(this).load(function(){
             	//WIP -  set natural height & width on load as data attributes for correct centering 
                 $(this).parent().attr({
                     "data-image-width":$(this)[0].naturalWidth,
                     "data-image-height":$(this)[0].naturalHeight
                 })
                 .css({
                     'margin-top' : Math.abs(Math.round(parseInt($(window).height() - $(this).height())*0.5)) / zoom
                 });
            

             });
         });



         gallery.find('.m-item').each(function(){
            $(this).css({
                'margin-top' : Math.abs(Math.round(parseInt($(window).height() - $(this).height())*0.5) / zoom)
            })
            
         });
             gallery.css({
                 'height' : Math.abs(Math.round(parseInt($(window).height())))
             });
             gallery.css({
                 'width' : Math.abs(Math.round(parseInt($(window).width() *0.9)))
             });
             gallery.css({
                 'padding-left' :Math.abs(Math.round(parseInt($(window).width() - $(gallery).width()) / 2) / zoom)
             });
    };





     var preventScroll = function(){
        var body = $('body');
        if(body.hasClass('no-scroll') !== true){
            body.addClass('no-scroll')
        }
    };

    function isFunction(arg) {
    	if(arg && typeof arg === 'function') {
			return true;
		}
		return false;
    }


    var fixScroll = function(){
        var body = menus_jQuery('body');
        var fixer = 'xtd-body-fix';
            if(!body.hasClass(fixer)){
                body.addClass(fixer);
            }
    };
    var fixPosition = function(){
        var elem = menus_jQuery('#fancybox-wrap');
        var top = Math.round(parseInt((menus_jQuery(window).height() - elem.height())/2));
        var left = Math.round(parseInt((menus_jQuery(window).width() - elem.width())/2));
    };

    var addPIE = function(){
        menus_jQuery("body").addClass('xtd-body-fix');
        menus_jQuery(".fb-outer-wrapper").find('div').each(function(){
            if (window.PIE) PIE.attach(this)
        })
    };

    var fixPerspective = function(){
        var magicNumber = 1300;
        var reference = 1080;
        try{
        	var perspectiveValue = Math.round(($(document).height() / reference) * magicNumber);
            if(menus_jQuery(document).height() > menus_jQuery(window).height()){
                menus_jQuery('#fancybox-xtdLightbox-effects').css({
                    '-webkit-perspective' : perspectiveValue,
                    '-moz-perspective' : perspectiveValue,
                    'perspective' : perspectiveValue

                });
            }
        }
        catch (e){
            //alert(e)
        }
    };

    $(window).resize(function(e){
    
        e.preventDefault();
        // fixed for OnePageSite
        // e.stopImmediatePropagation();
        var  screenWidth = $(window).width();
        var  screenHeight = $(window).height();
      
       var gallery = $('#mobile-gallery');
       if(gallery.length !== 0){


           if (gallery.height !== $(window).height() || gallery.width !== $(window).width()){
               centerMobileGallery(gallery);


           }
        
       }
    });
/*
    $(window).bind('orientationchange', function(){
        if($('#mobile-gallery').length = 0){
            $.xtd_fancybox.resize();
        }
    });*/

    $.fn.extendLightbox = function(options) {

		return $(this).each(function() { 
			
			if (!options.relAttr) {
				options.relAttr = "rel";
				if ($(this).attr("data-rel")) {
					options.relAttr = "data-rel";
				}
			}
			var relAttr = options.relAttr;
			
			// if we're on a mobile device
			if(isTabletDevice && options.type == "image") { 
				$(this).click(function(e) { 
					e.preventDefault();
					
					try { 
						
						var rel = $(this).attr(relAttr);
						var overlayMobile = $('#overlay-mobile');
	                    if($('#mobile-tmp').length === 0){
	                        $('<div id="mobile-tmp" class="hide"></div>').appendTo('body');
	                    }
       					
        				//$('head').append('<meta id ="extViewportMeta" name="viewport" content="width=device-width,  initial-scale=1.0">');

	                    if(overlayMobile.length === 0){
	                    	mobileClose =  $('<div id="xtd-mobile-close-button"></div>').prependTo('body');
	                       overlayMobile = $('<div id="overlay-mobile" class="hide"></div>').prependTo('body');
	                     
	                       overlayMobile.bind('touchstart touch drag',function(e){
                                $('#mobile-tmp').empty();
                                $('#mobile-gallery').carousel('destroy');
                               $('#mobile-gallery-wrap').remove();
                                $(this).fadeOut();
                                e.preventDefault();
	                        });
								
                            $('#xtd-mobile-close-button').bind('click touchstart', function(){
                                $('#mobile-tmp').empty();
                                $('#mobile-gallery').carousel('destroy');
                                $('#mobile-gallery-wrap').remove();
                                $(this).add(overlayMobile).remove();
                                //$('head').append('<meta id ="extViewportMeta" name="viewport" content="width=device-width;  maximum-scale=1.0">');
                            })
	                    }

	                   

		                $('a[' + relAttr + '=' + rel + ']').clone().appendTo('#mobile-tmp');
		                createMobileMarkup();
		                createCarousel();
		                var gallery = $('#mobile-gallery');
	                   
		                initCarousel(gallery);


					    if(window.flexiCssMenus.browser.name != 'msie') { 

					    	var zoom = (window.screen.availHeight / window.innerHeight);
		                    var transform = "scale("+(1)+","+(1)+")";
		                 	gallery[0].style.transform = transform;
					        gallery[0].style.oTransform = transform;
					        gallery[0].style.msTransform = transform;
					        gallery[0].style.mozTransform = transform;
					        gallery[0].style.webkitTransform = transform;

						      var hammertime = Hammer(gallery[0], {
						        transform_always_block: true,
						        transform_min_scale: 1,
						        drag_block_horizontal: true,
						        drag_block_vertical: true,
						        drag_min_distance: 0
						    });

			               	var posX=0, posY=0,
						        scale=1, last_scale,
						        rotation= 1, last_rotation;
			                 hammertime.on('touch drag transform', function(ev) {
			                 	var rect = $('.m-active img');
			                 	
			                 	var transform;
			                 	 switch(ev.type) {
						            case 'touch':
						                rect.data('last_scale', scale);
						                rect.data('last_rotation', rotation);
						               
						                ev.stopImmediatePropagation();
						                return;
						                break;
						            case 'transform':
						            	var rect = $('.m-active img');
						            	var last_scale = rect.data('last_scale') ? rect.data('last_scale') : 1;
						            	var last_rotation = rect.data('last_scale') ? rect.data('last_scale') : 1;
						            	rotation = last_rotation + ev.gesture.rotation;
			                			scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
			                			ev.stopImmediatePropagation();

			                			transform = "scale("+scale+","+scale+") ";// +  "rotate("+rotation+"deg) ";
			                		
			                			break;
			                	}

						        rect[0].style.transform = transform;
						        rect[0].style.oTransform = transform;
						        rect[0].style.msTransform = transform;
						        rect[0].style.mozTransform = transform;
						        rect[0].style.webkitTransform = transform;

			                 });
						}


		             centerMobileGallery(gallery);
		             } catch(e) { 
		             	alert(e);
		             }

				
								});
			} else { 
				// otherwise call fancybox

				if(isMobileDevice) { 
					options.width = "90%";
					options.height = "90%";
				}
				var fancyboxOptions = $.extend({}, options);
				options = $.extend(options, { 
					onComplete : function() { 
						if(isFunction(fancyboxOptions.onComplete)) { 
							fancyboxOptions.onComplete();
						}
					},
					onCleanup : function() { 
						if(isFunction(fancyboxOptions.onCleanup)) { 
							fancyboxOptions.onCleanup();
						}
					},
					onStart : function() { 
						fixPerspective();
						addPIE();
		              	fixScroll();
		               	fixPosition();
						if(isFunction(fancyboxOptions.onStart)) { 
							fancyboxOptions.onStart();
						}
					},
					onClosed : function() { 
						menus_jQuery('body').removeClass('xtd-body-fix');
						if(isFunction(fancyboxOptions.onClosed)) { 
							fancyboxOptions.onClosed();
						}
					}
				});

				$(this).xtd_fancybox(options);

				$(window).on('resize orientationchange', function(){
				    $.xtd_fancybox.resize();
				});
			}

		})
	}



	/** device detection */
	var DeviceDetect;

	if (!DeviceDetect) {
		DeviceDetect = new Object;
	}

	DeviceDetect.UserAgent = navigator.userAgent.toLowerCase();

	DeviceDetect.isMobile = function (viewportWidth, maxWidth) {
		var deviceMatch = (/iphone|ipod|android|blackberry|mini|windows\sce|windows\sphone|iemobile|palm|webos|series60|symbianos|meego/i.test(DeviceDetect.UserAgent));
		var sizeMatch;
		if(window.matchMedia) { 
			sizeMatch = window.matchMedia("(max-width:" + (maxWidth) + "px)").matches;
		} else { 
			sizeMatch = viewportWidth < maxWidth;
		}
		return deviceMatch || sizeMatch;
	}

	/*
	 *	IsTablet() - Return true if this is a tablet device.
	 */
	DeviceDetect.isTablet = function (viewportWidth, minWidth, maxWidth) {
		var UA = DeviceDetect.UserAgent;
		var is_touch_device = 'ontouchstart' in document.documentElement;
		
		var deviceMatch = (/ipad|Win64|tablet/i.test(UA));
		var sizeMatch;

		if(window.matchMedia) { 
			sizeMatch = window.matchMedia("(max-width:" + (maxWidth) + "px) and (min-width:" + (minWidth+1) + "px)").matches;
		} else { 
			sizeMatch = viewportWidth < maxWidth && viewportWidth >= minWidth;
		}
		return is_touch_device && (deviceMatch || sizeMatch);
	}

	var correctedViewportW = (function (win, docElem) {

	    var mM = win['matchMedia'] || win['msMatchMedia']
	      , client = docElem['clientWidth']
	      , inner = win['innerWidth']

	    return mM && client < inner && true === mM('(min-width:' + inner + 'px)')['matches']
	        ? function () { return win['innerWidth'] }
	        : function () { return docElem['clientWidth'] }

	}(window, document.documentElement));


	var viewportWidth = correctedViewportW();
	var mobileCheck = DeviceDetect.isMobile(viewportWidth, 480)
	var isMobileDevice = mobileCheck;
	var tabletCheck = DeviceDetect.isTablet(viewportWidth, 480, 750);
	var isTabletDevice = tabletCheck || mobileCheck;

})(menus_jQuery);



//ie css3 script//

(function($) {
	function getBrowser() {
		// jquery code//
		var ua = navigator.userAgent.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
		
		var ver = match[ 2 ] || "0";
		var fi = ver.indexOf('.');
		var fi2 = ver.indexOf('.', fi);
		if (fi2 != -1) {
			ver = parseFloat(ver.substring(0, fi2));
		}
		return {
			name: match[ 1 ] || "",
			version: ver
		};
	}
	
	function getScriptFolder() {
		var scripts = document.getElementsByTagName('SCRIPT');
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].getAttribute('src');
			if (src && src.indexOf('extendLightbox.js') != -1) {
				if (src.lastIndexOf('/') != -1) {
					return src.substring(0, src.lastIndexOf('/') + 1);
				} else {
					return '';
				}
			}
		}
	}
	
	var browser = getBrowser();
	
	if (!window.flexiCssMenus) window.flexiCssMenus = {};
	window.flexiCssMenus.browser = getBrowser();
	
	var scriptFolder = getScriptFolder();
	var ssFolder = scriptFolder;
	
	function addEventListener(element, type, listener) {
		if (element.addEventListener) {
			element.addEventListener(type, listener, false); 
		} else if (element.attachEvent)  {
			element.attachEvent('on' + type, listener);
		}
	}
	
	var addPropertyFails = {};
	
	function addBehavior() {
		function addPropertyInRules(ss, url) {
			if (!addPropertyFails[url]) addPropertyFails[url] = 0;
			if (!ss.rules.length) {
				addPropertyFails[url]++;
				if (ss.owningElement.readyState != "complete" && addPropertyFails[url] < 500) {
					setTimeout( (function(ss, url) {
						return function() {
							addPropertyInRules(ss, url);
						};
					})(ss, url) , 10);
				}
			} else {
				for (var j = ss.rules.length - 1; j >= 0; j--) {
					var rule = ss.rules[j];
					rule.style.behavior =  "url(" + url + ")";
				}
			}
		}
		
		var links = document.getElementsByTagName('LINK');
		for (var i = 0; i < links.length; i++) {
			var href = links[i].getAttribute('href');
			if (href) {
				if (href.indexOf('-ie.css') != -1) {
					var url = href.substring(0, href.lastIndexOf('/')) + "/PIE.htc";
					addPropertyInRules(links[i].styleSheet, url);
				}
			}
		}
	}
	
	var parsedLinks = [];
	
	function linkWasParsed(link) {
		for (var i = 0; i < parsedLinks.length; i++) {
			if (parsedLinks[i] == link) {
				return true;
			}
		}
		return false;
	}
	
	function existsInHead(link) {
		var links = document.getElementsByTagName('LINK');
		for (var i = 0; i < links.length; i++) {
			var href = links[i].getAttribute('href');
			if (href == link) {
				return true;
			}
		}
		return false;
	}
	
	function addIE9Links(){
		if (browser.name == "msie" && browser.version <= 9) {
			var links = document.getElementsByTagName('LINK');
			var length = links.length;
			for (var i = 0; i < length; i++) {
				var href = links[i].getAttribute('href');
				if (!linkWasParsed(href)) {
					parsedLinks.push(href);
					if (href && href.indexOf('http://') == -1 && href.indexOf('reset.css') == -1 && href.indexOf('-ie.css') == -1 && href.toLowerCase().indexOf(ssFolder.toLowerCase()) != -1) {
						if (!existsInHead(href.replace('.css', '-ie.css'))){ 
							document.createStyleSheet(href.replace('.css', '-ie.css'));
							parsedLinks.push(href.replace('.css', '-ie.css'));
						}
					}
				}
			}
		}
	}
	
	addIE9Links();
	addEventListener(window, "load", function() {
		// this is for link tags added after our script//
		addIE9Links();

		if (browser.name == "msie" && browser.version == 7) {
			window.setTimeout(function() {
				addBehavior();
			}, 1000);
		}
		
		if (browser.name == "msie" && browser.version <= 9 && browser.version != 7) {
			addBehavior();
		}
	});
})(menus_jQuery);


/*! Hammer.JS - v1.0.5 - 2013-04-07
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(t,e){"use strict";function n(){if(!i.READY){i.event.determineEventTypes();for(var t in i.gestures)i.gestures.hasOwnProperty(t)&&i.detection.register(i.gestures[t]);i.event.onTouch(i.DOCUMENT,i.EVENT_MOVE,i.detection.detect),i.event.onTouch(i.DOCUMENT,i.EVENT_END,i.detection.detect),i.READY=!0}}var i=function(t,e){return new i.Instance(t,e||{})};i.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},i.HAS_POINTEREVENTS=navigator.pointerEnabled||navigator.msPointerEnabled,i.HAS_TOUCHEVENTS="ontouchstart"in t,i.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android/i,i.NO_MOUSEEVENTS=i.HAS_TOUCHEVENTS&&navigator.userAgent.match(i.MOBILE_REGEX),i.EVENT_TYPES={},i.DIRECTION_DOWN="down",i.DIRECTION_LEFT="left",i.DIRECTION_UP="up",i.DIRECTION_RIGHT="right",i.POINTER_MOUSE="mouse",i.POINTER_TOUCH="touch",i.POINTER_PEN="pen",i.EVENT_START="start",i.EVENT_MOVE="move",i.EVENT_END="end",i.DOCUMENT=document,i.plugins={},i.READY=!1,i.Instance=function(t,e){var r=this;return n(),this.element=t,this.enabled=!0,this.options=i.utils.extend(i.utils.extend({},i.defaults),e||{}),this.options.stop_browser_behavior&&i.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),i.event.onTouch(t,i.EVENT_START,function(t){r.enabled&&i.detection.startDetect(r,t)}),this},i.Instance.prototype={on:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.addEventListener(n[i],e,!1);return this},off:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.removeEventListener(n[i],e,!1);return this},trigger:function(t,e){var n=i.DOCUMENT.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e;var r=this.element;return i.utils.hasParent(e.target,r)&&(r=e.target),r.dispatchEvent(n),this},enable:function(t){return this.enabled=t,this}};var r=null,o=!1,s=!1;i.event={bindDom:function(t,e,n){for(var i=e.split(" "),r=0;i.length>r;r++)t.addEventListener(i[r],n,!1)},onTouch:function(t,e,n){var a=this;this.bindDom(t,i.EVENT_TYPES[e],function(c){var u=c.type.toLowerCase();if(!u.match(/mouse/)||!s){(u.match(/touch/)||u.match(/pointerdown/)||u.match(/mouse/)&&1===c.which)&&(o=!0),u.match(/touch|pointer/)&&(s=!0);var h=0;o&&(i.HAS_POINTEREVENTS&&e!=i.EVENT_END?h=i.PointerEvent.updatePointer(e,c):u.match(/touch/)?h=c.touches.length:s||(h=u.match(/up/)?0:1),h>0&&e==i.EVENT_END?e=i.EVENT_MOVE:h||(e=i.EVENT_END),h||null===r?r=c:c=r,n.call(i.detection,a.collectEventData(t,e,c)),i.HAS_POINTEREVENTS&&e==i.EVENT_END&&(h=i.PointerEvent.updatePointer(e,c))),h||(r=null,o=!1,s=!1,i.PointerEvent.reset())}})},determineEventTypes:function(){var t;t=i.HAS_POINTEREVENTS?i.PointerEvent.getEvents():i.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],i.EVENT_TYPES[i.EVENT_START]=t[0],i.EVENT_TYPES[i.EVENT_MOVE]=t[1],i.EVENT_TYPES[i.EVENT_END]=t[2]},getTouchList:function(t){return i.HAS_POINTEREVENTS?i.PointerEvent.getTouchList():t.touches?t.touches:[{identifier:1,pageX:t.pageX,pageY:t.pageY,target:t.target}]},collectEventData:function(t,e,n){var r=this.getTouchList(n,e),o=i.POINTER_TOUCH;return(n.type.match(/mouse/)||i.PointerEvent.matchType(i.POINTER_MOUSE,n))&&(o=i.POINTER_MOUSE),{center:i.utils.getCenter(r),timeStamp:(new Date).getTime(),target:n.target,touches:r,eventType:e,pointerType:o,srcEvent:n,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return i.detection.stopDetect()}}}},i.PointerEvent={pointers:{},getTouchList:function(){var t=this,e=[];return Object.keys(t.pointers).sort().forEach(function(n){e.push(t.pointers[n])}),e},updatePointer:function(t,e){return t==i.EVENT_END?this.pointers={}:(e.identifier=e.pointerId,this.pointers[e.pointerId]=e),Object.keys(this.pointers).length},matchType:function(t,e){if(!e.pointerType)return!1;var n={};return n[i.POINTER_MOUSE]=e.pointerType==e.MSPOINTER_TYPE_MOUSE||e.pointerType==i.POINTER_MOUSE,n[i.POINTER_TOUCH]=e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==i.POINTER_TOUCH,n[i.POINTER_PEN]=e.pointerType==e.MSPOINTER_TYPE_PEN||e.pointerType==i.POINTER_PEN,n[t]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},i.utils={extend:function(t,n,i){for(var r in n)t[r]!==e&&i||(t[r]=n[r]);return t},hasParent:function(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1},getCenter:function(t){for(var e=[],n=[],i=0,r=t.length;r>i;i++)e.push(t[i].pageX),n.push(t[i].pageY);return{pageX:(Math.min.apply(Math,e)+Math.max.apply(Math,e))/2,pageY:(Math.min.apply(Math,n)+Math.max.apply(Math,n))/2}},getVelocity:function(t,e,n){return{x:Math.abs(e/t)||0,y:Math.abs(n/t)||0}},getAngle:function(t,e){var n=e.pageY-t.pageY,i=e.pageX-t.pageX;return 180*Math.atan2(n,i)/Math.PI},getDirection:function(t,e){var n=Math.abs(t.pageX-e.pageX),r=Math.abs(t.pageY-e.pageY);return n>=r?t.pageX-e.pageX>0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT:t.pageY-e.pageY>0?i.DIRECTION_UP:i.DIRECTION_DOWN},getDistance:function(t,e){var n=e.pageX-t.pageX,i=e.pageY-t.pageY;return Math.sqrt(n*n+i*i)},getScale:function(t,e){return t.length>=2&&e.length>=2?this.getDistance(e[0],e[1])/this.getDistance(t[0],t[1]):1},getRotation:function(t,e){return t.length>=2&&e.length>=2?this.getAngle(e[1],e[0])-this.getAngle(t[1],t[0]):0},isVertical:function(t){return t==i.DIRECTION_UP||t==i.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(t,e){var n,i=["webkit","khtml","moz","ms","o",""];if(e&&t.style){for(var r=0;i.length>r;r++)for(var o in e)e.hasOwnProperty(o)&&(n=o,i[r]&&(n=i[r]+n.substring(0,1).toUpperCase()+n.substring(1)),t.style[n]=e[o]);"none"==e.userSelect&&(t.onselectstart=function(){return!1})}}},i.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(t,e){this.current||(this.stopped=!1,this.current={inst:t,startEvent:i.utils.extend({},e),lastEvent:!1,name:""},this.detect(e))},detect:function(t){if(this.current&&!this.stopped){t=this.extendEventData(t);for(var e=this.current.inst.options,n=0,r=this.gestures.length;r>n;n++){var o=this.gestures[n];if(!this.stopped&&e[o.name]!==!1&&o.handler.call(o,t,this.current.inst)===!1){this.stopDetect();break}}return this.current&&(this.current.lastEvent=t),t.eventType==i.EVENT_END&&!t.touches.length-1&&this.stopDetect(),t}},stopDetect:function(){this.previous=i.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(t){var e=this.current.startEvent;if(e&&(t.touches.length!=e.touches.length||t.touches===e.touches)){e.touches=[];for(var n=0,r=t.touches.length;r>n;n++)e.touches.push(i.utils.extend({},t.touches[n]))}var o=t.timeStamp-e.timeStamp,s=t.center.pageX-e.center.pageX,a=t.center.pageY-e.center.pageY,c=i.utils.getVelocity(o,s,a);return i.utils.extend(t,{deltaTime:o,deltaX:s,deltaY:a,velocityX:c.x,velocityY:c.y,distance:i.utils.getDistance(e.center,t.center),angle:i.utils.getAngle(e.center,t.center),direction:i.utils.getDirection(e.center,t.center),scale:i.utils.getScale(e.touches,t.touches),rotation:i.utils.getRotation(e.touches,t.touches),startEvent:e}),t},register:function(t){var n=t.defaults||{};return n[t.name]===e&&(n[t.name]=!0),i.utils.extend(i.defaults,n,!0),t.index=t.index||1e3,this.gestures.push(t),this.gestures.sort(function(t,e){return t.index<e.index?-1:t.index>e.index?1:0}),this.gestures}},i.gestures=i.gestures||{},i.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,e){switch(t.eventType){case i.EVENT_START:clearTimeout(this.timer),i.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==i.detection.current.name&&e.trigger("hold",t)},e.options.hold_timeout);break;case i.EVENT_MOVE:t.distance>e.options.hold_threshold&&clearTimeout(this.timer);break;case i.EVENT_END:clearTimeout(this.timer)}}},i.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,e){if(t.eventType==i.EVENT_END){var n=i.detection.previous,r=!1;if(t.deltaTime>e.options.tap_max_touchtime||t.distance>e.options.tap_max_distance)return;n&&"tap"==n.name&&t.timeStamp-n.lastEvent.timeStamp<e.options.doubletap_interval&&t.distance<e.options.doubletap_distance&&(e.trigger("doubletap",t),r=!0),(!r||e.options.tap_always)&&(i.detection.current.name="tap",e.trigger(i.detection.current.name,t))}}},i.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:.7},handler:function(t,e){if(t.eventType==i.EVENT_END){if(e.options.swipe_max_touches>0&&t.touches.length>e.options.swipe_max_touches)return;(t.velocityX>e.options.swipe_velocity||t.velocityY>e.options.swipe_velocity)&&(e.trigger(this.name,t),e.trigger(this.name+t.direction,t))}}},i.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(n.options.drag_max_touches>0&&t.touches.length>n.options.drag_max_touches))switch(t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:if(t.distance<n.options.drag_min_distance&&i.detection.current.name!=this.name)return;i.detection.current.name=this.name,(i.detection.current.lastEvent.drag_locked_to_axis||n.options.drag_lock_to_axis&&n.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var r=i.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(t.direction=i.utils.isVertical(r)?0>t.deltaY?i.DIRECTION_UP:i.DIRECTION_DOWN:0>t.deltaX?i.DIRECTION_LEFT:i.DIRECTION_RIGHT),this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),n.trigger(this.name+t.direction,t),(n.options.drag_block_vertical&&i.utils.isVertical(t.direction)||n.options.drag_block_horizontal&&!i.utils.isVertical(t.direction))&&t.preventDefault();break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(2>t.touches.length))switch(n.options.transform_always_block&&t.preventDefault(),t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:var r=Math.abs(1-t.scale),o=Math.abs(t.rotation);if(n.options.transform_min_scale>r&&n.options.transform_min_rotation>o)return;i.detection.current.name=this.name,this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),o>n.options.transform_min_rotation&&n.trigger("rotate",t),r>n.options.transform_min_scale&&(n.trigger("pinch",t),n.trigger("pinch"+(1>t.scale?"in":"out"),t));break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,n){return n.options.prevent_mouseevents&&t.pointerType==i.POINTER_MOUSE?(t.stopDetect(),e):(n.options.prevent_default&&t.preventDefault(),t.eventType==i.EVENT_START&&n.trigger(this.name,t),e)}},i.gestures.Release={name:"release",index:1/0,handler:function(t,e){t.eventType==i.EVENT_END&&e.trigger(this.name,t)}},"object"==typeof module&&"object"==typeof module.exports?module.exports=i:(t.Hammer=i,"function"==typeof t.define&&t.define.amd&&t.define("hammer",[],function(){return i}))})(this),function(t,e){"use strict";t!==e&&(Hammer.event.bindDom=function(n,i,r){t(n).on(i,function(t){var n=t.originalEvent||t;n.pageX===e&&(n.pageX=t.pageX,n.pageY=t.pageY),n.target||(n.target=t.target),n.which===e&&(n.which=n.button),n.preventDefault||(n.preventDefault=t.preventDefault),n.stopPropagation||(n.stopPropagation=t.stopPropagation),r.call(this,n)})},Hammer.Instance.prototype.on=function(e,n){return t(this.element).on(e,n)},Hammer.Instance.prototype.off=function(e,n){return t(this.element).off(e,n)},Hammer.Instance.prototype.trigger=function(e,n){var i=t(this.element);return i.has(n.target).length&&(i=t(n.target)),i.trigger({type:e,gesture:n})},t.fn.hammer=function(e){return this.each(function(){var n=t(this),i=n.data("hammer");i?i&&e&&Hammer.utils.extend(i.options,e):n.data("hammer",new Hammer(this,e||{}))})})}(window.menus_jQuery||window.Zepto);
