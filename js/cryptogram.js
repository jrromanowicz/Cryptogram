var cryptoHistory = [];

function resetSub(which) {
	if ('all' === which) {
		$('.solution').text(' '); // clear all the solution chars
		$('.subSeled').hide(); // hide previously selected 
		$('.subSel').show(); // make all substitute chars available
	} else if (/[A-Z]/.test(which)) {
		$('#'+which).show();
		$('#'+which+'S').hide();
	}
} // resetSub()

function showSubSelectDiv() { // called when a problem character is clicked
	$('#subSelectLabel').html('Select what to substitute for <span id="subSpan">'+this.innerHTML+'</span>:');
	$('#subSelectContainer').show();
} // showSubSelect()

function subSelClick(ev) { // called if a char in #subSelectContainer is clicked
	var checkChar, solnText,
		probChar = $('#subSpan').text(), // what's being substituted for
	solnText = this.id; // what's being substituted
	ev.stopPropagation(); // no one else needs to see this event
	checkChar = solnText.charAt(0);
	if (checkChar == probChar) {
		alert("The solution letter can't be the same as the cryptogram letter!");
		return;
	}
	subChange(probChar, solnText);
	$('#subSelectContainer').hide();
} // subSelectChange

// handle a substitution character change
// prob is the puzzle character being solved
// soln is the .subSel/.subSeled element of the solution character
function subChange(prob, soln) {
	var i, p, s, oldProb, prevSoln, solutions, 
		solnchar = soln.charAt(0),
		match = false,
		crypt = $('.problem'); // get all the problem letter spans
	
	if (2 == soln.length) { // if re-using a letter, first clear all using it now
		$('.solution').each(function(index) { // get all the solution spans
			if (solnchar == $(this).text()) {
				$(this).text(' '); // clear old value
				oldProb = $(this).parent().find('.problem').text();
			}
		});
		cryptoHistory.push({probChar: oldProb, oldVal: solnchar, newVal: ' '})
	}
	$('.problem').each(function(index) {
		if (prob == $(this).text()) {
			match = true;
			prevSoln = $(this).parent().find('.solution').text();
			$(this).parent().find('.solution').text(solnchar);
		} // if problem char matches (TRUE branch)
	}); // for each problem char element
	if (match) {
		if (solnchar != ' ') { // if it's not the space...
			$('#'+solnchar).hide();  // don't allow re-use of this button
			$('#'+solnchar+'S').show(); // show the in-use button
			$('#subSelectedDiv').show();
		}
		if (prevSoln != ' ') {
			$('#'+prevSoln).show();  // re-enable use of previous substitute
			$('#'+prevSoln+'S').hide();  // not in use anymore, hide in-use button
		}
		cryptoHistory.push({probChar: prob, oldVal: prevSoln, newVal: solnchar});
		$('#Undo').css("visibility", "visible");
	} else {
		alert("There are no '"+prob+"'s in the encrypted text.");
		resetSub(prob);
	} 
} // subChange()

// triggered by Undo menu item
function undo(ev) {
	var hist = cryptoHistory.pop(); //for conciseness
	subChange(hist.probChar, hist.oldVal); // do the deed
	ev.stopPropagation(); // no one else needs this event
	cryptoHistory.pop(); // avoid an infinite loop
	if (cryptoHistory.length == 0) {
		$('#Undo').css("visibility", "hidden");
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
	$('#Undo').css("visibility", "hidden");
} // startPlay()

function showAbout() {
	alert('Cryptogram\nBy Jack Romanowicz\n Version '+version+'\n'+versionDate);
} // showAbout()

function showHelp() {
	alert("Enter the encrypted text into the Encrypted Text box.\n\n-- Click the 'Play' menu item to begin. " +
			"\n-- Click on or touch a letter in the lower section to pop up a substitution selector. " +
			"\n-- 'Clear All' undoes all substitutions and clears the encrypted text." +
			"\n-- 'Reset Subs' undoes all the substitutions but the encrypted text remains." +
			"\n-- 'Undo' (if active) undoes previous substitutions in the reverse order they were done." +
			"\n-- If a substitution letter is in use it can still be chosen from the bottom of the selector." +
			"\n-- To fix an error in the encrypted text, just correct it and hit 'Play' again.");
} // showHelp()

// set app to initial state
function clearAll() {
	$('#cryptotext').val('');
	$('[id^=char]').remove();
	$('#cryptotext').focus();
	resetSubs();
} // clearAll

function resetSubs() {
	$('.selectsub').show(); 
	resetSub('all'); 
	$('.subSeled').hide()
	$('#subSelectedDiv').hide();
	$('#subSelectContainer').hide();
	cryptoHistory = [];
	$('#Undo').css("visibility", "hidden");
} // resetSubs()

function begin() {
	var d = new Date;
	$('#thisYear').text(d.getFullYear());
	$('#version').text('Version '+version);
	clearAll(); // set initial state
	// set up menu item links
	$('#Clear').click(clearAll);
	$('#Reset').click(resetSubs);
	$('#Play').click(startPlay);
	$('#About').click(showAbout);
	$('#Undo').click(undo)
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
