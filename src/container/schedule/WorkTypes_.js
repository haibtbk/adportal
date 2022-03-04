const workTypes = [
    {
        id: 1,
        name: 'Họp',
        children: [
            {
                id: 11,
                name: 'Họp công ty',
            }, {
                id: 12,
                name: 'Họp 1:1',
            }, {
                id: 13,
                name: 'Họp nhóm',
            }, {
                id: 14,
                name: 'Họp toàn khu vực',
            }, {
                id: 15,
                name: 'Họp khác',
            },
        ]
    }, {
        id: 2,
        name: 'Huấn luyện',
        children: [
            {
                id: 21,
                name: 'Giảng BVLN',
            }, {
                id: 22,
                name: 'Giảng NTTC',
            }, {
                id: 23,
                name: 'Sản phẩm',
            }, {
                id: 24,
                name: 'Chính sách',
            }, {
                id: 25,
                name: 'Huấn luyện khác',
            },
        ]
    }, {
        id: 3,
        name: 'Lập kế hoạch',
        children: [
            {
                id: 31,
                name: 'Thiết lập mục tiêu tháng',
            }, {
                id: 32,
                name: 'Thiết lập mục tiêu quý',
            }
        ]
    }, {
        id: 4,
        name: 'Tổ chức hội nghị',
        children: [
            {
                id: 41,
                name: 'HNKH',
            }, {
                id: 42,
                name: 'HN',
            }, {
                id: 43,
                name: 'BOSS',
            }
        ]
    }, {
        id: 5,
        name: 'Hỗ trợ',
        children: [
            {
                id: 51,
                name: 'Bán hàng',
            }, {
                id: 52,
                name: 'Thu phí',
            }, {
                id: 53,
                name: 'Tiếp cân thị trường',
            }, {
                id: 54,
                name: 'Tuyển dụng',
            }, {
                id: 55,
                name: 'Sự kiện TCT',
            },
        ]
    }, {
        id: 6,
        name: 'Khác'
    },
]

export default workTypes