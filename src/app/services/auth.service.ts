import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {Usuario} from "../models/usuario.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore) {
  }

  public initAuthListener() {
    this.auth.authState.subscribe(fbUser => {
      console.log(fbUser);
      console.log(fbUser?.uid);
      console.log(fbUser?.email);
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
    console.log({email, password});
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
