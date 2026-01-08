<script setup lang="ts">
import { VisXYContainer, VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisScatter } from '@unovis/vue'
import { CurveType } from '@unovis/ts'

const props = defineProps<{
  balanceHistory: { date: string; value: number }[]
  accountType?: 'asset' | 'liability'
  monthsToShow?: number
}>()

// Parse date string as local date to avoid timezone offset issues
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year!, month! - 1, day || 1)
}

// Filter to last N months (default 6)
const filteredHistory = computed(() => {
  const months = props.monthsToShow ?? 6
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - months)

  return props.balanceHistory.filter(item => {
    const itemDate = parseLocalDate(item.date)
    return itemDate >= cutoffDate
  })
})

// Transform data for Unovis - use timestamp for x-axis
const data = computed(() => {
  return filteredHistory.value.map((item) => {
    const date = parseLocalDate(item.date)
    return {
      x: date.getTime(),
      y: item.value,
      date: item.date,
      formattedDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
    }
  })
})

// Accessors
const x = (d: typeof data.value[0]) => d.x
const y = (d: typeof data.value[0]) => d.y

// Color based on account type
const color = computed(() => props.accountType === 'liability' ? '#f87171' : '#22c55e')
const label = computed(() => props.accountType === 'liability' ? 'Balance' : 'Balance')

// Formatters - show month and year for x-axis ticks
const xTickFormat = (tick: number) => {
  const date = new Date(tick)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value)
}

// Tooltip template
const tooltipTemplate = (d: typeof data.value[0]) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(d.y)
  return `
    <div class="chart-tooltip">
      <div class="chart-tooltip-header">${d.formattedDate}</div>
      <div class="chart-tooltip-row">
        <span class="chart-tooltip-dot" style="background: ${color.value}"></span>
        <span class="chart-tooltip-label">${label.value}</span>
        <span class="chart-tooltip-value">${formatted}</span>
      </div>
    </div>
  `
}
</script>

<template>
  <div class="w-full">
    <div v-if="data.length > 0" class="h-[250px]">
      <VisXYContainer :data="data" :height="250" :margin="{ top: 10, right: 10, bottom: 10, left: 10 }">
        <VisArea 
          :x="x" 
          :y="y" 
          :color="color"
          :opacity="0.3"
          :curve-type="CurveType.MonotoneX"
        />
        <VisLine
          :x="x"
          :y="y"
          :color="color"
          :line-width="2"
          :curve-type="CurveType.MonotoneX"
        />
        <VisScatter
          :x="x"
          :y="y"
          :color="color"
          :size="8"
          :stroke-color="'white'"
          :stroke-width="2"
        />
        <VisAxis
          type="x"
          :tick-format="xTickFormat"
          :num-ticks="5"
          :grid-line="false"
          :tick-line="false"
          :domain-line="false"
        />
        <VisAxis 
          type="y" 
          :tick-format="formatCurrency"
          :num-ticks="4"
          :grid-line="true"
          :tick-line="false"
          :domain-line="false"
        />
        <VisTooltip />
        <VisCrosshair :template="tooltipTemplate" />
      </VisXYContainer>
    </div>
    <div v-else class="h-full flex items-center justify-center text-gray-500 py-8">
      No balance history available
    </div>
  </div>
</template>

<style scoped>
/* Chart tooltip styling */
:deep(.chart-tooltip) {
  background: white;
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  min-width: 140px;
}

:deep(.chart-tooltip-header) {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 14px;
}

:deep(.chart-tooltip-row) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.chart-tooltip-dot) {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

:deep(.chart-tooltip-label) {
  color: #6b7280;
  flex: 1;
}

:deep(.chart-tooltip-value) {
  font-weight: 600;
  color: #1f2937;
}

/* Axis styling */
:deep(.unovis-xy-container) {
  --vis-axis-tick-color: rgb(var(--color-neutral-400));
  --vis-axis-grid-color: rgb(var(--color-neutral-200));
  --vis-axis-label-color: rgb(var(--color-neutral-500));
  /* Reset default tooltip container */
  --vis-tooltip-background-color: transparent;
  --vis-tooltip-border-color: transparent;
  --vis-tooltip-shadow-color: transparent;
  --vis-tooltip-padding: 0;
}

:deep(.unovis-axis-tick text) {
  font-size: 11px;
  fill: rgb(var(--color-neutral-500));
}

/* Dark mode */
.dark :deep(.chart-tooltip) {
  background: #1f2937;
}

.dark :deep(.chart-tooltip-header),
.dark :deep(.chart-tooltip-value) {
  color: white;
}

.dark :deep(.chart-tooltip-label) {
  color: #9ca3af;
}

.dark :deep(.unovis-xy-container) {
  --vis-axis-grid-color: rgb(var(--color-neutral-700));
}
</style>
