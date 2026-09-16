export const patient = {
  initials: 'خ.م',
  name: 'خالد المنصور',
  age: 42,
  complaint: 'ألم في البطن منذ يومين',
  sessionTime: '12:34',
};

export const initialMessages = [
  {
    role: 'system',
    text: 'بدأت الجلسة — يمكنك البدء بسؤال المريض عن أعراضه.',
  },
  {
    role: 'patient',
    text: 'مرحباً دكتور، أشعر بألم في بطني منذ يومين. يبدأ في منتصف البطن ثم ينتقل إلى الجهة اليمنى السفلى.',
  },
  {
    role: 'patient',
    text: 'الألم يزداد عند الحركة أو السعال، ومعه غثيان خفيف. لم أصب بالحمى حتى الآن.',
  },
];

export const investigations = [
  'تحليل دم كامل',
  'سونار بطن',
  'تحليل بول',
];

export const diagnoses = [
  { value: '', label: 'اختر التشخيص...' },
  { value: 'appendicitis', label: 'التهاب الزائدة الدودية' },
  { value: 'gastroenteritis', label: 'التهاب المعدة والأمعاء' },
  { value: 'kidney-stones', label: 'حصوات الكلى' },
  { value: 'ectopic-pregnancy', label: 'حمل خارج الرحم' },
];
