import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from './store';
import { environment } from '../../environments/environment';

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


}
