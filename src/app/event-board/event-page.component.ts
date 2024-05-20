import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
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
import { SwitcherComponent } from '../shared/components/switcher/switcher.components';
import { Subject } from 'rxjs';

@Component({
  selector: 'event-board',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, PaginationComponent, NgbModule, LoaderComponent, ScrollTrackerDirective, SwitcherComponent],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent {
  @ViewChild('endElement') endElement!: ElementRef;


  public totalItems: number = 0;
  public totalPages: number = 0;

  public eventService = inject(EventService);
  public store = inject(StoreService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  public changeDetectorRef = inject(ChangeDetectorRef);

  public sortOptions = SORT_OPTIONS;
  public limitOptions = LIMIT_OPTIONS;

  public isInfiniteScroll = false;
  public isInfiniteScrollDataLoading = false;
  public isReachBottom: boolean = false;
  public isEmptyResponseOnScroll = signal<boolean>(false);

  public innerWidth: number = 0;

  public defaultModalOptions = {
    centered: true,
    windowClass: 'modal-dialog-centered',
  }

  private ngUnsubscribe = new Subject();

  getIsEmptyResponseOnScroll() {
    return this.isEmptyResponseOnScroll();
  }

  setIsEmptyResponseOnScroll(data: boolean) {
    this.isEmptyResponseOnScroll.set(data);
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

  @HostListener("window:scroll", [])
  onScroll(): void {
    this.isReachBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.fetchData();
    this.innerWidth = window.innerWidth;
  }


  public toggleDisplay(event: boolean) {
    //Reset to the default pagination params
    if (!event) {
      this.store.setCurrentPage(1);
      this.store.setItemsPerPage(20);
      this.store.setActiveSort('title', 'asc');
      this.setIsEmptyResponseOnScroll(false);

      this.fetchData();

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
    this.setIsEmptyResponseOnScroll(false);
    this.isInfiniteScroll = event;
  }

  public scrollToBottom() {
    if (this.endElement) {
      this.endElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  public onScrollingFinished() {
    if (this.isInfiniteScroll && !this.getIsEmptyResponseOnScroll()) {
      this.isInfiniteScrollDataLoading = true;
      this.eventService.getPaginatedEvents(this.store.getCurrentPage() + 1, this.store.getItemsPerPage(), this.store.getActiveSort().sortBy, this.store.getActiveSort().sortOrder).subscribe(
        (response) => {

          if (!response.data.items.length) {
            this.setIsEmptyResponseOnScroll(true);
            this.isInfiniteScrollDataLoading = false;
            this.changeDetectorRef.detectChanges();


            this.scrollToBottom();

          } else {
            this.store.updatedEvents(response.data.items);
            this.totalItems = response.data.totalEvents;
            this.totalPages = response.data.totalPages;

            this.isInfiniteScrollDataLoading = false;
            this.setIsEmptyResponseOnScroll(false);
            this.store.setCurrentPage(this.store.getCurrentPage() + 1);
          }
        },
        (error) => {
          this.isInfiniteScrollDataLoading = false;
          this.setIsEmptyResponseOnScroll(false);
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


  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
