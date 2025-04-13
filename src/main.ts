import './assets/styles/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.p-dark',
    },
  },
});

app.use(ToastService);
app.use(DialogService);
app.mount('#app');
