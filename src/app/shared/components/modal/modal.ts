import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      (click)="onBackdropClick($event)"
    >
      <div class="fixed inset-0 bg-navy-dark/60 backdrop-blur-sm modal-backdrop"></div>
      <div class="relative z-10 w-full max-w-lg rounded-2xl bg-surface p-0 shadow-2xl modal-content">
        <div class="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 class="text-base font-semibold text-foreground">{{ title() }}</h2>
          <button
            (click)="closed.emit()"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="px-6 py-5">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styles: `
    .modal-backdrop {
      animation: fadeIn 0.15s ease-out;
    }
    .modal-content {
      animation: slideUp 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `,
})
export class ModalComponent {
  title = input.required<string>();
  closed = output<void>();

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
