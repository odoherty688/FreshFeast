export interface Filter {
    email: string,
    filterName: string,
    diet: string[],
    allergies: string[],
    cuisineType: string,
    mealType: string,
    dishType: string
}

export interface FilterDatabase {
    id: number,
    userId: number,
    filterName: string,
    diet: string,
    allergies: string,
    cuisineType: string,
    mealType: string,
    dishType: string
}

export interface FilterReturn {
    id: number,
    userId: number,
    filterName: string,
    diet: string[],
    allergies: string[],
    cuisineType: string,
    mealType: string,
    dishType: string
}

export interface FilterId {
    email: string,
    filterId: number
}