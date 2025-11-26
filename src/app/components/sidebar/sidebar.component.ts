import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { MatDialog } from '@angular/material/dialog';
import { LabelForm } from '../label-form/label-form';

import { LabelService } from '../../services/label.service';
import { DeleteLabel } from '../delete-label/delete-label';
import { MatMenuModule } from '@angular/material/menu';
import { ContactImport } from '../contact-import/contact-import';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private router = inject(Router);
  @Input() hundellNavigation !: () => void; 
  @Input() isOpen: boolean = true;
  contactService = inject(ContactService);
  labelService = inject(LabelService);
  dialog = inject(MatDialog);

  uploadContacts() {
    // console.log(this.labelService.labels());
    this.router.navigate(['/new']);
  }
 
  openDialog() {
    this.dialog.open(LabelForm, {});
  }
  updateLabel(name: string, id: string) {
    // alert(name);
    this.dialog.open(LabelForm, {
      data: {
        name: name,
        id: id,
      },
    });
  }
  deleteLabel(id: string) {
    this.dialog.open(DeleteLabel, {
      data: {
        id: id,
      },
    });
  }
  import() {
    this.dialog.open(ContactImport, {});
  }
}
