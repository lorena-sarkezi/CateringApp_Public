var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Global;
(function (Global) {
    function initialize() {
        loader(false);
        $.extend(true, $.fn.dataTable.defaults, {
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            },
            responsive: true
        });
    }
    Global.initialize = initialize;
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
    }
    Global.getCookie = getCookie;
    function ajaxErrorHandler(jxHR, textStatus, error) {
        loader(false);
        console.error(error);
        console.log(jxHR);
        //$("#errorModalMain").modal("show");
        alert("Došlo je do greške!");
    }
    Global.ajaxErrorHandler = ajaxErrorHandler;
    function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.reload();
    }
    Global.logout = logout;
})(Global || (Global = {}));
function loader(value) {
    var element = document.getElementById("loading");
    if (value === true)
        element.style.display = "block";
    else
        element.style.display = "none";
}
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
var Caterings;
(function (Caterings) {
    var $table;
    var $cateringData;
    var $cateringId = 0;
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
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" onclick=\"Caterings.editCatering(" + row.cateringId + ")\"><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-danger\" alt=\"Uredi\" onclick=\"Caterings.deleteCateringPrompt(" + row.cateringId + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
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
    Caterings.initialize = initialize;
    function initData() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                $cateringId = 0;
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
                return [2 /*return*/];
            });
        });
    }
    Caterings.initData = initData;
    function editCatering(cateringId) {
        var _this = this;
        $.ajax({
            url: "/api/catering/" + cateringId,
            method: "get",
            data: null,
            success: function (data) { return __awaiter(_this, void 0, void 0, function () {
                var users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log(data);
                            $cateringId = cateringId;
                            return [4 /*yield*/, handleModalOpen()];
                        case 1:
                            _a.sent();
                            users = [];
                            data.users.forEach(function (item) {
                                users.push(item.userId.toString());
                            });
                            $("#catering-name").val(data.cateringName);
                            $("#client-name").val(data.clientName);
                            console.log($("#dropdown-users"));
                            console.log(users);
                            $("#dropdown-users").val(users).trigger("change");
                            $("#dropdown-vehicles").val(data.vehicles[0].vehicleId.toString()).trigger("change");
                            return [2 /*return*/];
                    }
                });
            }); },
            error: Global.ajaxErrorHandler
        });
    }
    Caterings.editCatering = editCatering;
    function handleModalOpen() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $(".spinner", "#add-catering-modal").show();
                        $(".row", "#add-catering-modal").hide();
                        return [4 /*yield*/, $.ajax({
                                url: "/api/catering/details",
                                method: "get",
                                contentType: "application/json",
                                success: function (data) {
                                    $(".spinner", "#add-catering-modal").hide();
                                    $(".row", "#add-catering-modal").show();
                                    $cateringData = data;
                                    var userSelect = document.getElementById("dropdown-users");
                                    var vehicleSelect = document.getElementById("dropdown-vehicles");
                                    $("#catering-name").val("");
                                    $("#client-name").val("");
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
                            })];
                    case 1:
                        _a.sent();
                        $("#add-catering-modal").modal("show");
                        return [2 /*return*/];
                }
            });
        });
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
            cateringId: $cateringId
        };
        var submitUrl = "/api/catering";
        var submitMethod = "post";
        if (catering.cateringId !== 0) {
            submitUrl += "/" + catering.cateringId;
            submitMethod = "put";
        }
        loader(true);
        $.ajax({
            url: submitUrl,
            contentType: "application/json",
            method: submitMethod,
            data: JSON.stringify(catering),
            success: function () {
                $("#add-catering-modal").modal("hide");
                initData();
            },
            error: Global.ajaxErrorHandler
        });
        console.log(catering);
    }
    Caterings.submitCatering = submitCatering;
    function deleteCateringPrompt(cateringId) {
        $cateringId = cateringId;
        $("#delete-catering-prompt").modal("show");
    }
    Caterings.deleteCateringPrompt = deleteCateringPrompt;
    function deleteCateringConfirm() {
        loader(true);
        $.ajax({
            url: "/api/catering/" + $cateringId,
            method: "delete",
            success: function () {
                $("#delete-catering-prompt").modal("hide");
                initData();
            },
            error: Global.ajaxErrorHandler
        });
    }
    Caterings.deleteCateringConfirm = deleteCateringConfirm;
})(Caterings || (Caterings = {}));
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
var Vehicles;
(function (Vehicles) {
    var $table;
    var $vehicleId = 0;
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
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" ><i class=\"fas fa-edit\" onclick=Vehicles.editVehicle(" + row.vehicleId + ")></i></button><button class=\"btn btn-danger\" alt=\"Obri\u0161i\" onclick=\"Vehicles.deleteVehiclePrompt(" + row.vehicleId + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
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
    Vehicles.initialize = initialize;
    function initData() {
        $("#vehicle-name").val("");
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
        $vehicleId = vehicleId;
        $.ajax({
            url: "/api/vehicles/" + vehicleId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                $("#add-vehicle-modal").modal("show");
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
            vehicleId: $vehicleId,
            vehicleName: $("#vehicle-name").val().toString()
        };
        if (vehicle.vehicleName != "") {
            var submissionUrl = void 0;
            var method = void 0;
            if ($vehicleId == 0) {
                submissionUrl = "/api/vehicles";
                method = "post";
            }
            else {
                submissionUrl = "/api/vehicles/" + $vehicleId;
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
    function deleteVehiclePrompt(vehicleId) {
        $vehicleId = vehicleId;
        $("#delete-vehicle-modal").modal("show");
    }
    Vehicles.deleteVehiclePrompt = deleteVehiclePrompt;
    function deleteVehicleConfirm() {
        if ($vehicleId !== 0) {
            loader(true);
            $.ajax({
                url: "/api/vehicles/" + $vehicleId,
                method: "delete",
                success: function () {
                    $("#delete-vehicle-modal").modal("hide");
                    initData();
                },
                error: Global.ajaxErrorHandler
            });
        }
    }
    Vehicles.deleteVehicleConfirm = deleteVehicleConfirm;
})(Vehicles || (Vehicles = {}));
//# sourceMappingURL=app.js.map