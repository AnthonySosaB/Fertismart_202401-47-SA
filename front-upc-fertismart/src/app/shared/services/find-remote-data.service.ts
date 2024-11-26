import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { ToastrService } from 'ngx-toastr';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadMessageService } from './load-message.service';

@Injectable()
export class FindRemoteDataService {

  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService,
    private _loadMsgService: LoadMessageService
  ) { }

  getPersonFabSharedDNI(nro_dni): Observable<any> {
    this._loadMsgService.showLoadingMsg('Consultando DNI...');
    return this._httpClient.post(Endpoints.FERTISMART_FINDER_DNI, {nro_dni:nro_dni}).pipe(
      catchError(e => {
        this._toastrService.error(
          'Lo sentimos ha ocurrido un error al obtener DNI',
          'Comuniquese con el administrador',
          { toastClass: 'toast ngx-toastr', closeButton: true }
        );
        this._loadMsgService.hideLoadingMsg();

        return throwError(e)
      })
    )
  }

  getPersonFabSharedRUC(nro_ruc): Observable<any>  {
    this._loadMsgService.showLoadingMsg('Consultando RUC...');
    return this._httpClient.post(Endpoints.FERTISMART_FINDER_RUC, {nro_ruc:nro_ruc}).pipe(
      catchError(e => {
        this._toastrService.error(
          'Lo sentimos ha ocurrido un error al obtener RUC',
          'Comuniquese con el administrador',
          { toastClass: 'toast ngx-toastr', closeButton: true }
        );
        this._loadMsgService.hideLoadingMsg();

        return throwError(e)
      })
    )
  }
}
