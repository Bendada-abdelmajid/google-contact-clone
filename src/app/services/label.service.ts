import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { Label } from '../../utils/label.modal';
import { Contact } from '../../utils/contact.model';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private labelsSignal = signal<Label[]>([]);
  // private contactService = inject(ContactService);

  labels = this.labelsSignal.asReadonly();

  constructor() {
    afterNextRender(() => {
      this.loadLabels();
    });
  }

  // ✅ Load and convert to Label instances
  private loadLabels(): void {
    try {
      const storedLabels = localStorage.getItem('labels');
      if (storedLabels) {
        const parsed = JSON.parse(storedLabels);
        // ✅ Convert plain objects to Label instances
        const labelsInstances = parsed.map((data: any) => new Label(data));
        this.labelsSignal.set(labelsInstances);
      }
    } catch (error) {
      console.error('Error loading labels from localStorage:', error);
      this.labelsSignal.set([]);
    }
  }

  getLabels(): Label[] {
    return this.labelsSignal();
  }

  getLabelById(id: string): Label | undefined {
    return this.labelsSignal().find((label) => label.id === id);
  }

  addLabel(name: string, contactsList?: string[]): Label {
    const label = new Label({ name: name, contacts: contactsList ? contactsList : [] });
    const currentLabels = this.labelsSignal();

    const updatedLabels = [...currentLabels, label];

    this.labelsSignal.set(updatedLabels);
    this.saveToLocalStorage(updatedLabels);
    return label;
  }

  updateLabel(id: string, updatedLabel: Partial<Label>): void {
    const currentLabels = this.labelsSignal();
    const updatedLabels = currentLabels.map((label) => {
      if (label.id === id) {
        // Update properties directly
        return Object.assign(label, updatedLabel);
      }
      return label;
    });
    this.labelsSignal.set(updatedLabels);
    this.saveToLocalStorage(updatedLabels);
  }

  deleteLabel(id: string): void {
    const currentLabels = this.labelsSignal();
    const updatedLabels = currentLabels.filter((label) => label.id !== id);
    this.labelsSignal.set(updatedLabels);
    this.saveToLocalStorage(updatedLabels);
  }

  // Add a contact ID to a label
  addContactToLabel(labelId: string, contactId: string): void {
    const currentLabels = this.labelsSignal();
    const updatedLabels = currentLabels.map((label) => {
      if (label.id === labelId && !label.contacts.includes(contactId)) {
        return Object.assign(label, { contacts: [...label.contacts, contactId] });
      }
      return label;
    });
    // this.contactService.updateContact(contactId, { labelId: labelId });
    this.labelsSignal.set(updatedLabels);
    this.saveToLocalStorage(updatedLabels);
  }

  // Remove a contact ID from a label
  removeContactFromLabel(labelId: string, contactId: string): void {
    const currentLabels = this.labelsSignal();
    const updatedLabels = currentLabels.map((label) => {
      if (label.id === labelId) {
        return Object.assign(label, {
          contacts: label.contacts.filter((id) => id !== contactId),
        });
      }
      return label;
    });
    // this.contactService.updateContact(contactId, { labelId: undefined });
    this.labelsSignal.set(updatedLabels);
    this.saveToLocalStorage(updatedLabels);
  }

  // Get all labels containing a specific contact
  getLabelsByContactId(contactId: string): Label[] {
    return this.labelsSignal().filter((label) => label.contacts.includes(contactId));
  }

  searchLabels(query: string): Label[] {
    const lowerQuery = query.toLowerCase();
    return this.labelsSignal().filter((label) => label.name?.toLowerCase().includes(lowerQuery));
  }

  private saveToLocalStorage(labels: Label[]): void {
    try {
      localStorage.setItem('labels', JSON.stringify(labels));
    } catch (error) {
      console.error('Error saving labels to localStorage:', error);
    }
  }

  clearAllLabels(): void {
    this.labelsSignal.set([]);
    localStorage.removeItem('labels');
  }
}
