import React, { useEffect, useState } from 'react';
import RestaurantMap from '../components/Map';
import { AlertColor, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, Rating, Tab, Tabs, Typography } from '@mui/material';
import AlertPopup from '../components/Alert';
import { Restaurant, UserRestaurant } from '../interfaces/Restaurant';
import theme from '../components/Theme';
import { restaurantText } from '../text/signupText';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useAuth0 } from '@auth0/auth0-react';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import axios from 'axios';
import { restaurantIdParameters } from '../api/Restaurant/apiParams';
import PinDropIcon from '@mui/icons-material/PinDrop';
import useAsyncEffect from 'use-async-effect';
import { truncateString } from '../components/truncateString';

export interface UserLocation {
    latitude: number;
    longitude: number;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

const Restaurants = () => {
    const {getAccessTokenSilently, user} = useAuth0()
    const [accessToken, setAccessToken] = useState<string>('')
    const [userLoaded, setUserLoaded] = useState<boolean>(false)
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [activeMarker, setActiveMarker] = useState<Restaurant | null>(null);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [tabValue, setTabValue] = useState<number>(0);
    const [favouritedRestaurants, setFavouritedRestaurants] = useState<Restaurant[]>([])
    const [favouritedRestaurantIds, setFavouritedRestaurantIds] = useState<string[]>([])
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({lat: 0, lng: 0})
    const [favouritesLoaded, setFavouritesLoaded] = useState<boolean>(false)

    useAsyncEffect(async () => {
        getUserLocation();
        await getFavouriteRestaurants();
        setFavouritesLoaded(true)
    }, []);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    setCenter({lat: latitude, lng: longitude});
                    setUserLoaded(true)
                },
                (error) => {
                    console.log('Error getting user location', error);
                }
            );
        } else {
            console.log('Geolocation is not supported');
        }
    };

    const fetchRestaurant = async (restaurantId: string) => {
        try {
            const response = await axios.get(
                `https://places.googleapis.com/v1/places/${restaurantId}?fields=${restaurantIdParameters}&key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY!}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': process.env.REACT_APP_GOOGLEMAPS_API_KEY!
                    },
                }
            );

            if (response.status === 200) {
                let restaurantResponse = response.data

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

                return restaurantTemp;
            } else {
                setAlertMessage('Could not get restaurant details')
                setAlertSeverity('error')
                setAlertOpen(true)
                return null
            }
        } catch (err) {
            console.log(err)
            setAlertMessage('Could not get restaurant details')
            setAlertSeverity('error')
            setAlertOpen(true)
            return null
        }
    }

    const getFavouriteRestaurants = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            setAccessToken(accessToken);
  
            if (user && user.email) {
              const userEmail = user.email
    
              const result = await axios.get(`http://localhost:8000/api/restaurants/getUserFavouritedRestaurants/${encodeURIComponent(userEmail)}`, {
                headers: {
                  "Authorization": `bearer ${accessToken}`,
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                },
              });
    
              console.log(result)
              if (result.data.error === false) {
                let favouritedRestaurantIdsTemp: string[] = result.data.data
                let favouritedRestaurantsTemp: Restaurant[] = []
                setFavouritedRestaurantIds(favouritedRestaurantIdsTemp)

                for (let i = 0; i < favouritedRestaurantIdsTemp.length; i++) {
                    const event = favouritedRestaurantIdsTemp[i];
                    if (event) {
                        let restaurantResponse: Restaurant | null = await fetchRestaurant(event);
                        if (restaurantResponse !== null) {
                            let restaurant: Restaurant = restaurantResponse
                            favouritedRestaurantsTemp.push(restaurant)
                        }
                    }
                }
                setFavouritedRestaurants(favouritedRestaurantsTemp)
              } else {
                setAlertMessage('Could not get Favourites')
                setAlertSeverity('error')
                setAlertOpen(true)
              }
            } else {
              setAlertMessage('Could not get Favourites')
              setAlertSeverity('error')
              setAlertOpen(true)
            }
          } catch (error) {
            setAlertMessage('Could not get Favourites')
            setAlertSeverity('error')
            setAlertOpen(true)
          }
    }

    console.log(accessToken)

    const RestaurantPhotos = ({ photos }: { photos: string[] }) => {
        return (
            <Box sx={{ display: "flex", overflowX: "auto", "& > :not(:last-child)": { marginRight: 2 } }}>
                {photos.map((photo, index) => (
                        <CardMedia
                            data-testid={`photo-${index}`}
                            key={`Photo ${index}`}
                            component="img"
                            height="200"
                            width="200"
                            image={`https://places.googleapis.com/v1/${photo}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}`}
                            alt={`Photo ${index}`}
                        />
                ))}
            </Box>
        );
    };

    const RestaurantSelectedDetails = ({activeMarker} : {activeMarker: Restaurant}) => {
        const [favourited, setFavourited] = useState<boolean>(favouritedRestaurantIds.includes(activeMarker.id))


        const addRestaurantToFavourites = async (restaurant: Restaurant) => {
            try {
                if (user && user.email) {
                    const accessToken = await getAccessTokenSilently();

                    const userEmail = user.email
        
                    let data: UserRestaurant = {
                        id: 0,
                        userEmail,
                        restaurantId: restaurant.id
                    }
            
                    const result = await axios.post(`http://localhost:8000/api/restaurants/addUserFavouritedRestaurant`, data, {
                        headers: {
                        "Authorization": `bearer ${accessToken}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                        },
                    });
                    
                    if (result.data.error === false) {
                        console.log(result.data.message)
                        setFavouritedRestaurantIds((prevRestaurantIds) => [...prevRestaurantIds, restaurant.id])
                        setFavouritedRestaurants((prevRestaurant) => [...prevRestaurant, restaurant])
                    } else {
                        setAlertMessage(result.data.message)
                        setAlertSeverity('error')
                        setAlertOpen(true)
                        }
                }
            } catch (error) {
                setAlertMessage('Could not get Favourites')
                setAlertSeverity('error')
                setAlertOpen(true)
            }
        }
    
        const removeRestaurantFromFavourites = async (restaurant: Restaurant) => {
            try {
              if (user && user.email) {
                const userEmail = user.email
                console.log('userEmail: ', userEmail)
                console.log('TOKEN', accessToken)
    
                let data: UserRestaurant = {
                    id: 0,
                    userEmail,
                    restaurantId: restaurant.id
                }
        
                const result = await axios.delete(`http://localhost:8000/api/restaurants/deleteUserFavouritedRestaurant`, {
                    headers: {
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    },
                    data: data
                });
            
                if (result.data.error === false) {
                    console.log(result.data.message)
                    setFavouritedRestaurantIds(prevRestaurantIds => prevRestaurantIds.filter(currentRestaurantId => currentRestaurantId !== restaurant.id));
                    setFavouritedRestaurants(prevRestaurants => prevRestaurants.filter(currentRestaurant => currentRestaurant.id !== restaurant.id));
                } else {
                    setAlertMessage(result.data.message)
                    setAlertSeverity('error')
                    setAlertOpen(true)
                    }
              }
            } catch (error) {
                setAlertMessage('Could not get Favourites')
                setAlertSeverity('error')
                setAlertOpen(true)
            }
        }

        let dineIn = 'N/A'
        let takeout = 'N/A'
        let telephoneNumber = 'N/A'
        let rating = 0;
        let userRatingCount = '(0)'

        if (activeMarker.dineIn !== null) {
            dineIn = activeMarker.dineIn === true ? 'Yes' : 'No'
        }

        if (activeMarker.dineIn !== null) {
            takeout = activeMarker.takeout === true ? 'Yes' : 'No'
        }

        if (activeMarker.phoneNumber !== null) {
            telephoneNumber = activeMarker.phoneNumber
        }

        if (activeMarker.rating !== null) {
            rating = activeMarker.rating
        }

        if (activeMarker.userRatingCount !== null) {
            userRatingCount = `(${activeMarker.userRatingCount})`
        }

        const openingHoursFormat = () => {
            if (activeMarker.openingHours === null) {
                return (
                    <Box sx={{paddingBottom: 1}}>
                        <Typography variant='body2' fontWeight='bold' gutterBottom>
                            {restaurantText.openingHours}&nbsp;
                        </Typography>
                        <Typography variant='body2' fontWeight='bold' gutterBottom>
                            {restaurantText.na}
                        </Typography> 
                    </Box>
                )
            } else {
                return (
                    <Box sx={{paddingBottom: 1}}>
                        <Typography variant='body2' fontWeight='bold' gutterBottom>
                            {restaurantText.openingHours}
                        </Typography>
                        {activeMarker.openingHours.map((string: string) => (
                            <Typography component={'span'} variant='body2' gutterBottom key={string}>
                                {string}
                                <br />
                            </Typography>
                        ))}  
                    </Box>       
                )
            }
        }

        const handleFavouriteChange = (restaurant: Restaurant) => {
            if (favourited === true) {
                removeRestaurantFromFavourites(restaurant);
                setFavourited(false)
            } else if (favourited === false) {
                addRestaurantToFavourites(restaurant);
                setFavourited(true)
            }
        }

        const FavouriteButton = () => {
            return (
                    <Button data-testid='favourite-button' onClick={() => handleFavouriteChange(activeMarker)} sx={{ color: theme.palette.secondary.main }}>
                    { favourited === true ? (
                        <FavoriteOutlinedIcon />
                    ) : (
                        <FavoriteBorderOutlinedIcon />
                    )
                    }
                    </Button>
            )
        }

      return (
        <Card sx={{minWidth: 580, minHeight: 590}}>
            <CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        {truncateString(activeMarker.displayName, 40)}
                    </Typography>
                    <FavouriteButton />
                </Box>
                
                {activeMarker && activeMarker.photos && activeMarker.photos.length > 0 && (
                    <Box sx={{padding: 2}}>
                        <RestaurantPhotos photos={activeMarker.photos} />
                    </Box>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{paddingBottom: 1}}>
                            <Typography variant='body2' fontWeight='bold' gutterBottom>
                                {restaurantText.address}
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                                {activeMarker.address}
                            </Typography>
                        </Box>
                        <Box sx={{paddingBottom: 1}}>
                            <Typography variant='body2' fontWeight='bold' gutterBottom>
                                {restaurantText.telephoneNumber}
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                                {telephoneNumber}
                            </Typography>
                        </Box>
                        <Box sx={{paddingBottom: 1, display: 'flex', alignItems: 'center'  }}>
                            <Typography variant='body2' fontWeight='bold' gutterBottom>
                                {restaurantText.dineIn}&nbsp;
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                                {dineIn}
                            </Typography>
                        </Box>
                        <Box sx={{paddingBottom: 2, display: 'flex', alignItems: 'center'  }}>
                            <Typography variant='body2' fontWeight='bold' gutterBottom>
                                {restaurantText.takeout}&nbsp;
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                                {takeout}
                            </Typography>
                        </Box>
                        <Box sx={{paddingBottom: 1, display: 'flex', alignItems: 'center'  }}>
                            <Button variant='contained' data-testid='go-to-website-button' href={activeMarker.websiteUri!} sx={{backgroundColor: theme.palette.secondary.main, color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } }}}>
                                {restaurantText.goToWebsite}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {openingHoursFormat()}
                        <Box sx={{paddingBottom: 2, display: 'flex', alignItems: 'center'  }}>
                            <Typography variant='body2' fontWeight='bold' gutterBottom>
                                {restaurantText.rating}&nbsp;
                            </Typography>
                            <Rating name="read-only" value={rating} readOnly />
                            <Typography variant='caption' fontWeight='bold' gutterBottom>
                                {userRatingCount}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
      )
    }

    const RestaurantDetails = () => {
        if (activeMarker !== null) {
            return (
                <>
                <RestaurantSelectedDetails activeMarker={activeMarker}/>
                </>
            )

        } else {
            return (
                <Card sx={{minWidth: 580, minHeight: 590, height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardContent >
                        <Typography color={theme.palette.info.main} variant="h5" gutterBottom>
                            Click on a Restaurant to see Details
                        </Typography>
                    </CardContent>
                </Card>
            )
        }
        
    };

    const FavouriteRestaurants = () => {
        const FavouritedRestaurantCard = ({ restaurant } : {restaurant: Restaurant}) => {

            const handlePinClick = (restaurant: Restaurant) => {
                setActiveMarker(restaurant)
                setCenter({lat: restaurant.location.lat, lng: restaurant.location.lng})
                setTabValue(0)
            }

            return (
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={10}>
                                <Typography variant="h6" fontWeight='bold'>
                                    {truncateString(restaurant.displayName, 30)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center'  }}>
                                    <Typography variant='body2' gutterBottom>
                                        {restaurantText.rating}&nbsp;
                                    </Typography>
                                    <Rating name="read-only" value={restaurant.rating} readOnly />
                                    <Typography variant='caption' gutterBottom>
                                        {restaurant.userRatingCount}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Box sx={{display: 'flex', justifyContent:'center', alignItems: 'center', height: '100%'}}>
                                <Button variant='contained' data-testid={'restaurant-pin-button'} onClick={() => handlePinClick(restaurant)} sx={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } }
                                }}>
                                    <PinDropIcon />
                                </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card sx={{minWidth: 580, minHeight: 590}}>
                <CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                        <Typography variant="h5" gutterBottom>
                            {restaurantText.yourFavouriteRestaurants}
                        </Typography>
                    </Box>
                    {favouritedRestaurants && favouritedRestaurants.length > 0 && (
                        <Box sx={{padding: 2, height: 490, overflowY: 'auto'}}>
                            {favouritedRestaurants.map((restaurant: Restaurant, index) => (
                                <Box data-testid={`favourited-restaurant-${index}`} key={`${restaurant.id} FB`} sx={{ padding: 1 }}>
                                    <FavouritedRestaurantCard key={`${restaurant.id} FC`} restaurant={restaurant}/>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {favouritedRestaurants && favouritedRestaurants.length === 0 && (
                        <Box sx={{padding: 2, }}>
                            <Typography variant="body2">No Favourited Restaurants Yet!</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        )
    }

    const CustomTabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                {children}
              </Box>
            )}
          </div>
        );
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    const a11yProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    if (userLocation !== null && userLoaded === true) {
        return (
            <Box sx={{padding: 2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} minWidth={580}>
                        <Box sx={{padding: 2}}>
                            <Typography
                                sx={{
                                display: 'block',
                                fontWeight: 'bold',
                                }}
                                variant="h5"
                                color="text.primary"
                            >
                                Restaurants Near You
                            </Typography>
                        </Box>
                        <RestaurantMap
                            userLocation={userLocation}
                            setActiveMarker={setActiveMarker}
                            setAlertMessage={setAlertMessage}
                            setAlertSeverity={setAlertSeverity}
                            setAlertOpen={setAlertOpen}
                            center={center}
                            setCenter={setCenter}
                            favourites={favouritedRestaurants}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{padding: 1}}>
                            <Box>
                                <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{style: {backgroundColor: theme.palette.primary.main}}} sx={{".Mui-selected": {color: theme.palette.primary.main},}}>
                                    <Tab data-testid='restaurant-info-button' label={restaurantText.restaurantInfo} {...a11yProps(0)} />
                                    <Tab data-testid='favourites-button' label={restaurantText.favourites} {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={tabValue} index={0}>
                                <RestaurantDetails />                            
                            </CustomTabPanel>
                            <CustomTabPanel value={tabValue} index={1}>
                                <FavouriteRestaurants />                            
                            </CustomTabPanel>
                        </Box>
                    </Grid>
                </Grid>
                <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen}/>
            </Box>
        );
    } else {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
                <CircularProgress />
            </Box>
        )
    }
};

export default Restaurants;
