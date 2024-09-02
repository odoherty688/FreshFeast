import { Builder, By, WebDriver, Key, until } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('FavouritesUI', () => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        driver.manage().window().maximize();
        jest.setTimeout(60000);
    });

    afterAll(async () => {
        await driver.get('http://localhost:3000/');

        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="rotd-recipe"]')).click();

        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="favourite-button"]')).click();
        
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

        await driver.get('http://localhost:3000/favourites')

        await driver.findElement(By.xpath("//h5[contains(text(), 'Your Favourites:')]"))    
    })

    it('should render users favourites', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('[data-testid="recipe-list-0"]'));
        await driver.findElement(By.css('[data-testid="favourite-button-0"]'));
    })

    it('should remove favourite when user clicks favourite button', async () => {
        await driver.sleep(2000);

        const favouriteButton = await driver.findElement(By.css('[data-testid="favourite-button-0"]'));

        await favouriteButton.click();

        await driver.findElement(By.css('[data-testid="FavoriteBorderIcon"]'));
    })

    it('should display message showing no favourited recipes when no recipes are available', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.xpath("//h6[contains(text(), 'You currently have no favourited recipes!')]")).click();
    })
})