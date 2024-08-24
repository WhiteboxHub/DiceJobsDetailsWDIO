const fs = require('fs');
const path = require('path');

describe('Job Description Extraction', () => {
    it('should click each job element and save job descriptions', async () => {
        // Navigate to the job search results page
        await browser.url('https://www.dice.com/jobs?q=frontend%20developer&location=San%20Francisco,%20CA,%20USA&countryCode=US&locationPrecision=City&radius=30&radiusUnit=mi&page=1&pageSize=20&lanhttps://www.dice.com/jobs?q=Ml%20engineer&location=San%20Francisco,%20CA,%20USA&countryCode=US&locationPrecision=City&radius=30&radiusUnit=mi&page=1&pageSize=20&language=enguage=en');
        
        // Wait for the page to load fully
        await browser.pause(5000);
        
        // Get all job elements
        const jobElements = await $$('.card-title-link.normal');

        // Loop through each job element
        for (let i = 0; i < jobElements.length; i++) {
            const jobElement = jobElements[i];
            
            // Click the job element
            await jobElement.click();
            
            // Wait for the new tab to open and get the handles
            await browser.pause(5000);
            const handles = await browser.getWindowHandles();
            await browser.switchToWindow(handles[1]);

            // Wait for the page to load
            await browser.pause(5000);

            // Click the description toggle button
            await (await $("//button[@id='descriptionToggle']")).click();

            // Wait for the description to be visible
            await browser.pause(5000);

            // Get and print the job description text
            const jobDescriptionElement = await $('//div[@class="job-details_jobDetails___c7LA"]');
            const jobDescriptionText = await jobDescriptionElement.getText();
            
            // Define the file path
            const filePath = path.join(__dirname, `jobDescription${i + 1}.txt`);

            // Write the job description text to the file
            fs.writeFileSync(filePath, jobDescriptionText);

            console.log("Job description written to file:", filePath);

            // Close the current tab
            await browser.closeWindow();
            
            // Switch back to the original tab
            await browser.switchToWindow(handles[0]);

            // Wait before clicking the next job element
            await browser.pause(5000);

            // Refresh jobElements list to account for changes
            const updatedJobElements = await $$('.card-title-link.normal');
            if (updatedJobElements.length <= i) {
                console.warn("Less job elements available than expected. Exiting loop.");
                break;
            }
        }
    });
});




