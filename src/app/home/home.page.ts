import { Component, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

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
  productosFiltrados: Array<{ nombre: string; descripcion: string; precioCompra: string; precioVenta: string; imagen: string }> = [];
  searchTerm: string = ''; // Término de búsqueda
  indexProductoEditado: number | null = null;

  constructor(private alertController: AlertController, private router: Router) {
    this.cargarProdcutosDeLocalStorage();
  }

  /* -------------------------- LOGICA CRUD PRODUCTOS ------------------------- */

  async guardar() {
    if (!this.nombre || !this.descripcion || !this.precioCompra || !this.precioVenta || !this.imagen) {
      await this.alerta("Error", "No puedes dejar campos vacios");
      return;
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
    this.filtrarProductos(); // Actualizar lista filtrada
  }

  editar(index: number) {
    const producto = this.productos[index];
    this.nombre = producto.nombre;
    this.descripcion = producto.descripcion;
    this.precioCompra = producto.precioCompra;
    this.precioVenta = producto.precioVenta;
    this.imagen = producto.imagen;
    this.indexProductoEditado = index;
    this.modal?.present();
  }

  confirmarEdicion() {
    if (this.indexProductoEditado !== null) {
      this.productos[this.indexProductoEditado] = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        precioCompra: this.precioCompra,
        precioVenta: this.precioVenta,
        imagen: this.imagen
      };
      this.guardarEnLocalStorage();
      this.modal?.dismiss();
      this.limpiarCampos();
      this.indexProductoEditado = null;
      this.filtrarProductos(); // Actualizar lista filtrada
    }
  }

  cancelarEdicion() {
    this.modal?.dismiss();
    this.limpiarCampos();
    this.indexProductoEditado = null;
  }

  eliminar(index: number) {
    this.productos.splice(index, 1);
    this.guardarEnLocalStorage();
    this.alerta("Eliminado", "producto eliminador correctamente");
    this.filtrarProductos(); // Actualizar lista filtrada
  }

  async alerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  limpiarCampos() {
    this.nombre = "";
    this.descripcion = "";
    this.precioCompra = "";
    this.precioVenta = "";
    this.imagen = "";
  }

  /* --------------------------- LOGICA LOCALSTORAGE -------------------------- */

  guardarEnLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(this.productos));
  }

  cargarProdcutosDeLocalStorage() {
    const productosLocalStorage = localStorage.getItem("productos");
    if (productosLocalStorage) {
      this.productos = JSON.parse(productosLocalStorage);
      this.filtrarProductos(); // Cargar productos y aplicar filtro
    }
  }

  /* ---------------------------- LOGICA NAVEGACION --------------------------- */

  paginaUsuarios() {
    this.router.navigate(["/usuarios"]);
  }

  /* ------------------------ LOGICA BARRA DE BUSQUEDA ------------------------ */

  buscar(event: any) {
    const valorBusqueda = event.target.value;
    this.searchTerm = valorBusqueda;
    this.filtrarProductos();
  }

  filtrarProductos() {
    if (!this.searchTerm.trim()) {
      this.productosFiltrados = [...this.productos]; // Si no hay búsqueda, mostrar todos
    } else {
      const termino = this.searchTerm.toLowerCase();
      this.productosFiltrados = this.productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(termino) || producto.descripcion.toLowerCase().includes(termino);
      });
    }
  }
}