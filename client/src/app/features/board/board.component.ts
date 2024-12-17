import { Component, inject } from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { Advertisement } from '../../shared/models/advertisement';
import { MatCard } from '@angular/material/card';
import { AdvertisementItemComponent } from "./advertisement-item/advertisement-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { BoardParams } from '../../shared/models/boardParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

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
    FormsModule
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
    this.initializeShop();
  }

  initializeShop() {
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

  osSearchChange() {
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
        selectedBrands: this.boardParams.categories,
        selectedTypes: this.boardParams.locations
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.boardParams.categories = result.selectedBrands;
          this.boardParams.locations = result.selectedTypes;
          this.boardParams.pageNumber = 1;
          this.getAdvertisements();
        }
      }
    })
  }
}
