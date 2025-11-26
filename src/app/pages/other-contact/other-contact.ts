import { Component, inject } from '@angular/core';
import { DataTable } from '../../components/data-table/data-table';
import { ContactService } from '../../services/contact.service';
import { EmptyState } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-other-contact',
  imports: [DataTable, EmptyState],
  templateUrl: './other-contact.html',
  styleUrl: './other-contact.css',
})
export class OtherContact {
  contactService = inject(ContactService);
}
