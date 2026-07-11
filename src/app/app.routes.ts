import { Routes } from '@angular/router';
import { ProveedorComponent } from './feature/proveedores/proveedor.component/proveedor.component';

export const routes: Routes = [
  {
    path: 'proveedores',
    component: ProveedorComponent
  },
  {
    path: '',
    redirectTo: '/proveedores',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/proveedores'
  }
];
