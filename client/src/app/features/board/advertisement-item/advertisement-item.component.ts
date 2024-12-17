import { Component, Input } from '@angular/core';
import { Advertisement } from '../../../shared/models/advertisement';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-advertisement-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    RouterLink
  ],
  templateUrl: './advertisement-item.component.html',
  styleUrl: './advertisement-item.component.scss'
})
export class AdvertisementItemComponent {
  @Input() advertisement?: Advertisement;
}
