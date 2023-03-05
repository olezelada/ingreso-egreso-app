import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

import Swal from 'sweetalert2'
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ui from 'src/app/share/ui.actions';
import {AppState} from "../../app.reducer";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registroForm!: FormGroup;
  public loading: boolean = false;
  public uiSubscription!: Subscription;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>) { }

  public ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
    }

  public ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
        this.loading = ui.isLoading;
    });
  }

  public crearUsuario(): void{
    if(this.registroForm.invalid){return;}

    this.store.dispatch(ui.isLoading());

    const { nombre, correo, password} = this.registroForm.value;
    this.authService.crearUsuario(nombre,correo,password)
      .then( credenciales => {
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/'])
      }).catch(err => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    });

  }

}
