var inquirer = require("inquirer");
var fs = require("fs");
var clozeArray = [{"front":"we like to watch tv and eat food","back":"like watch food"}];


testFlashcards2();


function testFlashcards2() {

			// This removes part of the full text with ___
			for (var c = 0; c < clozeStuff.length; c++) {
				var clozePhrase = (data[j].front).replace(clozeStuff[c], "_____");
			}

			inquirer.prompt([
			  	{
			    	name: "frontOfCard",
			    	message: "Flashcard #" + (j + 1) + " " + clozePhrase

			    		// (data[j].front).
				    	// replace(clozeStuff[0], "_____").
				    	// replace(clozeStuff[1], "_____").
				    	// replace(clozeStuff[2], "_____").
				    	// replace(clozeStuff[3], "_____").
				    	// replace(clozeStuff[4], "_____").
				    	// replace(clozeStuff[5], "_____").
				    	// replace(clozeStuff[6], "_____").
				    	// replace(clozeStuff[7], "_____").
				    	// replace(clozeStuff[8], "_____").
				    	// replace(clozeStuff[9], "_____")
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
			startingMenu();
		}
	}
}