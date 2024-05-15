import { Component, EventEmitter, Input, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-view-participants-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf, NgbTooltipModule],
  templateUrl: './view-participants-modal.component.html',
  styleUrls: ['./view-participants-modal.component.scss']
})
export class ViewParticipantsModalComponent {

  activeModal = inject(NgbActiveModal);
  fb = inject(UntypedFormBuilder);
  eventService = inject(EventService);

  @Input() event: any;

  filteredParticipants: any[] = [];
  countOfRegisteredParticipants: number = 0;

  ngOnInit(): void {
    this.filteredParticipants = this.event.participants;
    this.eventService.getRegisteredToDay(this.event._id).subscribe(
      (response) => {
        const data = response as [];
        this.countOfRegisteredParticipants = data.length; 
      }
    )
  }

  public applyFilter(event: any): void {
    const value = event.target.value;
    this.filteredParticipants = this.event.participants.filter((participant: any) => {
      const nameMatch = participant.name.toLowerCase().includes(value.toLowerCase());
      const emailMatch = participant.email.toLowerCase().includes(value.toLowerCase());
      return nameMatch || emailMatch;
    });
  }
}
