import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { ContactService } from '../../services/contact.service';
import { LabelService } from '../../services/label.service';
import { Label } from '../../../utils/label.modal';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-label',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatRadioModule,
    FormsModule,
    
  ],
  templateUrl: './delete-label.html',
  styleUrl: './delete-label.css',
})
export class DeleteLabel {
  isLoading: boolean = false;
  deleteContacts: boolean = false;
  labelService = inject(LabelService);
  contactService = inject(ContactService);
  label: Label | undefined;
  constructor(
    private dialogRef: MatDialogRef<DeleteLabel>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private snackBar: MatSnackBar
  ) {
    console.log(this.data);
    this.label = this.labelService.getLabelById(this.data.id);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    try {
      if (!this.label) return;
      this.isLoading = true;

      if (this.deleteContacts && this.label) {
        alert("yes")
        console.log(this.label)
        this.label.contacts.forEach((id) => this.contactService.deleteContact(id,  this.label!.id));
      }

      this.labelService.deleteLabel(this.data.id);

      this.snackBar.open('Label deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar'],
      });

      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error deleting label:', error);
      this.isLoading = false;

      this.snackBar.open('Failed to delete label. Please try again.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
    }
  }
}
