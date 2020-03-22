module Caterings {

    let $table: DataTables.Api;
    let $cateringData: Caterings.Models.ICateringDetailModel;
    let $form: HTMLFormElement;
    let $cateringId = 0;
    

    export function initialize() {
        loader(true);
        $("#dropdown-users").select2();
        //$("#dropdown-vehicles").select2({
        //    dropdownParent: $('#add-catering-modal')
        //});

        $form = <HTMLFormElement>document.getElementById("form");
        $("#form").validate({
            errorPlacement: (label, element) => {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid");

                if (element.hasClass('select2-hidden-accessible') && element.next('.select2-container').length) {
                    label.insertAfter(element.next('.select2-container'));
                }
            },
            wrapper: "div"
            //highlight: function (element, errorClass, validClass) {
            //    var elem = $(element);
            //    if (elem.hasClass("select2-offscreen")) {
            //        $("#s2id_" + elem.attr("id") + " ul").addClass("invalid-feedback");
            //    } else {
            //        elem.addClass("invalid-feedback");
            //    }
            //},

            ////When removing make the same adjustments as when adding
            //unhighlight: function (element, errorClass, validClass) {
            //    var elem = $(element);
            //    if (elem.hasClass("select2-offscreen")) {
            //        $("#s2id_" + elem.attr("id") + " ul").removeClass("invalid-feedback");
            //    } else {
            //        elem.removeClass("invalid-feedback");
            //    }
            //}
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
                    title: "Radnje",
                    data: "clientName",
                    className: "dt-center",
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" onclick="Caterings.editCatering(${row.cateringId})"><i class="fas fa-edit"></i></button><button class="btn btn-danger" alt="Uredi" onclick="Caterings.deleteCateringPrompt(${row.cateringId})"><i class="fas fa-trash-alt"></i></button>`;
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

    export async function initData() {
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

                $cateringId = cateringId;
                
                

                let users: string[] = [];

                data.users.forEach(item => {
                    users.push(item.userId.toString());
                });
                
                $("#catering-name").val(data.cateringName);
                $("#client-name").val(data.clientName);
                console.log($("#dropdown-users"));
                console.log(users);
                $("#dropdown-users").val(users).trigger("change");
                if (data.vehicles.length > 0) {
                    $("#dropdown-vehicles").val(data.vehicles[0].vehicleId.toString()).trigger("change");
                }
                loader(false);

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
                $cateringId = 0;

                let userSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-users");
                let vehicleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-vehicles");

                $("#catering-name").val("");
                $("#client-name").val("");

                vehicleSelect.innerHTML = '<option disabled selected></option>';

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

        loader(true);

        $.ajax({
            url: submitUrl,
            contentType: "application/json",
            method: submitMethod,
            data: JSON.stringify(catering),
            success: () => {
                $("#add-catering-modal").modal("hide");
                initData();
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
                },
                error: Global.ajaxErrorHandler
            })
        }
    }

    function clearForm() {
        let form = <HTMLFormElement>document.getElementById("form");
        form.reset();
        $cateringId = 0;
    }
    
}