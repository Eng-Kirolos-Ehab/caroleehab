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

  // -----------------------------------------------------------
  // بيانات الفنانة
  // -----------------------------------------------------------
  artist: {
    name: "Carole Ehab Nabil",
    nameAr: "كارول إيهاب نبيل",
    title: "فنانة تشكيلية · مصممة نسيج · طالبة هندسة",
    tagline: "من النسيج إلى الموضة، من الفحم إلى اللون — كل عمل يبدأ برسم يدوي وينتهي بقصة",
    bio: "فنانة تشكيلية ومصممة نسيج في السنة الرابعة بكلية هندسة النسيج، جامعة بدر في القاهرة. متخصصة في تصميم الأنماط التكرارية، تصاميم الجاكار، الموضة السريالية، والطباعة المنزلية — كل أعمالها تبدأ برسم يدوي وتنتهي بتصميم يحكي قصة. حصلت على المركز الثالث في مسابقة الفنون الجامعية، وشاركت في معرض EgyStetch وعدة معارض فنية داخل الكلية. مشروع تخرجها يستلهم من السريالية ويجمع بين تصميم الأزياء والمفروشات في مجموعتين متكاملتين — كلتيهما منشورتان على الموقع.",
    bioShort: "فنانة تشكيلية شغوفة بالنسيج، الفحم، والتفاصيل الصغيرة.",
    photo: "images/work-052.jpg",
    location: "السويس، مصر",
    location_en: "Suez, Egypt",
    title_en: "Textile Engineer & Visual Artist",
    tagline_en: "From textiles to fashion, from charcoal to color — every work begins with a hand-drawn sketch.",
    bio_en: "A textile engineering student in her fourth year at Badr University in Cairo (BUC), specializing in repeat pattern design, jacquard, surrealist fashion, and home printing. Her graduation project — two complete surrealist collections (upholstery + fashion) — is published on this portfolio. She won 3rd place in the university-wide arts competition, exhibited at EgyStetch, and received the Department Creative Certificate for excellence in hand-drawn artistic boards.",
    email: "caroleeehab@gmail.com",
    social: {
      instagram: "https://www.instagram.com/carole_ehab?igsh=YjloYm8xcHY2MWdj",
      facebook: "https://www.facebook.com/share/1J7XXx28Vj/",
      behance: ""
    }
  },

  // -----------------------------------------------------------
  // التصنيفات (تستخدم في فلتر معرض الأعمال)
  // -----------------------------------------------------------
  categories: [
    { id: "all",        label: "الكل" },
    { id: "painting",   label: "لوحات زيتية وبورتريه" },
    { id: "charcoal",   label: "رسم بالفحم" },
    { id: "bigworks",   label: "لوحات المعارض" },
    { id: "sketchbook", label: "سكتشات وتصاميم" },
    { id: "jacquard",   label: "تصاميم جاكار" },
    { id: "textile",    label: "نسيج وطباعة" },
    { id: "homeprint",  label: "طباعة منزلية" },
    { id: "fashion",    label: "موضة سريالية" },
    { id: "factory",    label: "شغل المصنع" },
    { id: "mixed",      label: "ميكس ميديا" },
    { id: "personal",   label: "لمساتي الخاصة" }
  ],

  // -----------------------------------------------------------
  // الأعمال - كل عمل = صورة + بيانات
  // category لازم تكون نفس id موجود في categories فوق
  // featured: true يعني العمل يظهر في قسم "أعمال مميزة"
  // -----------------------------------------------------------
  works: [

    // — لوحات زيتية وبورتريه —
    {
      id: 1,
      image: "images/work-070.jpg",
      title: "لوحة من الشارع",
      category: "painting",
      year: "2026",
      description: "لوحة زيتية مستوحاة من مشهد يومي بسيط، تحمل تفاصيل من الحياة اليومية بألوان هادئة.",
      featured: true
    },

    // — رسم بالفحم —
    {
      id: 2,
      image: "images/work-106.jpg",
      title: "بنت البادية",
      category: "charcoal",
      year: "2026",
      description: "عمل بالفحم يحتفي بتفاصيل الوجه والملامح، مع لمسة من الحياة الصحراوية.",
      featured: true
    },
    {
      id: 3,
      image: "images/work-015.jpg",
      title: "طبيعة صامتة - الإبريق",
      category: "charcoal",
      year: "2026",
      description: "رسم بالفحم لتكوين من أدوات المطبخ والخضروات، يركّز على التدرجات والظل والنور.",
      featured: false
    },
    {
      id: 4,
      image: "images/work-118.jpg",
      title: "وجوه",
      category: "charcoal",
      year: "2026",
      description: "مجموعة بورتريهات بالفحم، كل وجه يحمل تعبيره وقصته الخاصة.",
      featured: true
    },

    // — ميكس ميديا —
    {
      id: 5,
      image: "images/work-001.jpg",
      title: "عالم تحت الماء",
      category: "mixed",
      year: "2026",
      description: "عمل ميكس ميديا يجمع بين الرسم والكولاج والخامات المختلفة في تكوين بحري حيوي.",
      featured: true
    },

    // — طباعة منزلية —
    {
      id: 6,
      image: "images/work-017.jpg",
      title: "أوراق الخريف",
      category: "homeprint",
      year: "2026",
      description: "تصميم طباعة متكرر (Seamless Pattern) مستوحى من أوراق الشجر، مناسب للأقمشة والمنتجات المنزلية.",
      featured: false
    },

    // — تصاميم جاكار —
    {
      id: 7,
      image: "images/work-063.jpg",
      title: "توت وصنوبر",
      category: "jacquard",
      year: "2026",
      description: "نمط جاكار بكونسبت كريسماس — التوت الأحمر والصنوبر الأخضر في هارمونية نسيج دافئة.",
      featured: false
    },
    {
      id: 8,
      image: "images/work-027.jpg",
      title: "جاكار كاروهات - أخضر",
      category: "jacquard",
      year: "2026",
      description: "تصميم نسيج جاكار Tartan/Check تم تطويره باستخدام برامج تصميم الأنسجة المتخصصة.",
      featured: false
    },
    {
      id: 9,
      image: "images/work-049.jpg",
      title: "جاكار كاروهات - دفء",
      category: "jacquard",
      year: "2026",
      description: "تصميم جاكار بدرجات الأحمر والبني، دراسة في توافق الألوان الدافئة وتأثيرها على تصميم الأقمشة.",
      featured: false
    },

    // — لمساتي الخاصة —
    {
      id: 10,
      image: "images/work-075.jpg",
      title: "رسم على جراب موبايل",
      category: "personal",
      year: "2026",
      description: "جراب موبايل مرسوم بالكامل باليد بشخصيات وألوان زاهية — لمستي الخاصة على شيء عادي.",
      featured: false
    },
    {
      id: 11,
      image: "images/work-099.jpg",
      title: "ميداليات الساعات الذائبة",
      category: "personal",
      year: "2026",
      description: "مجموعة ميداليات (كي تشينز) مستوحاة من الساعات الذائبة لسالفادور دالي، مصنوعة ومرسومة يدويًا.",
      featured: false
    },

    // — شغل المصنع —
    {
      id: 12,
      image: "images/work-111.jpg",
      title: "مجسم معدات النسيج",
      category: "factory",
      year: "2026",
      description: "مجسم تجريبي يحاكي معدات النسيج التقليدية، منفّذ يدويًا كجزء من مشروع تصميم النسيج.",
      featured: false
    },

    // — سكتشات وتصاميم —
    {
      id: 13,
      image: "images/work-087.jpg",
      title: "دفتر تصميم - أزياء وأنماط",
      category: "sketchbook",
      year: "2026",
      description: "صفحة من دفتر التصميم تجمع بين رسومات الأزياء ودراسة الأنماط والألوان.",
      featured: false
    },
    {
      id: 14,
      image: "images/work-003.jpg",
      title: "دفتر تصميم - الخطوط",
      category: "sketchbook",
      year: "2026",
      description: "صفحة بحث بصري عن أنواع الخطوط (Stripes) وتأثيرها على تصميم الملابس.",
      featured: false
    },
    {
      id: 15,
      image: "images/work-010.jpg",
      title: "دفتر تصميم - الكاروهات",
      category: "sketchbook",
      year: "2026",
      description: "صفحة بحث عن أنماط الكاروهات (Tartan/Check) ومصادرها التاريخية، مع عينات أقمشة حقيقية.",
      featured: false
    },

    // — لوحات المعارض والمسابقات —
    {
      id: 16,
      image: "images/work-077.jpg",
      title: "طبيعة صامتة - الإبريق والكتب",
      category: "bigworks",
      year: "2025",
      description: "لوحة زيتية كبيرة تجمع بين الإبريق والكتب والقماش — دراسة أكاديمية في التدرجات الدافئة والتكوين الكلاسيكي.",
      featured: true
    },
    {
      id: 17,
      image: "images/work-071.jpg",
      title: "أمومة في زمن الحرب",
      category: "bigworks",
      year: "2025",
      description: "لوحة زيتية معبّرة تصور امرأة وأطفالها وسط الأنقاض — عمل شارك في معرض فني ولامس قلوب الجمهور.",
      featured: true
    },
    {
      id: 18,
      image: "images/work-078.jpg",
      title: "طبيعة صامتة - الزجاجة الزرقاء",
      category: "bigworks",
      year: "2025",
      description: "لوحة زيتية بألوان برودة جميلة؛ زجاجة وإبريق أزرق على خلفية وردية هادئة.",
      featured: false
    },
    {
      id: 19,
      image: "images/work-079.jpg",
      title: "طبيعة صامتة - الخبز والطنجرة",
      category: "bigworks",
      year: "2025",
      description: "لوحة زيتية بأجواء منزلية دافئة — طنجرة وخبز وسكين على قماش مخطط في ضوء هادئ.",
      featured: false
    },
    {
      id: 20,
      image: "images/work-082.jpg",
      title: "طبيعة صامتة - البرتقالي والأزرق",
      category: "bigworks",
      year: "2025",
      description: "تناقض مشرق بين وعاء برتقالي وإبريق أزرق على خلفية مزخرفة — دراسة في التضاد اللوني.",
      featured: false
    },
    {
      id: 21,
      image: "images/work-083.jpg",
      title: "طبيعة صامتة - الجرة الفرعونية",
      category: "bigworks",
      year: "2025",
      description: "لوحة زيتية تجمع بين جرة فرعونية وخضروات طازجة — تلاقي التراث والحياة اليومية.",
      featured: false
    },
    {
      id: 22,
      image: "images/work-033.jpg",
      title: "بورتريه بالباستيل",
      category: "bigworks",
      year: "2025",
      description: "لوحة بورتريه بألوان الباستيل لامرأة بتاج ووشاح — تجسيد للأناقة والكياسة بألوان دافئة.",
      featured: false
    },
    {
      id: 23,
      image: "images/work-068.jpg",
      title: "بورتريه كلاسيكي",
      category: "bigworks",
      year: "2025",
      description: "بورتريه فتاة بالألوان الزيتية الكلاسيكية، بأسلوب يستحضر عبق لوحات عصر النهضة.",
      featured: false
    },
    {
      id: 24,
      image: "images/work-101.jpg",
      title: "مقهى الفيشاوي",
      category: "bigworks",
      year: "2025",
      description: "لوحة فحم ضخمة ترصد أجواء مقهى الفيشاوي العريق في القاهرة — وجوه ومشاعر وحكايات.",
      featured: false
    },
    {
      id: 25,
      image: "images/work-102.jpg",
      title: "البدوية الضاحكة",
      category: "bigworks",
      year: "2025",
      description: "لوحة فحم لسيدة بدوية تضحك بتلقائية مع جمالها — لحظة إنسانية أصيلة خُلّدت بالفحم.",
      featured: false
    },

    // — سكتشات بالرصاص (موهبة الرسم) —
    {
      id: 26,
      image: "images/work-011.jpg",
      title: "دراسة بالرصاص - الإبريق والقماش",
      category: "sketchbook",
      year: "2025",
      description: "رسم تخطيطي بالقلم الرصاص لتكوين من الإبريق والقماش — دراسة في المنظور والظل والنور.",
      featured: false
    },
    {
      id: 27,
      image: "images/work-014.jpg",
      title: "دراسة بالرصاص - الزجاجة والفواكه",
      category: "sketchbook",
      year: "2025",
      description: "سكتش بالرصاص لزجاجة نبيذ وموز وسكين — تمرين في الواقعية وتقنية التظليل الدقيق.",
      featured: false
    },
    {
      id: 28,
      image: "images/work-112.jpg",
      title: "دراسة بالرصاص - الإبريق والنظارة",
      category: "sketchbook",
      year: "2025",
      description: "طبيعة صامتة بالرصاص تجمع إبريقًا وفواكه ونظارة — تفاصيل دقيقة وتظليل ناعم.",
      featured: false
    },

    // — تصاميم جاكار (جديدة) —
    {
      id: 29,
      image: "images/work-021.jpg",
      title: "جاكار كريسماس - التوت والصنوبر",
      category: "jacquard",
      year: "2025",
      description: "تصميم جاكار بكونسبت كريسماس — أوراق الصنوبر وحبات التوت الحمراء في نسيج دافئ ومتكرر يبث أجواء الشتاء.",
      featured: true
    },
    {
      id: 30,
      image: "images/work-064.jpg",
      title: "جاكار أطلانتس - نقشة النيل",
      category: "jacquard",
      year: "2025",
      description: "تصميم جاكار بنقشة فرعونية مستوحاة من النيل والتراث المصري القديم — أزرق جينز عميق يحكي حضارة ما تحت الماء.",
      featured: true
    },
    {
      id: 31,
      image: "images/work-065.jpg",
      title: "جاكار مصري - الهيروغليفية",
      category: "jacquard",
      year: "2025",
      description: "نقشة جاكار بألوان رمادية وزرقاء مستوحاة من الآثار المصرية والكتابة الهيروغليفية.",
      featured: false
    },
    {
      id: 32,
      image: "images/work-066.jpg",
      title: "جاكار مصري - الرموز الفرعونية",
      category: "jacquard",
      year: "2025",
      description: "تصميم جاكار بأزرق غامق يحتضن رموزًا فرعونية كالعين والخنفساء — أطلانتس بلمسة مصرية أصيلة.",
      featured: false
    },
    {
      id: 33,
      image: "images/work-116.jpg",
      title: "جاكار تركواز - موجات البحر",
      category: "jacquard",
      year: "2025",
      description: "نسيج جاكار بألوان التركواز والأزرق والأبيض يستحضر هدوء موجات البحر وعالم أطلانتس.",
      featured: false
    },
    {
      id: 34,
      image: "images/work-119.jpg",
      title: "جاكار شتوي - التوت والأوراق",
      category: "jacquard",
      year: "2025",
      description: "نمط جاكار بدرجات البني والكراميل الدافئة مع أوراق شتوية — كونسبت كريسماس بمزاج رومانسي هادئ.",
      featured: false
    },

    // — نسيج يدوي —
    {
      id: 35,
      image: "images/work-005.jpg",
      title: "نسيج يدوي على النول - وردي وبيج",
      category: "textile",
      year: "2025",
      description: "نسيج يدوي على النول الشخصي بتناسق جميل بين الوردي والبيج والبني — شغل يدوي أصيل يمزج الألوان بحرفية.",
      featured: false
    },
    {
      id: 36,
      image: "images/work-016.jpg",
      title: "نسيج يدوي على النول - رمادي",
      category: "textile",
      year: "2025",
      description: "نسيج يدوي متكامل بدرجات الوردي والبيج والرمادي — إتقان تقنية النسج اليدوي التقليدي.",
      featured: false
    },

    // — طباعة منزلية (جديدة) —
    {
      id: 37,
      image: "images/work-019.jpg",
      title: "ورق جداري نباتي",
      category: "homeprint",
      year: "2025",
      description: "تصميم طباعة لورق الجدار بأوراق نباتية خضراء على خلفية رمادية غامقة — أناقة طبيعية للمنزل.",
      featured: true
    },
    {
      id: 38,
      image: "images/work-051.jpg",
      title: "طبعة نباتية شتوية",
      category: "homeprint",
      year: "2025",
      description: "نقشة طباعة بألوان خضراء وذهبية بطابع شتوي دافئ، مناسبة للستائر والمفروشات الراقية.",
      featured: false
    },
    {
      id: 39,
      image: "images/work-067.jpg",
      title: "أزهار زرقاء داكنة",
      category: "homeprint",
      year: "2025",
      description: "نقشة طباعة قماش بأزهار زرقاء وخضراء على خلفية كحلية داكنة — فخامة لمفروشات الصالون.",
      featured: false
    },
    {
      id: 40,
      image: "images/work-120.jpg",
      title: "نقشة ذهبية نباتية",
      category: "homeprint",
      year: "2025",
      description: "ورق جداري بنقشة نباتية ذهبية على خلفية كحلية — تصميم فاخر للمساحات الراقية.",
      featured: false
    },

    // — موضة سريالية —
    {
      id: 41,
      image: "images/work-062.jpg",
      title: "سريالية الموضة",
      category: "fashion",
      year: "2025",
      description: "لوحة موضة سريالية تمزج بين الفن والتصميم بأسلوب عصري جريء — الموضة كفن لا حدود له.",
      featured: true
    },
    {
      id: 42,
      image: "images/work-098.jpg",
      title: "غلاف مجلة سرّيفا",
      category: "fashion",
      year: "2025",
      description: "غلاف المجلة الفنية 'سرّيفا' الذي يعرض تصميم أزياء كارول — حضور مميز في عالم الموضة المصرية.",
      featured: false
    },
    {
      id: 43,
      image: "images/work-030.jpg",
      title: "أزياء من الحضارة الفرعونية",
      category: "fashion",
      year: "2025",
      description: "عرض تصميم أزياء مستوحى من الرموز المصرية القديمة بألوان زرقاء سريالية عصرية.",
      featured: false
    },
    {
      id: 44,
      image: "images/work-084.jpg",
      title: "سكتشات أزياء - ألوان مائية",
      category: "fashion",
      year: "2025",
      description: "صفحة سكتشات أزياء بألوان مائية زاهية مع دراسة نظرية الألوان ودولاب الألوان.",
      featured: false
    },
    {
      id: 45,
      image: "images/work-085.jpg",
      title: "سكتش أزياء - الأنماط الهندسية",
      category: "fashion",
      year: "2025",
      description: "سكتش أزياء بألوان زاهية ببنطلون أنماط هندسية ملونة — إبداع في تصميم الأزياء العصرية.",
      featured: false
    },
    {
      id: 46,
      image: "images/work-086.jpg",
      title: "سكتشات أزياء - أبيض وأسود",
      category: "fashion",
      year: "2025",
      description: "صفحة سكتشات أزياء بأنماط هندسية بالأبيض والأسود والأحمر — قوة التصميم بلا ألوان زائدة.",
      featured: false
    },
    {
      id: 47,
      image: "images/work-088.jpg",
      title: "أزياء ونظرية الألوان",
      category: "fashion",
      year: "2025",
      description: "دراسة تصميم أزياء بنظرية الألوان: تكامل، انقسام، ثلاثي — العلم والجماليات في صفحة واحدة.",
      featured: false
    },

    // — شغل المصنع - جيد تيكستيل —
    {
      id: 48,
      image: "images/work-107.jpg",
      title: "مجسم ماكينة النسيج",
      category: "factory",
      year: "2025",
      description: "نموذج خشبي مصغر لماكينة النسيج منفّذ يدويًا — مجسم دقيق يعكس فهمًا عميقًا لمعدات المصنع.",
      featured: true
    },
    {
      id: 49,
      image: "images/work-108.jpg",
      title: "مخطط توزيع المصنع",
      category: "factory",
      year: "2025",
      description: "مخطط هندسي لتوزيع أقسام مصنع النسيج — تصميم المساحة والعرض داخل بيئة المصنع.",
      featured: false
    },
    {
      id: 50,
      image: "images/work-024.jpg",
      title: "تخطيط منطقة التحضير",
      category: "factory",
      year: "2025",
      description: "رسم تخطيطي دقيق لتصميم منطقة التحضير في المصنع — تخطيط وظيفي وجمالي للمساحة.",
      featured: false
    },
    {
      id: 51,
      image: "images/work-050.jpg",
      title: "ورشة الطباعة اليدوية",
      category: "factory",
      year: "2025",
      description: "تجهيز شاشات الطباعة اليدوية في الورشة — خطوة عملية في دورة إنتاج الأقمشة المطبوعة.",
      featured: false
    },
    {
      id: 52,
      image: "images/work-080.jpg",
      title: "تصميم نسيج مخطط",
      category: "factory",
      year: "2025",
      description: "تصميم نسيج بخطوط رأسية زرقاء وفيروزية وكحلية متكررة — سيريز جاهز للإنتاج في المصنع.",
      featured: false
    },

    // — لمساتي الخاصة (جديدة) —
    {
      id: 53,
      image: "images/work-076.jpg",
      title: "موبايل كيس - ليلة النجوم",
      category: "personal",
      year: "2025",
      description: "غلاف موبايل مرسوم بأسلوب 'ليلة النجوم' لفان جوخ بألوان زرقاء مذهلة — فن الماسترز على يومياتك.",
      featured: true
    },
    {
      id: 54,
      image: "images/work-026.jpg",
      title: "فستان جينز - لمستي",
      category: "personal",
      year: "2025",
      description: "فستان جينز مطبوع برسومات يدوية أزرق وأبيض — تحويل قطعة ملابس عادية لعمل فني مميز.",
      featured: false
    },
    {
      id: 55,
      image: "images/work-028.jpg",
      title: "فستان جينز - تايداي",
      category: "personal",
      year: "2025",
      description: "فستان جينز مرسوم بنقشات يدوية بأسلوب تايداي — كل خطوة فيه برؤية ولمسة شخصية.",
      featured: false
    },
    {
      id: 56,
      image: "images/work-090.jpg",
      title: "منحوتة الساعة الذائبة",
      category: "personal",
      year: "2025",
      description: "منحوتة يدوية مستوحاة من الساعات الذائبة لسالفادور دالي بألوان فيروزية وذهبية — السريالية بين يدين.",
      featured: false
    },
    {
      id: 57,
      image: "images/work-097.jpg",
      title: "الساعة الذائبة وأوشحتي",
      category: "personal",
      year: "2025",
      description: "منحوتة الساعة الذائبة الفيروزية بجانب أوشحة مطبوعة — عرض يجمع عملين إبداعيين في لقطة واحدة.",
      featured: false
    },
    {
      id: 58,
      image: "images/work-117.jpg",
      title: "لوحة مطرزة - مطربة وبرج",
      category: "personal",
      year: "2025",
      description: "لوحة جدارية مطرزة بالأسود والأبيض لمطربة وبرج — التطريز كأداة فنية للتعبير والسرد البصري.",
      featured: false
    },
    {
      id: 59,
      image: "images/work-121.jpg",
      title: "لوحة مطرزة - صوت الميكروفون",
      category: "personal",
      year: "2025",
      description: "لوحة مطرزة بالأسود والأبيض لشخصية على ميكروفون — قوة التعبير والتفاصيل الدقيقة في التطريز.",
      featured: false
    }
  ],

  // -----------------------------------------------------------
  // الفعاليات والمعارض
  // -----------------------------------------------------------
  events: [
    {
      id: 1,
      image: "images/work-037.jpg",
      title: "معرض فني جماعي",
      date: "2026",
      location: "القاهرة",
      description: "عرض مجموعة من الأعمال الفنية ضمن معرض جماعي، بحضور جمهور وفنانين من مختلف المجالات."
    },
    {
      id: 2,
      image: "images/work-122.jpg",
      title: "معرض برنامج التكستيل - بشرة خير",
      date: "2025",
      location: "القاهرة",
      description: "مشاركة في معرض برنامج التكستيل بعمل نسيجي ضخم بعنوان 'بشرة خير' — جاكار يصور الهوية المصرية بأسلوب فني معاصر."
    },
    {
      id: 3,
      image: "images/work-022.jpg",
      title: "تكريم برنامج تدريب صناعة النسيج",
      date: "2025",
      location: "القاهرة",
      description: "تكريم من المدربين في ختام برنامج تدريبي متخصص في صناعة النسيج — احتفال بإنجاز مرحلة مهارية متقدمة."
    },
    {
      id: 4,
      image: "images/work-093.jpg",
      title: "معرض لوحات الفحم",
      date: "2025",
      location: "القاهرة",
      description: "معرض فني يضم مجموعة من لوحات الفحم الكبيرة — لحظة مميزة بين الفنانة وأعمالها في فضاء المعرض."
    }
  ],

  // -----------------------------------------------------------
  // رحلة العمل - مراحل تنفيذ اللوحة (من الفكرة للنهاية)
  // -----------------------------------------------------------
  process: [
    {
      id: 1,
      image: "images/work-001.jpg",
      title: "الفكرة والإلهام",
      description: "كل عمل بيبدأ بلحظة... فكرة بسيطة، مشهد، ذكرى أو حتى لون يفضل في بالي. بقعد أجمع مراجع وأسكتشات سريعة لحد ما تتكوّن الفكرة في دماغي بشكل أوضح."
    },
    {
      id: 2,
      image: "images/work-011.jpg",
      title: "المسودة والتخطيط",
      description: "بعد ما تتحدد الفكرة، بترجمها على الورق في رسومات تخطيطية (Sketches) بالرصاص، بحدد التكوين العام، الخطوط الأساسية، وتوزيع العناصر قبل ما أبدأ في العمل النهائي."
    },
    {
      id: 3,
      image: "images/work-021.jpg",
      title: "بناء التكوين والألوان",
      description: "هنا تبدأ المرحلة الأطول... بناء الطبقات، اختيار الخامات والألوان المناسبة، وتجربة تأثيرات مختلفة لحد ما أوصل للإحساس اللي عاوزة أوصّله."
    },
    {
      id: 4,
      image: "images/work-077.jpg",
      title: "اللوحة النهائية",
      description: "آخر لمسات، تدقيق التفاصيل، وتوقيع العمل. كل لوحة بتاخد جزء من وقتي وإحساسي، وآخر مرحلة دايمًا بتكون أحلى لحظة... لما أشوف الفكرة بقت حقيقة."
    }
  ],

  // -----------------------------------------------------------
  // المجلات التفاعلية — ٤ مجلات بكونسبتات مختلفة
  // tag = بطاقة تعريفية لكونسبت المجلة (تظهر بجانب العنوان)
  // -----------------------------------------------------------
  magazines: [
    {
      id: 1,
      title: "مجلة الأزياء السريالية",
      description: "تصاميم أزياء عصرية بأسلوب سريالي مبتكر — مجلة تفاعلية تجمع بين الموضة والفن بلمسة كارول الخاصة. اقلبي الصفحات واستكشفي عالمًا من الأزياء الجريئة.",
      embedUrl: "https://online.fliphtml5.com/rkhbb/dkad/",
      cover: "images/work-098.jpg",
      featured: true,
      tag: "موضة سريالية"
    },
    {
      id: 2,
      title: "جاكار كريسماس",
      description: "مجلة تصاميم نسيج جاكار بكونسبت كريسماس — أنماط التوت والصنوبر والألوان الدافئة في هارمونية ساحرة. تصاميم مخصصة للنسيج الجاكارد الفاخر.",
      embedUrl: "https://online.fliphtml5.com/pmqou/cueu/",
      cover: "images/work-021.jpg",
      featured: false,
      tag: "جاكار — كريسماس"
    },
    {
      id: 3,
      title: "جاكار أطلانتس والبحر",
      description: "نقشات جاكار مستوحاة من عالم البحر والأعماق ورموز الحضارة المصرية القديمة — ألوان المياه الفيروزية في تصميم جاكار عميق وفريد.",
      embedUrl: "https://online.fliphtml5.com/pmqou/trdw/",
      cover: "images/work-116.jpg",
      featured: false,
      tag: "جاكار — أطلانتس"
    },
    {
      id: 4,
      title: "مجلة الطباعة المنزلية",
      description: "تصاميم طباعة للمفروشات والستائر والأثاث المنزلي — نقشات نباتية وهندسية أنيقة تجعل بيتك لوحة فنية متكاملة.",
      embedUrl: "https://online.fliphtml5.com/pmqou/okgf/",
      cover: "images/work-019.jpg",
      featured: false,
      tag: "طباعة منزلية"
    }
  ],

  // -----------------------------------------------------------
  // اقتباسات
  // -----------------------------------------------------------
  quotes: [
    {
      text: "كل لوحة بالنسبالي قصة... وكل خط فيها له معنى.",
      author: "كارول"
    },
    {
      text: "الفن مش بس شكل جميل، الفن إحساس بيتحول لصورة.",
      author: "كارول"
    },
    {
      text: "بحب ارسم على أي حاجة حواليا — كل شيء ممكن يبقى لوحة.",
      author: "كارول"
    },
    {
      text: "بحب أجرب كل خامة وكل أسلوب... عشان أكتشف نفسي أكتر.",
      author: "كارول"
    }
  ],

  // -----------------------------------------------------------
  // نصوص الموقع — قابلة للتعديل من تبويب "نصوص الموقع"
  // -----------------------------------------------------------
  texts: {
    nav: {
      home: "الرئيسية",
      about: "عن الفنانة",
      gallery: "الأعمال",
      process: "رحلة العمل",
      magazines: "المجلات",
      events: "الفعاليات",
      contact: "تواصل"
    },
    hero: {
      ctaPrimary: "استعرضي الأعمال",
      ctaSecondary: "تعرفي عليها"
    },
    about: {
      eyebrow: "عن الفنانة",
      heading: "رحلة بين الخط واللون والقماش",
      quote: "بحب إن كل تفصيلة صغيرة في شغلي تحمل جزء من إحساسي."
    },
    featured: {
      eyebrow: "مختارات",
      heading: "أعمال مميزة"
    },
    process: {
      eyebrow: "كيف تولد اللوحة",
      heading: "رحلة العمل",
      description: "من أول فكرة في الدماغ، لحد ما توصل اللوحة لشكلها النهائي — كل مرحلة ليها حكايتها."
    },
    gallery: {
      eyebrow: "المعرض",
      heading: "كل الأعمال",
      description: "لوحات معارض، تصاميم جاكار، موضة سريالية، شغل مصنع، ولمساتها الخاصة — اختاري التصنيف واستكشفي."
    },
    magazineBanner: {
      title: "٤ مجلات تفاعلية",
      description: "جاكار كريسماس، جاكار أطلانتس، طباعة منزلية، وموضة سريالية — اقلبي الصفحات واستكشفي"
    },
    magazines: {
      eyebrow: "مجلات تفاعلية",
      heading: "٤ مجلات … ٤ عوالم مختلفة",
      description: "جاكار كريسماس، جاكار أطلانتس والبحر، طباعة منزلية، وموضة سريالية — كل مجلة عالم مستقل بكونسبت مختلف. اقلبي الصفحات واستكشفي.",
      badge: "المجلة الأبرز",
      openLink: "فتح في صفحة كاملة ↗"
    },
    events: {
      eyebrow: "الفعاليات",
      heading: "المعارض والفعاليات"
    },
    footer: {
      eyebrow: "تواصل",
      heading: "يلا نتكلم عن فكرتك",
      description: "لأي تعاون فني، طلب عمل خاص، أو دعوة لمعرض — تقدري تتواصلي معايا من خلال:",
      contactButton: "راسليني",
      note: "جميع الحقوق محفوظة"
    }
  },

  // -----------------------------------------------------------
  // ترتيب الأقسام في الصفحة
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // English texts — parallel to texts above, used by lang toggle
  // -----------------------------------------------------------
  texts_en: {
    nav: { home: "Home", about: "About", gallery: "Works", process: "Journey", magazines: "Magazines", events: "Events", contact: "Contact" },
    hero: { ctaPrimary: "Browse Works", ctaSecondary: "About Me" },
    about: { eyebrow: "About the Artist", heading: "Where Textiles Meet Art", quote: "I love that every small detail in my work carries a piece of my feeling." },
    featured: { eyebrow: "Selected", heading: "Featured Works" },
    process: { eyebrow: "How a piece is born", heading: "The Creative Journey", description: "From the first idea in mind, to the finished piece — each stage has its own story." },
    gallery: { eyebrow: "Gallery", heading: "All Works", description: "Exhibition paintings, jacquard designs, surrealist fashion, factory work, and personal touches — choose a category to explore." },
    magazines: { eyebrow: "Interactive Magazines", heading: "4 Magazines · 4 Worlds", description: "Jacquard Christmas, Jacquard Atlantis, Home Printing, and Surrealist Fashion — flip through the pages and explore.", badge: "Featured", openLink: "Open Magazine ↗" },
    events: { eyebrow: "Events", heading: "Exhibitions & Events" },
    footer: { eyebrow: "Contact", heading: "Let's Talk About Your Idea", description: "For any artistic collaboration, custom work, or exhibition invitation — reach out:", contactButton: "Message Me", note: "All rights reserved" }
  },

  sectionOrder: ["about", "mag-1", "featured", "mag-2", "process", "gallery", "mag-3", "events", "mag-4", "quotes"]
};
