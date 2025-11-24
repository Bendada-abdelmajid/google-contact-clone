import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);

  open<T, D = any>(component: ComponentType<T>, data?: D) {
    return this.dialog.open(component, {
      data,
      disableClose: false, // change to true if you want to prevent closing by clicking outside
      autoFocus: true,
      restoreFocus: false,
      panelClass: 'global-dialog'
    });
  }

  closeAll() {
    this.dialog.closeAll();
  }
}
