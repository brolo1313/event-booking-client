import { Injectable, inject, signal } from '@angular/core';
import { IApiResponse, IEventData } from '../event-board/models/event.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public activeSort = signal<{ sortBy: string; sortOrder: string }>({ sortBy: 'title', sortOrder: 'asc' })
  public currentPage = signal<number>(1);
  public itemsPerPage = signal<number>(20);

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

  updatedEvents(data: IEventData[]){
    this.selectEventsList.update((oldState) => {
      return [...oldState, ...data];
  });
  }

  getEvents() {
    return this.selectEventsList();
  }


  getActiveSort() {
    return this.activeSort();
  }

  setActiveSort(sortBy: string, sortOrder: string){
    this.activeSort.set({sortBy, sortOrder});
  }

  getCurrentPage() {
    return this.currentPage();
  }

  setCurrentPage(pageNumber: number){
    this.currentPage.set(pageNumber);
  }

  getItemsPerPage() {
    return this.itemsPerPage();
  }

  setItemsPerPage(limit: number){
    this.itemsPerPage.set(limit);
  }
}
