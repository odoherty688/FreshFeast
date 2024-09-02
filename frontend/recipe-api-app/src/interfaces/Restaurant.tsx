export interface Restaurant {
    id: string,
    displayName: string,
    address: string,
    location: google.maps.LatLngLiteral,
    openingHours: string[] | null,
    rating: number | null,
    userRatingCount: number | null,
    photos: string[] ,
    takeout: boolean | null,
    phoneNumber: string | null,
    dineIn: boolean | null,
    websiteUri: string | null
}

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