import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const AdminGuard = (): boolean | ReturnType<Router['createUrlTree']> => {
  const user = inject(UserService).getCurrentUser();
  if (user?.role === 'ADMIN') return true;
  return inject(Router).createUrlTree(['/login']);
};
