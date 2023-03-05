import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import {IngresoEgreso} from "../../models/ingreso-egreso.model";
import {Subscription} from "rxjs";
import {IngresoEgresoService} from "../../services/ingreso-egreso.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  public ingresosEgresos: IngresoEgreso[];
  private itemsSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) {
    this.ingresosEgresos = [];
    this.itemsSubscription = this.store.select('ingresosEgresos').subscribe( ({items}) => this.ingresosEgresos = items);
    console.log(this.ingresosEgresos);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
  }

  public borrarItem(uid: string): void {
    this.ingresoEgresoService.borrarIngresoEgresoItem(uid)
      .then(
        () => Swal.fire('Borrado', 'Item Borrado', 'success')
      )
      .catch(err => Swal.fire('Borrado', err.message, 'error'))
  }

}
