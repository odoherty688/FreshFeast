import React, { useContext, useEffect, useState } from 'react';
import { AlertColor, Backdrop, Box, Button, Card, CircularProgress, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import UserContext from '../context/UserContext';
import { edamamAPIEndpoints } from '../api/edamamAPIEndpoints';
import axios from 'axios';
import RecipeList from '../components/Recipe/RecipeList';
import { useAuth0 } from '@auth0/auth0-react';
import theme from '../components/Theme';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckboxGroup from '../components/CheckboxGroup';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { allergyLabels, allergyValues, cuisineLabels, cuisineValues, dietLabels, dietValues, dishLabels, dishValues, mealLabels, mealValues, signupText } from '../text/signupText';
import AlertPopup from '../components/Alert';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface SavedFilter {
    email: string,
    filterName: string,
    diet: string[],
    allergies: string[],
    cuisineType: string,
    mealType: string,
    dishType: string
}

interface Filter {
    id: number,
    userId: number,
    filterName: string,
    diet: string[],
    allergies: string[],
    cuisineType: string,
    mealType: string,
    dishType: string
}

const Search = () => {
    const { getAccessTokenSilently, user } = useAuth0();
    const userContext = useContext(UserContext);
    const [accessToken, setAccessToken] = useState<string>("")
    const [searchValue, setSearchValue] = useState<string>("");
    const [recipes, setRecipes] = useState<any[]>([]);
    const [recipeIds, setRecipeIds] = useState<string[]>([])
    const [loaded, setLoaded] = useState<boolean>(false)
    const [searching, setSearching] = useState<boolean>(false)
    const [errorSearchValue, setErrorSearchValue] = useState<string>("")
    const [filterBackdropOpen, setFilterBackdropOpen] = useState<boolean>(false)
    const [saveFilterBackdropOpen, setSaveFilterBackdropOpen] = useState<boolean>(false)
    const [viewFiltersBackdropOpen, setViewFiltersBackdropOpen] = useState<boolean>(false)
    const [selectedDiets, setSelectedDiets] = useState<Array<string>>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<Array<string>>([]);
    const [userDiets, setUserDiets] = useState<Array<string>>([]);
    const [userAllergies, setUserAllergies] = useState<Array<string>>([]);
    const [cuisineFilter, setCuisineFilter] = useState<string>("");
    const [mealFilter, setMealFilter] = useState<string>("");
    const [dishFilter, setDishFilter] = useState<string>("");
    const [filterApplied, setFilterApplied] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [tempCuisineFilter, setTempCuisineFilter] = useState<string>('')
    const [tempMealFilter, setTempMealFilter] = useState<string>('')
    const [tempDishFilter, setTempDishFilter] = useState<string>('')
    const [userSearchFilters, setUserSearchFilters] = useState<Filter[]>([]);

    useEffect(() => {
        const fetchAccessToken = async () => {
          try {
            const accessToken = await getAccessTokenSilently();
            setAccessToken(accessToken)
    
          } catch (error) {
            console.error(error);
          }
        };
        
        fetchAccessToken();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        if (userContext && userContext.activeUser) {
            const activeUser = userContext.activeUser;
            setSelectedAllergies(activeUser.allergies)
            setSelectedDiets(activeUser.diet);
            setUserDiets(activeUser.diet)
            setUserAllergies(activeUser.allergies)
        }
    }, [user, userContext])

    useEffect(() => {
        getUserSearchFilters();
    }, [])

    const getUserSearchFilters = async () => {
        try {
            if (user && user.email) {
                const accessToken = await getAccessTokenSilently();
                const userEmail = user.email
        
                const result = await axios.get(`http://localhost:8000/api/searchFilters/getUserSearchFilters/${encodeURIComponent(userEmail)}`, {
                    headers: {
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    },
                });

                console.log('result', result)

                if (result.data.error === false) {
                    if (result.data.data !== null) {
                        setUserSearchFilters(result.data.data)
                    }
                } else {
                    setAlertOpen(true);
                    setAlertMessage('Could not get Saved Filters');
                    setAlertSeverity('error');
                }
            } else {
                setAlertOpen(true);
                setAlertMessage('Could not get Saved Filters');
                setAlertSeverity('error');
            }

        } catch (error) {
            console.error(error);
            setAlertOpen(true);
            setAlertMessage('Could not get Saved Filters');
            setAlertSeverity('error');
        }
    }

    const handleSubmit = () => {
        setErrorSearchValue(searchValue)
        setRecipeIds([])
        setRecipes([])
        setLoaded(false)
        setSearching(true)
        fetchRecipeInfo()
    }

    const fetchRecipeInfo = async () => {
        try {
            if (userContext !== null) {
                let activeUser = userContext.activeUser;
                let diets = activeUser.diet;
                let allergies = activeUser.allergies;
                let allergiesString = '';
                let dietString = '';
                let cuisineString = '';
                let mealString = '';
                let dishString = '';
                const searchValueWithoutSpaces = searchValue.replace(/ /g, "%20");

                if (filterApplied === true) {
                    diets = selectedDiets
                    allergies = selectedAllergies
                }
  
                diets.forEach((setting) => {
                    if (setting === "high-fiber" || setting === "high-protein" || setting === "low-carb" || setting === "low-fat" || setting === "low-sodium" ) {
                        dietString = dietString + `&diet=${setting}`
                    } else if (setting !== "balanced") {
                        allergiesString = allergiesString + `&health=${setting}`
                    }
                });
  
                allergies.forEach((setting) => {
                    if (setting === "high-fiber" || setting === "high-protein" || setting === "low-carb" || setting === "low-fat" || setting === "low-sodium" ) {
                        dietString = dietString + `&diet=${setting}`
                      } else if (setting !== "balanced") {
                        allergiesString = allergiesString + `&health=${setting}`
                    }
                });

                if (cuisineFilter !== "") {
                    cuisineString = `&cuisineType=${cuisineFilter}`
                }

                if (mealFilter !== "") {
                    mealString = `&mealType=${mealFilter}`
                }

                if (dishFilter !== "") {
                    dishString = `&dishType=${dishFilter}`
                }
  
                const url = edamamAPIEndpoints.baseUrl + edamamAPIEndpoints.edamamParameters + dietString + allergiesString + cuisineString + mealString + dishString + `&q=${searchValueWithoutSpaces}`;
  
                const response = await axios.get(`${url}`)
                
                response.data.hits.forEach((hit: any) => {
                  const recipe = hit.recipe
                  setRecipes((prevRecipes: any) => [...prevRecipes, recipe]);
  
                  const recipeUrl = recipe.uri
                  const match = recipeUrl.match(/_(\w+)$/);
    
                  if (match && match[1]) {
                    const extractedId = match[1];
                    setRecipeIds((prevRecipeIds) => [...prevRecipeIds, extractedId]);
                  } else {
                    setAlertOpen(true);
                    setAlertMessage('Could not retrieve search results');
                    setAlertSeverity('error');
                  }
                });

                setSearching(false)
                setLoaded(true)
              }
        } catch (err) {
            setAlertOpen(true);
            setAlertMessage('Could not retrieve search results');
            setAlertSeverity('error');
        }
    
    }

    const RecipeLoader = () => {
        if (loaded === false && searching === true) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
                    <CircularProgress />
                </Box>
            )
        } else if (loaded === true && searching === false && recipes.length !== 0) {
            return (
                <RecipeList recipes={recipes} recipeIds={recipeIds} favouritesList={false} accessToken={accessToken} alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity}/>
            )
        } else if (recipes.length === 0 && loaded === true) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
                    <Typography variant='h6'>No results found for the search:</Typography>
                    <Typography variant='h6'>"{errorSearchValue}"</Typography>
                </Box>
            )
        } else {
            
            return (
                <></>
            )
        }
    }

    const FilterBackdrop = () => {
        const handleCuisineChange = (value: string) => {
            setTempCuisineFilter(value)
        }

        const handleMealChange = (value: string) => {
            setTempMealFilter(value)
        }

        const handleDishChange = (value: string) => {
            setTempDishFilter(value)
        }

        const applyFilters = () => {
            setFilterApplied(true)
            setCuisineFilter(tempCuisineFilter)
            setMealFilter(tempMealFilter)
            setDishFilter(tempDishFilter)
            setFilterBackdropOpen(false);
        }

        const ViewFilterBackdrop = () => {
            const SearchFilter = ({ filter, index }: { filter: Filter, index: number }) => {
                return (
                    <Card sx={{ padding: 2 }}>
                        <Box data-testid={`filter-${index}`} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant='body2' sx={{ fontWeight: 'bold', paddingLeft: 2 }}>{filter.filterName}</Typography>
                            <Box>
                                <Button sx={{ color: theme.palette.secondary.main }} data-testid={`apply-filter-button-${index}`} onClick={() => { applyFliters(filter) }}>
                                    Apply
                                </Button>
                                <Button sx={{ color: theme.palette.secondary.main }}data-testid={`delete-filter-button-${index}`} onClick={() => { deleteFilter(filter) }}>
                                    <DeleteRoundedIcon />
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                );
            };

            const applyFliters = (filter: Filter) => {
                setSelectedDiets(filter.diet)
                setSelectedAllergies(filter.allergies)
                setTempCuisineFilter(filter.cuisineType)
                setTempMealFilter(filter.mealType)
                setTempDishFilter(filter.dishType)
                setViewFiltersBackdropOpen(false)
                setFilterBackdropOpen(false)
            }

            const deleteFilter = async (filter: Filter) => {
                try {
                    if (user && user.email) {
                      let userEmail = user.email
  
                      let data = {
                        email: userEmail,
                        filterId: filter.id
                      }

                      const result = await axios.delete(`http://localhost:8000/api/searchFilters/deleteUserSearchFilter`, {
                          headers: {
                          "Authorization": `bearer ${accessToken}`,
                          "Access-Control-Allow-Origin": "*",
                          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                          },
                          data: data
                      });
  
                      if (result.data.error === false) {
                        setUserSearchFilters(prevFilters => prevFilters.filter(prevFilter => prevFilter.id !== filter.id));
                      } else if (result.data.error === true) {
                          setAlertOpen(true);
                          setAlertMessage(result.data.message);
                          setAlertSeverity('error');
                      }
  
                      setSaveFilterBackdropOpen(false)
                    }
                  } catch (error) {
                      console.error(error);
                      setAlertOpen(true);
                      setAlertMessage('Unexpected error occured');
                      setAlertSeverity('error');
                  }
            }

            return (
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, padding: 3 }}
                open={viewFiltersBackdropOpen}
                >
                    <Card sx={{ padding: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: 800, height: 500, minWidth: 800, minHeight: 500}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                            <Typography variant='body1' sx={{ fontWeight: 'bold', paddingLeft: 2 }}>View Filters</Typography>
                            <Button sx={{color: theme.palette.secondary.main }} onClick={() => setViewFiltersBackdropOpen(false)}>
                                <CloseOutlinedIcon />
                            </Button>
                        </Box>
                        <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', flex: '0 0 auto', overflowY:'auto', alignItems: 'stretch', height: 400}}>
                                {userSearchFilters !== null && userSearchFilters.length > 0 ? ( 
                                    <>
                                        {userSearchFilters.map((filter: Filter, index: number) => (
                                        <Box key={filter.id} sx={{padding: 1}}>
                                            <SearchFilter filter={filter} index={index}/>
                                        </Box>
                                        ))}
                                    </>
                                ) : (
                                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 3}}>
                                        <Typography variant='body1'>No filters found</Typography>
                                    </Box>
                                )}
                        </Box>
                    </Card>
                </Backdrop>
            )
        }

        const SaveFilterBackdrop = () => {
            const [filterName, setFilterName] = useState<string>("");
    
            const saveFilter = async () => {
                try {
                  if (user && user.email) {
                    const userEmail = user.email
    
                    let filter: SavedFilter = {
                        email: userEmail,
                        filterName: filterName,
                        diet: selectedDiets,
                        allergies: selectedAllergies,
                        cuisineType: tempCuisineFilter,
                        mealType: tempMealFilter,
                        dishType: tempDishFilter
                    }

                    let filterTemp: Filter = {
                        id: 999 - userSearchFilters.length,
                        userId: 1,
                        filterName: filterName,
                        diet: selectedDiets,
                        allergies: selectedAllergies,
                        cuisineType: tempCuisineFilter,
                        mealType: tempMealFilter,
                        dishType: tempDishFilter
                    }
            
                    const result = await axios.post(`http://localhost:8000/api/searchFilters/addFilter`, filter, {
                        headers: {
                        "Authorization": `bearer ${accessToken}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                        },
                    });

                    if (result.data.error === false) {
                        console.log("result", result)
                        setUserSearchFilters((prevFilters) => [...prevFilters, filterTemp])
                        setAlertOpen(true);
                        setAlertMessage(result.data.message);
                        setAlertSeverity('success');
                    } else if (result.data.error === true) {
                        console.log("result", result)
                        setAlertOpen(true);
                        setAlertMessage('Could not save filter');
                        setAlertSeverity('error');
                    }

                    setSaveFilterBackdropOpen(false)
                  }
                } catch (error) {
                    console.error(error);
                    setAlertOpen(true);
                    setAlertMessage('Unexpected error occured');
                    setAlertSeverity('error');
                }
            }
    
            return (
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, padding: 3 }}
                open={saveFilterBackdropOpen}
                >
                    <Card sx={{ padding: 1, display: 'flex', flexDirection: 'column', flex: '0 0 auto', overflowY:'auto', alignItems: 'stretch', width: 800, height: 200, minWidth: 800, minHeight: 200}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                            <Typography variant='body1' sx={{ fontWeight: 'bold', paddingLeft: 2 }}>Save Filter</Typography>
                            <Button sx={{color: theme.palette.secondary.main }} onClick={() => setSaveFilterBackdropOpen(false)}>
                                <CloseOutlinedIcon />
                            </Button>
                        </Box>
                        <Box sx={{ padding: 2 }}>
                            <TextField 
                                fullWidth 
                                variant="outlined" 
                                inputProps={{ "data-testid": "filter-name-content-input"}}
                                label="Filter Name" 
                                required
                                onChange={(filterValue) => setFilterName(filterValue.target.value)} 
                                value={filterName} 
                            />
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button sx={{
                                backgroundColor: theme.palette.secondary.main,
                                color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } },
                                marginRight: 2
                            }}
                            data-testid='save-filter-button'
                            variant="contained"
                            disabled={filterName === ""}
                            onClick={() => saveFilter()}>
                                Save Filter
                            </Button>
                        </Box>
                    </Card>
                </Backdrop>
            )
        };
      

        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, padding: 3 }}
                open={filterBackdropOpen}
            >
                <Card sx={{ padding: 1, display: 'flex', flexDirection: 'column', flex: '0 0 auto', overflowY:'auto', alignItems: 'stretch', width: 1300, height: 720, minWidth: 1300, minHeight: 720}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold', paddingLeft: 2 }}>Edit Preferences</Typography>
                        <Button sx={{color: theme.palette.secondary.main }} onClick={() => setFilterBackdropOpen(false)}>
                            <CloseOutlinedIcon />
                        </Button>
                    </Box>
                    <Box sx={{ padding: 2 }}>
                    <Grid container spacing={2} columns={{ xs: 6, md: 12 }}>
                        <Grid item key={0} xs={8} md={8}>
                            <CheckboxGroup title={signupText.diet} bio={signupText.dietBio} labels={dietLabels} values={dietValues} selectedLabels={selectedDiets} setSelectedLabels={setSelectedDiets} xs={2} md={2}/>
                            <Box sx={{paddingTop: 1}}>
                                <CheckboxGroup title={signupText.allergies} bio={signupText.allergiesBio} labels={allergyLabels} values={allergyValues} selectedLabels={selectedAllergies} setSelectedLabels={setSelectedAllergies} xs={2} md={2}/>
                            </Box>
                        </Grid>
                        <Grid item key={1} xs={4} md={4}>
                            <Box sx={{width: '100%', paddingBottom: 2}}>
                                <Typography variant="h6" sx={{paddingBottom: 1, fontWeight: 'bold'}}>Cuisine Type</Typography>
                                <Select
                                    data-testid='cuisine-select'
                                    displayEmpty
                                    value={tempCuisineFilter}
                                    onChange={(option) => handleCuisineChange(option.target.value)}
                                    sx={{width: '100%'}}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {cuisineLabels.map((label, index) => (
                                        <MenuItem
                                        data-testid={`cuisine-select-${index}`}
                                        key={label}
                                        value={cuisineValues[index]}
                                        >
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{width: '100%', paddingBottom: 2}}>
                                <Typography variant="h6" sx={{paddingBottom: 1, fontWeight: 'bold'}}>Meal Type</Typography>
                                <Select
                                    data-testid='meal-type-select'
                                    displayEmpty
                                    value={tempMealFilter}
                                    onChange={(option) => handleMealChange(option.target.value)}
                                    sx={{width: '100%'}}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {mealLabels.map((label, index) => (
                                        <MenuItem
                                        data-testid={`meal-type-select-${index}`}
                                        key={label}
                                        value={mealValues[index]}
                                        >
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{width: '100%', paddingBottom: 2}}>
                                <Typography variant="h6" sx={{paddingBottom: 1, fontWeight: 'bold'}}>Dish</Typography>
                                <Select
                                    data-testid='dish-type-select'
                                    displayEmpty
                                    value={tempDishFilter}
                                    onChange={(option) => handleDishChange(option.target.value)}
                                    sx={{width: '100%'}}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {dishLabels.map((label, index) => (
                                        <MenuItem
                                        data-testid={`dish-type-select-${index}`}
                                        key={label}
                                        value={dishValues[index]}
                                        >
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Grid>
                    </Grid>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 1 }}>
                        <Button
                            variant="contained"
                            endIcon={<ArrowUpwardIcon />}
                            sx={{
                                backgroundColor: theme.palette.secondary.main,
                                color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } },
                                marginRight: 2 
                            }}
                            onClick={() => { applyFilters() }}
                        >
                            Apply Filters
                        </Button>
                        <Button
                            variant="contained"
                            data-testid='save-filter-backdrop-button'
                            endIcon={<SaveOutlinedIcon />}
                            sx={{
                                backgroundColor: theme.palette.secondary.main,
                                color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } }
                            }}
                            onClick={() => { setSaveFilterBackdropOpen(true) }}
                        >
                            Save Filter
                        </Button>
                        <Box sx={{paddingLeft: 2}}>
                            <Button
                                variant="contained"
                                data-testid='view-filter-backdrop-button'
                                endIcon={<SearchRoundedIcon />}
                                sx={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } }
                                }}
                                onClick={() => { setViewFiltersBackdropOpen(true) }}
                            >
                                View Saved Filters 
                            </Button>  
                        </Box>

                    </Box>
                    <SaveFilterBackdrop />
                    <ViewFilterBackdrop />
                </Card>
            </Backdrop>
        )
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ paddingLeft: 10, paddingRight: 10 }}>
                <Typography variant="h5">Search for New Recipes:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <Box sx={{ flex: '1' }}>
                        <TextField 
                            fullWidth 
                            id="outlined-basic" 
                            data-testid='search-bar'
                            variant="outlined" 
                            label="Search" 
                            onChange={(searchValue) => setSearchValue(searchValue.target.value)} 
                            value={searchValue} 
                            onSubmit={() => handleSubmit()}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleSubmit()
                                }
                            }}
                            inputProps={{ "data-testid": "content-input"}}
                            InputProps={{
                                endAdornment: (
                                    <IconButton type="button" id='search-button' sx={{ p: '10px' }} aria-label="search" data-testid='search-button' onClick={handleSubmit}>
                                        <SearchRoundedIcon />
                                    </IconButton>
                                ),
                            }} />
                    </Box>
                    <Button 
                        variant="contained" 
                        data-testid='manage-filters-button'
                        sx={{ 
                            backgroundColor: theme.palette.secondary.main, 
                            color: { "&:hover": { backgroundColor: theme.palette.secondary.dark } },
                            marginLeft: 2
                        }} 
                        onClick={() => setFilterBackdropOpen(true)}
                    >
                        Manage Filters
                    </Button>
                </Box>
            </Box>
            <Box sx={{ paddingTop: 2, paddingLeft: 10, paddingRight: 10 }}>
                <RecipeLoader />
            </Box>
            <FilterBackdrop />
            <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen}/>
        </Box>
    )
}

export default Search;