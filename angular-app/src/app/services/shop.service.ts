import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor() {}
  httpClient = inject(HttpClient);

  API_URL = 'http://localhost:3000/gorras';

  createCap(
    nombre: any,
    color: any,
    talla: any,
    disponible: any,
    existencias: any,
    imagen: File
  ) {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('color', color);
    formData.append('talla', talla);
    formData.append('disponible', disponible);
    formData.append('existencias', existencias);
    formData.append('imagen', imagen);
    return this.httpClient.post(this.API_URL, formData);
  }

  getCaps() {
    return this.httpClient.get(this.API_URL);
  }

  deleteCap(id: string) {
    return this.httpClient.delete(`${this.API_URL}/${id}`);
  }
}