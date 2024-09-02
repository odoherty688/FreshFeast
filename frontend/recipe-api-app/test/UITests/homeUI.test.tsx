import { Builder, By, WebDriver, Key, until } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('HomeUI', () => {
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

    it('should render the signup page', async () => {
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
    })

    it('should render the recommended recipe list', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.xpath('//h6[contains(text(), "Recipe Of The Day")]'));

        await driver.findElement(By.css('[data-testid="rotd-recipe"]'));
    })

    it('should render the each recommended recipe', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.xpath('//h5[contains(text(), "Recommended Recipes For You")]'));

        await driver.findElement(By.css('[data-testid="recipe-list-0"]'));
    })

    it('should render the user recipe count', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.xpath('//h6[contains(text(), "Number of Completed Recipes")]'));

        await driver.findElement(By.css('[data-testid="completed-recipe-count"]'));
    })

    it('should navigate to the recipe page whenever recipe of the day is clicked', async () => {
        await driver.sleep(2000);

        const recipeOfTheDayCard = await driver.findElement(By.css('[data-testid="rotd-recipe"]'));

        await recipeOfTheDayCard.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const currentBaseUrl = currentUrl.split('=')[0];
        const expectedBaseUrl = "http://localhost:3000/recipe?recipeId";
        
        expect(currentBaseUrl).toEqual(expectedBaseUrl);

        await driver.get('http://localhost:3000/');
    })

    
    it('should navigate to the recipe page whenever a recommended recipe is clicked', async () => {
        await driver.sleep(3000);

        const recommendedRecipe = await driver.findElement(By.css('[data-testid="recipe-list-0"]'));

        await recommendedRecipe.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const currentBaseUrl = currentUrl.split('=')[0];
        const expectedBaseUrl = "http://localhost:3000/recipe?recipeId";
        
        expect(currentBaseUrl).toEqual(expectedBaseUrl);
    })

})