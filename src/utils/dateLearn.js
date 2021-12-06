import moment from 'moment';

export const formatDate = (timestamp, format = 'DD/MM/YYYY') => {
  if (!timestamp) null;
  let date = moment(timestamp * 1000).format(format);
  return date == 'Invalid date' ? 'đang cập nhật' : date;
};

// export const formatTimeFromMinute = (minute) => {
//   return ('0' + Math.floor(minute / 60)).slice(-2) + ':' + ('0' + (minute % 60)).slice(-2);
// };

export const formatTimeFromMinute = (time) => {
  let hours = Math.floor(time / 60);
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minute = time % 60;
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${hours}:${minute}`;
};

/*
Return negative if date range has passed
Zero if date range is current
Positive if date range is in the future
*/
export const checkInRange = (dateTimestamp, startMinute, endMinute, needEnded) => {
  const now = Math.floor(new Date().getTime() / 1000);
  const start = dateTimestamp + startMinute * 60;
  const end = dateTimestamp + endMinute * 60;

  if (now > end) {
    // trạng thái để lấy item đã kết thúc cho học trực tuyến
    if (needEnded) return true;
    return end - now;
  } else if (now >= start) {
    return 0;
  } else {
    return start - now;
  }
};

/**
 * Tính giờ từ hiện tại đến thời gian kết thúc
 * @param {*} startTime
 * @param {*} end_Date
 * @param {*} timeNow
 * @param {*} keepSession // giữ cho phiên timer tiếp tục
 */
export const checkTimeForStart = (startTime, end_Date, timeNow, keepSession) => {
  const now = timeNow ? timeNow : Math.floor(moment().valueOf() / 1000);
  if (now > end_Date) {
    return end_Date - now;
  } else if (now >= startTime) {
    if (keepSession) return startTime - now;
    return 0;
  } else {
    return startTime - now;
  }
};

/**
 * Tính giờ từ hiện tại đến thời gian kết thúc
 * @param {*} startTime
 * @param {*} timeNow
 * @param {*} ruleTime // time allow for session continue
 */
export const checkTimeForEnd = (startTime, timeNow, ruleTime) => {
  startTime = Math.floor(startTime);
  return ruleTime - (timeNow - startTime);
};

/**
 * Tính giờ từ hiện tại đến thời gian kết thúc
 * @param {*} endTime
 */
export const CountForEnd = (endTime, timeNow) => {
  const now = timeNow ? timeNow : Math.floor(moment().valueOf() / 1000);
  let time = endTime - now;

  return time > 0 ? time : 0;
};

export const CountForStart = (startTime) => {
  const now = Math.floor(moment().valueOf() / 1000);
  let time = startTime - now > 0 ? startTime - now : 0;
  time = time <= 30 * 60 ? 0 : time;
  return time;
};

/**
 * Tính thời gian bằng giây từ thời điểm hiện tại
 * @param {number} dateTimestamp
 * @param {number} endMinute
 */
export const composeEndTime = (dateTimestamp, endMinute) => {
  const now = Math.floor(new Date().getTime() / 1000);
  const end = dateTimestamp + endMinute * 60;

  if (now < end) {
    return end - now;
  }
  return 0;
};

/**
 * Tính giờ từ hiện tại đến thời gian kết thúc
 * @param {*} startTime
 * @param {*} end_Date
 * > 0 -> sap hoac dang bat dau
 * <0  -> da ket thuc
 */
export const checkTimeAboveStartAndEnd = (startTime, end_Date) => {
  const now = Math.floor(moment().valueOf() / 1000);

  if (now > end_Date) {
    return end_Date - now >= 30 ? 0 : end_Date - now;
  }
  if (now > startTime) {
    // hien tai lon hon
    return now - startTime;
  } else if (now == startTime) {
    return 1;
  }

  // da bat dau
  return startTime - now > 30 * 60 ? 0 : startTime - now;
};

/**
 * Format time
 * @param {number} sec_num
 */
export function toHHMMSS(sec_num) {
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return hours + ':' + minutes + ':' + seconds;
}
export function secondsToDhms(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + ' ngày ' : '';
  const hDisplay = h > 0 ? h + ' giờ ' : '';
  const mDisplay = m > 0 ? m + ' phút ' : '';
  const sDisplay = s > 0 ? (s >= 10 ? '00:' + s : '00:0' + s) : '';
  if (d >= 1) {
    return dDisplay;
  } else if (h >= 1) {
    return hDisplay;
  } else if (m >= 1) {
    return mDisplay;
  }
  return sDisplay;
  // return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Format time
 * @param {number} sec_num
 */
export function virtualRoomTimeleft(sec_num) {
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  if (hours > 24) {
    return `${Math.floor(hours / 24)} ngày`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}: ${minutes}`;
}

export function toHHMM(min_num) {
  let hours = Math.floor(min_num / 60);
  let minutes = min_num - hours * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes;
}

/**
 * format time from second to dd:hh:mm:ss
 */
export function formatSecondtoDay(seconds, isTimer) {
  if (!seconds) return '';
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var hDisplay = h > 0 ? (h < 10 ? `0${h}: ` : h + (isTimer ? ' : ' : 'giờ, ')) : '';
  var mDisplay = m > 0 ? (m < 10 ? `0${m}: ` : m + (isTimer ? ' : ' : 'phút, ')) : '00:';
  var sDisplay = s < 10 ? '0' + s : s + (isTimer ? '' : ' giây');
  return hDisplay + mDisplay + sDisplay;
}

export function formatToMM(time = '') {
  if (!time) return null;
  let mAr = time.split(':');
  let minute = Number((mAr[0] || 0) * 60) + Number(mAr[1] || 0) + Number(mAr[2] / 60);
  return minute ? `${Math.ceil(minute)} phút` : 'Đang cập nhật';
}

export function formatPoint(item = {}) {
  const { score, total_score } = item;
  if (score == undefined || total_score == undefined || score == null || total_score == null) {
    return 'đang cập nhật';
  } else {
    return `${score}` + '/' + `${total_score}`;
  }
}
