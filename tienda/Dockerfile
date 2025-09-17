FROM node:20

WORKDIR /usr/src/app

# Copiamos los manifests de la raíz (workspaces)
COPY package.json package-lock.json ./

# Copiamos solo el package.json de tienda
COPY tienda/package.json tienda/

# Instalamos dependencias (de toda la raíz, incluyendo tienda)
RUN npm ci

# Copiamos el tsconfig.base.json de la raíz
COPY tsconfig.base.json ./

# Copiamos el código de tienda
COPY tienda/ tienda/

# Compilamos solo tienda
RUN npm run build --workspace=tienda

