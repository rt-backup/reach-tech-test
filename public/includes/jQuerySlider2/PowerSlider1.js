var PowerSlider1_json = 
	{"auto":true,"responsiveType":"fluid","fullWidth":true,"align":"center","vertical":false,"ease":"easeOut","continuous":true,"loop":false,"speed":"500","fadeDuration":"500","pause":"4000","stopAtInteraction":false,"delay":"3000","innernavbaritem.spacing":"0px","innernavbar.halign":"center","innernavbar.valign":"bottom","innernavbar.left":"0px","innernavbar.top":"0px","innernavbaritem.orientation":"horizontal","innerbullets.valign":"bottom","innerbullets.halign":"center","innerbullets.left":"0px","innerbulletsitem.orientation":"horizontal","innerbullets.top":"132px","sliderEffect":"goDown","innerbulletsitem.spacing":"5px","backgroundType":"predefined","width":"100%","height":"692px","gifPath":"includes/JQuerySlider/x.gif","innerslider.left":"40px","innerslider.top":"15px","innerheader.halign":"left","innerheader.valign":"top","innersubheader.halign":"left","innersubheader.valign":"top","innerparagraph.halign":"left","innerparagraph.valign":"top","innerimage.halign":"left","innerimage.valign":"top","innercontentbg.halign":"left","innercontentbg.valign":"top","enableParallax":true,"touch":false,"shuffle":false,"lazy":false,"pauseOnHover":true,"customText1.halign":"center","customText1.valign":"middle","canvasColor":"#ffffff","container.left":"","container.right":"auto","container.top":"","container.bottom":"auto","innerbulletsitem.left":"","innerbulletsitem.right":"auto","innerbulletsitem.top":"","innerbulletsitem.bottom":"auto","innerbulletsitem.width":"11px","innerbulletsitem.height":"11px","innerbulletsitem.shadowAngle":"2","innernavbaritem.left":"","innernavbaritem.right":"auto","innernavbaritem.top":"","innernavbaritem.bottom":"auto","innernavbaritem.width":"160px","innernavbaritem.height":"35px","innernavbar.right":"auto","innernavbar.bottom":"0px","innernavbar.width":"auto","innernavbaritem.shadowAngle":"0",".halign":"left",".valign":"top","innernavbar.height":"auto","innerpagination.valign":"top","innerpagination.halign":"left","innerbullets.enableShadow":false,"innerpagination.left":"35px","innerpagination.top":"35px","customText1.left":"0px","customText1.top":"-262px","innerbullets.width":"auto","innerbullets.height":"auto","customHTML1.left":"-200px","customHTML1.top":"220px","customHTML1.halign":"center","innernavbarli.left":"auto","innernavbarli.top":"auto","innernavbarli.min-height":"90px","innernavbaritemtitle.active.shadowAngle":"50","innernavbaritemsubtitle.active.shadowAngle":"50","innernavbaritem.active.shadowAngle":"0","innernavbaritem.active.enableShadow":false,"innernavbaritemsubtitle.shadowAngle":"50","innernavbaritemtitle.shadowAngle":"50","innerprogressbar.valign":"top","innerprogressbar.halign":"left","innerprogressbar.left":"0px","innerprogressbar.top":"0px","innerprogressbar.height":"8px","innerpagination.width":"auto","innerpagination.height":"auto","innerpagination.shadowAngle":"50","innerslider.width":"100%","innerprogressbar.hideOnMouseOut":false,"innerprogressbar.mouseOutEffect":"xtd.fade","innerprogressbar.mouseOutEffectEasing":"easeOut","innerprogressbar.mouseOutEffectDuration":"500","innerprogressbar.mouseOutEffectDelay":"0","innerbullets.hideOnMouseOut":false,"innerbullets.mouseOutEffect":"xtd.fade","innerbullets.mouseOutEffectEasing":"easeOut","innerbullets.mouseOutEffectDuration":"500","innerbullets.mouseOutEffectDelay":"0","innernavbar.hideOnMouseOut":false,"innernavbar.mouseOutEffect":"xtd.fade","innernavbar.mouseOutEffectEasing":"easeOut","innernavbar.mouseOutEffectDuration":"500","innernavbar.mouseOutEffectDelay":"0","hideOnMouseOut":false,"innerpagination.hideOnMouseOut":false,"innerpagination.mouseOutEffect":"xtd.fade","innerpagination.mouseOutEffectEasing":"easeOut","innerpagination.mouseOutEffectDuration":"500","innerpagination.mouseOutEffectDelay":"0","innernavbar.orientation":"horizontal","innernavbar.scrollerType":"precise","innernavbar.items":"4","parallaxDirection":"right","parallaxDuration":"500",".top":"0","customText1.effect":"transition.slideDownBig","parallaxWidth":2560,"enableShadow":false,"xtdcode":"754da4421273206edc1f40ab8e025114","innerslider.minWidth":"1140px","customText31.halign":"center","customText31.valign":"top","customText31.left":"104px","customText31.top":"206px","customText32.halign":"center","customText32.valign":"top","customText32.left":"269.5px","customText32.top":"279px","customText32.width":"603px","customText32.height":"115px","customText31.width":"auto","customText31.effect":"transition.slideRightBig","customText32.effect":"transition.slideRightBig","customText32.effectDelay":"300","customButton21.halign":"center","customButton21.valign":"top","customButton21.left":"27px","customButton21.top":"440px","customButton21.width":"120px","customButton21.effectDelay":"700","customButton21.effect":"transition.bounceRight","customVideo1.valign":"middle","customVideo1.halign":"right","customVideo1.left":"20px","customVideo1.top":"0px","customVideo1.width":"50%","customVideo1.height":"50%","innerprogressbar.enableShadow":false,"customText1.enableShadow":true,"customText2.valign":"middle","customText2.halign":"left","customText2.left":"70px","customText2.top":"0px","customText2.enableShadow":true,"customText2.effect":"transition.slideLeft","customText2.effectDelay":"500"};
	
var GalleryInstance = null;	

xtd_jQuery(document).ready(function(){
	var $ = xtd_jQuery;
	var jQuery = xtd_jQuery;
	
	$("#PowerSlider1Container").hide();
	
	// fix bug on webkit//
	if (jQuery.browser.webkit && document.readyState != "complete") {
		setTimeout( createJQuerySlider, 100 );
	} else {
		createJQuerySlider()
	}
		
	function createJQuerySlider() {

		if (document.readyState && document.readyState != "complete") {
			setTimeout( createJQuerySlider, 100 );
			return;
		}

		//show element first as height/width of auto elements is 0 if container is hidden//
		$("#PowerSlider1Container").show();
		
		// create the slider
		GalleryInstance = $("#PowerSlider1").jQuerySlider();
	}
});