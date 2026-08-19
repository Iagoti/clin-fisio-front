import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/auth/auth.guard';
import { permissionGuard } from './core/auth/permission.guard';

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
      { path: 'agendamentos', loadComponent: () => import('./pages/agendamentos/agendamentos').then(m => m.AgendamentosComponent) },
      { path: 'agendamentos/novo', loadComponent: () => import('./pages/agendamentos/agendamento-form/agendamento-form').then(m => m.AgendamentoFormComponent) },
      { path: 'agendamentos/:id', loadComponent: () => import('./pages/agendamentos/agendamento-form/agendamento-form').then(m => m.AgendamentoFormComponent) },
      { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil').then(m => m.PerfilComponent) },
      { path: 'acesso-negado', loadComponent: () => import('./pages/acesso-negado/acesso-negado').then(m => m.AcessoNegadoComponent) },
      {
        path: 'usuarios',
        canActivate: [permissionGuard('USUARIO_LISTAR')],
        loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent),
      },
      {
        path: 'usuarios/novo',
        canActivate: [permissionGuard('USUARIO_CRIAR')],
        loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form').then(m => m.UsuarioFormComponent),
      },
      {
        path: 'usuarios/:id',
        canActivate: [permissionGuard('USUARIO_LISTAR')],
        loadComponent: () => import('./pages/usuarios/usuario-form/usuario-form').then(m => m.UsuarioFormComponent),
      },
      {
        path: 'roles',
        canActivate: [permissionGuard('ROLE_LISTAR')],
        loadComponent: () => import('./pages/roles/roles').then(m => m.RolesComponent),
      },
      {
        path: 'roles/novo',
        canActivate: [permissionGuard('ROLE_GERENCIAR')],
        loadComponent: () => import('./pages/roles/role-form/role-form').then(m => m.RoleFormComponent),
      },
      {
        path: 'roles/:id',
        canActivate: [permissionGuard('ROLE_LISTAR')],
        loadComponent: () => import('./pages/roles/role-form/role-form').then(m => m.RoleFormComponent),
      },
      {
        path: 'financeiro',
        canActivate: [permissionGuard('FINANCEIRO_RELATORIO_VISUALIZAR')],
        loadComponent: () => import('./pages/financeiro/financeiro-dashboard/financeiro-dashboard').then(m => m.FinanceiroDashboardComponent),
      },
      {
        path: 'financeiro/contas-receber',
        canActivate: [permissionGuard('FINANCEIRO_CONTAS_RECEBER_LISTAR')],
        loadComponent: () => import('./pages/financeiro/contas-receber/contas-receber').then(m => m.ContasReceberComponent),
      },
      {
        path: 'financeiro/contas-receber/novo',
        canActivate: [permissionGuard('FINANCEIRO_CONTAS_RECEBER_CRIAR')],
        loadComponent: () => import('./pages/financeiro/contas-receber/pagamento-form/pagamento-form').then(m => m.PagamentoFormComponent),
      },
      {
        path: 'financeiro/contas-receber/:id',
        canActivate: [permissionGuard('FINANCEIRO_CONTAS_RECEBER_LISTAR')],
        loadComponent: () => import('./pages/financeiro/contas-receber/pagamento-form/pagamento-form').then(m => m.PagamentoFormComponent),
      },
      {
        path: 'financeiro/contas-pagar',
        canActivate: [permissionGuard('FINANCEIRO_CONTAS_PAGAR_LISTAR')],
        loadComponent: () => import('./pages/financeiro/contas-pagar/contas-pagar').then(m => m.ContasPagarComponent),
      },
      {
        path: 'financeiro/contas-pagar/novo',
        canActivate: [permissionGuard('FINANCEIRO_CONTAS_PAGAR_CRIAR')],
        loadComponent: () => import('./pages/financeiro/contas-pagar/despesa-form/despesa-form').then(m => m.DespesaFormComponent),
      },
      {
        path: 'financeiro/contas-pagar/:id',
        canActivate: [permissionGuard('FINANCEIRO_CONTAS_PAGAR_LISTAR')],
        loadComponent: () => import('./pages/financeiro/contas-pagar/despesa-form/despesa-form').then(m => m.DespesaFormComponent),
      },
      {
        path: 'financeiro/categorias-despesa',
        canActivate: [permissionGuard('FINANCEIRO_CATEGORIA_LISTAR')],
        loadComponent: () => import('./pages/financeiro/categorias-despesa/categorias-despesa').then(m => m.CategoriasDespesaComponent),
      },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
