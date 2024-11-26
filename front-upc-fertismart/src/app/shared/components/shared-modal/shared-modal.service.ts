import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { Observable } from 'rxjs';

@Injectable()
export class SharedModalService implements Resolve<any> {
  emitOpenModal$ = new EventEmitter();
  emitCloseModal$ = new EventEmitter();
  
  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([]).then(() => {
        resolve();
      }, reject);
    });
  }

  emitOpenModal(configModal) {
      this.emitOpenModal$.emit(configModal);
  }

  emitCloseModal() {
    this.emitCloseModal$.emit();
  } 
}
