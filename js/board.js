var roomid = sessionStorage.getItem("roomid");
var username = sessionStorage.getItem("username");

let role = sessionStorage.getItem("role");
let team = sessionStorage.getItem("team");

let socket = io();
socket.on('turnedcard', function(data) {
        console.log(data);
        word=data["word"];
        board.turnCard(word);
        scores=data["scores"];
        board.setScores(scores);
    });

socket.emit("join",{"username":username,"roomid":roomid});


class Board {
    constructor() {
        this.createBoard();
    }

    // Creates the 5 x 5 board
    createBoard() {
        getRequest('/getcard/'+roomid+"/"+username,'json')
            .then(cards => {
                
                let numberOfElements = 0;
                cards.forEach(card => {
                    var colIndex=Math.trunc(numberOfElements/5)+1;
                    this.cardComponent(card.word,card.team,role, document.getElementById("column"+colIndex))
                    numberOfElements++;
                });
            });
        getRequest('/getscores/'+roomid,'json')
        .then(scores => {
            this.setScores(scores);
        });
    }

    // Rotate the card
    clickCard(word) {
        socket.emit("turncard",{"roomid":roomid,"team":team,"word":word});
        this.turnCard(word);
    }

    turnCard(word) {
        const cardElement = document.getElementById(word)
        cardElement.setAttribute("style", "transform: rotateY(180deg);")
    }

    setScores(scores) {
        const scoreBlue = document.getElementById('game-score-blue');
        const scoreRed = document.getElementById('game-score-red');
        scoreBlue.innerHTML = scores.blue;
        scoreRed.innerHTML = scores.red;
        // const scoreElement = document.getElementById('game-score');
        // scoreElement.innerHTML = scores.blue + " - " + scores.red;
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


