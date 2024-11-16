import { format } from 'date-fns'

const formatStr = 'yyyy-MM-dd HH:mm:ss'

export function formatDateTime(date: Date) {
  return format(date, formatStr)
}
