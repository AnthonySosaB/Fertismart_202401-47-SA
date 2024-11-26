import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = 
[
  {
    id: 'home',
    title: 'Inicio',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'apps/dashboard/analytics'
  },
  {
    id: 'apps',
    type: 'section',
    title: 'Aplicaciones',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children: [
      {
        id: 'invoice',
        title: 'Ventas',
        translate: 'MENU.APPS.SALES',
        type: 'item',
        icon: 'file-text',
        url: 'apps/invoice/list'
      },
      {
        id: 'patient',
        title: 'Paciente',
        translate: 'MENU.APPS.PATIENT',
        type: 'item',
        icon: 'folder-plus',
        url: 'apps/patient/patient-list'
      }
    ]
  },
  {
    id: 'maintenance',
    type: 'section',
    title: 'Mantenimientos',
    translate: 'MENU.MAINTENANCES.SECTION',
    icon: 'package',
    children: [
      {
        id: 'users',
        title: 'Usuarios',
        translate: 'MENU.MAINTENANCES.USERS',
        type: 'item',
        icon: 'user',
        url: 'apps/user/user-list'
      },
      {
        id: 'parameters',
        title: 'Parámetros',
        translate: 'MENU.MAINTENANCES.PARAMETERS',
        type: 'item',
        icon: 'settings',
        url: 'apps/parameter/parameter-list'
      }
    ]
  }
]
