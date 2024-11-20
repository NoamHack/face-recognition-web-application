import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthGuard } from '../auth/guard/auth.guard';
import { addSolider, addSoliderFailure, addSoliderSuccess } from './user.actions';
import { SoliderService } from '../services';

@Injectable()
export class SoliderEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private soliderService: SoliderService,
    private messageService: MessageService
  ) {
  }

  addSolider$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSolider),
      switchMap(
        ({ soliderFirstName, soliderLastName, soliderClassificationLevel, soliderPersonalNumber }) =>
          from(
            this.soliderService.addSolider(
              soliderFirstName,
              soliderLastName,
              soliderClassificationLevel,
              soliderPersonalNumber
            )
          ).pipe(
            map(() => {
              return addSoliderSuccess();
            }),
            catchError((error) => {
              console.error('Error adding soldier:', error);
              return of(addSoliderFailure({ error }));
            })
          )
      )
    )
  );

  addSoliderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addSoliderSuccess),
        tap(() => {
          console.log('Soldier added successfully');
          AuthGuard.AccessUrlNavigation();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
