import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';

class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Error global:', error);
    if (error?.message) {
      console.error('Mensaje:', error.message);
    }
    if (error?.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
}).catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  if (err?.message) {
    console.error('Mensaje:', err.message);
  }
  if (err?.stack) {
    console.error('Stack:', err.stack);
  }
});
