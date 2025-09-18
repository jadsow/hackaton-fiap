import { createApp } from "vue";
import { createPinia } from "pinia"; // Importe o Pinia

import App from "./App.vue";
import router from "./router"; // Importe nosso router

const app = createApp(App);

app.use(createPinia()); // Diga ao app para usar o Pinia
app.use(router); // Diga ao app para usar o Router

app.mount("#app");
