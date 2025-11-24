import { Component, computed, inject, Signal, signal } from '@angular/core';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../../utils/contact.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [MatInputModule, MatAutocompleteModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css',
    providers: [
    {
      provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
      useValue: {
        overlayPanelClass: 'search-result-cont'
        // Or use an array: overlayPanelClass: ['class1', 'class2']
      }
    }
  ]
})

export class Search {
  contactService = inject(ContactService);
  searchValue = signal<string>('');

  // Computed signal for filtered options
  filteredOptions: Signal<Contact[]> = computed(() => {
    const value = this.searchValue().toLowerCase().trim();

    if (!value) {
      return [];
    }

    return this.contactService.contacts().filter((option) => {
      const matchName =
        option?.firstName?.toLowerCase().includes(value) ||
        option?.lastName?.toLowerCase().includes(value);
      option?.nickName?.toLowerCase().includes(value);

      const matchEmail = option?.emails?.some((el) => el?.value?.toLowerCase().includes(value));
      const matchPhone = option?.phones?.some((el) =>
        el?.value?.replaceAll(' ', '').replaceAll('-', '').toLowerCase().includes(value)
      );

      return matchName || matchEmail || matchPhone;
    });
  });

  clear(): void {
    this.searchValue.set('');
  }
  onSearchChange(value: string): void {
    this.searchValue.set(value);
  }
}
