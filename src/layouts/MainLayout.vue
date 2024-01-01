<template>
  <q-layout view="hHh lpR fFf">
    <!-- Page Container -->
    <q-page-container
      ><q-page class="q-pa-md"><router-view></router-view></q-page>
    </q-page-container>

    <!-- Bottom Tabs Navigation for Mobile -->
    <q-footer class="bg-primary fixed-bottom">
      <q-tabs class="text-white">
        <!-- Navigation tabs -->
        <q-route-tab
          v-for="route in accessibleRoutes"
          :key="route.name"
          :name="route.name"
          :icon="route.icon"
          :to="`/${token_id}/${route.path}`" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { usePassportStore } from '/src/stores/passport-store';
import { useAssetStore } from '/src/stores/asset-store';
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import routes from '/src/router/routes';

export default {
  setup() {
    const passport = usePassportStore();
    const assetStore = useAssetStore();
    const token_id = computed(() => useRoute().params.token_id);
    const accessibleRoutes = ref([]);

    const updateAccessibleRoutes = () => {
      const menuRoutes = routes[2].children;
      if (menuRoutes) {
        accessibleRoutes.value = passport.userProfile
          ? menuRoutes
          : menuRoutes.filter(
              (childRoute) => childRoute.meta && !childRoute.meta.requiresAuth
            );
      }
    };

    onMounted(() => {
      assetStore.loadMetadata(token_id.value);
      updateAccessibleRoutes();
    });

    watch(passport, () => {
      updateAccessibleRoutes(); // Update on userProfile change
    });

    return {
      token_id,
      asset: computed(() => assetStore),
      accessibleRoutes,
    };
  },
};
</script>
