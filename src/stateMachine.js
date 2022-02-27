// Finite state machine router
import { userStore, updateUser } from './utils.js'
import { get, writable } from 'svelte/store';
import { serverTime } from "./db.js"

// Page data store that the state machine writes to on state changes
export const pageData = writable({});

export class StateMachine {
  constructor(pageMap = {}, transitions = []) {
    this.pageMap = pageMap;
    this.transitions = transitions;
    this.changeState = async (event) => {
      const action = event.detail.action;
      const userStoreData = get(userStore)
      const transition = this.transitions.find(
        (e) => e.from === userStoreData.currentState && e.on === action
      );
      const updateData = { currentState: transition.to };
      updateData[`${userStoreData.currentState}_${transition.to}`] = serverTime;

      await updateUser(updateData);

      pageData.set(transition.data);

    }

  }

}