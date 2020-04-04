module Caterings.All {

    let $table: DataTables.Api;
    let $cateringData: Caterings.Models.ICateringDetailModel;
    let $form: HTMLFormElement;
    let $foodCategories: Food.Models.Category[];
    let $foodItems: Food.Models.FoodItem[];
    let $cateringId = 0;
    let $formValidate: JQueryValidation.Validator;

    export function initialize() {
        loader(true);
        $("#dropdown-users").select2();

        $form = <HTMLFormElement>document.getElementById("form");
        $formValidate = $("#form").validate({
            errorPlacement: (label, element) => {
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
                    title: "Datum",
                    data:"cateringDate"
                },
                {
                    title: "Status",
                    data: "isClosed",
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        if (row.isClosed) return 'Zatvoren';
                        return 'Aktivan';
                    }
                },
                {
                    title: "Radnje",
                    data: "clientName",
                    className: "dt-center",
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        const btnEdit: string = `<button type="button" class="btn btn-primary" alt="Uredi" onclick="Caterings.All.editCatering(${row.cateringId})"><i class="fas fa-edit"></i></button>`;
                        const btnInfo: string = `<button type="button" class="btn btn-info" alt="Uredi" onclick="Caterings.All.editCatering(${row.cateringId})"><i class="fas fa-info-circle"></i></button>`;
                        const btnDelete: string = `<button class="btn btn-danger" alt="Uredi" onclick="Caterings.All.deleteCateringPrompt(${row.cateringId})"><i class="fas fa-trash-alt"></i></button>`;

                        let retButtons = "";

                        if (row.isClosed === true) retButtons = btnInfo + btnDelete;
                        else retButtons = btnEdit + btnDelete;

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

        $("#catering-date").datepicker({
            autoclose: true,
            format:"dd.mm.yyyy"
        });

        
        loader(true);
        initStaticData();
        initData();
    }

    async function initStaticData(){
        await $.ajax({
            url: "/api/food/category/with_foods",
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.Category[]) => {
                $foodCategories = data;
            },
            error: Global.ajaxErrorHandler
        });

        await $.ajax({
            url: "/api/food/item/all",
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.FoodItem[]) => {
                $foodItems = data;
            },
            error: Global.ajaxErrorHandler
        });
    }

    export async function initData() {
        loader(true);
        $cateringId = 0;
        await $.ajax({
            url: "/api/catering/all/basic",
            contentType: "application/json",
            method: "get",
            success: (data: Models.ICateringViewModel[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();
                loader(false);
            }
        });
    }

    function handleFormSubmit(event: Event) {
        event.preventDefault();

        if ($("#form").valid()) {
            submitCatering();
        }
    }

    export function editCatering(cateringId: number) {
        loader(true);
        
        $.ajax({
            url: `/api/catering/${cateringId}`,
            method: "get",
            data: null,
            success: async (data: Models.ICateringDetailModel) => {
                console.log(data);
                await handleModalOpen();
                let btn = document.getElementById("btn-catering-close");
                btn.style.display = "block";

                $cateringId = cateringId;
                
                

                let users: string[] = [];

                data.users.forEach(item => {
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
                    data.dishes.map((item: Models.IDish) => {
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
                    document.querySelectorAll("button[data-delete-food]").forEach((elem: HTMLElement) => {
                        elem.style.display = "none";
                    });

                    let commentRow = document.getElementById("closing-comment");
                    commentRow.style.display = "block";

                    commentRow.getElementsByTagName("textarea")[0].value = data.closingComment;
                }
            },
            error: Global.ajaxErrorHandler

        });
    }

    export function infoCatering(cateringId: number) {
        loader(true);
        $.ajax({
            url: `/api/catering/${cateringId}`,
            method: "get",
            data: null,
            success: (data: Models.ICateringDetailModel) => {
                loader(false);
                $("#catering-info-modal").modal("show");

                let dl: HTMLElement = document.getElementById("dl");
                dl.innerHTML = "";

                let name: HTMLElement = document.createElement("dt");
                name.innerText = "Naziv cateringa";
                name.classList.add("col-4");

                let nameDesc: HTMLElement = document.createElement("dd");
                nameDesc.innerText = data.cateringName;
                nameDesc.classList.add("col-8");




                dl.appendChild(name);
                dl.appendChild(nameDesc);
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function pdfFileCatering() {
        loader(true);
        window.location.href = '/api/catering/pdf/' + $cateringId;
        loader(false);
    }

    export async function handleModalOpen() {
        $(".spinner", "#add-catering-modal").show();
        $(".row", "#add-catering-modal").hide();

        let btn = <HTMLButtonElement>document.getElementById("btn-catering-close");
        btn.style.display = "none";

        await $.ajax({
            url: "/api/catering/details",
            method: "get",
            contentType: "application/json",
            success: (data: Models.ICateringDetailModel) => {
                $(".spinner", "#add-catering-modal").hide();
                $(".row", "#add-catering-modal").show();
                $cateringData = data;
                $cateringId = 0;

                let userSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-users");
                let vehicleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-vehicles");

                $("#catering-name").val("");
                $("#client-name").val("");

                vehicleSelect.innerHTML = '<option disabled selected></option>';
                clearForm();

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
                    option.text = user.userFullName;
                    userSelect.add(option);
                });

                let empty = document.createElement("option");
                empty.value = "0";
                empty.text = "Bez vozila";
                empty.selected = true;

                vehicleSelect.add(empty);

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

    export function addFood(foodId?: Models.IDish) {
        let formGroup: HTMLElement = document.getElementById("food-form-group");

        let row = document.createElement("div");
        row.classList.add("row", "spacing-bottom");

        let column1 = document.createElement("div");
        column1.classList.add("col-6");

        let column2 = document.createElement("div");
        column2.classList.add("col-5");

        let column3 = document.createElement("div");
        column3.classList.add("col-1");

        let foodDropdown = document.createElement("select");
        foodDropdown.classList.add("form-control");


        let categoryDropdown = document.createElement("select");
        categoryDropdown.classList.add("form-control");
        categoryDropdown.onchange = changeFoodItems;

        $foodCategories.forEach((item: Food.Models.Category) => {
            let option: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
            option.value = item.id.toString();
            option.text = item.name;
            //option.on = changeFoodItems;

            categoryDropdown.appendChild(option);

            
        });

        if (foodId !== null) {
            categoryDropdown.value = foodId.foodCategoryId.toString();
        }

        $foodItems.forEach((item: Food.Models.FoodItem) => {
            console.log(categoryDropdown.value);
            if (item.foodCategoryId === parseInt(categoryDropdown.value)) {
                let option: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
                option.value = item.id.toString();
                option.text = item.name;

                foodDropdown.appendChild(option);
            }
        });

        if (foodId !== null) {
            foodDropdown.value = foodId.id.toString();
        }
        

        

        let deleteRowButton = document.createElement("button");
        deleteRowButton.classList.add("btn", "btn-danger","float-right");
        deleteRowButton.setAttribute("type", "button");
        deleteRowButton.setAttribute("data-delete-food","");
        deleteRowButton.onclick = removeFoodItem;

        let icon = document.createElement("i");
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

    function changeFoodItems(this: GlobalEventHandlers, ev: Event) {
        console.log("change bla bla");
        let currentElement: HTMLSelectElement = <HTMLSelectElement>this;
        console.log(currentElement.value);
        let parentRow = currentElement.parentNode.parentNode;
        let foodSelect = parentRow.childNodes.item(0).childNodes.item(0);
        console.log(foodSelect);
        (<HTMLElement>foodSelect).innerHTML = "";

        $foodItems.forEach((item: Food.Models.FoodItem) => {
            if (item.foodCategoryId === parseInt(currentElement.value)) {
                let option: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
                option.value = item.id.toString();
                option.text = item.name;

                foodSelect.appendChild(option);
            }
        });

        
    }

    function removeFoodItem(this: GlobalEventHandlers, mouseEvent: MouseEvent): any {
        console.log();
        let formGroup = document.getElementById("food-form-group");
        let rowElement = (<HTMLElement>this).parentNode.parentNode;

        formGroup.removeChild(rowElement);
    }

    function submitCatering() {
        
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
                vehicleName: elem.text,
                vehicleRegistration: "",
                vehicleKilometers:0
            };

            if (vehicle.vehicleId === 0) vehicle.vehicleId = null;

            vehicles.push(vehicle);
        });


        let catering: Models.ICateringDetailModel = {
            dishes: [],
            users: users,
            vehicles: vehicles,
            cateringName: $("#catering-name").val().toString(),
            clientName: $("#client-name").val().toString(),
            cateringDate: $("#catering-date").val().toString(),
            cateringId: $cateringId,
            isClosed: false,
            closingComment:""
        };

        let submitUrl: string = "/api/catering";
        let submitMethod: string = "post";

        if (catering.cateringId !== 0) {
            submitUrl += `/${catering.cateringId}`;
            submitMethod = "put";
        }

        loader(true);

        let foodForm = document.getElementById("food-form-group");
        if (foodForm.childNodes.length > 1) {
            for (var i = 1; i < foodForm.childNodes.length; i++) {
                let nodeRow = foodForm.childNodes.item(i); //row
                let nodeSelect: HTMLSelectElement = <HTMLSelectElement>nodeRow.childNodes.item(0).childNodes.item(0);
                //console.log(nodeSelect.value);

                let temp: Models.IDish = {
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
            success: () => {
                $("#add-catering-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            },
            error: Global.ajaxErrorHandler
        });

        console.log(catering);
    }

    export function deleteCateringPrompt(cateringId: number) {
        $cateringId = cateringId;
        $("#delete-catering-prompt").modal("show");
    }

    export function deleteCateringConfirm() {
        loader(true)
        if ($cateringId !== 0) {
            $.ajax({
                url: `/api/catering/${$cateringId}`,
                method: "delete",
                success: () => {
                    $("#delete-catering-prompt").modal("hide");
                    initData();
                    toastr["info"]("Catering uspješno obrisan");
                },
                error: Global.ajaxErrorHandler
            })
        }
    }

    export function closeCateringConfirm() {
        loader(true);
        const message: string = (<HTMLInputElement>document.getElementById("closing-message")).value;
        const data: Models.ICateringClosingModel = {
            cateringId: $cateringId,
            closingComment: message
        };
       

        $.ajax({
            url: `/api/catering/close/${$cateringId}`,
            method: "put",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: () => {
                $(".modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function clearForm() {
        console.log("Clear form");
        let form = <HTMLFormElement>document.getElementById("form");
        
        form.reset();
        $cateringId = 0;

        let elem = document.getElementById("food-form-group");
        let label = document.createElement("label");
        label.textContent = "Hrana";

        elem.innerHTML = "";

        elem.appendChild(label);

        $("#form").find("input, select").prop("disabled", false);

        document.getElementById("btn-catering-close").style.display = "block";
        document.getElementById("btn-catering-save").style.display = "block";
        document.getElementById("btn-add-food").style.display = "block";
        document.querySelectorAll("button[data-delete-food]").forEach((elem: HTMLElement) => {
            elem.style.display = "block";
        });

        let commentRow = document.getElementById("closing-comment");
        commentRow.style.display = "none";

        commentRow.getElementsByTagName("textarea")[0].value = "";
    }
}