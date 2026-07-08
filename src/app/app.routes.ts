import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/dashboard-home/dashboard-home').then(m => m.DashboardHomeComponent) },
      { path: 'pacientes', loadComponent: () => import('./pages/pacientes/pacientes').then(m => m.PacientesComponent) },
      { path: 'pacientes/novo', loadComponent: () => import('./pages/pacientes/paciente-form/paciente-form').then(m => m.PacienteFormComponent) },
      { path: 'pacientes/:id', loadComponent: () => import('./pages/pacientes/paciente-form/paciente-form').then(m => m.PacienteFormComponent) },
      { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil').then(m => m.PerfilComponent) },
      { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent) },
      { path: 'usuarios/novo', loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form').then(m => m.UsuarioFormComponent) },
      { path: 'usuarios/:id', loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form').then(m => m.UsuarioFormComponent) },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];