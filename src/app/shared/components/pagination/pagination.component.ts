import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Input() totalPages!: number;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  pages: number[] = [];

  ngOnChanges({ totalPages }: SimpleChanges) {
    if (totalPages?.currentValue) {
      this.generatePagesArray(totalPages.currentValue);
    }
  }

  private generatePagesArray(totalPages: number): void {
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }
}