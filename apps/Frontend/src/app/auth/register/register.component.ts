import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SoliderDto } from '../../dto/solider.dto';
import { addSolider } from '../../store';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  soliderDto: SoliderDto = new SoliderDto();

  constructor(private store: Store) {}

  onSubmit() {
    this.store.dispatch(addSolider(this.soliderDto));
    this.resetForm();
  }

  resetForm() {
    this.soliderDto = new SoliderDto();
  }
}
