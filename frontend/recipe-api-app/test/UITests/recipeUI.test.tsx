import { Builder, By, WebDriver, Key, until } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('RecipeUI', () => {
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

    it('should render the recipe page', async () => {
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

        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="rotd-recipe"]')).click();

        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="recipe-image"]'));           
    })

    it('should render the ingredients of the recipe', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="ingredients-card"]'));     
        await driver.findElement(By.css('[data-testid="ingredient-0"]'));                 
    })

    it('should render the recipe information', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="recipe-information-card"]'));     
    })

    it('should render the co2 card', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="co2-card"]'));     
    })

    it('should change the complete button to an incomplete button when clicked', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="complete-button"]')).click();   
        
        await driver.findElement(By.css('[data-testid="incomplete-button"]'))
    })

    it('should render the incomplete button on refresh', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="incomplete-button"]')).click();     

        await driver.findElement(By.css('[data-testid="complete-button"]'));   
    })

    it('should change the favourite button to unfilled when clicked', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="favourite-button"]')).click();

        await driver.findElement(By.css('[data-testid="FavoriteBorderOutlinedIcon"]'));
    })

    it('should change the favourite button to filled when clicked', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="favourite-button"]')).click();

        await driver.findElement(By.css('[data-testid="FavoriteOutlinedIcon"]'));
    })
});