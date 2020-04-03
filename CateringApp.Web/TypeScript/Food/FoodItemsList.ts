module FoodItem {

    let $table: DataTables.Api;
    let $itemId: number = 0;
    let $foodCategories: Food.Models.Category[];

    export function initialize() {
        loader(true);

        console.log("Food items init data");

        $("#form").validate({
            errorPlacement: (label, element) => {
                label.addClass("invalid-feedback");
                label.insertAfter(element);
                element.addClass("is-invalid")
            },
            unhighlight: (element) => {
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
                    data:"foodCategoryName",
                },
                {
                    title: "Radnje",
                    data: "foodCategoryName",
                    className: "dt-center",
                    width: "20%",
                    render: (colData, data, row: Food.Models.Category) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" onclick=FoodItem.editItem(${row.id})><i class="fas fa-edit"></i></button><button class="btn btn-danger" alt="Obriši" onclick="FoodItem.deleteItemPrompt(${row.id})"><i class="fas fa-trash-alt"></i></button>`;
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
    export function initCategories() {
        $.ajax({
            url: "/api/food/category/all",
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.Category[]) => {
                $foodCategories = data;

                let categoriesSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("category-dropdown");

                $foodCategories.forEach((item: Food.Models.Category) => {

                    let option = document.createElement("option");
                    option.value = item.id.toString();
                    option.text = item.name
                    categoriesSelect.add(option);
                });
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function initData() {
        console.log("Init data");
        loader(true);
        clearForm();
        $.ajax({
            url: "/api/food/item/all",
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.FoodItem[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();

                clearForm();
                $itemId = 0;
                loader(false);
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function editItem(itemId: number) {
        loader(true);
        $itemId = itemId;
        $.ajax({
            url: `/api/food/item/${$itemId}`,
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.FoodItem) => {
                loader(false);
                $("#add-item-modal").modal("show");
                $("#item-name").val(data.name);
                $("#item-description").val(data.description);
                $("#category-dropdown").val(data.foodCategoryId);

            },
            error: Global.ajaxErrorHandler
        })
    }

    function handleSubmitForm(event: Event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitItem();
        }
    }

    export function submitItem() {
        let category: Food.Models.FoodItem = {
            id: $itemId,
            name: $("#item-name").val().toString(),
            description: $("#item-description").val().toString(),
            foodCategoryId: parseInt($("#category-dropdown").val().toString()),
            foodCategoryName: ""
        };

        let submissionUrl: string;
        let method: string;


        if ($itemId == 0) {
            submissionUrl = `/api/food/item`;
            method = "post";
        }
        else {
            submissionUrl = `/api/food/item/${$itemId}`;
            method = "put";
        }
        loader(true);
        $.ajax({
            url: submissionUrl,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(category),
            success: () => {
                $("#add-item-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function deleteItemPrompt(itemId: number) {
        $itemId = itemId;
        $("#delete-item-modal").modal("show");
    }

    export function deleteItemConfirm() {
        if ($itemId !== 0) {
            loader(true);
            $.ajax({
                url: `/api/food/item/${$itemId}`,
                method: "delete",
                success: () => {
                    $("#delete-item-modal").modal("hide");
                    initData();
                    toastr["info"]("Stavka hrane uspješno obrisana.");
                },
                error: Global.ajaxErrorHandler
            })
        }
    }

    export function clearForm() {
        let form = <HTMLFormElement>document.getElementById("form");
        form.reset();
        $itemId = 0;
    }
}