import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

/**
 * Guard factory: `permissionGuard('USUARIO_LISTAR')` ou `permissionGuard(['A','B'])`
 * (qualquer uma das chaves libera o acesso). Complementa authGuard — este guard
 * assume que a rota já está protegida contra usuários não autenticados (authGuard
 * no nível pai /dashboard) e só decide se o usuário autenticado pode ver ESTA rota.
 */
export function permissionGuard(chaves: string | string[]): CanActivateFn {
  return () => {
    const platformId = inject(PLATFORM_ID);
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!isPlatformBrowser(platformId)) return true;

    const requeridas = Array.isArray(chaves) ? chaves : [chaves];
    if (auth.hasAnyPermission(requeridas)) return true;

    router.navigateByUrl('/dashboard/acesso-negado');
    return false;
  };
}
