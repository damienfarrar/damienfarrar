import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ProfessionalDetail } from '../models/professional-detail';

@Injectable()
export class ProfessionalExperienceService
{
    private professionalExperienceUrl = 'https://api.damienfarrar.com/portfolio/professionalexperience/getprofessionalexperience';  // URL to web api
    
    constructor(private http: HttpClient) { }

    getProfessionalExperience(): Promise<ProfessionalDetail[]>
    {
        return firstValueFrom(this.http.get<any>(this.professionalExperienceUrl))
                .then(response => 
                {
                    return response.Data.Items.sort(function(a: ProfessionalDetail, b: ProfessionalDetail)
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
        return firstValueFrom(this.http.post<any>(this.professionalExperienceUrl, {id: id}))
                .then(response => response.Data.Items[0] as ProfessionalDetail)
                .catch(this.handleError);
                    
    }
}
