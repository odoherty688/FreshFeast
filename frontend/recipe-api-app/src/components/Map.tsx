import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import axios from 'axios';
import { UserLocation } from '../screens/Restaurants';
import { fieldMask } from '../api/Restaurant/apiParams';
import { Restaurant } from '../interfaces/Restaurant';
import { AlertColor, Box, Button } from '@mui/material';
import theme from './Theme';
import RestaurantIcon from '../RestaurantIcon.png'

interface RestaurantMapInterface {
    userLocation: UserLocation,
    setAlertMessage: Dispatch<SetStateAction<string>>;
    setAlertSeverity: Dispatch<SetStateAction<AlertColor>>;
    setAlertOpen: Dispatch<SetStateAction<boolean>>;   
    setActiveMarker: Dispatch<SetStateAction<Restaurant | null>>; 
    center: google.maps.LatLngLiteral;
    setCenter: Dispatch<SetStateAction<google.maps.LatLngLiteral>>; 
    favourites: Restaurant[]
}

const RestaurantMap: React.FC<RestaurantMapInterface> = ({userLocation, setAlertMessage, setAlertSeverity, setAlertOpen, setActiveMarker, center, setCenter, favourites}) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY!,
    });
    const [restaurants, setRestaurants] = useState<Restaurant[]>(favourites)
    const [tempRestaurants, setTempRestaurants] = useState<Restaurant[]>([])
    const [restaurantsLoaded, setRestaurantsLoaded] = useState<boolean>(false)
    const [loaded1, setLoaded1] = useState<boolean>(false)
    const [loaded2, setLoaded2] = useState<boolean>(false)
    const [loaded3, setLoaded3] = useState<boolean>(false)
    const [loaded4, setLoaded4] = useState<boolean>(false)
    const [loaded5, setLoaded5] = useState<boolean>(false)
    const [zoom, setZoom] = useState<number>(15)

    useEffect(() => {
        const getRestaurantMarkers = async () => {
            const fetchPromises = [
                fetchRestaurants({lat: userLocation.latitude, lng: userLocation.longitude}, setLoaded1),
                fetchRestaurants({lat: userLocation.latitude + 0.02, lng: userLocation.longitude}, setLoaded2),
                fetchRestaurants({lat: userLocation.latitude, lng: userLocation.longitude + 0.02}, setLoaded3),
                fetchRestaurants({lat: userLocation.latitude - 0.02, lng: userLocation.longitude}, setLoaded4),
                fetchRestaurants({lat: userLocation.latitude, lng: userLocation.longitude - 0.02}, setLoaded5)
            ];
    
            await Promise.all(fetchPromises);
        }
    
        if (restaurants.length === 0) {
            getRestaurantMarkers()
        }
    }, []);

    useEffect(() => {
        if (loaded1 && loaded2 && loaded3 && loaded4 && loaded5) {
            setRestaurants((prevRestaurants) => {
                const uniqueRestaurants = [...tempRestaurants, ...favourites].filter((newRestaurant) => {
                    return !prevRestaurants.some((existingRestaurant) => existingRestaurant.id === newRestaurant.id);
                });
            
                return [...prevRestaurants, ...uniqueRestaurants];
            }); 
            setRestaurantsLoaded(true);
        }
    }, [loaded1, loaded2, loaded3, loaded4, loaded5, tempRestaurants, favourites]);
    
    const fetchRestaurants = async (bounds: google.maps.LatLngLiteral, setLoaded: Dispatch<SetStateAction<boolean>>) => {
        try {
            const response = await axios.post(
                'https://places.googleapis.com/v1/places:searchNearby',
                {
                    includedTypes: ['restaurant'],
                    maxResultCount: 20,
                    locationRestriction: {
                        circle: {
                            center: {
                                latitude: bounds.lat,
                                longitude: bounds.lng
                            },
                            radius: 1000
                        },
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': process.env.REACT_APP_GOOGLEMAPS_API_KEY!,
                        'X-Goog-FieldMask': fieldMask

                    },
                }
            );

            if (response.status === 200) {
                let restaurantResponseArray = response.data.places
                let restaurantsTemp: Restaurant[] = []
                restaurantResponseArray.forEach((restaurantResponse: any) => {
                    let location: google.maps.LatLngLiteral = { lat: restaurantResponse.location.latitude, lng: restaurantResponse.location.longitude}
                    let photos: string[] = []

                    if (restaurantResponse.photos) {
                        restaurantResponse.photos.forEach((photo: any) => {
                            let photoReference: string = photo.name

                            photos.push(photoReference)
                        })
                    }

                    let restaurantTemp: Restaurant = {
                        id: restaurantResponse.id,
                        displayName: restaurantResponse.displayName.text,
                        address: restaurantResponse.formattedAddress,
                        location: location,
                        openingHours: restaurantResponse.currentOpeningHours ? restaurantResponse.currentOpeningHours.weekdayDescriptions : null,
                        rating: restaurantResponse.rating ? restaurantResponse.rating : null,
                        userRatingCount: restaurantResponse.userRatingCount ? restaurantResponse.userRatingCount : null,
                        photos: photos,
                        takeout: restaurantResponse.takeout ? restaurantResponse.takeout : null,
                        phoneNumber: restaurantResponse.internationalPhoneNumber ? restaurantResponse.internationalPhoneNumber : null,
                        dineIn: restaurantResponse.dineIn ? restaurantResponse.dineIn : null,
                        websiteUri: restaurantResponse.websiteUri ? restaurantResponse.websiteUri : null
                    }

                    restaurantsTemp.push(restaurantTemp)
                })

                setTempRestaurants((prevRestaurants) => {
                    const uniqueRestaurants = restaurantsTemp.filter((newRestaurant) => {
                        return !prevRestaurants.some((existingRestaurant) => existingRestaurant.id === newRestaurant.id);
                    });
                
                    return [...prevRestaurants, ...uniqueRestaurants];
                });         
                setLoaded(true)   
            } else if (response.status === 400) {
                setAlertOpen(true);
                setAlertMessage('Could not fetch restaurants');
                setAlertSeverity('error');
            }
        } catch (error) {
            setAlertOpen(true);
            setAlertMessage('Could not fetch restaurants');
            setAlertSeverity('error');
        }
    };

    const options = useMemo(() => ({
        clickableIcons: false,
        mapTypeControl: false,
    }), [])

    const handleOnLoad = useCallback((map: google.maps.Map) => {
      mapRef.current = map
    }, [])
  
    const handleOnUnmount = useCallback(() => {
      mapRef.current = null
    }, [])
  
    const handleMarker = (restaurant: Restaurant) => {
        if (mapRef.current !== null) {
            setActiveMarker(restaurant)
            setCenter({lat: restaurant.location.lat, lng: restaurant.location.lng})
            let currentZoom = mapRef.current.getZoom()!
            setZoom(currentZoom)
        }

    }

    const renderGoogleMap = () => {
        if(isLoaded) {
            const iconMarker = {
                url: RestaurantIcon,
                scaledSize: new google.maps.Size(50,50),
            }

            return (
                <>
                    {restaurants.length !== 0 && restaurantsLoaded === true && restaurants.map((restaurant: Restaurant, index) => {
                        return (
                            <MarkerF data-testid={'restaurant-pin-index'} key={restaurant.id} icon={iconMarker} onClick={() => handleMarker(restaurant)} position={{ lat: restaurant.location.lat, lng: restaurant.location.lng }} />
                        )
                        })
                    }
                </>
            );
        } else {
            return <></>
        }
    }
    
    const Map = () => {
        if (isLoaded && restaurantsLoaded === true && favourites) {
            return (
                <GoogleMap
                data-testid='map'
                zoom={zoom}
                center={center}
                mapContainerStyle={{ height: 600, width: 600 }}
                onLoad={handleOnLoad}
                onUnmount={handleOnUnmount}
                options={options}
                >
                    {renderGoogleMap()}
                </GoogleMap>
            )
        }
    };

    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }

    if (isLoaded) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                <Map />
            </Box>
        );  
    }
    
};

export default RestaurantMap;
