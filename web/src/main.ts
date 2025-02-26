// web/src/main.ts

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import Tailwind CSS
import './assets/main.css';

// Global type declarations
declare global {
  interface Window {
    showNotification: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  }
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
