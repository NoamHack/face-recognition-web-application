import { createFeature, createReducer, on } from '@ngrx/store';

export interface UserState {
  connected: boolean;
  departmentNumber: string;
  users: any[];
  userName: string;
}

