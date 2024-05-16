import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store';
import { NgbModal, NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { CheckUpModalComponent } from './checkup-modal/checkup-modal.component';
import { ViewParticipantsModalComponent } from './view-participant-modal/view-participants-modal.component';
import { LIMIT_OPTIONS, SORT_OPTIONS } from './config/event.config';

@Component({
  selector: 'event-board',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, PaginationComponent, NgbModule],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent {

  public paginatedData!: any[];
  public currentPage: number = 1;
  public itemsPerPage: number = 4;
  public totalItems: number = 0;
  public totalPages: number = 0;

  public sortOrder: string = 'asc';
  public sortBy: string = 'title';

  public eventService = inject(EventService);
  public store = inject(StoreService);
  private modalService = inject(NgbModal);

  public sortOptions = SORT_OPTIONS;
  public limitOptions = LIMIT_OPTIONS;

  public defaultModalOptions = {
    centered: true,
    windowClass: 'modal-dialog-centered',
  }

  getDay(event: any) {
    return (new Date(event.eventDate)).getDate();
  }

  getMonth(event: any) {
    const formatter = new Intl.DateTimeFormat('en-us', { month: 'short' });
    const month1 = formatter.format(new Date(event.eventDate));
    return month1;
  }

  getYear(event: any) {
    return (new Date(event.eventDate)).getFullYear();
  }

  ngOnInit() {
    this.fetchData();
  }

  private fetchData(): void {
    this.store.setIsLoading(true);
    this.eventService.getPaginatedEvents(this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder).subscribe(
      (response) => {
        this.store.storedEvents(response);
        this.totalItems = response.data.totalEvents;
        this.totalPages = response.data.totalPages;

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

  public sort(sortBy: string, sortOrder: string) {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.fetchData();
  }

  public setLimit(limit: number): void {
    this.itemsPerPage = limit;
    this.fetchData();
  }

  public openEvenModalRegistration(event: any) {
    const modalRef = this.modalService.open(CheckUpModalComponent, {
      ...this.defaultModalOptions,
    });

    // Pass data to the modal
    modalRef.componentInstance.data = event;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      const data = {
        name: receivedEntry.fullName,
        email: receivedEntry.email,
        dateOfBirthday: receivedEntry.dateOfBirthday,
        foundUsBy: receivedEntry.foundUsBy,
      }

      const eventId = receivedEntry.eventId;
      this.eventService.registerParticipantOnEvent(data, eventId)
    })
  }


  public openViewParticipantsModal(event: any) {
    const modalRef = this.modalService.open(ViewParticipantsModalComponent, {
      ...this.defaultModalOptions,
    });
    modalRef.componentInstance.event = event;
  }
  
}
