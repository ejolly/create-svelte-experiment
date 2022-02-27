import { userStore } from './utils.js';
import { get } from 'svelte/store';

// EXPERIMENTAL WIP
export const initRouter = () => {

  window.addEventListener('popstate', (ev) => {
    // Listen to popstate events when using history.opush state and update the current
    // state of the svelte store
    console.log('popstate')
    const storeData = get(userStore);
    storeData.currentState = ev.state.page;
    userStore.set(storeData)
  })

}

// Create a push state event
export const go = (page) => {
  console.log('push state')
  history.replaceState({ page }, page, `/${page}`);
}
