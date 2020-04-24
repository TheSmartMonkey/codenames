// Get the modal
var modal = document.getElementById("my-modal");

// Get the button that opens the modal
var btn = document.getElementById("create-game");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function setbutton() {
    let searchParams = new URLSearchParams(window.location.search);
    if ( searchParams.has("roomid")) {
        document.getElementById("create-game").innerText="Join game";
        document.getElementById("create-title").innerText="Join game";
        sessionStorage.setItem('roomid', searchParams.get("roomid"));
        sessionStorage.setItem('isAdmin',false);
    } 
    else {
        getRequest('/srv/newroom','text')
            .then(roomid => {
                sessionStorage.setItem('roomid', roomid);
            });
        sessionStorage.setItem('isAdmin',true);
    }
}

function createUser() {
    avatar= document.getElementById("avatar");
    data={
        "roomid":sessionStorage.getItem('roomid'),
        "username":document.getElementById("fname").value,
        "avatar":avatar.options[avatar.selectedIndex].text,
        "isAdmin":sessionStorage.getItem('isAdmin')
    }
    sessionStorage.setItem('username',data.username);
    postRequest("/srv/addplayer",data,'text')
        .then(response => { console.log(response);
                            location.href='room.html';    
                    });
    return false;
}
