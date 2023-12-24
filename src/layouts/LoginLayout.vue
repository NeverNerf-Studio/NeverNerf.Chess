<template>
  <q-layout view="hHh lpR fFf">
    <q-btn to="/feature/asset" label="To Features" />
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MyLayout',
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
});
</script>
