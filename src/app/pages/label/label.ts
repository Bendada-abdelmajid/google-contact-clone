import { Component, signal, computed, inject } from '@angular/core';
import { Contact } from '../../../utils/contact.model';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { LabelService } from '../../services/label.service';
import { Label } from '../../../utils/label.modal';
import { DataTable } from '../../components/data-table/data-table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LabelsInfo } from '../../components/labels-info/labels-info';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-label',
  imports: [DataTable, MatButtonModule, MatIconModule],
  templateUrl: './label.html',
  styleUrl: './label.css',
})
export class LabelPage {
  labelId = signal<string>('');
  dialog = inject(DialogService);
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
  showSteps(){
    this.dialog.open(LabelsInfo,{maxWidth:"fit-content"})
  }
}