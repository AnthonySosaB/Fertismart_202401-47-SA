import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { RecomendacionListService } from './recomendacion-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { IRecomendacion } from 'app/shared/interfaces/recomendacion.interface';

@Component({
  selector: 'app-recomendacion-list',
  templateUrl: './recomendacion-list.component.html',
  styleUrls: ['./recomendacion-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecomendacionListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IRecomendacion = {} as IRecomendacion;
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  public previousStatusFilter = '';
  public tempFilterData;
  public selectedStatus = [];
  public threeSuggestions = [];
  public remainingSuggestions = [];
  public recomendacion: number;
  public optionsStatus: any = [
    { name: 'Todos', value: '' },
    { name: 'En Proceso', value: 'En Proceso' },
    { name: 'Completada', value: 'Completada' },
    { name: 'Rechazada', value: 'Rechazada' }
  ];

  constructor(
    private _recomendacionListService: RecomendacionListService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService,
    private _coreSidebarService: CoreSidebarService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._recomendacionListService.onRecomendacionListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        
        this.threeSuggestions = response.slice(0, 3);
        this.remainingSuggestions = response.slice(3);
        this.rows = this.remainingSuggestions;
        this.tempData = this.remainingSuggestions;

      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  assignTitleBreadcrumbs() {
    this.contentHeader = {
      headerTitle: 'Recomendaciones',
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
            name: 'Recomendaciones',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.get_nombre_campo.toLowerCase().indexOf(val) !== -1 ||
        d.get_nombre_fertilizante.toLowerCase().indexOf(val) !== -1 ||
        d.estado_recomendacion.toLowerCase().indexOf(val) !== -1 ||
        d.get_nombre_cultivo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.tempFilterData = this.filterRows(filter);
    this.rows = this.tempFilterData;
  }

  filterRows(statusFilter): any[] {
    this.searchValue = '';

    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialNameMatch = row.estado_recomendacion.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch;
    });
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar recomendación',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar el recomendación <strong> REC-${rowParam.id}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteRecomendacion.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteRecomendacion(id) {
    this._recomendacionListService.deleteRecomendacion(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el recomendación correctamente',
          'Buen trabajo!',
        );
        this._recomendacionListService.getDataRecomendacionList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }

  onAddRecomendacion(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onCompletedRecomendacion(name, row): void {
    this.recomendacion = row.id;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onRejectedRecomendacion(name, row): void {
    this.recomendacion = row.id;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenSendQuoteModal(recomendationId) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Enviar cotización',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de enviar la cotización al área de ventas, recuerda que no se podrá deshacer la acción luego de aceptar.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, enviar',
      primaryButtonAction: this.onSendQuote.bind(this, recomendationId),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onSendQuote(id): void {
    this._recomendacionListService.sendQuote(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se envió la cotización correctamente',
          'Buen trabajo!',
        );
        this._recomendacionListService.getDataRecomendacionList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }
}
