import { Builder, By, WebDriver } from 'selenium-webdriver';

describe('LoginUI', () => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        driver.manage().window().maximize();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should redirect to the expected page after login', async () => {
        await driver.get('http://localhost:3000/login');
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        const currentUrl = await driver.getCurrentUrl();
        
        const currentBaseUrl = currentUrl.split('?state=')[0];
        const expectedBaseUrl = "https://freshfeast-40300091.uk.auth0.com/u/login";
        
        expect(currentBaseUrl).toEqual(expectedBaseUrl);
    });

    it('Logo is present', async () => {
        await driver.get('http://localhost:3000/login'); // Replace YOUR_PORT with your actual port
      
        // Find the logo element
        const logo = await driver.findElement(By.css('img'));
      
        // Check if the logo exists
        expect(await logo.isDisplayed()).toBeTruthy();
        
    });
});
