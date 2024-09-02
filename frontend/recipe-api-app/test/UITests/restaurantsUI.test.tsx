import { Builder, By, WebDriver, Key, until, Actions  } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';


describe('CalendarUI', () => {
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

    it('should render the calendar page', async () => {
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

        await driver.get('http://localhost:3000/restaurants')

        await driver.sleep(2000);

        await driver.findElement(By.xpath("//h5[contains(text(), 'Restaurants Near You')]"))    
    })

    it('should load the map component', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('div[aria-label="Map"]'))
    })

    it('should display message when no restaurants clicked', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.xpath("//h5[contains(text(), 'Click on a Restaurant to see Details')]"))    
    })
 
    it('should show favourite restaurants tab', async () => {
        await driver.sleep(2000);

        const favouritesButton = await driver.findElement(By.xpath("//button[contains(text(), 'Favourites')]"))

        await favouritesButton.click();

        await driver.findElement(By.xpath("//h5[contains(text(), 'Your Favourite Restaurants')]"))    
    })

    it('should show favourite restaurants list', async () => {
        await driver.sleep(2000);

        const favouritesButton = await driver.findElement(By.xpath("//button[contains(text(), 'Favourites')]"))

        await favouritesButton.click();

        await driver.findElement(By.xpath("//h5[contains(text(), 'Your Favourite Restaurants')]"))    

        await driver.findElement(By.css('[data-testid="favourited-restaurant-0"]'));
    })

    it('should show favourite restaurant when button clicked', async () => {
        await driver.sleep(2000);

        const favouritesTab = await driver.findElement(By.xpath("//button[contains(text(), 'Favourites')]"))

        await favouritesTab.click();

        await driver.findElement(By.xpath("//h5[contains(text(), 'Your Favourite Restaurants')]"))    

        const restaurantPinButton = await driver.findElement(By.css('[data-testid="restaurant-pin-button"]'));

        await restaurantPinButton.click();
        
        const restaurantInfoTab = await driver.findElement(By.xpath("//button[contains(text(), 'Restaurant Info')]"))

        await restaurantInfoTab.click();

        await driver.findElement(By.xpath("//p[contains(text(), 'Address:')]"))   
        await driver.findElement(By.xpath("//p[contains(text(), 'Telephone Number:')]"))    
        await driver.findElement(By.xpath("//p[contains(text(), 'Address:')]"))    
        await driver.findElement(By.css('[data-testid="go-to-website-button"]'));
    })

    it('should display restaurant images', async () => {
        await driver.sleep(2000);

        const favouritesTab = await driver.findElement(By.xpath("//button[contains(text(), 'Favourites')]"))

        await favouritesTab.click();

        await driver.findElement(By.xpath("//h5[contains(text(), 'Your Favourite Restaurants')]"))    

        const restaurantPinButton = await driver.findElement(By.css('[data-testid="restaurant-pin-button"]'));

        await restaurantPinButton.click();
        
        const restaurantInfoTab = await driver.findElement(By.xpath("//button[contains(text(), 'Restaurant Info')]"))

        await restaurantInfoTab.click();

        await driver.findElement(By.xpath("//p[contains(text(), 'Address:')]")) 
        
        await driver.findElement(By.css('[data-testid="photo-0"]'));

    })
})