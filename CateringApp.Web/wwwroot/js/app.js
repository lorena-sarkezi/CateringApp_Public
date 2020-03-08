var Caterings;
(function (Caterings) {
    var $table;
    var $cateringData;
    function Initialize() {
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
    Caterings.Initialize = Initialize;
    function HandleModalOpen() {
        $(".spinner", "#add-catering-modal").show();
        $(".row", "#add-catering-modal").hide();
        $.ajax({
            url: "/api/catering/details",
            method: "get",
            contentType: "application/json",
            success: function (data) {
                $(".spinner", "#add-catering-modal").hide();
                $(".row", "#add-catering-modal").show();
                $cateringData = data;
                var userSelect = document.getElementById("dropdown-users");
                var vehicleSelect = document.getElementById("dropdown-vehicles");
                //Praznjenje dropdowna
                for (var i = userSelect.options.length - 1; i >= 0; i--) {
                    userSelect.options[i] = null;
                }
                //Praznjenje dropdowna
                for (var i = vehicleSelect.options.length - 1; i >= 0; i--) {
                    vehicleSelect.options[i] = null;
                }
                $cateringData.users.forEach(function (user) {
                    var option = document.createElement("option");
                    option.value = user.userId.toString();
                    option.text = user.userFullName;
                    userSelect.add(option);
                });
                $cateringData.vehicles.forEach(function (vehicle) {
                    var option = document.createElement("option");
                    option.value = vehicle.vehicleId.toString();
                    option.text = vehicle.vehicleName;
                    vehicleSelect.add(option);
                });
            }
        });
        $("#add-catering-modal").modal("show");
    }
    Caterings.HandleModalOpen = HandleModalOpen;
    function SubmitCatering() {
    }
    Caterings.SubmitCatering = SubmitCatering;
})(Caterings || (Caterings = {}));
//export function HandleAjaxError(jqXHR: JQueryXHR, status: string, errorThrown: string) {
//}
//# sourceMappingURL=app.js.map