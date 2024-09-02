export const edamamAPIEndpoints = {
    baseUrl: `https://api.edamam.com/api/recipes/v2`,
    edamamParameters: `?type=public&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}`
}