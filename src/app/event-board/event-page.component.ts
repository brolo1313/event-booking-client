import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../services/event.service';
import { StoreService } from '../services/store';

@Component({
  selector: 'event-board',
  standalone: true,
  imports: [CommonModule,RouterModule, NgIf],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent {

  public eventService = inject(EventService);
  public store = inject(StoreService);
  ngOnInit() {
    this.eventService.getEvents();
  }
}
