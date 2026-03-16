import { Component, input, output, OnInit, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { Fundo, TipoFundo } from '../../../core/models/fundo.model';
import { FundoService } from '../../../core/services/fundo.service';

@Component({
  selector: 'app-fundo-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal [title]="fundo() ? 'Editar Fundo' : 'Novo Fundo'" (closed)="closed.emit()">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        @if (!fundo()) {
          <div>
            <label class="mb-1.5 block text-sm font-medium text-foreground-secondary">Código</label>
            <input
              formControlName="codigo"
              placeholder="Ex: FND001"
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 outline-none"
            />
            @if (form.get('codigo')?.touched && form.get('codigo')?.errors) {
              <p class="mt-1.5 text-xs text-destructive">Código é obrigatório (máx. 20 caracteres)</p>
            }
          </div>
        }

        <div>
          <label class="mb-1.5 block text-sm font-medium text-foreground-secondary">Nome</label>
          <input
            formControlName="nome"
            placeholder="Nome do fundo"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 outline-none"
          />
          @if (form.get('nome')?.touched && form.get('nome')?.errors) {
            <p class="mt-1.5 text-xs text-destructive">Nome é obrigatório (máx. 100 caracteres)</p>
          }
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-foreground-secondary">CNPJ</label>
          <input
            formControlName="cnpj"
            placeholder="00000000000000"
            maxlength="14"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 outline-none"
          />
          @if (form.get('cnpj')?.touched && form.get('cnpj')?.errors) {
            <p class="mt-1.5 text-xs text-destructive">CNPJ deve ter exatamente 14 dígitos numéricos</p>
          }
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-foreground-secondary">Tipo do Fundo</label>
          <select
            formControlName="codigoTipo"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 outline-none appearance-none cursor-pointer"
          >
            <option [value]="0" disabled>Selecione o tipo</option>
            @for (tipo of tipos(); track tipo.codigo) {
              <option [value]="tipo.codigo">{{ tipo.nome }}</option>
            }
          </select>
          @if (form.get('codigoTipo')?.touched && form.get('codigoTipo')?.errors) {
            <p class="mt-1.5 text-xs text-destructive">Selecione um tipo de fundo</p>
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
            {{ fundo() ? 'Salvar Alterações' : 'Criar Fundo' }}
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class FundoFormComponent implements OnInit {
  fundo = input<Fundo | null>(null);
  closed = output<void>();
  saved = output<any>();

  private fb = inject(FormBuilder);
  private fundoService = inject(FundoService);
  tipos = signal<TipoFundo[]>([]);
  form!: FormGroup;

  ngOnInit() {
    this.fundoService.getTipos().then((t) => this.tipos.set(t));
    const f = this.fundo();
    this.form = this.fb.group({
      codigo: [
        { value: f?.codigo ?? '', disabled: !!f },
        [Validators.required, Validators.maxLength(20)],
      ],
      nome: [f?.nome ?? '', [Validators.required, Validators.maxLength(100)]],
      cnpj: [
        f?.cnpj ?? '',
        [Validators.required, Validators.pattern(/^\d{14}$/)],
      ],
      codigoTipo: [
        f?.codigoTipo ?? 0,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    value.codigoTipo = Number(value.codigoTipo);
    this.saved.emit(value);
  }
}
