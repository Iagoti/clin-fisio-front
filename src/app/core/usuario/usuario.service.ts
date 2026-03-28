import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { UsuarioResponse } from '../../models/usuario/UsuarioResponse';
import { UsuarioRequest } from '../../models/usuario/UsuarioRequest';

const HTTP_TIMEOUT_MS = 30_000;

export interface UsuarioFiltro {
  nmUsuario?: string;
  usuarioAtivo?: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  listar(filtros?: UsuarioFiltro): Observable<UsuarioResponse[]> {
    let url = `${environment.apiUrl}/usuario`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.nmUsuario != null && filtros.nmUsuario !== '') {
        params.set('nmUsuario', filtros.nmUsuario);
      }
      if (filtros.usuarioAtivo != null) {
        params.set('usuarioAtivo', String(filtros.usuarioAtivo));
      }
      const query = params.toString();
      if (query) url += '?' + query;
    }
    return this.http.get<UsuarioResponse[]>(url);
  }

  obterPorId(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${environment.apiUrl}/usuario/${id}`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  salvar(body: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${environment.apiUrl}/usuario`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  atualizar(body: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${environment.apiUrl}/usuario/update`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/usuario/${id}`);
  }
}
