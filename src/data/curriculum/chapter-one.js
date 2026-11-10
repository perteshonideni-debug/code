import { createLearningModule, createTopic } from './learning-schema.js';

const explanation = (id, title, lede, term, definition, paragraphs, code, lineNotes, mistake, check, answer, options, prediction) => ({
  id, type: 'lesson', title, duration: '7–10 min', lede, objectives: [definition], term, definition,
  content: [
    { type: 'definition', term, text: definition },
    ...paragraphs.map(text => ({ type: 'paragraph', text })),
    { type: 'syntax', code: code.split('\n').slice(0, 2).join('\n') },
    { type: 'code', caption: 'Shembull i plotë Python', code, explanations: lineNotes },
    { type: 'mistake', title: 'Gabim i zakonshëm', text: mistake }
  ],
  knowledgeCheck: { id: `${id}-kuptim`, type: 'Kuptimi i konceptit', prompt: check, answer, options, explanation: `Përgjigjja e saktë është: ${answer}` },
  predictionQuestion: { id: `${id}-parashikim`, type: 'Parashiko daljen', prompt: prediction.prompt, answer: prediction.answer, options: prediction.options, explanation: prediction.explanation },
  interactiveExample: { prompt: 'Ndrysho vlerat, ekzekuto kodin dhe krahaso daljen me atë që prisje.', starterCode: code, changedFromExample: code }
});

const contracts = [
  {
    id: 'problem-steps', title: 'Hyrje, përpunim dhe dalje', prerequisites: [], lessonIds: ['what-is-programming'],
    example: { inputs: ['numri i faqeve'], process: ['shumëzo faqet me 2'], result: 'minutat e leximit' },
    variants: [
      { title: 'Planifiko kohën e leximit', instructions: 'Përcakto vlerat `pages`, `minutes_per_page`, `total_minutes` dhe `report`. Raporti duhet të shpjegojë numrin e faqeve dhe minutat gjithsej.', code: 'pages = 12\nminutes_per_page = 2\ntotal_minutes = pages * minutes_per_page\nreport = f"{pages} faqe kërkojnë {total_minutes} minuta"', checks: [['Numri i faqeve ruhet', 'assert pages == 12', 'Kontrollo vlerën e ruajtur te pages.'], ['Përpunimi shumëzon faqet me minutat për faqe', 'assert total_minutes == 24', 'Shumëzo pages me minutes_per_page.'], ['Dalja përmbledh llogaritjen', 'assert report == "12 faqe kërkojnë 24 minuta"', 'Përdor një f-string që përfshin të dy rezultatet.']] },
      { title: 'Planifiko ujë për ecjen', instructions: 'Përcakto `hours`, `bottles_per_hour`, `bottles_needed` dhe `report`. Llogarit shishet gjithsej dhe shkruaj një përmbledhje të lexueshme.', code: 'hours = 3\nbottles_per_hour = 1\nbottles_needed = hours * bottles_per_hour\nreport = f"Për {hours} orë duhen {bottles_needed} shishe"', checks: [['Kohëzgjatja ruhet', 'assert hours == 3', 'Sigurohu që hours përmban numrin e orëve.'], ['Sasia e shisheve llogaritet', 'assert bottles_needed == 3', 'Shumëzo orët me shishet për orë.'], ['Përmbledhja përputhet me rezultatin', 'assert report == "Për 3 orë duhen 3 shishe"', 'Përfshi vlerat në një fjali.']] }
    ]
  },
  {
    id: 'python-scripts', title: 'Python, interpretuesi dhe skriptet', prerequisites: ['problem-steps'], lessonIds: ['what-is-python', 'interpreter-and-scripts'],
    example: { inputs: ['skedari hello.py'], process: ['interpretuesi lexon rreshtat sipas radhës'], result: 'teksti i shtypur' },
    variants: [
      { title: 'Krijo një përshëndetje kursi', instructions: 'Në një skript, ruaj emrin e kursit te `course` dhe numrin te `lesson_number`. Ndërto tekstin e kërkuar te `summary` dhe shfaqe me `print()`.', code: 'course = "Python"\nlesson_number = 2\nsummary = f"Mësimi {lesson_number}: {course}"\nprint(summary)', checks: [['Përmbledhja përmban të dhënat e skriptit', 'assert summary == "Mësimi 2: Python"', 'Kontrollo rendin, hapësirat dhe pikësimin.'], ['Përmbledhja është tekst', 'assert isinstance(summary, str)', 'Një f-string krijon vlerë str.']] },
      { title: 'Shkruaj statusin e programit', instructions: 'Ruaj `program_name` dhe `status_code`. Krijo `status_message` që përfshin të dyja vlerat dhe shfaqe.', code: 'program_name = "Planifikuesi"\nstatus_code = 1\nstatus_message = f"{program_name}: gjendja {status_code}"\nprint(status_message)', checks: [['Emri i programit ruhet', 'assert program_name == "Planifikuesi"', 'Përdor vlerën e kërkuar për emrin.'], ['Mesazhi përfshin kodin e gjendjes', 'assert status_message == "Planifikuesi: gjendja 1"', 'Vendos të dy ndryshoret në f-string.']] }
    ]
  },
  {
    id: 'variables-values', title: 'Ndryshoret dhe vlerat', prerequisites: ['python-scripts'], lessonIds: ['variables'],
    example: { inputs: ['çmimi dhe sasia'], process: ['caktimi i një vlere te një emër'], result: 'vlera që mund të përdoret përsëri' },
    variants: [
      { title: 'Ruaj të dhënat e një libri', instructions: 'Krijo `book_title`, `page_count` dhe `book_label`. Etiketa duhet të përmbajë titullin dhe numrin e faqeve.', code: 'book_title = "Python për fillestarë"\npage_count = 180\nbook_label = f"{book_title} — {page_count} faqe"', checks: [['Titulli ruhet si tekst', 'assert book_title == "Python për fillestarë" and isinstance(book_title, str)', 'Emri përshkrues book_title duhet të ruajë titullin.'], ['Numri i faqeve ruhet si numër i plotë', 'assert page_count == 180 and isinstance(page_count, int)', 'Një numër i plotë shkruhet pa presje dhjetore.'], ['Etiketa përdor vlerat e ruajtura', 'assert book_label == "Python për fillestarë — 180 faqe"', 'Ndërto etiketën pasi të kesh caktuar të dy vlerat.']] },
      { title: 'Ruaj të dhënat e një kursi', instructions: 'Krijo `course_name`, `lesson_count` dhe `course_label`. Etiketa duhet të përmbajë emrin dhe numrin e mësimeve.', code: 'course_name = "Python"\nlesson_count = 8\ncourse_label = f"{course_name}: {lesson_count} mësime"', checks: [['Emri ruhet', 'assert course_name == "Python"', 'Cakto tekstin te course_name.'], ['Numri ruhet si int', 'assert lesson_count == 8 and isinstance(lesson_count, int)', 'Mos e vendos numrin brenda thonjëzave.'], ['Etiketa përmbledh kursin', 'assert course_label == "Python: 8 mësime"', 'Përdor f-string-un për të futur vlerat.']] }
    ]
  },
  {
    id: 'built-in-types', title: 'Llojet bazë të vlerave', prerequisites: ['variables-values'], lessonIds: ['built-in-types'],
    example: { inputs: ['numër, çmim dhjetor, tekst, gjendje'], process: ['Python ruan lloje të ndryshme'], result: 'lloji përcakton veprimet e vlefshme' },
    variants: [
      { title: 'Kthe tekstin në numër', instructions: 'Kthe `age_text` në `age` me `int()`. Krijo `is_adult` si rezultat Boolean i krahasimit me 18.', code: 'age_text = "21"\nage = int(age_text)\nis_adult = age >= 18', checks: [['Teksti kthehet në int', 'assert age == 21 and isinstance(age, int)', 'Përdor int(age_text), sepse hyrja është tekst.'], ['Krahasimi prodhon bool', 'assert is_adult is True and isinstance(is_adult, bool)', 'Ruaj drejtpërdrejt rezultatin e >= 18.']] },
      { title: 'Dallo numrin dhe çmimin', instructions: 'Krijo `item_count` si numër të plotë, `unit_price` si numër dhjetor dhe `available` si Boolean.', code: 'item_count = 4\nunit_price = 2.5\navailable = True', checks: [['Sasia është int', 'assert isinstance(item_count, int) and item_count == 4', 'Përdor një numër të plotë pa thonjëza.'], ['Çmimi është float', 'assert isinstance(unit_price, float) and unit_price == 2.5', 'Pika dhjetore krijon një vlerë float.'], ['Gjendja është bool', 'assert isinstance(available, bool) and available is True', 'True është vlerë Boolean, jo tekst.']] }
    ]
  },
  {
    id: 'numeric-operations', title: 'Veprimet dhe llogaritjet', prerequisites: ['built-in-types'], lessonIds: ['arithmetic-and-operators'],
    example: { inputs: ['çmimi për njësi, sasia, tarifa'], process: ['shumëzo dhe pastaj mblidh'], result: 'nëntotali dhe totali' },
    variants: [
      { title: 'Llogarit një porosi librash', instructions: 'Përdor `unit_price`, `quantity` dhe `delivery` për të llogaritur `subtotal` dhe `total`. Tarifa shtohet vetëm një herë.', code: 'unit_price = 4.5\nquantity = 3\ndelivery = 2\nsubtotal = unit_price * quantity\ntotal = subtotal + delivery', checks: [['Nëntotali shumëzon çmimin me sasinë', 'assert subtotal == 13.5', 'Shumëzo unit_price me quantity.'], ['Totali përfshin tarifën një herë', 'assert total == 15.5', 'Shto delivery te subtotal, jo te çmimi për njësi.']] },
      { title: 'Kthe minutat në sekonda', instructions: 'Përdor `minutes` për të llogaritur `seconds`. Pastaj llogarit sa sekonda mbeten pas një pushimi te `remaining_seconds`.', code: 'minutes = 7\nseconds = minutes * 60\nbreak_seconds = 30\nremaining_seconds = seconds - break_seconds', checks: [['Minutat kthehen në sekonda', 'assert seconds == 420', 'Një minutë ka 60 sekonda.'], ['Pushimi zbritet nga koha', 'assert remaining_seconds == 390', 'Zbrit break_seconds nga seconds.']] }
    ]
  },
  {
    id: 'strings-formatting', title: 'Stringjet dhe formatimi', prerequisites: ['numeric-operations'], lessonIds: ['strings-and-formatting'],
    example: { inputs: ['emër me hapësira anësore'], process: ['strip() kthen tekst të pastruar'], result: 'f-string krijon mesazh të lexueshëm' },
    variants: [
      { title: 'Përshëndet një lexues', instructions: 'Pastro `name` me `strip()` dhe krijo `greeting` me formatin `Mirë se erdhe, EMRI!`. Ruaje rezultatin.', code: 'name = "  Mira  "\nclean_name = name.strip()\ngreeting = f"Mirë se erdhe, {clean_name}!"', checks: [['Hapësirat e emrit hiqen', 'assert clean_name == "Mira"', 'Metoda strip() kthen tekst pa hapësirat në skaje.'], ['Përshëndetja formatohet saktë', 'assert greeting == "Mirë se erdhe, Mira!"', 'Përdor vlerën e pastruar brenda f-string-ut.']] },
      { title: 'Formato një titull', instructions: 'Ruaj tekstin origjinal te `topic`, krijo `clean_topic` me shkronja të vogla dhe përgatit `label` që nis me `Tema:`.', code: 'topic = "  PYTHON  "\nclean_topic = topic.strip().lower()\nlabel = f"Tema: {clean_topic}"', checks: [['Teksti normalizohet', 'assert clean_topic == "python"', 'Zinxhiri strip().lower() krijon një tekst të ri.'], ['Etiketa përmban temën e pastruar', 'assert label == "Tema: python"', 'Përdor clean_topic dhe jo vlerën me hapësira.']] }
    ]
  },
  {
    id: 'input-output', title: 'Hyrja, përpunimi dhe dalja', prerequisites: ['strings-formatting'], lessonIds: ['input-and-output'],
    example: { inputs: ['teksti i futur nga përdoruesi'], process: ['konvertoje në numër, kryej llogaritjen'], result: 'print() shfaq përgjigjen' },
    variants: [
      { title: 'Llogarit sasinë e kutive', instructions: 'Simulo vlerën që do të vinte nga input-i me `raw_boxes = "4"`. Ktheje në `boxes`, llogarit `item_total` me 6 artikuj për kuti dhe krijo `message`.', code: 'raw_boxes = "4"\nboxes = int(raw_boxes)\nitem_total = boxes * 6\nmessage = f"{boxes} kuti përmbajnë {item_total} artikuj"\nprint(message)', checks: [['Teksti i hyrjes kthehet në int', 'assert boxes == 4 and isinstance(boxes, int)', 'input() kthen str; përdor int() para llogaritjes.'], ['Përpunimi llogarit artikujt gjithsej', 'assert item_total == 24', 'Shumëzo numrin e kutive me gjashtë.'], ['Dalja paraqet përgjigjen', 'assert message == "4 kuti përmbajnë 24 artikuj"', 'Formatimi duhet të përdorë vlerat e llogaritura.']] },
      { title: 'Përgatit një përmbledhje kohe', instructions: 'Simulo hyrjen `raw_minutes = "12"`, ktheje në `minutes`, llogarit `seconds` dhe ruaj tekstin te `summary`.', code: 'raw_minutes = "12"\nminutes = int(raw_minutes)\nseconds = minutes * 60\nsummary = f"{minutes} minuta janë {seconds} sekonda"', checks: [['Minutat janë vlerë numerike', 'assert minutes == 12 and isinstance(minutes, int)', 'Ktheje tekstin me int().'], ['Konvertimi bëhet saktë', 'assert seconds == 720', 'Shumëzo minutat me 60.'], ['Përmbledhja është e lexueshme', 'assert summary == "12 minuta janë 720 sekonda"', 'Përdor f-string me vlerat përfundimtare.']] }
    ]
  }
];

const levelInstructions = [
  'Ndiq rreshtat e dhënë dhe plotëso pjesën e shënuar.',
  'Përdor të dhënat fillestare dhe shkruaj vetë shprehjet që mungojnë.',
  'Lexo kërkesat dhe ndërto zgjidhjen pa kod të gatshëm.',
  'Zgjidh vetë rendin e hapave dhe kontrollo edhe një rast tjetër.',
  'Shkruaj programin nga një editor bosh; përdor hint vetëm kur të duhet.'
];
const levelHints = [
  ['Gjej emrat e vlerave të kërkuara.', 'Krahaso çdo ndryshore me kërkesën e testit.'],
  ['Shkruaj fillimisht caktimet e vlerave.', 'Ekzekuto testet për të parë cilin rezultat duhet kontrolluar.'],
  ['Ndaje problemin në hyrje, përpunim dhe dalje.', 'Emrat e ndryshoreve mund të pasqyrojnë secilin hap.'],
  ['Provo ta gjurmosh çdo vlerë pas një rreshti.', 'Kontrollo veçanërisht llojin dhe kufijtë e vlerave.'],
  ['Rilexo shembullin e plotë dhe identifiko modelin.', 'Përdor testet si kërkesa të matshme, jo si zgjidhje.']
];
const seeds = {
  'problem-steps': ['pages = 12\nminutes_per_page = 2\n', 'hours = 3\nbottles_per_hour = 1\n'],
  'python-scripts': ['course = "Python"\nlesson_number = 2\n', 'program_name = "Planifikuesi"\nstatus_code = 1\n'],
  'variables-values': ['book_title = "Python për fillestarë"\npage_count = 180\n', 'course_name = "Python"\nlesson_count = 8\n'],
  'built-in-types': ['age_text = "21"\n', 'item_count = 4\nunit_price = 2.5\n'],
  'numeric-operations': ['unit_price = 4.5\nquantity = 3\ndelivery = 2\n', 'minutes = 7\nbreak_seconds = 30\n'],
  'strings-formatting': ['name = "  Mira  "\n', 'topic = "  PYTHON  "\n'],
  'input-output': ['raw_boxes = "4"\n', 'raw_minutes = "12"\n']
};

function makeLevel(topic, levelIndex) {
  const levelData = topic.variants.map((variant, variantIndex) => {
    const seedCode = seeds[topic.id][variantIndex];
    const starterCode = levelIndex === 0 ? seedCode : levelIndex === 1 ? seedCode.split('\n')[0] + '\n' : '';
    return {
      id: `${topic.id}-l${levelIndex + 1}-exercise-${variantIndex + 1}`,
      title: variant.title,
      instructions: `${levelInstructions[levelIndex]} ${variant.instructions} Vlerat fillestare: ${seedCode.split('\n').filter(Boolean).join('; ')}.`,
      description: variant.instructions,
      starterCode,
      hints: levelHints[levelIndex],
      checks: variant.checks.map(([label, code, feedback]) => ({ kind: 'behavior', label, code, feedback })),
      levelId: ['beginner', 'basic', 'intermediate', 'advanced', 'independent'][levelIndex],
      levelTitle: ['Fillestar', 'Bazë', 'Ndërmjetëm', 'I avancuar', 'Praktikë e pavarur'][levelIndex],
      independence: ['Shembuj të plotë dhe udhëzime të drejtpërdrejta.', 'Kod fillestar i pjesshëm dhe kërkesa të qarta.', 'Skelet i shkurtër; nxënësi zgjedh hapat.', 'Pak orientim; përfshihen raste kufitare.', 'Pa zgjidhje të nisur; kërkohen vendime të pavarura.'][levelIndex],
      topicId: topic.id,
      topicTitle: topic.title
    };
  });
  return { exercises: levelData };
}

export const chapterOneModules = [
  createLearningModule({ id: 'hapat-e-pare', title: 'Hapat e parë', topics: [
    createTopic({ id: contracts[0].id, title: contracts[0].title, prerequisites: contracts[0].prerequisites, lessons: contracts[0].lessonIds, levels: [0, 1, 2, 3, 4].map(i => makeLevel(contracts[0], i)) }),
    createTopic({ id: contracts[1].id, title: contracts[1].title, prerequisites: contracts[1].prerequisites, lessons: contracts[1].lessonIds, levels: [0, 1, 2, 3, 4].map(i => makeLevel(contracts[1], i)) })
  ], blocks: [
    { id: 'lecture-programming', type: 'lecture', title: 'Programimi: hyrje, përpunim dhe dalje' },
    { id: 'lecture-python', type: 'lecture', title: 'Python dhe interpretuesi' },
    { id: 'lecture-script', type: 'lecture', title: 'Skriptet Python' },
    { id: 'quiz-first-steps', type: 'quiz', title: 'Kontrollo hapat e parë' }
  ] }),
  createLearningModule({ id: 'vlerat-dhe-llojet', title: 'Vlerat dhe llojet', prerequisites: ['hapat-e-pare'], topics: [
    ...contracts.slice(2, 4).map(topic => createTopic({ id: topic.id, title: topic.title, prerequisites: topic.prerequisites, lessons: topic.lessonIds, levels: [0, 1, 2, 3, 4].map(i => makeLevel(topic, i)) }))
  ], blocks: [
    { id: 'lecture-variables', type: 'lecture', title: 'Ndryshoret dhe caktimi i vlerave' },
    { id: 'lecture-types', type: 'lecture', title: 'Llojet bazë të vlerave' },
    { id: 'workshop-course-report', type: 'workshop', title: 'Workshop: Ndërto raportin e kursit' },
    { id: 'lab-variable-practice', type: 'lab', title: 'Laborator: Përdor të dhënat e kursit' },
    { id: 'review-values', type: 'review', title: 'Përsëritje: Vlerat dhe ndryshoret' }
  ] }),
  createLearningModule({ id: 'llogaritjet-dhe-teksti', title: 'Llogaritjet dhe teksti', prerequisites: ['vlerat-dhe-llojet'], topics: [
    ...contracts.slice(4, 6).map(topic => createTopic({ id: topic.id, title: topic.title, prerequisites: topic.prerequisites, lessons: topic.lessonIds, levels: [0, 1, 2, 3, 4].map(i => makeLevel(topic, i)) }))
  ], blocks: [
    { id: 'lecture-numeric', type: 'lecture', title: 'Veprimet dhe llogaritjet' },
    { id: 'lecture-strings', type: 'lecture', title: 'Stringjet dhe formatimi' },
    { id: 'game-numbers-and-strings', type: 'game', title: 'Misioni i planifikuesit Python' }
  ] }),
  createLearningModule({ id: 'nderveprimi', title: 'Ndërveprimi me programin', prerequisites: ['llogaritjet-dhe-teksti'], topics: [
    createTopic({ id: contracts[6].id, title: contracts[6].title, prerequisites: contracts[6].prerequisites, lessons: contracts[6].lessonIds, levels: [0, 1, 2, 3, 4].map(i => makeLevel(contracts[6], i)) })
  ], blocks: [
    { id: 'lecture-input-output', type: 'lecture', title: 'Hyrja, përpunimi dhe dalja' },
    { id: 'lab-course-planner', type: 'lab', title: 'Laborator: Përmblidh planin e kursit' },
    { id: 'project-course-planner', type: 'project', title: 'Projekt: Planifikuesi i një kursi' },
    { id: 'review-python-basics', type: 'review', title: 'Përsëritje: Bazat e Python-it' },
    { id: 'quiz-python-basics', type: 'quiz', title: 'Kuiz: Bazat e Python-it' }
  ] })
];

const lessonData = [
  explanation('what-is-programming', 'Programimi: hyrje, përpunim dhe dalje', 'Shndërro një problem në hapa të qartë që kompjuteri mund t’i zbatojë.', 'Program', 'Një varg udhëzimesh të sakta që përpunojnë të dhëna dhe prodhojnë rezultat.', ['Një program fillon me një nevojë: çfarë informacioni kemi dhe çfarë duam të dimë?', 'Mendo për tre pjesë: hyrja janë të dhënat; përpunimi zbaton rregullat; dalja është rezultati i dobishëm.', 'Python i kryen udhëzimet në rendin që janë shkruar, përveç kur një strukturë tjetër ndryshon rrjedhën.'], 'pages = 12\nminutes_per_page = 2\ntotal_minutes = pages * minutes_per_page\nprint(f"Koha: {total_minutes} minuta")', ['Ruajmë numrin e faqeve në një emër përshkrues.', 'Ruajmë kohën e parashikuar për secilën faqe.', 'Përpunimi shumëzon dy vlera numerike.', 'print() paraqet rezultatin e llogaritjes.'], 'Të kalosh direkt te kodi pa përcaktuar hyrjen dhe rezultatin mund të krijojë hapa të panevojshëm. Shkruaj fillimisht çfarë hyn dhe çfarë duhet të dalë.', 'Cilat janë tri pjesët e zakonshme të një programi?', 'Hyrja, përpunimi dhe dalja.', ['Hyrja, përpunimi dhe dalja.', 'Klasa, objekti dhe metoda.', 'Cikli, kushti dhe përjashtimi.'], { prompt: 'Çfarë shfaqet nga `print(3 * 4)`?', answer: '12', options: ['12', '34', '3 * 4'], explanation: 'Shenjëzimi * kryen shumëzimin para se print të shfaqë rezultatin.' }),
  explanation('what-is-python', 'Python dhe ekzekutimi i kodit', 'Njih gjuhën dhe procesin që e kthen kodin në sjellje të programit.', 'Interpretues', 'Program që lexon kodin Python dhe ekzekuton udhëzimet e tij.', ['Python është gjuhë programimi me përdorim të gjerë, me sintaksë të lexueshme.', 'Kodi burimor përmban udhëzimet që shkruajmë. Interpretuesi i analizon dhe i ekzekuton.', 'Një gabim sintakse do të thotë se shkrimi nuk përputhet me rregullat e Python-it; gabimi duhet lexuar para se të ndryshosh kodin.'], 'language = "Python"\nprint(language)', ['Caktojmë një tekst te ndryshorja language.', 'print() shfaq vlerën që mbahet në atë emër.'], 'Mos i ngatërro kodin burimor me daljen e tij: rreshti print është udhëzim, ndërsa teksti i shfaqur është rezultat.', 'Çfarë bën interpretuesi Python?', 'Lexon dhe ekzekuton udhëzimet Python.', ['Lexon dhe ekzekuton udhëzimet Python.', 'Ruajt përgjithmonë çdo ndryshore.', 'I kthen të gjitha vlerat në tekst.'], { prompt: 'Çfarë shfaq ky kod?\n`language = "Python"`\n`print(language)`', answer: 'Python', options: ['Python', 'language', 'Nuk shfaq asgjë'], explanation: 'print merr vlerën e ndryshores dhe e shkruan në dalje.' }),
  explanation('interpreter-and-scripts', 'Ndërveprimi me interpretuesin dhe skriptet', 'Krahaso ekzekutimin e një rreshti me ekzekutimin e një skedari të plotë.', 'Skript', 'Skedar me prapashtesën .py që përmban udhëzime Python të ekzekutuara sipas radhës.', ['Në një sesion ndërveprues mund të provosh një shprehje dhe të shohësh menjëherë rezultatin.', 'Në një skript ruan disa rreshta në një skedar `.py`; interpretuesi i ekzekuton nga lart poshtë.', 'Të dyja mënyrat përdorin të njëjtat rregulla Python. Skriptet janë të dobishme kur dëshiron ta ruash dhe përsërisësh një program.'], 'message = "Përshëndetje nga skripti"\nprint(message)', ['Caktojmë tekstin në një emër që shpjegon përmbajtjen.', 'Skriptit i kërkohet ta shfaqë atë vlerë.'], 'Ruajtja e skedarit nuk e ekzekuton vetvetiu programin. Duhet ta nisësh interpretuesin ose ta ekzekutosh në mjedisin e kodimit.', 'Cili është ndryshimi kryesor mes sesionit ndërveprues dhe skriptit?', 'Njëri vlerëson hyrjet një nga një; tjetri ekzekuton kod të ruajtur.', ['Njëri vlerëson hyrjet një nga një; tjetri ekzekuton kod të ruajtur.', 'Skriptet përdorin gjuhë tjetër.', 'Sesioni ndërveprues nuk mund të ekzekutojë Python.'], { prompt: 'Në çfarë radhe ekzekutohen rreshtat e një skripti të zakonshëm?', answer: 'Nga lart poshtë', options: ['Nga lart poshtë', 'Nga poshtë lart', 'Në rend të rastësishëm'], explanation: 'Python ekzekuton udhëzimet njëri pas tjetrit, përveç kur kontrolli i programit e ndryshon rrjedhën.' }),
  explanation('variables', 'Ndryshoret dhe caktimi i vlerave', 'Përdor emra të qartë për të ruajtur dhe ripërdorur të dhënat.', 'Ndryshore', 'Një emër që lidhet me një vlerë, në mënyrë që programi ta përdorë përsëri.', ['Në `pages = 180`, emri pages lidhet me vlerën në anën e djathtë të operatorit `=`.', 'Caktimi nuk do të thotë barazi matematikore. Ai vendos një vlerë te një emër dhe mund ta zëvendësojë vlerën e mëparshme.', 'Për emra të lexueshëm, Python zakonisht përdor shkronja të vogla dhe nënvijëzim, si `page_count`.'], 'book_title = "Python për fillestarë"\npage_count = 180\nprint(book_title, page_count)', ['Vlera tekstuale vendoset te book_title.', 'Vlera e plotë vendoset te page_count.', 'print paraqet të dy vlerat, të ndara me hapësirë.'], 'Emrat si x fshehin kuptimin. Zgjidh një emër që shpjegon çfarë përfaqëson vlera.', 'Çfarë bën shprehja `lesson_count = 4`?', 'Lidh emrin lesson_count me vlerën 4.', ['Lidh emrin lesson_count me vlerën 4.', 'Kontrollon nëse lesson_count është i barabartë me 4.', 'Krijon një funksion.'], { prompt: 'Çfarë shfaqet?\n`pages = 10`\n`pages = pages + 2`\n`print(pages)`', answer: '12', options: ['12', '10', 'pages + 2'], explanation: 'Vlera e re llogaritet nga vlera e vjetër dhe më pas caktohet përsëri te pages.' }),
  explanation('built-in-types', 'Numrat, tekstet dhe Boolean-et', 'Zgjidh llojin që përputhet me kuptimin e të dhënës.', 'Lloj i të dhënës', 'Klasifikim që përcakton çfarë vlere ruhet dhe cilat veprime kanë kuptim për të.', ['`int` ruan numra të plotë; `float` numra dhjetorë; `str` tekst; `bool` një vlerë True ose False.', 'Llojet ndikojnë te veprimet. Mbledhja e numrave kryen llogaritje; mbledhja e stringjeve bashkon tekstin.', 'Funksioni `type()` tregon llojin. `int("18")` konverton tekstin me shifra në numër të plotë.'], 'age_text = "18"\nage = int(age_text)\nis_adult = age >= 18\nprint(type(age).__name__, is_adult)', ['age_text fillon si tekst sepse është brenda thonjëzave.', 'int() prodhon një numër të plotë.', 'Krahasimi >= jep një vlerë Boolean.', 'Dalja përmban emrin e llojit dhe gjendjen.'], 'Mos krahaso një numër me tekst pa e konvertuar. Gjithashtu, `True` nuk është e njëjta gjë me tekstin `"True"`.', 'Cili lloj përfaqëson nëse një përdorues është aktiv?', 'bool', ['bool', 'float', 'str'], { prompt: 'Çfarë shfaq `print(type(2.5).__name__)`?', answer: 'float', options: ['float', 'int', 'str'], explanation: 'Pika dhjetore e bën 2.5 një vlerë të llojit float.' }),
  explanation('arithmetic-and-operators', 'Veprimet aritmetike dhe përparësia', 'Kryej llogaritje dhe bëje të qartë rendin e tyre.', 'Përparësi operatorësh', 'Rregullat që përcaktojnë se cilat veprime kryhen së pari në një shprehje.', ['Python përdor `+`, `-`, `*`, `/`, `//`, `%` dhe `**` për veprime numerike.', 'Shumëzimi dhe pjesëtimi kryhen para mbledhjes e zbritjes. Kllapat lejojnë të shprehësh rendin që kërkon.', 'Pjesëtimi `/` jep zakonisht float; `//` jep pjesëtimin në dysheme; `%` jep mbetjen.'], 'price = 4.5\nquantity = 3\ndelivery = 2\nsubtotal = price * quantity\ntotal = subtotal + delivery\nprint(total)', ['Ruajmë çmimin për njësi.', 'Ruajmë sasinë.', 'Ruajmë tarifën fikse të dërgesës.', 'Llogarisim nëntotalin duke shumëzuar.', 'Shtojmë dërgesën vetëm një herë.', 'Shfaqim totalin.'], 'Mos shto tarifën për çdo njësi nëse ajo aplikohet vetëm një herë. Përdor kllapa kur shprehja bëhet e vështirë për t’u lexuar.', 'Sa është `2 + 3 * 4`?', '14', ['14', '20', '24'], { prompt: 'Çfarë shfaq `print(17 % 5)`?', answer: '2', options: ['2', '3', '3.4'], explanation: '% jep mbetjen pasi 17 pjesëtohet me 5.' }),
  explanation('strings-and-formatting', 'Stringjet dhe f-string-et', 'Puno me tekst dhe paraqit vlerat në mesazhe të qarta.', 'String', 'Një sekuencë karakteresh e vendosur brenda thonjëzave që përputhen.', ['Stringjet mund të shkruhen me thonjëza teke ose dyshe. Metoda si `strip()` dhe `lower()` kthejnë një string të ri.', 'F-string-u nis me shkronjën `f`; shprehjet brenda kllapave kaçurrela `{}` llogariten dhe vendosen në tekst.', 'Stringjet janë të pandryshueshme: metodat krijojnë rezultat të ri. Ruaje në një ndryshore ose përdore drejtpërdrejt.'], 'name = "  Mira  "\nclean_name = name.strip()\ngreeting = f"Përshëndetje, {clean_name}!"\nprint(greeting)', ['Ruajmë tekstin, përfshirë hapësirat anësore.', 'strip() krijon një vlerë të re pa hapësirat në skaje.', 'F-string-u fut emrin e pastruar në mesazh.', 'print() shfaq përshëndetjen.'], 'Thirrja `name.strip()` nuk e ndryshon vetë vlerën name. Ruaje rezultatin nëse duhet përdorur më vonë.', 'Çfarë bën f-string-u?', 'Fut vlerat e shprehjeve brenda tekstit.', ['Fut vlerat e shprehjeve brenda tekstit.', 'Kthen çdo vlerë në numër.', 'Ekzekuton vetëm komente.'], { prompt: 'Çfarë shfaq `name = "Ada"` dhe `print(f"Përshëndetje, {name}!")`?', answer: 'Përshëndetje, Ada!', options: ['Përshëndetje, Ada!', 'Përshëndetje, {name}!', 'Ada'], explanation: 'F-string-u vlerëson name brenda kllapave kaçurrela.' }),
  explanation('input-and-output', 'Hyrja, përpunimi dhe dalja', 'Lidh vlerat e një hyrjeje me përpunimin dhe përgjigjen e programit.', 'Hyrje', 'Të dhëna që programi merr nga përdoruesi, një program tjetër ose një burim të ruajtur.', ['`input()` shfaq një kërkesë opsionale dhe kthen gjithmonë `str`, edhe nëse përdoruesi shkruan shifra.', 'Konverto hyrjen me `int()` ose `float()` para llogaritjeve. Pastaj ruaj daljen dhe shfaq një përgjigje me `print()`.', 'Ndarja e hyrjes, përpunimit dhe daljes e bën kodin më të lehtë për t’u gjurmuar dhe testuar.'], 'raw_minutes = "12"\nminutes = int(raw_minutes)\nseconds = minutes * 60\nprint(f"{minutes} minuta = {seconds} sekonda")', ['Ky tekst përfaqëson atë që ktheu input().', 'Konvertojmë tekstin në numër të plotë.', 'Kryejmë përpunimin numerik.', 'Paraqesim një përgjigje me vlerat e llogaritura.'], 'Mos supozo se input() kthen numër. Rezultati i tij është tekst dhe duhet konvertuar para aritmetikës.', 'Çfarë lloji kthen `input()`?', 'str', ['str', 'int', 'bool'], { prompt: 'Nëse `raw = "5"` dhe `count = int(raw)`, çfarë vlere ka count?', answer: '5 si int', options: ['5 si int', '"5" si str', 'False'], explanation: 'int() konverton tekstin numerik "5" në numrin e plotë 5.' })
];

export const chapterOneLessons = lessonData;

export const chapterOneQuestions = lessonData.flatMap(lesson => [lesson.knowledgeCheck, lesson.predictionQuestion]);

export const chapterOneExample = {
  title: 'Nga hyrja te një plan leximi',
  prompt: 'Ndrysho vlerat, ekzekuto shembullin dhe krahaso rezultatin me parashikimin tënd.',
  code: 'course = "Python"\nlesson_count = 4\nminutes_per_lesson = 12\ntotal_minutes = lesson_count * minutes_per_lesson\nsummary = f"{course}: {lesson_count} mësime, {total_minutes} minuta"\nprint(summary)',
  explanations: ['Ruajmë emrin e kursit si tekst.', 'Ruajmë numrin e mësimeve si int.', 'Ruajmë kohëzgjatjen e secilit mësim.', 'Llogarisim kohën totale duke shumëzuar.', 'F-string-u ndërthur vlerat në një fjali.', 'print() shfaq përmbledhjen.'],
  output: 'Python: 4 mësime, 48 minuta'
};

export const chapterOneGame = {
  name: 'Misioni i planifikuesit Python',
  setting: 'Ndihmo një ekip kursi të llogarisë burimet duke përdorur hyrje, lloje dhe veprime numerike.',
  missions: [
    { title: 'Përgatit statusin', description: 'Përdor vlera me emra kuptimplotë dhe ndërto një status të lexueshëm.', starterCode: 'course = "Python"\nlesson_count = 6\n# Krijo status dhe shfaqe\n', checks: [['Statusi tregon kursin', 'assert "Python" in status', 'Përdor course kur krijon statusin.'], ['Numri i mësimeve shfaqet', 'assert "6" in status', 'Përfshi lesson_count në mesazh.']] },
    { title: 'Konverto planin', description: 'Konverto numrin e mësimeve nga tekst në int dhe llogarit minutat.', starterCode: 'lesson_text = "5"\nminutes_each = 10\n# Krijo lesson_count dhe total_minutes\n', checks: [['Hyrja bëhet numër i plotë', 'assert lesson_count == 5 and isinstance(lesson_count, int)', 'Përdor int(lesson_text).'], ['Koha totale llogaritet', 'assert total_minutes == 50', 'Shumëzo lesson_count me minutes_each.']] },
    { title: 'Shkruaj raportin final', description: 'Llogarit kohën e studimit, shto pushimin dhe krijo një përmbledhje me f-string.', starterCode: 'study_minutes = 40\nbreak_minutes = 5\n# Krijo total_minutes dhe report\n', checks: [['Totali përfshin studimin dhe pushimin', 'assert total_minutes == 45', 'Mblidh të dy vlerat.'], ['Raporti përfshin totalin', 'assert report == "Plani zgjat 45 minuta"', 'Përdor një f-string për raportin.']] }
  ]
};

export const chapterOneWorkshop = {
  id: 'chapter-one-course-report',
  title: 'Workshop: Ndërto raportin e kursit',
  description: 'Krijo një program të vogël në tre hapa. Çdo hap shton një pjesë të re dhe përdor kodin e mësuar deri këtu.',
  steps: [
    { id: 'course-report-data', title: 'Hapi 1 · Ruaj të dhënat', instructions: 'Përcakto emrin e kursit dhe numrin e mësimeve. Krijo `course_name` si str dhe `lesson_count` si int.', starterCode: 'course_name = "Python"\nlesson_count = 4\n', hints: ['Teksti vendoset mes thonjëzave.', 'Numri i mësimeve nuk duhet të jetë tekst.'], checks: [['Emri ruhet si tekst', 'assert isinstance(course_name, str) and course_name == "Python"', 'Përdor course_name për të ruajtur emrin.'], ['Numri ruhet si int', 'assert isinstance(lesson_count, int) and lesson_count == 4', 'Ruaj numrin pa thonjëza.']] },
    { id: 'course-report-time', title: 'Hapi 2 · Llogarit kohën', instructions: 'Ruaj minutat për mësim dhe llogarit `total_minutes` duke shumëzuar me `lesson_count` nga hapi i parë.', starterCode: 'course_name = "Python"\nlesson_count = 4\nminutes_per_lesson = 12\n# Llogarit total_minutes\n', hints: ['Përdor operatorin *.', 'Përdor ndryshoren lesson_count, jo vlerën e saj të shkruar përsëri.'], checks: [['Minutat llogariten nga të dy faktorët', 'assert total_minutes == lesson_count * minutes_per_lesson == 48', 'Shumëzo numrin e mësimeve me minutat për mësim.']] },
    { id: 'course-report-summary', title: 'Hapi 3 · Shfaq përmbledhjen', instructions: 'Krijo një f-string te `summary` që përmban emrin e kursit dhe kohën totale, pastaj shfaqe me `print()`.', starterCode: 'course_name = "Python"\nlesson_count = 4\nminutes_per_lesson = 12\ntotal_minutes = lesson_count * minutes_per_lesson\n# Krijo dhe shfaq summary\n', hints: ['Përdor kllapat kaçurrela për të futur ndryshoret.', 'Pas krijimit të summary, thirre print(summary).'], checks: [['Përmbledhja përmban të dy vlerat', 'assert summary == "Python: 4 mësime, 48 minuta"', 'Përdor f-string me course_name, lesson_count dhe total_minutes.'], ['Skripti shfaq përmbledhjen', "tree = ast.parse(source); assert any(isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print' and node.args and isinstance(node.args[0], ast.Name) and node.args[0].id == 'summary' for node in ast.walk(tree))", 'Shto print(summary) pas caktimit të summary.']] }
  ]
};

export const chapterOneProject = {
  title: 'Projekt: Planifikuesi i një kursi',
  description: 'Ndërto një skript të vogël që përmbledh kohëzgjatjen e një kursi. Përdor ndryshore, lloje të përshtatshme, konvertim, shumëzim, mbledhje dhe f-string. Kodi duhet të funksionojë edhe kur numri i mësimeve ose minutat ndryshojnë.',
  starterCode: '',
  hints: ['Ndaji të dhënat fillestare nga llogaritjet.', 'Kthe çdo hyrje tekstuale përpara aritmetikës.', 'Llogarit kohën e mësimeve dhe pastaj shto pushimin.', 'Krijo një përmbledhje të lexueshme me vlerat përfundimtare.'],
  checks: [
    { kind: 'behavior', label: 'Ruhet emri i kursit si tekst', code: 'assert isinstance(course_name, str) and course_name', feedback: 'Krijo course_name si tekst përshkrues.' },
    { kind: 'behavior', label: 'Teksti i minutave konvertohet në int', code: 'assert isinstance(minutes_text, str) and isinstance(minutes_per_lesson, int) and minutes_per_lesson == int(minutes_text)', feedback: 'Konverto minutes_text para llogaritjes.' },
    { kind: 'behavior', label: 'Llogaritet kohëzgjatja totale', code: 'assert isinstance(lesson_count, int) and total_minutes == lesson_count * minutes_per_lesson + break_minutes', feedback: 'Shumëzo numrin e mësimeve me minutat për mësim dhe pastaj shto pushimin.' },
    { kind: 'behavior', label: 'Raporti përmban kursin dhe kohëzgjatjen', code: 'assert isinstance(summary, str) and course_name in summary and str(total_minutes) in summary', feedback: 'Përdor f-string që paraqet emrin dhe totalin.' },
    { kind: 'behavior', label: 'Skripti thërret print për raportin', code: "tree = ast.parse(source); assert any(isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print' and node.args and isinstance(node.args[0], ast.Name) and node.args[0].id == 'summary' for node in ast.walk(tree))", feedback: 'Shto print(summary) pas llogaritjeve.' }
  ]
};

export const chapterOneLab = {
  id: 'travel-budget-lab',
  title: 'Laborator: Llogarit buxhetin e udhëtimit',
  description: 'Përgatit një skript të pavarur për një rezervim. Konverto numrin e biletave nga tekst, llogarit koston dhe krijo një raport të lexueshëm. Përfshi tarifën fikse vetëm një herë.',
  starterCode: '',
  hints: ['Ndaji hyrjet tekstuale nga vlerat e konvertuara.', 'Llogarit çmimin e biletave veçmas nga tarifa.', 'Përdor një f-string vetëm pasi të kesh totalin.'],
  checks: [
    { kind: 'behavior', label: 'Numri i biletave kthehet në int', code: 'assert isinstance(ticket_text, str) and isinstance(ticket_count, int) and ticket_count == int(ticket_text)', feedback: 'Konverto ticket_text me int() para llogaritjes.' },
    { kind: 'behavior', label: 'Çmimi i biletave llogaritet saktë', code: 'assert ticket_subtotal == ticket_count * ticket_price == 25.5', feedback: 'Shumëzo numrin e biletave me çmimin për biletë.' },
    { kind: 'behavior', label: 'Tarifa fikse shtohet vetëm një herë', code: 'assert total_cost == ticket_subtotal + service_fee == 28.0', feedback: 'Shto tarifën te nëntotali vetëm një herë.' },
    { kind: 'behavior', label: 'Raporti paraqet destinacionin dhe totalin', code: 'assert isinstance(report, str) and destination in report and str(total_cost) in report', feedback: 'Përfshi destinacionin dhe total_cost në f-string.' }
  ]
};

export const chapterOneBlockTypes = Object.freeze({
  lectures: chapterOneLessons.map(lesson => ({ id: lesson.id, type: 'lecture', lessonId: lesson.id })),
  workshop: { id: chapterOneWorkshop.id, type: 'workshop', title: chapterOneWorkshop.title, steps: chapterOneWorkshop.steps },
  lab: { id: chapterOneLab.id, type: 'lab', title: chapterOneLab.title, ...chapterOneLab },
  game: { id: 'planifikues-game', type: 'game', title: chapterOneGame.name },
  project: { id: 'planifikues-project', type: 'project', title: chapterOneProject.title },
  review: { id: 'chapter-one-review', type: 'review', title: 'Përsëritje: Bazat e Python-it' },
  quiz: { id: 'chapter-one-quiz', type: 'quiz', title: 'Kuiz: Bazat e Python-it' }
});
