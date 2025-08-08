import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Configura middlewares de segurança para a aplicação
 */
export const setupSecurityMiddlewares = (app: Express) => {
  console.log(`🔒 [SECURITY] Configurando middlewares - NODE_ENV: ${process.env.NODE_ENV}`);

  // Helmet para headers de segurança
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http://localhost:3000", "http://localhost:4000"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting - mais permissivo em desenvolvimento
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: process.env.NODE_ENV === 'development' ? 1000 : 100, // 1000 em dev, 100 em prod
    message: {
      error: 'Muitas tentativas',
      message: 'Muitas requisições do mesmo IP, tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Pular rate limiting em desenvolvimento para certas rotas
      return process.env.NODE_ENV === 'development' &&
        (req.path === '/health' || req.path.startsWith('/api/auth'));
    }
  });

  // Rate limiting para login - mais permissivo em desenvolvimento
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: process.env.NODE_ENV === 'development' ? 100 : 5, // 100 em dev, 5 em prod
    message: {
      error: 'Muitas tentativas de login',
      message: 'Muitas tentativas de login do mesmo IP, tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Aplicar rate limiting geral apenas em produção
  if (process.env.NODE_ENV !== 'development') {
    console.log('🔒 [SECURITY] Aplicando rate limiting geral');
    app.use('/api/', limiter);
  } else {
    console.log('🔒 [SECURITY] Pulando rate limiting geral em desenvolvimento');
  }

  // Rate limiting específico para autenticação apenas em produção
  if (process.env.NODE_ENV !== 'development') {
    console.log('🔒 [SECURITY] Aplicando rate limiting para auth');
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/register', authLimiter);
  } else {
    console.log('🔒 [SECURITY] Pulando rate limiting para auth em desenvolvimento');
  }

  // Middleware para log de tentativas suspeitas
  app.use((req: AuthenticatedRequest, res, next) => {
    // Log requisições suspeitas
    if (req.path.includes('admin') && !req.user) {
      console.warn(`🚨 Tentativa de acesso não autorizado: ${req.ip} -> ${req.path}`);
    }
    next();
  });
};

/**
 * Middleware para validar entrada de dados
 */
export const sanitizeInput = (req: any, res: any, next: any) => {
  // Sanitizar strings de entrada
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};
