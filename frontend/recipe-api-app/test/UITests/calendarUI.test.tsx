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

        await driver.get('http://localhost:3000/calendar')

        await driver.sleep(2000);

        await driver.findElement(By.xpath("//h5[contains(text(), 'Your Weekly Calendar')]"))    
    })

    it('should render the calendar', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.css('div[data-testid="calendar"]'));
    })

    it('should render the user favourite recipes', async () => {
        await driver.sleep(2000);

        const recipe = await driver.findElement(By.css('[data-testid="recipe-0"]'));
       
        const isDraggable = await recipe.getAttribute('draggable');

        expect(isDraggable).toBe("true");
    })

    it('should open the ingredients backdrop when button is clicked', async () => {
        await driver.sleep(2000);

        const ingredientsButton = await driver.findElement(By.css('[data-testid="ingredients-button"]'));

        await ingredientsButton.click();

        await driver.findElement(By.xpath("//p[contains(text(), \"This Week's Ingredients:\")]"));
    })

    it('should display ingredients message when no recipes are in calendar', async () => {
        await driver.sleep(2000);

        const ingredientsButton = await driver.findElement(By.css('[data-testid="ingredients-button"]'));

        await ingredientsButton.click();

        await driver.findElement(By.xpath("//p[contains(text(), 'Add recipes to your calendar to view ingredients!')]"))    
    })
})