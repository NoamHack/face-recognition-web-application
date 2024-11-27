import { Route } from '@angular/router';
import { AddSoliderComponent } from './auth/add-solider/add-solider.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { VideoComponent } from './video/video.component';

export const appRoutes: Route[] = [
  { path: 'add', component: AddSoliderComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'video', component: VideoComponent, canActivate: [AuthGuard] },
];
