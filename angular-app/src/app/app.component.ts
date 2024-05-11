import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  dataService = inject(DataService);

  todosLosDatos: any[] = [];

  obtenerTodosLosDatos(){
    this.dataService.obtenerDatos().subscribe((respuesta: any)=>{
      console.log("respuesta: ", respuesta);
      if (respuesta.amiibo) {        
      this.todosLosDatos = respuesta.amiibo;
      } else {
        console.log("error");
      }
    })
  }

  ngOnInit(){
    this.obtenerTodosLosDatos();
  }
}
