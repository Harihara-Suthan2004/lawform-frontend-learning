import { Routes } from '@angular/router';
import { Layout } from './Components/layout/layout';
import { Home } from './Pages/home/home';
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
