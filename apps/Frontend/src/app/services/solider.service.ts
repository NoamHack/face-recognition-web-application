import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SoliderService {
  addSolider(
    soliderFirstName: string,
    soliderLastName: string,
    soliderClassificationLevel: number,
    soliderPersonalNumber: number
  ) {
    return axios.post(
      `http://localhost:3000/solider`,
      {
        soliderFirstName,
        soliderLastName,
        soliderClassificationLevel,
        soliderPersonalNumber,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
