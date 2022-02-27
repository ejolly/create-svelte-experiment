impport { userStore } from './utils.js';
import { get } from 'svelte/store';

export const initRouter = () => {
  
  window.addEventListener('popstate', (ev) => {
    const storeData = get(userStore);
    storeData.currentState = ev.state.page;
    userStore.set(storeData)
  })
  
}

export const go = (page) {
  history.pushState({ page }, page, `/${page}`);
}
