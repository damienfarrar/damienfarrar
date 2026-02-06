import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ContactForm }            from '../models/contact-form';

@Injectable()
export class ContactFormService
{
    private contactFormUrl = 'https://api.damienfarrar.com/portfolio/contact/submit';  // URL to web api
    
    constructor(private http: HttpClient) { }

    submitForm(contactForm: ContactForm): Promise<boolean>
    {
        return firstValueFrom(this.http.post(this.contactFormUrl, contactForm))
                .then(response => response == null)
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any>
    {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
