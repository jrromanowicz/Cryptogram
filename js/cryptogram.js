var cryptoHistory = [];

function resetSub(which) {
	if ('all' === which) {
		$('.solution').text(' '); // clear all the solution chars
		$('.subSel').show(); // show all the substitutions
	} else if (/[A-Z]/.test(which)) {
		$('#'+which).show();
	}
} // resetSub()

function showSubSelectDiv() { // called when a problem character is clicked
	$('#subSelectLabel').html('Select what to substitute for <span id="subSpan">'+this.innerHTML+'</span>:');
	$('#subSelectContainer').show();
} // showSubSelect()

function subSelClick() { // called if a char in #subSelectContainer is clicked
	var checkChar, probChar, solnText,
		probChar = $('#subSpan').text(), // what's being substituted for
	solnText = this.id; // what's being substituted
	if (2 == solnText.length) {
		checkChar = solnText.charAt(1);
	} else {
		checkChar = solnText;
	}
	if (checkChar == probChar) {
		alert("The solution letter can't be the same as the cryptogram letter!");
		return;
	}
	subChange(probChar, solnText);
	$('#subSelectContainer').hide();
} // subSelectChange

// handle a substitution character change
function subChange(prob, soln) {
	var i, p, s, oldProb, prevSoln, solutions, 
		match = false,
		crypt = $('.problem'); // get all the problem letter spans
	
	if (2 == soln.length) { // if re-using a letter, first clear all using it now
		solutions = $('.solution'); // get all the solution spans
		soln = soln.charAt(1); // skip the leading 'S'
		for (i = 0; i < solutions.length; i++) {
			s = $(solutions[i]);
			if (soln == s.text()) {
				s.text(' '); // clear old value
				oldProb = s.parent().find('.problem').text();
			}
		}
		cryptoHistory.push({probChar: oldProb, oldVal: soln, newVal: ' '})
	}
	for (i = 0; i < crypt.length; i++) {
		p = $(crypt[i]);  // make into jquery object
		if (prob == p.text()) {
			match = true;
			prevSoln = p.parent().find('.solution').text();
			p.parent().find('.solution').text(soln);
		} // if problem char matches (TRUE branch)
	} // for each problem char element
	if (match) {
		if (soln != ' ') { // if it's not the space...
			$('#'+soln).hide();  // don't allow re-use of this substitute
			$('#S'+soln).show(); // show the un-use button
			$('#subSelectedDiv').show();
		}
		if (prevSoln != ' ') {
			$('#'+prevSoln).show();  // re-enable use of previous substitute
			$('#S'+prevSoln).hide();  // not in use anymore, hide un-use button
		}
		cryptoHistory.push({probChar: prob, oldVal: prevSoln, newVal: soln});
		$('#Undo').show();
	} else {
		alert("There are no '"+prob+"'s in the encrypted text.");
		resetSub(prob);
	} 
} // subChange()

function undo() {
	var hist = cryptoHistory.pop(); //for conciseness
	subChange(hist.probChar, hist.oldVal); // do the deed
	cryptoHistory.pop(); // avoid an infinite loop
	if (cryptoHistory.length == 0) {
		$('#Undo').hide();
	}
} // undo()

function startPlay() {
	var i, cl, thisChar, word,
		txt = $('#cryptotext').val().toUpperCase(),
		proto = $('#protochar'), 
		text = $('#text');
	
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
		} // if the character is alphabetic (TRUE branch)
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

function showAbout() {
	alert('Cryptogram\nBy Jack Romanowicz\n Version 2.00\n29 December 2018');
} // showAbout()

function showHelp() {
	alert("Enter the encrypted text into the Encrypted Text box.\n\n-- Click the 'Play' menu item to begin. " +
			"\n-- Click on or touch a letter in the lower section to pop up a substitution selector. " +
			"\n-- 'Reset Subs' undoes all the substitutions but the encrypted text remains." +
			"\n-- 'Clear All' undoes all substitutions and clears the encrypted text." +
			"\n-- 'Undo' (if shown) undoes previous substitutions in the reverse order they were done." +
			"\n-- If a substitution letter is in use it will be removed from the substitution selector." +
			"\n-- To fix an error in the encrypted text, just correct it and hit 'Play' again.");
} // showHelp()

// set app to initial state
function clearAll() {
	$('#cryptotext').val('');
	$('.selectsub').show(); 
	resetSub('all'); 
	$('[id^=char]').remove();
	$('.subSeled').hide()
	$('#subSelectedDiv').hide();
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
	$('.subSeled').click(subSelClick);
	$('#subSelect').click(function (ev) {ev.stopPropagation();})
	$('#subSelectDiv').click(function (ev) {ev.stopPropagation();})
	$('#subSelectedDiv').click(function (ev) {ev.stopPropagation();})
	$('#subSelectContainer').click(function () {$('#subSelectContainer').hide();});
}

$(begin);
