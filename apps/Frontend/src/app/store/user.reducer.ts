import { createFeature, createReducer, on } from '@ngrx/store';
import {

} from './user.actions';

export interface UserState {
  connected: boolean;
  departmentNumber: string;
  users: never[];
  userName: string;
}

const initialState: UserState = {
  connected: false,
  departmentNumber: '',
  users: [],
  userName: '',
};

export const userReducer = createReducer(
  initialState
);

export const userFeature = createFeature({
  name: 'user',
  reducer: userReducer,
});
