import { createAction, props } from '@ngrx/store';

export const addSolider = createAction(
  '[Solider] Add Solider',
  props<{
    soliderFirstName: string;
    soliderLastName: string;
    soliderClassificationLevel: number;
    soliderPersonalNumber: number;
  }>()
);

export const addSoliderSuccess = createAction('[Solider] Add Solider Success');

export const addSoliderFailure = createAction(
  '[Solider] Add Solider Failure',
  props<{ error: any }>()
);
