# Carta para mi novia

Esta es una página estática preparada para publicarse en GitHub Pages.

## Cómo publicarla

1. Sube esta carpeta a un repositorio de GitHub.
2. Entra al repositorio y ve a `Settings` > `Pages`.
3. Selecciona `GitHub Actions` como fuente.
4. La acción de despliegue se ejecutará automáticamente cuando hagas push a la rama `main`.
5. GitHub te dará una URL pública como:
   `https://tu-usuario.github.io/tu-repositorio/`

## Importante

Esta página ya está pensada para servir archivos estáticos (`index.html`, `style.css`, `script.js`, imágenes y video), por lo que funciona bien en GitHub Pages.

## Ejecutarla localmente

```bash
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```
