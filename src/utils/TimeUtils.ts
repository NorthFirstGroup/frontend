import dayjs from 'dayjs';

/**
 * Format a Unix timestamp to a specified string format.
 * @param timestamp number - Unix timestamp in seconds
 * @param format string - ex: 'YYYY/MM/DD HH:mm'
 * @param weekday boolean - show weekday at the end. ex:(三) (default: false)
 * @returns string - Formatted date string
 */

const timeFormatter = (timestamp: number, format: string = 'YYYY/MM/DD HH:mm', weekday: boolean = false): string => {
    const formattedTime = dayjs.unix(timestamp).format(format);
    if (weekday) {
        const weekdays: string[] = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday: string = weekdays[dayjs.unix(timestamp).day()];
        return `${formattedTime} (${weekday})`;
    }
    return formattedTime;
};
const TimeUtils = {
    timeFormatter
};
export default TimeUtils;
