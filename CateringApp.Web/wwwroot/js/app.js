var Global;
(function (Global) {
    function initialize() {
        loader(false);
    }
    Global.initialize = initialize;
    function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.reload();
    }
    Global.logout = logout;
    //export function loader(value: boolean) {
    //    let element: HTMLElement = document.getElementById("loading")
    //    if (value === true) element.style.display = "none";
    //    else element.style.display = "block";
    //}
})(Global || (Global = {}));
function loader(value) {
    var element = document.getElementById("loading");
    if (value === true)
        element.style.display = "block";
    else
        element.style.display = "none";
}
var Caterings;
(function (Caterings) {
    var $table;
    var $cateringData;
    function initialize() {
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
        initData();
    }
    Caterings.initialize = initialize;
    function initData() {
        // let caterings: Models.ICateringViewModel[];
        $.ajax({
            url: "/api/catering/all_names_only",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
                loader(false);
            }
        });
    }
    Caterings.initData = initData;
    function handleModalOpen() {
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
    Caterings.handleModalOpen = handleModalOpen;
    function submitCatering() {
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
                initData();
            }
        });
        console.log(catering);
    }
    Caterings.submitCatering = submitCatering;
})(Caterings || (Caterings = {}));
var Vehicles;
(function (Vehicles) {
    var $table;
    var vehicleId = 0;
    function initialize() {
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
                    width: "20%",
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" ><i class=\"fas fa-edit\" onclick=Vehicles.editVehicle(" + row.vehicleId + ")></i></button><button class=\"btn btn-danger\" alt=\"Obri\u0161i\" onclick=\"Vehicles.deleteVehicle(" + row.vehicleId + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
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
    Vehicles.initialize = initialize;
    function initData() {
        $.ajax({
            url: "/api/vehicles",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
                loader(false);
            }
        });
    }
    Vehicles.initData = initData;
    function editVehicle(vehicleId) {
        $.ajax({
            url: "/api/vehicles/" + vehicleId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                $("#add-vehicle-modal").modal("show");
                vehicleId = data.vehicleId;
                $("#vehicle-name").val(data.vehicleName);
            }
        });
    }
    Vehicles.editVehicle = editVehicle;
    function deleteVehicle(vehicleId) {
    }
    Vehicles.deleteVehicle = deleteVehicle;
    function submitVehicle() {
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
                    initData();
                }
            });
        }
    }
    Vehicles.submitVehicle = submitVehicle;
})(Vehicles || (Vehicles = {}));
var Auth;
(function (Auth) {
    var email;
    var password;
    function initialize() {
        email = document.getElementById("email");
        password = document.getElementById("password");
        var form = document.getElementById("form");
        hideError();
        loader(false);
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            elements[i].oninvalid = function (e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Obavezno polje!");
                }
            };
            elements[i].oninput = function (e) {
                e.target.setCustomValidity("");
            };
        }
        //email.setCustomValidity("Obavezno polje!");
        //password.setCustomValidity("Obavezno polje!");
        form.addEventListener("submit", submitCallback);
    }
    Auth.initialize = initialize;
    function submitCallback(event) {
        event.preventDefault();
        hideError();
        loader(true);
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var remember = document.getElementById("remember").checked;
        var data = {
            email: email,
            password: btoa(password),
            rememberMe: remember
        };
        console.log(data);
        $.ajax({
            url: "/api/auth/login",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                window.location.replace("/");
            },
            error: function () {
                //alert("Error");
                showError();
                loader(false);
            }
        });
    }
    function showError() {
        email.className += " is-invalid";
        password.className += " is-invalid";
        document.getElementById("error").style.display = "block";
    }
    function hideError() {
        email.className = "form-control";
        password.className = "form-control";
        document.getElementById("error").style.display = "none";
    }
    Auth.hideError = hideError;
})(Auth || (Auth = {}));
//# sourceMappingURL=app.js.map