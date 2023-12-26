<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header with Hamburger Menu for Desktop -->
    <q-header elevated class="bg-primary text-white desktop-only">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <!-- Other header content -->
      </q-toolbar>
    </q-header>

    <!-- Left Drawer for Desktop -->
    <q-drawer v-model="leftDrawerOpen" side="left" class="desktop-only">
      <q-tabs vertical>
        <q-route-tab
          v-for="route in accessibleRoutes"
          :key="route.name"
          :name="route.name"
          :icon="route.icon"
          :to="`/${token_id}/${route.path}`"
          :label="route.name"
        />
      </q-tabs>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <!-- Bottom Tabs Navigation for Mobile -->
    <q-footer reveal class="bg-primary mobile-only">
      <q-tabs class="text-white">
        <!-- Navigation tabs -->
        <q-route-tab
          v-for="route in accessibleRoutes"
          :key="route.name"
          :name="route.name"
          :icon="route.icon"
          :to="`/${token_id}/${route.path}`"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import routes from '../router/routes';

const route = useRoute();
const token_id = route.params.token_id;
const leftDrawerOpen = ref(false);
const isAuthenticated = localStorage.getItem('authToken');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const accessibleRoutes = computed(() => {
  // Find the menu routes
  const menuRoutes = routes[1].children;

  // Check if the parent route and its children are defined
  if (menuRoutes) {
    // Filter the child routes based on 'meta.requiresAuth'
    if (!isAuthenticated) {
      return menuRoutes.filter(
        (childRoute) => childRoute.meta && childRoute.meta.requiresAuth
      );
    } else {
      return menuRoutes;
    }
  }

  // Return an empty array if no matching routes are found
  return [];
});
</script>
