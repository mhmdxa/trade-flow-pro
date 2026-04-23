import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isMobileSidebarOpen = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    // Basic ThreeJS or Particle init can go here if needed.
    // For now we use the CSS animated background.
  }

  ngOnDestroy(): void {}

  onToggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  onCloseMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }
}
