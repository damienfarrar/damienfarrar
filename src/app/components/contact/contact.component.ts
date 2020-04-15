import { Component, Input }       from '@angular/core';

import { ContactForm }            from '../../models/contact-form';
import { ContactFormService } from '../../services/contact-form.service';

@Component(
{
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: [ './contact.component.css' ],
})

export class ContactComponent
{
    @Input() contactForm: ContactForm = new ContactForm();
  
    constructor(private contactFormService: ContactFormService) { };
  
    isLoading: boolean = false;
    formValid: boolean = true;
    strMessage: string = "";
    messageClass: string = "message-success";
  
    submitForm(): void
    {
        this.isLoading = true;
        this.formValid = true;

        if (this.contactForm != null)
        {
            if (this.contactForm.name == "")
            {
                this.formValid = false;
                this.strMessage = "Please enter your name.";
            }
            if (this.contactForm.email == "" && this.formValid)
            {
                this.formValid = false;
                this.strMessage = "Please enter your email address.";
            }
            if (this.contactForm.description == "" && this.formValid)
            {
                this.formValid = false;
                this.strMessage = "Please enter a message.";
            }

            if (this.formValid)
            {
                this.contactFormService.submitForm(this.contactForm);
                this.isLoading = false;
                this.messageClass = "message-success";
                this.strMessage = "Your message has been submitted.";
            }
            else
            {
                this.isLoading = false;
                this.messageClass = "message-error";
            }
        }
    }
}
