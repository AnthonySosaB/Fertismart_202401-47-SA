import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class VariedadListService implements Resolve<any> {
  public onVariedadListChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onVariedadListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataVariedadList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataVariedadList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_VARIEDAD}`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onVariedadListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewVariedad(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando variedad...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_VARIEDAD}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo variedad',
            'No se pudo agregar variedad',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editVariedad(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando variedad...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_VARIEDAD}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar variedad',
            'No se pudo editar variedad',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteVariedad(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando variedad...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_VARIEDAD}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar variedad',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
