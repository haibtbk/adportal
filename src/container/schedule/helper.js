import { headerWorkTypes } from "./WorkTypes"
import _ from "lodash"
import { AppColors, AppSizes } from "@theme"
import { actionStatus } from './ScheduleStatus'
import { ScheduleStatus } from "@schedule"
import workTypeList from "./WorkTypes"

const getWorkTypeName = (work_type) => {
    let workTypeTemp = []
    _.forEach(workTypeList, (item) => {
        workTypeTemp = [...workTypeTemp, { name: item?.name, id: item?.id }, ...item?.children ?? []]
    })

    return _.filter(workTypeTemp, i => i.id == work_type)?.[0]?.name ?? ""
}
const getWorkHeader = (work_type) => {
    const workType = _.filter(headerWorkTypes, i => (work_type ?? 0).toString()?.charAt(0) == (i.value?.toString()))?.[0]?.header ?? ""
    return workType
}

const getStatus = (status, schedule) => {
    if (status == ScheduleStatus.pending) {
        const start_ts = (schedule?.start_ts ?? 0) * 1000
        const end_ts = (schedule?.end_ts ?? 0) * 1000
        const now = new Date().getTime()
        if (now < start_ts) {
            return "Chưa diễn ra"
        } else if (now > end_ts) {
            return "Chưa diễn ra (quá hạn)"
        } else {
            return "Đang diễn ra"
        }
    }
    return _.filter(actionStatus, i => i.value === status)?.[0]?.label ?? ""
}

const getStatusColor = (status) => {
    switch (status) {
        case ScheduleStatus.completed: return AppColors.success
        case ScheduleStatus.stoped: return AppColors.danger
        case ScheduleStatus.pending: return 'orange'
        default: return 'orange'
    }

}

export { getWorkHeader, getStatus, getStatusColor, getWorkTypeName }