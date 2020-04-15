import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpModule } from '@angular/http';

import { MatInputModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule }       from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutComponent } from './components/about/about.component';
import { ProfessionalExperienceComponent } from './components/professionalexperience/professional-experience.component';
import { ProfessionalExperienceDetailComponent } from './components/professionalexperiencedetail/professional-experience-detail.component';
import { ContactComponent } from './components/contact/contact.component';

import { ProfessionalExperienceService } from './services/professional-experience.service';
import { ContactFormService } from './services/contact-form.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ProfessionalExperienceComponent,
    ProfessionalExperienceDetailComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
  providers: [
    ProfessionalExperienceService,
    ContactFormService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
