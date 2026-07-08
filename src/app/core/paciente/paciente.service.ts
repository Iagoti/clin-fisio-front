import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { PacienteRequest } from '../../models/paciente/PacienteRequest';
import { PacienteResponse } from '../../models/paciente/PacienteResponse';

const HTTP_TIMEOUT_MS = 30_000;

export interface PacienteFiltro {
  nmPaciente?: string;
  cpf?: string;
  pacienteAtivo?: number;
}

@Injectable({ providedIn: 'root' })
export class PacienteService {
  constructor(private http: HttpClient) {}

  listar(filtros?: PacienteFiltro): Observable<PacienteResponse[]> {
    let url = `${environment.apiUrl}/paciente`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.nmPaciente) params.set('nmPaciente', filtros.nmPaciente);
      if (filtros.cpf) params.set('cpf', filtros.cpf);
      if (filtros.pacienteAtivo != null) params.set('pacienteAtivo', String(filtros.pacienteAtivo));
      const query = params.toString();
      if (query) url += '?' + query;
    }
    return this.http.get<PacienteResponse[]>(url).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  obterPorId(id: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${environment.apiUrl}/paciente/${id}`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  salvar(body: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(`${environment.apiUrl}/paciente`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  atualizar(body: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(`${environment.apiUrl}/paciente/update`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/paciente/${id}`).pipe(timeout(HTTP_TIMEOUT_MS));
  }
}
