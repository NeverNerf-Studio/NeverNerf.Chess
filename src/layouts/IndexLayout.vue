<template>
  <q-layout view="hHh lpR fFf">
    <!-- Page Container -->
    <q-page-container>
      <q-page class="q-pa-md">
        <q-tabs
          v-model="tab"
          dense
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
          narrow-indicator>
          <q-tab name="mails" label="Mails" />
          <q-tab name="alarms" label="Alarms" />
          <q-tab name="movies" label="Movies" />
        </q-tabs>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { onMounted } from 'vue';
import { usePassportStore } from '/src/stores/passport-store';
export default {
  setup() {
    const passport = usePassportStore();

    onMounted(() => {
      console.log(passport.userProfile);
    });
  },
};
</script>
