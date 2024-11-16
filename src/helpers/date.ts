import type { IPeriod } from '@/interfaces/IRestaurant'
import { parse, format, isWithinInterval, addDays } from 'date-fns'

const formatStr = 'yyyy-MM-dd HH:mm:ss'

export function formatDateTime(date: Date) {
  return format(date, formatStr)
}

/**
 * 解析餐廳的營業時間，提取開始和結束時間
 * @param {string} openTime - 餐廳的營業時間描述
 * @returns {Array} 包含開始和結束時間的物件陣列，格式為 [{ start: 'HH:mm', end: 'HH:mm' }]
 */
export function parseOpenTime(openTime: string) {
  if (!openTime || openTime.includes('詳見') || openTime.includes('請洽')) {
    return null
  }

  const timeRegex =
    /(AM|PM|上午|下午)?\s*(\d{1,2}):(\d{2})\s*[-~到–]\s*(AM|PM|上午|下午)?\s*(\d{1,2}):(\d{2})/gi
  const matches = [...openTime.matchAll(timeRegex)]

  if (matches.length === 0) {
    return null
  }

  const timeRanges = matches.map((match) => {
    const [_, startPeriod, startHour, startMinute, endPeriod, endHour, endMinute] = match

    return {
      start: formatTime(startHour, startMinute, isPM(startPeriod)),
      end: formatTime(endHour, endMinute, isPM(endPeriod)),
    }
  })

  return timeRanges
}

function isPM(period: string | undefined): boolean {
  return period?.toUpperCase().includes('PM') || period?.includes('下午') || false
}

function formatTime(hour: string, minute: string, isPM: boolean): string {
  let h = parseInt(hour, 10)
  const m = parseInt(minute, 10)

  if (isPM && h < 12) h += 12
  if (!isPM && h === 12) h = 0

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * 判斷是否在營業時間內
 * @param {Array} businessHours - 營業時間 [{ start: 'HH:mm', end: 'HH:mm' }]
 * @param {Date} [currentTime=new Date()] - 當前時間（可選，預設為現在）
 * @returns {boolean} 是否營業中
 */
export function isBusinessOpen(businessHours: IPeriod[], currentTime = new Date()): boolean {
  const now = format(currentTime, 'HH:mm')

  const nowTime = parse(now, 'HH:mm', currentTime)

  return businessHours.some(({ start, end }) => {
    const startTime = parse(start, 'HH:mm', currentTime)
    let endTime = parse(end, 'HH:mm', currentTime)

    if (endTime < startTime) {
      endTime = addDays(endTime, 1)
    }

    return isWithinInterval(nowTime, { start: startTime, end: endTime })
  })
}
