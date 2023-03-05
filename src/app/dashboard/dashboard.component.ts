import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../app.reducer";
import {audit, filter} from "rxjs/operators";
import auth from "firebase/compat";
import {Subscription} from "rxjs";
import {IngresoEgresoService} from "../services/ingreso-egreso.service";
import * as ingresoEgresoActions from "../ingreso-egreso/ingreso-egreso.actions";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _userSubscription!: Subscription;
  private _ingresosEgresosSubscription!: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this. _userSubscription = this.store.select('user')
      .pipe(
        filter(auth => auth.user !== null )
      )
      .subscribe( ({user}) => {
        if(!user){
          return;
        }
      this._ingresosEgresosSubscription = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
        .subscribe( ingresosEgresosFB => {
          this.store.dispatch( ingresoEgresoActions.setItems( { items: ingresosEgresosFB}) )
        })
    })
  }

  ngOnDestroy(): void {
    this._userSubscription?.unsubscribe();
    this._ingresosEgresosSubscription?.unsubscribe();
  }

}
