menus_jQuery(document).ready(function() {

    menus_jQuery("a[data-rel=LightBox1]").each(function() { 
        var self= menus_jQuery(this);
        menus_jQuery(this).extendLightbox({
            'padding'           : 10,
            'margin'            : 0,
            'type'              : 'iframe',
            'showNumbers'       : true,
            'showCloseButton'   : true,
            'overlayOpacity'    : 0.8,
            'overlayColor'      : '#000000',
            'showArrows'        : true,
            'showNavArrows'     : true,
            'titleShow'         : true,
            'transitionIn'      : 'none',
            'transitionOut'     : 'fade',
            'titlePosition'     : 'outside',
            'autoDimensions'    : false,
            'width'             : 500,
            'height'            : 500,
            'onComplete'        : function(){
   
            },
            'onCleanup'         : function(){
                menus_jQuery('#outside-controls').remove();
            },
            'onStart'           : function(){

            },
            'onClosed'           : function(){
                menus_jQuery('body').removeClass('body-fix');
            },

            'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
                var showControls = function(){
                    var lastItem = currentArray.length - 1;
                    if (currentOpts.showNumbers) return '<div class="image-number">' + (currentIndex + 1) + ' / ' + currentArray.length + '</div>';
                    else return '';
                };

                if(currentArray.length - 1) return '<div class="image-title">' + (title.length ? title : '') + '</div>' + showControls();
                else return '<div class="image-title">' + (title.length ? title : '') + '</div>' ;
     
            }
            
        });
    });
});
