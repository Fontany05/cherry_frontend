import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonamos la petición para habilitar el envío de cookies (withCredentials)
  const secureReq = req.clone({
    withCredentials: true,
  });

  return next(secureReq);
};

