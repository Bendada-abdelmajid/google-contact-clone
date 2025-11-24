import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Contact } from '../../../utils/contact.model';
import { ContactService } from '../../services/contact.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog';

@Component({
  selector: 'app-trush',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    RouterLink,
  ],
  templateUrl: './trush.html',
  styleUrl: './trush.css',
})
export class Trush {
  contactService = inject(ContactService);
  selectedContacts = signal<Contact[]>([]);
  displayedColumns: string[] = ['name', 'phone', 'deleted-date', 'actions'];
  dialog = inject(MatDialog);
  constructor() {
    console.log(this.contactService.deletedContacts());
  }
  selectAll() {
    // Set all contacts
    this.selectedContacts.set([...this.contactService.deletedContacts()]);
  }

  deselectAll() {
    this.selectedContacts.set([]);
  }
  toggleSelection(contact: Contact) {
    const current = [...this.selectedContacts()];
    const index = current.findIndex((c) => c.id === contact.id);
    if (index > -1) {
      // Remove if already selected
      current.splice(index, 1);
    } else {
      // Add if not selected
      current.push(contact);
    }
    this.selectedContacts.set(current);
  }
  isSelected(contact: Contact): boolean {
    return this.selectedContacts().some((c) => c.id === contact.id);
  }
  delete(contacts: Contact[], state: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { count: contacts.length, state: state },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        contacts.forEach((el) => {
          this.contactService.permanentlyDelete(el.id, el.labelIds);
        });
      }
      this.selectedContacts.set([]);
    });
  }
  recover(contacts: Contact[]) {
    contacts.forEach((el) => {
      this.contactService.recoverContact(el.id, el.labelIds);
    });

    this.selectedContacts.set([]);
  }
}
