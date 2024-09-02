export interface UserRestaurant {
    id: number;
    userEmail: string;
    restaurantId: string;
}

export interface UserRestaurantReturn {
    id: number;
    userId: number;
    restaurantId: string;
}