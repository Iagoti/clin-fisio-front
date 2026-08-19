import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { RoleResponse } from '../../models/role/RoleResponse';
import { RoleRequest } from '../../models/role/RoleRequest';
import { PermissaoResponse } from '../../models/role/PermissaoResponse';

const HTTP_TIMEOUT_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private http: HttpClient) {}

  listar(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${environment.apiUrl}/role`).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  obterPorId(id: number): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${environment.apiUrl}/role/${id}`).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  salvar(body: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(`${environment.apiUrl}/role`, body).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  atualizar(body: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(`${environment.apiUrl}/role/update`, body).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/role/${id}`);
  }

  listarPermissoes(): Observable<PermissaoResponse[]> {
    return this.http.get<PermissaoResponse[]>(`${environment.apiUrl}/permissao`).pipe(timeout(HTTP_TIMEOUT_MS));
  }
}
