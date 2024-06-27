import express from 'express';
import nodemailer from 'nodemailer'
import { firefox } from 'playwright';
const app = express();

const router = express.Router();


const formData = {
    Name: 'Kavi',
    Email: 'me@kavi.com',
    Pass: 'Kavi#test@2024',
    Phone: '9876543210',
    TextareaMessage: 'Form Automation Testing by Webmaster Team',
    Company: 'KE'
};

router.get('/', async (req, res) => {
    const { url, formName } = req.query;
    if (!url || !formName) {
        return res.status(400).json({ error: 'Missing url or form-name parameter' });
    }

    console.log(`Navigating to URL: ${url}`);
    let browser;
    try {
        browser = await firefox.launch(); 
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);

        const form = await page.$(`form[name="${formName}"]`);
        if (!form) {
            console.error(`Form with name "${formName}" not found`);
            return res.status(404).json({ error: 'Form not found' });
        }

        console.log(`Form "${formName}" found`);

        const formAction = await page.evaluate(form => form.getAttribute('action'), form);
        console.log(`Form action link: ${formAction}`);

        const inputs = await form.$$('input');
        const textareas = await form.$$('textarea');
        const selects = await form.$$('select');
        let captchaPresent = await page.$('input[aria-label*="captcha"], div[class*="captcha"]') !== null;

        let requiredInputs = 0;

        for (const input of inputs) {
            const type = await input.getAttribute('type');
            const name = await input.getAttribute('name') || await input.getAttribute('placeholder') || await input.getAttribute('id');
            const isVisible = await input.evaluate(node => node.offsetParent !== null);

            if (!name || type === 'hidden' || !isVisible) continue;

            console.log(`Processing input: ${name} of type: ${type}`);

            requiredInputs++;
            if (name.toLowerCase().includes('name')) {
                await input.fill(formData.Name);
                console.log(`Filled input "${name}" with value: ${formData.Name}`);
            } else if (name.toLowerCase().includes('email')) {
                await input.fill(formData.Email);
                console.log(`Filled input "${name}" with value: ${formData.Email}`);
            } else if (name.toLowerCase().includes('password')) {
                await input.fill(formData.Pass);
                console.log(`Filled input "${name}" with value: ${formData.Pass}`);
            } else if (name.toLowerCase().includes('company')) {
                await input.fill(formData.Company);
                console.log(`Filled input "${name}" with value: ${formData.Company}`);
            } else if (name.toLowerCase().includes('phone') || type === 'tel') {
                await input.fill(formData.Phone);
                console.log(`Filled input "${name}" with value: ${formData.Phone}`);
            }

            if (type === 'checkbox' || type === 'radio') {
                await input.check();
                console.log(`Checked "${type}" input "${name}"`);
            }
        }

        for (const textarea of textareas) {
            const isVisible = await textarea.evaluate(node => node.offsetParent !== null);
            if (!isVisible) continue;

            await textarea.fill(formData.TextareaMessage);
            console.log(`Filled textarea with value: ${formData.TextareaMessage}`);
            requiredInputs++;
        }

        for (const select of selects) {
            const isVisible = await select.evaluate(node => node.offsetParent !== null);
            if (!isVisible) continue;

            const name = await select.getAttribute('name') || await select.getAttribute('id');
            if (name && name.toLowerCase().includes('country')) {
                const options = await select.$$('option');
                for (const option of options) {
                    const optionText = await option.textContent();
                    if (optionText && optionText.toLowerCase() === 'india') {
                        await select.selectOption(option);
                        console.log(`Selected "India" in select: ${name}`);
                        break;
                    }
                }
            } else {
                const options = await select.$$('option');
                if (options.length > 0) {
                    await select.selectOption(options[0]);
                    console.log(`Selected option in select: ${await options[0].textContent()}`);
                }
            }
        }

        let errors = 0;
        let submissionLog = 'No errors';
        let formSubmitted = false;
        let formRedirectionUrl = null;
        let formIsValidated = false;

        try {
            await form.evaluate(form => form.submit());
            await page.waitForNavigation({ waitUntil: 'networkidle' });
            formSubmitted = true;
            formRedirectionUrl = page.url();
            const content = await page.content();
            if (content.includes('thank') || content.includes('success') || content.includes('confirmation')) {
                formIsValidated = true;
                console.log('Form submission validated successfully with confirmation message');
            }
            console.log('Form submitted successfully');
        } catch (error) {
            errors++;
            submissionLog = error.message;
            console.error(`Form submission failed: ${error.message}`);
        }

        res.json({
            page: url,
            'form-name': formName,
            'form-action': formAction || 'Not specified',
            'required-input-fields': requiredInputs,
            'form-captcha': captchaPresent.toString(),
            'form-submitted': formSubmitted.toString(),
            errors: errors.toString(),
            'submission-log': submissionLog,
            'form-redirection-url': formRedirectionUrl,
            'form-is-validated': formIsValidated.toString(),
            status: formSubmitted ? 'success' : 'failed'
        });

        // Send email notification
        async function sendEmail() {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, 
                auth: {
                    user: '',
                    pass: ''
                }
            });

            let info = await transporter.sendMail({
                from: '',
                to: '',
                subject: `${formSubmitted ? 'Success' : 'Failed'} - Web Form Automation Tool Test`,
                text: `Hello Developers,
                
                This is an alert notification from the Web form automation api.

                1. Page name: ${url},
                2. Form name: ${formName},
                3. Form action: ${formAction || 'Not specified'},
                4. Required input fields: ${requiredInputs},
                5. Captcha present: ${captchaPresent.toString()},
                6. Form submitted: ${formSubmitted.toString()},
                7. Errors: ${errors.toString()},
                8. Submission log: ${submissionLog},
                9. Form redirection URL: ${formRedirectionUrl},
                10. Form is validated: ${formIsValidated.toString()},
                11. Status: ${formSubmitted ? 'Success' : 'Failed'}
                
                This is an auto-generated email from WDC (Web Deep Crawler).
                `
            });

            console.log('Email message sent: %s', info.messageId);
        }

        await sendEmail();

    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        res.status(500).json({
            page: url,
            'form-name': formName,
            'form-submitted': 'false',
            errors: '1',
            'submission-log': error.message,
            status: 'failed'
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});



export default router;