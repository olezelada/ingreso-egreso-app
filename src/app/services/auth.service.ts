import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {Usuario} from "../models/usuario.model";
import {Store} from "@ngrx/store";
import * as authActions from "../auth/auth.actions";
import * as ingresoEgresoActions from "../ingreso-egreso/ingreso-egreso.actions";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userSubscription!: Subscription;
  private _user!: Usuario | null;

  public get user(){
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store) {
  }

  public initAuthListener() {
    this.auth.authState.subscribe(fbUser => {

      if(fbUser){
        this.userSubscription = this.firestore.doc(`${ fbUser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({ user }));
          });
      }else {
          this._user = null;
          this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    })
  }

  public crearUsuario(nombre: string, email: string, password: string) {

    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({user}) => {

        const newUser: Usuario = new Usuario(user!.uid, nombre, user!.email!);
        return this.firestore.doc(`${user!.uid}/usuario`).set({...newUser});

      });
  }

  public loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public logout() {
    return this.auth.signOut();
  }

  public isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }
}
