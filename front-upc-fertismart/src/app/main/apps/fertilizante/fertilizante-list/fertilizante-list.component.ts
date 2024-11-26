import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { FertilizanteListService } from './fertilizante-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { IFertilizante } from 'app/shared/interfaces/fertilizante.interface';

@Component({
  selector: 'app-fertilizante-list',
  templateUrl: './fertilizante-list.component.html',
  styleUrls: ['./fertilizante-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FertilizanteListComponent implements OnInit {
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IFertilizante = {} as IFertilizante;
  
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fertilizanteListService: FertilizanteListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._fertilizanteListService.onFertilizanteListChanged
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
      headerTitle: 'Fertilizantes',
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
            name: 'Fertilizantes',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.nombre_fertilizante.toLowerCase().indexOf(val) !== -1 ||
        d.requerimiento_suelo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onAddFertilizante(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditFertilizante(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar fertilizante',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar el fertilizante <strong>${rowParam.nombre_fertilizante}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteFertilizante.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteFertilizante(id) {
    this._fertilizanteListService.deleteFertilizante(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el fertilizante correctamente',
          'Buen trabajo!',
        );
        this._fertilizanteListService.getDataFertilizanteList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }
}
