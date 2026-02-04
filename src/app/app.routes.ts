import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AesOverview } from './components/aes-overview/aes-overview';
import { AesOperations } from './components/aes-operations/aes-operations';
import { AesDemo } from './components/aes-demo/aes-demo';
import { AesModes } from './components/aes-modes/aes-modes';
import { AesHistory } from './components/aes-history/aes-history';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'overview', component: AesOverview },
  { path: 'operations', component: AesOperations },
  { path: 'demo', component: AesDemo },
  { path: 'modes', component: AesModes },
  { path: 'history', component: AesHistory },
  { path: '**', redirectTo: '' }
];
