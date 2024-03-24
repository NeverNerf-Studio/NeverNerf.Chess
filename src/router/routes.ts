import LoginLayout from 'layouts/LoginLayout.vue';
import MainLayout from 'layouts/MainLayout.vue';
import CallbackLayout from 'layouts/CallbackLayout.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import AssetFeature from 'pages/features/AssetFeature.vue';
import GameplayFeature from 'pages/features/GameplayFeature.vue';
import CraftingFeature from 'pages/features/CraftingFeature.vue';
import AssureFeature from 'pages/features/AssureFeature.vue';
import SettingsFeature from 'pages/features/SettingsFeature.vue';
import AnimateFeature from 'pages/features/AnimateFeature.vue';
import ImageFeature from 'pages/features/ImageFeature.vue';
import MetadataFeature from 'src/pages/features/MetadataFeature.vue';

export default [
  {
    path: '/callback',
    component: CallbackLayout,
  },
  {
    path: '/logout',
    component: LoginLayout,
  },
  {
    path: '/',
    name: 'rootLogin',
    component: LoginLayout,
  },
  {
    path: '/:token_id',
    name: 'tokenLogin',
    component: LoginLayout,
  },
  {
    path: '/:token_id/build/animate',
    name: 'Animate Board',
    icon: 'movie',
    meta: { requiresAuth: false },
    component: AnimateFeature,
  },
  {
    path: '/:token_id/build/image',
    name: 'Board Image',
    icon: 'diamond',
    meta: { requiresAuth: false },
    component: ImageFeature,
  },
  {
    path: '/:token_id/build/json',
    name: 'Asset metadata transform',
    icon: 'diamond',
    meta: { requiresAuth: false },
    component: MetadataFeature,
  },
  {
    path: '/:token_id',
    component: MainLayout,
    name: 'menuRoot',
    children: [
      {
        path: 'asset',
        name: 'Asset Details',
        icon: 'diamond',
        meta: { requiresAuth: false },
        component: AssetFeature,
      },
      {
        path: 'gameplay',
        name: 'Gameplay',
        icon: 'sports_esports',
        meta: { requiresAuth: false },
        component: GameplayFeature,
      },
      {
        path: 'crafting',
        name: 'Crafting',
        icon: 'join_full',
        meta: { requiresAuth: true },
        component: CraftingFeature,
      },
      {
        path: 'assure',
        name: 'Assure',
        icon: 'gpp_good',
        meta: { requiresAuth: true },
        component: AssureFeature,
      },
      {
        path: 'settings',
        name: 'Settings',
        icon: 'settings',
        meta: { requiresAuth: true },
        component: SettingsFeature,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
];
