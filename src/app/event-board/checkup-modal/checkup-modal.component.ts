import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgbActiveModal, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IEventData } from '../models/event.models';

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

  @Input() data!: IEventData;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() getQrCode: EventEmitter<any> = new EventEmitter();

  radioOptions = [
    { label: 'Social media', value: '1' },
    { label: 'Friends', value: '2' },
    { label: 'Found myself', value: '3' }
  ];

  selectedOption: string = '';
  public maxBirthDate!: string;
  public currentDay = new Date();


  public registrationEventForm: UntypedFormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirthday: [''],
  });


  get UserNameFC(): FormControl {
    return this.registrationEventForm.get('fullName') as UntypedFormControl;
  }

  get EmailFC(): FormControl {
    return this.registrationEventForm.get('email') as UntypedFormControl;
  }

  ngOnInit() {
    this.maxBirthDate = new Date(2014, 11, 31).toISOString().split('T')[0];
  }


  public submit(registrationEventForm: UntypedFormGroup) {
    const data = registrationEventForm.getRawValue();
    this.activeModal.close('success');

    const result = {
      ...data,
      eventId: this.data._id,
      foundUsBy: this.selectedOption
    }

    this.passEntry.emit(result);
  }

}
