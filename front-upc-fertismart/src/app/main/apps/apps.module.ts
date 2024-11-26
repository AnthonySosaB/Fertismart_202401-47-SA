import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'parameter',
    loadChildren: () => import('./parameter/parameter.module').then(m => m.ParameterModule)
  },
  {
    path: 'parameter-detail',
    loadChildren: () => import('./parameter-detail/parameter-detail.module').then(m => m.ParameterDetailModule)
  },
  {
    path: 'cultivo',
    loadChildren: () => import('./cultivo/cultivo.module').then(m => m.CultivoModule)
  },
  {
    path: 'fertilizante',
    loadChildren: () => import('./fertilizante/fertilizante.module').then(m => m.FertilizanteModule)
  },
  {
    path: 'variedad',
    loadChildren: () => import('./variedad/variedad.module').then(m => m.VariedadModule)
  },
  {
    path: 'campo',
    loadChildren: () => import('./campo/campo.module').then(m => m.CampoModule)
  },
  {
    path: 'tipo-costo',
    loadChildren: () => import('./tipo-gasto/tipo-gasto.module').then(m => m.TipoGastoModule)
  },
  {
    path: 'costo',
    loadChildren: () => import('./gasto/gasto.module').then(m => m.GastoModule)
  },
  {
    path: 'aplicacion',
    loadChildren: () => import('./aplicacion/aplicacion.module').then(m => m.AplicacionModule)
  },
  {
    path: 'recomendacion',
    loadChildren: () => import('./recomendacion/recomendacion.module').then(m => m.RecomendacionModule)
  },
  {
    path: 'suelo',
    loadChildren: () => import('./suelo/suelo.module').then(m => m.SueloModule)
  }
];

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  providers: [DatePipe]
})
export class AppsModule {}
