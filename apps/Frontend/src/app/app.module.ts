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
import { AddSoliderModule } from './auth/add-solider/add-solider.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects, userFeature } from './store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environment.production';
import { SoliderService } from './services';
import { ThemeSwitcherModule } from './theme-switcher/theme-switcher.module';
import { ThemeService } from './services/theme/theme.service';
import { NavBarModule } from './nav-bar/nav-bar.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    VideoModule,
    BrowserAnimationsModule,
    AddSoliderModule,
    StoreModule.forRoot(),
    StoreModule.forFeature(userFeature),
    EffectsModule.forRoot([UserEffects]),
    ThemeSwitcherModule,
    NavBarModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    MessageService,
    SoliderService,
    ThemeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
