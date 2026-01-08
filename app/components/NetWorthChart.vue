<script setup lang="ts">
import { VisXYContainer, VisArea, VisAxis, VisCrosshair, VisLine } from '@unovis/vue'
import { CurveType } from '@unovis/ts'

const props = defineProps<{
  startDate?: Date | null
}>()

const { getFilteredHistory } = useNetWorth()

// Parse date string as local date to avoid timezone offset issues
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year!, month! - 1, day || 1)
}

// Transform data for Unovis
const data = computed(() => {
  const history = getFilteredHistory(props.startDate ?? null)
  return history.map((item, index) => ({
    x: index,
    y: item.value,
    date: item.date,
    formattedDate: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(parseLocalDate(item.date)),
    shortDate: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(parseLocalDate(item.date))
  }))
})

// Accessors
const x = (d: typeof data.value[0]) => d.x
const y = (d: typeof data.value[0]) => d.y

// Chart color
const color = '#3b82f6' // Blue

// Formatters
const xTickFormat = (tick: number) => {
  const d = data.value[Math.round(tick)]
  return d?.shortDate ?? ''
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
        <span class="chart-tooltip-dot" style="background: ${color}"></span>
        <span class="chart-tooltip-label">Net Worth</span>
        <span class="chart-tooltip-value">${formatted}</span>
      </div>
    </div>
  `
}
</script>

<template>
  <div class="w-full">
    <div v-if="data.length > 0" class="h-[300px]">
      <VisXYContainer :data="data" :height="300" :margin="{ top: 10, right: 10, bottom: 25, left: 50 }">
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
        <VisAxis 
          type="x" 
          :tick-format="xTickFormat"
          :num-ticks="6"
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
        <VisCrosshair :template="tooltipTemplate" />
      </VisXYContainer>
    </div>
    <div v-else class="h-full flex items-center justify-center text-gray-500">
      No data available
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
