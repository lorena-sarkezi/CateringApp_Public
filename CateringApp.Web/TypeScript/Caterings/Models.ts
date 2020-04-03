module Caterings.Models {

    export interface ICateringDetailModel {
        cateringId: number;
        cateringName: string;
        clientName: string;
        isClosed: boolean;
        closingComment: string;
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

    export interface ICateringClosingModel {
        cateringId: number;
        closingComment: string;
    }

    export interface IDish {
        id: number;
        foodCategoryId: number;
        foodCategoryName: string;
        name: string;
        description: string;
    }
}