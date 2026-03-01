import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { UsuarioResponse } from '../../models/usuario/UsuarioResponse';

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
}
