# 🛠️ OmniShop-AI Monorepo

Este repositorio contiene dos proyectos principales:

- **`tienda/`** → [Vendure](https://www.vendure.io/) (e-commerce / backend de productos)
- **`whatsapp-webhook/`** → [NestJS](https://nestjs.com/) bot de WhatsApp Business (atención al cliente, precios, pedidos, etc.)

Ambos proyectos comparten configuración y dependencias a través de **npm workspaces**.

---

## 📂 Estructura

```ini
.
├── tienda/              # Proyecto Vendure (Docker + Node)
├── whatsapp-webhook/    # Bot de WhatsApp con NestJS
├── package.json         # Scripts globales
├── package-lock.json    # Lockfile de npm workspaces
└── tsconfig.base.json   # Config TypeScript compartida
```

---

## 🚀 Requisitos

- [Docker + Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js ≥ 20](https://nodejs.org/)
- **npm** (ya viene con Node)

> 🔑 Nota: Este monorepo funciona con **npm workspaces**. No uses pnpm ni yarn.

---

## ⚙️ Instalación inicial

1. **Clonar el repositorio**

```bash
git clone https://github.com/lucho314/OmniShop-AI.git
cd omnishop-ai
```

2. **Construir imágenes Docker de cada proyecto**

```bash
# Tienda (Vendure)
docker build -t omnishop-tienda -f tienda/Dockerfile .

# Bot WhatsApp (solo DB)
docker compose -f whatsapp-webhook/docker-compose.yml up -d
```

3. **Instalar dependencias del monorepo**

```bash
npm install
```

4. **Preparar la base de datos del bot (solo primera vez)**

```bash
# Migraciones
npm run migrate:bot

# Generar cliente Prisma
npm run generate:bot

# Ejecutar seeds iniciales
npm run db:boot-seed
```

---

## 🏃 Ejecución

### Levantar la tienda (Vendure)

```bash
npm run dev:tienda
```

➡️ Internamente levanta los contenedores necesarios (`db`, `redis`, etc.) y ejecuta el servidor Vendure en `tienda/`.

### Levantar el bot de WhatsApp

```bash
npm run dev:bot
```

➡️ Inicia el servidor NestJS del bot de WhatsApp.

### Bajar ambos proyectos

```bash
npm run down:all
```

---

## 🗂️ Scripts útiles

- `npm run dev:tienda` → Levanta DB/Redis y corre la tienda en modo dev.
- `npm run dev:bot` → Levanta el bot de WhatsApp en modo dev.
- `npm run build:tienda` → Build de la tienda.
- `npm run build:bot` → Build del bot.
- `npm run migrate:bot` → Aplica migraciones de Prisma para el bot.
- `npm run generate:bot` → Genera el cliente de Prisma del bot.
- `npm run db:boot-seed` → Inicializa la base de datos del bot con datos iniciales.
- `npm run up:all` → Levanta todos los servicios (tienda + bot).
- `npm run down:all` → Baja todos los servicios.
- `npm run lint` → Corre ESLint en todo el monorepo.
- `npm run format` → Formatea el código con Prettier.

---

## 🔑 Variables de entorno

Cada proyecto tiene su propio `.env` (no versionado en Git).

- `tienda/.env`

```env
DB_HOST=localhost
DB_PORT=5432
REDIS_HOST=localhost
```

- `whatsapp-webhook/.env`

```env
WHATSAPP_TOKEN=your_meta_token
WHATSAPP_PHONE_ID=your_phone_id
PHONE_OVERRIDES={"5493452217053":"543452217053"}
```

---

## ✅ Flujo de desarrollo

1. **Construir imágenes Docker** (solo la primera vez o si cambian los Dockerfiles).
2. **`npm install`** en la raíz del monorepo.
3. **Migrar y generar Prisma** con `npm run migrate:bot && npm run generate:bot`.
4. **Seed inicial** con `npm run db:boot-seed` (solo primera vez).
5. **Levantar los proyectos** con `npm run dev:tienda` y `npm run dev:bot`.
6. ¡Listo! 🎉
