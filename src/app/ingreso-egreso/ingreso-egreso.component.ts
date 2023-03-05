import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IngresoEgreso} from "../models/ingreso-egreso.model";
import {IngresoEgresoService} from "../services/ingreso-egreso.service";
import Swal from "sweetalert2";
import {Store} from "@ngrx/store";
import {AppState} from "../app.reducer";
import * as uiActions from "../share/ui.actions";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public ingresoForm!: FormGroup;
  public tipo: string;
  public cargando: boolean;
  public loadingSubscription!: Subscription;

  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) {
    this.tipo = 'ingreso';
    this.cargando = false;
  }

  ngOnDestroy(): void {
       this.loadingSubscription.unsubscribe();
    }

  ngOnInit(): void {

   this.loadingSubscription =  this.store.select('ui').subscribe( ui => {
        this.cargando = ui.isLoading;
    });

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],

    });
  }

  public guardar(): void {

    if(this.ingresoForm.invalid){return;}

    this.store.dispatch(uiActions.stopLoading())
    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then((ref) => {
        this.ingresoForm.reset();
        this.store.dispatch(uiActions.stopLoading())
        Swal.fire('Registro Creado','descripcion','success');
      })
      .catch(err => {
        this.store.dispatch(uiActions.stopLoading())
        Swal.fire('Error',err.message,'error');
      });
  }

}
