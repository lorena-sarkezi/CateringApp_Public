module Users {
    let $table: DataTables.Api;

    let roles: Models.IUserRole[];
    let curUserId: number = 0;

    export function initialize() {
        $("#pass-reset-form").validate({
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

        document.getElementById("form").addEventListener("submit", handleUserFormSubmit);
        document.getElementById("password-reset-modal").addEventListener("submit", handlePasswordFormSubmit);

        $table = $("#users-list-table").DataTable({
            columns: [
                {
                    title: "R. br.",
                    data: "userId",
                    width: "10%"
                },
                {
                    title: "Korisnik",
                    data: "userFullName"
                },
                {
                    title: "Email",
                    data: "email"
                },
                {
                    title: "Uloga",
                    data: "roleTitle"
                },
                {
                    title: "Radnje",
                    data: "userId",
                    className: "dt-center",
                    width: "20%",
                    render: (colData, data, row: Models.IUser) => {
                        return `<button type="button" class="btn btn-primary" alt="Uredi" onclick="Users.editUser(${row.userId})"><i class="fas fa-edit"></i></button><button class="btn btn-danger" onclick="Users.removeUserPrompt(${row.userId})" alt="Obriši"><i class="fas fa-trash-alt"></i></button>`;
                    }
                }
            ],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Croatian.json"
            }
        });

        //Row numbers
        $table.on('order.dt search.dt', function () {
            $table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        loader(true);
        initRoles();
        initData();
    }

    export async function initRoles() {
        await $.ajax({
            url: "/api/users/roles",
            contentType: "application/json",
            method: "get",
            success: (data: Models.IUserRole[]) => {
                console.log(data);
                roles = data;

                let rolesDropdown: HTMLSelectElement = <HTMLSelectElement>document.getElementById("dropdown-roles");

                roles.forEach((item: Models.IUserRole) => {
                    let option = document.createElement("option");
                    option.value = item.roleId.toString();
                    option.text = item.roleTitle
                    rolesDropdown.add(option);
                });
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function initData() {
        curUserId = 0;
        $.ajax({
            url: "/api/users",
            contentType: "application/json",
            method: "get",
            success: (data: Models.IUser[]) => {
                console.log(data);
                loader(false);
                $table.clear().rows.add(data).draw();
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function editUser(userId: number) {
        curUserId = userId;
        $("#btn-pass-reset").show();
        $("#form-group-password").hide();
        loader(true);
        $.ajax({
            url: `/api/users/${userId}`,
            contentType: "application/json",
            method: "get",
            success: (data: Models.IUser) => {
                loader(false);
                $("#add-user-modal").modal("show");

                $("#user-name").val(data.firstName);
                $("#user-surname").val(data.lastName);
                $("#user-email").val(data.email);
                $("#user-username").val(data.username);
                $("#dropdown-roles").val(data.roleId);

            },
            error: Global.ajaxErrorHandler
        })
    }

    function handleUserFormSubmit(event: Event) {
        event.preventDefault();
        if ($("#form").valid()) {
            submitUser();
        }
    }

    function handlePasswordFormSubmit(event: Event) {
        event.preventDefault();
        if ($("#pass-reset-form").valid()) {
            loader(true);
            let data: Models.IUserPassword = {
                userId: curUserId,
                password: btoa($("#new-password").val().toString()) //Base64
            };

            $.ajax({
                url: `/api/users/password/${curUserId}`,
                method: "put",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: () => {
                    $("#password-reset-modal").modal("hide");
                    loader(false);
                    toastr["success"]("Uspješno spremljeno!");
                },
                error: Global.ajaxErrorHandler
            });
        }
    }

    function submitUser() {
        let user: Models.IUser = {
            userId: curUserId,
            roleId: parseInt($("#dropdown-roles").val().toString()),
            firstName: $("#user-name").val().toString(),
            lastName: $("#user-surname").val().toString(),
            email: $("#user-email").val().toString(),
            username: $("#user-username").val().toString(),
            roleTitle: "",
            password: ""
        };

        let submissionUrl: string;
        let method: string;


        if (curUserId == 0) {
            submissionUrl = `/api/users`;
            method = "post";
            user.password = $("#user-password").val().toString();
        }
        else {
            submissionUrl = `/api/users/${curUserId}`;
            method = "put";
        }

        $.ajax({
            url: submissionUrl,
            method: method,
            contentType: "application/json",
            data: JSON.stringify(user),
            success: () => {
                $("#add-user-modal").modal("hide");
                initData();
                toastr["success"]("Uspješno spremljeno!");
            }
        });
    }

    export function removeUserPrompt(userId: number) {
        curUserId = userId;
        $("#delete-user-modal").modal("show");
    }

    export function removeUser() {
        $.ajax({
            url: `/api/users/${curUserId}`,
            method: "delete",
            contentType: "application/json",
            //data: JSON.stringify(userId),
            success: () => {
                initData();
                $("#delete-user-modal").modal("hide");
                toastr["info"]("Korisnik uspješno obrisan.");
            },
            error: Global.ajaxErrorHandler
        });
    }

    export function clearForm() {
        let form = <HTMLFormElement>document.getElementById("form");
        form.reset();
        curUserId = 0;
        $("#btn-pass-reset").hide();
        $("#form-group-password").show();
    }

    export function passwordChangePrompt() {
        $("#password-reset-modal").modal("show");
        let form: HTMLFormElement = <HTMLFormElement>document.getElementById("pass-reset-form");
        form.reset();
    }
}