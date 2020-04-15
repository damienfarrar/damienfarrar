import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfessionalDetail } from '../../models/professional-detail';
import { ProfessionalExperienceService } from '../../services/professional-experience.service';

@Component
(
  {
    selector: 'professional-experience',
    templateUrl: './professional-experience.component.html',
    styleUrls: ['./professional-experience.component.css']
  }
)

export class ProfessionalExperienceComponent implements OnInit
{
  selectedProfessionalDetail: ProfessionalDetail;
  professionalDetails:  ProfessionalDetail[];
  onSelect(professionalDetail: ProfessionalDetail): void 
  {
    this.selectedProfessionalDetail = professionalDetail;
  };

  constructor(
    private router: Router,
    private professionalExperienceService: ProfessionalExperienceService
  )
  {

  };

  isLoading: boolean = true;

  ngOnInit(): void 
  {
    this.isLoading = true;
    this.getProfessionalExperience();
  };

  getProfessionalExperience(): void
  {
    this.professionalExperienceService.getProfessionalExperience()
    .then(professionalExperience => 
    {
      setTimeout(() => 
      {
        this.professionalDetails = professionalExperience; 
        this.isLoading = false;
      }, 250);
    });
  };

  gotoDetail(): void
  {
    this.router.navigate(['/detail', this.selectedProfessionalDetail.id]);
  }
}
