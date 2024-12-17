import { Component, inject } from '@angular/core';
import { BoardService } from '../../../core/services/board.service';
import { MatDivider } from '@angular/material/divider';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
  boardService = inject(BoardService);
  private dialogRef = inject(MatDialogRef<FiltersDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  selectedCategories: string[] = this.data.selectedCategories;
  selectedLocations: string[] = this.data.selectedLocations;

  applyFilters() {
    this.dialogRef.close({
      selectedCategories: this.selectedCategories,
      selectedLocations: this.selectedLocations
    })
  }
}
