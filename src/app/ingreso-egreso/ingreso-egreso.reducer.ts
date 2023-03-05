import {Action, createReducer, on} from '@ngrx/store';
import * as ingresoEgresoActions from "./ingreso-egreso.actions";
import {IngresoEgreso} from "../models/ingreso-egreso.model";
import {AppState} from "../app.reducer";

export interface State {
  items: IngresoEgreso[];
}

export interface AppStateWithIngreso extends AppState{
  ingresosEgresos: State
}

export const initialState: State = {
  items: []
}

const _ingresoEgresoReducer = createReducer(initialState,

  on(ingresoEgresoActions.setItems, (state, { items }) => ({ ...state, items: [...items]})),
  on(ingresoEgresoActions.unSetItems, state => ({ ...state, items: []})),

);

export function ingresoEgresoReducer(state: State = initialState, action: Action) {
  return _ingresoEgresoReducer(state, action);
}
