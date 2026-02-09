import { Routes } from '@angular/router';
import { Layout } from './Components/layout/layout';
import { Home } from './Pages/home/home';
import { TemplateManagement } from './Pages/template-management/template-management';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'template-management',
        component: TemplateManagement,
        data: { title: 'Template management' },
      },
      {
            path:'create-notice', // Add this new path
                loadComponent: () => import('./Pages/create-notice/create-notice').then(m => m.CreateNotice)
            },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
