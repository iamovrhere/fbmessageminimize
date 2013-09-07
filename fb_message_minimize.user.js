// ==UserScript==
// @name           FB_edit_style
// @namespace      127.0.0.1
// @author         Jason
// @description    Edits the style to how I want it because, by damn...
// @include        http://www.facebook.com/home.php?sk=fl_87635016882
// @include        http://www.facebook.com/*
// @include        http://www.facebook.com/messages/*
// @include        https://www.facebook.com/home.php?sk=fl_87635016882
// @include        https://www.facebook.com/*
// @include        https://www.facebook.com/messages/*
// ==/UserScript==

/**
 * NOTE: @see codeInjection.js
 */

/**
 * NOTE changes :
 * 2012-10-25 	- Added @changes block
 * 		- Added/Updated code injector
 * 		- Added the button inserter
 * 2012-10-26	- Fully functional
 * 2012-11-21	- Patched - facebook broke it. I fixed it.
 * 2013-01-11	- Changed dates (of these comments) to be of form yyyy-mm-dd
 * 		- Patched - Message body broke. Moved the margin back of <div class="_2nb">
 * 2013-04-01	- Patched - Message body broke. The page was restyling causing the ad-bar to creep in from the right.
 * 			set width as !important.
 *  
 * 
 * @todo Add script to detect fb messages  - done
 * @todo find minimize panel button - done
 * @todo Add the custom message layout (with the minimize panel button   
 * 	+ resize message) -done
 *
 *
 * TODO Add cookie to pre-do tasks.
 * 
 * NOTE: class for messagebody used to be '.-cx-PRIVATE-webMessengerReadView__messagingScroller .uiScrollableAreaBody', or
 *				' .-cx-PRIVATE-webMessengerReadView__messagingScroller'
 * 				now: 'div ._2nc .uiScrollableAreaBody, div ._2nc, div .uiScrollableAreaBody'
 * 				
 * 				class '_2nb' surrounds the outer body of the messagebody.
 * 
 * 		-width is in css as ~width:524px !important;
 *	id for main page body = pagelet_web_messenger
 * 
 * 	class 'wmMasterView' for left side panel
 * 
 *	
 * Branching to its own script.
 */


 /**
 * Uses string manipulation on the code for injection into the page. 
 * NOTE: Must use the format 'var [start];' and 'var [end];' 
 *   encapsulating the code to be injected.
 * @param {String} inputScript to inject into page code	
 * @return {String} The code to be injected.
 */
 function codeTrimmer(fullScript, start, end)
 {	start 	= 'var '+start+';';
	end	= 'var '+end+';';
	var index1 = fullScript.indexOf(start) + start.length;
	var index2 = fullScript.indexOf(end);
	return fullScript.substring(index1,index2);
}


 /**
 * Injects code into the page giving it the id: "jason-script".
 * @param {String} inputScript to inject into page code.
 */
function codeSyringe(inputScript)
{   var script = document.createElement('script');
    script.setAttribute("type", "application/javascript"); script.setAttribute("id", "jason-script");
    var scriptText = document.createTextNode(inputScript);
    script.appendChild(scriptText);
    document.getElementsByTagName('head')[0].appendChild(script);
} 

////////////////////////////////////////////////////////////////////////// 
///// End of code injector block
//////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////// 
///// Fb messaging block start
//////////////////////////////////////////////////////////////////////////
{
var address =  '' + window.location;
 var http = /^http(s)?\:\/\/www\.facebook\.com\/messages(.*)/
 
 
 var webMessenger = document.getElementById('pagelet_web_messenger');
  
 var minButtonInner = '[&#x25C0; ]'; //&#x25B6; > and &#x25C0; < //&#x25B2; /\ and &#x25BC; \/
 var minButtonId = "jason-min-button"
  var buttonStyle = "\n\n/*Added for the sake of message minimize button*/\n"  +
		    "#"+minButtonId+" {color: #01359E; /*blue*/ font-weight: bold; cursor:pointer; "+
		    "padding: 8px 3px 8px 3px; float: left; margin-left: -30px;} \n" +
		    ".j-min-def  {background-color: #E8EFFC; /*lighter blue*/} \n" +
		    ".j-min-def:hover  {background-color: #DDE8FF; /*light blue*/} \n" +
		    ".j-min-min  {background-color: #3B5998; /*darker blue*/ color: white !important;} \n";
  
  function insertMinimizeButton()
  {
     var leftPanel = webMessenger.getElementsByTagName('div')[0] //div with random id
			      .getElementsByTagName('div')[0] //div with class -cx-PRIVATE-webMessengerBase__contentGrid clearfix
			      .getElementsByTagName('div')[0]; //div with class wmMasterView
   
    var minButton = document.createElement('div');
	minButton.setAttribute('id', minButtonId);
	minButton.setAttribute('class', 'j-min-def');
	minButton.setAttribute('onclick', 'jToggleMessageSide()');
	minButton.innerHTML = minButtonInner;
	
       leftPanel.insertBefore( minButton, leftPanel.firstChild);
    
  }
  
  function waitUntilLoad(func, count)
  {
    	      
   var leftPanel = webMessenger.getElementsByTagName('div')[0];
   
   //document.getElementById('pagelet_web_messenger').getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0]
   if (leftPanel)
   {	if (leftPanel = leftPanel.getElementsByTagName('div')[0])
	{  if (leftPanel.getElementsByTagName('div')[0]) 
	  {  func(); 
	    return;
	  }  
	}
   }
    else if(count > 120) //give up in 2 mins
      return;
    count +=1;
    setTimeout(function(){waitUntilLoad(func, count)},1000);	//retry
      
  }
 
/** 
 * Used as a wrapper to contain the script 
 */  
function scriptContainer()
{//Beginning of injection
var BEGIN_CODE_INJECTION;

  var jMinimized = 0;
  var sidePanelSuper ='';
  //var msgPanelSuper = ''
	      
  var sidePanelStyle = '';  //likely remains null, but just in case
  //var msgPanelStyle = '';
  
  var jWideCss = ''
 
  
 /**
 * Inserts or removes css to widen msgBlock. 
 * @param {boolean} insert Where to insert css or not
 */
  function insertWideStyle(insert)
  {
      var styleSheet = 'div ._2nb {margin-left:-309px; width:100% !important;} \n' + //added 2013-01-11, edited 2013-04-01
      
			'div .-cx-PRIVATE-webMessengerReadView__messagingScroller .uiScrollableAreaBody, \n' + //backwards compatible
			'div ._2nc .uiScrollableAreaBody, \n div ._2nc, \n div .uiScrollableAreaBody\n ' + //used
  			  'div .-cx-PRIVATE-webMessengerReadView__messagingScroller \n' +  //backwards compatible
			  ' {width: 847px !important;}'
      var wideCssId = 'jason-widen-css';
      
      if (insert)
      {
	if (!jWideCss)
	{
	    jWideCss = document.createElement('style');
	    jWideCss.setAttribute('type', 'text/css');
	    jWideCss.setAttribute('id', wideCssId);
	    jWideCss.innerHTML = styleSheet;
	}   
	document.getElementsByTagName('head')[0].appendChild(jWideCss);    
      }
      else
      {
	if (jWideCss)
	   jWideCss.parentNode.removeChild(jWideCss);
      }
  }
  
  
 /**
 * Minimizes the side bar, widens the message and other tidbits
 * Function meant to be injected into page
 */
 function jToggleMessageSide()
 {
   if (!sidePanelSuper)
   { 
      sidePanelSuper = document.getElementById('pagelet_web_messenger')
	      .getElementsByTagName('div')[0] //div with random id
	      .getElementsByTagName('div')[0] //div with class -cx-PRIVATE-webMessengerBase__contentGrid clearfix
	      .getElementsByTagName('div')[0] //div with class wmMasterView
	      .getElementsByTagName('div')[1]; //our div to minimze
/*      msgPanelSuper = document.getElementById('pagelet_web_messenger')
	      .getElementsByTagName('div')[0] //div with random id
	      .getElementsByTagName('div')[0] //div with class -cx-PRIVATE-webMessengerBase__contentGrid clearfix
	      .childNodes[1] //div with class -cx-PRIVATE-webMessengerReadView__root
	      .getElementsByTagName('div')[0] //div with class clearfix 
	      .childNodes[2] //-cx-PRIVATE-webMessengerReadView__readContainer
	      .getElementsByTagName('div')[1]; //our div to widen; 
*/      sidePanelStyle=sidePanelSuper.getAttribute("style"); 
 //     msgPanelStyle=msgPanelSuper.getAttribute("style"); 
    }
    	      
   
   //two tier is ok, but static variables are unfortunate.
   var button = document.getElementById('jason-min-button');
   var bClass = ["j-min-min", "j-min-def"];
   var buttonVal = ['[ &#x25B6;]', '[&#x25C0; ]' ] //&#x25B6; > and &#x25C0; < //&#x25B2; /\ and &#x25BC; \/
   button.setAttribute('class', bClass[jMinimized]);
   button.innerHTML= buttonVal[jMinimized]; 
   if (jMinimized)	//minimized?
   {
     jMinimized = 0;	//then unminimize
     sidePanelSuper.setAttribute("style", sidePanelStyle)
     //msgPanelSuper.setAttribute("style", msgPanelStyle)
     insertWideStyle(0)
   }
   else 
   {
     jMinimized = 1;
     sidePanelSuper.setAttribute("style", sidePanelStyle+ "; display:none;")
   //  msgPanelSuper.setAttribute("style", msgPanelStyle+ "; width:840px !important;")
     insertWideStyle(1)
   }
 }
 
 var END_CODE_INJECTION;
}//end of injection 

}
////////////////////////////////////////////////////////////////////////// 
///// Fb messaging block end
//////////////////////////////////////////////////////////////////////////

//var centeringStyle = "margin: 0 auto 0 auto !important; width: 80% !important; min-width: 1000px;"
var centeringStyle = "margin: 0 10% !important; padding-right: 0px;"

//pagelet_bluebar pageHead
var headerBar =	document.getElementById("pageHead");
	//if (headerBar) headerBar.setAttribute("style", centeringStyle);
var mainBody = 	document.getElementById("globalContainer");
	//if (mainBody) mainBody.setAttribute("style", centeringStyle);
	
var head	= document.getElementsByTagName('head')[0];
var styleSheet = "/*Jason\'s edit*/ \n" +
				".uiStreamMessage .messageBody {font-size: 11px !important;} "
				

if ( head)
{
	var css	= 	document.createElement('style');
		css.setAttribute ('type', 'text/css');
		css.setAttribute ('id', 'jason-stylesheet');
		css.innerHTML = styleSheet;
		head.appendChild(css);	

		
	codeSyringe(codeTrimmer( new Function(scriptContainer).toString(), 'BEGIN_CODE_INJECTION', 'END_CODE_INJECTION') );
	
	if ( http.test(address) )
	{
	
	    css.innerHTML = css.innerHTML + buttonStyle;
	    waitUntilLoad(insertMinimizeButton, 0);// window.location = address.replace(/http/ , "https")
	       //var my_src = "(" + page_scope_runner.caller.toString() + ")();";
	    //unsafeWindow.console.debug("x %s %s", page_scope_runner.caller );
	}   
}
	  

	
	
	
	
	
