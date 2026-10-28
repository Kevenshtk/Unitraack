import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors, { CorsOptions } from 'cors';
import { Request, Response, NextFunction } from 'express';

/**
 * 1. Headers de Segurança HTTP (Helmet)
 * Configurado especificamente para API REST, garantindo proteção contra Clickjacking,
 * MIME Sniffing, XSS e forçando HSTS sem bloquear assets de fotos ou SVG.
 */
export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: false // Delegado para a camada de frontend/Cloudflare para não interferir em respostas JSON
});

/**
 * 2. Rate Limiting Multicamada
 * Limite confortável para operações da guarita/pátio, evitando falso-positivos em uso intenso.
 * No ambiente de desenvolvimento local, o rate limit é flexibilizado para não bloquear desenvolvedores.
 */
const isLocalRequest = (req: Request): boolean => {
  const ip = req.ip || req.socket.remoteAddress || '';
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.')
  );
};

export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 600, // 600 requisições por IP a cada 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Limite de requisições excedido. Por favor, aguarde alguns instantes antes de tentar novamente.'
  },
  skip: (req: Request) => {
    // Não aplica rate limit em preflights OPTIONS, health check, testes ou requisições locais/desenvolvimento
    return (
      req.method === 'OPTIONS' ||
      req.path === '/health' ||
      process.env.NODE_ENV !== 'production' ||
      process.env.DISABLE_RATE_LIMIT === 'true' ||
      isLocalRequest(req)
    );
  }
});

/**
 * Rate Limiting estrito para endpoints de autenticação e registro (anti força-bruta em produção)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 25, // Máximo 25 tentativas por IP a cada 15 min em produção
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Muitas tentativas de autenticação ou cadastro. Aguarde 15 minutos para tentar novamente.'
  },
  skip: (req: Request) => {
    return (
      req.method === 'OPTIONS' ||
      process.env.NODE_ENV !== 'production' ||
      process.env.DISABLE_RATE_LIMIT === 'true' ||
      isLocalRequest(req)
    );
  }
});

/**
 * 3. CORS Universal e Inteligente
 * Suporta perfeitamente:
 * - Desenvolvimento local: localhost, 127.0.0.1, [::1], subdomínios locais (*.localhost), portas dinâmicas (5173, 3000, 4173, etc.)
 * - IPs da rede local (LAN RFC 1918: 192.168.x.x, 10.x.x.x, 172.16-31.x.x) para testes em dispositivos móveis ou rede interna
 * - Deploy em produção na Vercel (*.vercel.app, unitraack.vercel.app)
 * - Deploy de API na Railway (*.up.railway.app, *.railway.app)
 * - Domínios oficiais (*.unitraack.com e unitraack.com)
 * - Whitelist customizada via variável ALLOWED_ORIGINS no .env
 * - Chamadas sem origin ou origin='null' (Postman, curl, apps nativos, WebViews)
 */
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().toLowerCase())
  : [];

export const isAllowedOrigin = (origin: string): boolean => {
  if (!origin || origin === 'null') return true;

  const normalized = origin.trim().toLowerCase();

  // 1. Localhost, loopback IPv4/IPv6 em qualquer porta, HTTP ou HTTPS
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(normalized)) return true;

  // 2. Subdomínios locais para multi-tenant (ex: http://usina-lins.localhost:5173)
  if (/^https?:\/\/([a-zA-Z0-9_-]+\.)+localhost(:\d+)?$/i.test(normalized)) return true;

  // 3. IPs de rede local privada (LAN - para testar do celular ou rede local)
  if (/^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(normalized)) return true;
  if (/^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(normalized)) return true;
  if (/^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(normalized)) return true;

  // 4. Domínios locais de teste (.local, .test, .internal)
  if (/^https?:\/\/([a-zA-Z0-9_-]+\.)*(local|internal|test)(:\d+)?$/i.test(normalized)) return true;

  // 5. Deploy oficial e previews na Vercel (ex: unitraack.vercel.app, *.vercel.app)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)?vercel\.app$/i.test(normalized)) return true;

  // 6. Domínio oficial Unitraack e seus subdomínios (*.unitraack.com)
  if (/^https?:\/\/([a-zA-Z0-9_-]+\.)?unitraack\.com$/i.test(normalized)) return true;

  // 7. Domínios Railway
  if (/^https?:\/\/([a-zA-Z0-9_-]+\.)?up\.railway\.app$/i.test(normalized)) return true;
  if (/^https?:\/\/([a-zA-Z0-9_-]+\.)?railway\.app$/i.test(normalized)) return true;

  // 8. Whitelist explícita configurada via variável de ambiente ALLOWED_ORIGINS
  if (allowedOriginsEnv.includes(normalized)) return true;

  return false;
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Se não tiver origin (ex: Postman, mobile, curl, healthcheck) ou origin "null"
    if (!origin || origin === 'null') {
      return callback(null, true);
    }

    // Em ambiente de desenvolvimento local, ou se a origem for permitida, libera acesso imediatamente
    if (process.env.NODE_ENV !== 'production' || isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    console.warn(`[CORS Blocked] Requisição bloqueada para a origem: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  // Permitir headers essenciais e dinâmicos para suportar autenticação, multi-tenant e Supabase
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Tenant-Slug',
    'x-tenant-slug',
    'X-Tenant-Id',
    'x-tenant-id',
    'Accept',
    'Origin',
    'X-Requested-With',
    'apikey',
    'x-client-info',
    'Cache-Control',
    'Pragma',
    'Expires',
    'If-Modified-Since',
    'Range'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Total-Count',
    'Content-Disposition',
    'Content-Length',
    'Authorization'
  ],
  maxAge: 86400, // 24 horas de cache para requisições preflight OPTIONS no navegador
  optionsSuccessStatus: 204
};

/**
 * 4. Sanitização de Logs de Requisição
 * Impede que tokens, senhas ou dados sensíveis vazem nos logs do servidor.
 */
export const sanitizedRequestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Mascara tokens na URL se houver (ex: /invitation/xyz123)
  const safeUrl = req.originalUrl.replace(/\/invitation\/[a-zA-Z0-9-_]+/gi, '/invitation/***REDACTED***');

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log estruturado e seguro
    console.log(`[HTTP] ${req.method} ${safeUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
