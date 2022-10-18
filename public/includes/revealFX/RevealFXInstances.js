var scrollEffects = {"revealFX1":{"effect":"fade","over":"1500ms","defaultDelay":"100ms","easing":"accelerate","viewportFactor":"0.30","preset":"3","init":false}};



(function($) {

    $(document).ready(function(){

		$('.revealFX').each(function() { 
			for(var prop in scrollEffects){
				if($(this).hasClass(prop)){
					$(this).attr('data-scrollReveal' , prop);
				}
			}
		});

		setTimeout(function() { 
			if(!window.isMobileDevice && !window.isTabletDevice){
				window.extendScrollReveal.init();
			}
		}, 1);

    });


}(menus_jQuery));