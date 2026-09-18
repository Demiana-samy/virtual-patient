export const anemiaCase = {
  id: 'iron_deficiency_anemia',
  displayName: 'فقر دم نقص الحديد (Iron Deficiency Anemia)',

  patient: {
    name: 'سارة',
    age: 28,
    gender: 'female',
    chiefComplaint: 'تعب ودوخة مستمرة منذ عدة أشهر',
  },

  patientBackstory: `أنا سارة، عندي ٢٨ سنة. من حوالي ٣ شهور بحس بتعب مستمر طول اليوم، حتى لو نمت كويس. صحبتي قالتلي إني شكّلي شاحب. بدوّخ لما أقوم بسرعة، وبحس بضيق نفس لو طلعت ٢–٣ طوابق. دورتي الشهرية ثقيلة من زمان — بتقعد ٧ أيام ومحتاجة أغيّر الفوطة كل ٢–٣ ساعات في أول ٣ أيام. بقى عندي craving غريب للثلج من فترة. أظافري بقت هشة وبتتكسر بسهولة. أنا نباتية من ٤ سنين وباكل قليل لحوم ومكسرات. مفيش دم في البراز ولا أسود، ومفيش ألم بطن أو حرقان. مفيش تاريخ عيلة لفقر دم، ومفيش أنيميا اتأخبتلي قبل كده، ومباخدش أدوية بانتظام ومفيش أمراض مزمنة.`,

  facts: [
    {
      id: 'fatigue',
      clinicalFact: 'Progressive fatigue for approximately 3 months, persistent throughout the day',
      patientAnswer: 'من ٣ شهور تعبانة طول اليوم، حتى لو نمت كويس',
      keywords: ['تعب', 'إرهاق', 'fatigue', 'تعبان', 'تعبانة', 'خمول', 'ضعف', 'weakness', 'حاسة بتعب', 'مجهود'],
      critical: true,
      feedbackNote: 'التعب المستمر هو العرض الرئيسي الشائع لفقر الدم نتيجة نقص أكسجة الأنسجة',
    },
    {
      id: 'menorrhagia',
      clinicalFact: 'Heavy menstrual bleeding: 7-day periods, changing pad every 2–3 hours for first 3 days',
      patientAnswer: 'دورتي ثقيلة — ٧ أيام وبغيّر الفوطة كل ٢–٣ ساعات في أول ٣ أيام',
      keywords: ['دورة', 'حيض', 'نزيف', 'menstrual', 'menorrhagia', 'شهرية', 'LMP', 'دورة شهرية', 'دم الدورة', 'فوطة', 'فوط'],
      critical: true,
      feedbackNote: 'غزارة الطمث من أهم وأشهر أسباب فقدان الحديد المزمن لدى النساء في سن الإنجاب',
    },
    {
      id: 'onset_duration',
      clinicalFact: 'Gradual onset over 3 months',
      patientAnswer: 'الأعراض بدأت تدريجياً من حوالي ٣ شهور',
      keywords: ['امتى بدأ', 'من امتى', 'مدة', 'تدريجي', 'onset', 'كم شهر', 'متى بدأ', 'من متى', 'بداية', 'من كام شهر'],
      critical: false,
      feedbackNote: 'البداية التدريجية للأعراض تتوافق مع تطور فقر الدم بشكل تدريجي، وهو ما يمكن أن يحدث مع فقدان الدم المزمن',
    },
    {
      id: 'dizziness',
      clinicalFact: 'Orthostatic lightheadedness on standing quickly',
      patientAnswer: 'بدوّخ لما أقوم بسرعة من الكرسي أو السرير',
      keywords: ['دوخة', 'dizziness', 'lightheaded', 'دوّخ', 'إغماء', 'دوار', 'بتدوخي', 'تدوخ', 'دائخة', 'بدوخ', 'تقفي'],
      critical: false,
      feedbackNote: 'الدوخة عند الوقوف تشير إلى انخفاض تروية الدماغ مع نقص الهيموجلوبين',
    },
    {
      id: 'dyspnea_exertion',
      clinicalFact: 'Dyspnea on climbing 2–3 flights of stairs',
      patientAnswer: 'بحس بضيق نفس لو طلعت ٢–٣ طوابق — ده جديد عليا',
      keywords: ['ضيق نفس', 'dyspnea', 'تنفس', 'سلالم', 'مجهود', 'SOB', 'نهجان', 'نهجة', 'مش قادرة اتنفس'],
      critical: false,
      feedbackNote: 'ضيق النفس عند المجهود ينجم عن انخفاض قدرة الدم على حمل الأكسجين للأنسجة',
    },
    {
      id: 'pica',
      clinicalFact: 'Craving for ice (pagophagia) for several weeks',
      patientAnswer: 'بقى عندي craving غريب للثلج من فترة',
      keywords: ['pica', 'ثلج', 'تلج', 'ice', 'شهية غريبة', 'craving', 'أكل غريب', 'تاكلي تلج', 'اشتهاء'],
      critical: false,
      feedbackNote: 'شهية الثلج (Pagophagia) علامة سريرية مساندة ومميزة لنقص الحديد',
    },
    {
      id: 'pallor',
      clinicalFact: 'Pallor noticed by a friend; patient confirms feeling pale',
      patientAnswer: 'صحبتي قالتلي إني شكّلي شاحب، وأنا حاسة بكده',
      keywords: ['شاحب', 'شاحبة', 'pallor', 'شحوب', 'وجه', 'شفايف', 'بياض الوجه', 'صفراء', 'مصفرة', 'شكلك شاحب'],
      critical: false,
      feedbackNote: 'ملاحظة الشحوب علامة سريرية مهمة على انخفاض تركيز الهيموجلوبين في الدم',
    },
    {
      id: 'no_gi_bleeding',
      clinicalFact: 'No melena, hematochezia, or abdominal pain suggesting GI blood loss',
      patientAnswer: 'مفيش دم في البراز ولا لون أسود، ومفيش ألم بطن',
      keywords: ['براز', 'دم في البراز', 'أسود', 'melena', 'GI', 'نزيف هضمي', 'معدة', 'تبرز', 'براز اسود'],
      critical: false,
      feedbackNote: 'استبعاد أعراض النزيف الهضمي يوجه التفكير نحو الأسباب النزفية الأخرى كغزارة الطمث',
    },
    {
      id: 'diet',
      clinicalFact: 'Vegetarian diet for 4 years with limited iron-rich foods',
      patientAnswer: 'أنا نباتية من ٤ سنين وباكل قليل لحوم ومكسرات',
      keywords: ['أكل', 'نباتي', 'نباتية', 'diet', 'غذاء', 'حديد', 'vegetarian', 'لحوم', 'لحمة', 'طعام'],
      critical: false,
      feedbackNote: 'السؤال عن النظام الغذائي مهم لمطابقة التغذية وقلة مدخول الحديد كعامل مساهم',
    },
    {
      id: 'previous_anemia',
      clinicalFact: 'No previous history of diagnosed anemia or iron deficiency treatment',
      patientAnswer: 'مفيش أنيميا اتأخبتلي أو تعالجت منها قبل كده',
      keywords: ['أنيميا قبل كده', 'فقر دم سابق', 'نقص حديد سابق', 'حصلك أنيميا', 'previous anemia', 'تاريخ أنيميا', 'قبل كده'],
      critical: false,
      feedbackNote: 'التاريخ المرضي السابق يفرق بين النوبة الأولى والنوبات المتكررة',
    },
    {
      id: 'brittle_nails',
      clinicalFact: 'Brittle, easily breaking nails',
      patientAnswer: 'أظافري بقت هشة وبتتكسر بسهولة',
      keywords: ['أظافر', 'nails', 'هش', 'brittle', 'koilonychia', 'ضوافر'],
      critical: false,
      feedbackNote: 'هشاشة الأظافر علامة نسيجية ناتجة عن نقص الحديد في الأنسجة على المدى الطويل',
    },
    {
      id: 'medications_supplements',
      clinicalFact: 'No regular medications or iron supplements; no drug allergies',
      patientAnswer: 'مباخدش أدوية أو مكملات حديد بانتظام ومفيش عندي حساسية من أي دواء',
      keywords: ['أدوية', 'حساسية', 'medications', 'allergies', 'دواء', 'مكملات', 'فيتمينات', 'أقراص'],
      critical: false,
      feedbackNote: 'مهم قبل وصف الحديد أو العلاجات الأخرى',
    },
    {
      id: 'chronic_diseases',
      clinicalFact: 'No history of chronic inflammatory or systemic diseases',
      patientAnswer: 'الحمد لله مفيش أي أمراض مزمنة تانية عندي',
      keywords: ['أمراض مزمنة', 'مرض مزمن', 'ضغط', 'سكر', 'كلى', 'كبد', 'chronic disease', 'أعراض تانية'],
      critical: false,
      feedbackNote: 'استبعاد الأمراض المزمنة يساعد في استبعاد فقر دم الأمراض المزمنة',
    },
  ],

  physicalExam: {
    general: {
      label: 'الفحص العام (General Examination)',
      result: 'المريضة واعية ومستقرة، لوحظ شحوب ملحوظ في الملتحمة والجلد، العلامات الحيوية: الحرارة 36.8°م، النبض 88/دقيقة، ضغط الدم 110/70 مم زئبق',
      relevant: true,
      feedbackNote: 'ملاحظة الشحوب في الملتحمة والجلد وتقييم العلامات الحيوية فحص سريري مباشر يدعم فقر الدم',
    },
    nails_mouth: {
      label: 'فحص الأظافر واللسان (Nails & Oral Mucosa)',
      result: 'أظافر هشة ومسطحة (علامات تقعر الأظافر المبكرة Koilonychia)، مع شحوب الغشاء المخاطي للفم ولسان أملس (Atrophic Glossitis)',
      relevant: true,
      feedbackNote: 'هشاشة الأظافر وتغيرات الغشاء المخاطي للفم واللسان من العلامات السريرية المميزة لنقص الحديد المزمن',
    },
    abdominal: {
      label: 'فحص البطن (Abdominal Examination)',
      result: 'البطن لينة وغير مؤلمة، لا يوجد تضخم في الطحال أو الكبد (No organomegaly)، ولا توجد كتل ملموسة',
      relevant: false,
      feedbackNote: 'فحص بطني روتيني يستبعد تضخم الأعضاء أو وجود كتل',
    },
    chest: {
      label: 'تسمّع الصدر والقلب (Chest & Heart Examination)',
      result: 'أصوات التنفس طبيعية في كلا الرئتين، أصوات القلب طبيعية دون وجود نفخات ملحوظة',
      relevant: false,
      feedbackNote: 'فحص روتيني يستبعد الأسباب الرئوية والقلبية لضيق التنفس',
    },
    pelvic: {
      label: 'الفحص النظري للنساء والحوض (Pelvic Exam)',
      result: 'عدم وجود كتل حوضية ملموسة أو ألم عند الفحص، الفحص في الحدود الطبيعية',
      relevant: false,
      feedbackNote: 'فحص سياقي/اختياري يتقرر حسَب الحاجة السريرية ولا يُعتبر شرطاً إجبارياً لتشخيص فقر الدم',
    },
  },

  investigations: [
    {
      id: 'full_blood_count',
      label: 'تحليل دم كامل (CBC)',
      result: 'Hb: 9.2 g/dL، MCV: 72 fL — فقر دم صغير الكريات (Microcytic Hypochromic Anemia). (نتيجة CBC أظهرت فقر دم صغير الكريات، وهو متوافق مع نقص الحديد لكنه لا يؤكده بمفرده)',
      relevant: true,
      feedbackNote: 'نتيجة CBC أظهرت فقر دم صغير الكريات (microcytic anemia)، وهو متوافق مع نقص الحديد لكنه لا يؤكده بمفرده ويحتاج فحص الفيريتين لتأكيد نقص مخزون الحديد',
    },
    {
      id: 'ferritin',
      label: 'فيريتين المصل (Serum Ferritin)',
      result: 'فيريتين منخفض جداً (8 ng/mL) — يشير بقوة إلى انخفاض مخزون الحديد ويدعم تشخيص فقر دم نقص الحديد في هذا السياق السريري',
      relevant: true,
      feedbackNote: 'قياس الفيريتين يشير بقوة إلى انخفاض مخزون الحديد ويدعم تشخيص فقر دم نقص الحديد في هذا السياق السريري',
    },
    {
      id: 'peripheral_smear',
      label: 'مسحة دم محيطية (Peripheral Blood Smear)',
      result: 'خلايا دم حمراء صغيرة شاحبة (Microcytic Hypochromic) مع تفاوت في حجم الكريات (Anisocytosis)',
      relevant: true,
      feedbackNote: 'تظهر مسحة الدم الشكل المورفولوجي المباشر للكريات الحمراء المتوافقة مع فقر دم نقص الحديد',
    },
    {
      id: 'stool_occult',
      label: 'تحليل البراز للدم الخفي (Stool Occult Blood)',
      result: 'سلبي — لا يوجد دم خفي في البراز',
      relevant: false,
      feedbackNote: 'فحص سياقي يستبعد النزيف الهضمي الخفي كمصدر لفقد الدم',
    },
    {
      id: 'b12_folate',
      label: 'B12 وفولات (Vitamin B12 & Folate)',
      result: 'مستويات B12 و Folate ضمن المعدل الطبيعي',
      relevant: false,
      feedbackNote: 'فحص سياقي يستبعد فقر الدم كبير الكريات الناتج عن نقص B12 أو الفولات',
    },
  ],

  correctDiagnosis: 'فقر دم نقص الحديد',

  diagnosisOptions: [
    'فقر دم نقص الحديد',
    'فقر دم الأمراض المزمنة',
    'ثلاسيميا بسيطة (Thalassemia Minor)',
    'فقر دم بسبب نقص B12',
    'فقر دم تلاشي النقي (Aplastic Anemia)',
  ],

  differentials: [
    'فقر دم الأمراض المزمنة',
    'ثلاسيميا بسيطة (Thalassemia Minor)',
    'فقر دم بسبب نقص B12',
  ],

  medicalRationale: [
    'فقر دم نقص الحديد (Iron Deficiency Anemia): ينجم عن اختلال التوازن بين مدخول الحديد وفقدانه.',
    'التاريخ المرضي: غزارة الطمث من أهم وأشهر أسباب فقدان الحديد المزمن لدى النساء في سن الإنجاب، بينما يُعد النظام الغذائي النباتي عاملاً مساهماً.',
    'الفحوصات الطبية: نتيجة CBC أظهرت فقر دم صغير الكريات (microcytic anemia)، وهو متوافق مع نقص الحديد لكنه لا يؤكده بمفرده (حيث يجب التفريق بينه وبين الثلاسيميا البسيطة). قياس الفيريتين يشير بقوة إلى انخفاض مخزون الحديد ويدعم تشخيص فقر دم نقص الحديد في هذا السياق السريري.',
  ],
};


