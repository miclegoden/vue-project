import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast, { POSITION, TYPE } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
// import '../public/css/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const options = {
    position: POSITION.BOTTOM_RIGHT,
    toastDefaults: {
        [TYPE.ERROR]: {
            timeout: false,
            hideProgressBar: true,
        },
        [TYPE.INFO]: {
            timeout: false,
            hideProgressBar: true,
        },
        [TYPE.SUCCESS]: {
            timeout: 3000,
            hideProgressBar: true,
        },
    },
};
createApp(App).use(store).use(Toast, options).use(router).mount('#app');