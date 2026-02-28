import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { catchError, delay, startWith } from 'rxjs/operators';
import { TableUsuario } from './components/table-usuario/table-usuario';
import { FiltroNomeUsuario } from './components/filtro-nome-usuario/filtro-nome-usuario';
import { BtnPesquisar } from './components/btn-pesquisar/btn-pesquisar';
import { BtnLimpar } from './components/btn-limpar/btn-limpar';
import { SHARED_INPUT_IMPORTS } from '../../shared/input-modules';
import { UsuarioResponse } from '../../models/usuario/UsuarioResponse';
import { UsuarioService } from '../../core/usuario/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TableUsuario,
    FiltroNomeUsuario,
    BtnPesquisar,
    BtnLimpar,
    SHARED_INPUT_IMPORTS,
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosComponent {
  form: FormGroup;
  usuarios: Observable<UsuarioResponse[]>;
  filtroNome = '';
  termoAplicado = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      credentials: this.fb.group({
        nmUsuario: ['', [Validators.required]],
      }),
    });
   
    this.usuarios = this.usuarioService.listar().pipe(
      catchError(() => of([])),
      delay(0),
      startWith([])
    );
  }

  get credentialsGroup(): FormGroup {
    return this.form.get('credentials') as FormGroup;
  }

  onEditar(usuario: UsuarioResponse): void {
    // TODO: abrir modal/dialog de edição ou navegar para tela de edição
    console.log('Editar usuário:', usuario);
  }

  onExcluir(usuario: UsuarioResponse): void {
    // TODO: confirmar e chamar serviço de exclusão
    console.log('Excluir usuário:', usuario);
  }

  getFiltered(usuarios: UsuarioResponse[]): UsuarioResponse[] {
    if (!this.termoAplicado.trim()) return usuarios;
    const termo = this.termoAplicado.trim().toLowerCase();
    return usuarios.filter((u) => (u.nmUsuario || '').toLowerCase().includes(termo));
  }

  pesquisar(): void {
    this.termoAplicado = this.filtroNome.trim();
  }

  limpar(): void {
    this.termoAplicado = '';
    this.filtroNome = '';
  }
}
