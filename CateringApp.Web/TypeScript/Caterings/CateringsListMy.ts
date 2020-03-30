module Caterings.My {

    let $table: DataTables.Api;

    export function initialize() {
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
                    render: (colData, data, row: Models.ICateringDetailModel) => {
                        if (row.isClosed) return 'Zatvoren';
                        return 'Aktivan';
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
            ],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            },
        });

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
}