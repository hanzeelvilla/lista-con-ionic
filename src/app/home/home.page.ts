import { Component, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal | undefined;

  nombre: string = "";
  descripcion: string = "";
  precioCompra: string = "";
  precioVenta: string = "";
  imagen: string = "";
  productos: Array<{ nombre: string; descripcion: string; precioCompra: string; precioVenta: string; imagen: string }> = [];
  indexProductoEditado: number | null = null; // Para guardar el índice del producto que estamos editando

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

  editar(index: number) {
    const producto = this.productos[index];
    this.nombre = producto.nombre;
    this.descripcion = producto.descripcion;
    this.precioCompra = producto.precioCompra;
    this.precioVenta = producto.precioVenta;
    this.imagen = producto.imagen;
    this.indexProductoEditado = index; // Guardar el índice del producto a editar
    this.modal?.present(); // Abrir el modal
  }

  confirmarEdicion() {
    if (this.indexProductoEditado !== null) {
      // Actualizar el producto en la lista
      this.productos[this.indexProductoEditado] = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        precioCompra: this.precioCompra,
        precioVenta: this.precioVenta,
        imagen: this.imagen
      };
      this.guardarEnLocalStorage(); // Guardar los cambios en LocalStorage
      this.modal?.dismiss(); // Cerrar el modal
      this.limpiarCampos();
      this.indexProductoEditado = null;
    }
  }

  cancelarEdicion() {
    this.modal?.dismiss(); // Cerrar el modal sin hacer cambios
    this.limpiarCampos();
    this.indexProductoEditado = null;
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