let roomid = sessionStorage.getItem("roomid");
let username = sessionStorage.getItem("username");
let isAdmin = sessionStorage.getItem("isAdmin");


let language="french"; 
if ( sessionStorage.hasOwnProperty("language") ) {
    language=sessionStorage.getItem("language"); 
}

let socket = io();
socket.on('setplayer', function(playerdata) {
        console.log(playerdata);
        datatable.setRole(playerdata.name,playerdata.role);
        datatable.setTeam(playerdata.name,playerdata.team);
        datatable.setStatus(playerdata.name,playerdata.isReady);
    });

socket.on('newplayer', function(playerdata) {
        console.log(playerdata);
        loadTable();
    });

socket.on('deleteplayer', function(playerdata) {
        console.log(playerdata);
        if (playerdata["username"]==username) {
            alert("user removed");
            location.href='index.html';
        } else {
            loadTable();
        }
    });

socket.on('startgame', function(playerdata) {
        console.log(playerdata);
        playerdata.forEach(player=>{
            if (player.name==username) {
                sessionStorage.setItem("role",player.role);
                sessionStorage.setItem("team",player.team);
            }
        });
        location.href='board.html';
    });

socket.emit("join",{"username":username,"roomid":roomid});


class Datatable {
    constructor() {
        this.table = $('#usetTable').DataTable({
            "paging": false,
            "ordering": false,
            "info": false,
            "bFilter": false,
            "language": {"sZeroRecords": "", "sEmptyTable": ""}
        });
        this.hideAdminCommandCard();
    }

    adminMemberComponent(pseudo, avatar, permission, role,team,isReady, element) {
        element.innerHTML +=
            '<tr id="' + pseudo + '">' +
                '<td id="user-list">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/' + avatar + '.png" />' +
                '</td>' +
                '<td id="name-list">' +
                    pseudo +
                    '<div>' + permission + '</div>' +
                '</td>' +
                '<td id="role-list">' +
                    '<select id="roles-dropdown-' + pseudo + '" onchange="datatable.changeRole(\'' + pseudo + '\')">' +
                        '<option value="spymaster"'+(role==="spymaster"?'selected="selected"':' ')+'>Spymaster</option>' +
                        '<option value="player"'+(role==="player"?'selected="selected"':' ')+'>Player</option>' +
                    '</select>' +
                '</td>' +
                '<td id="team-list">' +
                    '<select id="team-dropdown-' + pseudo + '" onchange="datatable.changeTeam(\'' + pseudo + '\')">' +
                        '<option value="blue"'+(team==="blue"?'selected="selected"':' ')+'>Blue</option>' +
                        '<option value="red"'+(team==="red"?'selected="selected"':' ')+'>Red</option>' +
                    '</select>' +
                '</td>' +
                '<td id="ready-list">' +
                '<div class="container" style="display:'+(pseudo===username?'inline':'none')+'">' +
                '<div class="round" onclick="datatable.changeStatus(\'' + pseudo + '\')">' +
                            '<input type="checkbox" id="checkbox-' + pseudo + '" '+(isReady?'checked':'')+'/>' +
                            '<label for="checkbox-' + pseudo + '"></label>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td id="status-list"><span id="status-' + pseudo + '">'+(isReady?'Ready':'Not Ready')+'</span></td>' +
                '<td id="action-list" onclick="datatable.deletePlayer(\'' + pseudo + '\')">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/delete.png" />' +
                '</td>' +
            ' </tr>';
    }

    memberComponent(pseudo, avatar, permission, role, team, isReady, element) {
        element.innerHTML +=
            '<tr id="' + pseudo + '">' +
                '<td id="user-list">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/' + avatar + '.png" />' +
                '</td>' +
                '<td id="name-list">' +
                    pseudo +
                    '<div>' + permission + '</div>' +
                '</td>' +
                '<td id="role-list-' + pseudo + '">' + role + '</td>' +
                '<td id="team-list-' + pseudo + '">' + team + '</td>' +
                '<td id="ready-list">' +
                    '<div class="container" style="display:'+(pseudo===username?'inline':'none')+'">' +
                        '<div class="round" onclick="datatable.changeStatus(\'' + pseudo + '\')">' +
                        '<input type="checkbox" id="checkbox-' + pseudo + '" '+(isReady?'checked':'')+'/>' +
                            '<label for="checkbox-' + pseudo + '"></label>' +
                        '</div>' +
                    '</div>' +  
                '</td>' +
                '<td id="status-list"><span id="status-' + pseudo + '">'+(isReady?'Ready':'Not Ready')+'</span></td>' +

            ' </tr>';
    }

    //* INTERACTION
    hideAdminCommandCard() {
        const adminCard = document.getElementById('admin-card');
        if (isAdmin==="true") {
            adminCard.style.display = "block";
        } else {
            adminCard.style.display = "none";
        }
    }

    copyLink() {
        let copyText = document.querySelector("#link-access");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    changeStatus(pseudo) {
        const ready = document.getElementById("checkbox-" + pseudo);
        socket.emit("changestatus",{"username":pseudo,"roomid":roomid,"isReady":ready.checked});
    }

    changeRole(pseudo) {
        const roleobj = document.getElementById('roles-dropdown-' + pseudo);
        socket.emit("assignrole",{"username":pseudo,"roomid":roomid,"role":roleobj.value});
    }

    setRole(pseudo,role) {
        const roleobj = document.getElementById('role-list-' + pseudo);
        if (roleobj) {
            roleobj.innerHTML = role;
        }
    }

    changeTeam(pseudo) {
        const teamobj = document.getElementById('team-dropdown-' + pseudo);
        socket.emit("assignteam",{"username":pseudo,"roomid":roomid,"team":teamobj.value});
    }

    setTeam(pseudo,team) {
        const teamobj = document.getElementById('team-list-' + pseudo);
        if (teamobj) {
            teamobj.innerHTML = team;
        }
    }

    setStatus(pseudo,isReady) {
        const statusobj = document.getElementById('status-' + pseudo);
        if (isReady) {
            statusobj.innerHTML = "Ready";
        } else {
            statusobj.innerHTML = "Not Ready";
        }
    }

    deletePlayer(pseudo) {
        socket.emit("deleteplayer",{"username":pseudo,"roomid":roomid});
    }

}


function loadTable() {
    document.getElementById("link-access").value="http://"+location.host+"/site/codenames/view/index.html?roomid="+roomid
    getRequest("/srv/getplayers/"+roomid,'json')
        .then(players => {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML="";
            players.forEach(player => {
                let permission="Member";
                if (player.isAdmin==="true") {
                    permission="Admin"
                }
                if (isAdmin==="true") {
                    datatable.adminMemberComponent(
                        player.name,
                        player.avatar,
                        permission,
                        player.role,
                        player.team,
                        player.isReady==="true",
                        tableBody
                    );
                } else {
                    datatable.memberComponent(
                        player.name,
                        player.avatar,
                        permission,
                        player.role,
                        player.team,
                        player.isReady==="true",
                        tableBody
                    );
                }
            });
        });
} 

function selectLanguage(selectlanguage) {
    sessionStorage.setItem("language",selectlanguage);
    language=selectlanguage;

}

function startgame() {
    getRequest("/srv/getplayers/"+roomid,'json') 
        .then(players => {
            if (!players.reduce((all,player)=> (all && player.isReady),true)) {
                alert("Please wait for all players to be ready to start the game")
            } else if (!players.reduce((any,player)=> (any || (player.team=="blue" && player.role=="spymaster")),false)) {
                alert("No spymaster for blue team")
            } else if (!players.reduce((any,player)=> (any || (player.team=="red" && player.role=="spymaster")),false)) {
                alert("No spymaster for red team")
            } else if (!players.reduce((any,player)=> (any || (player.team=="blue" && player.role=="player")),false)) {
                alert("No player for blue team")
            } else if (!players.reduce((any,player)=> (any || (player.team=="red" && player.role=="player")),false)) {
                alert("No player for red team")
            } else {
                socket.emit("newgame",{"roomid":roomid,"language":language});
            }
        })
       
    }