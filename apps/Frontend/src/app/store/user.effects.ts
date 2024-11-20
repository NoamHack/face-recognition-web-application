import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  registerUser,
  registerUserFailure,
  registerUserSuccess,
} from './user.actions';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../services';
import { AuthGuard } from '../auth/guard/auth.guard';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
  }

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      switchMap(
        ({ userName, userPassword, userEmail, userAge, departmentNumber }) =>
          from(
            this.userService.registerUser(
              userName,
              userPassword,
              userEmail,
              userAge,
              departmentNumber
            )
          ).pipe(
            map(() => {
              return registerUserSuccess();
            }),
            catchError((error) => {
              console.error('Error registering user:', error);
              return of(registerUserFailure({ error }));
            })
          )
      )
    )
  );

  registerUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerUserSuccess),
        tap(() => {
          console.log('User registered successfully');
          AuthGuard.AccessUrlNavigation();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
