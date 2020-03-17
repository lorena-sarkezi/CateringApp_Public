module Global {
    export function initialize() {
        loader(false);

        $.extend(true, $.fn.dataTable.defaults, {
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            },
            responsive: true
        });

        
    }

    export function getCookie(name): string {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");

        if (parts.length == 2)
            return parts.pop().split(";").shift();
    }

    export function ajaxErrorHandler(jxHR: JQueryXHR, textStatus: string, error: string) {
        loader(false);
        console.error(error);
        console.log(jxHR);
        //$("#errorModalMain").modal("show");
        alert("Došlo je do greške!");
    }

    export function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.reload();
    }
}

function loader(value: boolean) {
    let element: HTMLElement = document.getElementById("loading");

    if (value === true) element.style.display = "block";
    else element.style.display = "none";
    
}
