import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;

  nombre: string = "";
  direccion: string = "";
  correo: string = "";
  telefono: string = "";
  imagen: string = "";
  usuarios: Array<{ nombre: string; direccion: string; correo: string; telefono: string; imagen: string }> = [];
  usuariosFiltrados: Array<{ nombre: string; direccion: string; correo: string; telefono: string; imagen: string }> = [];
  searchTerm: string = '';
  indexUsuarioEditado: number | null = null;

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

  editar(index: number) {
    const usuario = this.usuarios[index];
    this.nombre = usuario.nombre;
    this.direccion = usuario.direccion;
    this.correo = usuario.correo;
    this.telefono = usuario.telefono;
    this.imagen = usuario.imagen;
    this.indexUsuarioEditado = index; // Guardar el índice del usuario a editar
    this.modal?.present(); // Abrir el modal
  }

  confirmarEdicion() {
    if (this.indexUsuarioEditado !== null) {
      // Actualizar el usuario en la lista
      this.usuarios[this.indexUsuarioEditado] = {
        nombre: this.nombre,
        direccion: this.direccion,
        correo: this.correo,
        telefono: this.telefono,
        imagen: this.imagen
      };
      this.guardarEnLocalStorage(); // Guardar los cambios en LocalStorage
      this.modal?.dismiss(); // Cerrar el modal
      this.limpiarCampos();
      this.indexUsuarioEditado = null;
    }
  }

  cancelarEdicion() {
    this.modal?.dismiss(); // Cerrar el modal sin hacer cambios
    this.limpiarCampos();
    this.indexUsuarioEditado = null;
  }

  eliminar(index: number) {
    this.usuarios.splice(index, 1);
    this.guardarEnLocalStorage();
    this.alerta("Eliminado", "usuario eliminador correctamente");
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

  buscar(event: any) {
    const valorBusqueda = event.target.value;
    this.searchTerm = valorBusqueda;
    this.filtrarUsuarios();
  }

  filtrarUsuarios() {
    if (!this.searchTerm.trim()) {
      this.usuariosFiltrados = [...this.usuarios]; // Si no hay búsqueda, mostrar todos
    } else {
      const termino = this.searchTerm.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter(usuario => {
        return usuario.nombre.toLowerCase().includes(termino) || usuario.direccion.toLowerCase().includes(termino);
      });
    }
  }
}
