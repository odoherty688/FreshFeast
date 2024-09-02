import { Builder, By, WebDriver, Key, until  } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('UserInformationUI', () => {
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

    it('should render the user information page', async () => {
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

        await driver.get('http://localhost:3000/user')

        await driver.sleep(2000);

        await driver.findElement(By.xpath("//p[contains(text(), 'Your Account:')]"))    
    })

    it('should display the user information', async () => {
        await driver.sleep(2000);

        await driver.findElement(By.xpath("//p[contains(text(), 'Email:')]"));
        
        await driver.findElement(By.xpath("//span[contains(text(), 'high-protein')]"));

        await driver.findElement(By.xpath("//span[contains(text(), 'celery-free')]"));
    })

    it('should edit preferences backdrop when button is clicked', async () => {
        await driver.sleep(2000);

        const editPreferencesButton = await driver.findElement(By.css('[data-testid="edit-preferences-button"]'));

        await editPreferencesButton.click()

        await driver.findElement(By.xpath("//p[contains(text(), 'Please Select Your Dietary Requirements:')]"))   
        await driver.findElement(By.xpath("//p[contains(text(), 'Please Select Your Allergies:')]")) 
    })

    it('should allow the checkboxes to be clicked', async () => {
        await driver.sleep(2000);

        const editPreferencesButton = await driver.findElement(By.css('[data-testid="edit-preferences-button"]'));

        await editPreferencesButton.click()

        await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).click();
        await driver.findElement(By.css('span[data-testid="Dairy-checkbox"]')).click();

        const classAttributePaleo = await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).getAttribute('class');
        const classAttributeDairy = await driver.findElement(By.css('span[data-testid="Dairy-checkbox"]')).getAttribute('class');

        const isMuiCheckedDairy = classAttributeDairy.includes('Mui-checked');
        const isMuiCheckedPaleo = classAttributePaleo.includes('Mui-checked');

        expect(isMuiCheckedPaleo).toBe(true);
        expect(isMuiCheckedDairy).toBe(true);
    })

    it('should update the preferences when save button is clicked', async () => {
        await driver.sleep(2000);

        const editPreferencesButton = await driver.findElement(By.css('[data-testid="edit-preferences-button"]'));

        await editPreferencesButton.click()

        await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).click();
        await driver.findElement(By.css('span[data-testid="Dairy-checkbox"]')).click();

        const saveButton = await driver.findElement(By.css('[data-testid="save-button"]'));

        saveButton.click()

        await driver.sleep(2000);

        await driver.findElement(By.xpath("//span[contains(text(), 'paleo')]"));
        await driver.findElement(By.xpath("//span[contains(text(), 'dairy-free')]"));
    })

    it('should remove the preferences when deselecting checkboxes and saving', async () => {
        await driver.sleep(2000);

        const editPreferencesButton = await driver.findElement(By.css('[data-testid="edit-preferences-button"]'));

        await editPreferencesButton.click()

        await driver.findElement(By.css('span[data-testid="Paleo-checkbox"]')).click();
        await driver.findElement(By.css('span[data-testid="Dairy-checkbox"]')).click();

        const saveButton = await driver.findElement(By.css('[data-testid="save-button"]'));

        saveButton.click()
    })
})