/**
 * Growth Calculations Composable
 *
 * Provides growth calculation logic for net worth, assets, and liabilities.
 * Consolidates the previously duplicated growth functions into a single generic implementation.
 */
import { useSnapshots, type MonthlySnapshotData } from './useSnapshots'

export interface GrowthResult {
  growth: number
  percentage: number
}

type ValueKey = 'netWorth' | 'assetsTotal' | 'liabilitiesTotal'

export function useGrowth() {
  const { monthlySnapshots } = useSnapshots()

  /**
   * Generic growth calculation for any value type
   * @param startDate - The start date for calculating growth (null = all time)
   * @param valueKey - Which value to calculate growth for
   * @param currentValue - The current value to compare against
   */
  function calculateGrowth(
    startDate: Date | null,
    valueKey: ValueKey,
    currentValue: number
  ): GrowthResult {
    const snapshots = monthlySnapshots.value
    if (snapshots.length === 0) return { growth: 0, percentage: 0 }

    // Get the latest snapshot value or use provided current value
    const latestSnapshot = snapshots[snapshots.length - 1]
    const current = latestSnapshot?.[valueKey] ?? currentValue

    // If no start date (All Time), use first snapshot
    if (!startDate) {
      const firstSnapshot = snapshots[0]
      if (!firstSnapshot || snapshots.length < 2) return { growth: 0, percentage: 0 }

      const startValue = firstSnapshot[valueKey]
      const growth = current - startValue
      const percentage = startValue !== 0
        ? (growth / Math.abs(startValue)) * 100
        : 0
      return { growth, percentage }
    }

    // Find snapshot closest to or after start date
    const startMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`

    // Find the first snapshot >= startMonth
    let startSnapshot: MonthlySnapshotData | undefined = snapshots.find(s => s.month >= startMonth)

    // If no snapshot found at or after start date, use first available
    if (!startSnapshot) {
      startSnapshot = snapshots[0]
    }

    if (!startSnapshot) return { growth: 0, percentage: 0 }

    const startValue = startSnapshot[valueKey]
    const growth = current - startValue
    const percentage = startValue !== 0
      ? (growth / Math.abs(startValue)) * 100
      : 0

    return { growth, percentage }
  }

  /**
   * Get net worth growth for a specific period
   * @param startDate - The start date for calculating growth (null = all time)
   * @param currentNetWorth - The current net worth value
   */
  function getGrowthForPeriod(startDate: Date | null, currentNetWorth: number = 0): GrowthResult {
    return calculateGrowth(startDate, 'netWorth', currentNetWorth)
  }

  /**
   * Get assets growth for a specific period
   * @param startDate - The start date for calculating growth (null = all time)
   * @param currentAssets - The current total assets value
   */
  function getAssetsGrowthForPeriod(startDate: Date | null, currentAssets: number = 0): GrowthResult {
    return calculateGrowth(startDate, 'assetsTotal', currentAssets)
  }

  /**
   * Get liabilities growth for a specific period
   * @param startDate - The start date for calculating growth (null = all time)
   * @param currentLiabilities - The current total liabilities value
   */
  function getLiabilitiesGrowthForPeriod(startDate: Date | null, currentLiabilities: number = 0): GrowthResult {
    return calculateGrowth(startDate, 'liabilitiesTotal', currentLiabilities)
  }

  return {
    calculateGrowth,
    getGrowthForPeriod,
    getAssetsGrowthForPeriod,
    getLiabilitiesGrowthForPeriod
  }
}
