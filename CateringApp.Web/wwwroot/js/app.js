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
        //loader(false);
        $.extend(true, $.fn.dataTable.defaults, {
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            },
            responsive: true
        });
        $.extend($.validator.messages, {
            required: "Obavezno polje",
            number: "Unesite ispravan broj",
            digits: "Molimo unesite samo znamenke",
            maxLength: $.validator.format("Molimo unesite maksimalno {0} znakova"),
            minLength: $.validator.format("Molimo unesite minimalno {0} znakova"),
            equalTo: $.validator.format("Lozinke se moraju podudarati")
        });
        jQuery.validator.setDefaults({
            errorElement: "div",
            errorClass: "invalid-feedback",
            highlight: function (element) {
                $(element).parent().addClass("is-invalid");
            },
            unhighlight: function (element) {
                $(element).parent().removeClass("is-invalid");
            }
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
        //$('.modal').modal('hide');
        toastr["error"]("Došlo je do greške!");
        //$("#errorModalMain").modal("show");
    }
    Global.ajaxErrorHandler = ajaxErrorHandler;
    function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
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
        document.getElementById("error").style.display = "none";
        email = document.getElementById("email");
        password = document.getElementById("password");
        var form = document.getElementById("form");
        $("#form").validate({
            errorPlacement: function (label, element) {
                label.addClass("invalid-feedback");
                label.insertAfter($(element).next());
                element.addClass("is-invalid");
            },
            unhighlight: function (element, errorClass, validClass) {
                element.classList.remove("is-invalid");
            }
        });
        //hideError();
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
        form.addEventListener("submit", submitCallback);
    }
    Auth.initialize = initialize;
    function submitCallback(event) {
        document.getElementById("error").style.display = "none";
        event.preventDefault();
        if ($("#form").valid()) {
            loader(true);
            var email_1 = document.getElementById("email").value;
            var password_1 = document.getElementById("password").value;
            var remember = document.getElementById("remember").checked;
            var data = {
                email: email_1,
                password: btoa(password_1),
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
                error: function (jxHR, textStatus, error) {
                    if (jxHR.status === 401) {
                        document.getElementById("error").style.display = "block";
                    }
                    loader(false);
                }
            });
        }
    }
    //function showError() {
    //    email.className +=" is-invalid"
    //    password.className += " is-invalid";
    //    document.getElementById("error").style.display = "block";
    //}
    //export function hideError() {
    //    email.className = "form-control";
    //    password.className = "form-control";
    //    document.getElementById("error").style.display = "none";
    //}
})(Auth || (Auth = {}));
var Caterings;
(function (Caterings) {
    var All;
    (function (All) {
        var $table;
        var $cateringData;
        var $form;
        var $foodCategories;
        var $foodItems;
        var $cateringId = 0;
        var $formValidate;
        function initialize() {
            loader(true);
            $("#dropdown-users").select2();
            $form = document.getElementById("form");
            $formValidate = $("#form").validate({
                errorPlacement: function (label, element) {
                    label.addClass("invalid-feedback");
                    label.insertAfter(element);
                    element.addClass("is-invalid");
                    if (element.hasClass('select2-hidden-accessible') && element.next('.select2-container').length) {
                        label.insertAfter(element.next('.select2-container'));
                    }
                },
                wrapper: "div"
            });
            $form.addEventListener("submit", handleFormSubmit);
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
                        title: "Datum",
                        data: "cateringDate"
                    },
                    {
                        title: "Status",
                        data: "isClosed",
                        render: function (colData, data, row) {
                            if (row.isClosed)
                                return 'Zatvoren';
                            return 'Aktivan';
                        }
                    },
                    {
                        title: "Radnje",
                        data: "clientName",
                        className: "dt-center",
                        render: function (colData, data, row) {
                            var btnEdit = "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" onclick=\"Caterings.All.editCatering(" + row.cateringId + ")\"><i class=\"fas fa-edit\"></i></button>";
                            var btnInfo = "<button type=\"button\" class=\"btn btn-info\" alt=\"Uredi\" onclick=\"Caterings.All.editCatering(" + row.cateringId + ")\"><i class=\"fas fa-info-circle\"></i></button>";
                            var btnDelete = "<button class=\"btn btn-danger\" alt=\"Uredi\" onclick=\"Caterings.All.deleteCateringPrompt(" + row.cateringId + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
                            var retButtons = "";
                            if (row.isClosed === true)
                                retButtons = btnInfo + btnDelete;
                            else
                                retButtons = btnEdit + btnDelete;
                            return retButtons;
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
            $("#catering-date").datetimepicker({
                format: "DD-MM-YYYY"
            });
            loader(true);
            initStaticData();
            initData();
        }
        All.initialize = initialize;
        function initStaticData() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.ajax({
                                url: "/api/food/category/with_foods",
                                contentType: "application/json",
                                method: "get",
                                success: function (data) {
                                    $foodCategories = data;
                                },
                                error: Global.ajaxErrorHandler
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, $.ajax({
                                    url: "/api/food/item/all",
                                    contentType: "application/json",
                                    method: "get",
                                    success: function (data) {
                                        $foodItems = data;
                                    },
                                    error: Global.ajaxErrorHandler
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function initData() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            loader(true);
                            $cateringId = 0;
                            return [4 /*yield*/, $.ajax({
                                    url: "/api/catering/all/basic",
                                    contentType: "application/json",
                                    method: "get",
                                    success: function (data) {
                                        console.log(data);
                                        $table.clear().rows.add(data).draw();
                                        loader(false);
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        All.initData = initData;
        function handleFormSubmit(event) {
            event.preventDefault();
            if ($("#form").valid()) {
                submitCatering();
            }
        }
        function editCatering(cateringId) {
            var _this = this;
            loader(true);
            $.ajax({
                url: "/api/catering/" + cateringId,
                method: "get",
                data: null,
                success: function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var btn, users, commentRow;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(data);
                                return [4 /*yield*/, handleModalOpen()];
                            case 1:
                                _a.sent();
                                btn = document.getElementById("btn-catering-close");
                                btn.style.display = "block";
                                $cateringId = cateringId;
                                users = [];
                                data.users.forEach(function (item) {
                                    users.push(item.userId.toString());
                                });
                                $("#catering-name").val(data.cateringName);
                                $("#client-name").val(data.clientName);
                                $("#catering-date").val(data.cateringDate);
                                console.log($("#dropdown-users"));
                                console.log(users);
                                $("#dropdown-users").val(users).trigger("change");
                                if (data.vehicles.length > 0) {
                                    $("#dropdown-vehicles").val(data.vehicles[0].vehicleId.toString()).trigger("change");
                                }
                                loader(false);
                                if (data.dishes.length > 0) {
                                    data.dishes.map(function (item) {
                                        addFood(item);
                                    });
                                }
                                if (data.isClosed) {
                                    //let form = <any>document.getElementById("form");
                                    //let elements: any = form.elements;
                                    //for (var i = 0; i < elements.length; i++) {
                                    //    elements[i].readOnly = true;
                                    //}
                                    $("#form").find("input, select").prop("disabled", true);
                                    document.getElementById("btn-catering-close").style.display = "none";
                                    document.getElementById("btn-catering-save").style.display = "none";
                                    document.getElementById("btn-add-food").style.display = "none";
                                    document.querySelectorAll("button[data-delete-food]").forEach(function (elem) {
                                        elem.style.display = "none";
                                    });
                                    commentRow = document.getElementById("closing-comment");
                                    commentRow.style.display = "block";
                                    commentRow.getElementsByTagName("textarea")[0].value = data.closingComment;
                                }
                                return [2 /*return*/];
                        }
                    });
                }); },
                error: Global.ajaxErrorHandler
            });
        }
        All.editCatering = editCatering;
        function infoCatering(cateringId) {
            loader(true);
            $.ajax({
                url: "/api/catering/" + cateringId,
                method: "get",
                data: null,
                success: function (data) {
                    loader(false);
                    $("#catering-info-modal").modal("show");
                    var dl = document.getElementById("dl");
                    dl.innerHTML = "";
                    var name = document.createElement("dt");
                    name.innerText = "Naziv cateringa";
                    name.classList.add("col-4");
                    var nameDesc = document.createElement("dd");
                    nameDesc.innerText = data.cateringName;
                    nameDesc.classList.add("col-8");
                    dl.appendChild(name);
                    dl.appendChild(nameDesc);
                },
                error: Global.ajaxErrorHandler
            });
        }
        All.infoCatering = infoCatering;
        function pdfFileCatering() {
            loader(true);
            window.location.href = '/api/catering/pdf/' + $cateringId;
            loader(false);
        }
        All.pdfFileCatering = pdfFileCatering;
        function handleModalOpen() {
            return __awaiter(this, void 0, void 0, function () {
                var btn;
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
                                        $cateringId = 0;
                                        var userSelect = document.getElementById("dropdown-users");
                                        var vehicleSelect = document.getElementById("dropdown-vehicles");
                                        $("#catering-name").val("");
                                        $("#client-name").val("");
                                        vehicleSelect.innerHTML = '<option disabled selected></option>';
                                        clearForm();
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
                                            option.text = user.userFullName;
                                            userSelect.add(option);
                                        });
                                        var empty = document.createElement("option");
                                        empty.value = "0";
                                        empty.text = "Bez vozila";
                                        empty.selected = true;
                                        vehicleSelect.add(empty);
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
                            btn = document.getElementById("btn-catering-close");
                            btn.style.display = "none";
                            $("#add-catering-modal").modal("show");
                            return [2 /*return*/];
                    }
                });
            });
        }
        All.handleModalOpen = handleModalOpen;
        function addFood(foodId) {
            var formGroup = document.getElementById("food-form-group");
            var row = document.createElement("div");
            row.classList.add("row", "spacing-bottom");
            var column1 = document.createElement("div");
            column1.classList.add("col-6");
            var column2 = document.createElement("div");
            column2.classList.add("col-5");
            var column3 = document.createElement("div");
            column3.classList.add("col-1");
            var foodDropdown = document.createElement("select");
            foodDropdown.classList.add("form-control");
            var categoryDropdown = document.createElement("select");
            categoryDropdown.classList.add("form-control");
            categoryDropdown.onchange = changeFoodItems;
            $foodCategories.forEach(function (item) {
                var option = document.createElement("option");
                option.value = item.id.toString();
                option.text = item.name;
                //option.on = changeFoodItems;
                categoryDropdown.appendChild(option);
            });
            if (foodId !== null) {
                categoryDropdown.value = foodId.foodCategoryId.toString();
            }
            $foodItems.forEach(function (item) {
                console.log(categoryDropdown.value);
                if (item.foodCategoryId === parseInt(categoryDropdown.value)) {
                    var option = document.createElement("option");
                    option.value = item.id.toString();
                    option.text = item.name;
                    foodDropdown.appendChild(option);
                }
            });
            if (foodId !== null) {
                foodDropdown.value = foodId.id.toString();
            }
            var deleteRowButton = document.createElement("button");
            deleteRowButton.classList.add("btn", "btn-danger", "float-right");
            deleteRowButton.setAttribute("type", "button");
            deleteRowButton.setAttribute("data-delete-food", "");
            deleteRowButton.onclick = removeFoodItem;
            var icon = document.createElement("i");
            icon.classList.add("fas", "fa-ban");
            deleteRowButton.appendChild(icon);
            column1.appendChild(foodDropdown);
            column2.appendChild(categoryDropdown);
            column3.appendChild(deleteRowButton);
            row.appendChild(column1);
            row.appendChild(column2);
            row.appendChild(column3);
            formGroup.appendChild(row);
        }
        All.addFood = addFood;
        function changeFoodItems(ev) {
            console.log("change bla bla");
            var currentElement = this;
            console.log(currentElement.value);
            var parentRow = currentElement.parentNode.parentNode;
            var foodSelect = parentRow.childNodes.item(0).childNodes.item(0);
            console.log(foodSelect);
            foodSelect.innerHTML = "";
            $foodItems.forEach(function (item) {
                if (item.foodCategoryId === parseInt(currentElement.value)) {
                    var option = document.createElement("option");
                    option.value = item.id.toString();
                    option.text = item.name;
                    foodSelect.appendChild(option);
                }
            });
        }
        function removeFoodItem(mouseEvent) {
            console.log();
            var formGroup = document.getElementById("food-form-group");
            var rowElement = this.parentNode.parentNode;
            formGroup.removeChild(rowElement);
        }
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
                    vehicleName: elem.text,
                    vehicleRegistration: "",
                    vehicleKilometers: 0
                };
                if (vehicle.vehicleId === 0)
                    vehicle.vehicleId = null;
                vehicles.push(vehicle);
            });
            var catering = {
                dishes: [],
                users: users,
                vehicles: vehicles,
                cateringName: $("#catering-name").val().toString(),
                clientName: $("#client-name").val().toString(),
                cateringDate: $("#catering-date").val().toString(),
                cateringId: $cateringId,
                isClosed: false,
                closingComment: ""
            };
            var submitUrl = "/api/catering";
            var submitMethod = "post";
            if (catering.cateringId !== 0) {
                submitUrl += "/" + catering.cateringId;
                submitMethod = "put";
            }
            loader(true);
            var foodForm = document.getElementById("food-form-group");
            if (foodForm.childNodes.length > 1) {
                for (var i = 1; i < foodForm.childNodes.length; i++) {
                    var nodeRow = foodForm.childNodes.item(i); //row
                    var nodeSelect = nodeRow.childNodes.item(0).childNodes.item(0);
                    //console.log(nodeSelect.value);
                    var temp = {
                        id: parseInt(nodeSelect.value),
                        description: "",
                        foodCategoryId: -1,
                        foodCategoryName: "",
                        name: ""
                    };
                    catering.dishes.push(temp);
                }
            }
            $.ajax({
                url: submitUrl,
                contentType: "application/json",
                method: submitMethod,
                data: JSON.stringify(catering),
                success: function () {
                    $("#add-catering-modal").modal("hide");
                    initData();
                    toastr["success"]("Uspješno spremljeno!");
                },
                error: Global.ajaxErrorHandler
            });
            console.log(catering);
        }
        function deleteCateringPrompt(cateringId) {
            $cateringId = cateringId;
            $("#delete-catering-prompt").modal("show");
        }
        All.deleteCateringPrompt = deleteCateringPrompt;
        function deleteCateringConfirm() {
            loader(true);
            if ($cateringId !== 0) {
                $.ajax({
                    url: "/api/catering/" + $cateringId,
                    method: "delete",
                    success: function () {
                        $("#delete-catering-prompt").modal("hide");
                        initData();
                        toastr["info"]("Catering uspješno obrisan");
                    },
                    error: Global.ajaxErrorHandler
                });
            }
        }
        All.deleteCateringConfirm = deleteCateringConfirm;
        function closeCateringConfirm() {
            loader(true);
            var message = document.getElementById("closing-message").value;
            var data = {
                cateringId: $cateringId,
                closingComment: message
            };
            $.ajax({
                url: "/api/catering/close/" + $cateringId,
                method: "put",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function () {
                    $(".modal").modal("hide");
                    initData();
                    toastr["success"]("Uspješno spremljeno!");
                },
                error: Global.ajaxErrorHandler
            });
        }
        All.closeCateringConfirm = closeCateringConfirm;
        function clearForm() {
            console.log("Clear form");
            var form = document.getElementById("form");
            form.reset();
            $cateringId = 0;
            var elem = document.getElementById("food-form-group");
            var label = document.createElement("label");
            label.textContent = "Hrana";
            elem.innerHTML = "";
            elem.appendChild(label);
            $("#form").find("input, select").prop("disabled", false);
            document.getElementById("btn-catering-close").style.display = "block";
            document.getElementById("btn-catering-save").style.display = "block";
            document.getElementById("btn-add-food").style.display = "block";
            document.querySelectorAll("button[data-delete-food]").forEach(function (elem) {
                elem.style.display = "block";
            });
            var commentRow = document.getElementById("closing-comment");
            commentRow.style.display = "none";
            commentRow.getElementsByTagName("textarea")[0].value = "";
        }
        All.clearForm = clearForm;
    })(All = Caterings.All || (Caterings.All = {}));
})(Caterings || (Caterings = {}));
var Caterings;
(function (Caterings) {
    var My;
    (function (My) {
        var $table;
        var $cateringId;
        function initialize() {
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
                        title: "Status",
                        data: "isClosed",
                        render: function (colData, data, row) {
                            if (row.isClosed)
                                return 'Zatvoren';
                            return 'Aktivan';
                        }
                    },
                    {
                        title: "",
                        width: "15%",
                        data: "clientName",
                        className: "dt-center",
                        orderable: false,
                        render: function (colData, data, row) {
                            var button = "<button type=\"button\" class=\"btn btn-primary\" onclick=\"Caterings.My.viewCatering(" + row.cateringId + ")\"><i class=\"fas fa-info-circle\"></i></button>";
                            return button;
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
        My.initialize = initialize;
        function initData() {
            loader(true);
            $.ajax({
                url: "/api/catering/user",
                contentType: "application/json",
                method: "get",
                success: function (data) {
                    //$("#view-catering-modal").modal("show");
                    $table.clear().rows.add(data).draw();
                    loader(false);
                },
                error: Global.ajaxErrorHandler
            });
        }
        function viewCatering(cateringId) {
            loader(true);
            $cateringId = cateringId;
            $.ajax({
                url: "/caterings/detail/" + cateringId,
                method: "get",
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    $("#view-catering-modal").modal("show");
                    loader(false);
                    var table = document.getElementById("table-detail");
                    var tbody = table.getElementsByTagName("tbody")[0];
                    tbody.innerHTML = "";
                    tbody.innerHTML = data;
                },
                error: Global.ajaxErrorHandler
            });
        }
        My.viewCatering = viewCatering;
        function pdfFileCatering() {
            loader(true);
            window.location.href = '/api/catering/pdf/' + $cateringId;
            loader(false);
        }
        My.pdfFileCatering = pdfFileCatering;
    })(My = Caterings.My || (Caterings.My = {}));
})(Caterings || (Caterings = {}));
var FoodCat;
(function (FoodCat) {
    var $table;
    var $categoryId = 0;
    function initialize() {
        loader(true);
        $("#form").validate({
            errorPlacement: function (label, element) {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid");
            },
            unhighlight: function (element) {
                element.classList.remove("is-invalid");
            },
            wrapper: "div"
        });
        document.getElementById("form").addEventListener("submit", handleSubmitForm);
        $table = $("#categories-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "id",
                    width: "10%"
                },
                {
                    title: "Naziv kategorije",
                    data: "name"
                },
                {
                    title: "Radnje",
                    data: "vehicleId",
                    className: "dt-center",
                    width: "20%",
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" onclick=FoodCat.editCategory(" + row.id + ")><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-danger\" alt=\"Obri\u0161i\" onclick=\"FoodCat.deleteCategoryPrompt(" + row.id + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
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
    FoodCat.initialize = initialize;
    function initData() {
        console.log("Init data");
        loader(true);
        clearForm();
        $.ajax({
            url: "/api/food/category/all",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
                clearForm();
                $categoryId = 0;
                loader(false);
            }
        });
    }
    FoodCat.initData = initData;
    function editCategory(categoryId) {
        $categoryId = categoryId;
        loader(true);
        $.ajax({
            url: "/api/food/category/" + categoryId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                loader(false);
                $("#add-category-modal").modal("show");
                $("#category-name").val(data.name);
                $("#category-description").val(data.description);
            }
        });
    }
    FoodCat.editCategory = editCategory;
    function handleSubmitForm(event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitCategory();
        }
    }
    function submitCategory() {
        var category = {
            id: $categoryId,
            name: $("#category-name").val().toString(),
            description: $("#category-description").val().toString()
        };
        var submissionUrl;
        var method;
        if ($categoryId == 0) {
            submissionUrl = "/api/food/category";
            method = "post";
        }
        else {
            submissionUrl = "/api/food/category/" + $categoryId;
            method = "put";
        }
        loader(true);
        $.ajax({
            url: submissionUrl,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(category),
            success: function () {
                $("#add-category-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            },
            error: Global.ajaxErrorHandler
        });
    }
    FoodCat.submitCategory = submitCategory;
    function deleteCategoryPrompt(categoryId) {
        $categoryId = categoryId;
        $("#delete-category-modal").modal("show");
    }
    FoodCat.deleteCategoryPrompt = deleteCategoryPrompt;
    function deleteCategoryConfirm() {
        if ($categoryId !== 0) {
            loader(true);
            $.ajax({
                url: "/api/food/category/" + $categoryId,
                method: "delete",
                success: function () {
                    $("#delete-category-modal").modal("hide");
                    initData();
                    toastr["info"]("Kategorija hrane uspješno obrisana.");
                },
                error: Global.ajaxErrorHandler
            });
        }
    }
    FoodCat.deleteCategoryConfirm = deleteCategoryConfirm;
    function clearForm() {
        var form = document.getElementById("form");
        form.reset();
        $categoryId = 0;
    }
    FoodCat.clearForm = clearForm;
})(FoodCat || (FoodCat = {}));
var FoodItem;
(function (FoodItem) {
    var $table;
    var $itemId = 0;
    var $foodCategories;
    function initialize() {
        loader(true);
        console.log("Food items init data");
        $("#form").validate({
            errorPlacement: function (label, element) {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid");
            },
            unhighlight: function (element) {
                element.classList.remove("is-invalid");
            },
            wrapper: "div"
        });
        document.getElementById("form").addEventListener("submit", handleSubmitForm);
        $table = $("#items-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "id",
                    width: "10%"
                },
                {
                    title: "Naziv stavke hrane",
                    data: "name"
                },
                {
                    title: "Kategorija",
                    data: "foodCategoryName",
                },
                {
                    title: "Radnje",
                    data: "foodCategoryName",
                    className: "dt-center",
                    width: "20%",
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" onclick=FoodItem.editItem(" + row.id + ")><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-danger\" alt=\"Obri\u0161i\" onclick=\"FoodItem.deleteItemPrompt(" + row.id + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
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
        loader(true);
        initCategories();
        initData();
    }
    FoodItem.initialize = initialize;
    function initCategories() {
        $.ajax({
            url: "/api/food/category/all",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                $foodCategories = data;
                var categoriesSelect = document.getElementById("category-dropdown");
                $foodCategories.forEach(function (item) {
                    var option = document.createElement("option");
                    option.value = item.id.toString();
                    option.text = item.name;
                    categoriesSelect.add(option);
                });
            },
            error: Global.ajaxErrorHandler
        });
    }
    FoodItem.initCategories = initCategories;
    function initData() {
        console.log("Init data");
        loader(true);
        clearForm();
        $.ajax({
            url: "/api/food/item/all",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
                clearForm();
                $itemId = 0;
                loader(false);
            },
            error: Global.ajaxErrorHandler
        });
    }
    FoodItem.initData = initData;
    function editItem(itemId) {
        loader(true);
        $itemId = itemId;
        $.ajax({
            url: "/api/food/item/" + $itemId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                loader(false);
                $("#add-item-modal").modal("show");
                $("#item-name").val(data.name);
                $("#item-description").val(data.description);
                $("#category-dropdown").val(data.foodCategoryId);
            },
            error: Global.ajaxErrorHandler
        });
    }
    FoodItem.editItem = editItem;
    function handleSubmitForm(event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitItem();
        }
    }
    function submitItem() {
        var category = {
            id: $itemId,
            name: $("#item-name").val().toString(),
            description: $("#item-description").val().toString(),
            foodCategoryId: parseInt($("#category-dropdown").val().toString()),
            foodCategoryName: ""
        };
        var submissionUrl;
        var method;
        if ($itemId == 0) {
            submissionUrl = "/api/food/item";
            method = "post";
        }
        else {
            submissionUrl = "/api/food/item/" + $itemId;
            method = "put";
        }
        loader(true);
        $.ajax({
            url: submissionUrl,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(category),
            success: function () {
                $("#add-item-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            },
            error: Global.ajaxErrorHandler
        });
    }
    FoodItem.submitItem = submitItem;
    function deleteItemPrompt(itemId) {
        $itemId = itemId;
        $("#delete-item-modal").modal("show");
    }
    FoodItem.deleteItemPrompt = deleteItemPrompt;
    function deleteItemConfirm() {
        if ($itemId !== 0) {
            loader(true);
            $.ajax({
                url: "/api/food/item/" + $itemId,
                method: "delete",
                success: function () {
                    $("#delete-item-modal").modal("hide");
                    initData();
                    toastr["info"]("Stavka hrane uspješno obrisana.");
                },
                error: Global.ajaxErrorHandler
            });
        }
    }
    FoodItem.deleteItemConfirm = deleteItemConfirm;
    function clearForm() {
        var form = document.getElementById("form");
        form.reset();
        $itemId = 0;
    }
    FoodItem.clearForm = clearForm;
})(FoodItem || (FoodItem = {}));
var Home;
(function (Home) {
    function initialize() {
        initData();
    }
    Home.initialize = initialize;
    function initData() {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, ctx, getRandomColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $.ajax({
                            url: "/api/home/count/caterings/open",
                            method: "get",
                            success: function (res) {
                                document.getElementById("open-count").innerText = res.toString();
                            }
                        });
                        $.ajax({
                            url: "/api/home/count/caterings/closed",
                            method: "get",
                            success: function (res) {
                                document.getElementById("closed-count").innerText = res.toString();
                            }
                        });
                        canvas = document.getElementById("caterings-month-chart");
                        ctx = canvas.getContext("2d");
                        getRandomColor = function () {
                            var letters = '0123456789ABCDEF'.split('');
                            var color = '#';
                            for (var i = 0; i < 6; i++) {
                                color += letters[Math.floor(Math.random() * 16)];
                            }
                            return color;
                        };
                        return [4 /*yield*/, $.ajax({
                                url: "/api/home/count/caterings/months",
                                method: "get",
                                success: function (res) {
                                    console.log(res);
                                    var options = {
                                        type: "bar",
                                        data: {
                                            labels: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
                                            datasets: [{
                                                    label: "Br. cateringa u mjesecu",
                                                    data: res,
                                                    backgroundColor: getRandomColor
                                                }]
                                        },
                                        options: {
                                            scales: {
                                                yAxes: [{
                                                        ticks: {
                                                            stepSize: 1,
                                                            beginAtZero: true
                                                        }
                                                    }]
                                            }
                                        }
                                    };
                                    var chart = new Chart(ctx, options);
                                },
                                error: Global.ajaxErrorHandler
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    Home.initData = initData;
})(Home || (Home = {}));
var Users;
(function (Users) {
    var $table;
    var roles;
    var curUserId = 0;
    function initialize() {
        $("#pass-reset-form").validate({
            errorPlacement: function (label, element) {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid");
            },
            unhighlight: function (element) {
                element.classList.remove("is-invalid");
            },
            wrapper: "div"
        });
        $("#form").validate({
            errorPlacement: function (label, element) {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid");
            },
            unhighlight: function (element) {
                element.classList.remove("is-invalid");
            },
            wrapper: "div"
        });
        document.getElementById("form").addEventListener("submit", handleUserFormSubmit);
        document.getElementById("password-reset-modal").addEventListener("submit", handlePasswordFormSubmit);
        $table = $("#users-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "userId",
                    width: "10%"
                },
                {
                    title: "Korisnik",
                    data: "userFullName"
                },
                {
                    title: "Email",
                    data: "email"
                },
                {
                    title: "Uloga",
                    data: "roleTitle"
                },
                {
                    title: "Radnje",
                    data: "userId",
                    className: "dt-center",
                    width: "20%",
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" onclick=\"Users.editUser(" + row.userId + ")\"><i class=\"fas fa-edit\"></i></button><button class=\"btn btn-danger\" onclick=\"Users.removeUserPrompt(" + row.userId + ")\" alt=\"Obri\u0161i\"><i class=\"fas fa-trash-alt\"></i></button>";
                    }
                }
            ],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            }
        });
        //Row numbers
        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
        loader(true);
        initRoles();
        initData();
    }
    Users.initialize = initialize;
    function initRoles() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $.ajax({
                            url: "/api/users/roles",
                            contentType: "application/json",
                            method: "get",
                            success: function (data) {
                                console.log(data);
                                roles = data;
                                var rolesDropdown = document.getElementById("dropdown-roles");
                                roles.forEach(function (item) {
                                    var option = document.createElement("option");
                                    option.value = item.roleId.toString();
                                    option.text = item.roleTitle;
                                    rolesDropdown.add(option);
                                });
                            },
                            error: Global.ajaxErrorHandler
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    Users.initRoles = initRoles;
    function initData() {
        curUserId = 0;
        $.ajax({
            url: "/api/users",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                loader(false);
                $table.clear().rows.add(data).draw();
            },
            error: Global.ajaxErrorHandler
        });
    }
    Users.initData = initData;
    function editUser(userId) {
        curUserId = userId;
        $("#btn-pass-reset").show();
        $("#form-group-password").hide();
        loader(true);
        $.ajax({
            url: "/api/users/" + userId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                loader(false);
                $("#add-user-modal").modal("show");
                $("#user-name").val(data.firstName);
                $("#user-surname").val(data.lastName);
                $("#user-email").val(data.email);
                $("#user-username").val(data.username);
                $("#dropdown-roles").val(data.roleId);
            },
            error: Global.ajaxErrorHandler
        });
    }
    Users.editUser = editUser;
    function handleUserFormSubmit(event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitUser();
        }
    }
    function handlePasswordFormSubmit(event) {
        event.preventDefault();
        if ($("#pass-reset-form").valid()) {
            loader(true);
            var data = {
                userId: curUserId,
                password: btoa($("#new-password").val().toString()) //Base64
            };
            $.ajax({
                url: "/api/users/password/" + curUserId,
                method: "put",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function () {
                    $("#password-reset-modal").modal("hide");
                    loader(false);
                    toastr["success"]("Uspješno spremljeno!");
                },
                error: Global.ajaxErrorHandler
            });
        }
    }
    function submitUser() {
        var user = {
            userId: curUserId,
            roleId: parseInt($("#dropdown-roles").val().toString()),
            firstName: $("#user-name").val().toString(),
            lastName: $("#user-surname").val().toString(),
            email: $("#user-email").val().toString(),
            username: $("#user-username").val().toString(),
            roleTitle: "",
            password: ""
        };
        var submissionUrl;
        var method;
        if (curUserId == 0) {
            submissionUrl = "/api/users";
            method = "post";
            user.password = $("#user-password").val().toString();
        }
        else {
            submissionUrl = "/api/users/" + curUserId;
            method = "put";
        }
        $.ajax({
            url: submissionUrl,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(user),
            success: function () {
                $("#add-user-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            }
        });
    }
    function removeUserPrompt(userId) {
        curUserId = userId;
        $("#delete-user-modal").modal("show");
    }
    Users.removeUserPrompt = removeUserPrompt;
    function removeUser() {
        $.ajax({
            url: "/api/users/" + curUserId,
            method: "delete",
            contentType: "application/json",
            //data: JSON.stringify(userId),
            success: function () {
                initData();
                $("#delete-user-modal").modal("hide");
                toastr["info"]("Korisnik uspješno obrisan.");
            },
            error: Global.ajaxErrorHandler
        });
    }
    Users.removeUser = removeUser;
    function clearForm() {
        var form = document.getElementById("form");
        form.reset();
        curUserId = 0;
        $("#btn-pass-reset").hide();
        $("#form-group-password").show();
    }
    Users.clearForm = clearForm;
    function passwordChangePrompt() {
        $("#password-reset-modal").modal("show");
        var form = document.getElementById("pass-reset-form");
        form.reset();
    }
    Users.passwordChangePrompt = passwordChangePrompt;
})(Users || (Users = {}));
var Vehicles;
(function (Vehicles) {
    var $table;
    var $vehicleId = 0;
    function initialize() {
        loader(true);
        $("#form").validate({
            errorPlacement: function (label, element) {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid");
            },
            wrapper: "div"
        });
        document.getElementById("form").addEventListener("submit", handleSubmitForm);
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
                    title: "Registracija",
                    data: "vehicleRegistration"
                },
                {
                    title: "Broj kilometara",
                    data: "vehicleKilometers"
                },
                {
                    title: "Radnje",
                    data: "vehicleId",
                    className: "dt-center",
                    width: "20%",
                    render: function (colData, data, row) {
                        return "<button type=\"button\" class=\"btn btn-primary\" alt=\"Uredi\" onclick=Vehicles.editVehicle(" + row.vehicleId + ")><i class=\"fas fa-edit\" ></i></button><button class=\"btn btn-danger\" alt=\"Obri\u0161i\" onclick=\"Vehicles.deleteVehiclePrompt(" + row.vehicleId + ")\"><i class=\"fas fa-trash-alt\"></i></button>";
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
        console.log("Init data");
        loader(true);
        $("#vehicle-name").val("");
        $("#vehicle-registration").val("");
        $("#vehicle-kilometers").val("");
        $.ajax({
            url: "/api/vehicles",
            contentType: "application/json",
            method: "get",
            success: function (data) {
                console.log(data);
                $table.clear().rows.add(data).draw();
                $("#vehicle-name").val("");
                $("#vehicle-registration").val("");
                $("#vehicle-kilometers").val("");
                loader(false);
                $vehicleId = 0;
            }
        });
    }
    Vehicles.initData = initData;
    function editVehicle(vehicleId) {
        console.log("edit vehicle");
        $vehicleId = vehicleId;
        $.ajax({
            url: "/api/vehicles/" + vehicleId,
            contentType: "application/json",
            method: "get",
            success: function (data) {
                $("#add-vehicle-modal").modal("show");
                $("#vehicle-name").val(data.vehicleName);
                $("#vehicle-registration").val(data.vehicleRegistration);
                $("#vehicle-kilometers").val(data.vehicleKilometers);
            }
        });
    }
    Vehicles.editVehicle = editVehicle;
    function handleSubmitForm(event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitVehicle();
        }
    }
    function submitVehicle() {
        var vehicle = {
            vehicleId: $vehicleId,
            vehicleRegistration: $("#vehicle-registration").val().toString(),
            vehicleKilometers: parseFloat($("#vehicle-kilometers").val().toString()),
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
            loader(true);
            $.ajax({
                url: submissionUrl,
                method: method,
                contentType: "application/json",
                data: JSON.stringify(vehicle),
                success: function () {
                    $("#add-vehicle-modal").modal("hide");
                    initData();
                    toastr["success"]("Uspješno spremljeno!");
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
                    toastr["info"]("Vozilo uspješno obrisano.");
                },
                error: Global.ajaxErrorHandler
            });
        }
    }
    Vehicles.deleteVehicleConfirm = deleteVehicleConfirm;
    function clearForm() {
        var form = document.getElementById("form");
        form.reset();
        $vehicleId = 0;
    }
    Vehicles.clearForm = clearForm;
})(Vehicles || (Vehicles = {}));
var Home;
(function (Home) {
    function initialize() {
        initData();
    }
    Home.initialize = initialize;
    function initData() {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, ctx, getRandomColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $.ajax({
                            url: "/api/home/count/caterings/open",
                            method: "get",
                            success: function (res) {
                                document.getElementById("open-count").innerText = res.toString();
                            }
                        });
                        $.ajax({
                            url: "/api/home/count/caterings/closed",
                            method: "get",
                            success: function (res) {
                                document.getElementById("closed-count").innerText = res.toString();
                            }
                        });
                        canvas = document.getElementById("caterings-month-chart");
                        ctx = canvas.getContext("2d");
                        getRandomColor = function () {
                            var letters = '0123456789ABCDEF'.split('');
                            var color = '#';
                            for (var i = 0; i < 6; i++) {
                                color += letters[Math.floor(Math.random() * 16)];
                            }
                            return color;
                        };
                        return [4 /*yield*/, $.ajax({
                                url: "/api/home/count/caterings/months",
                                method: "get",
                                success: function (res) {
                                    console.log(res);
                                    var options = {
                                        type: "bar",
                                        data: {
                                            labels: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
                                            datasets: [{
                                                    label: "Br. cateringa u mjesecu",
                                                    data: res,
                                                    backgroundColor: getRandomColor
                                                }]
                                        },
                                        options: {
                                            scales: {
                                                yAxes: [{
                                                        ticks: {
                                                            stepSize: 1,
                                                            beginAtZero: true
                                                        }
                                                    }]
                                            }
                                        }
                                    };
                                    var chart = new Chart(ctx, options);
                                },
                                error: Global.ajaxErrorHandler
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    Home.initData = initData;
})(Home || (Home = {}));
//# sourceMappingURL=app.js.map