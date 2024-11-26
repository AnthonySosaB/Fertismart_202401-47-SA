import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { CultivoListService } from './cultivo-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { ICultivo } from 'app/shared/interfaces/cultivo.interface';

@Component({
  selector: 'app-cultivo-list',
  templateUrl: './cultivo-list.component.html',
  styleUrls: ['./cultivo-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CultivoListComponent implements OnInit {
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: ICultivo = {} as ICultivo;
  
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _cultivoListService: CultivoListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._cultivoListService.onCultivoListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        console.log(response)
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
      headerTitle: 'Cultivos',
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
            name: 'Cultivos',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.nombre_cultivo.toLowerCase().indexOf(val) !== -1 ||
        d.requerimiento_suelo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onAddCultivo(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditCultivo(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar cultivo',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar el cultivo <strong>${rowParam.nombre_cultivo}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteCultivo.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteCultivo(id) {
    this._cultivoListService.deleteCultivo(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el cultivo correctamente',
          'Buen trabajo!',
        );
        this._cultivoListService.getDataCultivoList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }
}
