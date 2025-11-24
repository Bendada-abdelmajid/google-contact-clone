export class Label {
  id: string;
  name: string;
  contacts: string[];
  constructor(data: Partial<Label>) {
    this.id = data.id || this.generateId();
    this.name = data.name || "";
    this.contacts = data.contacts || [];
  }
  private generateId(): string {
    return `label_${Date.now()}_${Math.random().toString(36)}`;
  }
}
