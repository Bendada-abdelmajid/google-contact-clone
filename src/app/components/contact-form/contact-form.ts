import {
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { MatSelectModule } from '@angular/material/select';
import { isPlatformBrowser, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from '../../services/contact.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Contact } from '../../../utils/contact.model';
import { ProfilePicker } from '../profile-picker/profile-picker';
import { MatMenuModule } from '@angular/material/menu';
import { LabelService } from '../../services/label.service';
import { Label } from '../../../utils/label.modal';
import { LabelSelector } from '../label-selector/label-selector';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-contact-form',
  standalone: true,

  imports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    NgxMaterialIntlTelInputComponent,
    ReactiveFormsModule,
    RouterModule,
    ProfilePicker,
    MatMenuModule,
    LabelSelector,
    MatTooltipModule
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  defaultAvatar =
    '/profile-placeholder.png';
  showMore = signal<boolean>(false);
  showProfileInfo = signal<boolean>(false);
  selectedAvatar = signal<string | undefined>(undefined);
  contact: Contact | undefined;
  contactId!: string;
  contactForm: FormGroup;
  submitted = false;
  isFavorite = false;
  isBrowser: boolean;
  labelStorage = signal<Label[]>([]);
  contactLabels = signal<Label[]>([]);
  get hasAtLeastOneField(): boolean {
    const formValue = this.contactForm.value;
    return !!(
      formValue.firstName ||
      formValue.lastName ||
      formValue.nickName ||
      formValue.emails?.some((e: any) => e.value) ||
      formValue.phones?.some((p: any) => p.value)
    );
  }

  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private contactService: ContactService,
    public labelService: LabelService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe((params) => {
      this.contactId = params.get('id')!;
    });
    if (this.contactId) {
      this.contact = contactService.getContactById(this.contactId);
      this.selectedAvatar.set(this.contact ? this.contact?.photoUrl : undefined);
      const labels = this.labelService.getLabelsByContactId(this.contactId);
      this.labelStorage.set(labels);
      this.contactLabels.set(labels);
    }
    this.isBrowser = isPlatformBrowser(platformId);
    const birthday = this.contact?.birthday ? new Date(this.contact.birthday) : null;
    const year = birthday ? birthday.getFullYear() : '';
    const month = birthday ? birthday.getMonth() + 1 : ''; // months are 0-based
    const day = birthday ? birthday.getDate() : '';
    this.contactForm = this.fb.group({
      firstName: [this.contact?.firstName || '', [Validators.minLength(1)]],
      lastName: [this.contact?.lastName || ''],
      nickName: [this.contact?.nickName || ''],
      jobTitle: [this.contact?.jobTitle || ''],
      company: [this.contact?.company || ''],
      emails: this.fb.array(
        this.contact?.emails?.length
          ? this.contact.emails.map((email: any) =>
              this.fb.group({
                label: [email.label],
                value: [email.value],
              })
            )
          : [this.createEmailGroup()]
      ),
      phones: this.fb.array(
        this.contact?.phones?.length
          ? this.contact.phones.map((phone: any) =>
              this.fb.group({
                label: [phone.label],
                value: [phone.value],
              })
            )
          : [this.createPhoneGroup()]
      ),
      addresses: this.fb.array(
        this.contact?.addresses?.length
          ? this.contact.addresses.map((address: any) =>
              this.fb.group({
                label: [address.label],
                country: [address.country],
                street: [address.street],
                streetLine2: [address.streetLine2],
                postalCode: [address.postalCode],
                city: [address.city],
                poBox: [address.poBox],
              })
            )
          : []
      ),
      day: [day],
      month: [month],
      year: [year],

      note: [this.contact?.note || ''],
    });
  }
  avatarChange(url: string) {
    this.selectedAvatar.set(url);
  }

  toogleShowMotre(v: boolean) {
    this.showMore.set(v);
  }
  toogleShowProfileInfo() {
    this.showProfileInfo.update((v) => !v);
  }

  get emails(): FormArray {
    return this.contactForm.get('emails') as FormArray;
  }

  get phones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.contactForm.get('addresses') as FormArray;
  }

  createEmailGroup(): FormGroup {
    return this.fb.group({
      label: [''],
      value: ['', [Validators.email]],
    });
  }

  createPhoneGroup(): FormGroup {
    return this.fb.group({
      label: [''],
      value: [''],
    });
  }
  createAddressGroup(): FormGroup {
    return this.fb.group(
      {
        label: [''],
        country: [''],
        street: [''],
        streetLine2: [''],
        postalCode: [''],
        city: [''],
        poBox: [''],
      },
      {
        validators: this.atLeastOneRequiredValidator([
          'street',
          'city',
          'postalCode',
          'country',
          'poBox',
        ]),
      }
    );
  }

  atLeastOneRequiredValidator(fields: string[]) {
    return (group: AbstractControl): ValidationErrors | null => {
      const hasAtLeastOne = fields.some((field) => {
        const control = group.get(field);
        return control && control.value && control.value.trim() !== '';
      });

      return hasAtLeastOne ? null : { atLeastOneRequired: true };
    };
  }

  addEmail() {
    this.emails.push(this.createEmailGroup());
  }
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  addPhone() {
    this.phones.push(this.createPhoneGroup());
  }

  addAddress() {
    this.addresses.push(this.createAddressGroup());
  }

  removeEmail(i: number) {
    this.emails.removeAt(i);
  }

  removePhone(i: number) {
    this.phones.removeAt(i);
  }

  removeAddress(i: number) {
    this.addresses.removeAt(i);
  }

  handleLabelApply(selectedLabels: Label[]) {
    this.contactLabels.set(selectedLabels);
  }
  addContactToLabels(id: string) {
    this.contactLabels().forEach((el) => {
      this.labelService.addContactToLabel(el.id, id);
    });
  }

  trimFormValues(form: FormGroup | FormArray) {
    const controls = (form as FormGroup).controls ?? (form as FormArray).controls;
    Object.keys(controls).forEach((key) => {
      const control = controls[key] as AbstractControl;

      // If nested FormGroup or FormArray, recurse
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.trimFormValues(control);
        return;
      }

      // Trim string values
      const val = control.value;
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed !== val) {
          control.setValue(trimmed, { emitEvent: false });
        }
      }
    });
  }
  onSubmit(): void {
    try {
      this.trimFormValues(this.contactForm);
      document.getElementById("loader")?.classList.add("show");
      if (this.contactForm.valid || this.hasAtLeastOneField) {
 
        this.submitted = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          const contactData = this.contactForm.value;
          // ✅ Convert the form data into a Contact model instance (optional)
          const contact = {
            ...contactData,
            photoUrl: this.selectedAvatar(),
            birthday:
              contactData.month && contactData.day
                ? `${contactData.year ? `${contactData.year}-` : ''}${contactData.month}-${
                    contactData.day
                  }`
                : undefined,
            favorite: this.isFavorite,
            labelIds: this.contactLabels().map((el) => el.id),
          };

          console.log('Form submitted:', contact);
          if (this.contactId) {
            this.contactService.updateContact(this.contactId, contact);
            this.contactLabels().forEach((el) => {
              this.labelService.removeContactFromLabel(el.id, this.contactId);
            });
            this.addContactToLabels(this.contactId);
          } else {
            const newContact = new Contact(contact);
            this.contactService.addContact(newContact);
            this.addContactToLabels(newContact.id);
          }

          this.contactForm.reset();

          this.snackBar.open(
            this.contactId ? 'Contact updated successfully! ✓' : 'Contact saved successfully! ✓',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar'],
            }
          );
          this.location.back();
        document.getElementById("loader")?.classList.remove("show");

          this.cdr.detectChanges();
        }, 3000);
      } else {
        console.log(this.contactForm.errors);
        console.log('valid', this.contactForm.valid);

        this.snackBar.open(
          this.contactForm.invalid
            ? 'Please enter valid information'
            : 'Please fill in at least one field',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          }
        );
        Object.keys(this.contactForm.controls).forEach((key) => {
          this.contactForm.get(key)?.markAsTouched();
        });
      }
    } catch (er) {
      console.log(er, 'somting wont wrong');
    }
  }
}
