module Caterings {

    let $table: DataTables.Api;
    let $cateringData: Caterings.Models.ICateringDetailModel;
    let $cateringId = 0;
    

    export function initialize() {
        loader(true);
        $("#dropdown-users").select2();
        $("#dropdown-vehicles").select2({
            dropdownParent: $('#add-catering-modal')
        });

        $table = $("#caterings-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    width: "10%",
                    data:"clientName"
                },
                {
                    title: "Naziv cateringa",
                    data: "cateringName"
                },
                {
                    title: "Klijent",
                    data: "clientName"
                },
                {
                    title: "Radnje",
                    data: "clientName",
                    className: "dt-center",
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" onclick="Caterings.editCatering(${row.cateringId})"><i class="fas fa-edit"></i></button><button class="btn btn-danger" alt="Uredi" onclick="Caterings.deleteCateringPrompt(${row.cateringId})"><i class="fas fa-trash-alt"></i></button>`;
                    }
                }
            ]
        });

        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        initData();
    }

    export async function initData() {
        // let caterings: Models.ICateringViewModel[];
        $cateringId = 0;
        $.ajax({
            url: "/api/catering/all_names_only",
            contentType: "application/json",
            method: "get",
            success: (data: Models.ICateringViewModel[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();
                loader(false);
            }
        });
    }

    export function editCatering(cateringId: number) {
        $.ajax({
            url: `/api/catering/${cateringId}`,
            method: "get",
            data: null,
            success: async (data: Models.ICateringDetailModel) => {
                console.log(data);
                $cateringId = cateringId;
                

                $("#catering-name").val(data.cateringName);
                $("#client-name").val(data.clientName);

                let users: string[] = [];

                data.users.forEach(item => {
                    users.push(item.userId.toString());
                });
                await handleModalOpen();
                console.log($("#dropdown-users"));
                console.log(users);
                $("#dropdown-users").val(users).trigger("change");
                $("#dropdown-vehicles").val(data.vehicles[0].vehicleId.toString()).trigger("change");

            },
            error: Global.ajaxErrorHandler

        });
    }


    export async function handleModalOpen() {
        $(".spinner", "#add-catering-modal").show();
        $(".row", "#add-catering-modal").hide();

        await $.ajax({
            url: "/api/catering/details",
            method: "get",
            contentType: "application/json",
            success: (data: Models.ICateringDetailModel) => {
                $(".spinner", "#add-catering-modal").hide();
                $(".row", "#add-catering-modal").show();
                $cateringData = data;

                let userSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-users");
                let vehicleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-vehicles");

                //Praznjenje dropdowna
                for (let i = userSelect.options.length - 1; i >= 0; i--) {
                    userSelect.options[i] = null;
                }

                //Praznjenje dropdowna
                for (let i = vehicleSelect.options.length - 1; i >= 0; i--) {
                    vehicleSelect.options[i] = null;
                }

                $cateringData.users.forEach((user: Models.IUserModel) => {

                    let option = document.createElement("option");
                    option.value = user.userId.toString();
                    option.text = user.userFullName;
                    userSelect.add(option);
                });

                $cateringData.vehicles.forEach((vehicle: Vehicles.Models.IVehicle) => {
                    let option = document.createElement("option");
                    option.value = vehicle.vehicleId.toString();
                    option.text = vehicle.vehicleName;
                    vehicleSelect.add(option);
                });
            }
        });

        $("#add-catering-modal").modal("show");
        
    }

    export function submitCatering() {

        let users: Models.IUserModel[] = <Models.IUserModel[]>[];
        let vehicles: Vehicles.Models.IVehicle[] = <Vehicles.Models.IVehicle[]>[];

        $("#dropdown-users").find(":selected").each((index, elem: any) => {
            let user: Models.IUserModel = {
                userId: parseInt(elem.value),
                userFullName: elem.text
            };
            users.push(user);
        });

        $("#dropdown-vehicles").find(":selected").each((index, elem: any) => {
            let vehicle: Vehicles.Models.IVehicle = {
                vehicleId: parseInt(elem.value),
                vehicleName: elem.text
            };

            vehicles.push(vehicle);
        });


        let catering: Models.ICateringDetailModel = {
            dishes: [],
            users: users,
            vehicles: vehicles,
            cateringName: $("#catering-name").val().toString(),
            clientName: $("#client-name").val().toString(),
            cateringId: $cateringId
        };

        let submitUrl: string = "/api/catering";
        let submitMethod: string = "post";

        if (catering.cateringId !== 0) {
            submitUrl += `/${catering.cateringId}`;
            submitMethod = "put";
        }

        $.ajax({
            url: submitUrl,
            contentType: "application/json",
            method: submitMethod,
            data: JSON.stringify(catering),
            success: () => {
                $("#add-catering-modal").modal("hide");
                initData();
            }
        });

        console.log(catering);
    }

    export function deleteCateringPrompt(cateringId: number) {
        $cateringId = cateringId;
        $("#delete-catering-prompt").modal("show");
    }

    export function deleteCateringConfirm() {
        loader(true)
        $.ajax({
            url: `/api/catering/${$cateringId}`,
            method:"delete",
            success: () => {
                $("#delete-catering-prompt").modal("hide");
                initData();
            },
            error: Global.ajaxErrorHandler
        })
    }
    
}