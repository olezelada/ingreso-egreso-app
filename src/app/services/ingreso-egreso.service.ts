import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IngresoEgreso} from "../models/ingreso-egreso.model";
import {AuthService} from "./auth.service";
import 'firebase/firestore'
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  public crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const userId = this.authService.user !== null ? this.authService.user.uid : '';

    delete ingresoEgreso.uid;

    return this.firestore.doc(`${userId}/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso});
  }

  public initIngresosEgresosListener(uid: string) {
   return  this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc => ({
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          })
          )
        )
      )
  }

  public borrarIngresoEgresoItem(itemUid: string) {
    const userUid = this.authService.user !== null ? this.authService.user.uid : '';
    return this.firestore.doc(`${userUid}/ingresos-egresos/items/${itemUid}`).delete();
  }

}
