module Vehicles {

    let $table: DataTables.Api;
    let vehicleId: number = 0;

    export function Initialize() {
        $table = $("#vehicles-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "vehicleId",
                    width: "10%"
                },
                {
                    title: "Naziv vozila",
                    data: "vehicleName"
                },
                {
                    title: "Radnje",
                    data: "vehicleId",
                    className: "dt-center",
                    width:"20%",
                    render: (colData, data, row: Models.IVehicle) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" ><i class="fas fa-edit"></i></button><button class="btn btn-danger" alt="Uredi"><i class="fas fa-trash-alt"></i></button>`;
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
            url: "/api/vehicles",
            contentType: "application/json",
            method: "get",
            success: (data: Models.IVehicle[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();
            }
        })
    }

    export function EditVehicle(vehicleId: number){
        $.ajax({
            url: `/api/vehicles/${vehicleId}`,
            contentType: "application/json",
            method: "get",
            success: (data: Models.IVehicle) => {
                vehicleId = data.vehicleId;
                $("#vehicle-name").val(data.vehicleName);
            }
        })
    }

    export function SubmitVehicle() {
        let vehicle: Models.IVehicle = {
            vehicleId: vehicleId,
            vehicleName: $("#vehicle-name").val().toString()
        };

        if (vehicle.vehicleName != "") {
            let submissionUrl: string;
            let method: string;


            if (vehicleId == 0) {
                submissionUrl = `/api/vehicles`;
                method = "post";
            }
            else {
                submissionUrl = `/api/vehicles/${vehicleId}`;
                method = "put";
            }

            $.ajax({
                url: submissionUrl,
                method: method,
                contentType: "application/json",
                data: JSON.stringify(vehicle),
                success: () => {
                    $("#add-vehicle-modal").modal("hide");
                    InitData();
                }
            });
        }
    }
}