// ==UserScript==
// @name           fb_message_minimize
// @namespace      userscripts.ovrhere.com
// @author         Jason
// @description    Adds a minimize button to the message page to toggle the "contact" list.
// @include        http://www.facebook.com/messages/*
// @include        https://www.facebook.com/messages/*
// ==/UserScript==

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
 * 2013-09-07	-Branched to its own file. Added git.
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
 */

/**
 * Used to inject userscripts into the page 
 * (to circumvent to greasemonkey's sandbox isolating userscripts from page scripts)
 * and allowing the page to excute the scripts.
 * 
 * @this {CodeInjector}
 * 
 */
 function CodeInjector(){
 
   return {
     
     /**
      * Returns the passed script as a string.
      * @param {function} scriptContainer The script container to turn to a string.
      * @return {String} The function code as a string.
      */
     functionToString:function(scriptContainer){
	return (new Function(scriptContainer)).toString()
     },
     
      /**
      * Uses string manipulation on the code for injection into the page. 
      * NOTE: Must use the format 'var [start];' and 'var [end];' 
      *   encapsulating the code to be injected.
      * @param {String} fullScript The fullscript to trime.
      * @return {String} The code to be injected.
      */
      trimmer:function(fullScript, start, end)
      {	start 	= 'var '+start+';';
	    end	= 'var '+end+';';
	    var index1 = fullScript.indexOf(start) + start.length;
	    var index2 = fullScript.indexOf(end);
	    return fullScript.substring(index1,index2);
      },

      /**
      * Injects code into the page giving it the id: "jason-script".
      * @param {String} inputScript to inject into page code.
      */
      syringe:function(inputScript)
      {   var script = document.createElement('script');
	  script.setAttribute("type", "application/javascript"); script.setAttribute("id", "jason-script");
	  var scriptText = document.createTextNode(inputScript);
	  script.appendChild(scriptText);
	  document.getElementsByTagName('head')[0].appendChild(script);
      }
   };

 }

  

////////////////////////////////////////////////////////////////////////// 
///// End of code injector block
//////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////// 
///// Fb messaging block start
//////////////////////////////////////////////////////////////////////////
{
  /** The main messaging container. */
  var webMessenger = document.getElementById('pagelet_web_messenger');
  /** The inner text for the minimize button. Currently >. */
  var minButtonInner = '[&#x25C0; ]'; //&#x25B6; > and &#x25C0; < //&#x25B2; /\ and &#x25BC; \/
  /** The id for the minimized button. */
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

	
var head	= document.getElementsByTagName('head')[0];
var stylesheetId = 'jason-stylesheet';

if ( head)
{
  	var css	= document.createElement('style');
		css.setAttribute ('type', 'text/css');
		css.setAttribute ('id', stylesheetId);
		css.innerHTML = buttonStyle;
		head.appendChild(css);	
		
  
  
	var codeInjector = CodeInjector();
	codeInjector.syringe(
		codeInjector.trimmer( 
		      codeInjector.functionToString(scriptContainer), 
		      'BEGIN_CODE_INJECTION', 'END_CODE_INJECTION') 
		);

	waitUntilLoad(insertMinimizeButton, 0);// window.location = address.replace(/http/ , "https")
}