module Users {
    let $table: DataTables.Api;
    let curUserId: number = 0;
    let curRoleId: number = 2;

    export function Initialize() {
        $table = $("#users-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "userId",
                    width: "10%"
                },
                {
                    title: "Korisnik",
                    data: "userFullName"
                },
                {
                    title: "Email",
                    data: "email"
                },
                {
                    title: "Radnje",
                    data: "userId",
                    className: "dt-center",
                    width: "20%",
                    render: (colData, data, row: Models.IUser) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" ><i class="fas fa-edit"></i></button><button class="btn btn-danger" onclick="Users.RemoveUser(` + colData + `)" alt="Obriši"><i class="fas fa-trash-alt"></i></button>`;
                    }
                }
            ]
        });

        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        InitData();
    }

    export function InitData() {
        $.ajax({
            url: "/api/users",
            contentType: "application/json",
            method: "get",
            success: (data: Models.IUser[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();
            }
        })
    }

    //export function EditUser(vehicleId: number) {
    //    $.ajax({
    //        url: `/api/vehicles/${vehicleId}`,
    //        contentType: "application/json",
    //        method: "get",
    //        success: (data: Models.IUser) => {
    //            vehicleId = data.vehicleId;
    //            $("#vehicle-name").val(data.vehicleName);
    //        }
    //    })
    //}

    export function SubmitUser() {
        let user: Models.IUser = {
            userId: curUserId,
            roleId: curRoleId,
            firstName: $("#user-name").val().toString(),
            lastName: $("#user-name").val().toString(),
            email: $("#user-name").val().toString(),
            username: $("#user-name").val().toString(),
            roleTitle: ""
        };

        if (user.firstName != ""
            && user.lastName != ""
            && user.email != ""
            && user.username != "") {
            let submissionUrl: string;
            let method: string;


            if (curUserId == 0) {
                submissionUrl = `/api/users`;
                method = "post";
            }
            else {
                submissionUrl = `/api/users/${curUserId}`;
                method = "put";
            }

            $.ajax({
                url: submissionUrl,
                method: method,
                contentType: "application/json",
                data: JSON.stringify(user),
                success: () => {
                    $("#add-user-modal").modal("hide");
                    InitData();
                }
            });
        }
    }

    export function RemoveUser(userId: number) {
        $.ajax({
            url: "/api/users",
            method: "delete",
            contentType: "application/json",
            data: JSON.stringify(userId),
            success: () => {
                InitData();
            }
        });
    }
}