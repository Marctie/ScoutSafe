import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'setup', loadChildren: () => import('./setup/setup.module').then(m => m.SetupPageModule) },
      { path: 'knots', loadChildren: () => import('./knots/knots.module').then(m => m.KnotsPageModule) },
      { path: 'risks', loadChildren: () => import('./risks/risks.module').then(m => m.RisksPageModule) },
      { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportPageModule) },
      { path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule) },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule) },
      { path: '', redirectTo: 'setup', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
