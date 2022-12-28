import moment from 'moment';

const dateToString = (date, format) => (
    moment(date).format(format)
)

const str2Date = (value, pattern) => (
    moment(value, pattern)
)

export default {
    dateToString,
    str2Date
}