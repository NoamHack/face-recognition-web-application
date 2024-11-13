import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from './login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  imports: [
    CommonModule,
    CheckboxModule,
    ButtonDirective,
    Ripple,
    InputTextModule,
    NgOptimizedImage,
  ],
})
export class LoginModule {}
