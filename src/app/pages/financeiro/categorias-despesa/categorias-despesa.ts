import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CategoriaDespesaService } from '../../../core/financeiro/categoria-despesa.service';
import { CategoriaDespesaResponse } from '../../../models/financeiro/CategoriaDespesaResponse';
import { AtivoInativoEnum, ATIVO_INATIVO_OPCOES } from '../../../models/enums/ativo-inativo.enum';

@Component({
  selector: 'app-categorias-despesa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './categorias-despesa.html',
  styleUrl: './categorias-despesa.scss',
})
export class CategoriasDespesaComponent {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaDespesaService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  dataSource = new MatTableDataSource<CategoriaDespesaResponse>([]);
  displayedColumns = ['nmCategoria', 'stCategoria'];
  statusOpcoes = ATIVO_INATIVO_OPCOES;

  form: FormGroup;
  editandoId: number | null = null;
  formAberto = false;
  salvando = false;

  constructor() {
    this.form = this.fb.group({
      nmCategoria: ['', [Validators.required]],
      stCategoria: [AtivoInativoEnum.ATIVO, [Validators.required]],
    });
    this.carregar();
  }

  private carregar(): void {
    this.categoriaService.listar().subscribe({
      next: categorias => (this.dataSource.data = categorias ?? []),
      error: () => {
        this.snackBar.open('Não foi possível carregar as categorias.', 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  novaCategoria(): void {
    this.editandoId = null;
    this.form.reset({ nmCategoria: '', stCategoria: AtivoInativoEnum.ATIVO });
    this.formAberto = true;
  }

  editarCategoria(categoria: CategoriaDespesaResponse): void {
    this.editandoId = categoria.cdCategoriaDespesa;
    this.form.patchValue({
      nmCategoria: categoria.nmCategoria,
      stCategoria: categoria.stCategoria?.codigo ?? AtivoInativoEnum.ATIVO,
    });
    this.formAberto = true;
  }

  cancelar(): void {
    this.formAberto = false;
    this.editandoId = null;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const body = {
      cdCategoriaDespesa: this.editandoId ?? undefined,
      nmCategoria: this.form.get('nmCategoria')?.value?.trim() ?? '',
      stCategoria: Number(this.form.get('stCategoria')?.value),
    };
    const req = this.editandoId != null ? this.categoriaService.atualizar(body) : this.categoriaService.salvar(body);
    req.pipe(
      finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Categoria salva com sucesso.', 'Fechar', {
          duration: 4000,
          panelClass: ['snackbar-sucesso'],
        });
        this.formAberto = false;
        this.editandoId = null;
        this.carregar();
      },
      error: (err: HttpErrorResponse) => {
        const msg = this.mensagemErroHttp(err, 'Não foi possível salvar a categoria.');
        this.snackBar.open(msg, 'Fechar', { duration: 6000, panelClass: ['snackbar-erro'] });
      },
    });
  }

  private mensagemErroHttp(err: HttpErrorResponse, fallback: string): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as { message: string }).message);
    }
    return err.message || fallback;
  }
}
