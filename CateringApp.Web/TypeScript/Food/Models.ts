module Food.Models {
    export interface Category {
        id: number, 
        name: string, 
        description: string
    }

    export interface FoodItem {
        id: number,
        foodCategoryId: number
        foodCategoryName: string,
        name: string 
        description: string
    }
}