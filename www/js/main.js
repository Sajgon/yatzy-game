// global variables

// Run functions on DOM load
$(function (){
	
	// Klick knapp
	$('#throwDices').click(function(){
		var arrDice = [];
		for (var i = 0; i < 5; i++){
			arrDice.push(randomDiceGenerator());
		}
		dicehand = arrDice;
		currentGame.nbrThrows--;
		currentGame.dice = arrDice;
		localStorage.setItem("yatzi-game", JSON.stringify(currentGame));
		// You can call show dices anywhere
		showDices(arrDice);
		// scores = runScoreTest(arrDice);
		displayPossibleCombinations();
		$("#throwDices").prop("disabled", (currentGame.nbrThrows < 1 ? true : false));
		//console.log(scores);
	});
	
	$('#startGame').click(function(){
		
		// check that atleast 1 player is added to the playernames
		
		if(currentGame.players.length >= 1 ){
			// call function to set game started
			setGameStarted();
		}
	});
	
	
	// Add username
	$('#adduserBtn').click(function(){
		username = $("#usernameInput").val();
		addUsernameToGameid(username);
		
		loadPlayerNamesToList();
		$("#usernameInput").val("");
	});

	// End game button
	$('#endGameBtn').click(function(){
		
		function endGame(){
			localStorage.removeItem("yatzy-game");
			// $("#player-names").empty();
			isLocalStorageKeys();
			
			loadPlayerNamesToList()
			
			$(".beforegame").show();
			$(".ingame").hide();
			$(".ingameFooter").hide();
		}

		endGame();
	});
	
	// Clean highscore
	$('#cleanHighscoreBtn').click(function(){
		
		function removeHighscore(){
			localStorage.removeItem("yatzy-highscore");
			isLocalStorageKeys();
			highscoreOutput();
		}

		removeHighscore();
	});
	
	$("body").on("click", ".tmpCombClick", function(){
		var confirmedComb = $(this).data("id");
		console.log("chosed: " + confirmedComb);
		$("#clickRowModal").modal('hide');
		handlePlayerDone(confirmedComb);
		$("#throwDices").prop("disabled", false);
	});
	
	isLocalStorageKeys();
	
	// load playernames at start
	loadPlayerNamesToList();
	highscoreOutput();
	
	
});

// 
function handlePlayerDone(combId){
	var index = arrComboId.indexOf(combId);
	currentGame.players[currentGame.currentPlayer].combinations[index] = playCombi[combId];
	currentGame.nbrThrows = 3;
	currentGame.currentPlayer++;
	if(currentGame.currentPlayer === currentGame.players.length)
		currentGame.currentPlayer = 0;
	localStorage.setItem("yatzi-game", JSON.stringify(currentGame));
	drawTable();
}

// 
function displayPossibleCombinations(){
	updateScore();
	arrComboId.forEach(function(comb, i){
		if(playCombi[comb] > 0){
			$("#" + comb).addClass("playableComb").addClass("combClick");
		}
	});
}


// Write dice array to DOM
function showDices(diceArray){
	// utf-8 characters for dice faces

	// loop through our dice array with dice values and output dice characters
	for(var i = 1; i <= 6; i++){
		var fullDiceImage = "<img src='images/die_"+ i +".png'>";
		$('.dice-space-' + i).html(fullDiceImage);
	}
}

function randomDiceGenerator(){
	var random = Math.floor(Math.random() * 6) + 1;
	return random;
}

function loadPlayerNamesToList(){
	if(currentGame.players.length){
		
		// make sure to clean UL before we add new list items
		$("#player-names").empty();
		
		for(var i = 0; i < yatzygames["game"].playernames.length; i++){
			
			var playerPosition = i+1;
			var playerPositionString = playerPosition + ". ";
			
			addLiUsername = "<li>" + playerPositionString + yatzygames["game"].playernames[i]+"<span class='glyphicon glyphicon-remove removeButton' aria-hidden='true'></span></li>"
			$("#player-names").append(addLiUsername);
			$("#startGame").prop("disabled", false);
		}
		
	}
}

/*	Function to draw table combinations, scores and playernames */
function drawTable(){
	var head = '<thead>' + 
	'<tr id="playernames">' + 
	'<th>Spelare</th>';

		// var players = [{id:1, name:"youssef", combinations : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]}, {id:2, name:"", combinations : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]}];//llllll

		currentGame.players.forEach(function(v,i){
			var classPlayer = v.id === currentGame.currentPlayer ? '" class="high-player" ': "";
			head += '<th id="playerName'+ v.id + '"' + classPlayer + ' >'+ v.name +'</th>';
		});
								
		head += '</tr></thead>';

		var tbody =  '<tbody>';

		for (var i = 0; i < 18; i++) {
			tbody += '<tr id="' + arrComboId[i] + '" class="comboBtn">' + 
			'<th id="btn' + arrComboId[i] + '" scope="row" class="col-xs-12 col-md-12 btn btn-default">' + arrComboName[i] + '</th>';

			currentGame.players.forEach(function(p,j){
				tbody += '<td>' + p.combinations[i] + '</td>';
			});
			tbody += '</tr>';
		};

		tbody += '</tbody>';

		$("#score-table").html("");
		$("#score-table").append(head+tbody);

		$(".comboBtn").click(function(){
			showRrowToClick(this.id);
		});
};

var arrComboId = ['ettor', 'tvaor', 'treor', 'Fyror', 'femmor', 'sexor', 'summa', 'bonus', 'ettpar', 'tvapar', 'triss', 'fyrtal', 'litenstege', 'storstege', 'kak', 'chans', 'yatzy', 'total' ];
var arrComboName = ['Ettor', 'Tvåor', 'Treor', 'Fyror', 'Femmor', 'Sexor', 'Summa', 'Bonus', 'Ett Par', 'Två Par', 'Triss', 'Fyrtal', 'Liten Stege', 'Stor Stege', 'Kåk', 'Chans', 'Yatzy!', 'Total'];

function showRrowToClick(element){
	$("#clickRowModal").remove();
	var combName = $("#" + element + " th").html();

	var modalContainer = '<div id="clickRowModal" class="modal fade" role="dialog">' + 
	  						'<div class="modal-dialog" role="document">' + 
	    						'<div class="modal-content">' + 
	    							'<div class="modal-header">' +
								        '<h6 class="modal-title">Tryck på knappen för att bekräffta.. Annars var som helst på skärmen för att välja en annan...</h6>' +
								      '</div>' +
	      							'<div class="modal-body">' + 
	      								'<table><tbody><tr class="row">' +
	      									'<th data-id="' + element + '" class="col-xs-12 btn btn-default tmpCombClick">' + combName + '</th>';+
	      									'<td class="col-xs-12 btn btn-danger">Stäng</td>';+
	      								 '</tr></tbody></table>' +  
	      							'</div>' + 
      							'</div>' + 
  							'</div>'  + 
						 '</div>';
	$("body").append(modalContainer);
  	$("#clickRowModal").modal("show");
}


// add a user to local storage
function addUsernameToGameid(username){
	// get localstorage object
	//var yatzygames = JSON.parse(localStorage.getItem("yatzy-games"));
	currentGame = JSON.parse(localStorage.getItem("yatzy-game"));
	
	// validate username & gameid input
	if(username.length >= 1 && username.length <= 12){
		if(currentGame.players.length < 4){
			
			// Visa att knappen är klickbar
			$("#adduserBtn").prop("disabled", false);
			
			// push username to object
			var newPlayer = { id: currentGame.players.length, name: username, combinations : generatCombinations()};
			currentGame.players.push(newPlayer);
			// push yatzygames to localStorage
			localStorage.setItem("yatzy-game", JSON.stringify(currentGame));
			
			// if maximum players length has been reached
			if(currentGame.players.length == 4){
				// disable "lägg till användare" knapp
				$("#adduserBtn").prop("disabled", true);
			}
			
			return true;
		}
		
		// Error: we couldnt find username object from localstorage
		return false;	
	}else{
		// Inget användarnamn inskrivet eller mer än maxlängd 12
		// retunera felmeddelande
	}
	
	return false;
}

function loadPlayerNamesToList(){
	// make sure to clean UL before we add new list items
	$("#player-names").empty();

	console.log(currentGame);
	
	if(currentGame.players.length){
		$("#startGame").prop("disabled", false);
		$("#continueGame").prop("disabled", false);
	}
	
	currentGame.players.forEach(function(player, i){		
		var playerPosition = i+1;
		var playerPositionString = playerPosition + ". ";
		
		addLiUsername = "<li>" + playerPositionString + player.name +" <span class='glyphicon glyphicon-remove removePlayerBtn' aria-hidden='true'></span></li>"
		$("#player-names").append(addLiUsername);
	});
	
}

// changed status "started" to true when button "STARTA SPEL" is pressed
function setGameStarted(){
	
	if(currentGame !==  null){
		// set started to true
		currentGame.started = true;
		
		// set game to started in localStorage
		localStorage.setItem("yatzy-game", JSON.stringify(currentGame));
		
		drawTable();
		
		// Visa korrekta element
		$(".beforegame").hide();
		$(".ingame").show();
		$(".ingameFooter").show();
			
		return true;
	}
		
	return false;
}