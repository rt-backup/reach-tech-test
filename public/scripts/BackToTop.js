(function($) {

    $(document).ready(function() {
        $(".widget_backtotop").each(function() {
            $(this).click(function() {
                var duration = $(this).attr('data-duration');
                var easing = $(this).attr('data-easing');
                $('html, body').animate({
                    scrollTop: 0
                }, {
				  duration: parseInt(duration),
				  easing: easing
				});
            });
            if ($(this).css('position') == 'fixed') {
                $(this).hide();
            }
        });
        $(document).scroll(function() {
            $(".widget_backtotop").each(function() {
                var documentHeight = $(document).height();
                var showFrom = parseInt($(this).attr('data-from'));
				if (!showFrom)
					showFrom = 60;
                if ($(this).css('position') == 'fixed') {
                    if ( ($(document).scrollTop() + window.innerHeight/2) / documentHeight * 100 > showFrom && !$(document).scrollTop() == 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        });
    });

})(menus_jQuery);