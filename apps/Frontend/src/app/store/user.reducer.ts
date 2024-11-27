import { createFeature, createReducer, on } from '@ngrx/store';
import {
  addSolider,
  addSoliderSuccess,
  addSoliderFailure,
} from './user.actions';

export interface UserState {
  connected: boolean;
  departmentNumber: string;
  users: any[];
  userName: string;
}

const initialState: UserState = {
  connected: false,
  departmentNumber: '',
  users: [],
  userName: '',
};

export const userReducer = createReducer(
  initialState,
  on(addSolider, (state) => state),
  on(addSoliderSuccess, (state) => state),
  on(addSoliderFailure, (state) => state)
);

export const userFeature = createFeature({
  name: 'user',
  reducer: userReducer,
});
