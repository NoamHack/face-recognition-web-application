import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AddSoliderComponent } from './add-solider.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { Ripple } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddSoliderComponent],
  exports: [AddSoliderComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonDirective,
    CardModule,
    CheckboxModule,
    NgOptimizedImage,
    Ripple,
    FormsModule
  ]
})
export class AddSoliderModule {}
