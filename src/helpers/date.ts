import { BusinessOpenStatus } from '@/interfaces/enum'
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
export function parseOpenTime(openTime: string): { start: string; end: string }[] | null {
  if (!openTime) return null
  if (openTime.includes('詳見') || openTime.includes('公休')) return null

  // Split by "/" for multiple ranges
  const ranges = openTime.split(/[/、]/).map((range) => range.trim())

  const parseRange = (range: string) => {
    // Normalize string
    const normalizedTime = range
      .replace(/[^A-Za-z0-9:：\-~～–\s]/g, '')
      .replace(/：/g, ':')
      .trim()

    // Split into start and end times
    const parts = normalizedTime.split(/[-~～–]/).map((p) => p.trim())
    if (parts.length !== 2) return null

    const [startPart, endPart] = parts

    // Parse time parts
    const timePattern = /(AM|PM)?\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i
    const startMatch = startPart.match(timePattern)
    const endMatch = endPart.match(timePattern)

    if (!startMatch || !endMatch) return null

    const convertHour = (
      hour: string,
      preMeridiem: string | undefined,
      postMeridiem: string | undefined,
    ): number => {
      let h = parseInt(hour)
      const meridiem = (preMeridiem || postMeridiem)?.toUpperCase()
      const isPM = meridiem === 'PM'
      const isAM = meridiem === 'AM'

      if (!meridiem && h >= 0 && h <= 23) return h
      if (isPM) {
        if (h === 12) return 12
        if (h < 12) return h + 12
        return h
      }
      if (isAM && h === 12) return 0
      return h
    }

    const sHour = convertHour(startMatch[2], startMatch[1], startMatch[4])
    const eHour = convertHour(endMatch[2], endMatch[1], endMatch[4])

    return {
      start: `${sHour.toString().padStart(2, '0')}:${startMatch[3]}`,
      end: `${eHour.toString().padStart(2, '0')}:${endMatch[3]}`,
    }
  }

  const results = ranges
    .map(parseRange)
    .filter((result): result is { start: string; end: string } => result !== null)
  return results.length > 0 ? results : null
}

export function getBusinessOpenStatus(
  businessHours: IPeriod[],
  currentTime = new Date(),
): BusinessOpenStatus {
  const now = format(currentTime, 'HH:mm')
  const nowTime = parse(now, 'HH:mm', currentTime)

  // 如果沒有營業時間，返回 Unknown
  if (!businessHours || businessHours.length === 0) {
    return BusinessOpenStatus.Unknown
  }

  const isOpen = businessHours.some(({ start, end }) => {
    const startTime = parse(start, 'HH:mm', currentTime)
    let endTime = parse(end, 'HH:mm', currentTime)

    // 處理跨午夜的情況
    if (endTime < startTime) {
      endTime = addDays(endTime, 1)
    }

    return isWithinInterval(nowTime, { start: startTime, end: endTime })
  })

  return isOpen ? BusinessOpenStatus.Open : BusinessOpenStatus.Closed
}
