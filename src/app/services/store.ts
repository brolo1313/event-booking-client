import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public selectEventsList = signal<any>([]);

  private isLoading = signal<boolean>(false);

  constructor() {
  }

  setIsLoading(data: boolean) {
    this.isLoading.set(data);
  }

  getIsLoading() {
    return this.isLoading();
  }


  storedEvents(data: any) {
    this.selectEventsList.set(data);
  }

  getEvents() {
    return this.selectEventsList();
  }

}
