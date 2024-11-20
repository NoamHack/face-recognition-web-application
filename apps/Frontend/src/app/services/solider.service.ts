import { Injectable } from '@angular/core';
import axios from 'axios';
import { sha256 } from 'js-sha256';


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
      `http://localhost:3000`,
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
