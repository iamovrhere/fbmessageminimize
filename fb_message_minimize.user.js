// ==UserScript==
// @name           fb_message_minimize
// @namespace      ovrhere.com
// @author         Jason J
// @description    Adds a minimize button to the message page to toggle the "contact" list.
// @include        http://www.facebook.com/messages/*
// @include        https://www.facebook.com/messages/*
// @version        0.2.0
// ==/UserScript==

/**
 * NOTE changes :
 * 2012-10-25 	- Added changes block
 * 		- Added/Updated code injector
 * 		- Added the button inserter
 * 2012-10-26	- Fully functional
 * 2012-11-21	- Patched - facebook broke it. I fixed it.
 * 2013-01-11	- Changed dates (of these comments) to be of form yyyy-mm-dd
 * 		- Patched - Message body broke. Moved the margin back of <div class="_2nb">
 * 2013-04-01	- Patched - Message body broke. The page was restyling causing the ad-bar to creep in from the right.
 * 			set width as !important.
 * 2013-09-06	- Branched to its own file. Added git.
 * 2013-09-09   - Removed injector.
 * 2014-03-13 	- Patched - <div class="_2nb"> float: right;  (was displacerd with the chat-bar open). increased width
 * 2014-06-09	- Last change pushed ads underneath body. Now hiding ads in addition to toggle.
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
 *  	id: 'pagelet_ego_pane' is the ad-panel to right.
 */

////////////////////////////////////////////////////////////////////////// 
///// Fb messaging block start
//////////////////////////////////////////////////////////////////////////
{
  /** The main messaging container. */
  var webMessenger = document.getElementById('pagelet_web_messenger');
  /** The inner text for the minimize button. Currently >. */
  var minButtonInner = '[&#x25C0; ]'; //&#x25B6; > and &#x25C0; < //&#x25B2; /\ and &#x25BC; \/
  
  //NOTE: These 3 will need to be manually redefined in injected script
  /** The id for the minimized button. */
  var minButtonId = "my-message-min-button"  
  /** The minimized class name. */
  var minClass = 'my-minbutton-min';
  /** The minimized class name. */
  var defClass = 'my-minbutton-def';
  //= ["my-minbutton-min", "my-minbutton-def"];
  
  /** This is the text to define the style: 
   * default: light-blue bg, dark blue text. 
   * mouse hover: colour change, mouse change.
   * minimized: dark-blue bg, white text.
   */
  var buttonStyle = "\n\n/*Added for the sake of message minimize button*/\n"  +
		    "#"+minButtonId+" {color: #01359E; /*blue*/ font-weight: bold; cursor:pointer; "+
		    "padding: 8px 3px 8px 3px; float: left; margin-left: -30px;} \n" +
		    "."+defClass +" {background-color: #E8EFFC; /*lighter blue*/} \n" +
		    "."+defClass +":hover  {background-color: #DDE8FF; /*light blue*/} \n" +
		    "."+minClass +"  {background-color: #3B5998; /*darker blue*/ color: white !important;} \n";
    
  /** The number of times before we give up on trying. */
  var retryLimit = 120;  //assuming we try once a second, give up in 2 mins
  
  /** Inserts the minimize button and its action. */
  function insertMinimizeButton()
  {
     var leftPanel = webMessenger.getElementsByTagName('div')[0] //div with random id
			      .getElementsByTagName('div')[0] //div with class -cx-PRIVATE-webMessengerBase__contentGrid clearfix
			      .getElementsByTagName('div')[0]; //div with class wmMasterView
   
    var minButton = document.createElement('div');
	minButton.setAttribute('id', minButtonId);
	minButton.setAttribute('class', defClass);
	minButton.addEventListener('click', function(){MyMessageMin().toggleMessageSide();}, false); 
	minButton.innerHTML = minButtonInner;
	
		
	
    leftPanel.insertBefore( minButton, leftPanel.firstChild);
    
  }
  
  /**
   * Waits until the button's parent-to-be loads before executing the function.
   * We will try for 2 minutes before we decide to give up.
   * @param {function} func The function execute once the DOM has loaded.
   * @param {number} count The number of times we've retried.
   */
  function waitUntilLoad(func, count)
  {
    	      
   var leftPanel = webMessenger.getElementsByTagName('div')[0];
   
   //document.getElementById('pagelet_web_messenger').getElementsByTagName('div')[0]
   //.getElementsByTagName('div')[0].getElementsByTagName('div')[0]
   if (leftPanel)
   {	if (leftPanel = leftPanel.getElementsByTagName('div')[0])
	{  if (leftPanel.getElementsByTagName('div')[0]) 
	  {  func(); //divs all found at the end of the tunnel
	    return;
	  }  
	}
   }
    else if(count > retryLimit) 
      return;
    count +=1;
    setTimeout(function(){waitUntilLoad(func, count)},1000);	//retry
      
  }
 
 
 /** Singleton module that holds function for the message minimize button. 
  * @this MyMessageMin
  */
  function MyMessageMin(){
    /** Keeps it a singleton. */  
    MyMessageMin.instance;
       
      if ( typeof MyMessageMin.instance === 'undefined' ){
    	  MyMessageMin.instance = null;
      }
      
      //private members
      
      /** The minimize button id. */
      var myButtonId = 'my-message-min-button'
      /** The available button classes for each state. 1 for minimized 0 for default. */
      var myButtonClass = ["my-minbutton-def", "my-minbutton-min"]; 
      /** The possible button values. 1 for minimized, 0 for default. */
      var buttonVal = ['[&#x25C0; ]' , '[ &#x25B6;]'] //&#x25B6; > and &#x25C0; < //&#x25B2; /\ and &#x25BC; \/
      

       /** The wide css element. */
       var wideCss = document.createElement('style');
		  wideCss.setAttribute('type', 'text/css');
		  wideCss.setAttribute('id', 'message-widen-css');
		  wideCss.innerHTML = ''+
		  'div ._2nb { width:100% !important; float: right;} \n' + //added 2013-01-11, edited 2014-03-13
		  'div .-cx-PRIVATE-webMessengerReadView__messagingScroller .uiScrollableAreaBody, \n' + //backwards compatible
		  'div ._2nc .uiScrollableAreaBody, \n div ._2nc, \n div .uiScrollableAreaBody\n ' + //used
		  'div .-cx-PRIVATE-webMessengerReadView__messagingScroller \n' +  //backwards compatible
		  ' {width: 1000px !important;}'; 
       
	/** The messenger body element. */
        var sidePanelSuper = document.getElementById('pagelet_web_messenger')
		    .getElementsByTagName('div')[0] //div with random id
		    .getElementsByTagName('div')[0] //div with class -cx-PRIVATE-webMessengerBase__contentGrid clearfix
		    .getElementsByTagName('div')[0] //div with class wmMasterView
		    .getElementsByTagName('div')[1]; //our div to minimze
		    
       /** The messenger previous style. */
       var sidePanelStyle =sidePanelSuper.getAttribute("style");   //likely remains empty, but just in case
	    
      /** The emotion icon element. */
      var emotPanelIcon =  document.getElementById('pagelet_web_messenger')
				     .getElementsByClassName('emoticonsPanel')[0].parentNode;
      /** The emotion icon previous style.  */
      var emotPanelStyle = emotPanelIcon.getAttribute('style');      

      /** The wide style for the emotions. */
      var emotWideStyle = 'left: 802px;';
        
      /** Whether or not the side-bar is currently minimized AND the current myButtonClass of class to use. 
       Note that the value is used both as a bool and index. */
      var isMinimized = 0;
      
      if (MyMessageMin.instance == null){
    	  MyMessageMin.instance = {
			  
		      /**
		      * Inserts or removes css to widen msgBlock. 
		      * @param {boolean} insert <code>true</code> to insert css, 
		      * <code>false</code> to remove.
		      */
			insertWideStyle:function(insert)
			{
			   if (insert)
			    {  
			      document.getElementsByTagName('head')[0].appendChild(wideCss);    
			    }
			    else
			    {
				wideCss.parentNode.removeChild(wideCss);
			    }
			    
			},	
			
		      /**
		      * Minimizes the side bar, widens the message and other tidbits
		      * Function meant to be injected into page
		      */
	      toggleMessageSide:function()
	      {
			
			if (isMinimized)	//minimized?
			{
			  isMinimized = 0;	//then unminimize
			  sidePanelSuper.setAttribute("style", sidePanelStyle)
			  emotPanelIcon.setAttribute("style", emotPanelStyle);	
			  this.hideAdSidePanel(false);
			}
			else 
			{
			  isMinimized = 1;
			  sidePanelSuper.setAttribute("style", sidePanelStyle+ "; display:none;");
			  emotPanelIcon.setAttribute("style", emotWideStyle);
			  this.hideAdSidePanel(true);
			}
			//two tier is ok, but static variables are unfortunate.
			var button = document.getElementById(myButtonId);
			    button.setAttribute('class', myButtonClass[isMinimized]);
			    button.innerHTML= buttonVal[isMinimized]; 
			    
			this.insertWideStyle(isMinimized); 
		},
		/** Hides the ad side panel based upon the value of hide
		 * @param {boolean} hide true to hide, false to show. */
		hideAdSidePanel:function(hide){
		    var adPanel = document.getElementById('pagelet_ego_pane');
		    if (adPanel){
		      adPanel.style.display = hide ? 'none' : ''; 
		    } 
		}
		    };
  }
    return MyMessageMin.instance;
  }  
 

} 
////////////////////////////////////////////////////////////////////////// 
///// Fb messaging block end
//////////////////////////////////////////////////////////////////////////

	
var head	= document.getElementsByTagName('head')[0];
var stylesheetId = 'my-button-stylesheet';

if ( head)
{
  	var css	= document.createElement('style');
		css.setAttribute ('type', 'text/css');
		css.setAttribute ('id', stylesheetId);
		css.innerHTML = buttonStyle;
		head.appendChild(css);	
	

	waitUntilLoad(insertMinimizeButton, 0);
}