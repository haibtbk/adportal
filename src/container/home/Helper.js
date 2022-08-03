import _ from "lodash";
import moment from "moment";
import { t1 } from "@localization"


export const getMonths = (month) => {
    return [
        `month_${moment(month.value, "MM/YYYY").subtract(1, 'month').format("MM")}`,
        `month_${moment(month.value, "MM/YYYY").subtract(2, 'month').format("MM")}`,
        `month_${moment(month.value, "MM/YYYY").subtract(3, 'month').format("MM")}`,
    ]

}

export const getMonthOnDigit = (month) => {
    return [
        moment(month.label, "MM/YYYY").format("M"),
        moment(month.label, "MM/YYYY").subtract(1, 'month').format("M"),
        moment(month.label, "MM/YYYY").subtract(2, 'month').format("M"),
        moment(month.label, "MM/YYYY").subtract(3, 'month').format("M"),
    ]
}

export const convertValueToString = (value = '', type) => {
    switch (type) {
        case 'money':
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        default:
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export const getMonthParams = (month) => {
    const params = {
        month_value: moment(month, "MM/YYYY").subtract(1, 'month').unix().valueOf(),
        month_value_2: moment(month, "MM/YYYY").subtract(2, 'month').unix().valueOf(),
        month_value_3: moment(month, "MM/YYYY").subtract(3, 'month').unix().valueOf(),
        month_value_4: moment(month, "MM/YYYY").subtract(4, 'month').unix().valueOf()
    }
    return params
}

export const getUniqueBigGroupAndGroup = (contractList = []) => {
    let bigGroupList = [];
    let output = {};

    contractList.map(contract => {
        if (!bigGroupList.includes(contract.big_group)) {
            bigGroupList.push(contract.big_group);
        }
    })

    bigGroupList.map(bigGroup => {
        var listGroup = [];
        contractList.map(contract => {
            if (contract.group == null) {
            }
            if (contract.big_group == bigGroup) {
                if (!listGroup.includes(contract.group)) {
                    listGroup.push(contract.group)
                }
            }
        })

        output[bigGroup] = listGroup;
    })
    return {
        big_group: bigGroupList,
        group: output
    }
}

export const getTotal = (list = [], fieldName = "field", monthValue = moment().startOf("month").unix(), saleCode = false) => {
    let output = 0;

    list.map(data => {
        if (saleCode) {
            if (data.sale_code == saleCode && data.month_value == monthValue) {
                output += parseInt(data[fieldName]);
            }
        } else {
            if (data.month_value == monthValue) {
                output += parseInt(data[fieldName]);
            }
        }
    })

    return output;
}

export const getCount = (list = [], monthValue = moment().startOf("month").unix(), saleCode = false) => {
    let output = 0;

    list.map(data => {
        if (saleCode) {
            if (data.sale_code == saleCode && data.month_value == monthValue) {
                output += 1;
            }
        } else {
            if (data.month_value == monthValue) {
                output += 1;
            }
        }
    })

    return output;
}

export const getRecruit = (list = [], fieldName = "sale_code_issued_time", monthValue = moment().startOf("month").unix()) => {
    let output = 0;


    list.map(data => {
        if (moment.unix(data["sale_code_issued_time"]).startOf('month').unix() == monthValue) {
            output += 1;
        }
    })

    return output;
}

export const getTvvAction = (contractList = [], saleInfoList = [], monthSelected = moment().startOf("month").unix(), mode = 'new', minAllow = 2000000) => {
    let output = 0;
    let listCodeEligible = [];

    saleInfoList.map(saleInfo => {
        if (moment.unix(monthSelected).format("YYYY") == moment.unix(saleInfo.sale_code_issued_time).format("YYYY")) {
            if (mode == 'new' || mode == 'all') {
                listCodeEligible.push(saleInfo.sale_code);
            }
        } else {
            if (mode != 'new' || mode == 'all') {
                listCodeEligible.push(saleInfo.sale_code);
            }
        }
    })

    listCodeEligible.map(code => {
        var isExist = false;
        contractList.map(contract => {
            if (contract.sale_code == code && contract.month_value == monthSelected && contract.initial_fee >= minAllow) {
                isExist = true;
            }
        })
        if (isExist) {
            output += 1;
        }
    })

    return output;
}

export const generateDataReportMonthlySummary = (contractList = [], saleInfoList = [], monthSelected = moment().startOf("month").unix(), defaultSplit = 1000000) => {
    let output = [];

    var resultAfyp = Math.round(getTotal(contractList, 'afyp', monthSelected) / defaultSplit);
    var resultAfypLastMonth = Math.round(getTotal(contractList, 'afyp', moment.unix(monthSelected).subtract(1, "months").unix()) / defaultSplit)

    output.push({
        title: 'afyp_report',
        result: convertValueToString(resultAfyp),
        result_last_month: convertValueToString(resultAfypLastMonth),
        result_increased: Math.round(resultAfyp * 100 / resultAfypLastMonth) - 100,
    })

    var resultOldTvv = getTvvAction(contractList, saleInfoList, monthSelected, 'old');
    var resultOldTvvLastMonth = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(1, "months").unix(), 'old');

    output.push({
        title: "old_tvv_action_report",
        result: convertValueToString(resultOldTvv),
        result_last_month: convertValueToString(resultOldTvvLastMonth),
        result_increased: Math.round(resultOldTvv * 100 / resultOldTvvLastMonth) - 100,
    })

    var recruit = getRecruit(saleInfoList, 'sale_code_issued_time', monthSelected);
    var recruitLastMonth = getRecruit(saleInfoList, 'sale_code_issued_time', moment.unix(monthSelected).subtract(1, "months").unix());

    output.push({
        title: "recruit_report",
        result: convertValueToString(recruit),
        result_last_month: convertValueToString(recruitLastMonth),
        result_increased: Math.round(recruit * 100 / recruitLastMonth) - 100,
    })

    var ipResult = getTotal(contractList, 'initial_fee', monthSelected);
    var ipResultLastMonth = getTotal(contractList, 'initial_fee', moment.unix(monthSelected).subtract(1, "months").unix())

    output.push({
        title: "ip_report",
        result: convertValueToString(Math.round(ipResult / defaultSplit)),
        result_last_month: convertValueToString(Math.round(ipResultLastMonth / defaultSplit)),
        result_increased: Math.round(ipResult * 100 / ipResultLastMonth) - 100,
    })

    var resultNewTvv = getTvvAction(contractList, saleInfoList, monthSelected, 'new');
    var resultNewTvvLastMonth = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(1, "months").unix(), 'new');

    output.push({
        title: "new_tvv_action_report",
        result: convertValueToString(resultNewTvv),
        result_last_month: convertValueToString(resultNewTvvLastMonth),
        result_increased: Math.round(resultNewTvv * 100 / resultNewTvvLastMonth) - 100,
    })

    return output;
}

export const generateDataReportKpi = (contractList, saleInfoList, monthSelected = moment().startOf("month").unix(), defaultSplit = 100000) => {
    let output = [];

    var totalContract = getCount(contractList, monthSelected, false);
    var totalContractLastMonth = getCount(contractList, moment.unix(monthSelected).subtract(1, "months").unix(), false);
    var totalContract2MonthAgo = getCount(contractList, moment.unix(monthSelected).subtract(2, "months").unix(), false);
    var totalContract3MonthAgo = getCount(contractList, moment.unix(monthSelected).subtract(3, "months").unix(), false);

    var tvvIp = getTvvAction(contractList, saleInfoList, monthSelected, 'all');
    var tvvIpLastMonth = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(1, "months").unix(), 'all');
    var tvvIp2MonthAgo = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(2, "months").unix(), 'all');
    var tvvIp3MonthAgo = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(3, "months").unix(), 'all');

    var afyp = Math.round(getTotal(contractList, 'afyp', monthSelected) / defaultSplit) / 10;
    var afypLastMonth = Math.round(getTotal(contractList, 'afyp', moment.unix(monthSelected).subtract(1, "months").unix()) / defaultSplit) / 10;
    var afyp2MonthAgo = Math.round(getTotal(contractList, 'afyp', moment.unix(monthSelected).subtract(2, "months").unix()) / defaultSplit) / 10;
    var afyp3MonthAgo = Math.round(getTotal(contractList, 'afyp', moment.unix(monthSelected).subtract(3, "months").unix()) / defaultSplit) / 10;

    var ipData = Math.round(getTotal(contractList, 'initial_fee', monthSelected) / defaultSplit) / 10;
    var ipDataLastMonth = Math.round(getTotal(contractList, 'initial_fee', moment.unix(monthSelected).subtract(1, "months").unix()) / defaultSplit) / 10;
    var ipData2MonthAgo = Math.round(getTotal(contractList, 'initial_fee', moment.unix(monthSelected).subtract(2, "months").unix()) / defaultSplit) / 10;
    var ipData3MonthAgo = Math.round(getTotal(contractList, 'initial_fee', moment.unix(monthSelected).subtract(3, "months").unix()) / defaultSplit) / 10;

    var productivity = Math.round(getCount(contractList, monthSelected, false) * 10 / tvvIp) / 10;
    var productivityLastMonth = Math.round(getCount(contractList, moment.unix(monthSelected).subtract(1, "months").unix(), false) * 10 / tvvIpLastMonth) / 10;
    var productivity2monthAgo = Math.round(getCount(contractList, moment.unix(monthSelected).subtract(2, "months").unix(), false) * 10 / tvvIp2MonthAgo) / 10;
    var productivity3monthAgo = Math.round(getCount(contractList, moment.unix(monthSelected).subtract(3, "months").unix(), false) * 10 / tvvIp2MonthAgo) / 10;

    let productivityCriteria = {
        criteria_name: 'productivity'
    }

    productivityCriteria[`month_${moment.unix(monthSelected).format("MM")}`] = productivity;
    productivityCriteria[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = productivityLastMonth;
    productivityCriteria[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = productivity2monthAgo;

    let productivityPercentage = {
        criteria_name: 'productivity_increase'
    }

    productivityPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(productivity * 100 / productivityLastMonth) - 100 + "%";
    productivityPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(productivityLastMonth * 100 / productivity2monthAgo) - 100 + "%";
    productivityPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(productivity2monthAgo * 100 / productivity3monthAgo) - 100 + "%";

    let amountAverage = {
        criteria_name: 'amount_average'
    }

    amountAverage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round((afyp / totalContract) * 10) / 10;
    amountAverage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round((afypLastMonth / totalContractLastMonth) * 10) / 10;
    amountAverage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round((afyp2MonthAgo / totalContract2MonthAgo) * 10) / 10;
    amountAverage[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = Math.round((afyp3MonthAgo / totalContract3MonthAgo) * 10) / 10;

    let amountAveragePercentage = {
        criteria_name: 'amount_average_percentage'
    }

    amountAveragePercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round((afyp / tvvIp) * 100 / (afypLastMonth / tvvIpLastMonth)) - 100 + "%";
    amountAveragePercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round((afypLastMonth / tvvIpLastMonth) * 100 / (afyp2MonthAgo / tvvIp2MonthAgo)) - 100 + "%";
    amountAveragePercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round((afyp2MonthAgo / tvvIp2MonthAgo) * 100 / (afyp3MonthAgo / tvvIp3MonthAgo)) - 100 + "%";

    let actionCount = {
        criteria_name: 'action_tvv_count'
    }

    actionCount[`month_${moment.unix(monthSelected).format("MM")}`] = tvvIp;
    actionCount[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = tvvIpLastMonth;
    actionCount[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = tvvIp2MonthAgo;
    actionCount[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = tvvIp3MonthAgo;

    let actionCountPercentage = {
        criteria_name: 'action_tvv_percentage'
    }

    actionCountPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(tvvIp * 100 / tvvIpLastMonth) - 100 + "%";
    actionCountPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(tvvIpLastMonth * 100 / tvvIp2MonthAgo) - 100 + "%";
    actionCountPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(tvvIp2MonthAgo * 100 / tvvIp3MonthAgo) - 100 + "%";

    let afypNumber = {
        criteria_name: 'afyp_number_report'
    }

    afypNumber[`month_${moment.unix(monthSelected).format("MM")}`] = afyp;
    afypNumber[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = afypLastMonth;
    afypNumber[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = afyp2MonthAgo;
    afypNumber[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = afyp3MonthAgo;

    let afypPercentage = {
        criteria_name: 'afyp_number_percentage'
    }

    afypPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(afyp * 100 / afypLastMonth) - 100 + "%";
    afypPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(afypLastMonth * 100 / afyp2MonthAgo) - 100 + "%";
    afypPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(afyp2MonthAgo * 100 / afyp3MonthAgo) - 100 + "%";

    let ipNumber = {
        criteria_name: 'ip_number'
    }

    ipNumber[`month_${moment.unix(monthSelected).format("MM")}`] = ipData;
    ipNumber[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = ipDataLastMonth;
    ipNumber[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = ipData2MonthAgo;
    ipNumber[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = ipData3MonthAgo;

    let ipNumberPercentage = {
        criteria_name: 'ip_number_percentage'
    }

    ipNumberPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(ipData * 100 / ipDataLastMonth) - 100 + "%";
    ipNumberPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(ipDataLastMonth * 100 / ipData2MonthAgo) - 100 + "%";
    ipNumberPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(ipData2MonthAgo * 100 / ipData3MonthAgo) - 100 + "%";

    output.push(productivityCriteria);
    output.push(productivityPercentage);
    output.push(amountAverage);
    output.push(amountAveragePercentage);
    output.push(actionCount);
    output.push(actionCountPercentage);
    output.push(afypNumber);
    output.push(afypPercentage);
    output.push(ipNumber);
    output.push(ipNumberPercentage);

    return output;
}

export const filterByGroupAndBigGroup = (list = [], big_group = 'all', group = 'all') => {
    let output = [];

    if (big_group == 'all') {
        output = list;
    } else {
        if (group == 'all') {
            list.map(item => {
                if (item.big_group == big_group) {
                    output.push(item);
                }
            })
        } else {
            list.map(item => {
                if (item.big_group == big_group && item.group == group) {
                    output.push(item);
                }
            })
        }
    }

    return output;
}

export const getquarter = (data, monthSelected) => {
    if (moment.unix(data).format('YYYY') == moment.unix(monthSelected).format('YYYY')) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (moment.unix(data).format("M") == (i * 3 + j + 1)) {
                    switch (j) {
                        case 0:
                            return t1('tvvm_start_of_season_%s', [i + 1])
                        case 1:
                            return t1('tvvm_middle_of_season_%s', [i + 1])
                        case 2:
                            return t1('tvvm_end_of_season_%s', [i + 1])
                    }

                }
            }
        }
        return '';
    } else {
        return '';
    }
}

export const targetList = {
    "An Giang": 150,
    "Bạc Liêu": 150,
    "Bến Tre": 150,
    "Cà Mau": 200,
    "Cần Thơ": 100,
    "Đồng Tháp": 150,
    "Hậu Giang": 200,
    "Kiên Giang": 150,
    "Long An": 150,
    "Phú Quốc": 50,
    "Sóc Trăng": 150,
    "Tiền Giang": 100,
    "Trà Vinh": 200,
    "Vĩnh Long": 150,
    "Ninh Thuận": 100,
    "Bình Thuận": 150,
    "Khánh Hòa": 100,
    "Bắc Kạn": 80,
    "Cao Bằng": 80,
    "Điện Biên": 100,
    "Hà Giang": 150,
    "Hòa Bình": 100,
    "Lai Châu": 80,
    "Lào Cai": 150,
    "Móng Cái": 100,
    "Phú Thọ": 150,
    "Sơn La": 150,
    "Tuyên Quang": 100,
    "Thái Nguyên": 150,
    "Yên Bái": 100,
    "Thanh Hóa": 400,
    "Bắc Thanh Hóa": 300,
    "Nghệ An": 300,
    "Tây Nghệ An": 300,
    "Bắc Nghệ An": 400,
    "Hà Tĩnh": 300
}

export const mapCategory = [
    {
        id: 1,
        label: 'west_area',
        value: ["An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", "Cần Thơ", "Đồng Tháp", "Hậu Giang", "Kiên Giang", "Long An", "Phú Quốc", "Sóc Trăng", "Tiền Giang", "Trà Vinh", "Vĩnh Long"]
    },{
        id: 2,
        label: 'nt_bt_kh_area',
        value: ["Ninh Thuận", "Bình Thuận", "Khánh Hòa"]
    },{
        id: 3,
        label: 'north_east_north_west_area',
        value: ["Bắc Kạn", "Cao Bằng", "Điện Biên", "Hà Giang", "Hòa Bình", "Lai Châu", "Lào Cai", "Móng Cái", "Phú Thọ", "Sơn La", "Tuyên Quang", "Thái Nguyên", "Yên Bái"]
    },{
        id: 4,
        label: 'north_middle_area',
        value: ["Thanh Hóa","Bắc Thanh Hóa", "Nghệ An", "Tây Nghệ An", "Bắc Nghệ An", "Hà Tĩnh"]
    }
]