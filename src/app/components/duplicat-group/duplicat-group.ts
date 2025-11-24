import { Component, inject, Input } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../../utils/contact.model';

@Component({
  selector: 'app-duplicat-group',
  templateUrl: './duplicat-group.html',
  styleUrls: ['./duplicat-group.css'],
})
export class DuplicatGroup {
  contactService = inject(ContactService);
  @Input() dublicateGroups: Contact[][] = [];
 
  mergeContacts(index: number, contacts: Contact[]) {
    alert('Merging ' + contacts.length + ' contacts');
    const mergedItem = this.contactService.mergeDuplicates(contacts);
    this.dublicateGroups = this.dublicateGroups.map((group, i) => {
      if (i === index) {
        // Replace the group with the merged item
        return [mergedItem];
      }
      return group;
    });
  }
}
