# 🛠️ OmniShop-AI Monorepo

Este repositorio contiene dos proyectos principales:

- **`tienda/`** → [Vendure](https://www.vendure.io/) (e-commerce / backend de productos)
- **`whatsapp-webhook/`** → [NestJS](https://nestjs.com/) bot de WhatsApp Business (atención al cliente, precios, pedidos, etc.)

Ambos proyectos comparten configuración y dependencias a través de **pnpm workspaces**.

---

## 📂 Estructura

```ini
.
├── tienda/              # Proyecto Vendure (Docker + Node)
├── whatsapp-webhook/    # Bot de WhatsApp con NestJS
├── pnpm-workspace.yaml  # Configuración workspaces
├── package.json         # Scripts globales
└── tsconfig.base.json   # Config TypeScript compartida
```

---

## 🚀 Requisitos

- [Docker + Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js ≥ 20](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

Instalar pnpm si no lo tenés:

```bash
npm install -g pnpm
```

---

## ⚙️ Instalación y build inicial

1. **Clonar el repositorio**

```bash
git clone https://github.com/lucho314/OmniShop-AI.git
cd omnishop-ai
```

2. **Construir imágenes Docker de cada proyecto**

```bash
# Tienda (Vendure)
cd tienda
docker build -t omnishop-tienda .

# Bot WhatsApp
cd ../whatsapp-webhook
docker build -t omnishop-bot .
```

3. **Instalar dependencias del monorepo**
   Desde la raíz:

```bash
pnpm install
```

---

## 🏃 Ejecución

### Levantar la tienda (Vendure)

```bash
pnpm dev:tienda
```

➡️ Internamente levanta los contenedores necesarios (`db`, `redis`) y ejecuta `pnpm dev` en `tienda/`.

### Levantar el bot de WhatsApp

```bash
pnpm dev:bot
pnpm db:boot-seed
```

```bash

```

➡️ Inicia el servidor NestJS del bot.

---

## 🗂️ Scripts útiles

- `pnpm dev:tienda` → Levanta DB/Redis y corre la tienda en modo dev.
- `pnpm dev:bot` → Levanta el bot de WhatsApp en modo dev.
- `pnpm build:tienda` → Build de la tienda.
- `pnpm build:bot` → Build del bot.
- `pnpm lint` → Corre ESLint en todo el monorepo.
- `pnpm format` → Formatea el código con Prettier.
- `pnpm db:boot-seed` → Inicializa la base de datos del bot.

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

1. **Build de imágenes Docker** (solo la primera vez o si cambian los Dockerfiles).
2. **`pnpm install`** en la raíz del monorepo.
3. **Levantar los proyectos** con `pnpm dev:tienda` y `pnpm dev:bot`.
4. ¡Listo! 🎉
