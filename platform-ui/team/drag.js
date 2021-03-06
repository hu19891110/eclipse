/*******************************************************************************
 * Copyright (c) 2008 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Boris Bokowski, IBM Corporation - initial API and implementation
 *******************************************************************************/
window.onload = function() {documentLoaded=true;init();};
var zIndex = 10;
if (navigator.userAgent.indexOf("MSIE") == -1) {
	browser = {
		getX : function(event) {
	        return event.clientX + window.scrollX;
		},
		getY : function(event) {
	        return event.clientY + window.scrollY;
		},
		preventDefault : function(event) {
			event.preventDefault();
		},
		addEventListener : function(eventName, listener) {
			document.addEventListener(eventName, listener, true);
		},
		removeEventListener : function(eventName, listener) {
			document.removeEventListener(eventName, listener, true);
		},
		getEventTarget : function(event) {
			return event.target;
		},
		mousemove : "mousemove",
		mouseup : "mouseup",
		play:function(){},
		stop:function(){}
	};
} else {
	browser = {
		getX : function(event) {
	        return window.event.clientX + document.documentElement.scrollLeft
	               + document.body.scrollLeft;
        },
		getY : function(event) {
	        return window.event.clientY + document.documentElement.scrollTop
	               + document.body.scrollTop;
        },
		preventDefault : function(event) {
			window.event.cancelBubble = true;
    		window.event.returnValue = false;
		},
		addEventListener : function(eventName, listener) {
			document.attachEvent(eventName, listener);
		},
		removeEventListener : function(eventName, listener) {
			document.detachEvent(eventName, listener);
		},
		getEventTarget : function(event) {
			return window.event.srcElement;
		},
		mousemove : "onmousemove",
		mouseup : "onmouseup",
		play:function(){},
		stop:function(){}
	};
}
var dragging = false;
function handleDragStart(event) {
  dragging = true;
  var target = browser.getEventTarget(event);
  var startX = browser.getX(event);
  var startY = browser.getY(event);
  var targetX = parseInt(target.style.left, 10);
  var targetY = parseInt(target.style.top, 10);
  target.style.zIndex = ++zIndex;
  function handleMove(event) {
    var mouseX = browser.getX(event);
    var mouseY = browser.getY(event);
    target.style.left = (targetX + (mouseX - startX)) + "px";
    target.style.top = (targetY + (mouseY - startY)) + "px";
    browser.preventDefault(event);
  }
  function handleUp(event) {
    browser.removeEventListener(browser.mousemove, handleMove);
    browser.removeEventListener(browser.mouseup, handleUp);
    dragging = false;
  }
  browser.addEventListener(browser.mousemove, handleMove);
  browser.addEventListener(browser.mouseup, handleUp);
  browser.preventDefault(event);
}
function wiggle(target) {
  if (target.wiggling) {
    return;
  }
  target.wiggling = true;
  var changeFactor = 0.0;
  var changeOffset = 4;
  var targetX = parseInt(target.style.left, 10);
  var targetY = parseInt(target.style.top, 10);
  var width = target.width;
  var height = target.height;
  target.width = width * (1.0 + 2 * changeFactor) + 2 * changeOffset;
  target.height = height * (1.0 + 2 * changeFactor) + 2 * changeOffset;
  target.style.left = (targetX - (width * changeFactor) - changeOffset) + "px";
  target.style.top = (targetY - (height * changeFactor) - changeOffset) + "px";
  setTimeout(function() {
	  target.width = width;
	  target.height = height;
	  target.style.left = targetX + "px";
	  target.style.top = targetY + "px";
	  target.wiggling = false;
  }, 200);
}
function getPieces() {
  var pieces = [];
  var imgs = document.getElementsByTagName("img");
  for (var i=0; i<imgs.length; i++) { 
    if (imgs[i].className == "piece") { 
      pieces.push(imgs[i]); 
    } 
  } 
  return pieces; 
} 
function wiggleAll() { 
    var pieces = getPieces(); 
    for (var i=0; i<pieces.length; i++) { 
      var piece = pieces[i]; 
      wiggle(piece); 
    } 
} 
function handleMouseOver(o, s) { 
  if (!dragging) { 
    wiggle(o); 
  } 
} 
function init() { 
  if (documentLoaded) { 
    var pieces = getPieces(); 
    var y = 200; 
    var x = 300; 
    for(i in pieces) { 
      var piece = pieces[i]; 
      piece.style.left = x + "px"; 
      piece.style.top =  y + "px"; 
      x += piece.width; 
    } 
//    document.getElementById('loading').style.display='none'; 
    wiggleAll(); 
  } 
} 
