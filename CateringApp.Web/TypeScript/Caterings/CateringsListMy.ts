module Caterings.My {

    let $table: DataTables.Api;
    let $cateringId: number;

    export function initialize() {
        $table = $("#caterings-list-table").DataTable({
            columns: [
                {
                    title: "Row num.",
                    width: "10%",
                    data: "clientName"
                },
                {
                    title: "Catering name",
                    data: "cateringName"
                },
                {
                    title: "Client",
                    data: "clientName"
                },
                {
                    title: "Date",
                    data:"cateringDate"
                },
                {
                    title: "Status",
                    data: "isClosed",
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        if (row.isClosed) return 'Closed';
                        return 'Active';
                    }
                },
                {
                    title: "",
                    width:"15%",
                    data: "clientName",
                    className: "dt-center",
                    orderable: false,
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        const button = `<button type="button" class="btn btn-primary" onclick="Caterings.My.viewCatering(${row.cateringId})"><i class="fas fa-info-circle"></i></button>`

                        return button;
                    }
                }
            ]
        });

        //Row numbers
        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        initData();
    }

    function initData() {
        loader(true);
        $.ajax({
            url: "/api/catering/user",
            contentType: "application/json",
            method: "get",
            success: (data: Models.ICateringDetailModel[]) => {
                //$("#view-catering-modal").modal("show");
                $table.clear().rows.add(data).draw();
                loader(false);
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function viewCatering(cateringId: number) {
        loader(true);
        $cateringId = cateringId;
        $.ajax({
            url: `/caterings/detail/${cateringId}`,
            method: "get",
            contentType: "application/json",
            success: (data: string) => {
                console.log(data);
                $("#view-catering-modal").modal("show");
                loader(false);

                let table: HTMLTableElement = <HTMLTableElement>document.getElementById("table-detail");
                let tbody: HTMLTableSectionElement = table.getElementsByTagName("tbody")[0];

                tbody.innerHTML = "";
                tbody.innerHTML = data;
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function pdfFileCatering() {
        loader(true);
        window.location.href = '/api/catering/pdf/' + $cateringId;
        loader(false);
    }
}