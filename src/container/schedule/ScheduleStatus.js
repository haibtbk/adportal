const status = {
    pending: 2,
    completed: 3,
    stoped: 4,
}
const actionStatus = [
    { label: "Hoàn thành", value: status.completed },
    { label: "Dừng", value: status.stoped },
    { label: "Đang chạy", value: status.pending },
]

export {actionStatus}
export default status