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

export const addSoliderPics = createAction(
  '[Solider Pics] Add Solider Pics',
  props<{
    soliderPersonalNumber: number;
    soliderFrontPic: string;
    soliderLeftProfilePic: string;
    soliderRightProfilePic: string;
  }>()
);

export const addSoliderPicsSuccess = createAction(
  '[Solider Pics] Add Solider Pics Success'
);

export const addSoliderPicsFailure = createAction(
  '[Solider Pics] Add Solider Pics Failure',
  props<{ error: any }>()
);
