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
  import { get } from "svelte/store";

  // app pages and components
  import { StateMachine, pageData } from "./stateMachine";
  import Login from "./pages/Login.svelte";
  import Consent from "./pages/Consent.svelte";
  import Experiment from "./pages/Experiment.svelte";
  import Debrief from "./pages/Debrief.svelte";
  import Loading from "./components/Loading.svelte";
  import Footer from "./components/Footer.svelte";

  // Define name: component dictionary
  const pages = {
    consent: Consent,
    experiment: Experiment,
    debrief: Debrief,
  };

  // List of from -> to states with on: "action" describing what event should occur for
  // that transition to take place. An optional data: {} field is also useable to pass
  // data to the "to" component as a prop called pageData
  // NOTE: this data is ephemeral on app refreshes
  const transitions = [
    // Transition from consnet -> experiment if the action is accept
    {
      from: "consent",
      to: "experiment",
      on: "accept",
      data: { message: "hello world!" },
    },
    // Transition from consent -> debrief if the action is reject
    // Also pass some data to debrief
    {
      from: "consent",
      to: "debrief",
      on: "reject",
      data: { done: false, reason: "reject" },
    },
    // Transition from experiment -> debrief if the action is done
    // Also pass some data to debrief
    {
      from: "experiment",
      to: "debrief",
      on: "done",
      data: { done: true },
    },
  ];

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
    } else if ($dataUnsubscribe !== null) {
      $dataUnsubscribe();
      console.log("Data subscription off!");
    }
  });

  // Start the state machine
  const machine = new StateMachine(pages, transitions);
</script>

<!-- This is our main markup. It uses the currentState field of the userStore to
determine what page a user should be on. -->
<main class="flex flex-col items-center h-screen p-10 space-y-10">
  {#if !$loggedIn}
    <Login />
  {:else}
    {#if !$userStore.currentState}
      <Loading />
    {/if}
    <!-- Main state machine that dynamically changes pages -->
    <svelte:component
      this={machine.pageMap[$userStore.currentState]}
      on:change-state={machine.changeState}
      pageData={$pageData}
    />
  {/if}
</main>
<Footer />
