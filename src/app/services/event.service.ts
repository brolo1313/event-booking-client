import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from './store';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  store = inject(StoreService);

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }



  public getEvents() {
    this.store.setIsLoading(true);
    return this.http.get(`${environment.apiUrl}/all-events`).subscribe(
      (response) => {
        this.store.storedEvents(response)
        this.store.setIsLoading(false);
      },
      (error) => {
        this.store.setIsLoading(false);
      }
    )
  }


  public getPaginatedEvents(pageNumber: number, limit: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/all-events`, { params :{
      pageNumber,
      limit
    } });
  }

  public registerParticipantOnEvent(participantData: any, eventId: string) {
    const requestBody = { ...participantData, eventId };
    return this.http.post(`${environment.apiUrl}/register-participant`, requestBody).subscribe(
      (response) => {
        
        console.log('response');
        this.store.setIsLoading(false);
      },
      (error) => {
        this.store.setIsLoading(false);
      }
    )
  }

}
