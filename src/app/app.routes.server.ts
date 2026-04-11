import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  /** Área logada: CSR evita falhas de módulo/hidratação com CDK Overlay (Material Dialog, etc.). */
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
