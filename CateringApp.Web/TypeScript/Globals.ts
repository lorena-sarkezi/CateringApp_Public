module Global {
    export function initialize() {
        loader(false);
    }

    export function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.reload();
    }

    //export function loader(value: boolean) {
    //    let element: HTMLElement = document.getElementById("loading")

    //    if (value === true) element.style.display = "none";
    //    else element.style.display = "block";

    //}
}

function loader(value: boolean) {
    let element: HTMLElement = document.getElementById("loading");

    if (value === true) element.style.display = "block";
    else element.style.display = "none";
    
}
