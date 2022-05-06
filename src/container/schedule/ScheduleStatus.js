const status = {
    pending: 2,
    completed: 3,
    stoped: 4,
}
const actionStatus = [
    { label: "Hoàn thành", value: status.completed },
    { label: "Bị Dừng", value: status.stoped },
    { label: "Đang diễn ra", value: status.pending },
]

export {actionStatus}
export default status