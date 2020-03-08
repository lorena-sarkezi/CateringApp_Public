module Caterings {

    var $table: DataTables.DataTables;
    var $cateringData: Caterings.Models.ICateringDetailModel;

    export function Initialize() {
        $("#dropdown-users").select2();
        $("#dropdown-vehicles").select2({
            dropdownParent: $('#add-catering-modal')
        });

        $table = $("#caterings-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    width: "10%"
                },
                {
                    title: "Naziv cateringa"
                },
                {
                    title: "Klijent"
                },
                {
                    title: "Akcije"
                }
            ],
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            }
        });
    }


    export function HandleModalOpen() {
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

                var userSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-users");
                var vehicleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-vehicles");
                for (var i = userSelect.options.length - 1; i >= 0; i--) {
                    userSelect.options[i] = null;
                }

                $cateringData.users.forEach((user: Models.IUserModel) => {

                    var option = document.createElement("option");
                    option.value = user.userId.toString();
                    option.text = user.userFullName;
                    userSelect.add(option);
                });

                $cateringData.vehicles.forEach((vehicle: Models.IVehicle) => {
                    var option = document.createElement("option");
                    option.value = vehicle.vehicleId.toString();
                    option.text = vehicle.vehicleName;
                    vehicleSelect.add(option);
                })
            }
        });

        $("#add-catering-modal").modal("show");
        
    }

    export function SubmitCatering() {

    }
    
}