import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../share/ui.actions';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm!: FormGroup;
  public loading: boolean = false;
  public uiSubscription!: Subscription;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.loading = ui.isLoading;
    });
  }

  public ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  public loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    const {email, password} = this.loginForm.value;

    this.authService.loginUsuario(email, password)
      .then(credenciales => {
        this.store.dispatch( ui.stopLoading());
        this.router.navigate(['/'])
      }).catch(err => {
        this.store.dispatch( ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    });

  }
}
