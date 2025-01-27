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
    soliderPositivePic1: string;
    soliderPositivePic2: string;
    soliderPositivePic3: string;
    soliderPositivePic4: string;
    soliderAnchorPic1: string;
    soliderAnchorPic2: string;
    soliderAnchorPic3: string;
    soliderAnchorPic4: string;
  }>()
);

export const addSoliderPicsSuccess = createAction(
  '[Solider Pics] Add Solider Pics Success'
);

export const addSoliderPicsFailure = createAction(
  '[Solider Pics] Add Solider Pics Failure',
  props<{ error: any }>()
);
