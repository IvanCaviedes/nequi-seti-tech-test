import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getBoolean } from 'firebase/remote-config';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private rc;

  private flagsSubject = new BehaviorSubject<Record<string, boolean>>({});

  flags$ = this.flagsSubject.asObservable();

  constructor() {
    const app = initializeApp(environment.firebase);
    this.rc = getRemoteConfig(app);

    this.rc.defaultConfig = {
      enableNewNotesUI: false,
    };

    this.rc.settings = {
      minimumFetchIntervalMillis: environment.production ? 3600000 : 0,
      fetchTimeoutMillis: 30000,
    };

    void this.init();
  }

  async init() {
    await fetchAndActivate(this.rc);

    this.flagsSubject.next({
      enableNewNotesUI: getBoolean(this.rc, 'enableNewNotesUI'),
    });
  }

  isEnabled(flag: string): boolean {
    return getBoolean(this.rc, flag);
  }
}
