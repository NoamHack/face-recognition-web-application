import { Injectable } from '@angular/core';
import axios from 'axios';
import { SoliderDto } from '../dto/solider.dto';

@Injectable({
  providedIn: 'root',
})
export class SoliderService {
  addSolider(soliderDto: SoliderDto) {
    return axios.post(`http://localhost:3000/solider`, soliderDto, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
  }
}
