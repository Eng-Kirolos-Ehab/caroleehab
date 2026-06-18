/*
  ===============================================================
   ملف محتوى موقع كارول - عدّلي هنا فقط
  ===============================================================
  مفيش حاجة في هذا الملف تحتاج خبرة برمجة. كل قسم عبارة عن قائمة
  بين أقواس مربعة [ ]، وكل عنصر بين أقواس معقوفة { } وبعده فاصلة.

  - لإضافة عمل جديد: انسخي عنصر كامل (من { إلى }) وغيري بياناته.
  - الصور: ضعي الصورة في فولدر images/ وخدي اسمها هنا بالشكل
    "images/اسم-الصورة.jpg"
  - أسهل طريقة للتعديل هي عن طريق صفحة admin.html المرفقة، وهي
    بتعدل هذا الملف تلقائيًا.
  ===============================================================
*/

const SITE_DATA = {
  "artist": {
    "name": "Carole Ehab Nabil",
    "nameAr": "كارول إيهاب نبيل",
    "title": "فنانة تشكيلية · مصممة نسيج · طالبة هندسة",
    "tagline": "من النسيج إلى الموضة، من الفحم إلى اللون — كل عمل يبدأ برسم يدوي وينتهي بقصة",
    "bio": "فنانة تشكيلية ومصممة نسيج في السنة الرابعة بكلية هندسة النسيج، جامعة بدر في القاهرة. متخصصة في تصميم الأنماط التكرارية، تصاميم الجاكار، الموضة السريالية، والطباعة المنزلية — كل أعمالها تبدأ برسم يدوي وتنتهي بتصميم يحكي قصة. حصلت على المركز الثالث في مسابقة الفنون الجامعية، وشاركت في معرض EgyStetch وعدة معارض فنية داخل الكلية. مشروع تخرجها يستلهم من السريالية ويجمع بين تصميم الأزياء والمفروشات في مجموعتين متكاملتين — كلتيهما منشورتان على الموقع.",
    "bioShort": "فنانة تشكيلية شغوفة بالنسيج، الفحم، والتفاصيل الصغيرة.",
    "photo": "images/work-123.jpg",
    "aboutPhoto": "images/work-124.jpg",
    "location": "السويس، مصر",
    "location_en": "Suez, Egypt",
    "title_en": "Textile Engineer & Visual Artist",
    "tagline_en": "From textiles to fashion, from charcoal to color — every work begins with a hand-drawn sketch.",
    "bio_en": "A textile engineering student in her fourth year at Badr University in Cairo (BUC), specializing in repeat pattern design, jacquard, surrealist fashion, and home printing. Her graduation project — two complete surrealist collections (upholstery + fashion) — is published on this portfolio. She won 3rd place in the university-wide arts competition, exhibited at EgyStetch, and received the Department Creative Certificate for excellence in hand-drawn artistic boards.",
    "email": "caroleeehab@gmail.com",
    "social": {
      "instagram": "https://www.instagram.com/carole_ehab?igsh=YjloYm8xcHY2MWdj",
      "facebook": "https://www.facebook.com/share/1J7XXx28Vj/",
      "behance": ""
    }
  },
  "categories": [
    {
      "id": "all",
      "label": "الكل",
      "label_en": "All"
    },
    {
      "id": "painting",
      "label": "لوحات زيتية وبورتريه",
      "label_en": "Oil Paintings & Portraits"
    },
    {
      "id": "charcoal",
      "label": "رسم بالفحم",
      "label_en": "Charcoal Drawing"
    },
    {
      "id": "bigworks",
      "label": "لوحات المعارض",
      "label_en": "Exhibition Paintings"
    },
    {
      "id": "sketchbook",
      "label": "سكتشات وتصاميم",
      "label_en": "Sketches & Design Studies"
    },
    {
      "id": "jacquard",
      "label": "تصاميم جاكار",
      "label_en": "Jacquard Designs"
    },
    {
      "id": "textile",
      "label": "نسيج وطباعة",
      "label_en": "Textiles & Printing"
    },
    {
      "id": "homeprint",
      "label": "طباعة منزلية",
      "label_en": "Home Printing"
    },
    {
      "id": "fashion",
      "label": "موضة سريالية",
      "label_en": "Surreal Fashion"
    },
    {
      "id": "factory",
      "label": "شغل المصنع",
      "label_en": "Factory Work"
    },
    {
      "id": "mixed",
      "label": "ميكس ميديا",
      "label_en": "Mixed Media"
    },
    {
      "id": "personal",
      "label": "لمساتي الخاصة",
      "label_en": "Personal Touches"
    }
  ],
  "works": [
    {
      "id": 2,
      "image": "images/work-106.jpg",
      "title": "بنت البادية",
      "category": "charcoal",
      "year": "2026",
      "description": "عمل بالفحم يحتفي بتفاصيل الوجه والملامح، مع لمسة من الحياة الصحراوية.",
      "featured": true,
      "title_en": "Bedouin Girl",
      "description_en": "A charcoal study focused on contrast, texture, facial expression, and light."
    },
    {
      "id": 1,
      "image": "images/work-070.jpg",
      "title": "لوحة اهل غزة",
      "category": "painting",
      "year": "2026",
      "description": "لوحة زيتية مستوحاة من مشهد يومي متكرر لاهالي غزة يعكس معاناتهم الدائمة و حقوقهم المهدورة و بيوتهم المدمره",
      "featured": true,
      "title_en": "People of Gaza",
      "description_en": "An expressive artwork exploring portraiture, emotion, and storytelling through painted detail."
    },
    {
      "id": 3,
      "image": "images/work-015.jpg",
      "title": "طبيعة صامتة - الإبريق",
      "category": "charcoal",
      "year": "2026",
      "description": "رسم بالفحم لتكوين من أدوات المطبخ والخضروات، يركّز على التدرجات والظل والنور.",
      "featured": false,
      "title_en": "Still Life - The Pitcher",
      "description_en": "A charcoal study focused on contrast, texture, facial expression, and light."
    },
    {
      "id": 4,
      "image": "images/work-118.jpg",
      "title": "وجوه",
      "category": "charcoal",
      "year": "2026",
      "description": "مجموعة بورتريهات بالفحم، كل وجه يحمل تعبيره وقصته الخاصة.",
      "featured": true,
      "title_en": "Faces",
      "description_en": "A charcoal study focused on contrast, texture, facial expression, and light."
    },
    {
      "id": 5,
      "image": "images/work-001.jpg",
      "title": "عالم تحت الماء",
      "category": "mixed",
      "year": "2026",
      "description": "عمل ميكس ميديا يجمع بين الرسم والكولاج والخامات المختلفة في تكوين بحري حيوي.",
      "featured": true,
      "title_en": "Underwater World",
      "description_en": "A mixed-media work combining drawing, collage, texture, and layered visual storytelling."
    },
    {
      "id": 6,
      "image": "images/work-017.jpg",
      "title": "أوراق الخريف",
      "category": "homeprint",
      "year": "2026",
      "description": "تصميم طباعة متكرر (Seamless Pattern) مستوحى من أوراق الشجر، مناسب للأقمشة والمنتجات المنزلية.",
      "featured": false,
      "title_en": "Autumn Leaves",
      "description_en": "A home-printing pattern designed for interiors, fabrics, and decorative surfaces."
    },
    {
      "id": 7,
      "image": "images/work-063.jpg",
      "title": "توت وصنوبر",
      "category": "jacquard",
      "year": "2026",
      "description": "نمط جاكار بكونسبت كريسماس — التوت الأحمر والصنوبر الأخضر في هارمونية نسيج دافئة.",
      "featured": false,
      "title_en": "Berries and Pine",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 8,
      "image": "images/work-027.jpg",
      "title": "جاكار كاروهات - أخضر",
      "category": "jacquard",
      "year": "2026",
      "description": "تصميم نسيج جاكار Tartan/Check تم تطويره باستخدام برامج تصميم الأنسجة المتخصصة.",
      "featured": false,
      "title_en": "Green Check Jacquard",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 9,
      "image": "images/work-049.jpg",
      "title": "جاكار كاروهات - دفء",
      "category": "jacquard",
      "year": "2026",
      "description": "تصميم جاكار بدرجات الأحمر والبني، دراسة في توافق الألوان الدافئة وتأثيرها على تصميم الأقمشة.",
      "featured": false,
      "title_en": "Warm Check Jacquard",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 10,
      "image": "images/work-075.jpg",
      "title": "رسم على جراب موبايل",
      "category": "personal",
      "year": "2026",
      "description": "جراب موبايل مرسوم بالكامل باليد بشخصيات وألوان زاهية — لمستي الخاصة على شيء عادي.",
      "featured": false,
      "title_en": "Hand-Painted Phone Case",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 11,
      "image": "images/work-099.jpg",
      "title": "ميداليات الساعات الذائبة",
      "category": "personal",
      "year": "2026",
      "description": "مجموعة ميداليات (كي تشينز) مستوحاة من الساعات الذائبة لسالفادور دالي، مصنوعة ومرسومة يدويًا.",
      "featured": false,
      "title_en": "Melting Clock Keychains",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 12,
      "image": "images/work-111.jpg",
      "title": "مجسم معدات النسيج",
      "category": "factory",
      "year": "2026",
      "description": "مجسم تجريبي يحاكي معدات النسيج التقليدية، منفّذ يدويًا كجزء من مشروع تصميم النسيج.",
      "featured": false,
      "title_en": "Textile Equipment Model",
      "description_en": "A practical textile-engineering piece connected to factory planning, equipment, or production workflow."
    },
    {
      "id": 13,
      "image": "images/work-087.jpg",
      "title": "دفتر تصميم - أزياء وأنماط",
      "category": "sketchbook",
      "year": "2026",
      "description": "صفحة من دفتر التصميم تجمع بين رسومات الأزياء ودراسة الأنماط والألوان.",
      "featured": false,
      "title_en": "Design Notebook - Fashion and Patterns",
      "description_en": "A design study page documenting ideas, structure, color, and visual research."
    },
    {
      "id": 14,
      "image": "images/work-003.jpg",
      "title": "دفتر تصميم - الخطوط",
      "category": "sketchbook",
      "year": "2026",
      "description": "صفحة بحث بصري عن أنواع الخطوط (Stripes) وتأثيرها على تصميم الملابس.",
      "featured": false,
      "title_en": "Design Notebook - Lines",
      "description_en": "A design study page documenting ideas, structure, color, and visual research."
    },
    {
      "id": 15,
      "image": "images/work-010.jpg",
      "title": "دفتر تصميم - الكاروهات",
      "category": "sketchbook",
      "year": "2026",
      "description": "صفحة بحث عن أنماط الكاروهات (Tartan/Check) ومصادرها التاريخية، مع عينات أقمشة حقيقية.",
      "featured": false,
      "title_en": "Design Notebook - Checks",
      "description_en": "A design study page documenting ideas, structure, color, and visual research."
    },
    {
      "id": 16,
      "image": "images/work-077.jpg",
      "title": "طبيعة صامتة - الإبريق والكتب",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة زيتية كبيرة تجمع بين الإبريق والكتب والقماش — دراسة أكاديمية في التدرجات الدافئة والتكوين الكلاسيكي.",
      "featured": true,
      "title_en": "Still Life - Pitcher and Books",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 17,
      "image": "images/work-071.jpg",
      "title": "أمومة في زمن الحرب",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة زيتية معبّرة تصور امرأة وأطفالها وسط الأنقاض — عمل شارك في معرض فني ولامس قلوب الجمهور.",
      "featured": true,
      "title_en": "Motherhood in Wartime",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 18,
      "image": "images/work-078.jpg",
      "title": "طبيعة صامتة - الزجاجة الزرقاء",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة زيتية بألوان برودة جميلة؛ زجاجة وإبريق أزرق على خلفية وردية هادئة.",
      "featured": false,
      "title_en": "Still Life - Blue Bottle",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 19,
      "image": "images/work-079.jpg",
      "title": "طبيعة صامتة - الخبز والطنجرة",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة زيتية بأجواء منزلية دافئة — طنجرة وخبز وسكين على قماش مخطط في ضوء هادئ.",
      "featured": false,
      "title_en": "Still Life - Bread and Pot",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 20,
      "image": "images/work-082.jpg",
      "title": "طبيعة صامتة - البرتقالي والأزرق",
      "category": "bigworks",
      "year": "2025",
      "description": "تناقض مشرق بين وعاء برتقالي وإبريق أزرق على خلفية مزخرفة — دراسة في التضاد اللوني.",
      "featured": false,
      "title_en": "Still Life - Orange and Blue",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 21,
      "image": "images/work-083.jpg",
      "title": "طبيعة صامتة - الجرة الفرعونية",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة زيتية تجمع بين جرة فرعونية وخضروات طازجة — تلاقي التراث والحياة اليومية.",
      "featured": false,
      "title_en": "Still Life - Pharaonic Jar",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 22,
      "image": "images/work-033.jpg",
      "title": "بورتريه بالباستيل",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة بورتريه بألوان الباستيل لامرأة بتاج ووشاح — تجسيد للأناقة والكياسة بألوان دافئة.",
      "featured": false,
      "title_en": "Pastel Portrait",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 23,
      "image": "images/work-068.jpg",
      "title": "بورتريه كلاسيكي",
      "category": "bigworks",
      "year": "2025",
      "description": "بورتريه فتاة بالألوان الزيتية الكلاسيكية، بأسلوب يستحضر عبق لوحات عصر النهضة.",
      "featured": false,
      "title_en": "Classic Portrait",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 24,
      "image": "images/work-101.jpg",
      "title": "مقهى الفيشاوي",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة فحم ضخمة ترصد أجواء مقهى الفيشاوي العريق في القاهرة — وجوه ومشاعر وحكايات.",
      "featured": false,
      "title_en": "El Fishawy Cafe",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 25,
      "image": "images/work-102.jpg",
      "title": "البدوية الضاحكة",
      "category": "bigworks",
      "year": "2025",
      "description": "لوحة فحم لسيدة بدوية تضحك بتلقائية مع جمالها — لحظة إنسانية أصيلة خُلّدت بالفحم.",
      "featured": false,
      "title_en": "The Laughing Bedouin Woman",
      "description_en": "A large exhibition piece built around composition, atmosphere, and academic drawing practice."
    },
    {
      "id": 26,
      "image": "images/work-011.jpg",
      "title": "دراسة بالرصاص - الإبريق والقماش",
      "category": "sketchbook",
      "year": "2025",
      "description": "رسم تخطيطي بالقلم الرصاص لتكوين من الإبريق والقماش — دراسة في المنظور والظل والنور.",
      "featured": false,
      "title_en": "Pencil Study - Pitcher and Fabric",
      "description_en": "A design study page documenting ideas, structure, color, and visual research."
    },
    {
      "id": 27,
      "image": "images/work-014.jpg",
      "title": "دراسة بالرصاص - الزجاجة والفواكه",
      "category": "sketchbook",
      "year": "2025",
      "description": "سكتش بالرصاص لزجاجة نبيذ وموز وسكين — تمرين في الواقعية وتقنية التظليل الدقيق.",
      "featured": false,
      "title_en": "Pencil Study - Bottle and Fruit",
      "description_en": "A design study page documenting ideas, structure, color, and visual research."
    },
    {
      "id": 28,
      "image": "images/work-112.jpg",
      "title": "دراسة بالرصاص - الإبريق والنظارة",
      "category": "sketchbook",
      "year": "2025",
      "description": "طبيعة صامتة بالرصاص تجمع إبريقًا وفواكه ونظارة — تفاصيل دقيقة وتظليل ناعم.",
      "featured": false,
      "title_en": "Pencil Study - Pitcher and Glasses",
      "description_en": "A design study page documenting ideas, structure, color, and visual research."
    },
    {
      "id": 29,
      "image": "images/work-021.jpg",
      "title": "جاكار كريسماس - التوت والصنوبر",
      "category": "jacquard",
      "year": "2025",
      "description": "تصميم جاكار بكونسبت كريسماس — أوراق الصنوبر وحبات التوت الحمراء في نسيج دافئ ومتكرر يبث أجواء الشتاء.",
      "featured": true,
      "title_en": "Christmas Jacquard - Berries and Pine",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 30,
      "image": "images/work-064.jpg",
      "title": "جاكار أطلانتس - نقشة النيل",
      "category": "jacquard",
      "year": "2025",
      "description": "تصميم جاكار بنقشة فرعونية مستوحاة من النيل والتراث المصري القديم — أزرق جينز عميق يحكي حضارة ما تحت الماء.",
      "featured": true,
      "title_en": "Atlantis Jacquard - Nile Motif",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 31,
      "image": "images/work-065.jpg",
      "title": "جاكار مصري - الهيروغليفية",
      "category": "jacquard",
      "year": "2025",
      "description": "نقشة جاكار بألوان رمادية وزرقاء مستوحاة من الآثار المصرية والكتابة الهيروغليفية.",
      "featured": false,
      "title_en": "Egyptian Jacquard - Hieroglyphics",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 32,
      "image": "images/work-066.jpg",
      "title": "جاكار مصري - الرموز الفرعونية",
      "category": "jacquard",
      "year": "2025",
      "description": "تصميم جاكار بأزرق غامق يحتضن رموزًا فرعونية كالعين والخنفساء — أطلانتس بلمسة مصرية أصيلة.",
      "featured": false,
      "title_en": "Egyptian Jacquard - Pharaonic Symbols",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 33,
      "image": "images/work-116.jpg",
      "title": "جاكار تركواز - موجات البحر",
      "category": "jacquard",
      "year": "2025",
      "description": "نسيج جاكار بألوان التركواز والأزرق والأبيض يستحضر هدوء موجات البحر وعالم أطلانتس.",
      "featured": false,
      "title_en": "Turquoise Jacquard - Sea Waves",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 34,
      "image": "images/work-119.jpg",
      "title": "جاكار شتوي - التوت والأوراق",
      "category": "jacquard",
      "year": "2025",
      "description": "نمط جاكار بدرجات البني والكراميل الدافئة مع أوراق شتوية — كونسبت كريسماس بمزاج رومانسي هادئ.",
      "featured": false,
      "title_en": "Winter Jacquard - Berries and Leaves",
      "description_en": "A jacquard textile concept developed through repeat motifs, color harmony, and fabric thinking."
    },
    {
      "id": 35,
      "image": "images/work-005.jpg",
      "title": "نسيج يدوي على النول - وردي وبيج",
      "category": "textile",
      "year": "2025",
      "description": "نسيج يدوي على النول الشخصي بتناسق جميل بين الوردي والبيج والبني — شغل يدوي أصيل يمزج الألوان بحرفية.",
      "featured": false,
      "title_en": "Hand Weaving on Loom - Pink and Beige",
      "description_en": "A textile work that highlights handcraft, material exploration, and woven structure."
    },
    {
      "id": 36,
      "image": "images/work-016.jpg",
      "title": "نسيج يدوي على النول - رمادي",
      "category": "textile",
      "year": "2025",
      "description": "نسيج يدوي متكامل بدرجات الوردي والبيج والرمادي — إتقان تقنية النسج اليدوي التقليدي.",
      "featured": false,
      "title_en": "Hand Weaving on Loom - Gray",
      "description_en": "A textile work that highlights handcraft, material exploration, and woven structure."
    },
    {
      "id": 37,
      "image": "images/work-019.jpg",
      "title": "ورق جداري نباتي",
      "category": "homeprint",
      "year": "2025",
      "description": "تصميم طباعة لورق الجدار بأوراق نباتية خضراء على خلفية رمادية غامقة — أناقة طبيعية للمنزل.",
      "featured": true,
      "title_en": "Botanical Wallpaper",
      "description_en": "A home-printing pattern designed for interiors, fabrics, and decorative surfaces."
    },
    {
      "id": 38,
      "image": "images/work-051.jpg",
      "title": "طبعة نباتية شتوية",
      "category": "homeprint",
      "year": "2025",
      "description": "نقشة طباعة بألوان خضراء وذهبية بطابع شتوي دافئ، مناسبة للستائر والمفروشات الراقية.",
      "featured": false,
      "title_en": "Winter Botanical Print",
      "description_en": "A home-printing pattern designed for interiors, fabrics, and decorative surfaces."
    },
    {
      "id": 39,
      "image": "images/work-067.jpg",
      "title": "أزهار زرقاء داكنة",
      "category": "homeprint",
      "year": "2025",
      "description": "نقشة طباعة قماش بأزهار زرقاء وخضراء على خلفية كحلية داكنة — فخامة لمفروشات الصالون.",
      "featured": false,
      "title_en": "Dark Blue Flowers",
      "description_en": "A home-printing pattern designed for interiors, fabrics, and decorative surfaces."
    },
    {
      "id": 40,
      "image": "images/work-120.jpg",
      "title": "نقشة ذهبية نباتية",
      "category": "homeprint",
      "year": "2025",
      "description": "ورق جداري بنقشة نباتية ذهبية على خلفية كحلية — تصميم فاخر للمساحات الراقية.",
      "featured": false,
      "title_en": "Golden Botanical Pattern",
      "description_en": "A home-printing pattern designed for interiors, fabrics, and decorative surfaces."
    },
    {
      "id": 41,
      "image": "images/work-062.jpg",
      "title": "سريالية الموضة",
      "category": "fashion",
      "year": "2025",
      "description": "لوحة موضة سريالية تمزج بين الفن والتصميم بأسلوب عصري جريء — الموضة كفن لا حدود له.",
      "featured": true,
      "title_en": "Surreal Fashion",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 42,
      "image": "images/work-098.jpg",
      "title": "غلاف مجلة سرّيفا",
      "category": "fashion",
      "year": "2025",
      "description": "غلاف المجلة الفنية 'سرّيفا' الذي يعرض تصميم أزياء كارول — حضور مميز في عالم الموضة المصرية.",
      "featured": false,
      "title_en": "Sereva Magazine Cover",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 43,
      "image": "images/work-030.jpg",
      "title": "أزياء من الحضارة الفرعونية",
      "category": "fashion",
      "year": "2025",
      "description": "عرض تصميم أزياء مستوحى من الرموز المصرية القديمة بألوان زرقاء سريالية عصرية.",
      "featured": false,
      "title_en": "Fashion Inspired by Ancient Egypt",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 44,
      "image": "images/work-084.jpg",
      "title": "سكتشات أزياء - ألوان مائية",
      "category": "fashion",
      "year": "2025",
      "description": "صفحة سكتشات أزياء بألوان مائية زاهية مع دراسة نظرية الألوان ودولاب الألوان.",
      "featured": false,
      "title_en": "Fashion Sketches - Watercolor",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 45,
      "image": "images/work-085.jpg",
      "title": "سكتش أزياء - الأنماط الهندسية",
      "category": "fashion",
      "year": "2025",
      "description": "سكتش أزياء بألوان زاهية ببنطلون أنماط هندسية ملونة — إبداع في تصميم الأزياء العصرية.",
      "featured": false,
      "title_en": "Fashion Sketch - Geometric Patterns",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 46,
      "image": "images/work-086.jpg",
      "title": "سكتشات أزياء - أبيض وأسود",
      "category": "fashion",
      "year": "2025",
      "description": "صفحة سكتشات أزياء بأنماط هندسية بالأبيض والأسود والأحمر — قوة التصميم بلا ألوان زائدة.",
      "featured": false,
      "title_en": "Fashion Sketches - Black and White",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 47,
      "image": "images/work-088.jpg",
      "title": "أزياء ونظرية الألوان",
      "category": "fashion",
      "year": "2025",
      "description": "دراسة تصميم أزياء بنظرية الألوان: تكامل، انقسام، ثلاثي — العلم والجماليات في صفحة واحدة.",
      "featured": false,
      "title_en": "Fashion and Color Theory",
      "description_en": "A surreal fashion concept combining illustration, fabric ideas, and artistic styling."
    },
    {
      "id": 48,
      "image": "images/work-107.jpg",
      "title": "مجسم ماكينة النسيج",
      "category": "factory",
      "year": "2025",
      "description": "نموذج خشبي مصغر لماكينة النسيج منفّذ يدويًا — مجسم دقيق يعكس فهمًا عميقًا لمعدات المصنع.",
      "featured": true,
      "title_en": "Textile Machine Model",
      "description_en": "A practical textile-engineering piece connected to factory planning, equipment, or production workflow."
    },
    {
      "id": 49,
      "image": "images/work-108.jpg",
      "title": "مخطط توزيع المصنع",
      "category": "factory",
      "year": "2025",
      "description": "مخطط هندسي لتوزيع أقسام مصنع النسيج — تصميم المساحة والعرض داخل بيئة المصنع.",
      "featured": false,
      "title_en": "Factory Layout Plan",
      "description_en": "A practical textile-engineering piece connected to factory planning, equipment, or production workflow."
    },
    {
      "id": 50,
      "image": "images/work-024.jpg",
      "title": "تخطيط منطقة التحضير",
      "category": "factory",
      "year": "2025",
      "description": "رسم تخطيطي دقيق لتصميم منطقة التحضير في المصنع — تخطيط وظيفي وجمالي للمساحة.",
      "featured": false,
      "title_en": "Preparation Area Layout",
      "description_en": "A practical textile-engineering piece connected to factory planning, equipment, or production workflow."
    },
    {
      "id": 51,
      "image": "images/work-050.jpg",
      "title": "ورشة الطباعة اليدوية",
      "category": "factory",
      "year": "2025",
      "description": "تجهيز شاشات الطباعة اليدوية في الورشة — خطوة عملية في دورة إنتاج الأقمشة المطبوعة.",
      "featured": false,
      "title_en": "Hand Printing Workshop",
      "description_en": "A practical textile-engineering piece connected to factory planning, equipment, or production workflow."
    },
    {
      "id": 52,
      "image": "images/work-080.jpg",
      "title": "تصميم نسيج مخطط",
      "category": "factory",
      "year": "2025",
      "description": "تصميم نسيج بخطوط رأسية زرقاء وفيروزية وكحلية متكررة — سيريز جاهز للإنتاج في المصنع.",
      "featured": false,
      "title_en": "Striped Textile Design",
      "description_en": "A practical textile-engineering piece connected to factory planning, equipment, or production workflow."
    },
    {
      "id": 53,
      "image": "images/work-076.jpg",
      "title": "موبايل كيس - ليلة النجوم",
      "category": "personal",
      "year": "2025",
      "description": "غلاف موبايل مرسوم بأسلوب 'ليلة النجوم' لفان جوخ بألوان زرقاء مذهلة — فن الماسترز على يومياتك.",
      "featured": true,
      "title_en": "Phone Case - Starry Night",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 54,
      "image": "images/work-026.jpg",
      "title": "فستان جينز - لمستي",
      "category": "personal",
      "year": "2025",
      "description": "فستان جينز مطبوع برسومات يدوية أزرق وأبيض — تحويل قطعة ملابس عادية لعمل فني مميز.",
      "featured": false,
      "title_en": "Denim Dress - My Touch",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 55,
      "image": "images/work-028.jpg",
      "title": "فستان جينز - تايداي",
      "category": "personal",
      "year": "2025",
      "description": "فستان جينز مرسوم بنقشات يدوية بأسلوب تايداي — كل خطوة فيه برؤية ولمسة شخصية.",
      "featured": false,
      "title_en": "Denim Dress - Tie-Dye",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 56,
      "image": "images/work-090.jpg",
      "title": "منحوتة الساعة الذائبة",
      "category": "personal",
      "year": "2025",
      "description": "منحوتة يدوية مستوحاة من الساعات الذائبة لسالفادور دالي بألوان فيروزية وذهبية — السريالية بين يدين.",
      "featured": false,
      "title_en": "Melting Clock Sculpture",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 57,
      "image": "images/work-097.jpg",
      "title": "الساعة الذائبة وأوشحتي",
      "category": "personal",
      "year": "2025",
      "description": "منحوتة الساعة الذائبة الفيروزية بجانب أوشحة مطبوعة — عرض يجمع عملين إبداعيين في لقطة واحدة.",
      "featured": false,
      "title_en": "Melting Clock and Scarves",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 58,
      "image": "images/work-117.jpg",
      "title": "لوحة مطرزة - مطربة وبرج",
      "category": "personal",
      "year": "2025",
      "description": "لوحة جدارية مطرزة بالأسود والأبيض لمطربة وبرج — التطريز كأداة فنية للتعبير والسرد البصري.",
      "featured": false,
      "title_en": "Embroidered Panel - Singer and Tower",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    },
    {
      "id": 59,
      "image": "images/work-121.jpg",
      "title": "لوحة مطرزة - صوت الميكروفون",
      "category": "personal",
      "year": "2025",
      "description": "لوحة مطرزة بالأسود والأبيض لشخصية على ميكروفون — قوة التعبير والتفاصيل الدقيقة في التطريز.",
      "featured": false,
      "title_en": "Embroidered Panel - Microphone Voice",
      "description_en": "A handmade personal piece that turns an everyday object into a small artwork."
    }
  ],
  "events": [
    {
      "id": 1,
      "image": "images/work-037.jpg",
      "title": "معرض فني جماعي",
      "date": "2026",
      "location": "القاهرة",
      "description": "عرض مجموعة من الأعمال الفنية ضمن معرض جماعي، بحضور جمهور وفنانين من مختلف المجالات.",
      "title_en": "Group Art Exhibition",
      "location_en": "Cairo",
      "description_en": "A featured event from Carole's artistic and textile journey, presenting selected work to an audience of artists, students, and guests."
    },
    {
      "id": 2,
      "image": "images/work-122.jpg",
      "title": "معرض برنامج التكستيل - بشرة خير",
      "date": "2025",
      "location": "القاهرة",
      "description": "مشاركة في معرض برنامج التكستيل بعمل نسيجي ضخم بعنوان 'بشرة خير' — جاكار يصور الهوية المصرية بأسلوب فني معاصر.",
      "title_en": "Textile Program Exhibition - Boshret Kheir",
      "location_en": "Cairo",
      "description_en": "A featured event from Carole's artistic and textile journey, presenting selected work to an audience of artists, students, and guests."
    },
    {
      "id": 3,
      "image": "images/work-022.jpg",
      "title": "تكريم برنامج تدريب صناعة النسيج",
      "date": "2025",
      "location": "القاهرة",
      "description": "تكريم من المدربين في ختام برنامج تدريبي متخصص في صناعة النسيج — احتفال بإنجاز مرحلة مهارية متقدمة.",
      "title_en": "Textile Industry Training Ceremony",
      "location_en": "Cairo",
      "description_en": "A featured event from Carole's artistic and textile journey, presenting selected work to an audience of artists, students, and guests."
    },
    {
      "id": 4,
      "image": "images/work-093.jpg",
      "title": "معرض لوحات الفحم",
      "date": "2025",
      "location": "القاهرة",
      "description": "معرض فني يضم مجموعة من لوحات الفحم الكبيرة — لحظة مميزة بين الفنانة وأعمالها في فضاء المعرض.",
      "title_en": "Charcoal Paintings Exhibition",
      "location_en": "Cairo",
      "description_en": "A featured event from Carole's artistic and textile journey, presenting selected work to an audience of artists, students, and guests."
    }
  ],
  "process": [
    {
      "id": 1,
      "image": "images/work-001.jpg",
      "title": "الفكرة والإلهام",
      "description": "كل عمل بيبدأ بلحظة... فكرة بسيطة، مشهد، ذكرى أو حتى لون يفضل في بالي. بقعد أجمع مراجع وأسكتشات سريعة لحد ما تتكوّن الفكرة في دماغي بشكل أوضح.",
      "title_en": "Idea and Inspiration",
      "description_en": "Every work begins with a moment: a simple idea, a scene, a memory, or even a color that stays in mind. I collect references and quick sketches until the concept becomes clear."
    },
    {
      "id": 2,
      "image": "images/work-011.jpg",
      "title": "المسودة والتخطيط",
      "description": "بعد ما تتحدد الفكرة، بترجمها على الورق في رسومات تخطيطية (Sketches) بالرصاص، بحدد التكوين العام، الخطوط الأساسية، وتوزيع العناصر قبل ما أبدأ في العمل النهائي.",
      "title_en": "Drafting and Planning",
      "description_en": "Once the idea is set, I translate it onto paper through pencil sketches, defining composition, structure, and main lines before starting the final piece."
    },
    {
      "id": 3,
      "image": "images/work-021.jpg",
      "title": "بناء التكوين والألوان",
      "description": "هنا تبدأ المرحلة الأطول... بناء الطبقات، اختيار الخامات والألوان المناسبة، وتجربة تأثيرات مختلفة لحد ما أوصل للإحساس اللي عاوزة أوصّله.",
      "title_en": "Building Composition and Color",
      "description_en": "This is the longest stage: building layers, choosing materials and colors, and testing effects until the work reaches the feeling I want to express."
    },
    {
      "id": 4,
      "image": "images/work-077.jpg",
      "title": "اللوحة النهائية",
      "description": "آخر لمسات، تدقيق التفاصيل، وتوقيع العمل. كل لوحة بتاخد جزء من وقتي وإحساسي، وآخر مرحلة دايمًا بتكون أحلى لحظة... لما أشوف الفكرة بقت حقيقة.",
      "title_en": "The Final Artwork",
      "description_en": "The last touches, refined details, and signature. Every piece carries part of my time and feeling, and seeing the idea become real is always the best moment."
    }
  ],
  "magazines": [
    {
      "id": 1,
      "title": "مجلة الأزياء السريالية",
      "description": "تصاميم أزياء عصرية بأسلوب سريالي مبتكر — مجلة تفاعلية تجمع بين الموضة والفن بلمسة كارول الخاصة. اقلبي الصفحات واستكشفي عالمًا من الأزياء الجريئة.",
      "embedUrl": "https://online.fliphtml5.com/rkhbb/dkad/",
      "cover": "images/work-098.jpg",
      "featured": true,
      "tag": "موضة سريالية",
      "title_en": "Surreal Fashion Magazine",
      "description_en": "Modern fashion designs with an innovative surrealist style, combining fashion and art with Carole's personal touch.",
      "tag_en": "Surreal Fashion"
    },
    {
      "id": 2,
      "title": "جاكار كريسماس",
      "description": "مجلة تصاميم نسيج جاكار بكونسبت كريسماس — أنماط التوت والصنوبر والألوان الدافئة في هارمونية ساحرة. تصاميم مخصصة للنسيج الجاكارد الفاخر.",
      "embedUrl": "https://online.fliphtml5.com/pmqou/cueu/",
      "cover": "images/work-021.jpg",
      "featured": false,
      "tag": "جاكار — كريسماس",
      "title_en": "Christmas Jacquard",
      "description_en": "Jacquard textile designs built around a Christmas concept: berries, pine, and warm colors in rich fabric harmony.",
      "tag_en": "Jacquard - Christmas"
    },
    {
      "id": 3,
      "title": "جاكار أطلانتس والبحر",
      "description": "نقشات جاكار مستوحاة من عالم البحر والأعماق ورموز الحضارة المصرية القديمة — ألوان المياه الفيروزية في تصميم جاكار عميق وفريد.",
      "embedUrl": "https://online.fliphtml5.com/pmqou/trdw/",
      "cover": "images/work-116.jpg",
      "featured": false,
      "tag": "جاكار — أطلانتس",
      "title_en": "Atlantis and the Sea Jacquard",
      "description_en": "Jacquard patterns inspired by the sea, underwater worlds, and ancient Egyptian symbols in deep aquatic colors.",
      "tag_en": "Jacquard - Atlantis"
    },
    {
      "id": 4,
      "title": "مجلة الطباعة المنزلية",
      "description": "تصاميم طباعة للمفروشات والستائر والأثاث المنزلي — نقشات نباتية وهندسية أنيقة تجعل بيتك لوحة فنية متكاملة.",
      "embedUrl": "https://online.fliphtml5.com/pmqou/okgf/",
      "cover": "images/work-019.jpg",
      "featured": false,
      "tag": "طباعة منزلية",
      "title_en": "Home Printing Magazine",
      "description_en": "Print designs for upholstery, curtains, and home decor, turning interiors into expressive visual compositions.",
      "tag_en": "Home Printing"
    }
  ],
  "quotes": [
    {
      "text": "كل لوحة بالنسبالي قصة... وكل خط فيها له معنى.",
      "author": "كارول",
      "text_en": "Every artwork is a story to me, and every line has meaning.",
      "author_en": "Carole"
    },
    {
      "text": "الفن مش بس شكل جميل، الفن إحساس بيتحول لصورة.",
      "author": "كارول",
      "text_en": "Art is not only a beautiful form; it is a feeling turned into an image.",
      "author_en": "Carole"
    },
    {
      "text": "بحب ارسم على أي حاجة حواليا — كل شيء ممكن يبقى لوحة.",
      "author": "كارول",
      "text_en": "I love drawing on anything around me. Everything can become a canvas.",
      "author_en": "Carole"
    },
    {
      "text": "بحب أجرب كل خامة وكل أسلوب... عشان أكتشف نفسي أكتر.",
      "author": "كارول",
      "text_en": "I love trying every material and every style so I can discover myself more.",
      "author_en": "Carole"
    }
  ],
  "texts": {
    "nav": {
      "home": "الرئيسية",
      "about": "عن الفنانة",
      "gallery": "الأعمال",
      "process": "رحلة العمل",
      "magazines": "المجلات",
      "events": "الفعاليات",
      "contact": "تواصل"
    },
    "hero": {
      "ctaPrimary": "استعرضي الأعمال",
      "ctaSecondary": "تعرفي عليها",
      "ctaCv": "تحميل السيرة الذاتية"
    },
    "about": {
      "eyebrow": "عن الفنانة",
      "heading": "رحلة بين الخط واللون والقماش",
      "quote": "بحب إن كل تفصيلة صغيرة في شغلي تحمل جزء من إحساسي."
    },
    "featured": {
      "eyebrow": "مختارات",
      "heading": "أعمال مميزة"
    },
    "process": {
      "eyebrow": "كيف تولد اللوحة",
      "heading": "رحلة العمل",
      "description": "من أول فكرة في الدماغ، لحد ما توصل اللوحة لشكلها النهائي — كل مرحلة ليها حكايتها."
    },
    "gallery": {
      "eyebrow": "المعرض",
      "heading": "كل الأعمال",
      "description": "لوحات معارض، تصاميم جاكار، موضة سريالية، شغل مصنع، ولمساتها الخاصة — اختاري التصنيف واستكشفي."
    },
    "magazineBanner": {
      "title": "٤ مجلات تفاعلية",
      "description": "جاكار كريسماس، جاكار أطلانتس، طباعة منزلية، وموضة سريالية — اقلبي الصفحات واستكشفي"
    },
    "magazines": {
      "eyebrow": "مجلات تفاعلية",
      "heading": "٤ مجلات … ٤ عوالم مختلفة",
      "description": "جاكار كريسماس، جاكار أطلانتس والبحر، طباعة منزلية، وموضة سريالية — كل مجلة عالم مستقل بكونسبت مختلف. اقلبي الصفحات واستكشفي.",
      "badge": "المجلة الأبرز",
      "openLink": "فتح في صفحة كاملة ↗"
    },
    "events": {
      "eyebrow": "الفعاليات",
      "heading": "المعارض والفعاليات"
    },
    "footer": {
      "eyebrow": "تواصل",
      "heading": "يلا نتكلم عن فكرتك",
      "description": "لأي تعاون فني، طلب عمل خاص، أو دعوة لمعرض — تقدري تتواصلي معايا من خلال:",
      "contactButton": "راسليني",
      "note": "جميع الحقوق محفوظة"
    }
  },
  "texts_en": {
    "nav": {
      "home": "Home",
      "about": "About",
      "gallery": "Works",
      "process": "Journey",
      "magazines": "Magazines",
      "events": "Events",
      "contact": "Contact"
    },
    "hero": {
      "ctaPrimary": "Browse Works",
      "ctaSecondary": "About Me",
      "ctaCv": "Download CV"
    },
    "about": {
      "eyebrow": "About the Artist",
      "heading": "Where Textiles Meet Art",
      "quote": "I love that every small detail in my work carries a piece of my feeling."
    },
    "featured": {
      "eyebrow": "Selected",
      "heading": "Featured Works"
    },
    "process": {
      "eyebrow": "How a piece is born",
      "heading": "The Creative Journey",
      "description": "From the first idea in mind, to the finished piece — each stage has its own story."
    },
    "gallery": {
      "eyebrow": "Gallery",
      "heading": "All Works",
      "description": "Exhibition paintings, jacquard designs, surrealist fashion, factory work, and personal touches — choose a category to explore."
    },
    "magazines": {
      "eyebrow": "Interactive Magazines",
      "heading": "4 Magazines · 4 Worlds",
      "description": "Jacquard Christmas, Jacquard Atlantis, Home Printing, and Surrealist Fashion — flip through the pages and explore.",
      "badge": "Featured",
      "openLink": "Open Magazine ↗"
    },
    "events": {
      "eyebrow": "Events",
      "heading": "Exhibitions & Events"
    },
    "footer": {
      "eyebrow": "Contact",
      "heading": "Let's Talk About Your Idea",
      "description": "For any artistic collaboration, custom work, or exhibition invitation — reach out:",
      "contactButton": "Message Me",
      "note": "All rights reserved"
    }
  },
  "sectionOrder": [
    "about",
    "motion-film",
    "mag-1",
    "featured",
    "mag-2",
    "process",
    "gallery",
    "mag-3",
    "events",
    "mag-4",
    "quotes"
  ],
  "imageMeta": {
    "images/work-001.jpg": {
      "width": 1200,
      "height": 1599
    },
    "images/work-002.jpg": {
      "width": 1600,
      "height": 1137
    },
    "images/work-003.jpg": {
      "width": 1600,
      "height": 949
    },
    "images/work-004.jpg": {
      "width": 1600,
      "height": 1102
    },
    "images/work-005.jpg": {
      "width": 1200,
      "height": 1599
    },
    "images/work-006.jpg": {
      "width": 1600,
      "height": 1128
    },
    "images/work-007.jpg": {
      "width": 1600,
      "height": 1052
    },
    "images/work-008.jpg": {
      "width": 1599,
      "height": 1096
    },
    "images/work-009.jpg": {
      "width": 1600,
      "height": 1114
    },
    "images/work-010.jpg": {
      "width": 1600,
      "height": 1188
    },
    "images/work-011.jpg": {
      "width": 1600,
      "height": 1161
    },
    "images/work-012.jpg": {
      "width": 1111,
      "height": 1600
    },
    "images/work-013.jpg": {
      "width": 877,
      "height": 1600
    },
    "images/work-014.jpg": {
      "width": 1137,
      "height": 1600
    },
    "images/work-015.jpg": {
      "width": 862,
      "height": 1280
    },
    "images/work-016.jpg": {
      "width": 1200,
      "height": 1599
    },
    "images/work-017.jpg": {
      "width": 995,
      "height": 1280
    },
    "images/work-018.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-019.jpg": {
      "width": 995,
      "height": 1280
    },
    "images/work-020.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-021.jpg": {
      "width": 1280,
      "height": 1280
    },
    "images/work-022.jpg": {
      "width": 525,
      "height": 392
    },
    "images/work-023.jpg": {
      "width": 539,
      "height": 517
    },
    "images/work-024.jpg": {
      "width": 1280,
      "height": 1280
    },
    "images/work-025.jpg": {
      "width": 528,
      "height": 515
    },
    "images/work-026.jpg": {
      "width": 877,
      "height": 1014
    },
    "images/work-027.jpg": {
      "width": 544,
      "height": 506
    },
    "images/work-028.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-029.jpg": {
      "width": 1280,
      "height": 705
    },
    "images/work-030.jpg": {
      "width": 720,
      "height": 1280
    },
    "images/work-031.jpg": {
      "width": 529,
      "height": 511
    },
    "images/work-032.jpg": {
      "width": 1080,
      "height": 856
    },
    "images/work-033.jpg": {
      "width": 1280,
      "height": 708
    },
    "images/work-034.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-035.jpg": {
      "width": 749,
      "height": 719
    },
    "images/work-036.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-037.jpg": {
      "width": 1280,
      "height": 853
    },
    "images/work-038.jpg": {
      "width": 1280,
      "height": 960
    },
    "images/work-039.jpg": {
      "width": 766,
      "height": 700
    },
    "images/work-040.jpg": {
      "width": 1280,
      "height": 960
    },
    "images/work-041.jpg": {
      "width": 1280,
      "height": 699
    },
    "images/work-042.jpg": {
      "width": 1280,
      "height": 960
    },
    "images/work-043.jpg": {
      "width": 528,
      "height": 515
    },
    "images/work-044.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-045.jpg": {
      "width": 505,
      "height": 495
    },
    "images/work-046.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-047.jpg": {
      "width": 1280,
      "height": 708
    },
    "images/work-048.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-049.jpg": {
      "width": 731,
      "height": 716
    },
    "images/work-050.jpg": {
      "width": 904,
      "height": 1280
    },
    "images/work-051.jpg": {
      "width": 1280,
      "height": 1280
    },
    "images/work-052.jpg": {
      "width": 1024,
      "height": 1280
    },
    "images/work-053.jpg": {
      "width": 528,
      "height": 515
    },
    "images/work-054.jpg": {
      "width": 1024,
      "height": 1280
    },
    "images/work-055.jpg": {
      "width": 505,
      "height": 495
    },
    "images/work-056.jpg": {
      "width": 1024,
      "height": 1280
    },
    "images/work-057.jpg": {
      "width": 731,
      "height": 716
    },
    "images/work-058.jpg": {
      "width": 1024,
      "height": 1280
    },
    "images/work-059.jpg": {
      "width": 1280,
      "height": 853
    },
    "images/work-060.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-061.jpg": {
      "width": 544,
      "height": 506
    },
    "images/work-062.jpg": {
      "width": 1280,
      "height": 914
    },
    "images/work-063.jpg": {
      "width": 1280,
      "height": 1280
    },
    "images/work-064.jpg": {
      "width": 1280,
      "height": 904
    },
    "images/work-065.jpg": {
      "width": 1280,
      "height": 904
    },
    "images/work-066.jpg": {
      "width": 1280,
      "height": 904
    },
    "images/work-067.jpg": {
      "width": 1280,
      "height": 904
    },
    "images/work-068.jpg": {
      "width": 720,
      "height": 1280
    },
    "images/work-069.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-070.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-071.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-072.jpg": {
      "width": 917,
      "height": 1224
    },
    "images/work-073.jpg": {
      "width": 957,
      "height": 1277
    },
    "images/work-074.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-075.jpg": {
      "width": 1280,
      "height": 1247
    },
    "images/work-076.jpg": {
      "width": 1167,
      "height": 1280
    },
    "images/work-077.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-078.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-079.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-080.jpg": {
      "width": 1280,
      "height": 704
    },
    "images/work-081.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-082.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-083.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-084.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-085.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-086.jpg": {
      "width": 1280,
      "height": 960
    },
    "images/work-087.jpg": {
      "width": 1280,
      "height": 960
    },
    "images/work-088.jpg": {
      "width": 1280,
      "height": 829
    },
    "images/work-089.jpg": {
      "width": 1280,
      "height": 891
    },
    "images/work-090.jpg": {
      "width": 1104,
      "height": 1280
    },
    "images/work-091.jpg": {
      "width": 952,
      "height": 1280
    },
    "images/work-092.jpg": {
      "width": 684,
      "height": 672
    },
    "images/work-093.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-094.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-095.jpg": {
      "width": 780,
      "height": 1280
    },
    "images/work-096.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-097.jpg": {
      "width": 1135,
      "height": 1280
    },
    "images/work-098.jpg": {
      "width": 721,
      "height": 1280
    },
    "images/work-099.jpg": {
      "width": 721,
      "height": 1280
    },
    "images/work-100.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-101.jpg": {
      "width": 960,
      "height": 1104
    },
    "images/work-102.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-103.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-104.jpg": {
      "width": 1280,
      "height": 704
    },
    "images/work-105.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-106.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-107.jpg": {
      "width": 788,
      "height": 787
    },
    "images/work-108.jpg": {
      "width": 887,
      "height": 1124
    },
    "images/work-109.jpg": {
      "width": 960,
      "height": 1101
    },
    "images/work-110.jpg": {
      "width": 1280,
      "height": 860
    },
    "images/work-111.jpg": {
      "width": 960,
      "height": 861
    },
    "images/work-112.jpg": {
      "width": 893,
      "height": 1280
    },
    "images/work-113.jpg": {
      "width": 1280,
      "height": 906
    },
    "images/work-114.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-115.jpg": {
      "width": 1280,
      "height": 960
    },
    "images/work-116.jpg": {
      "width": 684,
      "height": 674
    },
    "images/work-117.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-118.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-119.jpg": {
      "width": 1280,
      "height": 914
    },
    "images/work-120.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-121.jpg": {
      "width": 995,
      "height": 1280
    },
    "images/work-122.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-123.jpg": {
      "width": 960,
      "height": 1280
    },
    "images/work-124.jpg": {
      "width": 1024,
      "height": 1280
    }
  },
  "motionFilm": {
    "video": "videos/carole-designs-in-motion.mp4",
    "poster": "images/work-062.jpg",
    "eyebrow": "تصاميم تنبض بالحياة",
    "heading": "حين تتحول الرسومات إلى مشاهد حية",
    "description": "لم تتوقف كارول عند تحويل تصاميمها إلى موكبس فقط؛ بل منحتها حضورًا حيًا عبر مشاهد متحركة لموديلز يرتدون قطعًا من تصميمها، ويتحركون داخل عوالم مستوحاة من أشهر اللوحات، لتصبح الفكرة الفنية تجربة نابضة بالحياة.",
    "eyebrow_en": "Designs in Motion",
    "heading_en": "When sketches become living scenes",
    "description_en": "Carole did not stop at turning her designs into mockups. She brought them into motion through scenes of models wearing her pieces, moving inside worlds inspired by iconic paintings, so each design feels alive, expressive, and cinematic."
  }
};
