import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { DespesaResponse } from '../../models/financeiro/DespesaResponse';
import { DespesaRequest, BaixarDespesaRequest } from '../../models/financeiro/DespesaRequest';

const HTTP_TIMEOUT_MS = 30_000;

export interface DespesaFiltro {
  cdCategoriaDespesa?: number;
  status?: number;
  dtInicio?: string;
  dtFim?: string;
}

@Injectable({ providedIn: 'root' })
export class DespesaService {
  constructor(private http: HttpClient) {}

  listar(filtros?: DespesaFiltro): Observable<DespesaResponse[]> {
    let url = `${environment.apiUrl}/financeiro/despesa`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.cdCategoriaDespesa != null) params.set('cdCategoriaDespesa', String(filtros.cdCategoriaDespesa));
      if (filtros.status != null) params.set('status', String(filtros.status));
      if (filtros.dtInicio) params.set('dtInicio', filtros.dtInicio);
      if (filtros.dtFim) params.set('dtFim', filtros.dtFim);
      const query = params.toString();
      if (query) url += '?' + query;
    }
    return this.http.get<DespesaResponse[]>(url).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  obterPorId(id: number): Observable<DespesaResponse> {
    return this.http.get<DespesaResponse>(`${environment.apiUrl}/financeiro/despesa/${id}`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  salvar(body: DespesaRequest): Observable<DespesaResponse> {
    return this.http.post<DespesaResponse>(`${environment.apiUrl}/financeiro/despesa`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  atualizar(body: DespesaRequest): Observable<DespesaResponse> {
    return this.http.post<DespesaResponse>(`${environment.apiUrl}/financeiro/despesa/update`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  baixar(id: number, body: BaixarDespesaRequest): Observable<DespesaResponse> {
    return this.http.post<DespesaResponse>(`${environment.apiUrl}/financeiro/despesa/${id}/baixar`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  cancelar(id: number): Observable<DespesaResponse> {
    return this.http.post<DespesaResponse>(`${environment.apiUrl}/financeiro/despesa/${id}/cancelar`, {}).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/financeiro/despesa/${id}`).pipe(timeout(HTTP_TIMEOUT_MS));
  }
}
