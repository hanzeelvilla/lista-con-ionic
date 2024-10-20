import { Component, OnInit } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  nombre: string = "";
  direccion: string = "";
  correo: string = "";
  telefono: string = "";
  imagen: string = "";
  usuarios: Array<{ nombre: string; direccion: string; correo: string; telefono: string; imagen: string }> = [];

  constructor(private alertController: AlertController, private router: Router) {
    this.cargarProdcutosDeLocalStorage();
   }

  ngOnInit() {
  }

  /* -------------------------- LOGICA CRUD USUARIOS -------------------------- */

  async guardar() {
    if(!this.nombre || !this.direccion || !this.correo || !this.telefono || !this.imagen) {
      await this.alerta("Error", "No puedes dejar campos vacios");
      return; // salir de la funcion si hay campos vacios
    }

    const usuario = {
      nombre: this.nombre,
      direccion: this.direccion,
      correo: this.correo,
      telefono: this.telefono,
      imagen: this.imagen
    };

    this.usuarios.push(usuario);
    this.guardarEnLocalStorage();
    this.limpiarCampos();
    this.alerta("Agregado", "usuario agregado");
  }

  editar() {
    console.log("editar");
  }

  eliminar() {
    console.log("eliminar");
  }

  async alerta(header: string, message: string) {
    const alert = await this.alertController.create ({
      header: header,
      message: message,
      buttons: ["OK"]  
    });

    await alert.present();
  }

  limpiarCampos() {
    this.nombre = "",
    this.direccion = "",
    this.correo = "",
    this.telefono = ""
    this.imagen = ""
  }

  /* --------------------------- LOGICA LOCALSTORAGE -------------------------- */

  guardarEnLocalStorage() {
    localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
  }

  cargarProdcutosDeLocalStorage() {
    const usuariosLocalStorage = localStorage.getItem("usuarios");
    if(usuariosLocalStorage)
      this.usuarios = JSON.parse(usuariosLocalStorage);
  }

  /* ---------------------------- LOGICA NAVEGACION --------------------------- */

  paginaProductos() {
    this.router.navigate(["home"]);
  }

}
