import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FundoService } from '../../../core/services/fundo.service';
import {
  Fundo,
  CreateFundoRequest,
  UpdateFundoRequest,
} from '../../../core/models/fundo.model';
import { FundoFormComponent } from '../fundo-form/fundo-form';
import { PatrimonioFormComponent } from '../patrimonio-form/patrimonio-form';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CurrencyPipe } from '@angular/common';
import { CnpjPipe } from '../../../shared/pipes/cnpj.pipe';

@Component({
  selector: 'app-fundos-list',
  standalone: true,
  host: { class: 'w-full' },
  imports: [
    FundoFormComponent,
    PatrimonioFormComponent,
    ConfirmDialogComponent,
    CurrencyPipe,
    CnpjPipe,
  ],
  template: `
    <div class="w-full mx-auto max-w-7xl px-8 py-8">
      <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-2xl bg-surface border border-border p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted uppercase tracking-wider">Total de Fundos</p>
              <p class="mt-2 text-3xl font-bold text-foreground tabular-nums">{{ fundos().length }}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003882" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-surface border border-border p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted uppercase tracking-wider">Patrimônio Total</p>
              <p class="mt-2 text-3xl font-bold text-foreground tabular-nums">
                {{ totalPatrimonio() | currency:'BRL':'symbol':'1.0-0':'pt-BR' }}
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-success-light">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-surface border border-border p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-muted uppercase tracking-wider">Tipos Cadastrados</p>
              <p class="mt-2 text-3xl font-bold text-foreground tabular-nums">{{ tiposUnicos() }}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EC7000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
        <div class="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 class="text-base font-semibold text-foreground">Fundos de Investimento</h2>
            <p class="mt-0.5 text-xs text-muted">Gerencie seus fundos cadastrados</p>
          </div>
          <button
            (click)="openCreate()"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Fundo
          </button>
        </div>

        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-24">
            <div class="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary"></div>
            <p class="mt-4 text-sm text-muted">Carregando fundos...</p>
          </div>
        }

        @if (error()) {
          <div class="mx-6 my-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-red-50 p-4">
            <svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-destructive">Erro ao carregar</p>
              <p class="mt-0.5 text-xs text-destructive/80">{{ error() }}</p>
              <button
                (click)="loadFundos()"
                class="mt-2 text-xs font-semibold text-destructive hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        }

        @if (!loading() && !error() && fundos().length === 0) {
          <div class="flex flex-col items-center py-24">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-background">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <p class="mt-4 text-sm font-medium text-foreground">Nenhum fundo cadastrado</p>
            <p class="mt-1 text-xs text-muted">Comece criando seu primeiro fundo de investimento</p>
            <button
              (click)="openCreate()"
              class="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Criar Fundo
            </button>
          </div>
        }

        @if (!loading() && fundos().length > 0) {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-background/50">
                  <th class="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted">Código</th>
                  <th class="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted">Nome</th>
                  <th class="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted">CNPJ</th>
                  <th class="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted">Tipo</th>
                  <th class="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-muted">Patrimônio</th>
                  <th class="px-6 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-muted">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                @for (fundo of fundos(); track fundo.codigo; let i = $index) {
                  <tr class="group hover:bg-primary-50/40 transition-colors duration-100">
                    <td class="px-6 py-4">
                      <span class="inline-flex rounded-md bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy tracking-wide">
                        {{ fundo.codigo }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm font-medium text-foreground">{{ fundo.nome }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm text-muted font-mono tracking-wide">{{ fundo.cnpj | cnpj }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        [class]="getTipoBadgeClass(fundo.nomeTipo)"
                      >
                        {{ fundo.nomeTipo }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      @if (fundo.patrimonio !== null) {
                        <span class="text-sm font-semibold text-foreground tabular-nums">
                          {{ fundo.patrimonio | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                        </span>
                      } @else {
                        <span class="text-sm text-muted-foreground">—</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          (click)="openPatrimonio(fundo)"
                          title="Movimentar patrimônio"
                          class="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-success-light hover:text-success transition-all duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                        </button>
                        <button
                          (click)="openEdit(fundo)"
                          title="Editar"
                          class="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-navy-50 hover:text-navy transition-all duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          (click)="openDelete(fundo)"
                          title="Excluir"
                          class="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-destructive transition-all duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    @if (toast()) {
      <div class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-3.5 shadow-xl toast-in">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-success-light">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground">{{ toast() }}</p>
      </div>
    }

    @if (showCreateForm()) {
      <app-fundo-form (closed)="showCreateForm.set(false)" (saved)="onCreate($event)" />
    }

    @if (showEditForm() && selectedFundo()) {
      <app-fundo-form
        [fundo]="selectedFundo()!"
        (closed)="showEditForm.set(false)"
        (saved)="onUpdate($event)"
      />
    }

    @if (showPatrimonioForm() && selectedFundo()) {
      <app-patrimonio-form
        [fundo]="selectedFundo()!"
        (closed)="showPatrimonioForm.set(false)"
        (saved)="onMovimentarPatrimonio($event)"
      />
    }

    @if (showDeleteConfirm() && selectedFundo()) {
      <app-confirm-dialog
        title="Excluir Fundo"
        [message]="'Tem certeza que deseja excluir o fundo \\'' + selectedFundo()!.nome + '\\'? Esta ação não pode ser desfeita.'"
        confirmLabel="Excluir"
        (confirmed)="onDelete()"
        (cancelled)="showDeleteConfirm.set(false)"
      />
    }
  `,
  styles: `
    .toast-in {
      animation: toastSlide 0.3s ease-out;
    }
    @keyframes toastSlide {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `,
})

export class FundosListComponent implements OnInit {
  private fundoService = inject(FundoService);

  fundos = signal<Fundo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  toast = signal<string | null>(null);

  showCreateForm = signal(false);
  showEditForm = signal(false);
  showPatrimonioForm = signal(false);
  showDeleteConfirm = signal(false);
  selectedFundo = signal<Fundo | null>(null);

  totalPatrimonio = computed(() =>
    this.fundos().reduce((sum, f) => sum + (f.patrimonio ?? 0), 0)
  );

  tiposUnicos = computed(
    () => new Set(this.fundos().map((f) => f.nomeTipo)).size
  );

  ngOnInit() {
    this.loadFundos();
  }

  getTipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      'Renda Fixa': 'bg-blue-50 text-blue-700',
      'Renda Variável': 'bg-purple-50 text-purple-700',
      'Multimercado': 'bg-amber-50 text-amber-700',
      'Multi Mercado': 'bg-amber-50 text-amber-700',
      'Cambial': 'bg-emerald-50 text-emerald-700',
      'Ações': 'bg-rose-50 text-rose-700',
      'Acoes': 'bg-rose-50 text-rose-700',
    };
    return map[tipo] ?? 'bg-gray-50 text-gray-700';
  }

  async loadFundos() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const fundos = await this.fundoService.getAll();
      this.fundos.set(fundos);
    } catch {
      this.error.set(
        'Não foi possível carregar os fundos. Verifique se a API está rodando em https://localhost:5001'
      );
    } finally {
      this.loading.set(false);
    }
  }

  openCreate() {
    this.showCreateForm.set(true);
  }

  openEdit(fundo: Fundo) {
    this.selectedFundo.set(fundo);
    this.showEditForm.set(true);
  }

  openPatrimonio(fundo: Fundo) {
    this.selectedFundo.set(fundo);
    this.showPatrimonioForm.set(true);
  }

  openDelete(fundo: Fundo) {
    this.selectedFundo.set(fundo);
    this.showDeleteConfirm.set(true);
  }

  async onCreate(data: CreateFundoRequest) {
    try {
      await this.fundoService.create(data);
      this.showCreateForm.set(false);
      this.showToast('Fundo criado com sucesso');
      this.loadFundos();
    } catch (err: any) {
      this.showToast(err.response?.data?.message ?? 'Erro ao criar fundo');
    }
  }

  async onUpdate(data: any) {
    const codigo = this.selectedFundo()!.codigo;
    const request: UpdateFundoRequest = {
      nome: data.nome,
      cnpj: data.cnpj,
      codigoTipo: data.codigoTipo,
    };
    try {
      await this.fundoService.update(codigo, request);
      this.showEditForm.set(false);
      this.showToast('Fundo atualizado com sucesso');
      this.loadFundos();
    } catch (err: any) {
      this.showToast(err.response?.data?.message ?? 'Erro ao atualizar fundo');
    }
  }

  async onMovimentarPatrimonio(valor: number) {
    const codigo = this.selectedFundo()!.codigo;
    try {
      await this.fundoService.movimentarPatrimonio(codigo, { valor });
      this.showPatrimonioForm.set(false);
      this.showToast('Patrimônio movimentado com sucesso');
      this.loadFundos();
    } catch (err: any) {
      this.showToast(err.response?.data?.message ?? 'Erro ao movimentar patrimônio');
    }
  }

  async onDelete() {
    const codigo = this.selectedFundo()!.codigo;
    try {
      await this.fundoService.delete(codigo);
      this.showDeleteConfirm.set(false);
      this.showToast('Fundo excluído com sucesso');
      this.loadFundos();
    } catch (err: any) {
      this.showToast(err.response?.data?.message ?? 'Erro ao excluir fundo');
    }
  }

  private showToast(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
