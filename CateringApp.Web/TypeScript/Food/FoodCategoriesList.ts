module FoodCat {

    let $table: DataTables.Api;
    let $categoryId: number = 0;

    export function initialize() {
        loader(true);

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
                    render: (colData, data, row: Food.Models.Category) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" ><i class="fas fa-edit" onclick=FoodCat.editCategory(${row.id})></i></button><button class="btn btn-danger" alt="Obriši" onclick="FoodCat.deleteCategoryPrompt(${row.id})"><i class="fas fa-trash-alt"></i></button>`;
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

    export function initData() {
        console.log("Init data");
        loader(true);
        clearForm();
        $.ajax({
            url: "/api/food/category/all",
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.Category[]) => {
                console.log(data);
                $table.clear().rows.add(data).draw();

                clearForm();
                $categoryId = 0;
                loader(false);
            }
        })
    }

    export function editCategory(categoryId: number) {
        $categoryId = categoryId;
        loader(true);
        $.ajax({
            url: `/api/food/category/${categoryId}`,
            contentType: "application/json",
            method: "get",
            success: (data: Food.Models.Category) => {
                loader(false);
                $("#add-category-modal").modal("show");
                $("#category-name").val(data.name);
                $("#category-description").val(data.description);

            }
        })
    }

    function handleSubmitForm(event: Event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitCategory();
        }
    }

    export function submitCategory() {
        let category: Food.Models.Category = {
            id: $categoryId,
            name: $("#category-name").val().toString(),
            description: $("#category-description").val().toString()
        };

        let submissionUrl: string;
        let method: string;


        if ($categoryId == 0) {
            submissionUrl = `/api/food/category`;
            method = "post";
        }
        else {
            submissionUrl = `/api/food/category/${$categoryId}`;
            method = "put";
        }
        loader(true);
        $.ajax({
            url: submissionUrl,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(category),
            success: () => {
                $("#add-category-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function deleteCategoryPrompt(categoryId: number) {
        $categoryId = categoryId;
        $("#delete-category-modal").modal("show");
    }

    export function deleteCategoryConfirm() {
        if ($categoryId !== 0) {
            loader(true);
            $.ajax({
                url: `/api/food/category/${$categoryId}`,
                method: "delete",
                success: () => {
                    $("#delete-category-modal").modal("hide");
                    initData();
                    toastr["info"]("Kategorija hrane uspješno obrisana.");
                },
                error: Global.ajaxErrorHandler
            })
        }
    }

    export function clearForm() {
        let form = <HTMLFormElement>document.getElementById("form");
        form.reset();
        $categoryId = 0;
    }
}