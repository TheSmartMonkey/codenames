var roomid = sessionStorage.getItem("roomid");
var username = sessionStorage.getItem("username");
var turn={team:"",role:"spymaster"};

let role = sessionStorage.getItem("role");
let team = sessionStorage.getItem("team");

let socket = io();
socket.on('turnedcard', function(data) {
        console.log(data);
        word=data["word"];
        board.turnCard(word);
        scores=data["scores"];
        board.setScores(scores);
        turn=data["turn"];
    });

socket.on('giveclue', function(data) {
        console.log(data);
        clue=data["clue"];
        board.setClue(clue,cluecount);
    });

socket.emit("join",{"username":username,"roomid":roomid});


class Board {
    constructor() {
        this.createBoard();
    }

    // Creates the 5 x 5 board
    createBoard() {
        const myteam = document.getElementById('game-team');
        myteam.className=team+"-team score-team"
        getRequest('/srv/getcard/'+roomid+"/"+username,'json')
            .then(cards => {
                
                let numberOfElements = 0;
                cards.forEach(card => {
                    var colIndex=Math.trunc(numberOfElements/5)+1;
                    this.cardComponent(card.word,card.team,role, document.getElementById("column"+colIndex))
                    if (card.found) {
                        this.turnCard(card.word);
                    }
                    numberOfElements++;
                });
            });
        getRequest('/srv/getscores/'+roomid,'json')
        .then(scores => {
            this.setScores(scores);
            alert("The "+turn.team+" team starts");
        });
        
        if (role=="spymaster" && turn.role=="spymaster") {
            document.getElementById('game-clue').innerHTML+=
                '<label>Clue:</label>'
                +'<input id="clue" type="text" size="20"/>'
                +'<label>In:</label>'
                +'<select id="cluecount">'
                +'    <option value="1">1</option>'
                +'    <option value="2">2</option>'
                +'    <option value="3">3</option>'
                +'    <option value="4">4</option>'
                +'    <option value="5">5</option>'
                +'    <option value="6">6</option>'
                +'</select>'
                +'<button type="submit" onclick="board.giveClue()">Go</button>';
        }
        else {
            document.getElementById('game-clue').innerHTML+=
                '<label>Clue:</label>'
                +'<p id="clue"></p>'
                +'<label>In:</label>'
                +'<p id="cluecount"></p>';
        }
        

    }

    // Rotate the card
    clickCard(word) {
        if ((role=="player") && (team==turn)) {
            socket.emit("turncard",{"roomid":roomid,"team":team,"word":word});
            this.turnCard(word);
        } else alert("You cannot play at this time")

    }

    turnCard(word) {
        const cardElement = document.getElementById(word)
        cardElement.setAttribute("style", "transform: rotateY(180deg);")
    }

    setScores(scores) {
        const scoreBlue = document.getElementById('game-score-blue');
        const scoreRed = document.getElementById('game-score-red');
        scoreBlue.innerHTML = scores.scores.blue;
        scoreRed.innerHTML = scores.scores.red;
        if (turn.team != scores.turn.team) {
            this.changeTurn(scores.turn)
        }

        if (scores.blue==0) {
            document.getElementById('game-score').innerHTML("<p>Blue wins</p>"+buttonCode)
        }
        if (scores.red==0) {
            document.getElementById('game-score').innerHTML("<p>Red wins</p>"+buttonCode)
        }
    }

    giveClue() {
        const clueObj = document.getElementById('clue');
        const cluecountObj = document.getElementById('cluecount');
        socket.emit("giveclue",{"roomid":roomid,"team":team,"clue":clueObj.value,"cluecount":cluecountObj.value});

    }
    setClue(clue,cluecount) {
        const clueObj = document.getElementById('clue');
        const cluecountObj = document.getElementById('cluecount');
        if (clueObj) {
            clueObj.innerHTML=clue;
            cluecountObj.innerHTML=cluecount;
        }
    }

    changeTurn(newturn) {
        const scoreTurn = document.getElementById('game-turn');
        turn = newturn;
        scoreTurn.className=turn.team+"-team score-team";
        //alert("Now the team "+scores.turn+" plays");

    }

    cardComponent(word, team,role, element) {
        if (role=="spymaster") {
            element.innerHTML +=
            '<div class="flip-card" onclick="board.clickCard(\'' + word + '\')">' +
                '<div class="flip-card-inner" id="' + word + '">' +
                    '<div class="flip-card-front flip-card-front-' + team + '">' +
                        '<h2>' + word + '</h2>' +
                    '</div>' +
                    '<div class="flip-card-back flip-card-back-' + team + '">' +
                        '<h2>' + word + '</h2>' +
                    '</div>' +
                '</div>' +
            '</div>';
        } else {
            element.innerHTML +=
            '<div class="flip-card" onclick="board.clickCard(\'' + word + '\')">' +
                '<div class="flip-card-inner" id="' + word + '">' +
                    '<div class="flip-card-front">' +
                        '<h2>' + word + '</h2>' +
                    '</div>' +
                    '<div class="flip-card-back flip-card-back-' + team + '">' +
                        '<h2>' + word + '</h2>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
    }
}


