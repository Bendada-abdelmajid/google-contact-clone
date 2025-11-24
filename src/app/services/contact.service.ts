import { afterNextRender, computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Addresse, Contact } from '../../utils/contact.model';
import { LabelService } from './label.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactsSignal = signal<Contact[]>([]);
  private labelService = inject(LabelService);

  contacts = computed(() => this.contactsSignal().filter((c) => !c.hidden && !c.deleted));
  favorites = computed(() =>
    this.contactsSignal().filter((c) => c.favorite && !c.hidden && !c.deleted)
  );
  otherContacts = computed(() => this.contactsSignal().filter((c) => c.hidden && !c.deleted));
  deletedContacts = computed(() => this.contactsSignal().filter((c) => c.deleted));
  duplicateContacts: Signal<Contact[][]> = computed(() =>
    this.findDuplicateContacts(this.contactsSignal())
  );
findDuplicateContact(conatctsList: Contact[]): Contact[][] {
    return this.findDuplicateContacts(conatctsList);
  }
  findDuplicateContacts(conatctsList: Contact[]): Contact[][] {
    const processed = new Set<string>();
    const duplicateGroups: Contact[][] = [];

    const activeContacts = conatctsList.filter((c) => !c.deleted && !c.hidden && !c.dismissMergeSuggestion);
    for (let i = 0; i < activeContacts.length; i++) {
      if (processed.has(activeContacts[i].id)) continue;

      const group: Contact[] = [activeContacts[i]];
      processed.add(activeContacts[i].id);

      for (let j = i + 1; j < activeContacts.length; j++) {
        if (processed.has(activeContacts[j].id)) continue;

        const matchResult = this.calculateMatch(activeContacts[i], activeContacts[j]);

        if (matchResult >= 70) {
          // Threshold
          group.push(activeContacts[j]);
          processed.add(activeContacts[j].id);
        }
      }

      if (group.length > 1) {
        duplicateGroups.push(group);
      }
    }

    return duplicateGroups;
  }
  constructor() {
    afterNextRender(() => {
      this.loadContacts();
    });
  }

  // ✅ Load and convert to Contact instances
  private loadContacts(): void {
    try {
      const storedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      if (storedContacts) {
        // ✅ Convert plain objects to Contact instances
        let contactInstances = storedContacts.map((data: any) => new Contact(data));
        const now = Date.now();
        contactInstances = contactInstances.filter((c: Contact) => {
          if (
            c.deleted &&
            c.deletedAt &&
            now - new Date(c.deletedAt).getTime() > 30 * 24 * 60 * 60 * 1000
          ) {
            return false;
          }
          return true;
        });

        this.contactsSignal.set(contactInstances);
      }
    } catch (error) {
      console.error('Error loading contacts from localStorage:', error);
      this.contactsSignal.set([]);
    }
  }

  getContactById(id: string): Contact | undefined {
    return this.contactsSignal().find((contact) => contact.id === id);
  }

  addContact(contact: Contact): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = [...currentContacts, contact];
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  // ✅ Update to return new Contact instance
  updateContact(id: string, updatedContact: Partial<Contact>): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.map((contact) => {
      if (contact.id === id) {
        // Update properties directly instead of creating new instance
        return Object.assign(contact, { ...updatedContact, lastEdited: new Date().toISOString() });
      }
      return contact;
    });
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }
  toogelLabel(id: string, labelId: string): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.map((contact) => {
      if (contact.id === id) {
        const labelsIds = contact.labelIds?.includes(labelId)
          ? contact.labelIds.filter((el) => el != labelId)
          : [...(contact.labelIds || []), labelId];
        // Update properties directly instead of creating new instance
        return Object.assign(contact, { labelIds: labelsIds });
      }
      return contact;
    });
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  deleteContact(id: string, deleteLabelId?: string): void {
    const currentContacts = this.contactsSignal();
    let labelIds: string[] = [];
    const updatedContacts = currentContacts.map((c) => {
      if (c.id === id) {
        // ✅ Explicitly pass id to prevent regeneration
        labelIds =
          deleteLabelId && c.labelIds
            ? c.labelIds.filter((lid) => lid !== deleteLabelId)
            : c.labelIds || [];
        const deletedContact = new Contact({
          ...c,
          id: c.id, // Preserve the original id
          deleted: true,
          deletedAt: new Date(),
          labelIds: labelIds,
        });

        console.log('Deleted contact:', deletedContact);
        return deletedContact;
      }
      return c;
    });

    if (labelIds && labelIds?.length > 0) {
      labelIds.forEach((labelId) => {
        this.labelService.removeContactFromLabel(labelId, id);
      });
    }

    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }
  recoverContact(id: string, labelIds?: string[]): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.map((c) =>
      c.id === id ? Object.assign(c, { ...c, deleted: false, deletedAt: undefined }) : c
    );
    if (labelIds && labelIds?.length > 0) {
      labelIds.forEach((labelId) => {
        this.labelService.addContactToLabel(labelId, id);
      });
    }
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  permanentlyDelete(id: string, labelIds?: string[]) {
    const updatedContacts = this.contactsSignal().filter((c) => c.id !== id);
    if (labelIds && labelIds?.length > 0) {
      labelIds.forEach((labelId) => {
        this.labelService.removeContactFromLabel(labelId, id);
      });
    }
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  // ✅ Update to return new Contact instance
  toggleFavorite(id: string): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.map((contact) =>
      contact.id === id ? new Contact({ ...contact, favorite: !contact.favorite }) : contact
    );
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }
  toggleHidden(id: string): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.map((contact) =>
      contact.id === id ? Object.assign(contact, { ...contact, hidden: !contact.hidden }) : contact
    );
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  searchContacts(query: string): Contact[] {
    const lowerQuery = query.toLowerCase();
    return this.contactsSignal().filter(
      (contact) =>
        contact.firstName?.toLowerCase().includes(lowerQuery) ||
        contact.lastName?.toLowerCase().includes(lowerQuery) ||
        contact.company?.toLowerCase().includes(lowerQuery) ||
        contact.emails?.some((e) => e.value?.toLowerCase().includes(lowerQuery))
    );
  }

  private saveToLocalStorage(contacts: Contact[]): void {
    try {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts to localStorage:', error);
    }
  }

  clearAllContacts(): void {
    this.contactsSignal.set([]);
    localStorage.removeItem('contacts');
  }

  // Calculate match score between two contacts
  calculateMatch(c1: Contact, c2: Contact): number {
    let score = 0;

    // Email match (strongest signal)
    if (c1.emails && c2.emails) {
      const hasMatchingEmail = c1.emails.some((email1) =>
        c2.emails!.some((email2) => email1?.value && email2?.value && email1?.value.toLowerCase() === email2?.value.toLowerCase())
      );
      if (hasMatchingEmail) {
        score += 50;
      }
    }
    // Phone match
    if (c1.phones && c2.phones) {
      const hasMatchingPhone = c1.phones.some((phone1) =>
        c2.phones!.some(
          (phone2) => this.normalizePhone(phone1.value) === this.normalizePhone(phone2.value)
        )
      );

      if (hasMatchingPhone) {
        score += 30;
      }
    }
    // Name similarity
    const nameSimilarity = this.calculateNameSimilarity(c1, c2);

    if (nameSimilarity > 0.8) {
      score += nameSimilarity * 20;
    }

    return score;
  }

  // Calculate name similarity using Levenshtein distance
  calculateNameSimilarity(c1: Contact, c2: Contact): number {
    const name1 = `${c1.firstName} ${c1.lastName}`.toLowerCase().trim();
    const name2 = `${c2.firstName} ${c2.lastName}`.toLowerCase().trim();

    const distance = this.levenshteinDistance(name1, name2);
    const maxLength = Math.max(name1.length, name2.length);

    return 1 - distance / maxLength;
  }

  // Levenshtein distance algorithm
  levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Normalize phone numbers for comparison
  normalizePhone(phone: string): string {
    return phone.replace(/\D/g, ''); // Remove non-digits
  }
  mergeContacts(contacts: Contact[]): Contact {
    if (contacts.length === 0) throw new Error('No contacts to merge');
    if (contacts.length === 1) return contacts[0];

    // Sort by lastEdited to prioritize most recently updated contact
    const sortedContacts = [...contacts].sort(
      (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
    );

    const merged = new Contact({
      id: sortedContacts[0].id, // Keep the most recently edited contact's ID
      addedDate: this.getEarliestDate(contacts.map((c) => c.addedDate)),
      lastEdited: new Date().toISOString(), // Set to now since we're merging
    });

    // Merge simple string fields - prioritize non-empty values
    merged.firstName = this.selectBestValue(contacts.map((c) => c.firstName));
    merged.lastName = this.selectBestValue(contacts.map((c) => c.lastName));
    merged.nickName = this.selectBestValue(contacts.map((c) => c.nickName));
    merged.jobTitle = this.selectBestValue(contacts.map((c) => c.jobTitle));
    merged.company = this.selectBestValue(contacts.map((c) => c.company));
    merged.birthday = this.selectBestValue(contacts.map((c) => c.birthday));
    merged.photoUrl = this.selectBestValue(contacts.map((c) => c.photoUrl));

    // Merge notes - combine all notes
    merged.note = this.mergeNotes(contacts);

    // Merge emails - remove duplicates
    merged.emails = this.mergeEmails(contacts);

    // Merge phones - remove duplicates
    merged.phones = this.mergePhones(contacts);

    // Merge addresses - remove duplicates
    merged.addresses = this.mergeAddresses(contacts);

    // Merge labelIds - combine unique labels
    merged.labelIds = this.mergeLabelIds(contacts);

    // Merge boolean fields
    merged.favorite = contacts.some((c) => c.favorite); // True if any contact is favorite
    merged.hidden = contacts.every((c) => c.hidden); // Hidden only if all are hidden
    merged.deleted = false; // Merged contact should not be deleted
    merged.deletedAt = undefined;

    return merged;
  }

  // Select the first non-empty value, preferring from most recently edited contact
  private selectBestValue(values: (string | undefined)[]): string | undefined {
    return values.find((v) => v && v.trim().length > 0);
  }

  // Get the earliest date from array of date strings
  private getEarliestDate(dates: string[]): string {
    return dates.reduce((earliest, current) =>
      new Date(current) < new Date(earliest) ? current : earliest
    );
  }

  // Merge all notes into one
  private mergeNotes(contacts: Contact[]): string | undefined {
    const notes = contacts.map((c) => c.note).filter((note) => note && note.trim().length > 0);

    if (notes.length === 0) return undefined;
    if (notes.length === 1) return notes[0];

    // Combine notes with separator
    return notes.join('\n\n---\n\n');
  }

  // Merge emails and remove duplicates
  private mergeEmails(contacts: Contact[]): { label: string; value: string }[] | undefined {
    const allEmails: { label: string; value: string }[] = [];
    const seenEmails = new Set<string>();

    for (const contact of contacts) {
      if (contact.emails) {
        for (const email of contact.emails) {
          const normalizedEmail = email.value.toLowerCase().trim();
          if (!seenEmails.has(normalizedEmail)) {
            seenEmails.add(normalizedEmail);
            allEmails.push(email);
          }
        }
      }
    }

    return allEmails.length > 0 ? allEmails : undefined;
  }

  // Merge phones and remove duplicates
  private mergePhones(contacts: Contact[]): { label: string; value: string }[] | undefined {
    const allPhones: { label: string; value: string }[] = [];
    const seenPhones = new Set<string>();

    for (const contact of contacts) {
      if (contact.phones) {
        for (const phone of contact.phones) {
          const normalizedPhone = this.normalizePhone(phone.value);
          if (!seenPhones.has(normalizedPhone)) {
            seenPhones.add(normalizedPhone);
            allPhones.push(phone);
          }
        }
      }
    }

    return allPhones.length > 0 ? allPhones : undefined;
  }

  // Merge addresses and remove duplicates
  private mergeAddresses(contacts: Contact[]): Addresse[] | undefined {
    const allAddresses: Addresse[] = [];
    const seenAddresses = new Set<string>();

    for (const contact of contacts) {
      if (contact.addresses) {
        for (const address of contact.addresses) {
          // Create a unique key for the address
          const addressKey = this.getAddressKey(address);
          if (!seenAddresses.has(addressKey)) {
            seenAddresses.add(addressKey);
            allAddresses.push(address);
          }
        }
      }
    }

    return allAddresses.length > 0 ? allAddresses : undefined;
  }

  // Create a unique key for an address to detect duplicates
  private getAddressKey(address: Addresse): string {
    return `${address.street}|${address.city}|${address.postalCode}|${address.country}`
      .toLowerCase()
      .trim();
  }

  // Merge label IDs and remove duplicates
  private mergeLabelIds(contacts: Contact[]): string[] | undefined {
    const allLabelIds = new Set<string>();

    for (const contact of contacts) {
      if (contact.labelIds) {
        contact.labelIds.forEach((id) => allLabelIds.add(id));
      }
    }

    return allLabelIds.size > 0 ? Array.from(allLabelIds) : undefined;
  }
  mergeDuplicates(duplicateGroup: Contact[]): Contact {
    if (duplicateGroup.length < 2) {
      throw new Error('Need at least 2 contacts to merge');
    }

    // Merge all contacts into one
    const mergedContact = this.mergeContacts(duplicateGroup);

    // Get IDs of contacts to remove (all except the merged one)
    const idsToRemove = duplicateGroup.map((c) => c.id).filter((id) => id !== mergedContact.id);

    // Update the contacts list
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.filter((c) => !idsToRemove.includes(c.id));

    // Find and update the merged contact in the list
    const finalContacts = updatedContacts.map((c) =>
      c.id === mergedContact.id ? mergedContact : c
    );

    this.contactsSignal.set(finalContacts);
    this.saveToLocalStorage(finalContacts);
    return mergedContact
  }
  dismissMerge(contacts: Contact[]): void {
   contacts.forEach(contact=>{
    this.updateContact(contact.id , {dismissMergeSuggestion: true})
   })
  
  
    // No action needed as duplicates remain unchanged
  }
}
