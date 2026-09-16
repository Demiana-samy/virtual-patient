export const pneumoniaCase = {
  id: 'pneumonia',
  displayName: 'التهاب رئوي',

  patient: {
    name: 'محمود',
    age: 52,
    gender: 'male',
    chiefComplaint: 'سعال مصحوب ببلغم وحمى وألم في الصدر',
  },

  patientBackstory: `أنا محمود، عندي ٥٢ سنة. من ٣ أيام بدأ يجيني سعال جامد، في الأول كان ناشف بعدين بقى في بلغم أصفر غامق أحياناً فيه لون صدئ. معاه سخونة من يومين — آخر قياس ٣٨٫٥ — وقشعريرة. بوجعني صدري ناحية اليمين، خصوصاً لما باخد نفس عميق أو أسعل، كأنه حاجة بتزقني من جوه. بحس بضيق نفس لما بطلع السلم أو أمشي مسافة بسيطة، وده جديد عليا. أسبوع قبل كده كنت معوّه زكام وكحة خفيفة وتحسنت، بعدين رجعت أتعبان تاني. أنا مدخّن — حوالي بكتين في اليوم من ٢٥ سنة — وعندي سكر من ٥ سنين وباخد metformin. مفيش سفر برّه البلد ولا اتصال بحد عنده سل، ولا تورّم في رجلي. مباخدش أدوية تانية غير السكر، ومفيش حساسية أدوية.`,

  facts: [
    {
      id: 'onset_duration',
      clinicalFact: 'Symptoms began 3 days ago, progressively worsening',
      patientAnswer: 'من ٣ أيام بدأ السعال والتعب، وكل يوم بيزيد',
      keywords: ['امتى بدأ', 'من امتى', 'بداية', 'مدة', 'من متى', 'onset', 'كم يوم'],
      critical: true,
      feedbackNote: 'تحديد مدة الأعراض يساعد في التفريق بين العدوى الحادة والمزمنة',
    },
    {
      id: 'cough',
      clinicalFact: 'Productive cough with yellow-dark sputum, occasionally rust-tinged',
      patientAnswer: 'سعال في بلغم أصفر غامق، وأحياناً لونه صدئ',
      keywords: ['سعال', 'كحة', 'بلغم', 'لعاب', 'cough', 'sputum', 'توقع'],
      critical: true,
      feedbackNote: 'السعال الإنتاجي مع بلغم يدعم التهاباً رئوياً وليس ربواً بسيطاً',
    },
    {
      id: 'fever_chills',
      clinicalFact: 'Fever 38.5°C for 2 days with chills',
      patientAnswer: 'عندي سخونة من يومين، آخر قياس ٣٨٫٥، ومعاها قشعريرة',
      keywords: ['حرارة', 'سخونة', 'حمى', 'fever', 'temperature', 'قشعريرة'],
      critical: true,
      feedbackNote: 'الحمى مع القشعريرة تدعم وجود عدوى بكتيرية',
    },
    {
      id: 'pleuritic_pain',
      clinicalFact: 'Right-sided pleuritic chest pain worsened by deep breath and cough',
      patientAnswer: 'بوجعني صدري ناحية اليمين، بيزيد لما باخد نفس عميق أو أسعل',
      keywords: ['ألم صدر', 'وجع صدر', 'pleuritic', 'نفس عميق', 'صدر', 'chest pain'],
      critical: true,
      feedbackNote: 'ألم صدري pleuritic شائع مع التهاب الرئة ويساعد في تحديد موقعه',
    },
    {
      id: 'dyspnea',
      clinicalFact: 'New-onset dyspnea on exertion (climbing stairs, walking short distances)',
      patientAnswer: 'بحس بضيق نفس لما بطلع السلم أو أمشي شوية — ده جديد عليا',
      keywords: ['ضيق نفس', 'تنفس', 'dyspnea', 'SOB', 'بتلعب', 'تعب', 'لاهث'],
      critical: true,
      feedbackNote: 'ضيق التنفس الجديد يقيّم شدة العدوى وتأثيرها على الأكسجين',
    },
    {
      id: 'recent_uri',
      clinicalFact: 'Upper respiratory infection (cold) one week prior, initial improvement then worsening',
      patientAnswer: 'أسبوع قبل كده كان عندي زكام وكحة خفيفة، بعدين رجعت أتعبان تاني',
      keywords: ['زكام', 'برد', 'URI', 'قبل كده', 'flu', 'إنفلونza', 'معوّه'],
      critical: true,
      feedbackNote: 'تفاقم بعد زكام يتوافق مع التهاب رئوي ثانوي',
    },
    {
      id: 'smoking',
      clinicalFact: 'Active smoker, ~20 cigarettes/day for 25 years (~25 pack-years)',
      patientAnswer: 'أنا مدخّن — حوالي بكتين في اليوم من ٢٥ سنة',
      keywords: ['تدخين', 'سجاير', 'smoking', 'smoker', 'بكت', 'دخان'],
      critical: true,
      feedbackNote: 'التدخين عامل خطر مهم للتهاب الرئة ويؤثر على شدته',
    },
    {
      id: 'diabetes',
      clinicalFact: 'Type 2 diabetes mellitus on metformin for 5 years',
      patientAnswer: 'عندي سكر من ٥ سنين وباخد metformin',
      keywords: ['سكر', 'diabetes', 'سكري', 'metformin', 'أدوية مزمنة'],
      critical: true,
      feedbackNote: 'السكري يزيد خطر العدوى وشدتها ويؤثر على اختيار العلاج',
    },
    {
      id: 'no_tb_risk',
      clinicalFact: 'No recent travel, no TB exposure, no night sweats or weight loss',
      patientAnswer: 'مفيش سفر برّه البلد ولا حد قريب مني عنده سل، ومفيش عرق ليلي ولا نقص وزن',
      keywords: ['سفر', 'سل', 'TB', 'tuberculosis', 'عرق ليلي', 'نقص وزن', 'travel'],
      critical: true,
      feedbackNote: 'استبعاد عوامل السل مهم قبل تأكيد التهاب رئوي بكتيري',
    },
    {
      id: 'no_pe_signs',
      clinicalFact: 'No leg swelling, calf pain, or recent immobilization',
      patientAnswer: 'مفيش تورّم في رجلي ولا ألم في ساقي، ومكنتش طريح الفراش',
      keywords: ['رجل', 'ساق', 'تورّم', 'PE', 'embolism', 'انصمام', 'immobilization'],
      critical: false,
      feedbackNote: 'يساعد في استبعاد انصمام رئوي كسبب لألم الصدر وضيق النفس',
    },
    {
      id: 'hemoptysis',
      clinicalFact: 'No frank hemoptysis; rust-tinged sputum only',
      patientAnswer: 'مفيش دم صريح في البلغم، بس أحياناً لونه صدئ',
      keywords: ['دم', 'hemoptysis', 'بلغم دموي', 'توقع دم'],
      critical: false,
      feedbackNote: 'تمييز البلغم الصدئ عن نزف رئوي حاد يوجّه الفحوصات',
    },
    {
      id: 'medications_allergies',
      clinicalFact: 'Metformin only; no known drug allergies',
      patientAnswer: 'باخد metformin للسكر بس، ومفيش عندي حساسية من أي دواء',
      keywords: ['أدوية', 'حساسية', 'medications', 'allergies', 'دواء'],
      critical: false,
      feedbackNote: 'مهم قبل وصف المضادات الحيوية أو أي علاج إضافي',
    },
  ],

  physicalExam: {
    general: {
      label: 'الفحص العام',
      result: 'المريض يبدو عليه الإجهاد ويلهث خفيفاً، الحرارة 38.5°م، النبض 104/دقيقة، معدل التنفس 24/دقيقة، ضغط الدم 125/80 مم زئبق',
      relevant: true,
      feedbackNote: 'تقييم العلامات الحيوية وتسارع التنفس والنبض ضروري لتقييم شدة التهاب الرئة وخطورته',
    },
    chest: {
      label: 'تسمّع الصدر',
      result: 'انخفاض أصوات التنفس مع وجود خرير خشن (crackles) وكلام صدري (bronchophony) في القاعدة السفلية للرئة اليمنى',
      relevant: true,
      feedbackNote: 'تسمّع الصدر ووجود الخرير والتسمُّت في الرئة اليمنى الفحص السريري الأساسي لتشخيص التهاب الرئة',
    },
    abdominal: {
      label: 'فحص البطن',
      result: 'البطن لينة وغير مؤلمة، لا يوجد تضخم في الكبد أو الطحال',
      relevant: false,
      feedbackNote: 'فحص البطن روتيني هنا لاستبعاد السبب البطني لألم الصدر أو الحمى',
    },
    cardiovascular: {
      label: 'فحص الجهاز الدوري',
      result: 'تسارع ضربات القلب (104/دقيقة) مع نَبْض منتظم، أصوات القلب S1 و S2 طبيعية، لا توجد نفخات أو علامات تعفّن حاد',
      relevant: true,
      feedbackNote: 'تقييم الجهاز الدوري مهم لكشف تسارع القلب وعلامات التعفن (sepsis) في حالات التهاب الرئة',
    },
  },


  investigations: [
    {
      id: 'chest_xray',
      label: 'أشعة صدر',
      result: 'تسمُّت (consolidation) في الفص السفلي للرئة اليمنى — يتفق مع التهاب رئوي',
      relevant: true,
      feedbackNote: 'الفحص الأساسي لإظهار التسمُّت وتأكيد التهاب الرئة',
    },
    {
      id: 'cbc',
      label: 'تحليل دم كامل',
      result: 'ارتفاع كرات الدم البيضاء (WBC: 15,200/µL) مع زيادة العدلات (Neutrophils: 85%)',
      relevant: true,
      feedbackNote: 'ارتفاع العدلات يدعم عدوى بكتيرية',
    },
    {
      id: 'spo2',
      label: 'قياس تشبُّع الأكسجين',
      result: 'SpO₂: 92% على الهواء الطبيعي — انخفاض طفيف',
      relevant: true,
      feedbackNote: 'يقيّم شدة المرض ومدى حاجة المريض للأكسجين',
    },
    {
      id: 'sputum_culture',
      label: 'مزرعة بلغم',
      result: 'Streptococcus pneumoniae — حساس للبنسلين',
      relevant: true,
      feedbackNote: 'يحدد المسبّب ويوجّه اختيار المضاد الحيوي',
    },
    {
      id: 'd_dimer',
      label: 'D-dimer',
      result: 'ضمن الحدود الطبيعية — لا يدعم انصمام رئوي',
      relevant: false,
      feedbackNote: 'يساعد في استبعاد انصمام رئوي عند انخفاض الاحتمال',
    },
  ],

  correctDiagnosis: 'التهاب رئوي',

  diagnosisOptions: [
    'التهاب رئوي',
    'التهاب الشعب الهوائية',
    'انصمام رئوي',
    'السل',
    'فشل قلبي',
  ],

  differentials: [
    'التهاب الشعب الهوائية',
    'انصمام رئوي',
    'السل',
  ],
};
