<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const navItems = useNavItems()
</script>

<template>
  <div class="flex h-full flex-col px-2 py-4">
    <UNavigationMenu
      :items="navItems"
      orientation="vertical"
      :collapsed="collapsed"
      :tooltip="collapsed"
      class="-mx-1"
    />

    <div class="mt-auto px-1">
      <UButton
        to="/settings"
        icon="i-lucide-settings"
        aria-label="Settings"
        color="neutral"
        variant="ghost"
        class="w-full justify-start"
      >
        <span v-if="!collapsed">Settings</span>
      </UButton>
    </div>
  </div>
</template>
