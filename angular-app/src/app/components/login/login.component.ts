import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Credential } from '../../interfaces/credential';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  toastrService = inject(ToastrService);
  loginService: LoginService = inject(LoginService);

  credentialsForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  handleSubmit() {
    if (this.credentialsForm.valid) {
      const username = this.credentialsForm.value.username;
      const password = this.credentialsForm.value.password;

      if (typeof username === 'string' && typeof password === 'string') {
        const credential: Credential = {
          username,
          password,
        };
        this.loginService.login(credential).subscribe((response: any) => {
          console.log(credential);
          if (response.resultado === 'Bien') {
            localStorage.setItem('token', response.datos);
            this.router.navigateByUrl('/shop');
          } else {
            this.toastrService.warning('Invalid credentials');
          }
        });
      }
    } else {
      this.toastrService.warning('All fields are required');
    }
  }
}