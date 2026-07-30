/**
 * Service schedule with automatic summer hours.
 *
 * Summer hours:
 * - Begin on the Sunday of the last full week of June (Sun–Sat entirely in June)
 * - End on the Sunday of Labor Day weekend (day before Labor Day)
 * - No Sunday School
 * - Memorial Service begins at 10:00 AM
 */

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** First Monday in September */
function getLaborDay(year) {
  const sept1 = new Date(year, 8, 1);
  const day = sept1.getDay(); // 0 Sun … 6 Sat
  const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  return new Date(year, 8, 1 + offset);
}

/**
 * Sunday that starts the last full week of June.
 * A full week is Sunday–Saturday entirely within June.
 */
function getSummerStartSunday(year) {
  const june30 = new Date(year, 5, 30);
  const daysBackToSaturday = (june30.getDay() + 1) % 7;
  const lastFullSaturday = new Date(year, 5, 30 - daysBackToSaturday);
  return new Date(year, 5, lastFullSaturday.getDate() - 6);
}

/** Sunday of Labor Day weekend */
function getSummerEndSunday(year) {
  const laborDay = getLaborDay(year);
  return new Date(year, laborDay.getMonth(), laborDay.getDate() - 1);
}

function isDateInSummerHours(date = new Date()) {
  const today = startOfDay(date);
  const year = today.getFullYear();
  const start = getSummerStartSunday(year);
  const end = getSummerEndSunday(year);
  return today >= start && today <= end;
}

function formatLongDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

module.exports = function () {
  const now = new Date();
  const year = now.getFullYear();
  const summerStart = getSummerStartSunday(year);
  const summerEnd = getSummerEndSunday(year);
  const isSummerHours = isDateInSummerHours(now);

  return {
    isSummerHours,
    summerStart,
    summerEnd,
    summerStartLabel: formatLongDate(summerStart),
    summerEndLabel: formatLongDate(summerEnd),
    sundaySchool: {
      regular: {
        time: "9:30 - 10:30 AM",
        timeShort: "9:30 AM",
        timeCard: "Sunday 9:30 - 10:30 AM",
      },
    },
    memorial: {
      regular: {
        time: "10:50 - 12:30 PM",
        timeShort: "10:50 AM",
        timeCard: "Sunday 10:50 AM - 12:30 PM",
      },
      summer: {
        time: "10:00 AM",
        timeShort: "10:00 AM",
        timeCard: "Sunday 10:00 AM",
      },
    },
    wednesday: {
      time: "7:30 - 8:30 PM",
      timeShort: "7:30 PM",
      timeCard: "Wednesday 7:30 - 8:30 PM",
    },
  };
};

// Exported for tests / reuse of date helpers
module.exports.getLaborDay = getLaborDay;
module.exports.getSummerStartSunday = getSummerStartSunday;
module.exports.getSummerEndSunday = getSummerEndSunday;
module.exports.isDateInSummerHours = isDateInSummerHours;
