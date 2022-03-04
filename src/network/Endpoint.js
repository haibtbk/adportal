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
    getSchedulesCompany: "/api/schedule/search-available-manager",
    updateSchedule: "/api/schedule/update",
    getNews: '/api/news/search-for-dashboard',
    getEventNews: '/api/event/search-available',
    getFileCategories: '/api/category/search-by-type',
    createSchedule: 'api/schedule/create',
    getUserUnderControl: 'api/schedule/search-user-under-control',
    getRevenue: 'api/revenue/search',
}

export default Endpoint
