import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { importContactsFromCSV } from '../../../utils/utils';
import { ContactService } from '../../services/contact.service';
import { LabelService } from '../../services/label.service';
import { Router } from '@angular/router';
import { LabelSelector } from '../label-selector/label-selector';
import { Label } from '../../../utils/label.modal';
import { Contact } from '../../../utils/contact.model';

@Component({
  selector: 'app-contact-import',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    LabelSelector,
  ],
  templateUrl: './contact-import.html',
  styleUrl: './contact-import.css',
})
export class ContactImport {
  private router = inject(Router);
  file: File | undefined = undefined;
  isLoading = false;
  contactLabels = signal<Label[]>([]);
  private contactService = inject(ContactService);
  private labelService = inject(LabelService);
  constructor(private dialogRef: MatDialogRef<ContactImport>) {}

  import(e: { target: HTMLInputElement }) {
    this.file = (e.target as HTMLInputElement).files?.[0];
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.file = input.files[0];
  }
  unSelectedFile() {
    this.file = undefined;
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
  handleLabelApply(selectedLabels: Label[]) {
    this.contactLabels.set(selectedLabels);
  }
 onConfirm(): void {
  if (!this.file) return;
  this.isLoading = true;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result as string;
    const contacts = importContactsFromCSV(text) as Contact[];
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    const newLabel = this.labelService.addLabel(`Imported on ${month}/${day}`, []);
    const labels = [newLabel, ...this.contactLabels()];
    
    contacts.forEach((contact) =>
      this.contactService.addContact(
        new Contact({ ...contact, labelIds: labels.map(label => label.id) })
      )
    );
    
    labels.forEach(label => 
      this.labelService.updateLabel(label.id, {
        ...label, 
        contacts: [...label.contacts, ...contacts.map(contact => contact.id)]
      })
    );
    
    setTimeout(() => {
      this.isLoading = false;
      this.dialogRef.close(true);
      this.router.navigate(['/label', newLabel.id]);
    }, 2000);
    
    console.log(contacts);
  };
  

  
  reader.readAsText(this.file);
}
}
