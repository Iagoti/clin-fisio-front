import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { CategoriaDespesaResponse } from '../../models/financeiro/CategoriaDespesaResponse';
import { CategoriaDespesaRequest } from '../../models/financeiro/CategoriaDespesaRequest';

const HTTP_TIMEOUT_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class CategoriaDespesaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<CategoriaDespesaResponse[]> {
    return this.http.get<CategoriaDespesaResponse[]>(`${environment.apiUrl}/financeiro/categoria-despesa`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  salvar(body: CategoriaDespesaRequest): Observable<CategoriaDespesaResponse> {
    return this.http.post<CategoriaDespesaResponse>(`${environment.apiUrl}/financeiro/categoria-despesa`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  atualizar(body: CategoriaDespesaRequest): Observable<CategoriaDespesaResponse> {
    return this.http.post<CategoriaDespesaResponse>(`${environment.apiUrl}/financeiro/categoria-despesa/update`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }
}
