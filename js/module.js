//* UTILITY functions
// GET HTTP request handler
function getRequest(url, responseType) {
    const promise = new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();
        Http.open('GET', url);
        Http.responseType = responseType;

        Http.onload = () => {
            resolve(Http.response);
        };

        Http.send();
    });
    return promise;
}

// POST HTTP request handler
function postRequest(url, data, responseType) {
    const promise = new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();
        Http.open('POST', url);
        Http.responseType = responseType;
        Http.setRequestHeader('Content-Type', 'application/json');

        Http.onload = () => {
            resolve(Http.response);
        };

        Http.send(JSON.stringify(data));
    });
    return promise;
}

// Include HTML files
function includeHTML() {
    let htmlElement, i, element, file, xhttp;
    // Loop through a collection of all HTML elements
    htmlElement = document.getElementsByTagName("*");
    for (i = 0; i < htmlElement.length; i++) {
        element = htmlElement[i];
        // search for elements with a certain atrribute
        file = element.getAttribute("w3-include-html");
        if (file) {
            // Make an HTTP request using the attribute value as the file name
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { element.innerHTML = this.responseText; }
                    if (this.status == 404) { element.innerHTML = "Page not found."; }
                    // Remove the attribute, and call this function once more
                    element.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            // Exit the function
            return;
        }
    }
}

//* MODAL
// Game modal alert popups
class Modal {
    constructor() {
        this.modal = document.getElementById("modal-container");
        this.submitButton = document.getElementById("submit-button");
        this.closeAction = document.getElementsByClassName("close-modal")[0];
    }

    // Display the modal
    display(modalTitle, contentBody, buttonTitle, actionOnClick) {
        let modalAlert = 
            '<div class="modal-content">' +
                '<div class="modal-header">' +
                    '<span class="close-modal" onclick="m.close()">&times;</span>' +
                    '<h2 id="modal-title">' + modalTitle + '</h2>' +
                '</div>' +
                '<div class="modal-body">' +
                    contentBody +
                    '<div class="button-right separator">' +
                        '<button class="button button-validate" id="submit-button" onclick="' + actionOnClick + '">' +
                            buttonTitle +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        return modalAlert;
    }

    // When the user clicks the button, open the modal 
    open() {
        this.modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    close() {
        this.modal.style.display = "none";
    }
}
