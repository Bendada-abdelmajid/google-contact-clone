import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ContactImport } from '../contact-import/contact-import';


@Component({
  selector: 'app-empty-state',
  imports: [MatButton, MatIconModule, RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
   dialog = inject(MatDialog);
 import() {
    this.dialog.open(ContactImport, {});
  }
}
