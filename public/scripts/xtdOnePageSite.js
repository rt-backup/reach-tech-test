var currentPageURL=document.location.toString(),isAnchor=!1;location.hash&&(isAnchor=!0,window.scrollTo(0,0));var xtdMenuSelectedClass="selected";menus_jQuery(document).ready(function(){if(menus_jQuery("script[onepage]")&&"false"!=menus_jQuery("script[onepage]").attr("onepage")){var e,n,t,r,a,o=parseInt(menus_jQuery("script[onepage]").attr("duration")),s=menus_jQuery("script[onepage]").attr("swing");"ontouchstart"in document.documentElement||menus_jQuery(window).scroll(function(){clearTimeout(r),r=setTimeout(l,20)}),menus_jQuery(window).bind("resize orientationchange",function(){clearTimeout(a),a=setTimeout(d,100)}),c(),"ontouchstart"in document.documentElement||l(),isAnchor&&(menus_jQuery(menus_jQuery.find('a[href="'+currentPageURL+'"]')).length>0?menus_jQuery(menus_jQuery.find('a[href="'+currentPageURL+'"]')).trigger("click"):menus_jQuery(menus_jQuery.find('a[href="#'+i(currentPageURL)+'"]')).trigger("click"))}function i(e){if(!e)return!1;var n=e.indexOf("#");if(n>-1){if(0==n)return e.replace("#","");var t=e.substring(n+1),r="";e.indexOf("?")>-1&&(r=e.substring(e.indexOf("?")+1));var a=/(https?|file):\/\//,o=window.location.pathname,s=e.replace("#"+t,"").replace(r,"").replace(a,"");if(e.match(a)?o=window.location.host+o:s=o.substring(0,o.lastIndexOf("/"))+"/"+s,o==s||o==s+"/")return t}return!1}function u(e,n){try{n.data("onepage-hash")?n.data("onepage-hash"):i(n.attr("href"));var t=!!n.data("onepage-section")&&n.data("onepage-section");if(t){e.preventDefault();var r=n.parent().parentsUntil("body").filter(function(){if("fixed"==menus_jQuery(this).css("position"))return menus_jQuery(this)}).eq(0),a=(r.attr("class"),0*window.innerHeight);menus_jQuery('div[class*="_menu_wrapper"]');r.length>0&&(a=r.outerHeight()+r.position().top);var u=t.offset().top-a;u<0&&(u=0),menus_jQuery("html, body").animate({scrollTop:u},o,s)}}catch(e){alert("error in xtd one page site script "+e)}}function c(){t=[],(n=menus_jQuery("a").filter(function(){var e=menus_jQuery(this),n=e.attr("href"),r=e.attr("target"),a=i(n);if(a&&function(e){return!e||"_self"==e}(r)){var o=menus_jQuery("#"+a);if(o.length>0)return e.data("onepage-section",o),"LI"==e.parent()[0].tagName&&(o.data("onepage-anchor")?(o.data("onepage-anchor").push(e[0]),console.log(o.data("onepage-anchor"))):o.data("onepage-anchor",e)),t.push(o),!0}return!1}).unbind("click.onePage").bind("click.onePage",function(e){u(e,menus_jQuery(this)),e.preventDefault(),e.stopPropagation()})).each(function(){if("LI"==menus_jQuery(this).parent()[0].tagName){var e=this;menus_jQuery(this).unbind("click.onePage"),menus_jQuery(this).parent().unbind("click").bind("click.onePage",function(n){u(n,menus_jQuery(e))})}});try{!function(e){var n;do{n=!1;for(var t=0;t<e.length-1;t++){var r=e[t],a=e[t+1];if(r.offset().top>a.offset().top){var o=e[t];e[t]=e[t+1],e[t+1]=o,n=!0}}}while(n)}(t)}catch(e){}}function l(){var r=menus_jQuery(window),a=r.scrollTop()+.5*window.innerHeight,o=[];t||c();for(var s=0;s<t.length;s++)t[s].offset().top<a&&o.push(t[s]);var i=t[t.length-1];r.scrollTop()+r.height()+50>=menus_jQuery(document).height()&&o.push(i);var u,l=(o=o[o.length-1])&&o.length?o[0].id:"";if(u=l,setTimeout(function(){u=u?"#"+u:"",history&&history.replaceState&&history.replaceState({},"",u)},0),0==l.length&&(n.closest("ul").find("."+xtdMenuSelectedClass).removeClass(xtdMenuSelectedClass),loc=(window.location+"").split("#")[0].replace(/\/$/,""),n.closest("ul").find('[href^="'+loc+'"]').eq(0).parent().andSelf().addClass(xtdMenuSelectedClass)),e!==l){e=l;try{n.filter("."+xtdMenuSelectedClass).each(function(){menus_jQuery(this).parent().andSelf().removeClass(xtdMenuSelectedClass)}),n.closest("ul").find("."+xtdMenuSelectedClass).removeClass(xtdMenuSelectedClass),o.data("onepage-anchor").parent().andSelf().addClass(xtdMenuSelectedClass)}catch(e){}}}function d(){c()}});