import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { sha256 } from 'js-sha256';
import * as process from 'node:process';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = process.env['BACKEND_URL'];

  registerUser(
    userName: string,
    userPassword: string,
    userEmail: string,
    userAge: number,
    departmentNumber: number
  ) {
    return axios.post(
      `${this.url}/api/user`,
      {
        userName,
        userPassword: sha256(userPassword),
        userEmail,
        userAge,
        departmentNumber,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
