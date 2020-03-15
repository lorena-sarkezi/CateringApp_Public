module Caterings {

    let $table: DataTables.Api;
    let $cateringData: Caterings.Models.ICateringDetailModel;
    

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

        initData();
    }

    export function initData() {
        // let caterings: Models.ICateringViewModel[];

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


    export function handleModalOpen() {
        $(".spinner", "#add-catering-modal").show();
        $(".row", "#add-catering-modal").hide();

        $.ajax({
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
                })
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
            cateringId: 0
        };

        $.ajax({
            url: "/api/catering",
            contentType: "application/json",
            method: "post",
            data: JSON.stringify(catering),
            success: () => {
                $("#add-catering-modal").modal("hide");
                initData();
            }
        });

        console.log(catering);
    }
    
}