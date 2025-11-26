// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./pages/favorits/favorits').then(m => m.Favorits)
  },
  { 
    path: 'new', 
    loadComponent: () => import('./pages/new-contact/new-contact').then(m => m.NewContact)
  },
  { 
    path: 'other', 
    loadComponent: () => import('./pages/other-contact/other-contact').then(m => m.OtherContact)
  },
  { 
    path: 'trush', 
    loadComponent: () => import('./pages/trush/trush').then(m => m.Trush)
  },
  { 
    path: 'suggestions', 
    loadComponent: () => import('./pages/suggestions/suggestions').then(m => m.Suggestions)
  },
  {
    path: 'person/:id',
    loadComponent: () => import('./pages/contact-details/contact-details').then(m => m.ContactDetails)
  },
  { 
    path: 'person/:id/edit', 
    loadComponent: () => import('./pages/edit-contact/edit-contact').then(m => m.EditContact)
  },
  { 
    path: 'label/:id', 
    loadComponent: () => import('./pages/label/label').then(m => m.LabelPage)
  },
];