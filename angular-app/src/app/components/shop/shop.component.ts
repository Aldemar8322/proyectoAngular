import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validator,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  toastrService = inject(ToastrService);
  loginService = inject(LoginService);
  shopService = inject(ShopService);

  name: string = '';

  nombre: string = '';
  color: string = '';
  talla: string = '';
  disponible: boolean = false;
  existencias: number = 0;
  imagen: File | null = null;

  allCaps: any[] = [];
  caps: any[] = [];

  searchForm = new FormGroup({
    term: new FormControl('', Validators.required),
  });

  getAllCaps() {
    this.shopService.getCaps().subscribe((res: any) => {
      if (res.resultado === 'bien') {
        this.allCaps = res.datos;
        this.caps = this.allCaps;
      } else {
        this.toastrService.error('An error ocurred');
      }
    });
  }

  handleInputSearch() {
    const filtered = this.allCaps.filter((cap) =>
      cap.color.includes(this.searchForm.value.term)
    );
    if (filtered.length > 0) {
      this.caps = filtered;
    } else {
      this.searchForm.value.term === ''
        ? (this.caps = this.allCaps)
        : (this.caps = []);
    }
  }

  handleSubmitSearch() {
    const filtered = this.allCaps.filter((cap) => {
      return cap.color === this.searchForm.value.term;
    });
    if (filtered.length > 0) {
      this.caps = filtered;
      this.toastrService.info('Caps found: ' + filtered.length);
    } else {
      this.caps = this.allCaps;
      this.toastrService.info(
        'Caps ' + this.searchForm.value.term + ' not found'
      );
    }
  }

  inputFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imagen = event.target.files[0];
    }
  }

  handleSubmit() {
    if (this.imagen) {
      this.shopService
        .createCap(
          this.nombre,
          this.color,
          this.talla,
          this.disponible,
          this.existencias,
          this.imagen
        )
        .subscribe((response: any) => {
          if (response.resultado === 'bien') {
            this.toastrService.success(response.mensaje);
            this.getAllCaps();
          } else {
            this.toastrService.error('An error ocurred');
          }
        });
    } else {
      this.toastrService.warning('All fields are required');
    }
  }

  handleInfo() {
    console.log('...handleInfo...');
  }
  handleUpdate() {
    console.log('...handleUpdate...');
  }
  handleDelete(id: string) {
    this.shopService.deleteCap(id).subscribe((res: any) => {
      if (res.resultado === 'bien') {
        this.toastrService.success(res.mensaje);
        this.getAllCaps();
      } else {
        this.toastrService.error('An error ocurred');
      }
    });
  }

  ngOnInit() {
    const token: any = localStorage.getItem('token');
    if (token) {
      this.loginService.validateToken(token).subscribe((response: any) => {
        if (response.resultado === 'bien') {
          this.name = response.datos.name;
          this.toastrService.success(`Hello, ${this.name}!`);
          this.getAllCaps();
        } else {
          this.loginService.logout();
        }
      });
    } else {
      this.loginService.logout();
    }
  }
}