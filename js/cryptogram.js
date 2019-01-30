var cryptoHistory = [];

function resetSub(which) {
	if ('all' === which) {
		$('.solution').text(' '); // clear all the solution chars
		$('.subSel').show(); // show all the substitutions
	} else if (/[A-Z]/.test(which)) {
		$('#'+which).show();
	}
} // resetSub()

function showSubSelectDiv(ev) {
	$('#subSelectLabel').html('Select what to substitute for <span id="subSpan">'+this.innerHTML+'</span>:');
	$('#subSelectContainer').show();
} // showSubSelect()

function subSelClick(ev) {
	var ssd = $('#subSpan').text(), // what's being substituted for
		subc = $(this).text(); // what's being substituted
	subChange(ssd, subc);
	$('#subSelectContainer').hide();
} // subSelectChange

// handle a substitution character change
function subChange(prob, soln) {
	var i, p, prevValue,
	  match = false,
	  crypt = $('.problem'); // get all the problem letter spans
	
	for (i = 0; i < crypt.length; i++) {
		p = $(crypt[i]);  // make into jquery object
		if (prob == p.text()) {
			match = true;
			prevValue = p.parent().find('.solution').text();
			p.parent().find('.solution').text(soln);
		} // if problem char matches (TRUE branch)
	} // for each problem char element
	if (match) {
		if (soln != ' ') { // if it's not the space...
		  $('#'+soln).hide();  // don't allow re-use of this substitute
		}
		if (prevValue != ' ') {
		  $('#'+prevValue).show();  // re-enable use of previous substitute
	    }
		cryptoHistory.push({probChar: prob, oldVal: prevValue, newVal: soln});
		$('#Undo').show();
	} else {
		alert("There are no '"+prob+"'s in the encrypted text.");
		resetSub(prob);
	} 
} // subChange()

function undo(ev) {
	var hist = cryptoHistory.pop(); //for conciseness
	subChange(hist.probChar, hist.oldVal); // do the deed
	cryptoHistory.pop(); // avoid an infinite loop
} // undo()

function startPlay(ev) {
	var i, cl, thisChar,
	  txt = $('#cryptotext').val().toUpperCase(),
	  proto = $('#protochar'), 
	  text = $('#text'),
	  word;
	
	if (txt.length < 1) {
		alert("You need to enter the encrypted text before beginning play.");
		return;
	}
	$('[id^=char]').remove();
	for (i = 0; i < txt.length; i++) {
		thisChar = txt.charAt(i);
		cl = proto.clone().prop('id','char'+i);
		cl.find('.problem').text(thisChar);
		if (/[A-Z]/.test(thisChar)) {
			cl.find('.problem').click(showSubSelectDiv); // and pop up the subselect if clicked on
		} // if the character is a alphabetic (TRUE branch)
		else {
			cl.find('.solution').text(thisChar); // not alpha char, just put in solution
			cl.find('.solution').addClass('fixed');
			cl.find('.solution').removeClass('solution');
		} // if the character is alphabetic (FALSE branch)
		if ( 0 == i ||' ' == thisChar) { // first char or end of word? 
			word = $('<div class="word"></div>');
			text.append(word);
		}
		word.append(cl);
	} // for each character in the cryptotext
	resetSub('all'); // clear all substitutions
	cryptoHistory = [];
	$('#Undo').hide();
} // startPlay()

function showAbout(ev) {
	alert('Cryptogram\nBy Jack Romanowicz\n Version 2.00\n29 December 2018');
} // showAbout()

function showHelp(ev) {
	alert("Enter the encrypted text into the Encrypted Text box.\n\n-- Click the 'Play' menu item to begin. " +
			"\n-- Click on or touch a letter in the lower section to pop up a substitution selector. " +
			"\n-- 'Reset Subs' undoes all the substitutions but the encrypted text remains." +
			"\n-- 'Clear All' undoes all substitutions and clears the encrypted text." +
			"\n-- 'Undo' (if shown) undoes previous substitutions in the reverse order they were done." +
			"\n-- If a substitution letter is in use it will be removed from the substitution selector." +
			"\n-- To fix an error in the encrypted text, just correct it and hit 'Play' again.");
} // showHelp()

// set app to initial state
function clearAll(ev) {
	$('#cryptotext').val('');
	$('.selectsub').show(); 
	resetSub('all'); 
	$('[id^=char]').remove();
	$('#subSelectContainer').hide();
	$('#cryptotext').focus();
	cryptoHistory = [];
	$('#Undo').hide();
} // clearAll()

function begin() {
	var d = new Date;
	$('#thisYear').text(d.getFullYear());
	clearAll(); // set initial state
	// set up menu item links
	$('#Clear').click(clearAll);
	$('#Reset').click(function() {resetSub('all');});
	$('#Play').click(startPlay);
	$('#About').click(showAbout);
	$('#Undo').click(undo),
	$('#Help').click(showHelp);
	// script the select elements
	$('.subSel').click(subSelClick);
	$('#subSelect').click(function (ev) {ev.stopPropagation();})
	$('#subSelectDiv').click(function (ev) {ev.stopPropagation();})
	$('#subSelectContainer').click(function () {$('#subSelectContainer').hide();});
}

$(begin);
