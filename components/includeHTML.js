function includeHTML() {
    var htmlElement, i, element, file, xhttp;
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