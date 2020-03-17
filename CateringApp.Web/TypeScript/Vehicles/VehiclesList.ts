module Vehicles {

    let $table: DataTables.Api;
    let $vehicleId: number = 0;

    export function initialize() {
        loader(true);
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
                        return `<button type="button" class="btn btn-primary" alt="Uredi" ><i class="fas fa-edit" onclick=Vehicles.editVehicle(${row.vehicleId})></i></button><button class="btn btn-danger" alt="Obriši" onclick="Vehicles.deleteVehiclePrompt(${row.vehicleId})"><i class="fas fa-trash-alt"></i></button>`;
                    }
                }
            ],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            },
        });

        //Row numbers
        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        initData();
    }

    export function initData() {
        $("#vehicle-name").val("");
        $.ajax({
            url: "/api/vehicles",
            contentType: "application/json",
            method: "get",
            success: (data: Models.IVehicle[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();
                loader(false);
            }
        })
    }

    export function editVehicle(vehicleId: number) {
        $vehicleId = vehicleId;
        $.ajax({
            url: `/api/vehicles/${vehicleId}`,
            contentType: "application/json",
            method: "get",
            success: (data: Models.IVehicle) => {
                $("#add-vehicle-modal").modal("show");
                $("#vehicle-name").val(data.vehicleName);
            }
        })
    }

    export function deleteVehicle(vehicleId: number) {

    }

    export function submitVehicle() {
        let vehicle: Models.IVehicle = {
            vehicleId: $vehicleId,
            vehicleName: $("#vehicle-name").val().toString()
        };

        if (vehicle.vehicleName != "") {
            let submissionUrl: string;
            let method: string;


            if ($vehicleId == 0) {
                submissionUrl = `/api/vehicles`;
                method = "post";
            }
            else {
                submissionUrl = `/api/vehicles/${$vehicleId}`;
                method = "put";
            }

            $.ajax({
                url: submissionUrl,
                method: method,
                contentType: "application/json",
                data: JSON.stringify(vehicle),
                success: () => {
                    $("#add-vehicle-modal").modal("hide");
                    initData();
                }
            });
        }
    }

    export function deleteVehiclePrompt(vehicleId: number) {
        $vehicleId = vehicleId;
        $("#delete-vehicle-modal").modal("show");
    }

    export function deleteVehicleConfirm() {
        if ($vehicleId !== 0) {
            loader(true);
            $.ajax({
                url: `/api/vehicles/${$vehicleId}`,
                method: "delete",
                success: () => {
                    $("#delete-vehicle-modal").modal("hide");
                    initData();
                },
                error: Global.ajaxErrorHandler
            })
        }
    }
}