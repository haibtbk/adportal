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
                console.log(contract);
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
        title: t1('afyp_report'),
        result: convertValueToString(resultAfyp),
        result_last_month: convertValueToString(resultAfypLastMonth),
        result_increased: Math.round(resultAfyp * 100 / resultAfypLastMonth) - 100,
    })

    var resultOldTvv = getTvvAction(contractList, saleInfoList, monthSelected, 'old');
    var resultOldTvvLastMonth = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(1, "months").unix(), 'old');

    output.push({
        title: t1("old_tvv_action_report"),
        result: convertValueToString(resultOldTvv),
        result_last_month: convertValueToString(resultOldTvvLastMonth),
        result_increased: Math.round(resultOldTvv * 100 / resultOldTvvLastMonth) - 100,
    })

    var recruit = getRecruit(saleInfoList, 'sale_code_issued_time', monthSelected);
    var recruitLastMonth = getRecruit(saleInfoList, 'sale_code_issued_time', moment.unix(monthSelected).subtract(1, "months").unix());

    output.push({
        title: t1("recruit_report"),
        result: convertValueToString(recruit),
        result_last_month: convertValueToString(recruitLastMonth),
        result_increased: Math.round(recruit * 100 / recruitLastMonth) - 100,
    })

    var ipResult = getTotal(contractList, 'initial_fee', monthSelected);
    var ipResultLastMonth = getTotal(contractList, 'initial_fee', moment.unix(monthSelected).subtract(1, "months").unix());

    output.push({
        title: t1("ip_report"),
        result: convertValueToString(Math.round(ipResult / defaultSplit)),
        result_last_month: convertValueToString(Math.round(ipResultLastMonth / defaultSplit)),
        result_increased: Math.round(ipResult * 100 / ipResultLastMonth) - 100,
    })

    var resultNewTvv = getTvvAction(contractList, saleInfoList, monthSelected, 'new');
    var resultNewTvvLastMonth = getTvvAction(contractList, saleInfoList, moment.unix(monthSelected).subtract(1, "months").unix(), 'new');

    output.push({
        title: t1("new_tvv_action_report"),
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
        criteria_name: t1('productivity')
    }

    productivityCriteria[`month_${moment.unix(monthSelected).format("MM")}`] = productivity;
    productivityCriteria[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = productivityLastMonth;
    productivityCriteria[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = productivity2monthAgo;

    let productivityPercentage = {
        criteria_name: t1('productivity_increase'),
    }

    productivityPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(productivity * 100 / productivityLastMonth) - 100 + "%";
    productivityPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(productivityLastMonth * 100 / productivity2monthAgo) - 100 + "%";
    productivityPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(productivity2monthAgo * 100 / productivity3monthAgo) - 100 + "%";

    let amountAverage = {
        criteria_name: t1('amount_average'),
    }

    amountAverage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round((afyp / totalContract) * 10) / 10;
    amountAverage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round((afypLastMonth / totalContractLastMonth) * 10) / 10;
    amountAverage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round((afyp2MonthAgo / totalContract2MonthAgo) * 10) / 10;
    amountAverage[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = Math.round((afyp3MonthAgo / totalContract3MonthAgo) * 10) / 10;

    let amountAveragePercentage = {
        criteria_name: t1('amount_average_percentage')
    }

    amountAveragePercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round((afyp / tvvIp) * 100 / (afypLastMonth / tvvIpLastMonth)) - 100 + "%";
    amountAveragePercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round((afypLastMonth / tvvIpLastMonth) * 100 / (afyp2MonthAgo / tvvIp2MonthAgo)) - 100 + "%";
    amountAveragePercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round((afyp2MonthAgo / tvvIp2MonthAgo) * 100 / (afyp3MonthAgo / tvvIp3MonthAgo)) - 100 + "%";

    let actionCount = {
        criteria_name: t1('action_tvv_count')
    }

    actionCount[`month_${moment.unix(monthSelected).format("MM")}`] = tvvIp;
    actionCount[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = tvvIpLastMonth;
    actionCount[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = tvvIp2MonthAgo;
    actionCount[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = tvvIp3MonthAgo;

    let actionCountPercentage = {
        criteria_name: t1('action_tvv_percentage')
    }

    actionCountPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(tvvIp * 100 / tvvIpLastMonth) - 100 + "%";
    actionCountPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(tvvIpLastMonth * 100 / tvvIp2MonthAgo) - 100 + "%";
    actionCountPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(tvvIp2MonthAgo * 100 / tvvIp3MonthAgo) - 100 + "%";

    let afypNumber = {
        criteria_name: t1('afyp_number_report')
    }

    afypNumber[`month_${moment.unix(monthSelected).format("MM")}`] = afyp;
    afypNumber[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = afypLastMonth;
    afypNumber[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = afyp2MonthAgo;
    afypNumber[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = afyp3MonthAgo;

    let afypPercentage = {
        criteria_name: t1('afyp_number_percentage')
    }

    afypPercentage[`month_${moment.unix(monthSelected).format("MM")}`] = Math.round(afyp * 100 / afypLastMonth) - 100 + "%";
    afypPercentage[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = Math.round(afypLastMonth * 100 / afyp2MonthAgo) - 100 + "%";
    afypPercentage[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = Math.round(afyp2MonthAgo * 100 / afyp3MonthAgo) - 100 + "%";

    let ipNumber = {
        criteria_name: t1('ip_number')
    }

    ipNumber[`month_${moment.unix(monthSelected).format("MM")}`] = ipData;
    ipNumber[`month_${moment.unix(monthSelected).subtract(1, "months").format("MM")}`] = ipDataLastMonth;
    ipNumber[`month_${moment.unix(monthSelected).subtract(2, "months").format("MM")}`] = ipData2MonthAgo;
    ipNumber[`month_${moment.unix(monthSelected).subtract(3, "months").format("MM")}`] = ipData3MonthAgo;

    let ipNumberPercentage = {
        criteria_name: t1('ip_number_percentage')
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
