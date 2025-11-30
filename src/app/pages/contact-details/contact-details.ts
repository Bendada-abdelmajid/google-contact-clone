import { Component, inject, signal, computed } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../../utils/contact.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePicker } from '../../components/profile-picker/profile-picker';
import { MatMenuModule } from '@angular/material/menu';
import { ActionsMenu } from '../../components/actions-menu/actions-menu';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LabelSelector } from '../../components/label-selector/label-selector';
import { LabelService } from '../../services/label.service';
import { Label } from '../../../utils/label.modal';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-contact-details',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterLink,
    ProfilePicker,
    MatMenuModule,
    ActionsMenu,
    MatTooltipModule,
    LabelSelector,
  ],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css',
})
export class ContactDetails {
  contactService = inject(ContactService);
  labelService = inject(LabelService);

  contactId = signal<string>('');
  loading = signal<boolean>(false);
  dialog = inject(DialogService);
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

    return contactData;
  });
  contactLabels = computed<Label[]>(() => {
    const currentContact = this.contact();
    const labels = currentContact?.labelIds?.map((id) => this.labelService.getLabelById(id));
    console.log(labels);
    return labels?.filter((l): l is Label => !!l) || [];
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
      console.log(this.duplicatesContacts());
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

  avatarChange(url: string, el: HTMLDivElement) {
    const current = this.contact();
    if (!current) return;
    document.getElementById('loader')?.classList.add('show');
    el.classList.add('disabled');
    setTimeout(() => {
      this.contactService.updateContact(current.id, { photoUrl: url });
      document.getElementById('loader')?.classList.remove('show');
      el.classList.remove('disabled');
    }, 2000);

    // this.selectedAvatar.set(url);
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
  handleLabelApply(selectedLabels: Label[]) {
    const current = this.contact();
    if (!current) return;
    this.contactLabels().forEach((el) => {
      this.labelService.removeContactFromLabel(el.id, current.id);
    });
    selectedLabels.forEach((el) => {
      this.labelService.addContactToLabel(el.id, current.id);
    });
    this.contactService.updateContact(current.id, { labelIds: selectedLabels.map((el) => el.id) });
  }
}
