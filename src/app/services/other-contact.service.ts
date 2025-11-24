import { afterNextRender, Injectable, signal } from '@angular/core';
import { Contact } from '../../utils/contact.model';

@Injectable({
  providedIn: 'root'
})
export class OtherContactService {
  private contactsSignal = signal<Contact[]>([]);
  
  contacts = this.contactsSignal.asReadonly();

  constructor() {
    afterNextRender(() => {
      this.loadContacts();
    });
  }

  // ✅ Load and convert to Contact instances
  private loadContacts(): void {
    try {
      const storedContacts = localStorage.getItem('other-contacts');
      if (storedContacts) {
        const parsed = JSON.parse(storedContacts);
        // ✅ Convert plain objects to Contact instances
        const contactInstances = parsed.map((data: any) => new Contact(data));
        this.contactsSignal.set(contactInstances);
      }
    } catch (error) {
      console.error('Error loading contacts from localStorage:', error);
      this.contactsSignal.set([]);
    }
  }

  getContacts(): Contact[] {
    return this.contactsSignal();
  }

  getContactById(id: string): Contact | undefined {
    return this.contactsSignal().find(contact => contact.id === id);
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
    const updatedContacts = currentContacts.map(contact => {
    if (contact.id === id) {
      // Update properties directly instead of creating new instance
      return Object.assign(contact, {...updatedContact, lastEdited: new Date().toISOString()});
    }
    return contact;
  });
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  deleteContact(id: string): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.filter(contact => contact.id !== id);
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  // ✅ Update to return new Contact instance
  toggleFavorite(id: string): void {
    const currentContacts = this.contactsSignal();
    const updatedContacts = currentContacts.map(contact =>
      contact.id === id ? new Contact({ ...contact, favorite: !contact.favorite }) : contact
    );
    this.contactsSignal.set(updatedContacts);
    this.saveToLocalStorage(updatedContacts);
  }

  getFavorites(): Contact[] {
    return this.contactsSignal().filter(contact => contact.favorite);
  }



  private saveToLocalStorage(contacts: Contact[]): void {
    try {
      localStorage.setItem('other-contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts to localStorage:', error);
    }
  }

  clearAllContacts(): void {
    this.contactsSignal.set([]);
    localStorage.removeItem('other-contacts');
  }
}