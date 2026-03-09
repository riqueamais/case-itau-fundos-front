import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal [title]="title()" (closed)="cancelled.emit()">
      <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <p class="mt-3 mb-6 text-sm text-muted leading-relaxed">{{ message() }}</p>
      <div class="flex justify-end gap-3">
        <button
          (click)="cancelled.emit()"
          class="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground-secondary hover:bg-background transition-all duration-150"
        >
          Cancelar
        </button>
        <button
          (click)="confirmed.emit()"
          class="rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-destructive-hover transition-all duration-150"
        >
          {{ confirmLabel() }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  title = input('Confirmar');
  message = input('Tem certeza?');
  confirmLabel = input('Confirmar');
  confirmed = output<void>();
  cancelled = output<void>();
}
