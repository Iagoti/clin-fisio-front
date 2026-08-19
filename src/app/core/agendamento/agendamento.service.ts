import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { AgendamentoRequest } from '../../models/agendamento/AgendamentoRequest';
import { AgendamentoResponse } from '../../models/agendamento/AgendamentoResponse';
import { RegistrarFaltaRequest } from '../../models/agendamento/RegistrarFaltaRequest';
import { CriarReposicaoRequest } from '../../models/agendamento/CriarReposicaoRequest';

const HTTP_TIMEOUT_MS = 30_000;

export interface AgendamentoFiltro {
  dataAgendamento?: string;
  nmPaciente?: string;
  cdPaciente?: number;
  tipoAtendimento?: number;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  constructor(private http: HttpClient) {}

  listar(filtros?: AgendamentoFiltro): Observable<AgendamentoResponse[]> {
    let url = `${environment.apiUrl}/agendamento`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.dataAgendamento) params.set('dataAgendamento', filtros.dataAgendamento);
      if (filtros.nmPaciente) params.set('nmPaciente', filtros.nmPaciente);
      if (filtros.cdPaciente != null) params.set('cdPaciente', String(filtros.cdPaciente));
      if (filtros.tipoAtendimento != null) params.set('tipoAtendimento', String(filtros.tipoAtendimento));
      if (filtros.status != null) params.set('status', String(filtros.status));
      const query = params.toString();
      if (query) url += '?' + query;
    }
    return this.http.get<AgendamentoResponse[]>(url).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  obterPorId(id: number): Observable<AgendamentoResponse> {
    return this.http.get<AgendamentoResponse>(`${environment.apiUrl}/agendamento/${id}`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  salvar(body: AgendamentoRequest): Observable<AgendamentoResponse> {
    return this.http.post<AgendamentoResponse>(`${environment.apiUrl}/agendamento`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  atualizar(body: AgendamentoRequest): Observable<AgendamentoResponse> {
    return this.http.post<AgendamentoResponse>(`${environment.apiUrl}/agendamento/update`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/agendamento/${id}`).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  registrarFalta(body: RegistrarFaltaRequest): Observable<AgendamentoResponse> {
    return this.http.post<AgendamentoResponse>(`${environment.apiUrl}/agendamento/falta`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  criarReposicao(body: CriarReposicaoRequest): Observable<AgendamentoResponse> {
    return this.http.post<AgendamentoResponse>(`${environment.apiUrl}/agendamento/reposicao`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }
}
