const Endpoint = {
    LOGIN: "/api/login",
    getProfile: "/api/profile",
    updateProfile: "/api/profile",
    updateDeviceInfo: "/api/profile/device",
    confirmRequest: "/api/approve-request/submit-decision",
    getListRequest: "/api/approve-request/search",
    getMenuState: "/api/menu/get-state",
    searchFiles: "/api/library/search",
    downloadFile: "/api/library/download",
    getDashboardInfo: "/api/layout/get-dashboard-info",
    getSchedules: "/api/schedule/search-available",
    getSchedulesCompany: "/api/schedule/search-schedule-of-my-company",
    getSchedulesManager: "/api/schedule/search-available-manager",
    updateSchedule: "/api/schedule/update",
    getNews: '/api/news/search-for-dashboard',
    getEventNews: '/api/event/search-available',
    getFileCategories: '/api/category/search-by-type',
    createSchedule: 'api/schedule/create',
    getUserUnderControl: 'api/schedule/search-user-under-control',
    getRevenue: 'api/revenue/search',
    getRevenueCorporation: 'api/revenue/get-all-company-revenue',
    signup: 'api/register',
    deleteSchedule: '/api/schedule/delete',
    getRevenueCompany: '/api/revenue/get-my-company-revenue-record-by-time',
    getRevenueCompanies: '/api/revenue/get-company-revenue-record-by-time',
    getRevenueCorporationVer2: '/api/revenue/get-all-company-revenue-summary',
    uploadAvatar: '/api/file-manager/upload-avatar',
    getScheduleUser: '/api/schedule/search-schedule-of-user-iids',
    uploadFileSchedule: '/api/file-manager/upload-schedule-attachment',
    scheduleUpdate: '/api/schedule/update',
    changePassword: '/api/user/update',
    personRanking: "/api/schedule/get-company-schedule-performance-ranking",
    getOrgUnderControl: "/api/organization/search-org-under-control",
    getScheduleFromTCT: "/api/schedule/search-company-schedule",
    getBNNNEvent: "/api/schedule/get-bnnn-event-result",
    getTotalBNNNEvent: "/api/schedule/get-bnnn-event-total-result",
    getBNNNRanking: "/api/ranking/get-ranking-bnnn-result",
    getAppVersion: "/get-version"
}

export default Endpoint
