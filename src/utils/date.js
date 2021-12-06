import moment from 'moment';

export const formatDate = (timestamp, format = 'DD/MM/YYYY') => {
  return moment(timestamp * 1000).format(format);
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
export const checkInRange = (dateTimestamp, startMinute, endMinute) => {
  const now = Math.floor(new Date().getTime() / 1000);
  const start = dateTimestamp + startMinute * 60;
  const end = dateTimestamp + endMinute * 60;

  if (now > end) {
    return end - now;
  } else if (now >= start) {
    return 0;
  } else {
    return start - now;
  }
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
