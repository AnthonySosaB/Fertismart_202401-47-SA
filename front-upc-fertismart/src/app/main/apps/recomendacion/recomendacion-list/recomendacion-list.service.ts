import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { ICampo } from 'app/shared/interfaces/campo.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RecomendacionListService implements Resolve<any> {
  public onRecomendacionListChanged: BehaviorSubject<any>;
  public onCampoChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onRecomendacionListChanged = new BehaviorSubject({});
    this.onCampoChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        this.getDataRecomendacionList(), 
        this.getCampoList()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataRecomendacionList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_RECOMENDACION}search/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onRecomendacionListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewRecomendacion(body: any) {
    this._loadMsgService.showLoadingMsg('Generando recomendación...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_RECOMENDACION}generate/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo recomendacion',
            'No se pudo agregar recomendacion',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editRecomendacion(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando recomendación...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_RECOMENDACION}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar recomendación',
            'No se pudo editar recomendación',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteRecomendacion(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando recomendación...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_RECOMENDACION}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar recomendación',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  getCampoList(): Promise<ICampo[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_CAMPO}search/`).subscribe((response: any) => {
        this.onCampoChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  completedRecomendacion(body: any) {
    this._loadMsgService.showLoadingMsg('Completando recomendación...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_RECOMENDACION}completed/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al completar recomendacion',
            'No se pudo agregar recomendacion',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  rejectedRecomendacion(body: any) {
    this._loadMsgService.showLoadingMsg('Rechazando recomendación...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_RECOMENDACION}rejected/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al rechazar recomendacion',
            'No se pudo agregar recomendacion',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  sendQuote(id: number) {
    this._loadMsgService.showLoadingMsg('Enviando cotización...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_RECOMENDACION}send_quote/`, { recomendacion: id})
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al enviar cotización',
            'No se pudo enviar cotización',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }
}
