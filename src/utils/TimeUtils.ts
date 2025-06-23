import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
/**
 * Format a Unix timestamp to a specified string format.
 * @param timestamp number - Unix timestamp in seconds
 * @param format string - ex: 'YYYY/MM/DD HH:mm' 有中文星期 'YYYY/MM/DD (dd) HH:mm'
 * @param weekday boolean - show weekday at the end. ex:(三) (default: false)
 * @returns string - Formatted date string
 */

const timeFormatter = (time: number | Date | string, format: string = 'YYYY-MM-DD HH:mm Z'): string => {
    let dayjsObj;
    if (typeof time === 'number') {
        // UNIX timestamp (秒)
        dayjsObj = dayjs.unix(time);
    } else if (time instanceof Date) {
        // Date 物件
        dayjsObj = dayjs(time);
    } else if (typeof time === 'string') {
        // 字串，嘗試解析
        dayjsObj = dayjs(time);
        if (!dayjsObj.isValid()) {
            throw new Error('time 字串格式無效');
        }
    } else {
        throw new Error('time 參數必須是 number (timestamp) 或 Date 物件');
    }

    return dayjsObj.format(format);
};

const getTimeRange = (times: number[]) => {
    // 檢查輸入是否為有效陣列
    if (!Array.isArray(times) || times.length === 0) {
        return [];
    }
    // 找出最早和最晚的時間戳
    const earliestTimestamp = Math.min(...times);
    const latestTimestamp = Math.max(...times);
    return [earliestTimestamp, latestTimestamp];
};

const stringToDate = (time: string | string[]) => {
    return Array.isArray(time) ? time.map(t => dayjs(t).toDate()) : dayjs(time).toDate();
};

const TimeUtils = {
    timeFormatter,
    getTimeRange,
    stringToDate
};
export default TimeUtils;
