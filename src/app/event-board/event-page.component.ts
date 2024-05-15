import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store';
import { NgbModal, NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { CheckUpModalComponent } from './checkup-modal/checkup-modal.component';

@Component({
  selector: 'event-board',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, PaginationComponent],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent {

 public paginatedData!: any[];
 public currentPage: number = 1;
 public itemsPerPage: number = 4;
 public totalItems: number = 0;
 public totalPages: number = 0;

  public eventService = inject(EventService);
  public store = inject(StoreService);
  private modalService = inject(NgbModal);

  public defaultModalOptions = {
    centered: true,
    windowClass: 'modal-dialog-centered',
  }
  
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
      }

      const eventId = receivedEntry.eventId;
      this.eventService.registerParticipantOnEvent(data, eventId)
    })
  }
}
