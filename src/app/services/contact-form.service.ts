import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { ContactForm }            from '../models/contact-form';

@Injectable()
export class ContactFormService
{
    private contactFormUrl = 'https://api.damienfarrar.com/portfolio/contact/submit';  // URL to web api
    
    constructor(private http: Http) { }

    submitForm(contactForm: ContactForm): Promise<boolean>
    {
        return this.http.post(this.contactFormUrl, contactForm)
                .toPromise()
                .then(response => response.json() == null)
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any>
    {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
