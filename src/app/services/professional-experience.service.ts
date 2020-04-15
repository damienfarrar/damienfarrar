import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { ProfessionalDetail } from '../models/professional-detail';

@Injectable()
export class ProfessionalExperienceService
{
    private professionalExperienceUrl = 'https://api.damienfarrar.com/portfolio/professionalexperience/getprofessionalexperience';  // URL to web api
    
    constructor(private http: Http) { }

    getProfessionalExperience(): Promise<ProfessionalDetail[]>
    {
        return this.http.get(this.professionalExperienceUrl)
                .toPromise()
                .then(response => 
                {
                    return response.json().Data.Items.sort(function(a: ProfessionalDetail, b: ProfessionalDetail) 
                    { 
                        return a.orderId - b.orderId;
                    }) as ProfessionalDetail[];
                })
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any>
    {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getProfessionalExperienceById(id: number): Promise<ProfessionalDetail>
    {
        return this.http.post(this.professionalExperienceUrl, {id: id})
                .toPromise()
                .then(response => response.json().Data.Items[0] as ProfessionalDetail)
                .catch(this.handleError);
                    
    }
}
