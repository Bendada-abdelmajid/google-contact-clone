import { Component, inject, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { exportContactsToCSV, printContact } from '../../../utils/utils';
import { Contact } from '../../../utils/contact.model';
import { ContactService } from '../../services/contact.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-actions-menu',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './actions-menu.html',
  styleUrl: './actions-menu.css',
})
export class ActionsMenu{
  @Input() deselect?: () => void;
  @Input() detailsPage?: boolean;
  contactService = inject(ContactService);
  private _contacts = signal<Contact[]>([]);
   @Input() contacts:Contact[] = [];
  dialog = inject(DialogService);

  print() {
    printContact(this.contacts);
    if (this.deselect) {
      this.deselect();
    }
  }
  export() {
    exportContactsToCSV(this.contacts);
    if (this.deselect) {
      this.deselect();
    }
  }
  toggleHidden() {
    console.log(this.contacts);
    this.contacts.forEach((el) => {
      this.contactService.toggleHidden(el.id);
    });
    if (this.deselect) {
      this.deselect();
    }
  }
  deleteAll() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {data:{count: this.contacts.length}});
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.contacts.forEach((el) => this.contactService.deleteContact(el.id));
      }
  if (this.deselect) {
      this.deselect();
    }
    });
  }
}
