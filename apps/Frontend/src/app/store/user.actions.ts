import { createAction, props } from '@ngrx/store';

export const registerUser = createAction(
  '[User] Register User',
  props<{
    userName: string;
    userPassword: string;
    userEmail: string;
    userAge: number;
    departmentNumber: number;
  }>()
);
export const registerUserSuccess = createAction('[User] Register User Success');
export const registerUserFailure = createAction(
  '[User] Register User Failure',
  props<{ error: any }>()
);
