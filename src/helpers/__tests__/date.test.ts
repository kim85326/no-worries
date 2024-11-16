import { describe, expect, it } from 'vitest'
import { parseOpenTime } from '../date'

describe('parseOpenTime', () => {
  it('parses "10:00~21:00"', () => {
    expect(parseOpenTime('10:00~21:00')).toEqual([{ start: '10:00', end: '21:00' }])
  })
  it('parses "10:00am~9:00pm"', () => {
    expect(parseOpenTime('10:00am~9:00pm')).toEqual([{ start: '10:00', end: '21:00' }])
  })
  it('parses "10:00pm~2:00am"', () => {
    expect(parseOpenTime('10:00pm~2:00am')).toEqual([{ start: '22:00', end: '02:00' }])
  })
  it('parses "10：30am～8：00pm"', () => {
    expect(parseOpenTime('10：30am～8：00pm')).toEqual([{ start: '10:30', end: '20:00' }])
  })
  it('parses "10：00AM~21:00PM"', () => {
    expect(parseOpenTime('10：00AM~21:00PM')).toEqual([{ start: '10:00', end: '21:00' }])
  })
  it('parses "AM12:00~PM12:00"', () => {
    expect(parseOpenTime('AM12:00~PM12:00')).toEqual([{ start: '00:00', end: '12:00' }])
  })
  it('parses "AM00:00~PM12:00"', () => {
    expect(parseOpenTime('AM00:00~PM12:00')).toEqual([{ start: '00:00', end: '12:00' }])
  })
  it('parses "PM12:00~PM11:00"', () => {
    expect(parseOpenTime('PM12:00~PM11:00')).toEqual([{ start: '12:00', end: '23:00' }])
  })
  it('parses "平假日：AM8:30 – PM23:30"', () => {
    expect(parseOpenTime('平假日：AM8:30 – PM23:30')).toEqual([{ start: '08:30', end: '23:30' }])
  })
  it('returns null for "詳見官網"', () => {
    expect(parseOpenTime('詳見官網')).toBeNull()
  })
  it('returns null for "星期一公休"', () => {
    expect(parseOpenTime('星期一公休')).toBeNull()
  })
  it('parses "10:00am~2:00pm / 5:00pm~9:00pm"', () => {
    expect(parseOpenTime('10:00am~2:00pm / 5:00pm~9:00pm')).toEqual([
      { start: '10:00', end: '14:00' },
      { start: '17:00', end: '21:00' },
    ])
  })
  it('parses "11:00-14:00、17:00-21:00"', () => {
    expect(parseOpenTime('11:00-14:00、17:00-21:00')).toEqual([
      { start: '11:00', end: '14:00' },
      { start: '17:00', end: '21:00' },
    ])
  })
})
