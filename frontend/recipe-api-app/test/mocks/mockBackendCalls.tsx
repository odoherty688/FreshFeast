export const mockGetUserCompletedRecipeCount = {
    data: {
        error: false,
        data: [
          '1',
          '2'
        ],
        message: 'Successfully retrieved completed recipe'
      }
}

export const mockGetUserNotCompletedRecipeCount = {
    data: {
        error: false,
        data: [
          '2'
        ],
        message: 'Successfully retrieved completed recipe'
      }
}

export const mockUpdateUserCompletedRecipeCount = {
    data: {
        error: false,
        data: null,
        message: 'Successfully updated recipe count'
      }
}

export const mockAddFilter = {
    data: {
        error: false,
        data: null,
        message: 'Successfully saved filter'
      }
}

export const mockGetUserSearchFilters = {
    data: {
        error: false,
        data: [
            {
                id: 0,
                userId: 1,
                filterName: 'Test Filter 1',
                diet: [
                    'vegan'
                ],
                allergies: [
                    'dairy-free',
                ],
                cuisineType: 'carribean',
                mealType: 'breakfast',
                dishType: 'drinks'
            }
        ],
        message: 'Successfully returned user search filters'
    }
}


export const mockBackendFail = {
    data: {
        error: true,
        data: [
            'Backend Error'
        ],
        message: 'Backend Error'
    }
}

export const mockGetUserInfo = {
    data: {
        userExists: true,
        userData: {
            id: 0,
            email: 'johndoe@me.com',
            picture: 'google.pic',
            diet: ['alcohol-free', 'pork-free'],
            allergies: [ 'egg-free' ],
            completedRecipeCount: 3
        }
    },
    status: 200
}

export const mockGetFavourtiedRecipes = {
    data: {
        error: false,
        data: [
            '1',
            '2'
        ],
        message: 'Successfully retrieved user completed recipes'
    }
}

export const mockGetNotFavouritedRecipe = {
    data: {
        error: false,
        data: [
            '2'
        ],
        message: 'Successfully retrieved user completed recipes'
    }
}


export const mockGetEvents = {
    data: {
      error: false,
      data: [
        {
          userId: 0,
          resourceId: 0,
          recipeId: 1,
          start: '2024-04-15 13:00:00',
          end: '2024-04-15 15:00:00',
        },
      ],
      message: 'Succcessfully retrived calendar events'
    }
  }

  export const mockGetFavouritedRestaurants = {
    data: {
        error: false,
        data: [
            "r1",
        ],
        message: 'Succcessfully retrieved favourite restaurants'
    }
  }

  export const mockGetNoFavouritedRestaurants = {
    data: {
        error: false,
        data: [],
        message: 'Succcessfully retrieved favourite restaurants'
    }
  }

  export const mockNoPlacesRestaurants = {
    data: {
        places: []
    },
    status: 200
  }

  export const mockPlacesFail = {
    data: {
    },
    status: 400
  }

  export const mockSavePreferences = {
    data: {
        
    },
    status: 200
  }

  export const mockSavePreferencesFail = {
    data: {
        
    },
    status: 400
  }

  export const mockPlacesRestaurants = {
    data: {
        places: [
            {
                id: 'r1',
                displayName: {
                    text: 'Restaurant Test 1'
                },
                formattedAddress: 'Address',
                location: {
                    latitude: 54.995801,
                    longitude: -7.307400
                },
                openingHours: {
                    currentOpeningHours: {
                        weekdayDescriptions: [
                            'day 1',
                            'day 2',
                            'day 3',
                            'day 4',
                            'day 5',
                            'day 6',
                            'day 7',
                        ]
                    }
                },
                rating: 4,
                userRatingCount: 100,
                photos: [
                    {
                        name: 'photo 1'
                    }
                ],
                takeout: true,
                internationalPhoneNumber: '+44 12345678901',
                dineIn: true,
                websiteUri: 'https://www.testrestaurant.com/'
            }
        ]
    },
    status: 200
  }

  export const mockPlacesRestaurant = {
    data: {
        id: 'r1',
        displayName: {
            text: 'Restaurant Test 1'
        },
        formattedAddress: 'Address',
        location: {
            latitude: 54.995801,
            longitude: -7.307400
        },
        openingHours: {
            currentOpeningHours: {
                weekdayDescriptions: [
                    'day 1',
                    'day 2',
                    'day 3',
                    'day 4',
                    'day 5',
                    'day 6',
                    'day 7',
                ]
            }
        },
        rating: 4,
        userRatingCount: 100,
        photos: [
            {
                name: 'photo 1'
            }
        ],
        takeout: true,
        internationalPhoneNumber: '+44 12345678901',
        dineIn: true,
        websiteUri: 'https://www.testrestaurant.com/'
    },
    status: 200
  }

  export const mockFetchRestaurant = {
    data: {

    },
    status: 200
  }
  
  export const mockNoEvents = {
    data: {
      error: false,
      data: [],
      message: 'Succcessfully retrived calendar events'
    }
  }

export const mockRecipeToFavourites = {
    data: {
        error: false,
        data: null,
        message: 'Successfully added recipe to favourites'
    }
}

export const mockRecipeToCompleted = {
    data: {
        error: false,
        data: null,
        message: 'Successfully added recipe to completed'
    }
}