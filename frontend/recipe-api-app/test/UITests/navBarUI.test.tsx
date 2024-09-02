import { Builder, By, WebDriver, Key, until } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('NavigationBarUI', () => {
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

    it('should render the navigation bar', async () => {
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

    it('should open the drawer when the drawer button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click()

        await driver.findElement(By.css('[data-testid="user-information-button"]'));
        await driver.findElement(By.css('[data-testid="home-button"]'));
        await driver.findElement(By.css('[data-testid="logout-button"]'));
    })

    it('should navigate to the user information page when the button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const userInformationButton = await driver.findElement(By.css('[data-testid="user-information-button"]'));

        await userInformationButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/user";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })

    it('should navigate to the home page when the button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const homeButton = await driver.findElement(By.css('[data-testid="home-button"]'));

        await homeButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })

    it('should navigate to the favourites page when the button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const favouritesButton = await driver.findElement(By.css('[data-testid="favourites-button"]'));

        await favouritesButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/favourites";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })

    it('should navigate to the search page when the button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const searchButton = await driver.findElement(By.css('[data-testid="search-button"]'));

        await searchButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/search";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })

    it('should navigate to the calendar page when the button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const calendarButton = await driver.findElement(By.css('[data-testid="calendar-button"]'));

        await calendarButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/calendar";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })

    it('should navigate to the restaurants page when the button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const restaurantsButton = await driver.findElement(By.css('[data-testid="restaurants-button"]'));

        await restaurantsButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/restaurants";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })

    it('should navigate to the login page when the logout button is clicked', async () => {
        await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));
        
        const navigationDrawerButton = await driver.findElement(By.css('[data-testid="navigation-drawer-button"]'));

        await navigationDrawerButton.click();

        const calendarButton = await driver.findElement(By.css('[data-testid="logout-button"]'));

        await calendarButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/login";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    })
});