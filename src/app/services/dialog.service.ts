import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private openDialogs: MatDialogRef<any>[] = [];

  constructor(private dialog: MatDialog, private router: Router) {
    // Listen to browser back/forward
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate' && this.openDialogs.length > 0) {
          // Close all open dialogs on back
          const dialogs = [...this.openDialogs];
          dialogs.forEach(d => {
            d.close();
          });
        }
      });
  }

  open<T>(component: any, config?: any): MatDialogRef<T> {
    const dialogRef = this.dialog.open<T>(component, config);
    this.openDialogs.push(dialogRef);

    dialogRef.afterClosed().subscribe(() => {
      this.openDialogs = this.openDialogs.filter(d => d !== dialogRef);
    });

    // Push dummy history state to support back button
    history.pushState({ dialog: true }, '');
    return dialogRef;
  }
}
