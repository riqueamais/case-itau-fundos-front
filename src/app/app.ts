import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="flex flex-col gap-20 min-h-screen bg-background">
      <app-header />
      
      <main class="w-full flex justify-center">
        <router-outlet />
      </main>
    </div>
  `,
})
export class App {}
