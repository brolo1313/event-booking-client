import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: string;
  delay?: number;
  toastClass?: string;
  iconColor?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  show(
    header: string,
    body: string,
    delay?: number,
    toastClass?: string,
    iconColor?: string
  ) {
    this.toasts.push({ header, body, delay, toastClass, iconColor });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}