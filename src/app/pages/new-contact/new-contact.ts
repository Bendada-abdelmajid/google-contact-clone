import { Component } from '@angular/core';
import { ContactForm } from '../../components/contact-form/contact-form';

@Component({
  selector: 'app-new-contact',
  imports: [ContactForm],
  templateUrl: './new-contact.html',
  styleUrl: './new-contact.css',
})
export class NewContact {

}
