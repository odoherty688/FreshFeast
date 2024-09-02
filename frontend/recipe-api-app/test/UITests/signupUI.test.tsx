import { Builder, By, WebDriver, Key, until } from 'selenium-webdriver';
import { UserInfo } from '../../src/interfaces/UserInfo';

describe('SignupUI', () => {
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
    
        await driver.findElement(By.xpath("//a[contains(text(), 'Sign up')]")).click();
    
        const emailField = await driver.findElement(By.id('email'));
              
        await emailField.sendKeys('UIExampleTest24@gmail.com');
        
        const passwordField = await driver.findElement(By.id('password'));
    
        await passwordField.sendKeys('Password1234!!!');
    
        await driver.findElement(By.xpath("//button[contains(text(), 'Continue')]")).click();
    
        await driver.findElement(By.xpath("//button[contains(text(), 'Accept')]")).click();
    
        const currentUrl = await driver.getCurrentUrl();
            
        console.log(currentUrl)
            
        await driver.findElement(By.xpath("//div[contains(text(), 'Redirecting')]"));

        // Wait for 2 seconds
        await driver.sleep(2000);

        await driver.findElement(By.xpath('//h5[contains(text(), "Diet")]'));
    })

    it('should be able to select diet checkboxes', async () => {

        await driver.findElement(By.css('span[data-testid="High-Protein-checkbox"]'));
    
        const highProteinCheckbox = await driver.findElement(By.css('span[data-testid="High-Protein-checkbox"]'));

        await highProteinCheckbox.click();

        const classAttributeValue = await highProteinCheckbox.getAttribute('class');

        const isMuiChecked = classAttributeValue.includes('Mui-checked');

        expect(isMuiChecked).toBe(true);
    });

    it('should be able to select multiple diet checkboxes', async () => {

        await driver.findElement(By.css('span[data-testid="High-Protein-checkbox"]'));

        await driver.findElement(By.css('span[data-testid="Keto-checkbox"]'));

    
        const highProteinCheckbox = await driver.findElement(By.css('span[data-testid="High-Protein-checkbox"]'));

        const ketoCheckbox = await driver.findElement(By.css('span[data-testid="Keto-checkbox"]'));

        await highProteinCheckbox.click();
        await ketoCheckbox.click();

        const classAttributeHighProtein = await highProteinCheckbox.getAttribute('class');
        const classAttributeKeto = await ketoCheckbox.getAttribute('class');

        const isMuiCheckedHighProtein = classAttributeHighProtein.includes('Mui-checked');
        const isMuiCheckedKeto = classAttributeKeto.includes('Mui-checked');

        expect(isMuiCheckedHighProtein).toBe(true);
        expect(isMuiCheckedKeto).toBe(true);
    });

    it('should be able to select allergy checkboxes', async () => {

        await driver.findElement(By.css('span[data-testid="Celery-checkbox"]'));
    
        const CeleryCheckbox = await driver.findElement(By.css('span[data-testid="Celery-checkbox"]'));

        await CeleryCheckbox.click();

        const classAttributeValue = await CeleryCheckbox.getAttribute('class');

        const isMuiChecked = classAttributeValue.includes('Mui-checked');

        expect(isMuiChecked).toBe(true);
    });

    it('should be able to select multiple allergy checkboxes', async () => {

        await driver.findElement(By.css('span[data-testid="Celery-checkbox"]'));

        await driver.findElement(By.css('span[data-testid="Fish-checkbox"]'));

    
        const celeryCheckbox = await driver.findElement(By.css('span[data-testid="Celery-checkbox"]'));

        const fishCheckbox = await driver.findElement(By.css('span[data-testid="Fish-checkbox"]'));

        await celeryCheckbox.click();
        await fishCheckbox.click();

        const classAttributeCelery = await celeryCheckbox.getAttribute('class');
        const classAttributeFish = await fishCheckbox.getAttribute('class');

        const isMuiCheckedCelery = classAttributeCelery.includes('Mui-checked');
        const isMuiCheckedFish = classAttributeFish.includes('Mui-checked');


        expect(isMuiCheckedCelery).toBe(true);
        expect(isMuiCheckedFish).toBe(true);
    });

    it('should navigate to the home page when submit is clicked', async () => {

        await driver.findElement(By.css('span[data-testid="High-Protein-checkbox"]'));

        await driver.findElement(By.css('span[data-testid="Keto-checkbox"]'));

        await driver.findElement(By.css('span[data-testid="Celery-checkbox"]'));

        await driver.findElement(By.css('span[data-testid="Fish-checkbox"]'));

        const highProteinCheckbox = await driver.findElement(By.css('span[data-testid="High-Protein-checkbox"]'));

        const ketoCheckbox = await driver.findElement(By.css('span[data-testid="Keto-checkbox"]'));

        const celeryCheckbox = await driver.findElement(By.css('span[data-testid="Celery-checkbox"]'));

        const fishCheckbox = await driver.findElement(By.css('span[data-testid="Fish-checkbox"]'));

        await highProteinCheckbox.click();
        await ketoCheckbox.click();
        await celeryCheckbox.click();
        await fishCheckbox.click();

        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]"))

        const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]"))

        await submitButton.click();

        const currentUrl = await driver.getCurrentUrl();
        
        const expectedBaseUrl = "http://localhost:3000/";
        
        expect(currentUrl).toEqual(expectedBaseUrl);
    });
});