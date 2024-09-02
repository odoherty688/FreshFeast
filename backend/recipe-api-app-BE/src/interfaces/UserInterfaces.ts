export interface UserEmail {
    email: string
}

export interface User {
    id: number,
    email: string,
    picture: string,
    diet: string[],
    allergies: string[],
    completedRecipeCount: number
}

export interface UserReturn {
    id: number,
    email: string,
    picture: string,
    diet: string,
    allergies: string,
    completedRecipeCount: number
}