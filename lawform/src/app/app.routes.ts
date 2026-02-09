import { Routes } from '@angular/router';
import { Layout } from './Components/layout/layout';
import { Home } from './Pages/home/home';
import { Users } from './Pages/users/users';
export const routes: Routes = [
    {
        path:'',
        component:Layout,
        children:[
            {
                path:'home',
                component:Home
            },
            {
                path:'user',
                component:Users
            },
            {
                path:'',
                redirectTo:'home',
                pathMatch:'full'

            }
        ]
    },
    {
        path:'**',
        redirectTo:''
    
    }
];
