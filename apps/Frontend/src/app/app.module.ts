import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { VideoModule } from './video/video.module';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects, userFeature } from './store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environment.production';
import { SoliderService } from './services';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    VideoModule,
    BrowserAnimationsModule,
    LoginModule,
    RegisterModule,
    StoreModule.forRoot(),
    StoreModule.forFeature(userFeature),
    EffectsModule.forRoot([UserEffects]),
  ],
  providers: [
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    MessageService,
    SoliderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
