import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Advertisement } from '../../../shared/models/advertisement';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-advertisement-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    RouterLink,
    MatIcon,
    MatButton,
    MatButtonModule
  ],
  templateUrl: './advertisement-item.component.html',
  styleUrl: './advertisement-item.component.scss'
})
export class AdvertisementItemComponent {
  @Input() advertisement?: Advertisement;
  @Output() edit = new EventEmitter<Advertisement>();
  @Output() delete = new EventEmitter<number>();

  // Add logic to determine if current user is owner
  get isOwner(): boolean {
    // Implement based on your authentication system
    return true; // Temporary - replace with actual check
  }

  onEdit() {
    this.edit.emit(this.advertisement);
  }

  onDelete() {
    this.delete.emit(this.advertisement?.id);
  }
}
