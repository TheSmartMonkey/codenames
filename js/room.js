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
            'man',
            'Ready',
            tableBody
        );
        this.memberComponent(
            'Elsa',
            'woman',
            'player',
            'blue',
            'Ready',
            tableBody
        );
    }

    memberComponentLogic() {
        const status = document.getElementById('status-list');
    }

    adminMemberComponent(pseudo, avatar, status, element) {
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
                        '<div class="round">' +
                            '<input type="checkbox" id="checkbox-' + pseudo + '" />' +
                            '<label for="checkbox-' + pseudo + '"></label>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td id="status-list">' + status + '</td>' +
                '<td id="action-list" onclick="">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/delete.png" />' +
                '</td>' +
            ' </tr>';
    }

    memberComponent(pseudo, avatar, role, team, status, element) {
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
                        '<div class="round">' +
                            '<input type="checkbox" id="checkbox-' + pseudo + '" />' +
                            '<label for="checkbox-' + pseudo + '"></label>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td id="status-list">' + status + '</td>' +
                '<td id="action-list" onclick="">' +
                    '<img class="d-inline-block align-top" src="../assets/icones/delete.png" />' +
                '</td>' +
            ' </tr>';
    }
}
