import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import plateEditorPlugin from './scripts/plateEditorPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  const plates = command === 'serve' && mode === 'plates' && !isPreview;
  return {
    plugins: [react(), ...(plates ? [plateEditorPlugin()] : [])],
    define: { 'import.meta.env.PLATES_EDITOR': JSON.stringify(plates) },
    ...(plates ? { server: { host: '127.0.0.1', cors: false } } : {}),
  };
})
