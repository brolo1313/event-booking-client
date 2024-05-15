import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';

@Component({
  selector: 'event-board',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, PaginationComponent],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent {

  paginatedData!: any[];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalItems!: number;

  public eventService = inject(EventService);
  public store = inject(StoreService);
  ngOnInit() {
    this.fetchData();
  }

  showApiData() {
  }

  private fetchData(): void {
    this.store.setIsLoading(true);
    this.eventService.getPaginatedEvents(this.currentPage, this.itemsPerPage).subscribe(
      (response) => {
        this.store.storedEvents(response);
        this.totalItems = response.data.totalEvents;
        this.store.setIsLoading(false);
      },
      (error) => {
        this.store.setIsLoading(false);
      }
    )
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchData();
  }
}
