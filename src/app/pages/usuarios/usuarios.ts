import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of, Subject } from 'rxjs';
import { catchError, delay, startWith, switchMap } from 'rxjs/operators';
import { TableUsuario } from './components/table-usuario/table-usuario';
import { FiltroNomeUsuario } from './components/filtro-nome-usuario/filtro-nome-usuario';
import { FiltroUsuarioAtivo } from './components/filtro-usuario-ativo/filtro-usuario-ativo';
import { BtnPesquisar } from './components/btn-pesquisar/btn-pesquisar';
import { BtnLimpar } from './components/btn-limpar/btn-limpar';
import { SHARED_INPUT_IMPORTS } from '../../shared/input-modules';
import { UsuarioResponse } from '../../models/usuario/UsuarioResponse';
import { UsuarioService, UsuarioFiltro } from '../../core/usuario/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TableUsuario,
    FiltroNomeUsuario,
    FiltroUsuarioAtivo,
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
  filtroAtivo = true;

  private filtro$ = new Subject<UsuarioFiltro>();

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      credentials: this.fb.group({
        nmUsuario: ['', [Validators.required]],
      }),
    });
   
    this.usuarios = this.filtro$.pipe(
      startWith(this.getFiltroAtual()),
      switchMap((f) =>
        this.usuarioService.listar(f).pipe(
          catchError(() => of([])),
          delay(0)
        )
      )
    );
  }

  private getFiltroAtual(): UsuarioFiltro {
    return {
      nmUsuario: this.filtroNome.trim() || undefined,
      usuarioAtivo: this.filtroAtivo ? 1 : 0,
    };
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

  pesquisar(): void {
    this.filtro$.next(this.getFiltroAtual());
  }

  limpar(): void {
    this.filtroNome = '';
    this.filtroAtivo = true;
    this.filtro$.next(this.getFiltroAtual());
  }
}
