// Array.prototype.toString (default)
//[].toString()
// only shows what is inside the array

// we want to figure out the datatype using toString()
// therefore we must bind toString to Object
// we can use call instead of bind

// var myObject = {};
// myObject.toString(); 'this' is equal to myObject
// Object.prototype.toString

// we want to change 'this' to something else
// we can use the call method

// Object.prototype.toString.call([])

function betterToFixed() {};

var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);

		var exponentialForm = Number(lib.unformat(value) + 'e' + precision); // 123.5e2 === 12350
		var rounded = Math.round(exponentialForm); // round whole number 12350
		var finalResult = Number(rounded + 'e-' + precision).toFixed(precision); // 12350e-2 === 123.5, back to string
		return finalResult;
	};

var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);
		var power = Math.pow(10, precision);

		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
	};

// y = toFixed, c = lib, a = value, b = precision, n = checkPrecision, d = exponentialForm, e = rounded
y=c.toFixed =function(a,b){var b=n(b,c.settings.number.precision),var d=Number(c.unformat(a)+'e'+b);var e=Math.round(d);var f=Number(e+'e-'+b).toFixed(b);return f;},

	return(Math.round(c.unformat(a)*d)/d).toFixed(b)},

function factorial(n) {
	if (n === 1) {
		return 1;
	} else {
		return n * factorial(n-1);
	}
};

function unwrapData(data) { /////
	if (!Array.isArray(data)) {
		return data;
	} else {
		return unwrapArray(data[0]);
	}
}

var link2 = {
	cracked: false,
	next: null
};

var link1 = {
	cracked: false,
	next: link
};

function chainIsGood(link) {
	// Get the link cracked
	if (link.cracked) {
		return false;
	}

	// Process the next link
	if (link.next) {
		return chainIsGood(link.next);

	// If we reached the end, we're good
	} else {
		return true;
	}
}


function myMap(originalArray, callback, optionalThis) {
	var mapCallback = callback;

	if (optionalThis) {
		mapCallback = callback.bind(optionalThis);
	}

	var mappedArray = [];

	for (var i = 0; i < originalArray.length; i++) {
		if (i in originalArray) {
			mappedArray[i] = mapCallback(originalArray[i], i, originalArray);
		}
	}

	return mappedArray;
}


// recursion is used for 'unknown depth' problems
// returns x number of arrays 
function formatMoney(numbers) { //[[2]], [2], 2
	// recursive case
	if (Array.isArray(numbers)) {
		return numbers.map(function(element){ // element = [2], 2
			return formatMoney(element);
		});
	// base case
	} else {
		return '$' + numbers; // 2
	}
}

function formatMoney(numbers) {
	// recursive case
	if (Array.isArray(numbers)) {
		return myMap(numbers, function(element){ // element = [2], 2
			return formatMoney(element);
		});
	// base case
	} else {
		return '$' + numbers; // 2
	}
}

// formatMoney([[1]]) => ?
return [[1]].map(function mapper([1]) {
	return formatMoney([1]);
});

// mapper ([1]) => ?
return formatMoney([1]);

// formatMoney([1]) => ?
return [1].map(function mapper(1) {
	return formatMoney (1);
});

// mapper (1) => ?
return formatMoney(1);

// formatMoney(1) => ?
return '$' + 1;

function getUniqueCharacters(testString) {
	var characterStorage = {};
	characterStorage.UniqueCharacters = 0;

	for (var i = 0; i < testString.length; i++) {
		var currentCharacter = testString[i];

		if (characterStorage[currentCharacter]) {
			characterStorage[currentCharacter]++;
		} else {
			characterStorage[currentCharacter] = 1;
			characterStorage.UniqueCharacters++;
		}
	}

	return characterStorage;
}














