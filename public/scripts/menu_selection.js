function getBrowser(){var e=navigator.userAgent.toLowerCase(),t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[],n=t[2]||"0",o=n.indexOf("."),i=n.indexOf(".",o);return-1!=i&&(n=parseFloat(n.substring(0,i))),{name:t[1]||"",version:n}}function updateSelectedMenu(e,t){for(var n=document.location.protocol+"//"+document.location.host+document.location.pathname,o=(document.getElementsByTagName("script"),e),i=0;i<o.childNodes.length;i++)if("LI"==o.childNodes[i].tagName&&(s=o.childNodes[i].children[0].href,"selected"==o.childNodes[i].children[0].className&&(o.childNodes[i].children[0].className=""),n==s)){o.childNodes[i].children[0].className="selected";break}if(t){var c,l=!0,d=getBrowser();if("msie"==d.name&&d.version<9&&(l=!1),l){var a="<option value=''>MENU</option>";a+="<option value=''>----------------------------------</option>"}else t.options.remove(0),(c=document.createElement("OPTION")).text="MENU",c.value="",t.options.add(c),(c=document.createElement("OPTION")).text="----------------------------------",c.value="",t.options.add(c);var s,r,u=!0;for(i=0;i<e.childNodes.length;i++)"LI"==e.childNodes[i].tagName&&(s=e.childNodes[i].children[0].href,r=e.childNodes[i].children[0].innerText||e.childNodes[i].children[0].textContent,n==s&&u?l?(a+="<option value='"+s+"' selected>"+r+"</option>",u=!1):((c=document.createElement("OPTION")).text=r,c.value=s,c.setAttribute("selected","selected"),t.options.add(c)):l?a+="<option value='"+s+"'>"+r+"</option>":((c=document.createElement("OPTION")).text=r,c.value=s,t.options.add(c)));l&&(t.innerHTML=a),mobileMenuChange(t)}}function mobileMenuChange(e){e.onchange=function(){e.selectedIndex<2||location.assign(e.options[e.selectedIndex].value)}}!function(e){e(document).ready(function(){e(".nav_menu").each(function(){e(this).html(e(this).html().replace(/\n/g,"").replace(/\r/g,"").replace(/([\s][ ])/g,"")),updateSelectedMenu(e(this).children("ul").get(0),e(this).children("select").get(0))})})}(menus_jQuery);