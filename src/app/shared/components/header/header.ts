import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="w-full flex justify-center fixed overflow-hidden bg-linear-to-r from-navy-dark via-navy to-navy-light">
      <div class="w-full relative mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-white tracking-tight">Itaú Fundos</h1>
            <p class="text-xs text-white/60 font-medium">Gestão de Fundos de Investimento</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <div class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-xs font-medium text-white/80">Case Itaú</span>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
