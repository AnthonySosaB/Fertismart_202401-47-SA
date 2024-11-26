import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Endpoints } from 'app/shared/enums/endpoints.enum';
import { ICampo } from 'app/shared/interfaces/campo.interface';
import { ICultivo } from 'app/shared/interfaces/cultivo.interface';
import { IFertilizante } from 'app/shared/interfaces/fertilizante.interface';
import { IRecomendacion } from 'app/shared/interfaces/recomendacion.interface';
import { IVariedad } from 'app/shared/interfaces/variedad.interface';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AplicacionListService implements Resolve<any> {
  public onAplicacionListChanged: BehaviorSubject<any>;
  public onCampoChanged: BehaviorSubject<any>;
  public onFertilizanteChanged: BehaviorSubject<any>;
  public onRecomendacionChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _loadMsgService: LoadMessageService
  ) {
    this.onAplicacionListChanged = new BehaviorSubject({});
    this.onCampoChanged = new BehaviorSubject([]);
    this.onFertilizanteChanged = new BehaviorSubject([]);
    this.onRecomendacionChanged = new BehaviorSubject([]);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        this.getCampoList(),
        this.getFertilizanteList(),
        this.getRecomendacionList(),
        this.getDataAplicacionList()]).then(() => { resolve(); }, reject);
    });
  }

  getDataAplicacionList(): Promise<any[]> {
    this._loadMsgService.showLoadingMsg();

    return new Promise((resolve, reject) => {
      this._httpClient.get(`${Endpoints.FERTISMART_APLICACION}search/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.hideLoadingMsg();
          return throwError(e)
        })
      )
      .subscribe((response: any) => {
        this.onAplicacionListChanged.next(response);
        this._loadMsgService.hideLoadingMsg();
        resolve(response);
      }, reject);
    });
  }

  addNewAplicacion(body: any) {
    this._loadMsgService.showLoadingMsg('Agregando aplicacion...');
    return this._httpClient.post<any>(`${Endpoints.FERTISMART_APLICACION}`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al agregar nuevo aplicacion',
            'No se pudo agregar aplicacion',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  editAplicacion(body: any, id:number) {
    this._loadMsgService.showLoadingMsg('Editando aplicacion...');
    return this._httpClient.patch<any>(`${Endpoints.FERTISMART_APLICACION}${id}/`, body)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            'Lo sentimos ha ocurrido un error al editar aplicacion',
            'No se pudo editar aplicacion',
          );
          this._loadMsgService.hideLoadingMsg();
          
          return throwError(e)
        })
      );
  }

  deleteAplicacion(id: number) {
    this._loadMsgService.showLoadingMsg('Eliminando aplicacion...');
    return this._httpClient.delete<any>(`${Endpoints.FERTISMART_APLICACION}${id}/`)
      .pipe(
        catchError(e => {
          this._loadMsgService.showToastMsgError(
            e,
            'No se pudo eliminar aplicacion',
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

  getFertilizanteList(): Promise<IFertilizante[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.FERTISMART_FERTILIZANTE).subscribe((response: any) => {
        this.onFertilizanteChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  getRecomendacionList(): Promise<IRecomendacion[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Endpoints.FERTISMART_RECOMENDACION).subscribe((response: any) => {
        this.onRecomendacionChanged.next(response);
        resolve(response);
      }, reject);
    });
  }

  getReportCSV() {
    return this._httpClient.get(`${Endpoints.FERTISMART_APLICACION}generate_report/`, {
      responseType: 'blob'
    });
  }
}
