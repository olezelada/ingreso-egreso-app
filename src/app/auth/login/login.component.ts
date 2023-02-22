import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  public loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });


    const {email, password} = this.loginForm.value;

    this.authService.loginUsuario(email, password)
      .then(credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/'])
      }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    });

  }

}


/*
let timerInterval
Swal.fire({
  title: 'Auto close alert!',
  html: 'I will close in <b></b> milliseconds.',
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /!* Read more about handling dismissals below *!/
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})*/
