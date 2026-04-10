import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(message: string, error?: unknown) {
    console.error(message, error);
  }

  warn(message: string) {
    console.warn(message);
  }

  log(message: string) {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }
}
