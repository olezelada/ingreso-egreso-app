import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AppState} from "../../app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  public nombre!: string;
  private userSubscription!: Subscription;
  constructor(private router: Router,
              private authService: AuthService,
              private _store: Store<AppState>) {
    this.nombre = '';
  }

  public ngOnInit(): void {
    this.userSubscription = this._store.select('user')
      .pipe(
        filter( ({user}) => user != null)
      )
      .subscribe( ({user}) => this.nombre = user!.nombre)
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  public logout(){
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }



}
