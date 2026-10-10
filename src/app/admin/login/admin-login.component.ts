import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { filter, take } from 'rxjs'
import { AuthService } from '../../shared/auth.service'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, TailwindClassDirective],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
      <div class="w-full max-w-md text-center">
        <img
          class="mx-auto mb-6 h-24 w-auto"
          src="https://www.lascumbres.edu.ar/images/logo.png"
          alt="Las Cumbres"
        />
        <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          Administración del Concert
        </h1>
        <p class="mb-8 text-sm text-gray-600">
          Iniciá sesión con tu cuenta de Google autorizada.
        </p>

        @if (error) {
          <p
            class="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
          >
            {{ error }}
          </p>
        }

        <button
          [appTailwindClass]="'btn-small-red'"
          [disabled]="loading"
          (click)="login()"
        >
          {{ loading ? 'Ingresando...' : 'Ingresar con Google' }}
        </button>
      </div>
    </div>
  `,
})
export class AdminLoginComponent implements OnInit {
  loading = false
  error = ''

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.authReady$
      .pipe(
        filter((ready) => ready),
        take(1),
      )
      .subscribe(() => {
        if (this.authService.isAdmin()) {
          this.router.navigateByUrl('/admin')
        }
      })
  }

  async login(): Promise<void> {
    this.loading = true
    this.error = ''
    try {
      await this.authService.signInWithGoogle()
      await this.router.navigateByUrl('/admin')
    } catch (err: unknown) {
      this.error =
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesión. Intentá de nuevo.'
    } finally {
      this.loading = false
    }
  }
}
