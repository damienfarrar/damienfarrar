import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, ParamMap }   from '@angular/router';
import { Location }                 from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { ProfessionalExperienceService }              from '../../services/professional-experience.service';
import { ProfessionalDetail }                     from '../../models/professional-detail';

@Component
(
  {
    selector: 'professional-detail',
    templateUrl: './professional-experience-detail.component.html',
    styleUrls: [ './professional-experience-detail.component.css' ],
  }
)

export class ProfessionalExperienceDetailComponent implements OnInit
{
    @Input() professionalDetail: ProfessionalDetail;

    constructor(private professionalExperienceService: ProfessionalExperienceService, private route: ActivatedRoute, private location: Location) { };

    images: string[] = [];

    isLoading: boolean = true;

    ngOnInit(): void
    {
        this.isLoading = true;
        
        // this.route.params
        // .switchMap((params: Params) => this.professionalExperienceService.getProfessionalExperienceById(+params['id']))
        // .subscribe(professionalDetail => 
        // {
        //     setTimeout(() => 
        //     {
        //         this.professionalDetail = professionalDetail;
        //         if (this.professionalDetail != null)
        //         {
        //             for (var i = 0; i < this.professionalDetail.images; i++)
        //             {
        //                 this.images.push(this.professionalDetail.image + "-" + i)
        //             }
        //         }
        //         this.isLoading = false;
        //     }, 250);
        // });


        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.professionalExperienceService.getProfessionalExperienceById(+params.get('id'))
            )
          ).subscribe((professionalDetail) => {
                setTimeout(() => 
                {
                    this.professionalDetail = professionalDetail;
                    if (this.professionalDetail != null)
                    {
                        for (var i = 0; i < this.professionalDetail.images; i++)
                        {
                            this.images.push(this.professionalDetail.image + "-" + i)
                        }
                    }
                    this.isLoading = false;
                }, 250);
        });
    }

    goBack(): void
    {
        this.location.back();
    }
}
