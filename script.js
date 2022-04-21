var cardColors = ["red", "green", "blue", "yellow", "black", "white"];

function main(){

    let gameRounds = 0;
    let gameRun = true;
    let players = [];
    let ammountOfPlayers = document.getElementById("ammountOfPlayers").value;
    let ammountOfCards = document.getElementById("ammountOfCards").value;
    let playerNames = ["Michael", "Daniel", "Alex", "Paul", "Sandra", "Alina", "Carol", "Alice", "Bob", "Mario"] 
    let logo = '<i class="fas fa-crown">';

    if (ammountOfPlayers < 2 || ammountOfPlayers > 10) {
        alert("Please enter ammount of players between 2 and 10");
        return;        
    } else if(ammountOfCards < 2 || ammountOfCards > 6){
        alert("Please enter ammount of cards between 2 and 6");
        return;
    }

    let cards = new Cards(ammountOfCards);

    for (let index = 0; index < ammountOfPlayers; index++) {
        players.push(new Player(playerNames[index], cards));
    }

    let game = new Game(ammountOfCards, players);

    if (document.contains(document.getElementById("tblRanking"))) {
        document.getElementById("tblRanking").remove();
    }

    let dice = new Dice();
    
    while(gameRun){
        gameRounds++;
        for(let pla of players){
            let diceRes = dice.rollDice();
            pla.playerHasCard(diceRes);
                if (pla.playerIsFinished(ammountOfCards)) {
                    gameRun=false;
                    break;
                }
        }
    }
    game.getResult();
    
    let tbl = new tableMaker(ammountOfPlayers, gameRounds, ammountOfCards, game.result);
    tbl.createTable();
    tbl.fillTable();
}

class Game {
    constructor(ammountOfCards, players){
        this.ammountOfCards = ammountOfCards;
        this.players= players;
        this.result = [];
    }
    getResult(){        
        this.players.forEach(pl => {
                this.result.push([pl.playerCardsBurntNum, pl]);
        });
        this.result.sort().reverse();
        }
}

class Player {
    
    constructor(name, cards) {
        this.playerName = name;
        this.playerCards = cards.dealCards();
        this.playerCardsBurntNum = 0;
        this.checkCards = [];
    }

    playerHasCard(card){
        if (this.playerCards.includes(card) && !this.checkCards.includes(card)) {
            this.playerCardsBurntNum++;
            this.checkCards.push(card);
        }
    }

    playerIsFinished(ammountOfCards){
        return this.playerCardsBurntNum == ammountOfCards;
    }
}



class Cards{

    constructor(ammountOfCards){
        this.ammountOfCards = ammountOfCards;
    }
    
    dealCards(){
        let count = 0;
        let cards = [];
        while(count != this.ammountOfCards){
            let color =  cardColors[Math.floor(Math.random() * 6)]
            if(!cards.includes(color)){
                cards[count] = color;
                count++;
            }
        }
        return cards;
    }
}

class tableMaker{

    constructor(cols, gameRounds, ammountOfCards, result){
        this.cols = cols;
        this.gameRounds = gameRounds;
        this.ammountOfCards = ammountOfCards;
        this.result = result;
    }

    createTable() {
    
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
    
        document.getElementById('body').appendChild(table);
    
        let tr1 = document.createElement('tr');
        let td1 = document.createElement('td');
    
        td1.setAttribute('colspan', '2');
        table.setAttribute('class', 'content-table');
        table.setAttribute('id', 'tblRanking');
    
        tr1.appendChild(td1);
        thead.appendChild(tr1);
    
        table.appendChild(thead);
    
        for (let i = 0; i < this.cols; i++){
            let tr = document.createElement('tr');   
    
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
    
            td1.setAttribute('class', 'left');
            td2.setAttribute('class', 'right');
    
            tr.appendChild(td1);
            tr.appendChild(td2);
    
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        document.body.appendChild(table);
    }

    fillTable() {
        var myTable = document.getElementById("tblRanking");
        myTable.rows[0].cells[0].innerHTML = '<i class="fas fa-crown"><span style="font-family:Roboto">&nbsp;&nbsp;' + "Nach " + this.gameRounds + " Spielrunden" + '</span>';
    
        let count = 1;
        this.result.forEach(res => {
            myTable.rows[count].cells[0].innerHTML = count + ". " +res[1].playerName;
            if(this.ammountOfCards - res[1].playerCardsBurntNum != 0){
                myTable.rows[count].cells[1].innerHTML = this.ammountOfCards - res[1].playerCardsBurntNum;
            }
            count++;
        });
    }

}

class Dice{
    constructor(){}
    rollDice() {
        return cardColors[Math.floor(Math.random() * 6)];
    }
}

