const workTypeList = [
    {
        id: 1,
        name: 'Họp',
        children: [
            {
                id: 11,
                name: 'Họp giao ban công ty',
            }, {
                id: 16,
                name: 'Họp kinh doanh công ty',
            },
            {
                id: 12,
                name: 'Họp 1:1',
            }, {
                id: 14,
                name: 'Họp CQL khu vực/Ban',
            }, {
                id: 13,
                name: 'Họp nhóm',
            }, {
                id: 17,
                name: 'Họp Ban',
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
        name: 'Hội nghị tuyển dụng',
        children: [
            {
                id: 31,
                name: 'BNNN',
            }]
    }, {
        id: 4,
        name: 'HNKH',
        children: [
            {
                id: 44,
                name: 'HN VIP công ty',
            }, {
                id: 45,
                name: 'HN VIP khu vực/Ban',
            }, {
                id: 46,
                name: 'HN Chọn lọc(Nhóm)',
            }, {
                id: 41,
                name: 'BHNN',
            }, {
                id: 43,
                name: 'HN BOSS',
            }, {
                id: 42,
                name: 'HNOL',
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
        name: 'Khác',
        type: "header"
    },
]


const workTypeValues = {
    hop: 1,
    huanLuyen: 2,
    hoiNghiTuyenDung: 3,
    HNKH: 4,
    hoTro: 5,
    khac: 6,
    BNNN: 31,
}


const headerWorkTypes = [
    {
        value: workTypeValues.hop,
        header: "Họp"
    },
    {
        value: workTypeValues.huanLuyen,
        header: "Huấn luyện"
    },
    {
        value: workTypeValues.hoiNghiTuyenDung,
        header: "Hội nghị tuyển dụng",
    },
    {
        value: workTypeValues.HNKH,
        header: "HNKH"
    },
    {
        header: "Hỗ trợ",
        value: workTypeValues.hoTro
    },
    {
        value: workTypeValues.khac,
        header: "Khác"
    }
]

export { headerWorkTypes, workTypeValues }
export default workTypeList
