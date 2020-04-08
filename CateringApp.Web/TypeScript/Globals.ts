module Global {
    export function initialize() {
        //loader(false);

        $.extend(true, $.fn.dataTable.defaults, {
            responsive: true
        });

        $.extend($.validator.messages, {
            required: "Required field",
            number: "Please input a valid number",
            digits: "Please enter only digits",
            maxLength: $.validator.format("Max {0} characters allowsed "),
            minLength: $.validator.format("Please enter at least {0} characters"),
            equalTo: $.validator.format("Password must match!")
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
        //$('.modal').modal('hide');
        toastr["error"]("An error has occured!");
    }

    export function logout() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
        window.location.reload();
    }
}

function loader(value: boolean) {
    let element: HTMLElement = document.getElementById("loading");

    if (value === true) element.style.display = "block";
    else element.style.display = "none";
    
}
