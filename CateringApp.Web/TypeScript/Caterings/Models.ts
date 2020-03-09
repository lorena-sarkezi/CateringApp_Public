﻿module Caterings.Models {

    export interface ICateringDetailModel {
        cateringId: number;
        cateringName: string;
        clientName: string;
        users: IUserModel[];
        vehicles: Vehicles.Models.IVehicle[];
        dishes: IDish[];
    }

    export interface ICateringViewModel {
        cateringId: number;
        cateringName: string;
        clientName: string;
    }

    export interface IUserModel {
        userId: number;
        userFullName: string;
        //lastName: string;
    }

    

    export interface IDish {
        dishId: number;
        dishName: string;
        dishType: string;
    }
}