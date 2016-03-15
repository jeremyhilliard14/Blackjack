// Deal needs to call shuffle and assign the deck.
// Set u a players starting plan
// Place the cards in the correct 


// Update styling of gameboard.
// What if the player gets blackjack on the deal?
// how can a card be an 11, 12, 13?
// Can an ace  = 1 or 11?
// The player can keep hitting and standing after the game is over.
// There is no win counter
// There is no wagering system.
// There is no deck to draw from
// the red card arent red
// there is no delay on the cards displaying(its instant)
// you can see both dealer card on deal

var theDeck =[];
var placeInDeck = 0;
var playerTotalCards = 2;
var dealerTotalCards = 1;
var wins = 0;
//var slowDeal = setInterval(deal, 5000);

$(document).ready(function(){
	$('button').click(function(){
		var clickedButton = ($(this).attr('id'));
		if(clickedButton == 'deal-button'){
			deal();
			//reset();
		}else if(clickedButton == 'hit-button'){
			hit();
		}else if(clickedButton == 'stand-button'){
			stand();
		}else if(clickedButton == 'new-game-button'){
			newGame();
		}
	});
});

function deal(){
	shuffleDeck();
	playerHand = [ theDeck[0], theDeck[2]];
	//dealerHand = [ theDeck[1], theDeck[3]];
	dealerHand = [ theDeck[1]];
	placeInDeck = 3;
	//setInterval(function(){
		placeCard(playerHand[0], 'player', 'one');
	//}, 500);
	//setInterval(function(){
		placeCard(dealerHand[0], 'dealer', 'one');
	//}, 1000);
	//setInterval(function(){
		placeCard(playerHand[1], 'player', 'two');
	//}, 1500);
	//placeCard(dealerHand[1], 'dealer', 'two');
	//setInterval(function(){
		calculateTotal(playerHand, 'player');
	//}, 1750);
	//setInterval(function(){
		calculateTotal(dealerHand, 'dealer');
	//}, 1750);
	var playerHas = Number($('.player-total').html());
	if(playerHas == 21){
		$('#message').html("Blackjack!");
	} 

}



function placeCard(card, who, slot){
	var currId = '#' + who + '-card-' + slot;
	$(currId).removeClass('empty');
	if(card[1] == 'r'){}
	$(currId).html(card);
	
}

function calculateTotal(hand, who) {
	var total = 0;
	var cardValue = 0;
	for(i=0; i<hand.length; i++){
		//Purposely NOT fixing 11, 12, or 13, or 1=11;
		cardValue = Number(hand[i].slice(0, -1));
		if ((cardValue == 11) || (cardValue == 12) || (cardValue == 13)){
			cardValue = 10;
		}
		if(cardValue == 1){
			if (total + 11 <= 21){
				cardValue = 11;
			}else{
				cardValue = 1;
			}
		}
		total += cardValue;
	}
	//update html
	var idToGet = '.' + who + '-total';
	$(idToGet).html(total);

	//console.log(total);

	if(total > 21){
		bust(who);
	}


}


function shuffleDeck(){
		// fill the deck in order, for now
		// Deck is made up of...
		// - 52 cards
		// -4 suits
		// 	- hart, spades, diamond, clubs
		// 
	theDeck = [];
	for(s=1; s<=4; s++){	

		var suit = "";
		if(s === 1){
			suit = 'h';
			$('.card').prop('color', 'red');
		}else if(s === 2){
			suit = 's';
		}else if(s === 3){
			suit = 'd';
		}else if(s === 4){
			suit = 'c';
		}

		for (i=1; i<=13; i++){
			theDeck.push(i+suit);
		}
	}
	//console.log(theDeck);

	var numberOfTimesToShuffle = 500;
	for(i = 1; i<numberOfTimesToShuffle; i++){
		card1 = Math.floor(Math.random()*theDeck.length);
		card2 = Math.floor(Math.random()*theDeck.length);
		if(card1 != card2){
			temp = theDeck[card1];
			theDeck[card1] = theDeck[card2];
			theDeck[card2] = temp;
		}
	}
	
}	

function hit(){
	var slot = '';
	if(playerTotalCards == 2){slot = "three";}
	else if(playerTotalCards == 3){slot = "four";}
	else if(playerTotalCards == 4){slot = "five";}
	else if(playerTotalCards == 5){slot = "six";}

	//setInterval(function(){
		placeCard(theDeck[placeInDeck], 'player', slot);
	//}, 500);
	playerHand.push(theDeck[placeInDeck]);
	placeInDeck++;
	playerTotalCards++;
	//setInterval(function(){
		calculateTotal(playerHand, 'player');
	//}, 750);
}


function stand(){
	var slot = '';
	//What happens to player?  Nothing
	var dealerTotal = $('.dealer-total').html();
	//same as calculateTotal(dealerHand, 'dealer');
	while(dealerTotal < 17){
		if(dealerTotalCards == 1){ slot = "two";}
		else if(dealerTotalCards == 2){ slot = "three";}
		else if(dealerTotalCards == 3){ slot = "four";}
		else if(dealerTotalCards == 4){ slot = "five";}
		else if(dealerTotalCards == 5){ slot = "six";}
		// setInterval(function(){
			placeCard(theDeck[placeInDeck], 'dealer', slot);
		//}, 500);
		dealerHand.push(theDeck[placeInDeck]);
		dealerTotalCards++;
		placeInDeck++;
		//setInterval(function(){
			calculateTotal(dealerHand, 'dealer');
		//}, 750);
		dealerTotal = $('dealer-total').html();
		
	}
		//We now know the dealer has at least 17.  Check to see who has a higher total.
		checkWin();
}


function checkWin(){
	var playerHas = Number($('.player-total').html());
	var dealerHas = Number($('.dealer-total').html());
	if(dealerHas > 21){
		//The dealer has busted
		bust('dealer');
	}else{
		//Niether player have busted.
		if(playerHas > dealerHas){
			//Player won
			$('#message').html("You have beaten the dealer!");
			totalWins();
			$('#hit-button').attr('disabled', 'disabled');
			$('#deal-button').attr('disabled', 'disabled');
			$('#stand-button').attr('disabled', 'disabled');
		}else if(dealerHas > playerHas){
			//Dealer won
			$('#message').html("Sorry, the dealer has beaten you.");
			$('#hit-button').attr('disabled', 'disabled');
			$('#deal-button').attr('disabled', 'disabled');
			$('#stand-button').attr('disabled', 'disabled');
		// }else if(playerHas = 21){
		// 	$('#message').html("Blackjack!");
		// 	$('#hit-button').attr('disabled', 'disabled');
		// 	$('#deal-button').attr('disabled', 'disabled');
		// 	$('#stand-button').attr('disabled', 'disabled');
		// }else if(dealerHas = 21){
		// 	$('#message').html("Blackjack!");
		// 	$('#hit-button').attr('disabled', 'disabled');
		// 	$('#deal-button').attr('disabled', 'disabled');
		// 	$('#stand-button').attr('disabled', 'disabled');
		}else{
			//tie
			$('#message').html("Push!");
			$('#hit-button').attr('disabled', 'disabled');
			$('#deal-button').attr('disabled', 'disabled');
			$('#stand-button').attr('disabled', 'disabled');

		}
	}
}

function bust(who){
	if(who == 'player'){
		$('#message').html("You have busted!");
		$('#hit-button').attr('disabled', 'disabled');
		$('#deal-button').attr('disabled', 'disabled');
		$('#stand-button').attr('disabled', 'disabled');
	}else{
		$('#message').html("The dealer has busted.  You Win!");
		$('#hit-button').attr('disabled', 'disabled');
		$('#deal-button').attr('disabled', 'disabled');
		$('#stand-button').attr('disabled', 'disabled');
	}
}


function newGame(){
	$('.card').addClass("empty");
	Number($('.player-total').html(0));
	Number($('.dealer-total').html(0));
	$('#message').html("");
	$('.card').html("");
	$('#stand-button').removeAttr('disabled');
	$('#hit-button').removeAttr('disabled');
	$('#deal-button').removeAttr('disabled');
	playerTotalCards = 2;
	dealerTotalCards = 1;
	
}

function totalWins(){
	
	// var totalWins = 0;
	var playerHas = Number($('.player-total').html());
	var dealerHas = Number($('.dealer-total').html());
	if(playerHas > dealerHas){
		wins++;
		$('.player-wins').html(wins);
	}else if(dealerHas > 21){
		wins++;
		$('.player-wins').html(wins);
	}else if(playerHas == 21){
		wins++;
		$('.player-wins').html(wins);
	}
}

// function blackjack(){
// 	if(playerHas )
// }


