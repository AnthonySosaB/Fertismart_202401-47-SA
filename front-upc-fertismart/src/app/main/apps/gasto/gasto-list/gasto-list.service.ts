import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { ICampo } from 'app/shared/interfaces/campo.interface';
import { ITipoGasto } from 'app/shared/interfaces/tipo-gasto.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GastoListService implements Resolve<any> {
  public onGastoReportListChanged: BehaviorSubject<any>;
  public onCampoChanged: BehaviorSubject<any>;
  public onTipoGastoChanged: BehaviorSubject<any>;
  public onCardAnalyticsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onGastoReportListChanged = new BehaviorSubject({});
    this.onCampoChanged = new BehaviorSubject([]);
    this.onTipoGastoChanged = new BehaviorSubject([]);
    this.onCardAnalyticsChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        this.getDataGastoList(), 
        this.getCampoList(), 
        this.getTipoGastoList()]).then(() => { resolve(); }, reject);
    });
  }

  getDataGastoList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_GASTO}search_report`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onGastoReportListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewGasto(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando costo...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_GASTO}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo costo',
            'No se pudo agregar costo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editGasto(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando costo...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_GASTO}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar costo',
            'No se pudo editar costo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteGasto(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando costo...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_GASTO}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar costo',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  getCampoList(): Promise<ICampo[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_CAMPO}search`).subscribe((response: any) => {
        this.onCampoChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  getTipoGastoList(): Promise<ITipoGasto[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_TIPO_GASTO}search`).subscribe((response: any) => {
        this.onTipoGastoChanged.next(response);
        resolve(response);
      }, reject);
    });
  }
}
