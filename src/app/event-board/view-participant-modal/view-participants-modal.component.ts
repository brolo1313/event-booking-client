import { Component, EventEmitter, Input, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

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

  @Input() event: any;

  filteredParticipants: any[] = [];

  ngOnInit(): void {
    this.filteredParticipants = this.event.participants;
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
