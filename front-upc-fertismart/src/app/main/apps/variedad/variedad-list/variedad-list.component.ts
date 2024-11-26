import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { LoadMessageService } from 'app/shared/services/load-message.service';
import { VariedadListService } from './variedad-list.service';
import { SharedModalService } from 'app/shared/components/shared-modal/shared-modal.service';
import { IModalConfig } from 'app/shared/interfaces/modal-config.interface';
import { IVariedad } from 'app/shared/interfaces/variedad.interface';

@Component({
  selector: 'app-variedad-list',
  templateUrl: './variedad-list.component.html',
  styleUrls: ['./variedad-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VariedadListComponent implements OnInit {
  public contentHeader: object;
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public searchValue = '';
  public ColumnMode = ColumnMode;
  public rowEdit: IVariedad = {} as IVariedad;
  
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _variedadListService: VariedadListService,
    private _coreSidebarService: CoreSidebarService,
    private _loadMsgService: LoadMessageService,
    private _sharedModalService: SharedModalService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.assignTitleBreadcrumbs();
    this._variedadListService.onVariedadListChanged
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
      headerTitle: 'Variedades',
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
            name: 'Variedads',
            isLink: false
          }
        ]
      }
    };
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.nombre_variedad.toLowerCase().indexOf(val) !== -1 ||
        d.requerimiento_suelo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onAddVariedad(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onEditVariedad(name, row): void {
    this.rowEdit = row;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onOpenDeleteModal(rowParam) {
    const configModal: IModalConfig = {
      type: 'danger',
      title: 'Eliminar variedad',
      isHTMLBody: true,
      bodyDescription: `¿Estas seguro de eliminar la variedad <strong>${rowParam.nombre_variedad}</strong>?, recuerda que no se podrá recuperar la información asociada.`,
      hasPrimaryButton: true,
      primaryButtonText: 'Si, eliminar',
      primaryButtonAction: this.onDeleteVariedad.bind(this, rowParam.id),
      hasSecondaryButton: true,
      secondaryButtonText: 'Cancelar',
      secondaryButtonAction: this.onCloseModal.bind(this)

    }
    this._sharedModalService.emitOpenModal(configModal);
  }

  onDeleteVariedad(id) {
    this._variedadListService.deleteVariedad(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(resp => {
        this._loadMsgService.showToastMsgSuccess(
          'Se eliminó el variedad correctamente',
          'Buen trabajo!',
        );
        this._variedadListService.getDataVariedadList();
        this._loadMsgService.hideLoadingMsg();
        this.onCloseModal();
      });;
  }

  onCloseModal() {
    this._sharedModalService.emitCloseModal();
  }
}
