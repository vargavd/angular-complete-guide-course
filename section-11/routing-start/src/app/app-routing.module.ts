import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { ServersComponent } from './servers/servers.component';
import { ServerComponent } from './servers/server/server.component';
import { EditServerComponent } from './servers/edit-server/edit-server.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './auth-guard.service';
import { CanDeactivateGuardService } from './servers/edit-server/can-deactivate-guard.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ServerResolver } from './servers/server/server-resolver.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent }, // localhost:4200
  { path: 'users', component: UsersComponent, children: [ // localhost:4200/users
    { path: ':id/:name', component: UserComponent }, // localhost:4200/users/{anything}
  ] },
  { 
    path: 'servers', 
    canActivateChild: [AuthGuardService], 
    component: ServersComponent, 
    children: [ // localhost:4200/servers
      { path: ':id', component: ServerComponent, resolve: {server: ServerResolver} }, // localhost:4200/servers/{anything}
      { path: ':id/edit', component: EditServerComponent, canDeactivate: [CanDeactivateGuardService] }, // localhost:4200/servers/{anything}/edit
    ]
  },
  // { path: 'not-found', component: PageNotFoundComponent }, // localhost:4200/not-found
  { path: 'not-found', component: ErrorPageComponent, data: { message: 'Page not found' } }, // localhost:4200/not-found
  { path: '**', redirectTo: '/not-found' }, // localhost:4200/something
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes, {useHash: true}) // This is for older browsers that don't support the HTML5 history API. It adds a hash to the URL.
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}