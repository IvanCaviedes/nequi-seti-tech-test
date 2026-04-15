import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

/**
 * RemoteConfigService llama a Firebase en el constructor (initializeApp, getRemoteConfig).
 * En TODOS los entornos de test se usa este mock para evitar llamadas reales a la red.
 * Los tests de las clases consumidoras (NotesFecade) también importan este mock.
 */
export class RemoteConfigServiceMock {
  private flagsSubject = new BehaviorSubject<Record<string, boolean>>({
    enableNewNotesUI: false,
  });

  flags$ = this.flagsSubject.asObservable();

  setFlag(flag: string, value: boolean) {
    this.flagsSubject.next({ ...this.flagsSubject.value, [flag]: value });
  }

  isEnabled(_flag: string): boolean {
    return false;
  }
}

import { RemoteConfigService } from '../remote-config.service';

describe('RemoteConfigService (mock)', () => {
  let service: RemoteConfigServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: RemoteConfigService, useClass: RemoteConfigServiceMock }],
    });

    service = TestBed.inject(RemoteConfigService) as unknown as RemoteConfigServiceMock;
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe exponer flags$ como Observable', (done) => {
    service.flags$.subscribe((flags) => {
      expect(flags).toBeDefined();
      done();
    });
  });

  it('debe retornar false por defecto para enableNewNotesUI', (done) => {
    service.flags$.subscribe((flags) => {
      expect(flags['enableNewNotesUI']).toBeFalse();
      done();
    });
  });

  it('debe emitir nuevos valores al hacer setFlag', (done) => {
    const emitted: Record<string, boolean>[] = [];

    service.flags$.subscribe((flags) => {
      emitted.push(flags);
      if (emitted.length === 2) {
        expect(emitted[1]['enableNewNotesUI']).toBeTrue();
        done();
      }
    });

    service.setFlag('enableNewNotesUI', true);
  });

  it('isEnabled debe retornar false', () => {
    expect(service.isEnabled('enableNewNotesUI')).toBeFalse();
  });
});
