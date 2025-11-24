import { Addresse, Contact } from './contact.model';

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 70%)`;
  return color;
}
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() ?? '';
  const last = lastName?.charAt(0).toUpperCase() ?? '';
  return first + last;
}

export const printContact = (contacts: Contact[]) => {

 const htmlContent = contacts.map(c => `
        <div class="PrintPerson">
          <div class="NameFields">
            <div class="HeaderName">${c.firstName || ''} ${c.lastName || ''}</div>
          </div>

          <div class="Field">
            <div class="FieldCell FieldValue SubHeader">
              <span>${c.jobTitle || ''}${c.company ? ', ' + c.company : ''}</span>
            </div>
          </div>

          <div class="Fields">
            ${c.emails?.length ? `
              <div class="FieldGroup">
                <div class="FieldGroupLabel FieldCell">Email</div>
                <div class="FieldGroupContent FieldCell">
                  ${c.emails.map(e => `
                    <div class="Field">
                      <div class="FieldCell FieldValue">
                        <span>${e.value}</span><span class="FieldLabel">&nbsp; • ${e.label}</span>
                      </div>
                    </div>`).join('')}
                </div>
              </div>` : ''}

            ${c.phones?.length ? `
              <div class="FieldGroup">
                <div class="FieldGroupLabel FieldCell">Phone</div>
                <div class="FieldGroupContent FieldCell">
                  ${c.phones.map(p => `
                    <div class="Field">
                      <div class="FieldCell FieldValue">
                        <span>${p.value}</span><span class="FieldLabel">&nbsp; • ${p.label}</span>
                      </div>
                    </div>`).join('')}
                </div>
              </div>` : ''}

            ${c.addresses?.length ? `
              <div class="FieldGroup">
                <div class="FieldGroupLabel FieldCell">Address</div>
                <div class="FieldGroupContent FieldCell">
                  ${c.addresses.map(a => `
                    <div class="Field">
                      <div class="FieldCell FieldValue">
                        <span>${a.street}<br>${a.city}<br>${a.postalCode}<br>${a.country}</span>
                        <span class="FieldLabel">&nbsp; • ${a.label}</span>
                      </div>
                    </div>`).join('')}
                </div>
              </div>` : ''}

            ${c.note ? `
              <div class="FieldGroup">
                <div class="FieldGroupLabel FieldCell">Notes</div>
                <div class="FieldGroupContent FieldCell">
                  <div class="Field">
                    <div class="FieldCell FieldValue"><span>${c.note}</span></div>
                  </div>
                </div>
              </div>` : ''}
          </div>

          <div class="PersonSeparator" role="presentation"></div>
        </div>
      `).join('');
  const printWindow = window.open('', '_blank');
  printWindow?.document.write(`
      <html>
        <head>
          <title>Contacts</title>
          <style> body { font-family: Roboto, sans-serif; font-size: 12px; }
      .PrintPerson { break-inside: avoid; margin-top: 5px; padding: 2px 4px; }
      .HeaderName { font-size: 14px; font-weight: bold; }
      .SubHeader { font-size: 13px; }
      .Fields, .NameFields { display: grid; }
      .NameFields { box-sizing: border-box; }
      .FieldCell { padding: 4px 0; }
      .FieldGroup .FieldCell { padding: 2px 0; }
      .FieldGroupContent { float: left; max-width: calc(100% - 100px); }
      .FieldGroupLabel { float: left; margin-right: 10px; width: 90px; }
      .FieldLabel { opacity: 0.54; }
      .PersonSeparator { border-top: 1px solid lightgray; height: 0; margin: 3px; overflow: hidden; }</style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);
  printWindow?.document.close();
  printWindow?.print();
};
export function exportContactsToCSV(contacts: Contact[]) {
  // Determine maximum number of emails/phones/addresses across all contacts
  const maxEmails = Math.max(...contacts.map(c => c.emails?.length || 0), 1);
  const maxPhones = Math.max(...contacts.map(c => c.phones?.length || 0), 1);
  const maxAddresses = Math.max(...contacts.map(c => c.addresses?.length || 0), 1);

  // Base Google Contacts header fields
  const baseHeaders = [
    "Name",
    "Given Name",
    "Additional Name",
    "Family Name",
    "Nickname",
    "Birthday",
    "Organization 1 - Name",
    "Organization 1 - Title",
    "Notes"
  ];

  // Dynamic headers for emails, phones, and addresses
  const emailHeaders = Array.from({ length: maxEmails }, (_, i) => [
    `E-mail ${i + 1} - Type`,
    `E-mail ${i + 1} - Value`,
  ]).flat();

  const phoneHeaders = Array.from({ length: maxPhones }, (_, i) => [
    `Phone ${i + 1} - Type`,
    `Phone ${i + 1} - Value`,
  ]).flat();

  const addressHeaders = Array.from({ length: maxAddresses }, (_, i) => [
    `Address ${i + 1} - Type`,
    `Address ${i + 1} - Formatted`,
    `Address ${i + 1} - Street`,
    `Address ${i + 1} - City`,
    `Address ${i + 1} - Postal Code`,
    `Address ${i + 1} - Country`,
  ]).flat();

  const headers = [
    ...baseHeaders,
    ...emailHeaders,
    ...phoneHeaders,
    ...addressHeaders
  ];

  // Generate CSV rows
  const rows = contacts.map((c) => {
    const name = `${c.firstName || ""} ${c.lastName || ""}`.trim();

    const emailValues = Array.from({ length: maxEmails }, (_, i) => {
      const e = c.emails?.[i];
      return [e?.label || "", e?.value || ""];
    }).flat();

    const phoneValues = Array.from({ length: maxPhones }, (_, i) => {
      const p = c.phones?.[i];
      return [p?.label || "", p?.value || ""];
    }).flat();

    const addressValues = Array.from({ length: maxAddresses }, (_, i) => {
      const a = c.addresses?.[i];
      const formatted = a
        ? `${a.street || ""}, ${a.city || ""}, ${a.country || ""}`.trim()
        : "";
      return [
        a?.label || "",
        formatted,
        a?.street || "",
        a?.city || "",
        a?.postalCode || "",
        a?.country || ""
      ];
    }).flat();

    return [
      name,
      c.firstName || "",
      "",
      c.lastName || "",
      c.nickName || "",
      c.birthday || "",
      c.company || "",
      c.jobTitle || "",
      c.note || "",
      ...emailValues,
      ...phoneValues,
      ...addressValues
    ];
  });

  // Combine headers and rows into CSV text
  const csv =
    [headers.join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join(
      "\r\n"
    );

  // --- For browser: trigger download ---
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contacts.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return csv; 
}

// Helper to escape quotes/commas properly
function escapeCsv(value: string): string {
  if (!value) return "";
  const escaped = value.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) return `"${escaped}"`;
  return escaped;
}



/**
 * Parses a CSV string and returns an array of Contact instances
 * Compatible with Google Contacts CSV format
 */
export function importContactsFromCSV(csvText: string): Contact[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const contacts: Contact[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    const data: Partial<Contact> = {};

    // Basic fields
    const nameIndex = headers.indexOf("Name");
    data.firstName = headers.indexOf("Given Name") >= 0 ? row[headers.indexOf("Given Name")] : "";
    data.lastName = headers.indexOf("Family Name") >= 0 ? row[headers.indexOf("Family Name")] : "";
    data.nickName = headers.indexOf("Nickname") >= 0 ? row[headers.indexOf("Nickname")] : "";
    data.birthday = headers.indexOf("Birthday") >= 0 ? row[headers.indexOf("Birthday")] : "";
    data.company = headers.indexOf("Organization 1 - Name") >= 0 ? row[headers.indexOf("Organization 1 - Name")] : "";
    data.jobTitle = headers.indexOf("Organization 1 - Title") >= 0 ? row[headers.indexOf("Organization 1 - Title")] : "";
    data.note = headers.indexOf("Notes") >= 0 ? row[headers.indexOf("Notes")] : "";

    // Emails
    data.emails = [];
    headers.forEach((header, idx) => {
      const match = header.match(/E-mail (\d+) - Type/i);
      if (match && row[idx]) {
        const type = row[idx];
        const value = row[idx + 1] || "";
        data.emails!.push({ label: type, value });
      }
    });

    // Phones
    data.phones = [];
    headers.forEach((header, idx) => {
      const match = header.match(/Phone (\d+) - Type/i);
      if (match && row[idx]) {
        const type = row[idx];
        const value = row[idx + 1] || "";
        data.phones!.push({ label: type, value });
      }
    });

    // Addresses
    data.addresses = [];
    headers.forEach((header, idx) => {
      const match = header.match(/Address (\d+) - Type/i);
      if (match && row[idx]) {
        const type = row[idx];
        const formatted = row[idx + 1] || "";
        const street = row[idx + 2] || "";
        const city = row[idx + 3] || "";
        const postalCode = row[idx + 4] || "";
        const country = row[idx + 5] || "";
        data.addresses!.push({
          label: type,
          street,
          streetLine2: "",
          city,
          postalCode,
          country,
          poBox: "",
        } as Addresse);
      }
    });

    contacts.push(new Contact(data));
  }

  return contacts;
}

/**
 * Helper: parse CSV line taking quotes into account
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
