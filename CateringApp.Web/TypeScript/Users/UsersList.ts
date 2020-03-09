module Users {
    let $table: DataTables.Api;
    let vehicleId: number = 0;

    export function Initialize() {
        $table = $("#users-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "idUser",
                    width: "10%"
                },
                {
                    title: "Korisnik",
                    data: "fullName"
                },
                {
                    title: "Uloga",
                    data: "uloga"
                }/*,
                {
                    //Ovo ni ne znam šta je
                    title: "Radnje",
                    data: "vehicleId",
                    className: "dt-center",
                    width: "20%",
                    render: (colData, data, row: Models.IUser) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" ><i class="fas fa-edit"></i></button><button class="btn btn-danger" alt="Uredi"><i class="fas fa-trash-alt"></i></button>`;
                    }
                }*/
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
                //console.log(data);
                $table.clear().rows.add(data).draw();
            }
        })
    }
}