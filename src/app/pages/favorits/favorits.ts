import { Component, inject } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { DataTable } from '../../components/data-table/data-table';
import { EmptyState } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-favorits',
  imports: [DataTable, EmptyState],
  templateUrl: './favorits.html',
  styleUrl: './favorits.css',
})
export class Favorits {
  contactService = inject(ContactService);

}
