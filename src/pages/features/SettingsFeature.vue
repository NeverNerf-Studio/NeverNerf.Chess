<template>
  <div class="column content-center" v-if="isAuthenticated">
    <div>
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
import { useRouter, useRoute } from 'vue-router';
import { usePassportStore } from '/src/stores/passport-store';
const passport = usePassportStore();
const isAuthenticated = passport.getUserInfo();

const router = useRouter();
const route = useRoute();
const token_id = route.params.token_id;

function logout() {
  passport.logout();
  router.push({ path: `/${token_id}` });
}
</script>
