import { Injectable, inject, signal } from '@angular/core';
import { IApiResponse, IEventData } from '../event-board/models/event.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public selectEventsList = signal<IEventData[]>([]);

  private isLoading = signal<boolean>(false);

  constructor() {
  }

  setIsLoading(data: boolean) {
    this.isLoading.set(data);
  }

  getIsLoading() {
    return this.isLoading();
  }


  storedEvents(data: IEventData[]) {
    this.selectEventsList.set(data);
  }

  getEvents() {
    return this.selectEventsList();
  }

}
