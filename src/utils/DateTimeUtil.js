import moment from 'moment';

const DATE_FORMAT = 'DD MMMM YYYY'
const DATE_TYPE = 'DD/MM/YYYY'
const DATE_DOB = "DD/MM/YYYY"
const DATE_NOTE = "DD MMM YYYY"
const TIME_FORMAT = "HH:mm"
const TIME_NEXTBOOKING = "hh:mmA"
const DATE_NEXTBOOKING = "dddd DD MMMM"
const TIME_CARD = "MM/YY"
const DATE_FULL = "dddd DD MMMM YYYY"

const DATE_NOTE_REQUEST = "YYYY-MM-DDTHH:mm:ss"

const DATE_LIST_BOOKING = "YYYY-MM-DD"

function format(datetimeFormat, timeInMillis) {
    if (timeInMillis) {
        return moment(timeInMillis).format(datetimeFormat)
    }

    return ''
}

let defaultFormat = (timeInMillis) => {
    const data = format(DATE_TYPE, timeInMillis)
    return data
}

let dobFormat = (timeInMillis) => {
    const data = format(DATE_DOB, timeInMillis)
    return data
}

let noteFormat = (timeInMillis) => {
    const data = format(DATE_NOTE, timeInMillis)
    return data
}

let dateTimeFormat = (timeInMillis) => {
    const data = format(TIME_FORMAT, timeInMillis)
    return data
}
let timeNextbooking = (timeInMillis) => {
    const data = format(TIME_NEXTBOOKING, timeInMillis)
    return data
}

let datenextBooking = (timeInMillis) => {
    const data = format(DATE_NEXTBOOKING, timeInMillis)
    return data
}

let noteDateRequest = (timeInMillis) => {
    return moment(timeInMillis).format(DATE_NOTE_REQUEST)
}

let dateListBooking = (timeInMillis) => {
    return moment(timeInMillis).format(DATE_LIST_BOOKING)
}
let timeGiftCard = (timeInMillis) => {
    return moment(timeInMillis).format(TIME_CARD)
}
let redeemedDateTime = (timeInMillis) => {
    if (timeInMillis != undefined) {
        return moment(timeInMillis).format(DATE_FULL)
    }
    return ''
}

let getMondayOfCurrentWeek = (date) => {

    // const firstDay = moment(date).day(0)
    // return moment(firstDay).add(1, 'day').format(DATE_LIST_BOOKING)
    return moment(date).day(1).format(DATE_LIST_BOOKING)
}

let getSundayOfCurrentWeek = (date) => {
    // const lastDay = moment(date).day(6)
    // return moment(lastDay).add(1, 'day').format(DATE_LIST_BOOKING)
    return moment(date).day(7).format(DATE_LIST_BOOKING)
}

let getDayOfWeek = (i) => {
    return moment().isoWeekday(i);
}

const getStartOfDay = (ts) => {
    return moment(ts).startOf('day').valueOf()
}

const getEndOfDay = (ts) => {
    return moment(ts).endOf('day').valueOf()
}

const getStartOfWeek = (ts) => {
    return moment(ts).startOf('isoWeek').valueOf()
}
const getStartOfMonth = (month = moment().valueOf()) => {
    return moment(month).startOf('month').valueOf()
}
const getEndOfMonth = (month = moment().valueOf()) => {
    return moment(month).endOf('month').valueOf()
}
const getStartOfQuarter = () => {
    return moment().startOf('quarter').valueOf()
}
const getStartOfYear = () => {
    return moment().startOf('year').valueOf()
}

const getEndOfYear = () => {
    return moment().endOf('year').valueOf()
}

const getYesterday = () => {
    return moment().subtract(1, 'day').valueOf()
}

const getMonthBetween = (startDate, endDate,) => {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([displayMonth, i].join('/'));
        }
    }
    return dates;
}

export default {
    getMonthBetween,
    getEndOfYear,
    getYesterday,
    getStartOfYear,
    getStartOfQuarter,
    getStartOfMonth,
    getEndOfMonth,
    getStartOfWeek,
    getStartOfDay,
    getEndOfDay,
    format,
    defaultFormat,
    dobFormat,
    noteFormat,
    dateTimeFormat,
    datenextBooking,
    timeNextbooking,
    noteDateRequest,
    dateListBooking,
    timeGiftCard,
    redeemedDateTime,
    getMondayOfCurrentWeek,
    getSundayOfCurrentWeek,
    getDayOfWeek
};