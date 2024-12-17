import { Component, inject } from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { Advertisement } from '../../shared/models/advertisement';
import { MatCard } from '@angular/material/card';
import { AdvertisementItemComponent } from "./advertisement-item/advertisement-item.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { BoardParams } from '../../shared/models/boardParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';
import { AdvertisementFormComponent } from './advertisement-form/advertisement-form.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    AdvertisementItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  private boardService = inject(BoardService);
  private dialogService = inject(MatDialog);
  advertisements?: Pagination<Advertisement>;
  sortOptions = [
    { name: 'Alphabetical', value: 'title' },
    { name: 'Date: Old-New', value: 'dateAsc' },
    { name: 'Date: New-Old', value: 'dateDesc' }
  ]
  boardParams = new BoardParams();
  pageSizeOptions = [5, 10, 15, 20]

  ngOnInit(): void {
    this.initializeBoard();
  }

  initializeBoard() {
    this.boardService.getCategories();
    this.boardService.getLocations();
    this.getAdvertisements();
  }

  getAdvertisements() {
    this.boardService.getAdvertisements(this.boardParams).subscribe({
      next: response => this.advertisements = response,
      error: error => console.log(error)
    })
  }

  onSearchChange() {
    this.boardParams.pageNumber = 1;
    this.getAdvertisements();
  }

  handlePageEvent(event: PageEvent) {
    this.boardParams.pageNumber = event.pageIndex + 1;
    this.boardParams.pageSize = event.pageSize;
    this.getAdvertisements();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.boardParams.sort = selectedOption.value;
      this.boardParams.pageNumber = 1;
      this.getAdvertisements();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedCategories: this.boardParams.categories,
        selectedLocations: this.boardParams.locations
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.boardParams.categories = result.selectedCategories;
          this.boardParams.locations = result.selectedLocations;
          this.boardParams.pageNumber = 1;
          this.getAdvertisements();
        }
      }
    })
  }

  openAdvertisementForm(advertisement?: Advertisement) {
    const dialogRef = this.dialogService.open(AdvertisementFormComponent, {
      minWidth: '500px',
      data: { advertisement }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the advertisements list
        this.getAdvertisements();
      }
    });
  }

  deleteAdvertisement(id: number) {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      this.boardService.deleteAdvertisement(id).subscribe({
        next: () => {
          // Refresh the advertisements list
          this.getAdvertisements();
        },
        error: (error) => {
          console.error('Error deleting advertisement:', error);
        }
      });
    }
  }
}
