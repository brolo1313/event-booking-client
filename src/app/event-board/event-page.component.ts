import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { CheckUpModalComponent } from './registration-modal/registration-modal.component';
import { ViewParticipantsModalComponent } from './view-participant-modal/view-participants-modal.component';
import { LIMIT_OPTIONS, SORT_OPTIONS } from './config/event.config';
import { IEventData, IParticipant } from './models/event.models';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { convertToISODate } from '../shared/helpers/helpers';
import { ToastService } from '../shared/services/toast.service';
import { ScrollTrackerDirective } from '../shared/directives/scroll-tracker.directive';

@Component({
  selector: 'event-board',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, PaginationComponent, NgbModule, LoaderComponent, ScrollTrackerDirective],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent {

  public totalItems: number = 0;
  public totalPages: number = 0;

  public eventService = inject(EventService);
  public store = inject(StoreService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);

  public sortOptions = SORT_OPTIONS;
  public limitOptions = LIMIT_OPTIONS;

  public isInfiniteScroll = false;
  public isInfiniteScrollDataLoading = false;

  public defaultModalOptions = {
    centered: true,
    windowClass: 'modal-dialog-centered',
  }

  getDay(event: IEventData) {
    return (new Date(event.eventDate)).getDate();
  }

  getMonth(event: IEventData) {
    const formatter = new Intl.DateTimeFormat('en-us', { month: 'short' });
    const month1 = formatter.format(new Date(event.eventDate));
    return month1;
  }

  getYear(event: IEventData) {
    return (new Date(event.eventDate)).getFullYear();
  }

  ngOnInit() {
    this.fetchData();
  }


  public toggleDisplay() {
    console.log(' this.isInfiniteScroll', this.isInfiniteScroll);
    this.isInfiniteScroll = !this.isInfiniteScroll;
  }

  public onScrollingFinished() {

    if (this.isInfiniteScroll) {
      this.isInfiniteScrollDataLoading = true;
      this.eventService.getPaginatedEvents(this.store.getCurrentPage() + 1, this.store.getItemsPerPage(), this.store.getActiveSort().sortBy, this.store.getActiveSort().sortOrder).subscribe(
        (response) => {

          this.store.updatedEvents(response.data.items);
          this.totalItems = response.data.totalEvents;
          this.totalPages = response.data.totalPages;


          this.store.setCurrentPage(this.store.getCurrentPage() + 1);
          this.isInfiniteScrollDataLoading = false;

        },
        (error) => {
          this.isInfiniteScrollDataLoading = false;
        }
      )
    }

  }

  private fetchData(): void {
    this.store.setIsLoading(true);
    this.eventService.getPaginatedEvents(this.store.getCurrentPage(), this.store.getItemsPerPage(), this.store.getActiveSort().sortBy, this.store.getActiveSort().sortOrder).subscribe(
      (response) => {
        this.store.storedEvents(response.data.items);
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
    this.store.setCurrentPage(page);
    this.fetchData();
  }

  public sort(sortBy: string, sortOrder: string) {

    if (this.isInfiniteScroll) {
      const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'title') {

        this.store.getEvents().sort((a, b) => {
          const getNumber = (title: string | any) => parseInt(title.match(/\d+/)?.[0], 10) || 0;
          const numA = getNumber(a.title);
          const numB = getNumber(b.title);

          this.store.setActiveSort(sortBy, sortOrder);
          return orderMultiplier * (numA - numB);
        });
      } else if (sortBy === 'eventDate') {
        this.store.setActiveSort(sortBy, sortOrder);
        this.store.getEvents().sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return -1 * orderMultiplier;
          if (a[sortBy] > b[sortBy]) return 1 * orderMultiplier;
          return 0;
        });
      }

    } else {
      //default sorting without infinite scroll
      this.store.setActiveSort(sortBy, sortOrder);
      this.fetchData();
    }

  }

  public setLimit(limit: number): void {
    this.store.setCurrentPage(1); // reset to first page, due fix bug
    this.store.setItemsPerPage(limit);
    this.fetchData();
  }

  public openEvenModalRegistration(event: IEventData) {
    const modalRef = this.modalService.open(CheckUpModalComponent, {
      ...this.defaultModalOptions,
    });

    // Pass data to the modal
    modalRef.componentInstance.data = event;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      const convertedDateOfBirthday = convertToISODate(receivedEntry.dateOfBirthday).slice(0, 10);

      const data: IParticipant = {
        name: receivedEntry.fullName,
        email: receivedEntry.email,
        dateOfBirthday: new Date(convertedDateOfBirthday),
        foundUsBy: receivedEntry.foundUsBy,
      }

      const eventId = receivedEntry.eventId;
      this.eventService.registerParticipantOnEvent(data, eventId).subscribe(
        (response) => {
          this.toastService.show('', 'Registration is successful', 5000, 'toast-success', 'green');
          this.store.setIsLoading(false);
          this.fetchData();
        },
        (error) => {
          this.toastService.show('', error?.error?.message, 5000, 'toast-error', 'red');
          this.store.setIsLoading(false);
        }
      )
    })
  }


  public openViewParticipantsModal(event: IEventData) {
    const modalRef = this.modalService.open(ViewParticipantsModalComponent, {
      ...this.defaultModalOptions,
    });
    modalRef.componentInstance.event = event;
  }

}
