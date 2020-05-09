let roomid = sessionStorage.getItem("roomid");
let username = sessionStorage.getItem("username");
let turn={team:"",role:"spymaster"};

let role = sessionStorage.getItem("role");
let team = sessionStorage.getItem("team");

document.getElementById("team-info").innerHTML=team;
document.getElementById("role-info").innerHTML=role;

let socket = io();
socket.on('turnedcard', function(data) {
        console.log(data);
        word=data["word"];
        board.turnCard(word);
        scores=data["scores"];
        board.setScores(scores);
    });

socket.on('cluegiven', function(data) {
        console.log(data);
        clue=data["clue"];
        cluecount=data["cluecount"];
        turn.role="player";
        board.setTurn();
        board.setClue(clue,cluecount);
    });

socket.on('hitbomb', function(data) {
        console.log(data);
        teamloose=data["team"];
        word=data["word"];
        board.turnCard(word);
        setTimeout(() => alert(teamloose+" hit the bomb and looses the game"),1000);
        setTimeout(endsGame, 3000);
    });

socket.on('wingame', function(data) {
        console.log(data);
        teamwin=data["team"];
        word=data["word"];
        board.turnCard(word);
        alert(teamwin+" wins the game");
        setTimeout(endsGame, 3000);
    });


socket.emit("join",{"username":username,"roomid":roomid});

function endsGame() {
    location.href='room.html';
}

class Board {
    constructor() {
        this.createBoard();
    }

    // Creates the 5 x 5 board
    createBoard() {
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
            // alert("The "+turn.team+" team plays");
        });
        
        this.setTurn();

    }

    setTurn() {
        document.getElementById('game-turn').innerHTML=turn.team;

        if (role=="spymaster" && turn.role=="spymaster" && turn.team==team) {
            document.getElementById('game-clue').innerHTML=
                '<label>Clue:</label>'
                +'<input id="clue" type="text" size="20"/>'
                +'<label>In:</label>'
                +'<select id="cluecount">'
                +'    <option value="1" selected="selected">1</option>'
                +'    <option value="2">2</option>'
                +'    <option value="3">3</option>'
                +'    <option value="4">4</option>'
                +'    <option value="5">5</option>'
                +'    <option value="6">6</option>'
                +'</select>'
                +'<button type="submit" onclick="board.giveClue()">Go</button>';
        }
        else {
            document.getElementById('game-clue').innerHTML=
                '<label>Clue:</label>'
                +'<span id="clue"></span>'
                +'<label>In:</label>'
                +'<span id="cluecount"></span>';
        }
            
    }
    // Rotate the card
    clickCard(word) {
        if ((role=="player") && (turn.team==team) && (turn.role=="player") ) {
            socket.emit("turncard",{"roomid":roomid,"team":team,"word":word});
            this.turnCard(word);
        } else if ((role=="spymaster") && (turn.team==team) && (turn.role=="spymaster"))
            alert("You need to enter a clue")
        else 
            alert("You cannot play at this time")

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
            turn=scores.turn;
            this.setTurn();

        }

        this.setClue(scores.clue,scores.cluecount);
        
    }

    giveClue() {
        const clueObj = document.getElementById('clue');
        const cluecountObj = document.getElementById('cluecount');
        if (clueObj.value!="")
            socket.emit("giveclue",{"roomid":roomid,"team":team,"clue":clueObj.value,"cluecount":cluecountObj.value});
        else
            alert("Please enter a code name")
    }
    setClue(clue,cluecount) {
        const gameClueObj=document.getElementById('game-clue')
        const clueObj = document.getElementById('clue');
        const cluecountObj = document.getElementById('cluecount');
        if (clueObj.tagName=="INPUT") {
            clueObj.value=clue;
            cluecountObj.value=cluecount;
        }
        else {
            gameClueObj.style.visibility=(clue=="")?"hidden":"visible";
            clueObj.innerHTML=clue;
            cluecountObj.innerHTML=cluecount;
            }
    }


    cardComponent(word, team,role, element) {
        let spyfile="";
        if (team=="grey") {
            spyfile="Neutre"+(Math.floor(Math.random() * 9)+1)+".png"
        } else if (team=="bomb") {
            spyfile="Mort.png";
        } else {
            spyfile="Spy"+(Math.floor(Math.random() * 5)+1)+".png";
        }     

        if (role=="spymaster") {
            element.innerHTML +=
            '<div class="flip-card" onclick="board.clickCard(\'' + word + '\')">' +
                '<div class="flip-card-inner" id="' + word + '">' +
                    '<div class="flip-card-front flip-card-front-' + team + '">' +
                        '<h2>' + word + '</h2>' +
                    '</div>' +
                    '<div class="flip-card-back flip-card-back-' + team + '">' +
                        '<img src="../assets/icones/'+spyfile+'"/>'+
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
                    '<img src="../assets/icones/'+spyfile+'"/>'+
                    '</div>' +
                '</div>' +
            '</div>';
        }
    }
}

function loadTeams() {
    getRequest("/srv/getplayers/"+roomid,'json')
        .then(players => {
            let html={blue:"<ul>",red:"<ul>"}
            players.forEach(player => {
                html[player.team]+='<li>'+player.name+'</li>';
                });
            html.blue+="</ul>";
            html.red+="</ul>";
            document.getElementById("blue-players-column").innerHTML+=html.blue;
            document.getElementById("red-players-column").innerHTML+=html.red;           
        });
}

