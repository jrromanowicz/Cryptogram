var cryptoHistory = [];

function showSubSelectDiv() { // called when a problem character is clicked
	$('#subSelectLabel').html('Select the letter to substitute for <span id="subSpan">'+this.innerHTML+'</span>:');
	$('#subSelectContainer').show();
} // showSubSelect()

function subSelClick(ev) { // called if a char in #subSelectContainer is clicked
	var probChar = $('#subSpan').text(); // what's being substituted for
	ev.stopPropagation(); // no one else needs to see this event
	if (this.id == probChar) {
		alert("The solution letter can't be the same as the cryptogram letter!");
		return;
	} // if trying to substitute the same character (TRUE branch)
	subChange(probChar, this.id);
	$('#subSelectContainer').hide();
} // subSelectChange

// handle a substitution character change
// prob is the puzzle character being solved
// soln is the id of the chosen .subSel/.subSeled element
function subChange(prob, soln) {
	var oldProb, prevSoln, 
		match = false;
	
   // if re-using a non-blank letter, first clear all using it now
	if ((soln != ' ') && $('#'+soln).hasClass("inuse")) {
		$('.solution').each(function() { // get all the solution spans
			if (soln == $(this).text()) {
				$(this).text(' '); // clear old value
				oldProb = $(this).parent().find('.problem').text();
			}
		});
		cryptoHistory.push({probChar: oldProb, oldVal: soln, newVal: ' '})
	} // if non-blank soln char was already in use (TRUE branch)
   
	$('.problem').each(function() {
		if (prob == $(this).text()) {
			match = true;
			prevSoln = $(this).parent().find('.solution').text();
			$(this).parent().find('.solution').text(soln);
		} // if problem char matches (TRUE branch)
	}); // for each problem char element
	if (match) {
		if (soln != ' ') { // if it's not the space...
			$('#'+soln).addClass("inuse");  // highlight used solution chars
		}
		if (prevSoln != ' ') {
			$('#'+prevSoln).removeClass("inuse");  // un-highlight previous substitute
		}
		cryptoHistory.push({probChar: prob, oldVal: prevSoln, newVal: soln});
		$('#Undo').css("visibility", "visible");
	} else {
		alert("There are no '"+prob+"'s in the encrypted text.");
		$('#'+prob).removeClass("inuse");
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
	resetSubs(); // clear all substitutions
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
			"\n-- 'Reset Subs' undoes all the substitutions but keeps the encrypted text." +
			"\n-- 'Undo' (if active) undoes previous substitutions in the reverse order they were done." +
			"\n-- If a substitution letter is in use (it will be blue) it can still be chosen." +
			"\n-- To fix an error in the encrypted text, just correct it and hit 'Play' again.");
} // showHelp()

// set app to initial state
function clearAll() {
	$('#cryptotext').val('');
	$('[id^=char]').remove();
	$('#cryptotext').focus();
	resetSubs();
} // clearAll

// reset all substitutions
function resetSubs() { 
   $('.solution').text(' '); // clear all the solution chars
   $('.inuse').removeClass("inuse"); // make all substitute chars available
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
	$('#subSelect').click(function (ev) {ev.stopPropagation();})
	$('#subSelectDiv').click(function (ev) {ev.stopPropagation();})
	$('#subSelectContainer').click(function () {$('#subSelectContainer').hide();});
}

$(begin);
