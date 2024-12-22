import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [NavBarComponent],
  imports: [CommonModule, MenubarModule, InputTextModule],
  exports: [NavBarComponent],
})
export class NavBarModule {}
