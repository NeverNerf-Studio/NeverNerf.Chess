<template>
  <div>Loading...</div>
</template>

<script>
import { onMounted } from 'vue';
import { usePassportStore } from 'src/stores/passport-store';

export default {
  setup() {
    const passportStore = usePassportStore();

    onMounted(async () => {
      await passportStore.handleLoginCallback();
      // Close the window or navigate away after login callback is handled
    });

    return {};
  },
};
</script>
