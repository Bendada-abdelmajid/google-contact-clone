import { Component, inject, signal } from '@angular/core';

import { ContactService } from '../../services/contact.service';
import { DataTable } from '../../components/data-table/data-table';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DataTable],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  contactService = inject(ContactService);


}
