# zardy — Official / Fan Website

Página web modularizada y optimizada para el artista independiente **zardy**.

## 📁 Estructura del Proyecto

```
zardy_website/
│
├── app.py                  # Servidor backend en Python (Flask) con API REST
├── requirements.txt        # Dependencias de Python para servidor local o Cloud
├── README.md               # Instrucciones de uso y despliegue
│
├── static/
│   ├── css/
│   │   └── style.css       # Estilos CSS con variables, animaciones y diseño responsivo
│   └── js/
│       └── script.js       # Lógica JS: i18n (ES/EN), acordeón de discografía y animaciones
│
└── templates/
    └── index.html          # Estructura HTML5 limpia y semántica
```

## 🚀 Cómo ejecutar localmente con Python (Flask)

1. Abre tu terminal e ingresa a la carpeta del proyecto:
   ```bash
   cd zardy_website
   ```

2. (Opcional) Crea y activa un entorno virtual:
   ```bash
   python -m venv venv
   # En Windows:
   venv\Scripts\activate
   # En Mac/Linux:
   source venv/bin/activate
   ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Ejecuta la aplicación de Python:
   ```bash
   python app.py
   ```

5. Abre tu navegador e ingresa a `http://127.0.0.1:5000`.

## 🌐 Publicación / Despliegue en Internet

- **Render / Railway / PythonAnywhere:** Sube la carpeta del proyecto a GitHub e integra con Render o Railway seleccionando `app.py` como punto de entrada.
- **GitHub Pages / Vercel (Sitio estático):** Si deseas publicarlo solo como sitio estático sin servidor Python, simplemente mueve el contenido de `templates/index.html` a la raíz y cambia las rutas de `style.css` y `script.js` a relativas (`./static/css/style.css` y `./static/js/script.js`).
