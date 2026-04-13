import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmarExclusaoUsuarioDialogData {
  titulo?: string;
  mensagem?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

@Component({
  selector: 'app-confirmar-exclusao-usuario-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirmar-exclusao-usuario-dialog.html',
  styleUrl: './confirmar-exclusao-usuario-dialog.scss',
})
export class ConfirmarExclusaoUsuarioDialog {
  private readonly dialogRef = inject(MatDialogRef<ConfirmarExclusaoUsuarioDialog, boolean>);
  private readonly injected = inject<ConfirmarExclusaoUsuarioDialogData | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly titulo = this.injected?.titulo ?? 'Excluir usuário';
  readonly mensagem =
    this.injected?.mensagem ??
    'Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.';
  readonly textoConfirmar = this.injected?.textoConfirmar ?? 'Excluir';
  readonly textoCancelar = this.injected?.textoCancelar ?? 'Cancelar';

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
