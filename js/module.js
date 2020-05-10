//* UTILITY functions
// HTTP request handler
function getRequest(url,responseType) {
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

function postRequest(url,data,responseType) {
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

function includeHTML() {
    return new Promise(includeElement);

function includeElement(successCallback, failureCallback) {
        var includeElements = document.querySelectorAll("div[w3-include-html]");
        if(includeElements.length>0) {
            // we include one element at a time 
            // and consider the promise completed once all elements are inluded
            var element = includeElements[0];
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) { 
                            element.innerHTML = this.responseText; 
                        }
                        if (this.status == 404) { 
                            element.innerHTML = "Page not found.";
                            failureCallback();
                        }
                        // Remove the attribute, and call this function once more
                        element.removeAttribute("w3-include-html");
                        includeElement(successCallback, failureCallback);
                    }
                }
            xhttp.open("GET", element.getAttribute("w3-include-html"), true);
            xhttp.send();
        }
        else {
            // all elements included: success
            successCallback();
        }
    }
}


