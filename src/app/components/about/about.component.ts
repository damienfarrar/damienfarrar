import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ProfessionalDetail } from '../../models/professional-detail';
import { ProfessionalExperienceService } from '../../services/professional-experience.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: [ './about.component.css' ],
})

export class AboutComponent implements OnInit
{
  professionalDetails:  ProfessionalDetail[];

  constructor(private professionalExperienceService: ProfessionalExperienceService) { };

  ngOnInit(): void 
  {
    this.getProfessionalExperience();
  };

  getProfessionalExperience(): void
  {
    this.professionalExperienceService.getProfessionalExperience().then(professionalExperience => 
        this.professionalDetails = professionalExperience.slice(1, 5)
      );
  };
}