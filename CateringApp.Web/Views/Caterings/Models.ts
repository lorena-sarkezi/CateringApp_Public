module Caterings.Models {
    export interface ICateringModel {
        
    }

    export interface ICateringDetailModel {
        id: number;
        users: IUserModel[];
        vehicles: IVehicle[];
        dishes: IDish[];
    }

    export interface IUserModel {
        userId: number;
        userFullName: string;
        //lastName: string;
    }

    export interface IVehicle {
        vehicleId: number;
        vehicleName: string;
    }

    export interface IDish {
        dishId: number;
        dishName: string;
        dishType: string;
    }
}