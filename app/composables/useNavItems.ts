import type { NavigationMenuItem } from '@nuxt/ui'

export const useNavItems = () => {
  const route = useRoute()

  return computed<NavigationMenuItem[]>(() => [
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/',
      active: route.path === '/'
    },
    {
      label: 'Accounts',
      icon: 'i-lucide-wallet',
      to: '/accounts',
      active: route.path.startsWith('/accounts')
    }
  ])
}
