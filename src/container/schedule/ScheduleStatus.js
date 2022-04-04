const status = {
    pending: 2,
    completed: 3,
    stoped: 4,
    removed: -1
}
const actionStatus = [
    { label: "Hoàn thành", value: status.completed },
    { label: "Dừng", value: status.stoped },
    { label: "Đang chạy", value: status.pending },
    { label: "Xóa", value: status.removed },
]

export {actionStatus}
export default status