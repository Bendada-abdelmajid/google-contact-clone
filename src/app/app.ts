import { Component, inject, signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, HeaderComponent, SidebarComponent, MatSidenavModule, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isOpen = signal(true);
  isDesktop = true;
  sidenavMode: 'side' | 'over' = 'side';
  private iconRegistry = inject(MatIconRegistry);
  constructor(private breakpointObserver: BreakpointObserver) {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');

    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe((result) => {
      this.isDesktop = result.matches;
      this.sidenavMode = this.isDesktop ? 'side' : 'over';
      this.isOpen.update((v) => (this.isDesktop ? true : false));
    });
  }
  toggleSidebar() {
    this.isOpen.update((v) => !v);
  }
}
