import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ParameterListService implements Resolve<any> {
  public onParameterListChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onParameterListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataParameterList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataParameterList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.ENTICEN_PARAMETER)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onParameterListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewParameter(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando parámetro...');
    return this._httpClient.post<any>(`${Endpoints.ENTICEN_PARAMETER}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo parámetro',
            'No se pudo agregar parámetro',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editParameter(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando parámetro...');
    return this._httpClient.patch<any>(`${Endpoints.ENTICEN_PARAMETER}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar parámetro',
            'No se pudo editar parámetro',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteParameter(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando parámetro...');
    return this._httpClient.delete<any>(`${Endpoints.ENTICEN_PARAMETER}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al eliminar parámetro',
            'No se pudo eliminar parámetro',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
