import { headerWorkTypes } from "./WorkTypes"
import _ from "lodash"
import {AppColors, AppSizes} from "@theme"
import {actionStatus} from './ScheduleStatus'
import { ScheduleStatus } from "@schedule"

const getWorkHeader = (work_type) => {
    const workType = _.filter(headerWorkTypes, i => (work_type ?? 0).toString().includes(i.value?.toString()))?.[0]?.header ?? ""
    return workType
}

const getStatus = (status) => {
    return _.filter(actionStatus, i => i.value === status)?.[0]?.label ?? ""
}

const getStatusColor = (status) => {
    switch (status) {
        case ScheduleStatus.completed: return AppColors.primaryBackground
        case ScheduleStatus.stoped: return AppColors.danger
        case ScheduleStatus.pending: return 'orange'
        default: return 'orange'
    }

}

export { getWorkHeader, getStatus, getStatusColor }