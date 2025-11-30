import { Component, inject, OnInit, signal } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MatSidenavModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isOpen = signal(true);
  isLoading = signal(true);
  isDesktop = true;
  sidenavMode: 'side' | 'over' = 'side';
  private iconRegistry = inject(MatIconRegistry);
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');

    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe((result) => {
      this.isDesktop = result.matches;
      this.sidenavMode = this.isDesktop ? 'side' : 'over';
      this.isOpen.update((v) => (this.isDesktop ? true : false));
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationError) {
        this.isLoading.set(false); // small delay for smoothness
      }
    });
  }
  ngOnInit() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      splash.remove();
      // match CSS transition
    }
  }
  toggleSidebar() {
    this.isOpen.update((v) => !v);
  }
  hundellNavigation() {
    if (!this.isDesktop) {
      console.log('Navigated');
      this.isOpen.set(false);
    }
  }
}
