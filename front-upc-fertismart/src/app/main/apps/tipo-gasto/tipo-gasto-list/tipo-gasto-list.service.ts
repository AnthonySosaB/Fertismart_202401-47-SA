import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TipoGastoListService implements Resolve<any> {
  public onTipoGastoListChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onTipoGastoListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTipoGastoList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataTipoGastoList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_TIPO_GASTO}search`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onTipoGastoListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewTipoGasto(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando tipo de costo...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_TIPO_GASTO}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo tipo de costo',
            'No se pudo agregar tipo de costo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editTipoGasto(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando tipo de costo...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_TIPO_GASTO}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar tipo de costo',
            'No se pudo editar tipo de costo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteTipoGasto(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando tipo de costo...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_TIPO_GASTO}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar tipo de costo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
