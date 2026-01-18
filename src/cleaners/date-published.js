import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
  MS_DATE_STRING,
  SEC_DATE_STRING,
  CLEAN_DATE_STRING_RE,
  SPLIT_DATE_STRING,
  TIME_AGO_STRING,
  TIME_NOW_STRING,
  TIME_MERIDIAN_SPACE_RE,
  TIME_MERIDIAN_DOTS_RE,
  TIME_WITH_OFFSET_RE,
} from './constants';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(customParseFormat);

const TIMEZONE_ABBR_RE = /\b(EST|EDT|CST|CDT|MST|MDT|PST|PDT|ET|CT|MT|PT|GMT|UTC)\b/gi;
// Check if string contains timezone offset info (e.g., +0000, GMT+0000, Z)
const HAS_TIMEZONE_RE = /([+-]\d{2}:?\d{2}|Z|\bGMT[+-]\d+|\bUTC\b)/i;

function hasTimezoneInfo(str) {
  return HAS_TIMEZONE_RE.test(str);
}

function stripTimezoneAbbr(str) {
  return str
    .replace(TIMEZONE_ABBR_RE, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Remove timezone tokens (zz, z, ZZ, Z) from format string
function stripTimezoneFromFormat(format) {
  return format
    .replace(/\s*z+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanDateString(dateString) {
  return (dateString.match(SPLIT_DATE_STRING) || [])
    .join(' ')
    .replace(TIME_MERIDIAN_DOTS_RE, 'm')
    .replace(TIME_MERIDIAN_SPACE_RE, '$1 $2 $3')
    .replace(CLEAN_DATE_STRING_RE, '$1')
    .trim();
}

export function createDate(dateString, timezone, format) {
  if (TIME_WITH_OFFSET_RE.test(dateString)) {
    return dayjs(new Date(dateString));
  }

  if (TIME_AGO_STRING.test(dateString)) {
    const fragments = TIME_AGO_STRING.exec(dateString);
    return dayjs().subtract(fragments[1], fragments[2]);
  }

  if (TIME_NOW_STRING.test(dateString)) {
    return dayjs();
  }

  const stringHasTimezone = hasTimezoneInfo(dateString);
  const cleanedDateString = stripTimezoneAbbr(dateString);

  if (stringHasTimezone) {
    const nativeDate = new Date(dateString);
    if (!Number.isNaN(nativeDate.getTime())) {
      return dayjs(nativeDate);
    }
  }

  if (timezone && !stringHasTimezone) {
    if (format) {
      const cleanedFormat = stripTimezoneFromFormat(format);
      try {
        const parsed = dayjs.tz(cleanedDateString, cleanedFormat, timezone);
        if (parsed.isValid()) return parsed;
      } catch {
        // Fall through
      }
    }
    const nativeDate = new Date(cleanedDateString);
    if (!Number.isNaN(nativeDate.getTime())) {
      return dayjs(nativeDate).tz(timezone, true);
    }
    const parsed = dayjs(cleanedDateString);
    if (parsed.isValid()) {
      return parsed.tz(timezone, true);
    }
    return dayjs(null);
  }

  if (format) {
    const cleanedFormat = stripTimezoneFromFormat(format);
    const parsed = dayjs(cleanedDateString, cleanedFormat);
    if (parsed.isValid()) return parsed;
  }
  const nativeDate = new Date(cleanedDateString);
  if (!Number.isNaN(nativeDate.getTime())) {
    return dayjs(nativeDate);
  }
  return dayjs(cleanedDateString);
}

// Take a date published string, and hopefully return a date out of
// it. Return none if we fail.
export default function cleanDatePublished(
  dateString,
  { timezone, format } = {}
) {
  // If string is in milliseconds or seconds, convert to int and return
  if (MS_DATE_STRING.test(dateString)) {
    return new Date(parseInt(dateString, 10)).toISOString();
  }
  if (SEC_DATE_STRING.test(dateString)) {
    return new Date(parseInt(dateString, 10) * 1000).toISOString();
  }

  let date = createDate(dateString, timezone, format);

  if (!date.isValid()) {
    dateString = cleanDateString(dateString);
    date = createDate(dateString, timezone, format);
  }

  return date.isValid() ? date.toISOString() : null;
}
