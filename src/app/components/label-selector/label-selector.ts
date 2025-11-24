import { Component, inject, Input, signal, output, OnInit, computed } from '@angular/core';
import { Label } from '../../../utils/label.modal';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LabelService } from '../../services/label.service';
import { DialogService } from '../../services/dialog.service';
import { LabelForm } from '../label-form/label-form';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-label-selector',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './label-selector.html',
  styleUrl: './label-selector.css',
})
export class LabelSelector implements OnInit {
  labelService = inject(LabelService);

  @Input() selectedLabels: Label[] = [];
  private dialog = inject(MatDialog);
  // ✅ Output to emit success to parent
  onApply = output<Label[]>();

  labelStorage = signal<Label[]>([]);

  showApplyButton = signal<boolean>(false);

  ngOnInit() {
    this.labelStorage.set(this.selectedLabels);
  }

  saveLabel(event: Event, item: Label) {
    event.stopPropagation();
    this.labelStorage.update((labels) => {
      const index = labels.findIndex((el) => el.id === item.id);
      if (index !== -1) {
        return labels.filter((el) => el.id !== item.id);
      } else {
        return [...labels, item];
      }
    });
    this.checkForChanges();
  }

  private checkForChanges() {
    const current = this.labelStorage();
    const original = this.selectedLabels;

    // Check if lengths are different
    if (current.length !== original.length) {
      this.showApplyButton.set(true);
      return;
    }

    // Check if all IDs match
    const currentIds = current.map((l) => l.id).sort();
    const originalIds = original.map((l) => l.id).sort();

    const hasChanges = !currentIds.every((id, index) => id === originalIds[index]);
    this.showApplyButton.set(hasChanges);
  }

  isLabelSelected = (id: string) => {
    return this.labelStorage().some((el) => el.id === id);
  };

  addLabel() {
    this.dialog.open(LabelForm, {
    data: {
      onConfirm: (newLabel: Label) => {
        console.log('Label created/updated:', newLabel);
                this.labelStorage.update((labels) => {

            return [...labels, newLabel];
          });
         this.apply()
      }
    }
  });

  }


  apply() {
    this.onApply.emit(this.labelStorage());
    this.showApplyButton.set(false);
  }
}
