import { Component, inject, signal } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Contact } from '../../../utils/contact.model';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-suggestions',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './suggestions.html',
  styleUrl: './suggestions.css',
})
export class Suggestions {
  contactService = inject(ContactService);
  dublicateGroups = signal<Contact[][]>([]);
  loadingGroups = signal<boolean[]>([]);
  ngOnInit() {
    this.dublicateGroups.set(this.contactService.duplicateContacts());
  }
  showContacts() {
    console.log(this.contactService.duplicateContacts());
  }
  mergeContacts(index: number, contacts: Contact[]) {
    // Start loading
    this.loadingGroups.update((arr) => {
      const clone = [...arr];
      clone[index] = true;
      return clone;
    });

    try {
      setTimeout(() => {
        console.log('Merging ' + contacts.length + ' contacts');
        console.log('Merging ' + this.loadingGroups()[index] + ' contacts');

        // Stop loading after 3s

        const mergedItem = this.contactService.mergeDuplicates(contacts);
        this.dublicateGroups.update((groups) =>
          groups.map((group, i) => (i === index ? [mergedItem] : group))
        );
        this.loadingGroups.update((arr) => {
          const clone = [...arr];
          clone[index] = false;
          return clone;
        });
      }, 3000);
    } catch (error) {
      console.error('Merge error:', error);
    }
  }
  mergeAllContacts() {
    this.contactService.duplicateContacts().forEach((group, index) => {
      this.mergeContacts(index, group);
    });
  }
  dismissMerge(contacts: Contact[]) {
    this.contactService.dismissMerge(contacts);
    this.dublicateGroups.set(this.contactService.duplicateContacts());
  }

  // alert('Merging ' + contacts.length + ' contacts');
  // const result = this.contactService.mergeDuplicates(contacts);
  // console.log('result', result);
}
