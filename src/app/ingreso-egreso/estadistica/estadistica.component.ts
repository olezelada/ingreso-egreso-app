import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import {IngresoEgreso} from "../../models/ingreso-egreso.model";

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  public ingresos: number;
  public egresos: number;
  public totalIngresos: number;
  public totalEgresos: number;

/*  public doughnutChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  public doughnutChartData = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [ 350, 450, 100 ] },
      { data: [ 50, 150, 120 ] },
      { data: [ 250, 130, 70 ] }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';*/

  constructor( private _store: Store<AppState>) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;
  }

  ngOnInit(): void {
    this._store.select('ingresosEgresos'). subscribe( ({items}) => {
      console.log(items);
      this._generarStadistica(items);
    })
  }

  private _generarStadistica(items: IngresoEgreso[]){

    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

      for( const item of items){
        if(item.tipo ==='ingreso'){
          this.totalIngresos += item.montp;
          this.ingresos ++;
        }else{
          this.totalEgresos += item.montp;
          this.egresos ++;
        }
      }
  }

}
