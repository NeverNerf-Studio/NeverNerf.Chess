<template>
  <div class="q-my-md text-center">
    <h5>Settings</h5>
    <div class="q-gutter-y-md">
      <q-btn push no-caps rounded disable color="blue" style="width: 240px"
        >Buy</q-btn
      >
      <q-btn push no-caps rounded disable color="blue" style="width: 240px"
        >Sell</q-btn
      >
      <q-btn push no-caps rounded disable color="blue" style="width: 240px"
        >Burn</q-btn
      >
      <q-btn
        push
        no-caps
        rounded
        color="red"
        @click="logout"
        style="width: 240px"
        >Logout</q-btn
      >
    </div>
  </div>
</template>

<script setup>
import { usePassportStore } from '/src/stores/passport-store';
const passport = usePassportStore();

function logout() {
  passport.logout();
}
</script>
