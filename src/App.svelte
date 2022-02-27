<script>
  import {
    userStore,
    userId,
    setupUserSubscription,
    initUser,
    updateUser,
    globalVars,
    dataUnsubscribe,
  } from "./utils.js";

  import { db, loggedIn, serverTime } from "./db";
  import { initRouter, go } from "./router.js";
  import { onMount } from "svelte";

  // app pages and components
  import Login from "./pages/Login.svelte";
  import Consent from "./pages/Consent.svelte";
  import Experiment from "./pages/Experiment.svelte";
  import Debrief from "./pages/Debrief.svelte";
  import Loading from "./components/Loading.svelte";
  import Footer from "./components/Footer.svelte";

  // FUNCTIONS USED WITHIN App.svelte
  // Update the user state and write to firebase
  async function updateState(newState) {
    const oldState = $userStore.currentState;
    $userStore.currentState = newState;
    try {
      $userStore[`${oldState}_end`] = serverTime;
      $userStore[`${$userStore.currentState}_start`] = serverTime;
      await updateUser($userStore);
    } catch (error) {
      console.error(error);
    }
  }

  // Try to load their userid from the browser so that we can auto-subscribe to their
  // data if they're already logged in
  const localUserId = localStorage.getItem("svelte-experiment-userId");
  if (localUserId) {
    userId.set(localUserId);
    console.log("Loaded userId from local storage");
  }

  // Setup our data subscription immediately after a user logs so that $userStore is
  // synchronized with firestore
  loggedIn.subscribe(async (isLoggedIn) => {
    if (isLoggedIn) {
      await setupUserSubscription(globalVars.userCollection, initUser);
      // initRouter();
    } else if ($dataUnsubscribe !== null) {
      $dataUnsubscribe();
      console.log("Data subscription off!");
    }
  });

  $: {
    console.log(window.location.href.split("/").slice(-1)[0]);
  }
  onMount(() => {
    window.onpopstate = (ev) => {
      // Listen to popstate events when using history.opush state and update the current
      // state of the svelte store
      console.log("popstate");
      // const storeData = get(userStore);
      // storeData.currentState = ev.state.page;
      // userStore.set(storeData);
    };
  });
</script>

<!-- This is our main markup. It uses the currentState field of the userStore to
determine what page a user should be on. -->
<main class="flex flex-col items-center h-screen p-10 space-y-10">
  {#if $loggedIn}
    {#if !$userStore.currentState}
      <Loading />
    {:else if $userStore.currentState === "consent"}
      <Consent on:to-experiment={() => updateState("experiment")} />
    {:else if $userStore.currentState === "experiment"}
      <Experiment on:to-debrief={() => updateState("debrief")} />
    {:else if $userStore.currentState === "debrief"}
      <Debrief />
    {/if}
  {:else}
    <Login />
  {/if}
</main>
<Footer />
