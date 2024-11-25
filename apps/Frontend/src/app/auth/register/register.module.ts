import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RegisterComponent } from './register.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { Ripple } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegisterComponent],
  exports: [RegisterComponent],
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
export class RegisterModule {}
