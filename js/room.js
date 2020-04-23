class Datatable {
    constructor() {
        this.table = $('#usetTable').DataTable({
            "paging": false,
            "ordering": false,
            "info": false,
            "bFilter": false,
            "language": {"sZeroRecords": "", "sEmptyTable": ""}
        });
        this.insertComponent();
    }

    // Just a test
    insertComponent() {
        const tableBody = document.getElementById('table-body');
        this.adminMemberComponent(
            'Laurent',
            'cat',
            tableBody
        );
        this.memberComponent(
            'Elsa',
            'dog',
            'player',
            'blue',
            tableBody
        );
    }

    adminMemberComponent(pseudo, avatar, element) {
        element.innerHTML +=
            '<tr id="' + pseudo + '">' +
                '<td id="user-list">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/' + avatar + '.png" />' +
                '</td>' +
                '<td id="name-list">' +
                    pseudo +
                    '<div>Admin</div>' +
                '</td>' +
                '<td id="role-list">' +
                    '<select id="roles-dropdown">' +
                        '<option value="spymaster">Spymaster</option>' +
                        '<option value="player">Player</option>' +
                    '</select>' +
                '</td>' +
                '<td id="team-list">' +
                    '<select id="team-dropdown">' +
                        '<option value="blue">Blue</option>' +
                        '<option value="red">Red</option>' +
                    '</select>' +
                '</td>' +
                '<td id="ready-list">' +
                    '<div class="container">' +
                        '<div class="round" onclick="datatable.setStatus(\'' + pseudo + '\')">' +
                            '<input type="checkbox" id="checkbox-' + pseudo + '" checked/>' +
                            '<label for="checkbox-' + pseudo + '"></label>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td id="status-list"><span id="status-' + pseudo + '">Ready</span></td>' +
                '<td id="action-list" onclick="">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/delete.png" />' +
                '</td>' +
            ' </tr>';
    }

    memberComponent(pseudo, avatar, role, team, element) {
        element.innerHTML +=
            '<tr id="' + pseudo + '">' +
                '<td id="user-list">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/' + avatar + '.png" />' +
                '</td>' +
                '<td id="name-list">' +
                    pseudo +
                    '<div>Member</div>' +
                '</td>' +
                '<td id="role-list">' + role + '</td>' +
                '<td id="team-list">' + team + '</td>' +
                '<td id="ready-list">' +
                    '<div class="container">' +
                        '<div class="round" onclick="datatable.setStatus(\'' + pseudo + '\')">' +
                            '<input type="checkbox" id="checkbox-' + pseudo + '" />' +
                            '<label for="checkbox-' + pseudo + '"></label>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td id="status-list"><span id="status-' + pseudo + '">Not Ready</span></td>' +
                '<td id="action-list" onclick="">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/delete.png" />' +
                '</td>' +
            ' </tr>';
    }

    //* INTERACTION
    copyLink() {
        let copyText = document.querySelector("#link-access");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    setStatus(pseudo) {
        const ready = document.getElementById("checkbox-" + pseudo);
        const status = document.getElementById("status-" + pseudo);
        if (ready.checked == true) {
            status.innerHTML = "Ready"
        } else {
            status.innerHTML = "Not Ready"
        }
    }
}
