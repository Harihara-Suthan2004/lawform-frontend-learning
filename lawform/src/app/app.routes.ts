import { Routes } from '@angular/router';
import { Layout } from './Components/layout/layout';
import { Home } from './Pages/home/home';
import { History } from './Pages/history/history';
import { DownloadedNotice } from './Pages/downloaded-notice/downloaded-notice';
import { TemplateManagement } from './Pages/template-management/template-management';
import { Welcome } from './Pages/welcome/welcome';
import { NoticePreview } from './Pages/notice-preview/notice-preview';
import { Users } from './Pages/users/users';
import { authGuard,adminGuard,guestGuard} from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: Welcome,
        canActivate: [guestGuard] // Blocks the welcome/login page if already logged in
    },
    {
        path: 'app',
        component: Layout,
        canActivate: [authGuard],
        children: [
            {
                path: 'users',
                component: Users,
                canActivate: [adminGuard] // Only admin can access
            },
            {
                path: 'home',
                component: Home,
                canActivate: [authGuard] // Only regular users (but guard will check)
            },
            {
                path: 'history',
                component: History,
                canActivate: [authGuard]
            },
            {
                path: 'downloaded',
                component: DownloadedNotice,
                canActivate: [authGuard]
            },
            {
                path: 'template-management',
                component: TemplateManagement,
                canActivate: [authGuard]
            },
            {
                path: 'create-notice',
                loadComponent: () => import('./Pages/create-notice/create-notice').then(m => m.CreateNotice),
                canActivate: [authGuard]
            },
            {
                path: 'generated',
                component: NoticePreview,
                canActivate: [authGuard]
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];