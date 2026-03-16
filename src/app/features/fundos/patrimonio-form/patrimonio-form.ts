import { Component, input, output, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { Fundo } from '../../../core/models/fundo.model';

@Component({
  selector: 'app-patrimonio-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal title="Movimentar Patrimônio" (closed)="closed.emit()">
      <div class="mb-5 rounded-xl bg-gradient-to-br from-navy-50 to-background p-4 border border-navy-100/50">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003882" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-foreground">{{ fundo().nome }}</p>
            <p class="text-xs text-muted">
              Patrimônio atual:
              <span class="font-semibold text-foreground">
                {{ fundo().patrimonio !== null ? formatCurrency(fundo().patrimonio!) : '—' }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-foreground-secondary">Valor da movimentação</label>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">R$</span>
            <input
              type="text"
              inputmode="numeric"
              [value]="displayValue"
              (input)="onInput($event)"
              placeholder="0,00"
              class="w-full rounded-lg border border-border bg-surface pl-10 pr-3.5 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 outline-none"
            />
          </div>
          <p class="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Positivo para aporte, negativo para resgate
          </p>
          @if (form.get('valor')?.touched && form.get('valor')?.errors) {
            <p class="mt-1.5 text-xs text-destructive">Informe um valor válido</p>
          }
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-border -mx-6 px-6 -mb-5 pb-5 mt-6!">
          <button
            type="button"
            (click)="closed.emit()"
            class="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground-secondary hover:bg-background transition-all duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="form.invalid"
            class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Confirmar Movimentação
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class PatrimonioFormComponent implements OnInit {
  fundo = input.required<Fundo>();
  closed = output<void>();
  saved = output<number>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  displayValue = '';
  private isNegative = false;

  ngOnInit() {
    this.form = this.fb.group({
      valor: [null, [Validators.required]],
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  onInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;

    this.isNegative = raw.includes('-');

    const digits = raw.replace(/\D/g, '');

    if (!digits) {
      this.displayValue = '';
      this.form.get('valor')?.setValue(null);
      return;
    }

    const cents = parseInt(digits, 10);
    const numericValue = cents / 100;

    this.displayValue = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (this.isNegative) {
      this.displayValue = '-' + this.displayValue;
    }

    this.form.get('valor')?.setValue(this.isNegative ? -numericValue : numericValue);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saved.emit(Number(this.form.value.valor));
  }
}
