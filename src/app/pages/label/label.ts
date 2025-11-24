import { Component, signal, computed } from '@angular/core';
import { Contact } from '../../../utils/contact.model';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { LabelService } from '../../services/label.service';
import { Label } from '../../../utils/label.modal';
import { DataTable } from '../../components/data-table/data-table';

@Component({
  selector: 'app-label',
  imports: [DataTable],
  templateUrl: './label.html',
  styleUrl: './label.css',
})
export class LabelPage {
  labelId = signal<string>('');

  // ✅ Automatically updates when labels change
  label = computed(() => {
    const id = this.labelId();
    return this.labelService.labels().find(l => l.id === id);
  });

  // ✅ Automatically updates when label.contacts changes
  contacts = computed(() => {
    const currentLabel = this.label();
    if (!currentLabel?.contacts?.length) return [];
    
    return currentLabel.contacts
      .map((contactId) => this.contactService.getContactById(contactId))
      .filter((c): c is Contact => !!c);
  });

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private labelService: LabelService
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.labelId.set(id);
        console.log('Label ID:', id);
        console.log('Contacts:', this.contacts());
      }
    });
  }
}