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
    }
}