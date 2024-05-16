import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, inject } from '@angular/core';
import { StoreService } from '../../../services/store';

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

  public store = inject(StoreService);
  
  pages: number[] = [];
  maxPagesToShow = 3; // Maximum number of pages to show

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalPages']?.currentValue) {
      this.generatePagesArray();
    }
  }

  private generatePagesArray(): void {
    const pages = [];
    const half = Math.floor(this.maxPagesToShow / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = Math.min(this.currentPage + half, this.totalPages);

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push(-1); // Use -1 as a placeholder for ellipses
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < this.totalPages) {
      if (end < this.totalPages - 1) {
        pages.push(-1); // Use -1 as a placeholder for ellipses
      }
      pages.push(this.totalPages);
    }

    this.pages = pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChanged.emit(page);
      this.generatePagesArray();
    }
  }
}
