export const demoSettings = {
  siteName: "Điêu Khắc Xuân Trường",
  companyName: "Xưởng Điêu Khắc Xuân Trường",
  tagline: "Chế tác và thi công phù điêu, tượng, hoa văn kiến trúc cao cấp",
  hotline: "0909 888 668",
  email: "hello@dieu-khac.vn",
  address: "Số 18, đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
  zaloUrl: "https://zalo.me/0909888668",
  messengerUrl: "https://m.me/dieukhactancodien",
  facebookUrl: "https://facebook.com/dieukhactancodien",
  youtubeUrl: "https://youtube.com/@dieukhactancodien",
  logoUrl:
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=500&q=80",
  faviconUrl:
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=64&q=80",
  metaTitle: "Điêu khắc thạch cao, bê tông mỹ thuật, hoa văn công trình cao cấp",
  metaDescription:
    "Website giới thiệu sản phẩm điêu khắc thạch cao, bê tông mỹ thuật, phù điêu, hoa văn kiến trúc, bê tông đúc sẵn và các dự án thi công thực tế."
};

export const homeSections = {
  introBadge: "Nghệ thuật tạo tác kiến trúc",
  introTitle: "Chế tác hoa văn và điêu khắc theo phong cách tân cổ điển sang trọng",
  introDescription:
    "Chúng tôi thực hiện từ phù điêu, tượng, linh vật, cột cổng, mặt tiền cho đến các cấu kiện bê tông đúc sẵn phục vụ nhà ở, biệt thự, đình chùa và công trình công cộng.",
  stats: [
    { label: "Năm kinh nghiệm", value: "12+" },
    { label: "Dự án hoàn thành", value: "350+" },
    { label: "Nghệ nhân và kỹ sư", value: "40+" }
  ],
  reasonTitle: "Lý do chủ đầu tư lựa chọn chúng tôi",
  reasons: [
    {
      title: "Thiết kế theo yêu cầu",
      description: "Tư vấn từ ý tưởng đến bản vẽ, bố cục và bộ hoa văn phù hợp từng công trình."
    },
    {
      title: "Thi công đồng bộ",
      description: "Chủ động xưởng mộc, khuôn đúc, nhân công điêu khắc và đội thi công tại công trình."
    },
    {
      title: "Chất liệu bền vững",
      description: "Tối ưu thạch cao, GFRC, bê tông mỹ thuật và vật liệu hoàn thiện cho ngoại thất và nội thất."
    }
  ],
  testimonials: [
    {
      name: "Anh Minh Quân",
      role: "Chủ biệt thự tân cổ điển",
      content: "Hoa văn mặt tiền và phù điêu được thi công rất sắc nét, giúp tổng thể công trình sang và có chiều sâu hơn."
    },
    {
      name: "Ban quản lý đền thờ Linh Sơn",
      role: "Khách hàng công trình tâm linh",
      content: "Đội ngũ làm việc kỹ lưỡng, hiểu chất liệu và phom dáng kiến trúc đình chùa, tiến độ rõ ràng."
    }
  ],
  cta: {
    title: "Cần tư vấn phương án hoa văn cho công trình mới?",
    description: "Nhận hồ sơ, bản vẽ, chất liệu và giải pháp phù hợp với ngân sách và phong cách kiến trúc.",
    primaryText: "Liên hệ tư vấn",
    primaryLink: "/lien-he",
    secondaryText: "Xem công trình",
    secondaryLink: "/cong-trinh"
  }
};

export const aboutSections = {
  vision:
    "Trở thành đơn vị chế tác và thi công hoa văn kiến trúc, điêu khắc nghệ thuật và bê tông mỹ thuật được tin chọn trong phân khúc công trình cao cấp.",
  mission:
    "Kết hợp tay nghề thủ công, kỹ thuật khuôn đúc và cảm quan thẩm mỹ để tạo ra các chi tiết bền vững, sắc nét và đúng tinh thần kiến trúc.",
  capabilities: [
    "Diễn giải ý tưởng và dựng mẫu 3D, mẫu tay cho phù điêu, tượng và hoa văn.",
    "Chế tác xuyên suốt tại xưởng với hệ thống khuôn đúc, gia công và hoàn thiện bề mặt.",
    "Thi công lắp đặt cho nhà ở, biệt thự, đình chùa, khu vui chơi và công trình công cộng."
  ],
  values: [
    {
      title: "Tinh thần thủ công",
      description: "Mỗi đường nét, bề mặt và tỷ lệ đều được kiểm soát kỹ lưỡng trong từng công đoạn."
    },
    {
      title: "Độ bền dài hạn",
      description: "Vật liệu được chọn theo môi trường sử dụng thực tế, ưu tiên độ bền và khả năng bảo trì."
    },
    {
      title: "Triển khai đồng bộ",
      description: "Đồng bộ giữa tư vấn, thiết kế, sản xuất, vận chuyển và lắp đặt tại công trình."
    }
  ]
};

export const image = (url, sortOrder = 0, isPrimary = false, altText = "") => ({
  url,
  sortOrder,
  isPrimary,
  altText
});

export const productSeed = [
  {
    name: "Tượng nữ điêu khắc nghệ thuật",
    categoryName: "Điêu khắc thạch cao",
    shortDescription: "Mẫu tượng nữ phong cách tân cổ điển, phù hợp sảnh lớn, phòng khách và không gian trưng bày.",
    content:
      "<p>Sản phẩm được tạo tác theo tỷ lệ cân đối, xử lý bề mặt mềm mịn và phù hợp bối cảnh nội thất sang trọng.</p>",
    material: "Thạch cao gia cường",
    dimensions: "Cao 180cm",
    tags: ["tượng", "nội thất", "tân cổ điển"],
    isFeatured: true,
    sortOrder: 1,
    images: [
      image("https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80", 0, true, "Tượng nữ điêu khắc"),
      image("https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80", 1, false, "Chi tiết bề mặt tượng")
    ]
  },
  {
    name: "Phù điêu đầu rồng và linh vật",
    categoryName: "Điêu khắc bê tông",
    shortDescription: "Bộ phù điêu linh vật dùng cho cổng, tường rào, đền thờ và công trình tâm linh.",
    content:
      "<p>Chi tiết đầu rồng được xử lý nổi khối rõ khối, phù hợp môi trường ngoại thất và khu vực cần nhấn mạnh thị giác.</p>",
    material: "Bê tông mỹ thuật GFRC",
    dimensions: "Theo yêu cầu",
    tags: ["phù điêu", "linh vật", "ngoại thất"],
    isFeatured: true,
    sortOrder: 2,
    images: [
      image("https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=1200&q=80", 0, true, "Phù điêu đầu rồng"),
      image("https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=900&q=80", 1, false, "Linh vật ngoại thất")
    ]
  },
  {
    name: "Cột và phào chỉ mặt tiền tân cổ điển",
    categoryName: "Hoa văn công trình nhà ở",
    shortDescription: "Hệ cột, đầu cột, phào chỉ và hoa văn mặt tiền cho biệt thự và nhà phố cao cấp.",
    content:
      "<p>Giải pháp đồng bộ từ phào chỉ, đầu cột đến các ô cửa và khung vòm, tạo mặt tiền cân đối và sang trọng.</p>",
    material: "Bê tông đúc sẵn",
    dimensions: "Theo bản vẽ",
    tags: ["mặt tiền", "cột", "phào chỉ"],
    isFeatured: true,
    sortOrder: 3,
    images: [
      image("https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80", 0, true, "Cột công trình tân cổ điển"),
      image("https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80", 1, false, "Mặt tiền có hoa văn")
    ]
  },
  {
    name: "Hoa văn trang trí đình chùa",
    categoryName: "Hoa văn đình chùa",
    shortDescription: "Chi tiết hoa lá, vân mây, họa tiết cổ điển cho công trình tâm linh và không gian thờ tự.",
    content:
      "<p>Mẫu hoa văn được cân chỉnh theo bố cục kiến trúc đình chùa, đảm bảo sự tôn nghiêm và chi tiết thủ công sắc nét.</p>",
    material: "Bê tông mỹ thuật",
    dimensions: "Theo module",
    tags: ["đình chùa", "hoa văn", "tâm linh"],
    sortOrder: 4,
    images: [
      image("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80", 0, true, "Hoa văn đình chùa"),
      image("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80", 1, false, "Chi tiết họa tiết")
    ]
  },
  {
    name: "Cấu kiện bê tông đúc sẵn trang trí",
    categoryName: "Bê tông đúc sẵn",
    shortDescription: "Các module phào chỉ, đầu cột, phù điêu và chi tiết lắp ghép sản xuất đồng loạt.",
    content:
      "<p>Phù hợp các công trình cần tối ưu tiến độ và độ đồng đều của chi tiết trang trí lắp đặt ngoại thất.</p>",
    material: "GFRC và bê tông đúc sẵn",
    dimensions: "Theo module",
    tags: ["đúc sẵn", "module", "kiến trúc"],
    sortOrder: 5,
    images: [
      image("https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80", 0, true, "Cấu kiện đúc sẵn"),
      image("https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80", 1, false, "Chi tiết đúc sẵn")
    ]
  }
];

export const projectSeed = [
  {
    name: "Hoàn thiện mặt tiền biệt thự Phú Mỹ",
    categoryName: "Công trình hoàn thiện",
    shortDescription: "Thi công đồng bộ cột, phào chỉ, đầu cột và phù điêu cho biệt thự 3 tầng phong cách tân cổ điển.",
    content:
      "<p>Dự án bao gồm sản xuất module đúc sẵn, xử lý nổi khối phù điêu và lắp đặt hoàn thiện mặt tiền trong 45 ngày.</p>",
    location: "Quận 7, TP. Hồ Chí Minh",
    year: "2025",
    scope: "Mặt tiền, cột, vòm cửa, phào chỉ",
    isFeatured: true,
    sortOrder: 1,
    images: [
      image("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80", 0, true, "Biệt thự tân cổ điển"),
      image("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80", 1, false, "Mặt tiền chi tiết")
    ]
  },
  {
    name: "Cụm phù điêu và linh vật cổng đền thờ",
    categoryName: "Công trình hoàn thiện",
    shortDescription: "Lắp đặt cụm phù điêu và linh vật tại cổng vào chính cho một công trình tâm linh cấp tỉnh.",
    content:
      "<p>Các chi tiết được tạo khuôn, xử lý bề mặt và sơn hoàn thiện theo tổng màu kiến trúc truyền thống.</p>",
    location: "Tây Ninh",
    year: "2024",
    scope: "Cổng, phù điêu, linh vật",
    isFeatured: true,
    sortOrder: 2,
    images: [
      image("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80", 0, true, "Công trình tâm linh"),
      image("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80", 1, false, "Phù điêu linh vật")
    ]
  },
  {
    name: "Trang trí khu vui chơi chủ đề cổ tích",
    categoryName: "Dự án khu vui chơi",
    shortDescription: "Chế tác tượng, mô hình và phụ kiện trang trí cho khu vui chơi ngoài trời quy mô vừa.",
    content:
      "<p>Dự án cân bằng giữa yếu tố nghệ thuật và độ bền vận hành, sử dụng vật liệu phù hợp môi trường ngoại thất.</p>",
    location: "Bình Dương",
    year: "2025",
    scope: "Mô hình trang trí, phụ kiện, lắp đặt",
    sortOrder: 3,
    images: [
      image("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80", 0, true, "Khu vui chơi ngoài trời"),
      image("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80", 1, false, "Trang trí khu vui chơi")
    ]
  }
];

export const bannerSeed = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80",
    sortOrder: 1,
    isActive: true,
    isFeatured: true
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1800&q=80",
    sortOrder: 2,
    isActive: true,
    isFeatured: false
  }
];

export const categorySeed = [
  {
    type: "PRODUCT",
    name: "Điêu khắc thạch cao",
    description: "Tượng, phù điêu và chi tiết nội thất thạch cao.",
    isFeatured: true,
    sortOrder: 1
  },
  {
    type: "PRODUCT",
    name: "Điêu khắc bê tông",
    description: "Tác phẩm ngoại thất, linh vật và phù điêu bê tông.",
    isFeatured: true,
    sortOrder: 2
  },
  {
    type: "PRODUCT",
    name: "Hoa văn công trình nhà ở",
    description: "Mặt tiền, cột, vòm cửa và phào chỉ cho nhà ở, biệt thự.",
    isFeatured: true,
    sortOrder: 3
  },
  {
    type: "PRODUCT",
    name: "Hoa văn đình chùa",
    description: "Chi tiết hoa văn tâm linh cho đền thờ và đình chùa.",
    sortOrder: 4
  },
  {
    type: "PRODUCT",
    name: "Trang trí khu vui chơi",
    description: "Tượng và mô hình trang trí theo chủ đề.",
    sortOrder: 5
  },
  {
    type: "PRODUCT",
    name: "Bê tông đúc sẵn",
    description: "Cấu kiện và module đúc sẵn lắp ghép.",
    isFeatured: true,
    sortOrder: 6
  },
  {
    type: "PROJECT",
    name: "Công trình hoàn thiện",
    description: "Các dự án đã thi công và bàn giao thực tế.",
    sortOrder: 1
  },
  {
    type: "PROJECT",
    name: "Dự án khu vui chơi",
    description: "Công trình vui chơi, cảnh quan và trang trí chủ đề.",
    sortOrder: 2
  }
];

export const pageSeed = [
  {
    slug: "home",
    title: "Trang chủ",
    heroTitle: "Chế tác điêu khắc và hoa văn kiến trúc cao cấp",
    heroSubtitle: "Chuyên thiết kế, sản xuất và thi công các chi tiết kiến trúc tân cổ điển.",
    content:
      "<p>Xưởng điêu khắc của chúng tôi phục vụ nhà ở, biệt thự, đình chùa, khu vui chơi và các công trình quy mô lớn nhỏ.</p>",
    sections: homeSections,
    metaTitle: "Điêu khắc tân cổ điển cao cấp",
    metaDescription: "Trang chủ giới thiệu sản phẩm, công trình và năng lực thi công điêu khắc kiến trúc."
  },
  {
    slug: "about",
    title: "Giới thiệu",
    heroTitle: "Nơi hội tụ tay nghề thủ công và kỹ thuật thi công",
    heroSubtitle: "Đồng hành cùng các công trình cần đường nét điêu khắc tinh tế và bền vững.",
    content:
      "<p>Chúng tôi kết hợp đội ngũ nghệ nhân, kỹ sư khuôn đúc và thi công hiện trường để tạo nên hệ thống sản phẩm, phù điêu và hoa văn đồng bộ cho từng công trình.</p>",
    sections: aboutSections,
    metaTitle: "Giới thiệu xưởng điêu khắc",
    metaDescription: "Thông tin doanh nghiệp, tầm nhìn, sứ mệnh và năng lực chế tác thi công."
  }
];

export const makeSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
