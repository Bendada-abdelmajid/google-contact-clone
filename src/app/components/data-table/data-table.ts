import { Component, computed, inject, Input, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../../utils/contact.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { LabelService } from '../../services/label.service';
import { exportContactsToCSV, printContact } from '../../../utils/utils';
import { ContactPrint } from '../contact-print/contact-print';
import { AddBtn } from '../add-btn/add-btn';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    RouterLink,
    ContactPrint,
    AddBtn
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  private router = inject(Router);
  @Input() data: Contact[] = [];
  contactService = inject(ContactService);
  labelService = inject(LabelService);
  displayedColumns: string[] = ['name', 'email', 'phone', 'job', 'actions'];

  dialog = inject(MatDialog);

  constructor(private snackBar: MatSnackBar) {}

  selectedContacts = signal<Contact[]>([]);

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

  selectAll() {
    // Set all contacts
    this.selectedContacts.set([...this.data]);
  }

  deselectAll() {
    this.selectedContacts.set([]);
  }

  isSelected(contact: Contact): boolean {
    return this.selectedContacts().some((c) => c.id === contact.id);
  }

  toggleFavorite({ id, name, remove }: { id: string; name: string; remove: boolean }) {
    const message = remove ? `removed ${name} from favorites ` : `added ${name} to favorites`;
    this.snackBar.open('working...', '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });
    setTimeout(() => {
      this.contactService.toggleFavorite(id);
      this.snackBar.open(message, 'close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar'],
      });
    }, 3000);
  }
  showDetails(id: string) {
    this.router.navigate(['/person', id]);
  }
  toogelLabel(labelId: string, contactId: string, hasContact: boolean) {
    alert(hasContact);
    if (hasContact) {
      this.labelService.removeContactFromLabel(labelId, contactId);
     
    } else {
      this.labelService.addContactToLabel(labelId, contactId);
  
    }
       this.contactService.toogelLabel(contactId, labelId);
  }
 

}
