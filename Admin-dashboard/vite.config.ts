import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Acepta conexiones externas
    port: 5174,        // Puerto de Vite (opcional, ya que 5173 es el predetermin>
    strictPort: true,   // Evita que Vite cambie el puerto si está ocupado
  },
  preview: {
    port: 4173,        // Puerto para el servidor de previsualización (build)
    allowedHosts: [    // Dominios permitidos
      'admin.reycel.com',
      'localhost'
    ]
  }
})
