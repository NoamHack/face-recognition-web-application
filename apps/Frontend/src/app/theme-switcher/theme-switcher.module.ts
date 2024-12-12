import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { ThemeSwitcherComponent } from './theme-switcher.component';

@NgModule({
  declarations: [ThemeSwitcherComponent],
  imports: [CommonModule, CommonModule, SpeedDialModule, TooltipModule],
  exports: [ThemeSwitcherComponent],
})
export class ThemeSwitcherModule {}
