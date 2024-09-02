import { Builder, By, WebDriver, Key, until } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('SearchUI', () => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        driver.manage().window().maximize();
        jest.setTimeout(60000);
    });

    afterAll(async () => {
        await driver.quit();
    });

    afterEach(async () => {
        await driver.navigate().refresh();
    });

    it('should render the favourites page', async () => {
        await driver.get('http://localhost:3000/login');
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        
        const emailField = await driver.findElement(By.id('username'));
              
        await emailField.sendKeys('UIExampleTest21@gmail.com');
        
        const passwordField = await driver.findElement(By.id('password'));
    
        await passwordField.sendKeys('Password1234!!!');
    
        await driver.findElement(By.xpath("//button[contains(text(), 'Continue')]")).click();
        
        const currentUrl = await driver.getCurrentUrl();
            
        console.log(currentUrl)
            
        await driver.findElement(By.xpath("//div[contains(text(), 'Redirecting')]"));

        // Wait for 2 seconds
        await driver.sleep(2000);

        await driver.get('http://localhost:3000/search')

        await driver.sleep(2000);

        await driver.findElement(By.xpath("//h5[contains(text(), 'Search for New Recipes:')]"))    
    })

    it('should be able to type into the search bar', async () => {
        await driver.sleep(2000);

        const searchBar = await driver.findElement(By.css('[data-testid="content-input"]'));

        await searchBar.sendKeys('Chicken');

        const valueAttributeSearchBar = await searchBar.getAttribute('value');

        const isValueContained = valueAttributeSearchBar.includes('Chicken');

        expect(isValueContained).toBe(true);
    })

    it('should retrieve searches when search button is clicked', async () => {
        await driver.sleep(2000);

        const searchBar = await driver.findElement(By.css('[data-testid="content-input"]'));

        await searchBar.sendKeys('Chicken');

        await searchBar.sendKeys(Key.ENTER)

        await driver.sleep(2000);

        const recipe = await driver.findElement(By.css('[data-testid="recipe-list-0"]'));

        expect(await recipe.isDisplayed()).toBeTruthy();
    })

    it('should bring the user to the recipe page when a recipe is clicked', async () => {
        await driver.sleep(2000);

        const searchBar = await driver.findElement(By.css('[data-testid="content-input"]'));

        await searchBar.sendKeys('Chicken');

        await searchBar.sendKeys(Key.ENTER)

        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="recipe-list-0"]')).click();

        const currentUrl = await driver.getCurrentUrl();
        
        const currentBaseUrl = currentUrl.split('=')[0];
        const expectedBaseUrl = "http://localhost:3000/recipe?recipeId";
        
        expect(currentBaseUrl).toEqual(expectedBaseUrl);

        await driver.get('http://localhost:3000/search');

    })

    it('should open the manage filters bacldrop when clicked', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        await driver.findElement(By.xpath("//p[contains(text(), 'Please Select Your Dietary Requirements:')]"))   
        await driver.findElement(By.xpath("//p[contains(text(), 'Please Select Your Allergies:')]")) 
        
        await driver.findElement(By.css('[data-testid="cuisine-select"]'));
        await driver.findElement(By.css('[data-testid="meal-type-select"]'));
        await driver.findElement(By.css('[data-testid="dish-type-select"]'));

    })

    it('should allow the checkboxes to be clicked', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).click();
        await driver.findElement(By.css('span[data-testid="Dairy-checkbox"]')).click();

        const classAttributePaleo = await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).getAttribute('class');
        const classAttributeDairy = await driver.findElement(By.css('span[data-testid="Dairy-checkbox"]')).getAttribute('class');

        const isMuiCheckedDairy = classAttributeDairy.includes('Mui-checked');
        const isMuiCheckeePaleo = classAttributePaleo.includes('Mui-checked');

        expect(isMuiCheckeePaleo).toBe(true);
        expect(isMuiCheckedDairy).toBe(true);

    })

    it('should allow the user to select a cuisine', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        await driver.findElement(By.css('[data-testid="cuisine-select"]')).click();

        await driver.findElement(By.css('[data-testid="cuisine-select-1"]')).click();
    
        await driver.findElement(By.xpath("//div[contains(text(), 'American')]"))   
    })

    it('should allow the user to select a meal type', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        await driver.findElement(By.css('[data-testid="meal-type-select"]')).click();

        await driver.findElement(By.css('[data-testid="meal-type-select-1"]')).click();
    
        await driver.findElement(By.xpath("//div[contains(text(), 'Breakfast')]"))   
    })

    it('should allow the user to select a dish type', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        await driver.findElement(By.css('[data-testid="dish-type-select"]')).click();

        await driver.findElement(By.css('[data-testid="dish-type-select-1"]')).click();
    
        await driver.findElement(By.xpath("//div[contains(text(), 'Biscuits/Cookies')]"))   
    })

    it('should allow the user to type in the save filter bar', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();
    
        const saveFilterButton = await driver.findElement(By.css('[data-testid="save-filter-backdrop-button"]'));

        await saveFilterButton.click()

        await driver.findElement(By.css('[data-testid="filter-name-content-input"]'));

        const filterNameInput = await driver.findElement(By.css('[data-testid="filter-name-content-input"]'));

        await filterNameInput.sendKeys('Filter 1');

        const valueAttributeFilterNameInput = await filterNameInput.getAttribute('value');

        const isValueContained = valueAttributeFilterNameInput.includes('Filter 1');

        expect(isValueContained).toBe(true);
    })

    it('should set save filter button to inactive when no value is contained', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();
    
        const saveFilterBackdropButton = await driver.findElement(By.css('[data-testid="save-filter-backdrop-button"]'));

        await saveFilterBackdropButton.click()

        const saveFilterButton = driver.findElement(By.css('[data-testid="save-filter-button"]'));

        const isEnabled = await saveFilterButton.isEnabled();
        expect(isEnabled).toBe(false)
    })

    it('should allow the user to save a filter', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).click();

        await driver.findElement(By.css('[data-testid="dish-type-select"]')).click();

        await driver.findElement(By.css('[data-testid="dish-type-select-1"]')).click();
    
        const saveFilterBackdropButton = await driver.findElement(By.css('[data-testid="save-filter-backdrop-button"]'));

        await saveFilterBackdropButton.click()

        await driver.findElement(By.css('[data-testid="filter-name-content-input"]'));

        const filterNameInput = await driver.findElement(By.css('[data-testid="filter-name-content-input"]'));

        await filterNameInput.sendKeys('Filter 1');

        await driver.sleep(500);

        const saveFilterButton = driver.findElement(By.css('[data-testid="save-filter-button"]'));
        
        await saveFilterButton.click();
    })

    it('should display the user saved filters', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        const viewFiltersBackdropButton = await driver.findElement(By.css('[data-testid="view-filter-backdrop-button"]'));

        await viewFiltersBackdropButton.click()

        await driver.findElement(By.css('[data-testid="filter-0"]'));
    })

    it('should apply user saved filter when clicked', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        const viewFiltersBackdropButton = await driver.findElement(By.css('[data-testid="view-filter-backdrop-button"]'));

        await viewFiltersBackdropButton.click()

        const applyFilterButton = await driver.findElement(By.css('[data-testid="apply-filter-button-0"]'));
    
        await applyFilterButton.click()
    })

    it('should delete user saved filter when clicked', async () => {
        await driver.sleep(2000);

        const manageFiltersButton = await driver.findElement(By.css('[data-testid="manage-filters-button"]'));

        await manageFiltersButton.click();

        const viewFiltersBackdropButton = await driver.findElement(By.css('[data-testid="view-filter-backdrop-button"]'));

        await viewFiltersBackdropButton.click()

        const deleteFilterButton = await driver.findElement(By.css('[data-testid="delete-filter-button-0"]'));
    
        await deleteFilterButton.click()
    })
});