import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  mobileMenuOpen = signal(false);

  navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/overview', label: 'Overview', exact: false },
    { path: '/operations', label: 'Operations', exact: false },
    { path: '/demo', label: 'Demo', exact: false },
    { path: '/modes', label: 'Modes', exact: false },
    { path: '/history', label: 'History & RFC', exact: false }
  ];

  toggleMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }
}
