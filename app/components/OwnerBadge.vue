<script setup lang="ts">
const props = defineProps<{
  name: string
  color?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>()

// Extract initials from name (first letter of each word, max 2)
const initials = computed(() => {
  if (!props.name) return '?'
  const words = props.name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0]?.substring(0, 2).toUpperCase()
  }
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

// Size classes for the badge
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-6 h-6 text-xs'
    case 'sm': return 'w-8 h-8 text-xs'
    case 'md': return 'w-10 h-10 text-sm'
    case 'lg': return 'w-12 h-12 text-base'
    case 'xl': return 'w-16 h-16 text-lg'
    default: return 'w-10 h-10 text-sm' // md as default
  }
})

// Background color class
const bgColorClass = computed(() => {
  return `bg-${props.color || 'primary'}`
})
</script>

<template>
  <div
    class="inline-flex items-center justify-center rounded-full text-white font-medium shrink-0"
    :class="[sizeClasses, bgColorClass]"
  >
    {{ initials }}
  </div>
</template>
