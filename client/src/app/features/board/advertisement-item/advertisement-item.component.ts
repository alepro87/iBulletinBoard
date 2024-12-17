import { Component, Input } from '@angular/core';
import { Advertisement } from '../../../shared/models/advertisement';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-advertisement-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './advertisement-item.component.html',
  styleUrl: './advertisement-item.component.scss'
})
export class AdvertisementItemComponent {
  @Input() advertisement?: Advertisement;
}
