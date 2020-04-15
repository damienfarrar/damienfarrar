import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent }       from './components/about/about.component';
import { ProfessionalExperienceComponent }      from './components/professionalexperience/professional-experience.component';
import { ProfessionalExperienceDetailComponent }  from './components/professionalexperiencedetail/professional-experience-detail.component';
import { ContactComponent }     from './components/contact/contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/professional', pathMatch: 'full' },
  { path: 'professional',     component: ProfessionalExperienceComponent },
  { path: 'detail/:id', component: ProfessionalExperienceDetailComponent },
  { path: 'about',  component: AboutComponent },
  { path: 'contact',  component: ContactComponent },
];

@NgModule(
{
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule
{
    
}
