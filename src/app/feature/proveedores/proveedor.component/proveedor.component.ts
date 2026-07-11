import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from '../../../models/proveedor.interface';
import { ProveedorService } from '../../../services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  private proveedorService = inject(ProveedorService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  proveedores: Proveedor[] = [];
  proveedorForm!: FormGroup;
  modoEdicion = false;
  proveedorIdActual: string | null = null;
  mensajeError: string | null = null;

  ngOnInit(): void {
    this.iniciarFormulario();
    this.cargarProveedores();
  }

  iniciarFormulario() {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      activo: [true]
    });
  }

  cargarProveedores() {
    this.mensajeError = null;
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar los proveedores. Verifica la conexión con el servidor.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  guardarProveedor() {
    if (this.proveedorForm.invalid) return;

    const proveedorData: Proveedor = this.proveedorForm.value;
    this.mensajeError = null;

    if (this.modoEdicion && this.proveedorIdActual) {
      proveedorData.id = this.proveedorIdActual;
      this.proveedorService.updateProveedor(this.proveedorIdActual, proveedorData).subscribe({
        next: () => {
          this.cargarProveedores();
          this.resetearFormulario();
        },
        error: (err) => {
          this.mensajeError = 'Error al actualizar el proveedor.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.proveedorService.createProveedor(proveedorData).subscribe({
        next: () => {
          this.cargarProveedores();
          this.resetearFormulario();
        },
        error: (err) => {
          this.mensajeError = 'Error al crear el proveedor.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  editarProveedor(proveedor: Proveedor) {
    if (!proveedor.id) return;
    this.modoEdicion = true;
    this.proveedorIdActual = proveedor.id;
    this.proveedorForm.patchValue({
      nombre: proveedor.nombre,
      correo: proveedor.correo,
      activo: proveedor.activo
    });
  }

  eliminarProveedor(id?: string) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.mensajeError = null;
      this.proveedorService.deleteProveedor(id).subscribe({
        next: () => this.cargarProveedores(),
        error: (err) => {
          this.mensajeError = 'Error al eliminar el proveedor.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetearFormulario() {
    this.modoEdicion = false;
    this.proveedorIdActual = null;
    this.proveedorForm.reset({ activo: true });
  }
}
