import type { Book, Chapter, Figure, Conversation, Flashcard, Note, StudySession, USGReport, DiagramData, User } from '../types';

export const SAMPLE_USER: User = {
  id: 'u1',
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@medcollege.edu',
  role: 'resident',
  specialization: 'Obstetrics & Gynecology',
  institution: 'AIIMS New Delhi',
  joinedAt: '2024-01-15',
  lastActive: new Date().toISOString(),
};

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'b1',
    title: "Williams Obstetrics",
    authors: ['Cunningham FG', 'Leveno KJ', 'Bloom SL', 'Spong CY'],
    edition: '26th',
    year: 2022,
    publisher: 'McGraw-Hill Education',
    subject: 'Obstetrics',
    totalPages: 1344,
    totalChapters: 65,
    totalFigures: 842,
    uploadedAt: '2024-02-10',
    uploadedBy: 'admin',
    status: 'indexed',
    coverColor: '#1e40af',
    description: 'The definitive text in obstetrics, covering normal and abnormal pregnancy, labor, delivery, and the puerperium.',
    tags: ['obstetrics', 'pregnancy', 'labor', 'maternal medicine'],
  },
  {
    id: 'b2',
    title: "Novak's Gynecology",
    authors: ['Berek JS', 'Hacker NF'],
    edition: '16th',
    year: 2020,
    publisher: 'Wolters Kluwer',
    subject: 'Gynecology',
    totalPages: 1056,
    totalChapters: 42,
    totalFigures: 624,
    uploadedAt: '2024-02-12',
    uploadedBy: 'admin',
    status: 'indexed',
    coverColor: '#0d9488',
    description: 'Comprehensive gynecology textbook covering reproductive medicine, oncology, and surgical techniques.',
    tags: ['gynecology', 'oncology', 'endocrinology', 'surgery'],
  },
  {
    id: 'b3',
    title: "Diagnostic Ultrasound",
    authors: ['Rumack CM', 'Levine D'],
    edition: '5th',
    year: 2018,
    publisher: 'Elsevier',
    subject: 'Radiology',
    totalPages: 2080,
    totalChapters: 78,
    totalFigures: 3200,
    uploadedAt: '2024-02-15',
    uploadedBy: 'admin',
    status: 'indexed',
    coverColor: '#7c3aed',
    description: 'Comprehensive reference for diagnostic ultrasound covering all organ systems with extensive image atlas.',
    tags: ['ultrasound', 'radiology', 'imaging', 'sonography'],
  },
  {
    id: 'b4',
    title: "Gray's Anatomy for Students",
    authors: ['Drake RL', 'Vogl AW', 'Mitchell AWM'],
    edition: '4th',
    year: 2020,
    publisher: 'Elsevier',
    subject: 'Anatomy',
    totalPages: 1152,
    totalChapters: 8,
    totalFigures: 1100,
    uploadedAt: '2024-03-01',
    uploadedBy: 'admin',
    status: 'indexed',
    coverColor: '#b45309',
    description: 'The leading anatomy textbook for medical students with clinical cases and radiological images.',
    tags: ['anatomy', 'clinical', 'radiology', 'education'],
  },
  {
    id: 'b5',
    title: "Harrison's Principles of Internal Medicine",
    authors: ['Loscalzo J', 'Fauci AS', 'Kasper DL'],
    edition: '21st',
    year: 2022,
    publisher: 'McGraw-Hill',
    subject: 'Internal Medicine',
    totalPages: 4000,
    totalChapters: 460,
    totalFigures: 1800,
    uploadedAt: '2024-03-05',
    uploadedBy: 'admin',
    status: 'processing',
    coverColor: '#dc2626',
    description: 'The gold standard reference in internal medicine, trusted by clinicians worldwide.',
    tags: ['internal medicine', 'diagnostics', 'treatment', 'clinical'],
  },
];

export const SAMPLE_CHAPTERS: Chapter[] = [
  {
    id: 'c1',
    bookId: 'b1',
    title: 'Overview of Obstetrics',
    number: 1,
    startPage: 1,
    endPage: 22,
    subchapters: [
      { id: 'sc1', title: 'Scope of Obstetrics', startPage: 1 },
      { id: 'sc2', title: 'Statistics', startPage: 8 },
    ],
  },
  {
    id: 'c2',
    bookId: 'b1',
    title: 'Maternal Anatomy',
    number: 2,
    startPage: 23,
    endPage: 65,
    subchapters: [
      { id: 'sc3', title: 'Bony Pelvis', startPage: 23 },
      { id: 'sc4', title: 'Uterus', startPage: 38 },
      { id: 'sc5', title: 'Ovaries', startPage: 56 },
    ],
  },
  {
    id: 'c3',
    bookId: 'b1',
    title: 'Implantation and Placental Development',
    number: 3,
    startPage: 66,
    endPage: 112,
    subchapters: [
      { id: 'sc6', title: 'Fertilization', startPage: 66 },
      { id: 'sc7', title: 'Implantation', startPage: 72 },
      { id: 'sc8', title: 'Placentation', startPage: 85 },
    ],
  },
  {
    id: 'c10',
    bookId: 'b1',
    title: 'Preeclampsia',
    number: 40,
    startPage: 720,
    endPage: 768,
    subchapters: [
      { id: 'sc20', title: 'Definition and Classification', startPage: 720 },
      { id: 'sc21', title: 'Pathophysiology', startPage: 728 },
      { id: 'sc22', title: 'Management', startPage: 748 },
    ],
  },
];

export const SAMPLE_FIGURES: Figure[] = [
  {
    id: 'f1',
    bookId: 'b1',
    chapterId: 'c2',
    pageNumber: 26,
    caption: 'Fig 2-1. The female bony pelvis showing the inlet, midpelvis, and outlet planes.',
    type: 'diagram',
    description: 'Sagittal view of the female pelvis showing all anatomical landmarks relevant to labor and delivery.',
  },
  {
    id: 'f2',
    bookId: 'b1',
    chapterId: 'c3',
    pageNumber: 90,
    caption: 'Fig 3-4. Development of the placenta showing trophoblast invasion of spiral arteries.',
    type: 'diagram',
    description: 'Schematic representation of trophoblastic invasion during early placentation.',
  },
  {
    id: 'f3',
    bookId: 'b3',
    chapterId: 'c10',
    pageNumber: 445,
    caption: 'Fig 18-2. First trimester ultrasound showing crown-rump length measurement.',
    type: 'ultrasound',
    description: 'Sagittal image of first trimester embryo with CRL measurement calipers.',
  },
];

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    userId: 'u1',
    title: 'Preeclampsia pathophysiology and management',
    mode: 'explain',
    bookIds: ['b1'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['preeclampsia', 'hypertension', 'obstetrics'],
    bookmarked: true,
    messages: [
      {
        id: 'm1',
        conversationId: 'conv1',
        role: 'user',
        content: 'Explain the pathophysiology of preeclampsia',
        mode: 'explain',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'm2',
        conversationId: 'conv1',
        role: 'assistant',
        content: `## Pathophysiology of Preeclampsia\n\nPreeclampsia is fundamentally a disorder of **abnormal placentation** and subsequent systemic endothelial dysfunction. The pathophysiology unfolds in two stages:\n\n### Stage 1: Abnormal Placentation\nNormal implantation requires trophoblastic invasion of maternal spiral arteries, transforming them from high-resistance, low-flow vessels into dilated, low-resistance conduits. In preeclampsia:\n- Trophoblastic invasion is **shallow and incomplete**\n- Spiral arteries remain narrow and high-resistance\n- Uteroplacental blood flow is compromised\n- Placental ischemia results\n\n### Stage 2: Systemic Maternal Response\nPlacental ischemia triggers release of anti-angiogenic factors:\n- **sFlt-1 (soluble fms-like tyrosine kinase-1)** is markedly elevated, binding and sequestering VEGF and PlGF\n- **Endoglin** inhibits TGF-β signaling\n- Resulting in widespread **endothelial dysfunction**\n\nThis endothelial dysfunction accounts for all clinical manifestations:\n- Hypertension (vasoconstriction)\n- Proteinuria (glomerular endotheliosis)\n- Edema (capillary leak)\n- HELLP syndrome (hepatic and hematological involvement)\n- Seizures in eclampsia (cerebral vasospasm)`,
        citations: [
          {
            bookId: 'b1',
            bookTitle: 'Williams Obstetrics',
            authors: ['Cunningham FG', 'Leveno KJ'],
            chapterTitle: 'Preeclampsia',
            pageNumber: 728,
            passage: 'Incomplete trophoblastic invasion of spiral arteries is the central pathophysiological event in preeclampsia. Normal invasion replaces arterial smooth muscle with fibrinoid material, creating wide-bore, low-resistance vessels. In preeclampsia, this process is restricted to the decidual portion, leaving myometrial segments intact and high-resistance.',
            relevanceScore: 0.97,
          },
          {
            bookId: 'b1',
            bookTitle: 'Williams Obstetrics',
            authors: ['Cunningham FG', 'Leveno KJ'],
            chapterTitle: 'Preeclampsia',
            pageNumber: 732,
            passage: 'Elevated levels of sFlt-1 bind to and neutralize circulating VEGF and PlGF, resulting in endothelial dysfunction. This anti-angiogenic state precedes clinical manifestations by weeks and forms the basis for proposed screening and prediction models.',
            relevanceScore: 0.94,
          },
        ],
        mode: 'explain',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000).toISOString(),
      },
    ],
  },
  {
    id: 'conv2',
    userId: 'u1',
    title: 'USG findings in first trimester',
    mode: 'study',
    bookIds: ['b3'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    tags: ['ultrasound', 'first trimester', 'dating'],
    bookmarked: false,
    messages: [],
  },
  {
    id: 'conv3',
    userId: 'u1',
    title: 'Differential diagnosis of acute pelvic pain',
    mode: 'case_assistant',
    bookIds: ['b1', 'b2'],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    tags: ['pelvic pain', 'differential diagnosis', 'emergency'],
    bookmarked: true,
    messages: [],
  },
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1',
    userId: 'u1',
    front: 'What are the classic diagnostic criteria for preeclampsia?',
    back: '**New-onset hypertension** (BP ≥ 140/90 mmHg on two occasions ≥4h apart) after 20 weeks gestation, PLUS one or more of:\n- Proteinuria ≥ 300mg/24h (or PCR ≥ 0.3)\n- Thrombocytopenia (platelets < 100,000/μL)\n- Renal insufficiency (creatinine > 1.1 mg/dL)\n- Impaired liver function (LFTs >2x normal)\n- Pulmonary edema\n- New-onset headache unresponsive to medication, visual symptoms',
    hint: 'Think hypertension + end-organ involvement',
    category: 'Obstetrics',
    tags: ['preeclampsia', 'hypertension', 'diagnosis'],
    difficulty: 'medium',
    nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    interval: 1,
    repetitions: 2,
    easeFactor: 2.5,
    bookId: 'b1',
    bookTitle: 'Williams Obstetrics',
    chapterTitle: 'Preeclampsia',
    pageNumber: 720,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc2',
    userId: 'u1',
    front: 'Mnemonic for HELLP syndrome components',
    back: '**HELLP**:\n- **H**emolysis (microangiopathic hemolytic anemia)\n- **E**levated **L**iver enzymes (AST, ALT > 2x ULN)\n- **L**ow **P**latelets (< 100,000/μL)\n\n*Severe variant: platelets < 50,000/μL*\n*Classified by Mississippi (Class I/II/III) or Tennessee system*',
    category: 'Obstetrics',
    tags: ['HELLP', 'preeclampsia', 'complications', 'mnemonic'],
    difficulty: 'easy',
    nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 3,
    repetitions: 4,
    easeFactor: 2.6,
    bookId: 'b1',
    bookTitle: 'Williams Obstetrics',
    chapterTitle: 'Preeclampsia',
    pageNumber: 756,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc3',
    userId: 'u1',
    front: 'Normal crown-rump length (CRL) at 12 weeks gestation',
    back: '**CRL at 12 weeks = 57–60 mm**\n\nCRL ranges:\n- 6 weeks: 4–6 mm\n- 8 weeks: 14–18 mm\n- 10 weeks: 28–33 mm\n- 12 weeks: 54–62 mm\n\nCRL is the most accurate dating parameter in first trimester (±5 days)',
    category: 'Ultrasound',
    tags: ['ultrasound', 'dating', 'CRL', 'first trimester'],
    difficulty: 'medium',
    nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 2,
    repetitions: 3,
    easeFactor: 2.4,
    bookId: 'b3',
    bookTitle: 'Diagnostic Ultrasound',
    chapterTitle: 'First Trimester Ultrasound',
    pageNumber: 1040,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc4',
    userId: 'u1',
    front: 'What is the Bishop score and its significance?',
    back: '**Bishop Score** assesses cervical favorability for induction of labor.\n\nComponents (0-3 each):\n- **D**ilation (cm)\n- **E**ffacement (%)\n- **S**tation\n- **C**onsistency (firm/medium/soft)\n- **P**osition (posterior/mid/anterior)\n\nInterpretation:\n- ≥ 8: Favorable — induction likely to succeed\n- < 6: Unfavorable — consider cervical ripening\n- 6-7: Intermediate\n\n*Mnemonic: DESCP — Dilation, Effacement, Station, Consistency, Position*',
    category: 'Obstetrics',
    tags: ['bishop score', 'induction', 'labor', 'cervix'],
    difficulty: 'medium',
    nextReview: new Date(Date.now()).toISOString(),
    interval: 1,
    repetitions: 1,
    easeFactor: 2.5,
    bookId: 'b1',
    bookTitle: 'Williams Obstetrics',
    chapterTitle: 'Induction of Labor',
    pageNumber: 543,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc5',
    userId: 'u1',
    front: 'Zones of the placenta on ultrasound (Grannum classification)',
    back: '**Grannum Classification of Placental Maturity:**\n\n- **Grade 0**: Homogeneous, smooth chorionic plate (< 28 weeks)\n- **Grade I**: Subtle indentations in chorionic plate, scattered calcifications\n- **Grade II**: Larger indentations, comma-like calcifications in basal layer\n- **Grade III**: Complete cotyledons with calcified septa, "Swiss cheese" appearance (> 36 weeks)\n\n*Clinical relevance: Grade III before 36 weeks may indicate placental dysfunction*',
    category: 'Ultrasound',
    tags: ['placenta', 'ultrasound', 'grannum', 'maturity'],
    difficulty: 'hard',
    nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 7,
    repetitions: 5,
    easeFactor: 2.8,
    bookId: 'b3',
    bookTitle: 'Diagnostic Ultrasound',
    chapterTitle: 'Obstetric Ultrasound',
    pageNumber: 1089,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const SAMPLE_NOTES: Note[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Preeclampsia - Key Management Points',
    content: '## Management of Preeclampsia\n\n### Definitive Treatment\n- **Delivery is the only cure**\n- Decision depends on gestational age and severity\n\n### Antihypertensive Therapy\n- Target: 130–155/80–105 mmHg\n- IV Labetalol (first-line in acute setting)\n- IV Hydralazine (alternative)\n- Oral Nifedipine (for non-severe, outpatient)\n\n### Seizure Prophylaxis\n- Magnesium Sulfate: 4-6g IV loading, then 1-2g/hr maintenance\n- Monitor for toxicity: loss of patellar reflexes, respiratory depression\n- Antidote: Calcium gluconate 1g IV\n\n### Fetal Surveillance\n- CTG, BPP, Doppler velocimetry\n- Steroid course if < 34 weeks and delivery anticipated',
    tags: ['preeclampsia', 'management', 'magnesium'],
    bookId: 'b1',
    bookTitle: 'Williams Obstetrics',
    chapterTitle: 'Preeclampsia',
    pageNumber: 748,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    bookmarked: true,
    source: 'chat',
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'First Trimester Ultrasound Checklist',
    content: '## First Trimester USG Checklist (11-14 weeks)\n\n### Biometry\n- [ ] Crown-rump length (CRL)\n- [ ] Nuchal translucency (NT) — < 3.5mm normal\n- [ ] Nasal bone (present/absent)\n- [ ] BPD, HC if > 13 weeks\n\n### Fetal Anatomy\n- [ ] Number of fetuses and chorionicity\n- [ ] Cardiac activity and rate\n- [ ] Brain: choroid plexus, posterior fossa\n- [ ] Face: profile, orbits\n- [ ] Spine\n- [ ] Abdominal wall: rule out omphalocele/gastroschisis\n- [ ] Bladder visibility\n- [ ] Limbs\n\n### Uterus and Adnexa\n- [ ] Cervical length\n- [ ] Subchorionic hematoma\n- [ ] Adnexal masses\n- [ ] Fibroids\n\n### Doppler\n- [ ] Uterine artery PI (if screening for PE)',
    tags: ['ultrasound', 'first trimester', 'checklist', 'NT scan'],
    bookId: 'b3',
    bookTitle: 'Diagnostic Ultrasound',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    bookmarked: false,
    source: 'manual',
  },
];

export const SAMPLE_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'ss1',
    userId: 'u1',
    topic: 'Preeclampsia — Pathophysiology, Diagnosis & Management',
    bookId: 'b1',
    bookTitle: 'Williams Obstetrics',
    summary: 'Preeclampsia is a hypertensive disorder of pregnancy characterized by new-onset hypertension after 20 weeks with end-organ involvement. It results from abnormal placentation and subsequent systemic endothelial dysfunction mediated by anti-angiogenic factors.',
    keyPoints: [
      'Preeclampsia affects 2-8% of all pregnancies worldwide',
      'Incomplete spiral artery remodeling is the central pathophysiological event',
      'sFlt-1 and endoglin are key anti-angiogenic mediators',
      'Diagnosis requires BP ≥ 140/90 + end-organ damage after 20 weeks',
      'Magnesium sulfate is the drug of choice for seizure prophylaxis',
      'Delivery is the only definitive treatment',
      'Aspirin 75-150mg from 12-16 weeks reduces risk in high-risk patients',
    ],
    mnemonics: [
      'HELLP = Hemolysis, Elevated Liver enzymes, Low Platelets',
      'Preeclampsia risk factors: PRIMIP — Primiparous, Renal disease, Increased BMI, Multiple gestation, Insulin resistance (diabetes), Prior PE or family history',
    ],
    flashcardsCount: 8,
    citations: [
      {
        bookId: 'b1',
        bookTitle: 'Williams Obstetrics',
        authors: ['Cunningham FG'],
        chapterTitle: 'Preeclampsia',
        pageNumber: 720,
        passage: 'Preeclampsia complicates 2 to 8 percent of pregnancies worldwide.',
        relevanceScore: 0.98,
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const SAMPLE_DIAGRAMS: DiagramData[] = [
  {
    id: 'd1',
    title: 'Pathophysiology of Preeclampsia',
    type: 'flowchart',
    description: 'Cascade from abnormal placentation to clinical manifestations',
    nodes: [
      { id: 'n1', label: 'Abnormal Placentation', type: 'concept', color: '#dc2626', x: 300, y: 50 },
      { id: 'n2', label: 'Incomplete Spiral Artery Remodeling', type: 'process', color: '#f97316', x: 300, y: 150 },
      { id: 'n3', label: 'Placental Ischemia', type: 'outcome', color: '#f97316', x: 300, y: 250 },
      { id: 'n4', label: '↑ sFlt-1 & Endoglin', type: 'process', color: '#7c3aed', x: 150, y: 350 },
      { id: 'n5', label: '↓ VEGF & PlGF', type: 'process', color: '#7c3aed', x: 450, y: 350 },
      { id: 'n6', label: 'Endothelial Dysfunction', type: 'outcome', color: '#1e40af', x: 300, y: 450 },
      { id: 'n7', label: 'Hypertension', type: 'outcome', color: '#059669', x: 100, y: 550 },
      { id: 'n8', label: 'Proteinuria', type: 'outcome', color: '#059669', x: 250, y: 550 },
      { id: 'n9', label: 'Edema', type: 'outcome', color: '#059669', x: 380, y: 550 },
      { id: 'n10', label: 'HELLP / Eclampsia', type: 'outcome', color: '#dc2626', x: 520, y: 550 },
    ],
    edges: [
      { id: 'e1', from: 'n1', to: 'n2', type: 'arrow' },
      { id: 'e2', from: 'n2', to: 'n3', type: 'arrow' },
      { id: 'e3', from: 'n3', to: 'n4', type: 'arrow' },
      { id: 'e4', from: 'n3', to: 'n5', type: 'arrow' },
      { id: 'e5', from: 'n4', to: 'n6', type: 'arrow' },
      { id: 'e6', from: 'n5', to: 'n6', type: 'arrow' },
      { id: 'e7', from: 'n6', to: 'n7', type: 'arrow' },
      { id: 'e8', from: 'n6', to: 'n8', type: 'arrow' },
      { id: 'e9', from: 'n6', to: 'n9', type: 'arrow' },
      { id: 'e10', from: 'n6', to: 'n10', type: 'arrow' },
    ],
  },
];

export const SAMPLE_REPORTS: USGReport[] = [
  {
    id: 'r1',
    userId: 'u1',
    template: 'obstetric_2nd_3rd_trimester',
    templateLabel: 'Obstetric USG — 2nd/3rd Trimester',
    status: 'complete',
    bookmarked: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    sections: [],
    generatedReport: `OBSTETRIC ULTRASONOGRAPHY REPORT

CLINICAL INDICATION:
Antenatal scan at 28 weeks gestation. G2P1 with adequate antenatal care. No known medical comorbidities.

TECHNIQUE:
Real-time B-mode ultrasonography was performed using a curvilinear transducer (3.5-5 MHz). Both transabdominal and translabial approaches were employed as clinically indicated. All standard fetal biometric planes were obtained.

FINDINGS:

Fetal Lie and Presentation:
Single live intrauterine fetus in longitudinal lie with cephalic presentation. Fetal cardiac activity is confirmed with heart rate of 142 beats per minute, regular in rhythm.

Biometry:
• Biparietal Diameter (BPD): 71 mm
• Head Circumference (HC): 262 mm
• Abdominal Circumference (AC): 246 mm
• Femur Length (FL): 53 mm
• Estimated Gestational Age: 28 weeks 2 days (±10 days)
• Estimated Fetal Weight (Hadlock formula): 1,142 grams (24th centile)

Amniotic Fluid:
Amniotic fluid volume appears adequate. Amniotic Fluid Index (AFI): 14.2 cm (normal: 8–24 cm).

Placenta:
Posterior placenta, Grade I maturity, with adequate distance from internal os (>2 cm). No evidence of placenta previa.

Fetal Anatomy Survey:
• Central Nervous System: Cavum septi pellucidi visualized. Cerebellum and cisterna magna appear normal. No ventriculomegaly.
• Cardiac: Four-chamber view satisfactory. Outflow tracts appear normal.
• Abdominal Wall: Intact. Stomach bubble visible. Cord insertion normal.
• Renal System: Both kidneys visualized. Bladder visualized and filling normally.
• Skeletal: All four limbs identified. No obvious skeletal dysplasia.
• Face: Facial profile normal. Lips intact bilaterally.

Umbilical Cord Doppler:
Umbilical artery S/D ratio: 2.8 (normal for gestational age).
No absent or reversed end-diastolic flow.

IMPRESSION:
1. Single live intrauterine pregnancy corresponding to 28 weeks 2 days by biometry, consistent with stated LMP (28 weeks 0 days).
2. Fetal weight estimated at 1,142 grams — appropriate for gestational age.
3. Amniotic fluid volume normal.
4. Posterior placenta, Grade I, no previa.
5. Fetal anatomy survey: no gross anomaly detected on this examination.
6. Umbilical artery Doppler: normal waveform.

RECOMMENDATION:
Repeat growth scan at 32 weeks gestation. Continue routine antenatal surveillance.

DISCLAIMER: This report is generated with AI assistance based on textbook references and is intended for educational/drafting purposes only. Final report must be reviewed, verified, and authorized by the responsible clinician/radiologist before clinical use.`,
  },
];
