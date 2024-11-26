import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { AplicacionListService } from './aplicacion-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { IAplicacion } from 'app/shared/interfaces/aplicacion.interface';
import { PermissionObjectService } from 'app/shared/services/permissions-object.service';
import { UPermissions } from 'app/shared/enums/user-permissions.enum';

@Component({
  selector: 'app-aplicacion-list',
  templateUrl: './aplicacion-list.component.html',
  styleUrls: ['./aplicacion-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AplicacionListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IAplicacion = {} as IAplicacion;
  private tempData = [];
  public claimMainCreateAplication: boolean;
  public claimMainEditAplication: boolean;
  public claimMainDeleteAplication: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _aplicacionListService: AplicacionListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService,
    private _permissionObjectService: PermissionObjectService
  ) {
    this.claimMainCreateAplication = _permissionObjectService.getMainPermission(UPermissions.MAIN_APLICATION_CREATE);
    this.claimMainEditAplication = _permissionObjectService.getMainPermission(UPermissions.MAIN_APLICATION_EDIT);
    this.claimMainDeleteAplication = _permissionObjectService.getMainPermission(UPermissions.MAIN_APLICATION_DELETE);
    
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._aplicacionListService.onAplicacionListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.rows = response;
        this.tempData = this.rows;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  assignTitleBreadcrumbs() {
    this.contentHeader = {
      headerTitle: 'Aplicaciones',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Aplicaciones',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.get_recomendacion_estado.toLowerCase().indexOf(val) !== -1 ||
        d.get_nombre_fertilizante.toLowerCase().indexOf(val) !== -1 ||
        d.get_nombre_campo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onAddAplicacion(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditAplicacion(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar aplicación',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar la aplicacion <strong>${rowParam.resultado}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteAplicacion.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteAplicacion(id) {
    this._aplicacionListService.deleteAplicacion(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el aplicacion correctamente',
          'Buen trabajo!',
        );
        this._aplicacionListService.getDataAplicacionList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }

  onGenerateReportCSV() {
    this._aplicacionListService.getReportCSV()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'crop_fertilizers.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this._loadMsgService.showToastMsgSuccess(
          'Se descargó el reporte correctamente',
          'Buen trabajo!',
        );
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });
  }
}
