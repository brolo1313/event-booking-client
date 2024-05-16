import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from './store';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ToastService } from '../shared/services/toast.service';
import { IApiResponse, IParticipant } from '../event-board/models/event.models';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  store = inject(StoreService);
  toastService = inject(ToastService);
  http = inject(HttpClient);
  route = inject(ActivatedRoute)

  public getEvents() {
    this.store.setIsLoading(true);
    return this.http.get<IApiResponse>(`${environment.apiUrl}/all-events`).subscribe(
      (response: IApiResponse) => {
        this.store.storedEvents(response.data.items)
        this.store.setIsLoading(false);
      },
      (error) => {
        this.store.setIsLoading(false);
      }
    )
  }

  public getRegisteredToDay(eventId:string){
    return this.http.get(`${environment.apiUrl}/registered-to-day`, {
      params: {
        eventId,
      }
    });
  }


  public getPaginatedEvents(pageNumber: number = 1, limit: number = 10, sortBy = 'title', sortOrder = 'asc'): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${environment.apiUrl}/all-events`, {
      params: {
        pageNumber,
        limit,
        sortBy,
        sortOrder,
      }
    });
  }

  public registerParticipantOnEvent(participantData: IParticipant, eventId: string) {
    const requestBody = { ...participantData, eventId };
    return this.http.post(`${environment.apiUrl}/register-participant`, requestBody).subscribe(
      (response) => {
        this.toastService.show('', 'Registration is successful', 5000, 'toast-success', 'green');
        this.store.setIsLoading(false);
        this.getEvents();
      },
      (error) => {
        this.toastService.show('', error?.error?.message, 5000, 'toast-error', 'red');
        this.store.setIsLoading(false);
      }
    )
  }

}
