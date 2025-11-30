import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef, MatDialogTitle, MatDialogClose } from '@angular/material/dialog';
;
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-labels-info',
  imports: [MatDialogTitle, MatDialogContent, MatButtonModule, MatIcon, MatDialogClose],
  templateUrl: './labels-info.html',
  styleUrl: './labels-info.css',
})
export class LabelsInfo {
 constructor(
    private dialogRef: MatDialogRef<LabelsInfo>,
  ) {
  
  }
}
