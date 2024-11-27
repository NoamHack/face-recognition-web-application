import { Injectable } from '@angular/core';
import axios from 'axios';
import { SoliderDto } from '../dto/solider.dto';
import { SoliderPicsDto } from '../dto/solider-pics.dto';

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

  addSoliderPics(soliderPicsDto: SoliderPicsDto) {
    return axios.post(`http://localhost:3000/solider/pics`, soliderPicsDto, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
  }
}
