import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.css',

})
export class DeleteDialogComponent {
 constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { count: number, state?:string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
