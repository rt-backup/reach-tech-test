(function($) {

    /* Modernizr 2.7.1 (Custom Build) | MIT & BSD
     * Build: http://modernizr.com/download/#-csstransitions-testprop-testallprops-domprefixes-load
     */
    ;window.Modernizr=function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(prefixes.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b){for(var d in a){var e=a[d];if(!z(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}function C(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return y(b,"string")||y(b,"undefined")?A(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),B(e,b,c))}var d="2.7.1",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={},p={},q={},r=[],s=r.slice,t,u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e}),o.csstransitions=function(){return C("transition")};for(var D in o)v(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)v(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},w(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return A([a])},e.testAllProps=C,e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

    var doesCSS3 = Modernizr.csstransitions;

    window.scrollReveal = (function (window) {

        
        
        function scrollReveal(options) {

            this.docElem = window.document.documentElement;
            this.options = this.extend(this.defaults, options);

            if (this.options.init == true) this.init();
        }

        scrollReveal.prototype = {

            defaults: {
                effect :'slide',
                after:  '0s',
                enter:  'bottom',
                move:   '24px',
                over:   '0.66s',
                easing: 'ease-in-out',

                //  if 0, the element is considered in the viewport as soon as it enters
                //  if 1, the element is considered in the viewport when it's fully visible
                viewportFactor: 0.33,

                // if false, animations occur only once
                // if true, animations occur each time an element enters the viewport
                reset: false,

                // if true, scrollReveal.init() is automaticaly called upon instantiation
                init: true
            },

            instanceOptions : {
                effect :'slide',
                after:  '0s',
                enter:  'bottom',
                move:   '24px',
                over:   '0.66s',
                easing: 'ease-in-out',

                //  if 0, the element is considered in the viewport as soon as it enters
                //  if 1, the element is considered in the viewport when it's fully visible
                viewportFactor: 0.33

            },

            /*=============================================================================*/

            init: function () {
                this.scrolled = false;

                var self = this;

                //  Check DOM for the data-scrollReveal attribute
                //  and initialize all found elements.
                
                if(doesCSS3){
                    this.elems = Array.prototype.slice.call(this.docElem.querySelectorAll('[data-scrollReveal]'));
                }else{
                    this.elems = $(document).find('[data-scrollReveal]');       

                }
                
                $.each(this.elems,function(i,el){
                        if($(el).attr('style')){
                            $(el).attr('scrollReveal-style',$(el).attr('style'));
                        }
                        self.update(el);                
                });

                var scrollHandler = function () {
                    if (!self.scrolled) {
                        self.scrolled = true;
                        setTimeout(function () {
                            self._scrollPage();
                        }, 60);
                    }
                };

                var resizeHandler = function () {

                    //  If we're still waiting for settimeout, reset the timer.
                    if (self.resizeTimeout) {
                        clearTimeout(self.resizeTimeout);
                    }
                    function delayed() {
                        self._scrollPage();
                        self.resizeTimeout = null;
                    }
                    self.resizeTimeout = setTimeout(delayed, 200);
                };

                if(doesCSS3){
                    window.addEventListener('scroll', scrollHandler, false);
                    window.addEventListener('resize', resizeHandler, false);
                }else{
                    window.attachEvent('onscroll', scrollHandler, false);
                    window.attachEvent('onresize', resizeHandler, false);
                }
                var setme;
                /* xtd code */  
                if(setme) { 
                    var thediv = $('<div />').css({
                        'width' : '100%',
                        'background-color' : 'rgba(183, 207, 35, 0.82)',
                        'top' : '0px',
                        'left' : '0px',
                        'padding' : '20px 0px',
                        'z-index' : '99999',
                        'position' : 'fixed'
                    });
                    var textholder = $('<span></span>').css({
                        'text-align' : 'center',
                        'font-size' : '16px',
                        'width' : '100%',
                        'position' : 'relative',
                        'display' : 'block',
                        'color' : '#fff',
                        'font-family' : 'Tahoma, sans-serif'
                    }).html(xtdCodeMessage);

                    thediv.append(textholder).appendTo($('body'));
                }
                             
            },

            /*=============================================================================*/

            _scrollPage: function () {
                var self = this;
                $.each(this.elems,function(i,el){
                        self.update(el);
                });
                this.scrolled = false;
            },

            /*=============================================================================*/

            parseLanguage: function (el) {
                // get the effect name from the data-scrollReveal attribute
                var instanceName = el.getAttribute('data-scrollReveal');    
                // get the effect from window.scrollEffects
                var ourObj = window.scrollEffects[instanceName];
                var parsed = {};

                $.each(ourObj, function(key,valueObj){  
                    //console.log(key + "/" + valueObj );
                    
                    if(typeof valueObj === 'object'){
                        $.each(valueObj, function(key,parameters){
                            switch(key){
                                case 'from': 
                                    parsed.enter = parameters;
                                    break;
                                case 'distance':
                                    parsed.move     = parameters;
                                    parsed.distance = parameters;
                                    break;
                                default:
                                    parsed[key] = parameters;
                                    break;     
                            }
                        });
                    }else{
                        parsed[key] = valueObj;
                    }
                });
                var delay = el.getAttribute('data-delay');
               // console.log(delay);
                if(delay) { 
                	parsed['after'] = delay;
                }

               // console.log('parsat ' + JSON.stringify(parsed));
                return parsed;

            },


            /*=============================================================================*/

            update: function (el) {

                var css  = this.genCSS(el);
                //console.log('check element reset ' + parsed.reset);
                if (!el.getAttribute('data-scrollReveal-initialized')) {
                    if(doesCSS3){
                        el.setAttribute('style', css.initial);
                    }
                    el.setAttribute('data-scrollReveal-initialized', true);
                }
                
                if (!this.isElementInViewport(el, this.instanceOptions.viewportFactor)) {
                    //if false we have modern browsers
                    if(!doesCSS3){
                        //el.setAttribute('style', css.initial);
                        if (this.instanceOptions.reset) {                        
                            $(el).stop().fadeTo(10,0, function() {
                                 el.removeAttribute('data-scrollReveal-complete');
                            });
                        }
                    } else { 

                        if (this.instanceOptions.reset) {
                            el.setAttribute('style', css.initial + css.reset);  
                            el.removeAttribute('data-scrollReveal-complete');          
                        }
                    }
                    
                    return;
                }

                if (el.getAttribute('data-scrollReveal-complete')) return;

                if (this.isElementInViewport(el, this.instanceOptions.viewportFactor)) {
                     //if false we have modern browsers
                    if(!doesCSS3) {
                       if (!el.getAttribute('data-scrollReveal-ie-initialized')) {
                         $(el).stop().fadeTo(1,0);
                       }
                        
                       this.executeIEEffect(el, this.instanceOptions);
                    } else { 

                        el.setAttribute('style', css.target + css.transition);
                        //  Without reset enabled, we can safely remove the style tag
                        //  to prevent CSS specificy wars with authored CSS.
                       var self = this;
                            setTimeout(function () {
                                el.removeAttribute('style');
                                el.setAttribute('style', css.original);
                                 if (!self.instanceOptions.reset) {
                                    el.setAttribute('data-scrollReveal-complete',true);
                                }
                            }, css.totalDuration);
                            
                        
                          
                        
                    }
                    return;
                }
            },

            /*=============================================================================*/

            genCSS: function (el) {
                var parsed = this.parseLanguage(el),
                    enter,
                    axis;

                this.instanceOptions = $.extend(this.options, parsed);
                this.instanceOptions.reset = false;
                var style = "";
                if($(el).attr('scrollReveal-style')){
                    style = $(el).attr('scrollReveal-style');
                }    

                if (parsed.enter) {

                    if (parsed.enter == "top" || parsed.enter == "bottom") {
                        enter = parsed.enter;
                        axis = "y";
                    }

                    if (parsed.enter == "left" || parsed.enter == "right") {
                        enter = parsed.enter;
                        axis = "x";
                    }

                } else {

                    if (this.options.enter == "top" || this.options.enter == "bottom") {
                        enter = this.options.enter
                        axis = "y";
                    }

                    if (this.options.enter == "left" || this.options.enter == "right") {
                        enter = this.options.enter
                        axis = "x";
                    }
                }

                //  After all values are parsed, let's make sure our our
                //  pixel distance is negative for top and left entrances.
                //
                //  ie. "move 25px from top" starts at 'top: -25px' in CSS.

                if (enter == "top" || enter == "left") {
                    if (parsed.move === 'undefined') {
                        parsed.move = "-" + this.options.move;
                    }
                    else {
                        parsed.move = "-" + parsed.move;
                    }
                }

               
              

                    var dist   = parsed.move    || this.options.move,
                    dur        = parsed.over    || this.options.over,
                    delay      = parsed.after   || this.options.after,
                    easing     = parsed.easing  || this.options.easing;

                var customEase = "";

                var easingCSS = this.customEasing(parsed.easing); 

                var transition = "-webkit-transition: all " + dur + " " + customEase + " " + delay + ";" +
                    "-moz-transition: all " + dur + " " + customEase + " " + delay + ";" +
                    "-o-transition: all " + dur + " " + customEase + " " + delay + ";" +
                    "transition: all " + dur + " " + customEase + " " + delay + ";" +
                    "-webkit-perspective: 1000;" +
                    "-webkit-backface-visibility: hidden;";

                transition += easingCSS;
               // console.log(transition);
                //  The same as transition, but removing the delay for elements fading out.
                var reset = "-webkit-transition: all " + dur + " " + customEase + " 0s;" +
                    "-moz-transition: all " + dur + " " + customEase + " 0s;" +
                    "-o-transition: all " + dur + " " + customEase + " 0s;" +
                    "transition: all " + dur + " " + customEase + " 0s;" +
                    "-webkit-perspective: 1000;" +
                    "-webkit-backface-visibility: hidden;";

                var initial,target;

                switch (parsed.effect){
                    case "slide" :
                         initial = "-webkit-transform: translate" + axis + "(" + dist + ");" +
                            "-moz-transform: translate" + axis + "(" + dist + ");" +
                            "transform: translate" + axis + "(" + dist + ");" +
                            "opacity: "+ parsed.opacity +";";

                         target = "-webkit-transform: translate" + axis + "(0);" +
                            "-moz-transform: translate" + axis + "(0);" +
                            "transform: translate" + axis + "(0);" +
                            "opacity: 1;";
                    break;

                    case "zoom":
                         var zoomInitial = parsed.start;
                         var zoomFinal = 1;
                         var opacInitial = parsed.opacity;
                         var opacFinal = 1;
                         
                         initial = 
                            "-webkit-transform: scale(" + zoomInitial +");" +
                            "-moz-transform: scale(" + zoomInitial + ");" +
                            "transform: scale(" + zoomInitial + ");" +
                            "opacity:" + opacInitial +";";

                         target = 
                            "-webkit-transform: scale(" + zoomFinal +");" +
                            "-moz-transform: scale(" + zoomFinal + ");" +
                            "transform: scale(" + zoomFinal + ");" +
                            "opacity:" + opacFinal +";";
                    break;

                    case "fade":
                         initial =
                            "opacity: 0;";
                         target =
                            "opacity: 1;";
                    break;
                }


                
                
                if(initial == undefined){
                    initial="";
                }
                
                if(initial == target){
                    target="";
                }

                            return {
                    transition: transition,
                    original : style,
                    initial: style+initial,
                    target: style+target,
                    reset: reset,
                    totalDuration: ((parseFloat(dur) + parseFloat(delay)))
                };
                
            },

            getViewportH : function () {
                var client = this.docElem['clientHeight'],
                    inner = window['innerHeight'] ? window['innerHeight'] : $(window).height();   

                return (client < inner) ? inner : client;            
            },

            getOffset : function(el) {
                var offsetTop = 0,
                    offsetLeft = 0;

                do {
                    if (!isNaN(el.offsetTop)) {
                        offsetTop += el.offsetTop;
                    }
                    if (!isNaN(el.offsetLeft)) {
                        offsetLeft += el.offsetLeft;
                    }
                } while (el = el.offsetParent)

                return {
                    top: offsetTop,
                    left: offsetLeft
                }
            },

            isElementInViewport : function(el, h) {
                var scrolled = window.pageYOffset,
                    viewed = scrolled + this.getViewportH(),
                    elH = el.offsetHeight,
                    elTop = this.getOffset(el).top,
                    elBottom = elTop + elH,
                    h = h || 0;

                if(!doesCSS3){
                    scrolled = document.body.scrollTop || document.documentElement.scrollTop;
                    viewed = scrolled +this.getViewportH();
                }

                return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
            },

            customEasing: function(easing){
                var customEase;
                var easeCSS ="";
                var oldWebkit = false;
                switch(easing){
                    case 'quick-in'          : 
                        customEase = "cubic-bezier(0.315, -0.185, 0.000, 1.270)";
                        oldWebkit = "cubic-bezier(0.315, 0, 0.000, 1)";
                        break;
                    case 'accelerate'        : 
                        customEase = "cubic-bezier(0.885, 0.420, 0.000, 1.270)";
                        oldWebkit = "cubic-bezier(0.885, 0.420, 0.000, 1)";
                        break;
                    case 'super-fast'        : 
                        customEase = "cubic-bezier(0.000, 0.870, 0.000, 0.890)";
                        break;
                    case 'ease-in-out-back'  : 
                        customEase = "cubic-bezier(0.680, -0.550, 0.265, 1.550)";
                        oldWebkit = "cubic-bezier(0.680, 0, 0.265, 1)";
                        break;
                    case 'ease-in-out-expo'  : 
                        customEase = "cubic-bezier(1.000, 0.000, 0.000, 1.000)";
                        break;
                     case 'ease-out-back'    : 
                        customEase = "cubic-bezier(0.175, 0.885, 0.320, 1.275)";
                        oldWebkit = "cubic-bezier(0.175, 0.885, 0.320, 1)";
                        break;
                    case 'ease-out-circ'     : 
                        customEase = "cubic-bezier(0.075, 0.820, 0.165, 1.000)";
                        break;
                    case 'ease-in-back'      : 
                        customEase = "cubic-bezier(0.600, -0.280, 0.735, 0.045)";
                        oldWebkit = "cubic-bezier(0.600, 0, 0.735, 0.045)";
                        break;
                    case 'ease-in-circ'      : 
                        customEase = "cubic-bezier(0.600, 0.040, 0.980, 0.335)";
                        break;                         
                    case 'ease'              : 
                        customEase = "ease";
                        break;
                    case "ease-in"           : 
                        customEase = "ease-in";
                        break;
                    case "ease-in-out"       : 
                        customEase = "ease-in-out";
                        break;
                    case "ease-out"          : 
                        customEase = "ease-out";
                        break;    
                } 

                if(oldWebkit) { 
                    easeCSS += "-webkit-transition-timing-function:" + oldWebkit + ";";
                }
                var prefixes = ["-webkit-", "-moz-", "-o-", ""];
                for(var i=0; i<prefixes.length; i++) { 
                    easeCSS += prefixes[i] + "transition-timing-function:" + customEase + ";"
                }

                return easeCSS;
            },

            executeIEEffect : function(el, parsed) { 
                // console.log('gen css ie ------------- ' + el.className);
                el.setAttribute('data-scrollReveal-ie-initialized', true);
                var dist   = parsed.move    || this.options.move,
                dur        = parsed.over    || this.options.over,
                delay      = parsed.after   || this.options.after,
                easing     = parsed.easing  || this.options.easing;
                
                var from = parsed.enter;
                   
                
                var regex = new RegExp('\\d+');
                
                dur = dur.match(regex);
                dur = dur[0];
                delay = delay.match(regex);
                delay = delay[0];
                
                //console.log(' from:' + from + ' dist:' + dist);
                dist = dist.match(regex);
                dist = dist[0];
                
                var initial,target;
              
                          
                $(el).stop(true, true).fadeTo((parseInt(dur)+parseInt(delay)),1, function() {
                    // console.log('E IN VIEW ' + el.className);
                    el.setAttribute('data-scrollReveal-complete',true);
                    //console.log(el.className + '  '+ el.style.filter + ' ');
                });
             

            },


           
            extend: function (a, b){
                for (var key in b) {
                    if (b.hasOwnProperty(key)) {
                        a[key] = b[key];
                    }
                }
                return a;
            }

        }; // end scrollReveal.prototype

        return scrollReveal;
    })(window);

    var xtdCodeMessage = 'Th3 scroll 3ff3cts w3r3 cr34t3d us1ng DW RevealFX fr33 d3mo v3rs1on. Not for comm3rci4l us3!';
    xtdCodeMessage = xtdCodeMessage.replace(/4/g,'a').replace(/3/g,'e').replace(/1/g,'i');

    var config = {

        after: '0s',
        enter: 'bottom',
        //move: '24px',
        over: '0.66s',
        easing: 'ease-in-out',
        viewportFactor: 0.33,
        reset: true,
        init: false
    };

    window.extendScrollReveal = new scrollReveal(config);

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
     *  IsTablet() - Return true if this is a tablet device.
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


    window.viewportWidth = correctedViewportW();
    window.mobileCheck = DeviceDetect.isMobile(viewportWidth, 480)
    window.isMobileDevice = mobileCheck;
    window.tabletCheck = DeviceDetect.isTablet(viewportWidth, 480, 750);
    window.isTabletDevice = tabletCheck || mobileCheck;
    
    //console.log('DETECT PHONE/TABLET: ' + viewportWidth + ' ' + isMobileDevice + ' ' + isTabletDevice);   
    
  

}(menus_jQuery));