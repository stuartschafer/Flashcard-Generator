var inquirer = require("inquirer");
var fs = require("fs");
var flashcardArray = [];
var fullTextArray = [];
var clozeArray = [];
var win = 0;
var lose = 0;
var i = 0;
var j = 0;
var data;

function Flashcard(front, back) {
	this.front = front;
	this.back = back;
}

// This runs the starting menu
whatToDo();

// This is the starting menu
function whatToDo() {

	inquirer.prompt([
		  	{
				type: "list",
		    	message: "Please choose what you want to do.",
		    	choices: ["QUIT", "Add a Flashcard", "Test your Flashcards", "Display all Flashcards"],
		    	name: "choices"
		  	}
		]).then(function(answers) {
		  	if (answers.choices === "Add a Flashcard") {
		  		createNewFlashcard();
		  	} else if (answers.choices === "Test your Flashcards") {
		  		j = 0;
		  		testFlashcards();
		  	} else if (answers.choices === "Display all Flashcards") {
		  		allFlashcards();
		  	} else { return; }
		});
}

// This happens when the user selects tyo create a new flashcard
function createNewFlashcard() {
	
	inquirer.prompt([
	  	{
	    	name: "fullText",
	    	message: "Flashcard:" + "\nPlease enter the entire text."
	  	}, {
	  		name: "clozeDeletion",
	  		message: "Please enter what you want to remove from the text."
	  	}
	]).then(function(answers) {
		answers.clozeDeletion = answers.clozeDeletion.toLowerCase();
		var checkCloze = answers.fullText.split(" ");
		var checkAnswer = answers.clozeDeletion.split(" ");

		// This checks to make sure the word or phrase is in the full text
		for (var i = 0; i < checkAnswer.length; i++) {
			if (checkCloze.indexOf(checkAnswer[i]) === -1) {
				console.log("That isn't in your text. Please try again.");
				createNewFlashcard()
			} else if (answers.fullText === "" || answers.clozeDeletion === "") {
				console.log("Oops. Looks like you left something blank.  Please try again.");
				createNewFlashcard();
			} else {

				console.log("This flashcard has been added.");

				console.log("======================");
				console.log("Flashcard: " + answers.fullText + "\nWord(s) omitted: " + answers.clozeDeletion);
				console.log("======================");
				var fc = new Flashcard (answers.fullText, answers.clozeDeletion);

				// This reads the flashcards from the log.txt file. (They are in an array)
				fs.readFile("log.txt", function (err, data) {
				    if (err) {
				        throw err;
				    }

				    // This makes sure there is data to parse in the log.txt file
				    if (data.length === 0) {
				    } else {
					data = JSON.parse(data);
					}

					// This takes the array in the log.txt and puts it in the array with the new flashcard created
					for (var i = 0; i < data.length; i++) {
						var fcFile = new Flashcard (data[i].front, data[i].back);
						flashcardArray.push(fcFile);
					}

					// This pushes the flashcard just created to the array
					flashcardArray.push(fc);

					// This writes the flashcard array to log.txt, overwriting the previous array
					fs.writeFile("log.txt", JSON.stringify(flashcardArray), function(err) {
			  			if (err) {
							return console.log(err);
						} 
					});
				});
				var flashcardArray = [];
				// Goes back to the starting menu
				whatToDo();
			}
		}
	});	
}

function testFlashcards() {
	fs.readFile("log.txt", function (err, data) {
	    if (err) {
	        throw err;
	    }

	    data = JSON.parse(data);

		testFlashcards2();

		function testFlashcards2() {
			if (data.length === 0) { console.log("You don't have any flashcards to test yet");
					whatToDo();
			} else { 
				if (j < data.length) {

					data[j].back = data[j].back.toLowerCase();
					var clozeStuff = data[j].back.split(" ");

					inquirer.prompt([
					  	{
					    	name: "frontOfCard",
					    	message: "Flashcard #" + (j + 1) + " " + (data[j].front).
						    	replace(clozeStuff[0], "_____").
						    	replace(clozeStuff[1], "_____").
						    	replace(clozeStuff[2], "_____").
						    	replace(clozeStuff[3], "_____").
						    	replace(clozeStuff[4], "_____").
						    	replace(clozeStuff[5], "_____").
						    	replace(clozeStuff[6], "_____").
						    	replace(clozeStuff[7], "_____").
						    	replace(clozeStuff[8], "_____").
						    	replace(clozeStuff[9], "_____")
					  	}
					]).then(function(answers) {
					  	if ((answers.frontOfCard).toLowerCase() === (data[j].back).toLowerCase()) {
					  		console.log("*** Yes, the answer was: " + data[j].back + "\nFull Text: " + data[j].front);
					  		console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
					  		win++;
						} else { console.log("*** Nope, the answer was: " + data[j].back + "\nFull Text: " + data[j].front);
							console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
							lose++;
						}
						j++;
						testFlashcards();
					});
					
				} else { console.log("The flashcards are over.\nYou got " + win + " correct and " + lose + " wrong.");
					j = 0;
					whatToDo();
				}
			}
		}
	});
}

function allFlashcards() {
	fs.readFile("log.txt", function (err, data) {
	    if (err) {
	        throw err;
	    }
	    data = JSON.parse(data);
	    for (var i = 0; i < data.length; i++) {
	    	console.log("Flashcard #" + (i + 1));
	    	console.log("Full text: " + data[i].front + "\nWord(s) omitted: " + data[i].back);
	    	console.log("======================");
	    }
	});

	// console.log("Please enter the number on the flashcard you wish to delete.")
}