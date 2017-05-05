var inquirer = require("inquirer");
var fs = require("fs");
var Flashcard = require("./constructor.js");
var flashcardArray = [];
var fullTextArray = [];
var clozeArray = [];
var win = 0;
var lose = 0;
var i = 0;
var j = 0;
var data;
var removeFlashcard = "";

// This runs the starting menu
startingMenu();

// This is the starting menu
function startingMenu() {
	// This asks the user what they want to do
	inquirer.prompt([
		  	{
				type: "list",
		    	message: "Please choose what you want to do.",
		    	choices: ["QUIT", "Create new Flashcard", "Test your Flashcards", "Display all Flashcards", "DELETE a Flashcard"],
		    	name: "choices"
		  	}
		]).then(function(answers) {
		  	if (answers.choices === "Create new Flashcard") {
		  		createNewFlashcard();
		  	} else if (answers.choices === "Test your Flashcards") {
		  		j = 0;
		  		testFlashcards();
		  	} else if (answers.choices === "Display all Flashcards") {
		  		allFlashcards();
		  	} else if (answers.choices === "DELETE a Flashcard") {
		  		removeFlashcard = "yes";
		  		allFlashcards();
		  	} else { return; }
		});
}

// This happens when the user selects "Create new Flashcard" from the starting menu
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
		var checkCloze = answers.fullText.split(" ");
		var checkAnswer = answers.clozeDeletion.split(" ");

		// Created a new variable to covert everything to lowercase
		// Don't want to add these lower case answers to the flashcard array
		var lowerCheckCloze = answers.fullText.toLowerCase().split(" ");
		var lowerCheckAnswer = answers.clozeDeletion.toLowerCase().split(" ");

		// This checks to make sure the word or phrase is in the full text
		for (var i = 0; i < checkAnswer.length; i++) {
			if (lowerCheckCloze.indexOf(lowerCheckAnswer[i]) === -1) {
				console.log("That isn't in your text. Please try again.");
				createNewFlashcard();
				return;
			} else if (answers.fullText === "" || answers.clozeDeletion === "") {
				console.log("Oops. Looks like you left something blank.  Please try again.");
				createNewFlashcard();
				return;
			}
		}
				
		console.log("This flashcard has been added.");
		console.log("======================");
		console.log("Flashcard: " + answers.fullText + "\nWord(s) omitted: " + answers.clozeDeletion);
		console.log("======================");
		var fc = new Flashcard (answers.fullText, answers.clozeDeletion);

		// This reads the flashcards from the log.json file. (They are in an array)
		fs.readFile("log.json", "UTF-8", function (err, data) {
		    if (err) {
		        throw err;
		    }

		    // This makes sure there is data to parse in the log.json file
		    if (data.length != 0) {
		    	data = JSON.parse(data);
			
				// This takes the array in the log.json and puts it in the array with the new flashcard created
				for (var c = 0; c < data.length; c++) {
					var fcFile = new Flashcard (data[c].front, data[c].back);
					flashcardArray.push(fcFile);
				}
		    }

			// This pushes the flashcard just created to the array
			flashcardArray.push(fc);

			// This writes the flashcard array to log.json, overwriting the previous array
			fs.writeFile("log.json", JSON.stringify(flashcardArray), function(err) {
	  			if (err) {
					return console.log(err);
				} 
			});
		});
		// This empties the array
		var flashcardArray = [];
		// Goes back to the starting menu
		startingMenu();
			
	});	
}

function testFlashcards() {
	// This reads the content of the log.json
	fs.readFile("log.json", "UTF-8", function (err, data) {
	    if (err) {
	        throw err;
	    }
	    if (data === "") { console.log("You have no flashcards.  :( ");
			startingMenu();
			return;
		} else
	    data = JSON.parse(data);

		testFlashcards2();

		function testFlashcards2() {
			if (data.length === 0) { console.log("You don't have any flashcards to test yet");
					startingMenu();
			} else { 
				if (j < data.length) {

					var clozeText = data[j].front;
					var clozeStuff = data[j].back.split(" ");
					
					// This removes part of the full text with ___
					for (var c = 0; c < clozeStuff.length; c++) {
						clozeText = clozeText.toLowerCase().replace(clozeStuff[c], "_____");
					}

					inquirer.prompt([
					  	{
					    	name: "frontOfCard",
					    	message: "Flashcard #" + (j + 1) + " " + clozeText

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
						// This is the recursion to cycle through the flashcards
						testFlashcards();
					});
					
				} else { console.log("The flashcards are over.\nYou got " + win + " correct and " + lose + " wrong.");
					j = 0;
					win = 0;
					lose = 0;
					startingMenu();
				}
			}
		}
	});
}

function allFlashcards() {

	fs.readFile("log.json", "UTF-8", function (err, data) {
	    if (err) {
	        throw err;
	    }

	    if (data === "" || data === "[]") { console.log("You have no flashcards.  :( ");
			startingMenu();
			return;
		} else {
		    data = JSON.parse(data);
		    for (var i = 0; i < data.length; i++) {
		    	console.log("Flashcard #" + (i + 1));
		    	console.log("Full text: " + data[i].front + "\nWord(s) omitted: " + data[i].back);
		    	console.log("======================");
		    }
		    	
		    if (removeFlashcard === "yes") { removeFlashcard = "no";
	    		deleteAFlashcard();
	    		return;
		    }
		    	startingMenu();
		    	return;  
		}
		
		function deleteAFlashcard() {

			inquirer.prompt([
		  	{
		  		name: "deleteCard",
		  		message: "Please enter the number on the flashcard you wish to delete. Type q to exit."
		  	}
			]).then(function(answers) {
				
				if (answers.deleteCard.toLowerCase() === "q") {
					startingMenu();
		    		return; 
				} else if (answers.deleteCard === "") { console.log("You didn't select a number.");
				deleteAFlashcard();
				return;
				} else if (answers.deleteCard > data.length || answers.deleteCard < 0 || isNaN(answers.deleteCard) === true) { console.log("That's not a valid selection.");
					deleteAFlashcard();
					return;
				}

			// This subtracts 1 from the answer b/c indexes start at 0.
			answers.deleteCard -= 1;

			// This deletes the flashcard from the array
			data.splice(answers.deleteCard, 1);
			console.log("It has been deleted.");

				// This takes the array in the log.json and puts it in the array with the new flashcard created
				for (var i = 0; i < data.length; i++) {
					var fcFile = new Flashcard (data[i].front, data[i].back);
					flashcardArray.push(fcFile);
				}
				
				fs.writeFile("log.json", JSON.stringify(data), function(err) {
	  				if (err) {
					return console.log(err);
					} 
				});
				startingMenu();
			});
		}
	});	
}