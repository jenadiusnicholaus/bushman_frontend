export interface QuotaStats {
  confirmed: any
  pending: any
  cancelled: any
  taken: any
  provisoned: any
  tatalQuota: any
  quota: any
}

export interface DashboardMetric {
  id: string
  title: string
  value: string
  icon: string
  changeText: string
  changeDirection: 'up' | 'down'
  iconBackground: string
  iconColor: string
}
