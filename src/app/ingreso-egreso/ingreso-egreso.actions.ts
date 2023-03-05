import {createAction, props} from '@ngrx/store';
import {IngresoEgreso} from "../models/ingreso-egreso.model";

export const unSetItems  = createAction('[Ingreso-Egreso] Set Items');

export const setItems = createAction(
  '[Ingreso-Egreso] Unset Items',
  props<{items:IngresoEgreso[]}>()
);

