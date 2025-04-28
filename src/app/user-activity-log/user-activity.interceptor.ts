// src/app/user-activity-log/user-activity.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const userActivityInterceptor: HttpInterceptorFn = (req, next) => {
  const dummyLogPattern = /^http:\/\/localhost:7059\/api\/UserActivity\/log\/(.+)$/;

  if (req.method === 'POST' && dummyLogPattern.test(req.url)) {
    const modifiedReq = req.clone({
      url: 'http://localhost:7059/api/UserActivity/log/fa45bcce-7540-440b-8b5e-edeb16c14162'
    });
    return next(modifiedReq);
  }

  return next(req);
};
