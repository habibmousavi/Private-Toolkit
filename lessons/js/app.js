"use strict";

var timeout;
var meaning = document.getElementById('meaning');
var content = document.getElementById('content');

function showMeaning(elem){
	
	meaning.textContent = elem.getAttribute('data-m');
					
	// I can't put it as global because on 
	// rotation it changes and messes thing up
	// so for now I calculate it every time
	var winWidth = document.body.clientWidth;
					
	// calculate the top and left of the meaning holder
	var top = elem.offsetTop - meaning.clientHeight - 8;
	var offLeft = elem.offsetLeft;
	var left = (winWidth > (offLeft + meaning.clientWidth)) ?
			offLeft:
			winWidth - meaning.clientWidth - 8;
					
	// set the top and left of the meaning holder
	meaning.style.top = top + "px";
	meaning.style.left = left + "px";
					
	// hide if any meaning is already shown
	meaning.style.opacity = 0;
	clearTimeout(timeout);
	// Find the previous element that has the 'selected' class and remove its class
	var selectedElems = content.getElementsByClassName('selected');
	if (selectedElems.length > 0) {
		selectedElems[0].classList.remove('selected');
	}
					
	meaning.style.opacity = 1;
	elem.classList.add('selected');
	timeout = setTimeout(function() {
		meaning.style.opacity = 0;
		content.getElementsByClassName('selected')[0].classList.remove('selected');
			
	}, 2500);

}


// this function determines if an element is parent of another element
function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}




// When meaning is clicked
meaning.addEventListener('touchend', function() {
	var curElems = content.getElementsByClassName('selected');
	var curWord = "";
	var curMeaning = "";
	if (curElems.length > 0) {
		curWord = curElems[0].textContent;
		curMeaning = this.textContent;
		
		Android.showAddDialog(curWord, curMeaning);
	}
}, false);



/*
function getSelectedWord_old() {
	var t = '';
	var s = window.getSelection();
	if (s.isCollapsed) {
		s.modify('move', 'forward', 'character');
		s.modify('move', 'forward', 'character');
		s.modify('move', 'backward', 'word');
		s.modify('extend', 'forward', 'word');
		t = s.toString();
		s.modify('move', 'forward', 'character'); //clear selection
	}
	else {
		t = s.toString();
	}
	
	return t;
}
*/

function getSelectedWord() {
	var s = window.getSelection();
    var range = s.getRangeAt(0);
    var node = s.anchorNode;
    while (range.toString().indexOf(' ')) {
        // It may be the first word. The first word doesn't have any space before it
        if (range.startOffset === 0) break;
        
        range.setStart(node, (range.startOffset - 1));
        
        
    }

    // First word of the document don't have space before it
    if (range.toString().indexOf(' ') === -1) {
    	range.setStart(node, range.startOffset);
    } else {
    	range.setStart(node, range.startOffset + 1);
    }
    
    // this is needed for the first word
    if (range.endOffset < node.length) range.setEnd(node, range.endOffset + 1);
    		
    while (range.toString().indexOf(' ') == -1 && 
    		range.toString().trim() != '' && 
    		range.endOffset < node.length) {
    
    	range.setEnd(node, range.endOffset + 1);
    
    }
    
    var str = range.toString().trim();
    return str;
}


var numClicks = 0;
var timeout3 = null;
document.addEventListener('touchend', function() {
	numClicks++;
	clearTimeout(timeout3);
	timeout3 = setTimeout(function() {
		numClicks = 0;
	}, 400);
}, false);

document.addEventListener('click', function(e) {
	
	if (numClicks === 3) {
		Android.sayIt(getSelectedWord());
	} else {
		var elem = e.target;

		// if the element is the child of content and it is a span, then show it's meaning
		if (isDescendant(content, elem) && elem.tagName.toLowerCase() === "span") {
			showMeaning(elem);
		}
	}
	
}, false);

