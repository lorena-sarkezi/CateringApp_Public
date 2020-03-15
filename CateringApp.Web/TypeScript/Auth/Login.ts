module Auth {
    let email: HTMLInputElement;
    let password: HTMLInputElement;

    export function initialize() {
        

        email = <HTMLInputElement>document.getElementById("email");
        password = <HTMLInputElement>document.getElementById("password");
        const form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

        hideError();
        loader(false);

        var elements:any = document.getElementsByTagName("input");
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

    function submitCallback(event: Event) {
        event.preventDefault();
        hideError();
        loader(true);

        const email: string = (<HTMLInputElement>document.getElementById("email")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;
        const remember: boolean = (<HTMLInputElement>document.getElementById("remember")).checked;        

        const data: Models.LoginModel = {
            email: email,
            password: btoa(password), //Base64 encoded, UTF-8 chars cause a shitstorm
            rememberMe: remember
        };

        console.log(data);

        $.ajax({
            url: "/api/auth/login",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: () => {
                window.location.replace("/");
            },
            error: () => {
                //alert("Error");
                showError();
                loader(false);
            }
        });
    }

    function showError() {
        email.className +=" is-invalid"
        password.className += " is-invalid";
        document.getElementById("error").style.display = "block";
    }

    export function hideError() {
        email.className = "form-control";
        password.className = "form-control";
        document.getElementById("error").style.display = "none";
    }
}