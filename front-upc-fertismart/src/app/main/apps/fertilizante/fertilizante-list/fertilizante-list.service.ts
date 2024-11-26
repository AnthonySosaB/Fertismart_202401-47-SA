import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FertilizanteListService implements Resolve<any> {
  public onFertilizanteListChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onFertilizanteListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataFertilizanteList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataFertilizanteList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_FERTILIZANTE}`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onFertilizanteListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewFertilizante(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando fertilizante...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_FERTILIZANTE}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo fertilizante',
            'No se pudo agregar fertilizante',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editFertilizante(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando fertilizante...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_FERTILIZANTE}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar fertilizante',
            'No se pudo editar fertilizante',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteFertilizante(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando fertilizante...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_FERTILIZANTE}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar fertilizante',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
