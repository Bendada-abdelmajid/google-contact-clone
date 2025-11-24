import { Component, Inject, Input, output, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LabelService } from '../../services/label.service';
import { Label } from '../../../utils/label.modal';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-label-form',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './label-form.html',
  styleUrl: './label-form.css',
  standalone: true,
})
export class LabelForm {
  title = signal<string>('Create label');
  name = signal<string>('');
  update = signal<boolean>(false);

  constructor(
    private dialogRef: MatDialogRef<LabelForm>,
    @Inject(MAT_DIALOG_DATA) public data: { name?: string; id?: string, onConfirm?: (label: Label) => void; },
    private labelService: LabelService,
    private snackBar: MatSnackBar
  ) {

    if (data.name) {
      this.title.set('Rename label');
      this.name.set(data.name);
      this.update.set(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    try {
      if (this.name()) {
        if (this.data.id) {
          this.labelService.updateLabel(this.data.id, { name: this.name() });
          this.snackBar.open('Label updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        } else {
          const newLabel = this.labelService.addLabel(this.name());
         if (this.data.onConfirm) {
          this.data.onConfirm(newLabel);
        }

          this.snackBar.open('Label added successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        }
        this.dialogRef.close(true);
      } else {
        this.snackBar.open('Please enter a label name', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['warning-snackbar'],
        });
      }
    } catch (error) {
      console.error('Error adding label:', error);
      this.snackBar.open('Failed to add label. Please try again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }
}
