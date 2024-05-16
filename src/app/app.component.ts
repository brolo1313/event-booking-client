import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './shared/services/toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { StoreService } from './services/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbToastModule,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public toastService = inject(ToastService);
  public store = inject(StoreService);
  title = 'event-client';

  getIconSrc(iconColor: string): string {
    switch (iconColor) {
      case 'red':
        return './assets/icons/warning-red.svg';
      case 'green':
        return './assets/icons/warning-green.svg';
      case 'blue':
        return './assets/icons/warning-blue.svg';
      default:
        return '';
    }
  }
}
