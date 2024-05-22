import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollTracker]',
  standalone: true
})
export class ScrollTrackerDirective {
  @Output() scrollingFinished = new EventEmitter<void>();

  bottomIndent: number = 300;
  emitted = false;

  @HostListener("window:scroll", [])
  onScroll(): void {

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - this.bottomIndent;

    if (scrollPosition >= threshold && !this.emitted) {
      this.emitted = true;
      this.scrollingFinished.emit();
    } else if (scrollPosition < threshold) {
      this.emitted = false;
    }
  }
}