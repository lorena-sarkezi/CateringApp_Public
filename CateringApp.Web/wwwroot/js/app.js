//export function HandleAjaxError(jqXHR: JQueryXHR, status: string, errorThrown: string) {
//}
var Caterings;
(function (Caterings) {
    var $table;
    var $cateringData;
    function Initialize() {
        //var n = document.createElement('script');
        //n.setAttribute('language', 'JavaScript');
        //n.setAttribute('src', 'https://debug.datatables.net/debug.js');
        //document.body.appendChild(n);
        $("#dropdown-users").select2();
        $("#dropdown-vehicles").select2({
            dropdownParent: $('#add-catering-modal')
        });
        $table = $("#caterings-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    width: "10%",
                    data: "clientName"
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
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" ><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-danger\" alt=\"Uredi\"><i class=\"fas fa-trash-alt\"></i></button>";
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
    Caterings.Initialize = Initialize;
    function InitData() {
        // let caterings: Models.ICateringViewModel[];
        $.ajax({
            url: "/api/catering/all_names_only",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
            }
        });
    }
    Caterings.InitData = InitData;
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
        var users = [];
        var vehicles = [];
        $("#dropdown-users").find(":selected").each(function (index, elem) {
            var user = {
                userId: parseInt(elem.value),
                userFullName: elem.text
            };
            users.push(user);
        });
        $("#dropdown-vehicles").find(":selected").each(function (index, elem) {
            var vehicle = {
                vehicleId: parseInt(elem.value),
                vehicleName: elem.text
            };
            vehicles.push(vehicle);
        });
        var catering = {
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
            success: function () {
                $("#add-catering-modal").modal("hide");
                InitData();
            }
        });
        console.log(catering);
    }
    Caterings.SubmitCatering = SubmitCatering;
})(Caterings || (Caterings = {}));
var Vehicles;
(function (Vehicles) {
    var $table;
    var vehicleId = 0;
    function Initialize() {
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
                    width: "20%",
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" ><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-danger\" alt=\"Uredi\"><i class=\"fas fa-trash-alt\"></i></button>";
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
    Vehicles.Initialize = Initialize;
    function InitData() {
        $.ajax({
            url: "/api/vehicles",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
            }
        });
    }
    Vehicles.InitData = InitData;
    function EditVehicle(vehicleId) {
        $.ajax({
            url: "/api/vehicles/" + vehicleId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                vehicleId = data.vehicleId;
                $("#vehicle-name").val(data.vehicleName);
            }
        });
    }
    Vehicles.EditVehicle = EditVehicle;
    function SubmitVehicle() {
        var vehicle = {
            vehicleId: vehicleId,
            vehicleName: $("#vehicle-name").val().toString()
        };
        if (vehicle.vehicleName != "") {
            var submissionUrl = void 0;
            var method = void 0;
            if (vehicleId == 0) {
                submissionUrl = "/api/vehicles";
                method = "post";
            }
            else {
                submissionUrl = "/api/vehicles/" + vehicleId;
                method = "put";
            }
            $.ajax({
                url: submissionUrl,
                method: method,
                contentType: "application/json",
                data: JSON.stringify(vehicle),
                success: function () {
                    $("#add-vehicle-modal").modal("hide");
                    InitData();
                }
            });
        }
    }
    Vehicles.SubmitVehicle = SubmitVehicle;
})(Vehicles || (Vehicles = {}));
var Users;
(function (Users) {
    var $table;
    var vehicleId = 0;
    function Initialize() {
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
                } /*,
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
    Users.Initialize = Initialize;
    function InitData() {
        $.ajax({
            url: "/api/users",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                //console.log(data);
                $table.clear().rows.add(data).draw();
            }
        });
    }
    Users.InitData = InitData;
})(Users || (Users = {}));
//# sourceMappingURL=app.js.map