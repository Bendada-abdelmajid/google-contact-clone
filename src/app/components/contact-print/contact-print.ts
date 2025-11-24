import { Component, computed, inject, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { exportContactsToCSV, printContact } from '../../../utils/utils';
import { Contact } from '../../../utils/contact.model';
import { ContactService } from '../../services/contact.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog';

@Component({
  selector: 'app-contact-print',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './contact-print.html',
  styleUrl: './contact-print.css',
})
export class ContactPrint {
  @Input() deselect?: () => void;
  @Input() detailsPage?: boolean;
  contactService = inject(ContactService);
  private _contacts = signal<Contact[]>([]);
   @Input() contacts:Contact[] = [];
  dialog = inject(MatDialog);
  // @Input()
  // set contacts(value: Contact[]) {
  //   this._contacts.set(value || []);
  // }
  // get contacts(): Contact[] {
  //   return this._contacts();
  // }

  // inContacts = computed(() => {
  //   const contacts = this._contacts();
  //   if (contacts.length === 0) return false;
  //   return contacts[0].hidden;
  // });
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
