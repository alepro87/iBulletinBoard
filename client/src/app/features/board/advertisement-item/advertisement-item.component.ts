import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Advertisement } from '../../../shared/models/advertisement';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { BoardService } from '../../../core/services/board.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementFormComponent } from '../advertisement-form/advertisement-form.component';

@Component({
  selector: 'app-advertisement-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    RouterLink,
    MatIcon,
    MatButton,
    MatButtonModule,
    MatCardActions
  ],
  templateUrl: './advertisement-item.component.html',
  styleUrl: './advertisement-item.component.scss'
})
export class AdvertisementItemComponent {
  @Input() advertisement!: Advertisement;
  @Output() refresh = new EventEmitter<void>();
  
  private boardService = inject(BoardService);
  private dialog = inject(MatDialog);

  get canModify(): boolean {
    return this.boardService.isOwner(this.advertisement);
  }

  onEdit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(AdvertisementFormComponent, {
      width: '500px',
      data: { advertisement: this.advertisement }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh.emit();
      }
    });
  }


  onDelete(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this advertisement?')) {
      this.boardService.deleteAdvertisement(this.advertisement.id).subscribe({
        next: () => {
          this.refresh.emit();
        },
        error: (error) => {
          console.error('Error deleting advertisement:', error);
        }
      });
    }
  }
}
