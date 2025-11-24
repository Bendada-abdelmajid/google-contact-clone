import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../../utils/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { LabelForm } from '../label-form/label-form';
import { DialogService } from '../../services/dialog.service';
import { LabelService } from '../../services/label.service';
import { DeleteLabel } from '../delete-label/delete-label';
import { MatMenuModule } from '@angular/material/menu';
import { importContactsFromCSV } from '../../../utils/utils';
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
  @Input() isOpen: boolean = true;
  contactService = inject(ContactService);
  labelService = inject(LabelService);
  dialog = inject(MatDialog);
  sampleContacts=[{
      firstName: 'Sarah',
      lastName: 'Johnson',
      nickName: 'SJ',
      jobTitle: 'Software Engineer',
      company: 'TechCorp Inc.',
      emails: [
        { label: 'work', value: 'sarah.johnson@techcorp.com' },
        { label: 'personal', value: 'sarahj@email.com' },
      ],
      phones: [
        { label: 'mobile', value: '+1-555-0101' },
        { label: 'work', value: '+1-555-0102' },
      ],
      addresses: [
        {
          label: 'home',
          country: 'USA',
          street: '123 Maple Street',
          streetLine2: 'Apt 4B',
          postalCode: '10001',
          city: 'New York',
          poBox: '',
        },
      ],
      birthday: '1990-05-15',
      note: 'Met at tech conference 2024',
      favorite: true,
    },{
      firstName: 'Michael',
      lastName: 'Chen',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      emails: [{ label: 'work', value: 'mchen@startupxyz.io' }],
      phones: [{ label: 'mobile', value: '+1-555-0203' }],
      addresses: [
        {
          label: 'office',
          country: 'USA',
          street: '456 Innovation Drive',
          streetLine2: 'Suite 200',
          postalCode: '94105',
          city: 'San Francisco',
          poBox: '',
        },
      ],
      birthday: '1988-11-22',
      favorite: false,
    },{
      firstName: 'Emily',
      lastName: 'Rodriguez',
      nickName: 'Em',
      jobTitle: 'UX Designer',
      company: 'DesignStudio',
      emails: [{ label: 'work', value: 'e.rodriguez@designstudio.com' }],
      phones: [{ label: 'mobile', value: '+1-555-0304' }],
      addresses: [
        {
          label: 'home',
          country: 'USA',
          street: '789 Ocean Avenue',
          streetLine2: '',
          postalCode: '90210',
          city: 'Los Angeles',
          poBox: '',
        },
      ],
      birthday: '1992-03-08',
      favorite: true,
    },{
      firstName: 'James',
      lastName: 'Williams',
      jobTitle: 'Marketing Director',
      company: 'BrandBuilders LLC',
      emails: [{ label: 'work', value: 'jwilliams@brandbuilders.com' }],
      phones: [{ label: 'office', value: '+1-555-0405' }],
      addresses: [
        {
          label: 'office',
          country: 'USA',
          street: '321 Commerce Street',
          streetLine2: 'Floor 12',
          postalCode: '60601',
          city: 'Chicago',
          poBox: 'PO Box 5678',
        },
      ],
      birthday: '1985-07-30',
      favorite: false,
    },{
      firstName: 'Aisha',
      lastName: 'Patel',
      jobTitle: 'Data Scientist',
      company: 'Analytics Pro',
      emails: [{ label: 'work', value: 'apatel@analyticspro.com' }],
      phones: [{ label: 'mobile', value: '+1-555-0507' }],
      addresses: [
        {
          label: 'home',
          country: 'USA',
          street: '555 Tech Boulevard',
          streetLine2: 'Unit 8',
          postalCode: '02139',
          city: 'Cambridge',
          poBox: '',
        },
      ],
      birthday: '1993-09-12',
      favorite: true,
    },{
      firstName: 'David',
      lastName: 'Thompson',
      jobTitle: 'Sales Manager',
      company: 'SalesForce Solutions',
      emails: [{ label: 'work', value: 'dthompson@salesforcesol.com' }],
      phones: [{ label: 'mobile', value: '+1-555-0608' }],
      addresses: [
        {
          label: 'office',
          country: 'USA',
          street: '888 Business Park Way',
          streetLine2: '',
          postalCode: '75201',
          city: 'Dallas',
          poBox: '',
        },
      ],
      birthday: '1987-01-25',
      favorite: false,
    },{
      firstName: 'Maria',
      lastName: 'Garcia',
      jobTitle: 'HR Specialist',
      company: 'PeopleFirst Corp',
      emails: [{ label: 'work', value: 'mgarcia@peoplefirst.com' }],
      phones: [{ label: 'mobile', value: '+1-555-0710' }],
      addresses: [
        {
          label: 'home',
          country: 'USA',
          street: '222 Sunset Drive',
          streetLine2: '',
          postalCode: '33101',
          city: 'Miami',
          poBox: '',
        },
      ],
      birthday: '1991-06-18',
      favorite: false,
    },{
      firstName: 'Robert',
      lastName: 'Kim',
      jobTitle: 'DevOps Engineer',
      company: 'CloudSystems Inc.',
      emails: [{ label: 'work', value: 'rkim@cloudsystems.com' }],
      phones: [{ label: 'mobile', value: '+1-555-0811' }],
      addresses: [
        {
          label: 'home',
          country: 'USA',
          street: '999 Mountain View Road',
          streetLine2: '',
          postalCode: '98101',
          city: 'Seattle',
          poBox: '',
        },
      ],
      birthday: '1989-12-05',
      favorite: true,
    },{
      firstName: 'Lisa',
      lastName: 'Anderson',
      jobTitle: 'Financial Analyst',
      company: 'InvestWise Partners',
      emails: [{ label: 'work', value: 'landerson@investwise.com' }],
      phones: [{ label: 'mobile', value: '+1-555-0912' }],
      addresses: [
        {
          label: 'office',
          country: 'USA',
          street: '147 Wall Street',
          streetLine2: 'Suite 3000',
          postalCode: '10005',
          city: 'New York',
          poBox: '',
        },
      ],
      birthday: '1986-04-14',
      favorite: false,
    },{
      firstName: 'Alex',
      lastName: 'Martinez',
      jobTitle: 'Content Writer',
      company: 'Creative Media Group',
      emails: [{ label: 'work', value: 'amartinez@creativemedia.com' }],
      phones: [{ label: 'mobile', value: '+1-555-1014' }],
      addresses: [
        {
          label: 'home',
          country: 'USA',
          street: '333 Arts District Lane',
          streetLine2: 'Loft 7C',
          postalCode: '97201',
          city: 'Portland',
          poBox: '',
        },
      ],
      birthday: '1994-08-27',
      favorite: true,
    },
  ];
  uploadContacts() {
    // console.log(this.labelService.labels());
    this.sampleContacts.forEach((el) => {
      // const contact = new el);
      this.contactService.addContact(new Contact(el as Contact));
    });
  }
  private dialogService = inject(DialogService);
  openDialog() {
    this.dialogService.open(LabelForm, {});
  }
  updateLabel(name: string, id: string) {
    // alert(name);
    this.dialogService.open(LabelForm, {
      name: name,
      id: id,
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
