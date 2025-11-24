export type Addresse = {
  label: string;
  country: string;
  street: string;
  streetLine2: string;
  postalCode: string;
  city: string;
  poBox: string;
};
export class Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  jobTitle?: string;
  company?: string;
  emails?: { label: string; value: string }[];
  phones?: { label: string; value: string }[];
  addresses?: Addresse[];
  birthday?: string;
  note?: string;
  photoUrl?: string;
  favorite?: boolean;
  addedDate: string; // Date when contact was added
  lastEdited: string;
  deleted?: boolean;
  deletedAt?: Date;
  hidden?: boolean;
  labelIds?: string[];
  dismissMergeSuggestion?: boolean;

  constructor(data: Partial<Contact>) {
    this.id = data.id || this.generateId();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.nickName = data.nickName;
    this.jobTitle = data.jobTitle;
    this.company = data.company;
    this.emails = data.emails;
    this.phones = data.phones;
    this.addresses = data.addresses;
    this.birthday = data.birthday;
    this.note = data.note;
    this.photoUrl = data.photoUrl;
    this.favorite = data.favorite || false;
    this.addedDate = data.addedDate ?? new Date().toISOString();
    this.lastEdited = data.lastEdited ?? new Date().toISOString();
    this.hidden = data.hidden || false;
    this.deleted = data.deleted || false;
    this.deletedAt = data.deletedAt;
    this.labelIds = data.labelIds;
    this.dismissMergeSuggestion = data.dismissMergeSuggestion || false;
  }

  private generateId(): string {
    return `contact_${Date.now()}_${Math.random().toString(36)}`;
  }
  getEmail() {
    return this.emails?.length ? this.emails[0].value : '';
  }
  getPhone() {
    return this.phones?.length && this.phones[0] ? this.phones[0].value : '';
  }
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
  getLastEdited(): string {
    return this.formatDate(this.lastEdited);
  }
  getDeletedDate(): string {
    return this.deletedAt ? this.formatDate(new Date(this.deletedAt).toDateString()) : '';
  }
  getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  getRemainingDeleteDays(): number {
    if (!this.deletedAt) return 0;

    const deletedDate = new Date(this.deletedAt);
    const today = new Date();

    const diffMs = today.getTime() - deletedDate.getTime(); // milliseconds
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // days passed

    const remaining = 30 - diffDays;

    return remaining > 0 ? remaining : 0; // never negative
  }

  // Get formatted added date string
  getAddedDate(): string {
    return this.formatDate(this.addedDate);
  }
  stringToColor(): string {
    const str = `${this.firstName || ''}  + ${this.lastName || ''} + ${this.nickName || ''}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  }
  getInitials(): string {
    const letter =
      this.firstName?.charAt(0).toUpperCase() ||
      this.lastName?.charAt(0).toUpperCase() ||
      this.nickName?.charAt(0).toUpperCase() ||
      '';

    return letter;
  }
}
