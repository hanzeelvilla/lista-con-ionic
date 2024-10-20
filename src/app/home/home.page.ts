import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nombre: string = "";
  descripcion: string = "";
  precioCompra: string = "";
  precioVenta: string = "";
  imagen: string = "";
  productos: Array<{ nombre: string; descripcion: string; precioCompra: string; precioVenta: string; imagen: string }> = [];

  constructor(private alertController: AlertController) {
    this.cargarProdcutosDeLocalStorage();
  }

  /* -------------------------- LOGICA CRUD PRODUCTOS ------------------------- */

  async guardar() {
    if(!this.nombre || !this.descripcion || !this.precioCompra || !this.precioVenta || !this.imagen) {
      await this.alerta("Error", "No puedes dejar campos vacios");
      return; // salir de la funcion si hay campos vacios
    }

    const producto = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precioCompra: this.precioCompra,
      precioVenta: this.precioVenta,
      imagen: this.imagen
    };

    this.productos.push(producto);
    this.guardarEnLocalStorage();
    this.limpiarCampos();
    this.alerta("Agregado", "producto agregado");
  }

  editar() {
    console.log("Editar");
  }

  eliminar(index: number) {
    this.productos.splice(index, 1);
    this.guardarEnLocalStorage();
    this.alerta("Eliminado", "producto eliminador correctamente");
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
    this.descripcion = "",
    this.precioCompra = "",
    this.precioVenta = ""
    this.imagen = ""
  }

  /* --------------------------- LOGICA LOCALSTORAGE -------------------------- */

  guardarEnLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(this.productos));
  }

  cargarProdcutosDeLocalStorage() {
    const productosLocalStorage = localStorage.getItem("productos");
    if(productosLocalStorage)
      this.productos = JSON.parse(productosLocalStorage);
  }
}