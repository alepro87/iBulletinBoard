import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Advertisement } from '../../../shared/models/advertisement';
import { BoardService } from '../../../core/services/board.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advertisement-form',
  standalone: true,
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    TextInputComponent
  ],
  templateUrl: './advertisement-form.component.html',
  styleUrl: './advertisement-form.component.scss'
})
export class AdvertisementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private boardService = inject(BoardService);
  public dialogRef = inject(MatDialogRef<AdvertisementFormComponent>);
  public data = inject(MAT_DIALOG_DATA);

  isEditMode: boolean;
  validationErrors?: string[];

  constructor() {
    this.isEditMode = !!this.data.advertisement;
  }

  advertisementForm = this.fb.group({
    title: [this.data.advertisement?.title || '', [Validators.required, Validators.minLength(3)]],
    description: [this.data.advertisement?.description || '', [Validators.required]],
    pictureUrl: [this.data.advertisement?.pictureUrl || ''],
    location: [this.data.advertisement?.location || '', [Validators.required]],
    category: [this.data.advertisement?.category || '', [Validators.required]],
    author: [this.data.advertisement?.author || '', [Validators.required]],
    authorEmail: [this.data.advertisement?.authorEmail || '', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.loadFormDependencies();
  }

  private loadFormDependencies() {
    this.boardService.getCategories();
    this.boardService.getLocations();
  }

  onSubmit() {
    if (this.advertisementForm.valid) {
      const formData = this.advertisementForm.value;
      const advertisementData: Partial<Advertisement> = {
        ...formData,
        postDate: this.isEditMode ? this.data.advertisement?.postDate : new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', ' at')
      };

      if (this.isEditMode) {
        this.boardService.updateAdvertisement(
          this.data.advertisement.id,
          { ...this.data.advertisement, ...advertisementData }
        ).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (errors) => {
            this.validationErrors = errors
            console.error('Error updating advertisement:', errors);
          }
        });
      } else {
        this.boardService.createAdvertisement(advertisementData as Advertisement).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (errors) => {
            this.validationErrors = errors
            console.error('Error creating advertisement:', errors);
          }
        });
      }
    }
  }
}
