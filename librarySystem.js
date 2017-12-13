// Current approach: One global variable per library
// 1. Create: Run library in IIFE, and attach to window
// 2. Use: Access library from window 
(function () {
	
	var breads = {
		wheat: 'The healthy option',
		white: 'The unhealthy option'
	};

	var fillings = {
		turkey: 'For boring sandwiches',
		cheese: 'For the vegetarians'
	};

	var sandwichLibrary = {
		breads: breads,
		fillings: fillings
	};	

	window.sandwichLibrary = sandwichLibrary;

})();

console.log(sandwichLibrary);

// New approach: One global variable period
							// first arguement string, second arguement is a function
							// ***instead of attaching library to window you return the library***
							// if we call the librarySystem function, we can get the library object
							// from there we can store it^.. so when someone wants to use it, we can
							// give them the object they created in step 1
// 1. Create: librarySystem('nameOfYourLibrary', function() {/* return nameOfYourLibrary */}); 
// 2. Use: librarySystem('nameOfYourLibrary');

(function() {

	// functions can always remember the variables that they can see at creation
	// closure variable?
	var libraryStorage = {};
	// {nameOfYourLibrary: /* return value of the */ callback()
	//  nameOfYourLibrary2: callback2()}

	function librarySystem(nameOfYourLibrary, callback) {
		// We are in case 1
		if (arguments.length > 1) {
			// creating a library but we arent using it, let's store it for later
			// save nameOfYourLibrary in libraryStorage at the nameOfYourLibrary property
			libraryStorage[nameOfYourLibrary] = callback(); // return value of the callback
		} else {
			return libraryStorage[nameOfYourLibrary];
		}
	}

	// make librarySystem function global
	window.librarySystem = librarySystem;

})();

librarySystem('sandwichLibrary', function() {
	// sandwich.js: A simple library for sandwich ingredients 
	// Demo usage: sandwichLibrary.breads.wheat ==> 'The healthy option'

	var breads = {
		wheat: 'The healthy option',
		white: 'The unhealthy option'
	};

	var fillings = {
		turkey: 'For boring sandwiches',
		cheese: 'For the vegetarians'
	};

	var sandwichLibrary = {
		breads: breads,
		fillings: fillings
	};

	return sandwichLibrary;
});

console.log(librarySystem('sandwichLibrary'));

// console example
(function() {
	var sandwichLibrary = librarySystem('sandwichLibrary');

	console.log(sandwichLibrary);

})();

// window.sandwichJS has an original value * loads first 
window.sandwichLibrary = 'this right here';

// dynamic example for both approaches
(function () {
	
	var breads = {
		wheat: 'The healthy option',
		white: 'The unhealthy option'
	};

	var fillings = {
		turkey: 'For boring sandwiches',
		cheese: 'For the vegetarians'
	};

	var sandwichLibrary = {
		breads: breads,
		fillings: fillings
	};	

	// if librarySystem is undefined
	if (typeof librarySystem !== 'undefined') {
		// handle librarySystem case
		librarySystem('sandwichLibrary', function () {
		return sandwichLibrary;
	});
	} else {
		// handle window
		// save it 
		var thisRightHere = window.sandwichLibrary;

		sandwichLibrary.noConflict = function() {
			// resets to the original value (from the object to the string)
			window.sandwichLibrary = thisRightHere;
			// now that we reset 'window.sandwichLibrary' we can return
			// sandwichLibrary to sandwichJS variable
			return sandwichLibrary;
		}; 

		window.sandwichLibrary = sandwichLibrary;
	}

})();

// This will reset window.sandwichLibrary to the original value
// .noConflict will also return the sandwichLibrary object
var sandwichJS = sandwichLibrary.noConflict(); 

// You want to print window.sandwichLibrary (you want the string)
console.log(sandwichLibrary);

// We can still use SandwichJS
console.log(sandwichJS.breads.white);











