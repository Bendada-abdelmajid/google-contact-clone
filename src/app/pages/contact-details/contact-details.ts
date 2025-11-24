import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../../utils/contact.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePicker } from '../../components/profile-picker/profile-picker';
import { MatMenuModule } from '@angular/material/menu';
import { ContactPrint } from '../../components/contact-print/contact-print';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog';

@Component({
  selector: 'app-contact-details',
  imports: [MatIconModule, MatButtonModule, RouterLink, ProfilePicker, MatMenuModule, ContactPrint],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css',
})
export class ContactDetails {
  contactService = inject(ContactService);
  selectedAvatar = signal<string | undefined>(undefined);
  contactId = signal<string>('');
  loading = signal<boolean>(false);
  dialog = inject(MatDialog);
  // ✅ Automatically updates when labels change
  contact = computed(() => {
    const id = this.contactId();
    const contactData = this.contactService.getContactById(id);

    if (!contactData && id) {
      // Contact not found
      this.snackBar.open('Contact not found', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/']);
      return null;
    }

    // Update avatar when contact changes
    if (contactData?.photoUrl !== this.selectedAvatar()) {
      this.selectedAvatar.set(contactData?.photoUrl);
    }

    return contactData;
  });
  duplicatesContacts = computed(() => {
    const contact = this.contact();
    if (!contact) return [];
    const duplicateGroups = this.contactService.duplicateContacts();
    const group = duplicateGroups.find((group) => group.some((c) => c.id === contact.id));
    return group ?? [];
  });
  duplicatesForCurrent = computed(() => {
    return this.duplicatesContacts().filter((c) => c.id !== this.contactId());
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.contactId.set(id);
      }
    });
  }

  mergeContacts() {
    try {
      this.loading.set(true);
      console.log(this.duplicatesContacts() );
      setTimeout(() => {
        

        // Stop loading after 3s

        this.contactService.mergeDuplicates(this.duplicatesContacts());

        this.loading.set(false);
      }, 2000);
    } catch (error) {
      console.error('Merge error:', error);
    }
  }
  dismissMerge(contacts: Contact[]) {
    this.contactService.dismissMerge(this.duplicatesContacts());
  }

  avatarChange(url: string) {
    this.selectedAvatar.set(url);
  }

  toggleFavorite() {
    const currentContact = this.contact();
    const remove = currentContact?.favorite ? true : false;
    const message = remove
      ? `removed ${currentContact?.firstName} from favorites`
      : `added ${currentContact?.firstName} to favorites`;

    this.snackBar.open('working...', '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    setTimeout(() => {
      // Use the previously read currentContact and guard it here to avoid undefined access
      if (!currentContact) return;

      this.contactService.toggleFavorite(currentContact.id);
      // Re-fetch the contact to get updated data
      // this.loadContact(currentContact.id);

      this.snackBar.open(message, 'close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar'],
      });
    }, 1000);
  }
  deleteContact() {
    const current = this.contact();
    if (!current) return;
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { count: 1 } });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.contactService.deleteContact(current.id);
        console.log(this.contact());
      }
    });
  }
}
