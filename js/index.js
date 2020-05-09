function setbutton() {
    let searchParams = new URLSearchParams(window.location.search);
    if ( searchParams.has("roomid")) {
        document.getElementById("submit-button").innerText="Join game";
        document.getElementById("modal-title").innerText="Join game";
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
