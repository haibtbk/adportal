var flatListData = [
  {
    id: '1',
    name: 'Áo Phông Halo',
    source:
      'https://vn-test-11.slatic.net/p/de2324c6849a8953b8c7f3de15175df8.jpg_720x720q80.jpg_.webp',
    price: 99000000,
  },
  {
    id: '2',
    name: 'Áo Phông sieu nhan',
    source:
      'https://hd1.hotdeal.vn/images/uploads/2015/10/17/190325/190325-do-be-trai-body-%20%286%29.jpg',
    price: 99000000,
  },
  {
    id: '3',
    name: 'Áo Phông 3',
    source:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRwvgGyNDnA9xELW30ZDO1_4T6jIpIxxzM-JA&usqp=CAU',
    price: 99000000,
  },
  {
    id: '4',
    name: 'Áo Phông 4',
    source:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT5a953CxGN8-Ejs9wNo8JRrJQNr3FNs8M2og&usqp=CAU',
    price: 99000000,
  },
  {
    id: '5',
    name: 'Áo Phông 5',
    source:
      'data:image/jpeg;base64,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',
    price: 99000000,
  },
  {
    id: '6',
    name: 'Áo Phông 6',
    source:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcToDq6hQrpmqCZBiC1OlNdjHUrjdWtMPEw8xi79olCYBjMb8WEutJIFXQBV33wGpxbSA6ncYIY&usqp=CAc',
    price: 99000000,
  },
];

export default flatListData