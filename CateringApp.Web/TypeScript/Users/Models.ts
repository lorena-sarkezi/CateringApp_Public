module Users.Models {
    export interface IUser {
        userId: number;
        roleId: number;
        firstName: string;
        lastName: string;
        userFullName?: string;
        email: string;
        username: string;
        roleTitle: string;
        password: string;
    }

    export interface IUserRole {
        roleId: number,
        roleTitle: string
    }

    export interface IUserPassword {
        userId: number;
        password: string
    }
}