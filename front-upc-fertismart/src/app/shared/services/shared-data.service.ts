import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { ToastrService } from 'ngx-toastr';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SharedService {

  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService
  ) { }

  getParameters(body): Observable<any> {
    return this._httpClient.post(Endpoints.ENTICEN_MANY_PARAM, body).pipe(
      catchError(e => {
        this._toastrService.error(
          'Lo sentimos ha ocurrido un error al obtener parámetros',
          'Comuniquese con el administrador',
          { toastClass: 'toast ngx-toastr', closeButton: true }
        );

        return throwError(e)
      })
    )
  }
}
