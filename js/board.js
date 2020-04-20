class Board {
    constructor() {
        this.createBoard()
    }

    // Creates the 5 x 5 board
    createBoard() {
        getRequest('http://home.vandelle.com/site/codenames/assets/words/french.txt')
            .then(responseData => {
                const words = responseData.split('\n') // List of words
                const randomWords = [];
                
                // Get 25 random words
                for (let i = 0; i < 25; i++) {
                    let verify = true;
                    let rand = words[Math.floor(Math.random() * words.length)];

                    // Verify that there is no double words
                    randomWords.forEach(element => {
                        if (rand == element) {
                            i--;
                            verify = false;
                        }
                    });
                    if (rand != "" && verify == true) {
                        randomWords.push(rand);
                    }
                }

                let numberOfElements = 0;
                randomWords.forEach(word => {
                    if (numberOfElements < 5) {
                        this.cardComponent(word, "WIN", document.getElementById("column1"))
                    } else if (numberOfElements < 10) {
                        this.cardComponent(word, "WIN", document.getElementById("column2"))
                    } else if (numberOfElements < 15) {
                        this.cardComponent(word, "WIN", document.getElementById("column3")) 
                    } else if (numberOfElements < 20) {
                        this.cardComponent(word, "WIN", document.getElementById("column4")) 
                    } else if (numberOfElements < 25) {
                        this.cardComponent(word, "WIN", document.getElementById("column5")) 
                    }
                    numberOfElements++;
                });
            });
    }

    // Rotate the card
    clickCard(word) {
        const cardElement = document.getElementById(word)
        cardElement.setAttribute("style", "transform: rotateY(180deg);")
    }

    cardComponent(word, state, element) {
        element.innerHTML +=
        '<div class="flip-card" onclick="board.clickCard(\'' + word + '\')">' +
            '<div class="flip-card-inner" id="' + word + '">' +
                '<div class="flip-card-front">' +
                    '<h2>' + word + '</h2>' +
                '</div>' +
                '<div class="flip-card-back-blue">' +
                    '<h2>' + state + '</h2>' +
                '</div>' +
            '</div>' +
        '</div>';
    }
}


//* UTILITY functions
// HTTP request handler
function getRequest(url) {
    const promise = new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();
        Http.open('GET', url);
        Http.responseType = 'text';

        Http.onload = () => {
            resolve(Http.response);
        };

        Http.send();
    });
    return promise;
}
