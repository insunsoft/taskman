import moment from './moment';

let chart = [];
// 格式化日期为年月日形式
const formatDateZh = (date) => {
    const years = moment(date).format('YYYY');
    const month = moment(date).format('MM');
    const day = moment(date).format('DD');
    return `${years}年${month}月${day}日`
}

// 获取昨天的开始结束时间
const getYesterday = () => {
    let date = []
    date.push(moment().subtract(1, 'days').format('YYYY-MM-DD'))
    return date
}

// 获取上一周的开始结束时间
const getLastWeekDays = () => {
    let date = []
    let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天  周日为一周中的第一天
    let start = moment().subtract(weekOfday + 6, 'days').format('YYYY-MM-DD') // 周一日期
    let end = moment().subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
    date.push(start)
    date.push(end)
    return date
}

// 获取上一个月的开始结束时间
const getLastMonthDays = () => {
    let date = []
    let start = moment().subtract(1, 'month').format('YYYY-MM') + '-01'
    let end = moment(start).subtract(-1, 'month').add(-1, 'days').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return date
}

// 获取当前周的开始结束时间
const getCurrWeekDays = () => {
    let date = []
    let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
    let start = moment().subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周一日期
    let end = moment().add(7 - weekOfday - 1, 'days').format('YYYY-MM-DD') // 周日日期
    date.push(start)
    date.push(end)
    return date
}

// 获取当前月的开始结束时间
const getCurrMonthDays = () => {
    let date = []
    let start = moment().add(0, 'month').format('YYYY-MM') + '-01'
    let end = moment(start).add(1, 'month').add(-1, 'days').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return date
}

// 获取上一年的开始结束时间
const getLastYearsDays = () => {
    let date = []
    let start = moment().subtract(1, 'year').format('YYYY') + '-01' + '-01'
    let end = moment(start).subtract(-1, 'year').add(-1, 'days').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return date
}

// 获取当前年的开始结束时间
const getCurrYearsDays = () => {
    let date = []
    let start = moment().add(0, 'year').format('YYYY') + '-01' + '-01'
    let end = moment(start).add(1, 'year').add(-1, 'days').format('YYYY-MM-DD')
    date.push(start)
    date.push(end)
    return date
}

// 近n个月，默认返回近一个月日期
const getNearThreeMonth = (val = 1) => {
    let date = []
    let start = moment().add(-val, 'month').format("YYYY-MM-DD")
    let end = moment().format("YYYY-MM-DD")
    date.push(start)
    date.push(end)
    return date
}

// 近n年，默认返回近一年日期
const getNearOneYears = (val = 1) => {
    let date = []
    let start = moment().add(-val, 'year').format("YYYY-MM-DD")
    let end = moment().format("YYYY-MM-DD")
    date.push(start)
    date.push(end)
    return date
}

module.exports = {
    getYesterday,
    getLastWeekDays,
    getLastMonthDays,
    getCurrWeekDays,
    getCurrMonthDays,
    getCurrYearsDays,
    getLastYearsDays,
    getNearThreeMonth,
    getNearOneYears,
    formatDateZh,
    formatChartData,
    initChart,
}