import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { PacoteResponse, IniciarPacoteRequest } from '../../models/financeiro/PacoteResponse';

const HTTP_TIMEOUT_MS = 30_000;

export interface PacoteFiltro {
  cdPaciente?: number;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class PacoteService {
  constructor(private http: HttpClient) {}

  listar(filtros?: PacoteFiltro): Observable<PacoteResponse[]> {
    let url = `${environment.apiUrl}/financeiro/pacote`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.cdPaciente != null) params.set('cdPaciente', String(filtros.cdPaciente));
      if (filtros.status != null) params.set('status', String(filtros.status));
      const query = params.toString();
      if (query) url += '?' + query;
    }
    return this.http.get<PacoteResponse[]>(url).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  iniciar(body: IniciarPacoteRequest): Observable<PacoteResponse> {
    return this.http.post<PacoteResponse>(`${environment.apiUrl}/financeiro/pacote`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }
}
