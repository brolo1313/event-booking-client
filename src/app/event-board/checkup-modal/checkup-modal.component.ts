import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgbActiveModal, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-checkup-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf, NgbTooltipModule],
  templateUrl: './checkup-modal.component.html',
  styleUrls: ['./checkup-modal.component.scss']
})
export class CheckUpModalComponent {

  activeModal = inject(NgbActiveModal);
  fb = inject(UntypedFormBuilder);
  
  @Input() data: any; 

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() getQrCode: EventEmitter<any> = new EventEmitter();

  maxBirthDate!: string;

  public registrationEventForm: UntypedFormGroup = this.fb.group({
    fullName: ['User1', Validators.required],
    email: ['brolo1341@gmail.com', [Validators.required, Validators.email]],
    dateOfBirthday: [new Date().toISOString().split('T')[0]],
  });

  ngOnInit() {
    this.maxBirthDate = new Date().toISOString().split('T')[0]; 
  }


  public submit(registrationEventForm: any) {
    const data = registrationEventForm.getRawValue();
    this.activeModal.close('success');
    
    const result = {
      ...data,
      eventId: this.data._id
    }
    this.passEntry.emit(result);
  }

}
