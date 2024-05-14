import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'event-board',
    },

    {
        path: 'event-board',
        loadComponent: () => import('./event-board/event-page.component')
            .then(mod => mod.EventPageComponent),
    },

];
