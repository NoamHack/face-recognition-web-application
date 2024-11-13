import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { VideoModule } from './video/video.module';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    VideoModule,
    BrowserAnimationsModule,
    LoginModule,
    RegisterModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
