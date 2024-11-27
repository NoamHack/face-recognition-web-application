import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthGuard } from '../auth/guard/auth.guard';
import {
  addSolider,
  addSoliderFailure,
  addSoliderSuccess,
  addSoliderPics,
  addSoliderPicsSuccess,
  addSoliderPicsFailure,
} from './user.actions';
import { SoliderService } from '../services';
import { SoliderDto } from '../dto/solider.dto';
import { SoliderPicsDto } from '../dto/solider-pics.dto';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private soliderService: SoliderService,
    private messageService: MessageService
  ) {}

  addSolider$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSolider),
      switchMap((action) => {
        const soliderDto: SoliderDto = {
          soliderFirstName: action.soliderFirstName,
          soliderLastName: action.soliderLastName,
          soliderClassificationLevel: action.soliderClassificationLevel,
          soliderPersonalNumber: action.soliderPersonalNumber,
        };
        return from(this.soliderService.addSolider(soliderDto)).pipe(
          map(() => {
            return addSoliderSuccess();
          }),
          tap(() => {
            console.log('Soldier added successfully');
            AuthGuard.AccessUrlNavigation();
            this.router.navigate(['/login'], { skipLocationChange: true });
          }),
          catchError((error) => {
            console.error('Error adding soldier:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add soldier',
            });
            return of(addSoliderFailure({ error }));
          })
        );
      })
    )
  );

  addSoliderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addSoliderSuccess),
        tap(() => {
          this.messageService.add({
            icon: 'pi pi pi-check',
            severity: 'success',
            summary: 'Solider added successfully',
          });
          AuthGuard.AccessUrlNavigation();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  addSoliderPics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSoliderPics),
      switchMap((action) => {
        const soliderPicsDto: SoliderPicsDto = {
          soliderPersonalNumber: action.soliderPersonalNumber,
          soliderFrontPic: action.soliderFrontPic,
          soliderLeftProfilePic: action.soliderLeftProfilePic,
          soliderRightProfilePic: action.soliderRightProfilePic,
        };
        return from(this.soliderService.addSoliderPics(soliderPicsDto)).pipe(
          map(() => {
            return addSoliderPicsSuccess();
          }),
          tap(() => {
            this.messageService.add({
              icon: 'pi pi-camera',
              severity: 'success',
              summary: 'Solider pics added successfully',
            });
          }),
          catchError((error) => {
            console.error('Error adding soldier pics:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add soldier pics',
            });
            return of(addSoliderPicsFailure({ error }));
          })
        );
      })
    )
  );

  addSoliderPicsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addSoliderPicsSuccess),
        tap(() => {
          console.log('Soldier pics added successfully');
        })
      ),
    { dispatch: false }
  );
}
