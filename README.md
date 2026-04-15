# 📱 Nequi Seti - Notes App

Aplicación de notas desarrollada como prueba técnica usando **Ionic + Angular**.

---

## 🚀 Tech Stack

- Ionic
- Angular
- TypeScript
- RxJS
- ESLint + Prettier
- pnpm
- Docker

---

## 📦 Instalación local

### 1. Clonar repositorio

```bash
git clone <repo-url>
cd nequi-seti-notes-app
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Ejecutar aplicación

```bash
pnpm start
```

La app estará disponible en:

👉 http://localhost:8100

---

## 🐳 Ejecutar con Docker

### 1. Construir y levantar contenedor

```bash
docker-compose up --build
```

### 2. Acceder a la app

👉 http://localhost:8100

---

# 📱 Ejecución en dispositivos móviles (Android / iOS)

Este proyecto usa **Ionic + Capacitor** para compilar y ejecutar la aplicación en dispositivos móviles o emuladores.

---

## 🤖 Android

### Requisitos previos

- Android Studio instalado
- SDK configurado
- Java instalado

### Pasos para ejecutar

### 1. Construir la aplicación web

```bash
ionic build
```

### 2. Sincronizar con Android

```bash
npx cap sync android
```

### 3. Abrir proyecto en Android Studio

```bash
npx cap open android
```

### 4. Ejecutar

- Selecciona un emulador o dispositivo físico
- Presiona ▶ Run en Android Studio

---

## 🍏 iOS (solo macOS)

### Requisitos previos

- macOS
- Xcode instalado
- CocoaPods instalado

### Pasos para ejecutar

### 1. Construir la aplicación web

```bash
ionic build
```

### 2. Sincronizar con iOS

```bash
npx cap sync ios
```

### 3. Instalar dependencias nativas

```bash
cd ios/App
pod install
cd ../..
```

### 4. Abrir proyecto en Xcode

```bash
npx cap open ios
```

### 5. Ejecutar

- Selecciona simulador o dispositivo físico
- Presiona ▶ Run en Xcode

---

## 🧪 Testing Automático

El proyecto cuenta con una robusta suite de pruebas unitarias que cubren tanto la capa lógica como la capa de interfaces visuales con más de **180 tests** exitosos, asegurando estabilidad y no regresión.

### Pruebas Implementadas

1. **Pruebas de Lógica de Negocio (Core):**
   - Cobertura profunda a **Servicios** (Storage, Notas, Autenticación, Remote Config).
   - Pruebas reactivas a **Facades** usando `fakeAsync` y `tick` para validar estados en el tiempo.
   - Aserciones en **Guards** de Angular (Routing condicional).

2. **Pruebas de Interfaz y Gráficos (UI Testing):**
   - *Smart Components* encapsulados (Pages) mocking las inyecciones de dependencias globales y observando comportamientos del DOM y flujos reactivos del estado.
   - *Smoke Tests* a +17 Dumb Components para comprobar la integridad del inyector Angular `TestBed`.

### Ejecución de Pruebas

Para correr las pruebas localmente en interfaz por consola sin observar navegador físico (Headless):

```bash
pnpm test --watch=false --browsers=ChromeHeadless --code-coverage
```

Tras la ejecución, verás un reporte de **Code Coverage** detallando el porcentaje de control (~80%).

---

## 🧪 Linting

Ejecutar análisis de código:

```bash
pnpm lint
```

Corregir automáticamente:

```bash
pnpm lint:fix
```

---

## 🧠 Arquitectura

El proyecto sigue una estructura modular basada en buenas prácticas:

```
src/app/
  core/        # servicios globales (logger, storage, etc.)
  shared/      # componentes reutilizables
  features/    # módulos por dominio (notes)
  __tests__/   # Aislamiento de suites de prueba
```

### Principios aplicados:

- Separación de responsabilidades
- Arquitectura basada en features
- Uso de servicios para lógica de negocio
- Tipado estricto con TypeScript
- Programación reactiva con RxJS
- Patrón Testing Modular y Mocking seguro

---

## 🧾 Funcionalidades

- Crear notas
- Listar notas
- Eliminar notas
- Persistencia local

---

## ⚙️ Configuración de calidad

Se implementaron herramientas para asegurar calidad del código:

- ESLint con reglas estrictas
- Prettier para formato consistente
- Orden automático de imports

---

## 🧠 Decisiones técnicas

- Uso de `pnpm` para mejor rendimiento
- Docker para facilitar ejecución en cualquier entorno
- LoggerService para abstracción de logs
- Arquitectura escalable basada en separación por capas

---

## 🚀 Posibles mejoras

- Backend con API real
- Sincronización en la nube
- Manejo global de errores

---

## 👨‍💻 Autor

Desarrollado por **Ivan Caviedes**
