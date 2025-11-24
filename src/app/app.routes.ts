import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Favorits } from './pages/favorits/favorits';
import { ContactDetails } from './pages/contact-details/contact-details';
import { EditContact } from './pages/edit-contact/edit-contact';
import { NewContact } from './pages/new-contact/new-contact';
import { LabelPage } from './pages/label/label';
import { OtherContact } from './pages/other-contact/other-contact';
import { Trush } from './pages/trush/trush';
import { Suggestions } from './pages/suggestions/suggestions';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'favorites', component: Favorits },
  { path: 'new', component: NewContact },
  { path: 'other', component: OtherContact },
  { path: 'trush', component: Trush },
  { path: 'suggestions', component: Suggestions },
  {
    path: 'person/:id',
    component: ContactDetails,
  },
   { path: 'person/:id/edit', component: EditContact },
   { path: 'label/:id', component: LabelPage },
];
