import React, { Dispatch, Fragment, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Calendar, Views, DateLocalizer, EventPropGetter, stringOrDate } from 'react-big-calendar';
import withDragAndDrop, { DragFromOutsideItemArgs, EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { AlertColor, Backdrop, Box, Button, Card, CardMedia, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Typography, makeStyles } from '@mui/material';
import moment from 'moment';
import { edamamAPIEndpoints } from '../api/edamamAPIEndpoints';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import theme from './Theme';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useNavigate } from 'react-router-dom';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface EventItem {
    start?: Date | string;
    end?: Date | string;
    data?: { recipe?: any };
    isDraggable?: boolean;
    isResizable?: boolean;
    resourceId?: number;
};

interface EventToDatabase {
    start?: Date | string;
    end?: Date | string;
    userEmail?: string ;
    recipeId?: string;
    isDraggable?: boolean;
    isResizable?: boolean;
    resourceId?: number;
}

interface DnDOutsideResourceProps {
  localizer: DateLocalizer;
  alertOpen: boolean,
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertSeverity: Dispatch<SetStateAction<AlertColor>>;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
}

const DragAndDropCalendar = withDragAndDrop<EventItem>(Calendar);

const DnDCalendar: React.FC<DnDOutsideResourceProps> = ({ localizer, alertOpen, setAlertMessage, setAlertSeverity, setAlertOpen }) => {
  const {getAccessTokenSilently, user} = useAuth0()
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string>("")
  const [favouritedRecipeIds, setFavouritedRecipeIds] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any>();
  const [recipeIds, setRecipeIds] = useState<string[]>([])
  const [events, setEvents] = useState<EventItem[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<any | "undroppable">();
  const [loaded, setLoaded] = useState<boolean>(false)
  const [favouritesLoaded, setFavouritesLoaded] = useState<boolean>(false);
  const [totalIngredients, setTotalIngredients] = useState<string[]>([])
  const [ingredientsBackdropOpen, setIngredientsBackdropOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavouritedRecipes = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          setAccessToken(accessToken);

          if (user && user.email) {
            const userEmail = user.email
            console.log('userEmail: ', userEmail)
            console.log('TOKEN', accessToken)
  
            const result = await axios.get(`http://localhost:8000/api/recipes/getUserFavouritedRecipes/${encodeURIComponent(userEmail)}`, {
              headers: {
                "Authorization": `bearer ${accessToken}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
              },
            });

            console.log('fetchFavouritedRecipes', result)
  
            if (result.data.error === false) {
              setFavouritedRecipeIds(result.data.data);
            } else {
              setAlertOpen(true);
              setAlertMessage('Could not get favourite recipes');
              setAlertSeverity('error');
            }
          }
        } catch (error) {
          console.error(error);
          setAlertOpen(true);
          setAlertMessage('Could not get favourite recipes');
          setAlertSeverity('error');
        }
      };
    fetchFavouritedRecipes()
  }, []);

  const fetchRecipe = async (recipeId: string) => {
    try {
        const url = edamamAPIEndpoints.baseUrl + `/${recipeId}` + edamamAPIEndpoints.edamamParameters;
        const response = await axios.get(`${url}`);

        console.log('fetchRecipe', response)

        if (response.status === 200) {
          return response.data.recipe;
        } else {
          setAlertOpen(true);
          setAlertMessage('Could not get Recipes');
          setAlertSeverity('error');
        }
    } catch (err) {
        console.log(err);
        setAlertOpen(true);
        setAlertMessage('Could not get Recipes');
        setAlertSeverity('error');
        return null; // Return null if an error occurs
    }
  };


  useEffect(() => {
    const fetchData = async () => {
        try {
            const fetchedRecipes = await Promise.all(favouritedRecipeIds.map(async (recipeId: string) => {
                return await fetchRecipe(recipeId);
            }));

            const filteredRecipes = fetchedRecipes.filter(recipe => recipe !== null);

            const recipeIds = filteredRecipes.map(recipe => {
                const match = recipe.uri.match(/_(\w+)$/);
                return match && match[1];
            }).filter(id => id);

            setRecipeIds(recipeIds);
            setRecipes(filteredRecipes);
            setLoaded(true);
            setFavouritesLoaded(true);
        } catch (err) {
            console.log(err);
            setAlertOpen(true);
            setAlertMessage('Could not get Recipes');
            setAlertSeverity('error');
        }
    };

    fetchData();
  }, [favouritedRecipeIds]);

  useEffect(() => {
    const getEventsFromDatabase = async () => {
        try {
            if (user && user.email) {
                const accessTokenTemp = await getAccessTokenSilently();

                const response = await axios.get(`http://localhost:8000/api/calendar/getUserCalendarEvents/${encodeURIComponent(user.email)}`, {
                    headers: {
                    "Authorization": `bearer ${accessTokenTemp}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    }
                });

                console.log('getEventsFromDatabase', response)

                if (response.data.error === false) {
                    let tempEvents = response.data.data;
                    const fetchedEvents: EventItem[] = [];
    
                    for (let i = 0; i < tempEvents.length; i++) {
                        const event = tempEvents[i];
                        if (event.recipeId) {
                            let recipe = await fetchRecipe(event.recipeId);
                            if (recipe) {
                                let start = moment(event.start).toDate();
                                let end = moment(event.end).toDate();
                                let isDraggable = event.isDraggable === 1 ? true : false
                                let isResizable = event.isDraggable === 1 ? true : false

                                let tempEvent: EventItem = {
                                    start: start,
                                    end: end,
                                    resourceId: event.resourceId,
                                    data: { recipe: recipe },
                                    isDraggable: isDraggable,
                                    isResizable: isResizable
                                };
                                fetchedEvents.push(tempEvent);
                            }
                        }
                    }
                    setEvents(fetchedEvents);
                } else {
                    setAlertOpen(true);
                    setAlertMessage('Could not get events');
                    setAlertSeverity('error');
                }
            }
        } catch (err) {
          setAlertOpen(true);
          setAlertMessage('Could not get events');
          setAlertSeverity('error');
        }
    }

    getEventsFromDatabase();
  }, [])

  console.log('Events', events)

  useEffect(() => {
    const sendEventsToDataBase = async () => {
        try {
            if (user && user.email && favouritesLoaded) {
                let eventsToSend: EventToDatabase[] = [];
                events.forEach((event: EventItem) => {  
                    let extractedId = event?.data?.recipe.uri.match(/_(\w+)$/)[1]
    
                    let currentEvent: EventToDatabase = {
                        start: event.start,
                        end: event.end,
                        userEmail: user.email,
                        recipeId: extractedId,
                        isDraggable: event.isDraggable,
                        isResizable: event.isResizable,
                        resourceId: event.resourceId
                    }
    
                    eventsToSend.push(currentEvent);
                }) 

                const responseDelete = await axios.delete(`http://localhost:8000/api/calendar/deleteUserCalendarEvents/${encodeURIComponent(user.email)}`, {
                    headers: {
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    }
                });

                if (responseDelete.data.error === false) {
                    const response = await axios.post(`http://localhost:8000/api/calendar/addUserCalendarEvents`, eventsToSend, {
                        headers: {
                        "Authorization": `bearer ${accessToken}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                        }
                    });

                    console.log('sendEventsToDataBase', response)

                    if (response.data.error === true) {
                        setAlertOpen(true);
                        setAlertMessage('Could not add event');
                        setAlertSeverity('error');
                    }
                } else {
                    setAlertOpen(true);
                    setAlertMessage('Could not add event');
                    setAlertSeverity('error');
                }
            }
        } catch (err: any) {
            setAlertOpen(true);
            setAlertMessage('Could not add event');
            setAlertSeverity('error');
        }
    }

    if (events.length !== 0) {
        sendEventsToDataBase()
    }

  }, [events])

  useEffect(() => {
    const getStartOfWeek = () => {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Set to Sunday of the current week
      return startOfWeek;
    };
  
    const getEndOfWeek = () => {
      const today = new Date();
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Set to Saturday of the current week
      return endOfWeek;
    };
  
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();
  
    getIngredients(startOfWeek, endOfWeek);
  }, [events]);

  const onDroppedFromOutside = useCallback(
    ({
      start,
      resource,
    }: DragFromOutsideItemArgs) => {
      if (draggedEvent === "undroppable") return;
      const end = moment(start).add(3, 'hours').toDate(); // Set the end time to start + 3 hours
      setEvents((prevEvents: EventItem[]) => [
        ...prevEvents,
        {
          start,
          end,
          resourceId: prevEvents.length,
          data: { recipe: draggedEvent },
          isDraggable: true,
          isResizable: true,
        } as EventItem,
      ]);
    },
    [draggedEvent]
  );
  
  const onChangeEventTime = useCallback(
    (args: EventInteractionArgs<EventItem>) => {
      const { event, start } = args;
      const end = moment(start).add(3, 'hours').toDate(); // Set the end time to start + 3 hours
      setEvents((prevEvents: EventItem[]) =>
        prevEvents.map((prevEvent: EventItem) =>
          prevEvent?.resourceId === event?.resourceId
            ? { ...event, start, end }
            : prevEvent
        ) as EventItem[]
      );
    },
    []
  );
  

  const cropTitle = (title: string, maxLength: number): string => {
    if (title.length <= maxLength) {
      return title;
    } else {
      // Find the last space before maxLength
      const lastSpaceIndex = title.lastIndexOf(' ', maxLength);
      if (lastSpaceIndex !== -1) {
        // Crop the title and add '...'
        return title.substring(0, lastSpaceIndex) + '...';
      } else {
        // If there's no space, simply crop the title at maxLength and add '...'
        return title.substring(0, maxLength) + '...';
      }
    }
  };

  const RecipeEvent = ({
    recipe,
  }: {
    recipe: any;
  }) => {
    return (
        <Box p={0} height="100%" color="black" position="relative">
        <CardMedia
          component="img"
          height="200"
          image={recipe.images.SMALL.url}
          alt={recipe.label}
          title="Contemplative Reptile"
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent grey background
            padding: '8px', // Padding around the text
        }}
        >
          <Typography
            sx={{
              display: 'inline',
              fontWeight: 'bold',
              color: 'white', // White text color
            }}
            component="span"
            variant="body1"
            color="text.primary"
          >
            {cropTitle(recipe.label, 38)}
          </Typography>
        </Box>
      </Box>
    );
  }

  const currentDate = moment().startOf('day').format('YYYY-MM-DD');

  const eventStyleGetter = ({event, start, end, isSelected}: any) => {
    var backgroundColor = theme.palette.secondary.main;
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: '2px',
      opacity: 1,
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  }

  const calendarFormat = {
    eventTimeRangeFormat: () => {
        return ""
    }
  }

  const RecipeEventWidget = ({
    recipe,
    event
  }: {
    recipe: any;
    event: EventItem
  }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)

    const handleViewPage = () => {
        const match = recipe.uri.match(/_(\w+)$/);

        console.log('match url', match[1])

        navigate(`/recipe?recipeId=${match[1]}`)
    }

    const removeEventFromUserEvents = async () => {
      try {
        if(user && user.email) {
          const recipeId: string = recipe.uri.match(/_(\w+)$/);

          const data = {
            userEmail: user.email,
            recipeId: recipeId[1],
            start: event.start,
            end: event.end
          }

          console.log('event to delete:', data)
  
          const result = await axios.delete(`http://localhost:8000/api/calendar/deleteUserCalendarEvent`, {
            headers: {
            "Authorization": `bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
            data: data
          });
  
          console.log('removeRecentFromUserEvents', result)
  
          if (result.data.error === false) {
            console.log('removed')
          } else if (result.data.error === true) {
            if (alertOpen === false) {
              setAlertOpen(true);
              setAlertMessage('Could not delete event');
              setAlertSeverity('error');
            }
          }
        } 
      } catch (err) {
        console.error(err);
        if (alertOpen === false) {
          setAlertOpen(true);
          setAlertMessage('Could not delete event');
          setAlertSeverity('error');
        }
      }
    }

    const handleRemoveRecipe = (resourceIdToRemove: number|undefined) => {
        removeEventFromUserEvents()
        const updatedEvents = events.filter((event) => event.resourceId !== resourceIdToRemove);
        setEvents(updatedEvents);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
      <Box height="100%" color="black" position="relative" data-testid='event-widget'>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            borderRadius: '8px 8px 8px 8px', // Round the bottom corners
          }}
        >
          <Typography
            sx={{
              display: 'inline',
              fontWeight: 'bold',
              color: 'white', // White text color
            }}
            component="span"
            variant="body1"
            color="text.primary"
          >
            {cropTitle(recipe.label, 30)}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: 'white',
            zIndex: 1, // Ensure it's above other content
          }}
        >
          <IconButton
            color="inherit"
            onClick={handleClick}
            data-testid='event-edit-button'
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose} sx={{ width: 320, maxWidth: '100%' }} data-testid='event-menu'>
          <MenuList>
            <MenuItem onClick={handleViewPage} data-testid='event-view-button'>
            <ListItemIcon>
                <SearchRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Recipe Page</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleRemoveRecipe(event.resourceId)} data-testid='event-remove-button'>
            <ListItemIcon>
                <DeleteRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove From Calendar</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  };

  const IngredientsBackdrop = () => {

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, padding: 3 }}
            open={ingredientsBackdropOpen}
        >
            <Card sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: 500, height: 455, minWidth: 500, minHeight: 455, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>This Week's Ingredients:</Typography>
                    <Button sx={{color: theme.palette.secondary.main }} onClick={() => setIngredientsBackdropOpen(false)}>
                        <CloseOutlinedIcon />
                    </Button>
                </Box>
                { totalIngredients.length === 0 ? (
                    <Typography variant='body2'>Add recipes to your calendar to view ingredients!</Typography>
                    ) : (
                    <Card sx={{boxShadow:3, overflowY: 'auto'}}>
                      <ul>
                      {totalIngredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                      ))}
                      </ul>
                    </Card>
                  )
                }
            </Card>
        </Backdrop>
    )
  }

  const getIngredients = (startDate: Date, endDate: Date) => {
    const tempIngredients: string[] = []; 
    
    events.forEach((event: EventItem) => {
        const eventStart = moment(event.start);
        
        if (eventStart.isBetween(startDate, endDate, 'day', '[]')) {
            let ingredients = event.data?.recipe.ingredients;
            
            ingredients.forEach((ingredient: any) => {
                let food: string = ingredient.food.trim();
                
                food = food.replace(/\b\w/g, (char: string) => char.toUpperCase());
                
                if (!totalIngredients.includes(food)) {
                    tempIngredients.push(food);
                }
            });
        }
    });
    
    setTotalIngredients(prevIngredients => [...prevIngredients, ...tempIngredients]); // Add new ingredients to totalIngredients state
  }

  console.log('Total Ingredients: ', totalIngredients)

  const components: any = {
    event: ({ event }: any) => {
      const data = event?.data;
      if (data?.recipe)
        return <RecipeEventWidget data-testid='event-menu' recipe={data?.recipe} event={event} />;
      return null;
    },
  };
  
  const props = {
    components,
    localizer,
    defaultDate: currentDate
  };

  console.log(events)

  return (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 4 }}>
          <Typography
                sx={{
                display: 'block',
                fontWeight: 'bold',
                }}
                variant="h5"
                color="text.primary"
            >
                Your Weekly Calendar
            </Typography>
            <Button variant="contained" data-testid='ingredients-button' sx={{backgroundColor: theme.palette.secondary.main, color: {"&:hover": {backgroundColor: theme.palette.secondary.dark}}}} onClick={() => setIngredientsBackdropOpen(true)}>
                Weekly Ingredients
            </Button>
        </Box>
        <IngredientsBackdrop/>
        <Card sx={{ height: "100%", width: "100%", flexDirection: "row", display: "flex" }}>
        {/* Recipes Section */}
        <Box sx={{ flex: "0 0 auto", width: 300, overflowY: "auto" }}>
            <Box p={2}>
            <Typography
                sx={{
                display: 'block',
                fontWeight: 'bold',
                color: 'white', // White text color
                }}
                variant="body1"
                color="text.primary"
            >
                Your Favourite Recipes:
            </Typography>
            </Box>
            <Box style={{ maxHeight: 1000, overflowY: "auto" }} data-testid='favourites-list'>
              <Box
                gap={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 2,
                }}
              >
                {recipes && recipes.length > 0 ? (
                  recipes.map((recipe: any, index: number) => (
                    <Box
                      data-testid={`recipe-${index}`}
                      key={index}
                      onDragStart={() => setDraggedEvent(recipe)}
                      draggable
                      sx={{ minHeight: 200, minWidth: 200, height: 200, width: "100%", boxShadow: 2 }}
                    >
                      <RecipeEvent recipe={recipe} />
                    </Box>
                  ))
                ) : (
                  <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center', height: '100%'}}>
                    <Typography variant="body1">You currently have no favorites.</Typography>
                  </Box>
                )}
              </Box>
            </Box>
        </Box>
    
        {/* Calendar Section */}
        <Box sx={{ flex: "1 1 auto", overflowY: "auto" }} data-testid='calendar'>
            <div style={{ minHeight: 500 }}>
            <DragAndDropCalendar
                {...props}
                events={events}
                view='week'
                views={['week']}
                startAccessor='start'
                endAccessor='end'
                draggableAccessor={(event: EventItem) => !!event.isDraggable}
                resizableAccessor={() => false}
                onEventDrop={onChangeEventTime}
                onEventResize={onChangeEventTime}
                onView={() => {}}
                onDropFromOutside={onDroppedFromOutside}
                eventPropGetter={eventStyleGetter}
                formats={calendarFormat}
                onRangeChange={(range) => {
                if (Array.isArray(range)) {
                    const start = range[0];
                    const end = range[range.length - 1];
                    getIngredients(start, end);
                }
                }}
            />
            </div>
        </Box>
        </Card>
    </Box>
  );    
}

export default DnDCalendar