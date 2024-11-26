import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SueloListService implements Resolve<any> {
  public onSueloListChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onSueloListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataSueloList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataSueloList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_SUELO}`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onSueloListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewSuelo(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando suelo...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_SUELO}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo suelo',
            'No se pudo agregar suelo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editSuelo(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando suelo...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_SUELO}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar suelo',
            'No se pudo editar suelo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteSuelo(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando suelo...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_SUELO}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar suelo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
