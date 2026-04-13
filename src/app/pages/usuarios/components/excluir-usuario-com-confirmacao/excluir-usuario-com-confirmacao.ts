import { Component, EventEmitter, inject, Injector, Input, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BtnExcluirUsuario } from '../btn-excluir-usuario/btn-excluir-usuario';

@Component({
  selector: 'app-excluir-usuario-com-confirmacao',
  standalone: true,
  imports: [CommonModule, BtnExcluirUsuario, MatSnackBarModule],
  templateUrl: './excluir-usuario-com-confirmacao.html',
  styleUrl: './excluir-usuario-com-confirmacao.scss',
})
export class ExcluirUsuarioComConfirmacao {
  @Input({ required: true }) excluindo!: boolean;
  @Output() confirmado = new EventEmitter<void>();

  private readonly snackBar = inject(MatSnackBar);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  onSolicitarExclusao(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void this.abrirConfirmacaoExclusao();
  }

  private async abrirConfirmacaoExclusao(): Promise<void> {
    try {
      const [{ MatDialog }, { ConfirmarExclusaoUsuarioDialog }] = await Promise.all([
        import('@angular/material/dialog'),
        import('../confirmar-exclusao-usuario-dialog/confirmar-exclusao-usuario-dialog'),
      ]);
      const dialog = this.injector.get(MatDialog);
      dialog
        .open(ConfirmarExclusaoUsuarioDialog, {
          width: 'min(420px, calc(100vw - 32px))',
          autoFocus: 'first-tabbable',
          closeOnNavigation: true,
        })
        .afterClosed()
        .subscribe((confirmado) => {
          if (confirmado === true) {
            this.confirmado.emit();
          }
        });
    } catch (e) {
      console.error('Erro ao abrir confirmação de exclusão', e);
      this.snackBar.open('Não foi possível abrir a confirmação. Tente novamente.', 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-erro'],
      });
    }
  }
}
