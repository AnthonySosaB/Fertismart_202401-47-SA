import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ParameterDetailListService implements Resolve<any> {
  public onParameterDetailListChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onParameterDetailListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let currentId = Number(route.paramMap.get('id'));

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataParameterDetailList(currentId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataParameterDetailList(id?): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.post(`${Endpoints.ENTICEN_PARAMETER_DETAIL_LIST}`, {parameter: id})
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onParameterDetailListChanged.next(response.data);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewParameterDetail(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando detalle...');
    return this._httpClient.post<any>(`${Endpoints.ENTICEN_PARAMETER_DETAIL}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo detalle parámetro',
            'No se pudo agregar detalle parámetro',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editParameterDetail(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando detalle...');
    return this._httpClient.patch<any>(`${Endpoints.ENTICEN_PARAMETER_DETAIL}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar detalle pa´rametro',
            'No se pudo editar parámetro',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteParameterDetail(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando detalle...');
    return this._httpClient.delete<any>(`${Endpoints.ENTICEN_PARAMETER_DETAIL}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar parámetro',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
