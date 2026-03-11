import { useState, useRef, useCallback } from "react";

// ─── UI STRINGS ───────────────────────────────────────────────────────────────
const UI = {
  de: {
    appTitle: "Altenpflege Lernhilfe",
    appSub: "Prüfungsvorbereitung Altenpflegerhelfer",
    welcome: "Willkommen! 👋",
    questionsFrom: (n, t) => `${n} Fragen aus ${t} Themengebieten`,
    selectTopics: "Themengebiete auswählen",
    mainMenu: "← Hauptmenü",
    modes: {
      quiz: { label: "Multiple-Choice Quiz", desc: "10 zufällige Fragen beantworten", icon: "📝" },
      flashcard: { label: "Karteikarten", desc: "Fragen & Antworten üben", icon: "🗂️" },
      fill: { label: "Lückentext ✨", desc: "Fehlende Wörter eintippen", icon: "✏️" },
      summary: { label: "Lernübersicht", desc: "Alle Themen nachlesen", icon: "📖" },
    },
    question: "Frage",
    of: "von",
    task: "Aufgabe",
    correct: "richtig",
    topicBadge: (icon, topic) => `${icon} ${topic}`,
    explanation: "💡 Erklärung:",
    nextQuestion: "Nächste Frage →",
    showResult: "Ergebnis anzeigen →",
    nextTask: "Nächste Aufgabe →",
    tryAgain: "Nochmal versuchen",
    correctOf: (s, t) => `${s} von ${t} richtig`,
    correctOfFull: (s, t) => `${s} von ${t} vollständig richtig`,
    excellent: "Ausgezeichnet! Weiter so!",
    good: "Gut gemacht! Noch ein bisschen üben.",
    keepGoing: "Nicht aufgeben – Übung macht den Meister!",
    goodFill: "Gut gemacht! Weiterüben zahlt sich aus.",
    keepGoingFill: "Nicht aufgeben – Wiederholen hilft!",
    cardOf: (i, t) => `Karte ${i} von ${t}`,
    flipHint: "FRAGE — zum Aufdecken klicken",
    answer: "ANTWORT",
    showQuestion: "Frage anzeigen",
    revealAnswer: "Antwort aufdecken",
    back: "← Zurück",
    next: "Weiter →",
    fillHint: "✏️ Fehlende Wörter ergänzen",
    check: "Überprüfen ✓",
    fullAnswer: "💡 Vollständige Antwort:",
    summary: "📖 Lernübersicht",
    questions: "Fragen",
    statsTitle: "Fortschritt",
    statsDesc: "Themenübersicht & Lernempfehlungen",
    suggestionsTitle: "📌 Empfehlungen",
    allTopics: "Alle Themen",
    studyNow: "Jetzt üben",
    answeredLbl: "beantwortet",
    correctLbl: "richtig",
    notStartedYet: "Noch nicht begonnen",
    notStartedLbl: "Neu",
    struggling: "Schwierigkeiten",
    needsWork: "Übung nötig",
    notRecent: "Nicht kürzlich",
    goodLbl: "Gut",
    confirmReset: "Alle Statistiken zurücksetzen?",
    resetAll: "Alle Statistiken zurücksetzen",
    streakLabel: "🔥 Lernserie",
    streakDays: (n) => n === 1 ? "1 Tag in Folge" : `${n} Tage in Folge`,
    streakToday: "Heute gelernt ✓",
    streakNone: "Noch keine Serie – fang heute an!",
  },
  en: {
    appTitle: "Elderly Care Study App",
    appSub: "Altenpflegerhelfer Exam Prep",
    welcome: "Welcome! 👋",
    questionsFrom: (n, t) => `${n} questions from ${t} topic areas`,
    selectTopics: "Select topic areas",
    mainMenu: "← Main Menu",
    modes: {
      quiz: { label: "Multiple-Choice Quiz", desc: "Answer 10 random questions", icon: "📝" },
      flashcard: { label: "Flashcards", desc: "Practise questions & answers", icon: "🗂️" },
      fill: { label: "Fill in the Blank ✨", desc: "Type the missing words", icon: "✏️" },
      summary: { label: "Study Overview", desc: "Read all topics", icon: "📖" },
    },
    question: "Question",
    of: "of",
    task: "Task",
    correct: "correct",
    topicBadge: (icon, topic) => `${icon} ${topic}`,
    explanation: "💡 Explanation:",
    nextQuestion: "Next Question →",
    showResult: "Show Result →",
    nextTask: "Next Task →",
    tryAgain: "Try Again",
    correctOf: (s, t) => `${s} of ${t} correct`,
    correctOfFull: (s, t) => `${s} of ${t} fully correct`,
    excellent: "Excellent! Keep it up!",
    good: "Well done! A little more practice needed.",
    keepGoing: "Don't give up – practice makes perfect!",
    goodFill: "Well done! Keep practising.",
    keepGoingFill: "Don't give up – repetition helps!",
    cardOf: (i, t) => `Card ${i} of ${t}`,
    flipHint: "QUESTION — click to reveal",
    answer: "ANSWER",
    showQuestion: "Show question",
    revealAnswer: "Reveal answer",
    back: "← Back",
    next: "Next →",
    fillHint: "✏️ Fill in the missing words",
    check: "Check ✓",
    fullAnswer: "💡 Full Answer:",
    summary: "📖 Study Overview",
    questions: "Questions",
    statsTitle: "Progress",
    statsDesc: "Topic overview & study suggestions",
    suggestionsTitle: "📌 Suggestions",
    allTopics: "All Topics",
    studyNow: "Study now",
    answeredLbl: "answered",
    correctLbl: "correct",
    notStartedYet: "Not started yet",
    notStartedLbl: "New",
    struggling: "Struggling",
    needsWork: "Needs work",
    notRecent: "Not recent",
    goodLbl: "Good",
    confirmReset: "Reset all statistics?",
    resetAll: "Reset all statistics",
    streakLabel: "🔥 Streak",
    streakDays: (n) => n === 1 ? "1 day in a row" : `${n} days in a row`,
    streakToday: "Studied today ✓",
    streakNone: "No streak yet — start today!",
  },
};

// ─── GERMAN TOPICS ────────────────────────────────────────────────────────────
const TOPICS_DE = {
  // ── 1. GRUNDPFLEGE & HYGIENE ──────────────────────────────────────────────
  "Grundpflege & Hygiene": {
    color: "#e8a87c", icon: "🧼",
    questions: [
      {
        q: "Was versteht man unter dem Grundsatz 'so viel Hilfe wie nötig, so wenig wie möglich'?",
        a: "Es bedeutet, die Selbstständigkeit des Pflegebedürftigen zu fördern (aktivierende Pflege), anstatt alle Aufgaben zu übernehmen. Nur dort helfen, wo echte Unterstützung nötig ist.",
        options: ["Möglichst viel Hilfe leisten, damit Bewohner sich sicher fühlen","Selbstständigkeit fördern und nur helfen, wo nötig","Aufgaben übernehmen, um die Pflege effizienter zu gestalten","Hilfe nur auf ausdrücklichen Wunsch des Bewohners leisten"],
        correct: 1,
        fillTemplate: "Der Grundsatz bedeutet, die ___ des Pflegebedürftigen zu fördern. Nur dort helfen, wo echte ___ nötig ist.",
        fillAnswers: ["Selbstständigkeit","Unterstützung"],
      },
      {
        q: "Wie oft sollte ein bettlägeriger Patient mindestens umgelagert werden?",
        a: "Alle 2 Stunden, sofern kein individueller Lagerungsplan vorliegt. Bei stark gefährdeten Patienten ggf. häufiger.",
        options: ["Alle 4 Stunden, wenn eine druckentlastende Matratze im Einsatz ist, die den Bedarf reduziert","Alle 2 Stunden","Alle 3 Stunden laut Standard-Pflegeheimprotokoll für alle Pflegegrade","Alle 2 Stunden nur für Hochrisikopatienten; andere können bis zu 6 Stunden warten"],
        correct: 1,
        fillTemplate: "Ein bettlägeriger Patient sollte alle ___ Stunden umgelagert werden, sofern kein individueller ___ vorliegt.",
        fillAnswers: ["2","Lagerungsplan"],
      },
      {
        q: "Was ist der Unterschied zwischen Desinfektion und Sterilisation?",
        a: "Desinfektion reduziert Krankheitserreger auf ein ungefährliches Maß. Sterilisation vernichtet alle Mikroorganismen einschließlich Sporen vollständig.",
        options: ["Kein Unterschied – beide Verfahren erzielen vollständige Keimfreiheit einschließlich aller Sporen","Desinfektion tötet alle Keime einschließlich Sporen ab; Sterilisation zielt nur auf Bakterien und Viren","Desinfektion reduziert Keime, Sterilisation vernichtet alle Mikroorganismen","Sterilisation verwendet chemische Mittel; Desinfektion verwendet Hitze zur Keimvernichtung"],
        correct: 2,
        fillTemplate: "___ reduziert Krankheitserreger auf ein ungefährliches Maß. ___ vernichtet alle Mikroorganismen einschließlich Sporen vollständig.",
        fillAnswers: ["Desinfektion","Sterilisation"],
      },
      {
        q: "Wie lange muss Händedesinfektionsmittel mindestens einwirken?",
        a: "Mindestens 30 Sekunden. Dabei werden Handflächen, Handrücken, Fingerzwischenräume, Fingerkuppen und Daumen eingearbeitet.",
        options: ["15 Sekunden genügen laut WHO bei korrekt ausgeführter Reibetechnik","30 Sekunden","60 Sekunden sind nötig bei Kontakt mit Körperflüssigkeiten","20 Sekunden – dieselbe Dauer wie bei der Händewäsche mit Seife"],
        correct: 1,
        fillTemplate: "Bei der Händedesinfektion muss das Mittel mindestens ___ Sekunden einwirken. Dabei werden Handflächen, Handrücken und ___ eingearbeitet.",
        fillAnswers: ["30","Fingerzwischenräume"],
      },
      {
        q: "Was ist ein Dekubitus und welche Hauptursache hat er?",
        a: "Ein Dekubitus ist ein Druckgeschwür der Haut und des darunterliegenden Gewebes, verursacht durch anhaltenden Druck oder Scherkräfte, die die Durchblutung unterbrechen.",
        options: ["Eine Wunde durch Bakterieninfektion der fragilen Haut bei älteren Pflegebedürftigen","Ein Druckgeschwür durch anhaltenden Druck auf die Haut","Eine Hautläsion durch allergische Reaktion auf Pflegeprodukte oder Inkontinenzvorlagen","Eine Wunde durch Ödeme und Veneninsuffizienz bei immobilen Patienten"],
        correct: 1,
        fillTemplate: "Ein Dekubitus ist ein ___ durch anhaltenden Druck, der die ___ unterbricht.",
        fillAnswers: ["Druckgeschwür","Durchblutung"],
      },
      {
        q: "Welche vier Dekubitus-Grade unterscheidet man?",
        a: "Grad 1: Rötung, nicht wegdrückbar. Grad 2: Hautdefekt bis zur Dermis. Grad 3: Defekt bis zur Subkutis. Grad 4: Defekt bis zu Knochen/Sehnen/Muskeln.",
        options: ["Grad 1–3: Rötung, Blasenbildung, und nekrotisches Gewebe ohne Tiefeneinteilung","Grad 1–4 nach Tiefe des Gewebeschadens","Stadium I–IV nach EPUAP mit zusätzlicher Kategorie für tiefe Gewebeläsionen","Grad 1–5 einschließlich eines Vorstadiums bei gefährdeter Haut"],
        correct: 1,
        fillTemplate: "Beim Dekubitus Grad 1 besteht eine nicht wegdrückbare ___. Bei Grad 4 reicht der Defekt bis zu ___ oder Sehnen.",
        fillAnswers: ["Rötung","Knochen"],
      },
      {
        q: "Was sind die fünf Momente der Händehygiene (WHO)?",
        a: "1. Vor Patientenkontakt. 2. Vor aseptischen Tätigkeiten. 3. Nach Kontakt mit Körperflüssigkeiten. 4. Nach Patientenkontakt. 5. Nach Kontakt mit der Patientenumgebung.",
        options: ["Drei Momente: vor Patientenkontakt, nach Körperflüssigkeitskontakt und nach Ablegen der Handschuhe","Vor und nach jeder direkten Pflegemaßnahme sowie nach dem Toilettengang","Fünf definierte Situationen: vor/nach Patientenkontakt, vor aseptischen Tätigkeiten, nach Körperflüssigkeiten","Nur wenn die Hände sichtbar verschmutzt sind oder nach Kontakt mit Hochrisikopatienten"],
        correct: 2,
        fillTemplate: "Die WHO nennt fünf Momente der Händehygiene: vor ___, nach Körperflüssigkeitskontakt und nach ___.",
        fillAnswers: ["Patientenkontakt","Patientenumgebungskontakt"],
      },
      {
        q: "Was bedeutet 'hygienische Händedesinfektion' im Unterschied zu Händewaschen?",
        a: "Händedesinfektion mit Desinfektionsmittel ist effektiver gegen Viren und Bakterien als Waschen mit Seife. Wäscht man die Hände, werden Keime abgespült, aber nicht abgetötet.",
        options: ["Waschen ist effektiver, da Keime mechanisch entfernt werden","Desinfizieren ist effektiver gegen Keime als Waschen mit Seife","Beide Methoden sind in der Praxis gleichwertig einzusetzen","Bei sichtbarer Verschmutzung sollte immer desinfiziert werden, nicht gewaschen"],
        correct: 1,
        fillTemplate: "Händedesinfektion ist ___ gegen Keime als Waschen mit Seife. Beim Waschen werden Keime nur ___, nicht abgetötet.",
        fillAnswers: ["effektiver","abgespült"],
      },
      {
        q: "Welche Schutzausrüstung (PSA) ist bei direktem Pflegekontakt mindestens zu tragen?",
        a: "Einmalhandschuhe. Bei Spritzgefahr zusätzlich Schutzkittel und ggf. Mund-Nasen-Schutz oder FFP2-Maske.",
        options: ["Handschuhe sind nur erforderlich, wenn sichtbares Blut oder Ausscheidungen vorhanden sind","Nur bei direkter Wundversorgung Handschuhe; keine zusätzliche Schutzausrüstung bei Routinepflege","Einmalhandschuhe, bei Spritzgefahr Schutzkittel und MNS","Standardpflege erfordert immer FFP2-Maske, Kittel und Handschuhe unabhängig von der Tätigkeit"],
        correct: 2,
        fillTemplate: "Bei direktem Pflegekontakt müssen mindestens ___ getragen werden. Bei Spritzgefahr zusätzlich ___ und MNS.",
        fillAnswers: ["Einmalhandschuhe","Schutzkittel"],
      },
      {
        q: "Was versteht man unter Inkontinenzversorgung und welche Grundprinzipien gelten?",
        a: "Regelmäßiger Wechsel von Inkontinenzprodukten, Hautpflege zur Vermeidung von Mazerationen, Intimsphäre wahren, aktivierende Kontinenzförderung anstreben.",
        options: ["Produkte über den ganzen Tag verwenden und nach einem festen Plan wechseln, unabhängig von der Durchnässung","Regelmäßiger Wechsel, Hautschutz, Würde wahren","Vorrangig zeitgesteuertes Toilettentraining alle 4 Stunden; Inkontinenzprodukte nur als letzte Option","Kontinenzereignisse im Pflegebericht notieren, aber Hautpflege auf die nächste Morgenpflege verschieben"],
        correct: 1,
        fillTemplate: "Bei der Inkontinenzversorgung ist regelmäßiger Wechsel und ___ zur Vermeidung von Mazerationen wichtig. Die ___ des Bewohners muss immer gewahrt werden.",
        fillAnswers: ["Hautpflege","Intimsphäre"],
      },
      {
        q: "Was ist bei der Mundpflege bei pflegebedürftigen Menschen zu beachten?",
        a: "Mindestens zweimal täglich Zähne/Prothesen reinigen, Schleimhäute feucht halten, auf Entzündungen oder Soor (Pilzinfektionen) achten, bei Schluckstörungen Aspirationsschutz.",
        options: ["Einmal täglich morgens genügt; Prothesen sollten einmal pro Woche gereinigt werden","Mindestens 2x täglich, Schleimhäute feucht halten, auf Veränderungen achten","Mundpflege ist nur bei Bewohnern erforderlich, die noch natürliche Zähne haben","Ausspülen des Mundes mit Wasser nach den Mahlzeiten ist für Prothesenträger ausreichend"],
        correct: 1,
        fillTemplate: "Mundpflege sollte mindestens ___ täglich durchgeführt werden. Bei Schluckstörungen ist besonders auf ___ zu achten.",
        fillAnswers: ["zweimal","Aspiration"],
      },
      {
        q: "Wie lautet die korrekte Reihenfolge beim An- und Ausziehen von Handschuhen?",
        a: "Anziehen: Hände desinfizieren → Handschuhe anziehen. Ausziehen: Handschuh abrollen ohne Innenseite zu berühren → zweiten Handschuh um den ersten wickeln → Entsorgung → Hände desinfizieren.",
        options: ["Reihenfolge ist egal, solange danach desinfiziert wird","Handschuhe ausziehen ohne Innenberührung, sofort Hände desinfizieren","Erst Hände waschen, dann Handschuhe ausziehen","Nach dem Ausziehen genügt gründliches Händewaschen mit Seife"],
        correct: 1,
        fillTemplate: "Beim Ausziehen von Handschuhen darf die ___ nicht berührt werden. Danach müssen die Hände sofort ___ werden.",
        fillAnswers: ["Innenseite","desinfiziert"],
      },
      {
        q: "Was versteht man unter 'aktivierender Pflege'?",
        a: "Aktivierende Pflege fördert und erhält die Fähigkeiten des Pflegebedürftigen. Man übt gemeinsam, was der Patient noch kann, anstatt es für ihn zu erledigen.",
        options: ["Alle Aufgaben möglichst effizient übernehmen, um Zeit zu sparen","Fähigkeiten des Patienten durch gemeinsames Üben fördern und erhalten","Den Patienten zu intensiverer Physiotherapie motivieren","Ausschließlich Pflegemaßnahmen durchführen, die im Pflegeplan stehen"],
        correct: 1,
        fillTemplate: "Aktivierende Pflege fördert die ___ des Pflegebedürftigen. Statt Aufgaben zu übernehmen, übt man sie ___.",
        fillAnswers: ["Fähigkeiten","gemeinsam"],
      },
      {
        q: "Was sind die Aufgaben der Grundpflege (Körperpflege)?",
        a: "Waschen/Baden, Haarpflege, Mund-/Zahnpflege, Nagelpflege, Rasur, Ankleiden/Auskleiden, Lagerung, Hilfe bei der Nahrungsaufnahme und Ausscheidung.",
        options: ["Medikamentengabe, Wundversorgung und Verbandswechsel als Teil der Körperpflege","Waschen, Haarpflege, Mundpflege, Nagelpflege, Ankleiden, Lagerung, Ausscheidungshilfe","Pflegeplanung erstellen, Beobachtungen dokumentieren und Vitalzeichen messen","Beatmungsüberwachung, Infusionspflege und Blasenkatheterwechsel auf Anordnung"],
        correct: 1,
        fillTemplate: "Zu den Aufgaben der Grundpflege gehören Waschen, ___, Mundpflege und Hilfe bei der ___ und Ausscheidung.",
        fillAnswers: ["Haarpflege","Nahrungsaufnahme"],
      },
      {
        q: "Was ist Basale Stimulation und wofür wird sie eingesetzt?",
        a: "Basale Stimulation (nach Prof. Andreas Fröhlich) ist ein pflegerisches Konzept zur Förderung der Wahrnehmung und Kommunikation bei Menschen mit schweren Beeinträchtigungen durch gezielte sensorische Reize.",
        options: ["Eine physiotherapeutische Technik zur passiven Gelenkmobilisation zur Kontrakturprophylaxe","Förderung der Wahrnehmung bei stark beeinträchtigten Menschen durch sensorische Reize","Ein ergotherapeutisches Programm zur Verbesserung der Feinmotorik und kognitiven Leistungsfähigkeit","Ein palliativpflegerischer Ansatz zur Schmerzbehandlung bei Sterbenden"],
        correct: 1,
        fillTemplate: "Basale Stimulation fördert die ___ und Kommunikation bei Menschen mit schweren Beeinträchtigungen durch gezielte ___ Reize.",
        fillAnswers: ["Wahrnehmung","sensorische"],
      },
      {
        q: "Welche Prophylaxen sind besonders wichtig in der stationären Altenpflege?",
        a: "Dekubitusprophylaxe, Sturz-, Kontraktur-, Thrombose-, Pneumonie-, Intertrigoprophylaxe, Mundpflegeprophylaxe. Alle zielen auf die Verhinderung von Folgeschäden durch Immobilität oder Pflegebedürftigkeit.",
        options: ["Nur Sturz- und Dekubitusprophylaxe, da diese nach SGB XI und DNQP-Expertenstandard gesetzlich vorgeschrieben sind","Dekubitus-, Sturz-, Kontraktur-, Thrombose-, Pneumonieprophylaxe u.a.","Thrombose-, Pneumonie- und Wundprophylaxe; Kontrakturprophylaxe ist ausschließlich Aufgabe der Physiotherapie","Nur Inkontinenzversorgung, Wundpflege und Mundpflege; alle anderen Prophylaxen erfordern ärztliche Anordnung"],
        correct: 1,
        fillTemplate: "Wichtige Prophylaxen in der Altenpflege sind Dekubitus-, Sturz-, Kontraktur-, Thrombose- und ___prophylaxe.",
        fillAnswers: ["Pneumonie"],
      },
      {
        q: "Welche Maßnahmen umfasst die Sturzprophylaxe?",
        a: "Risikoerfassung (z.B. mit dem Sturz-Assessment), Umgebungsanpassung (rutschfeste Böden, Handläufe, ausreichend Beleuchtung), Hilfsmittel (Gehilfen), Schuhwerk prüfen, Medikamente prüfen, Gleichgewichtstraining.",
        options: ["Bettgitter hochstellen, Sitzerhöhung einsetzen und Bewohner über Sturzgefahr informieren","Sturzrisiko erfassen, Umgebung sichern, Hilfsmittel, Gleichgewichtstraining","Mobilität einschränken, Rollstuhl einsetzen und Aktivitäten nur unter Aufsicht erlauben","Sturzrisikoerfassung einmalig bei Aufnahme; bei Sturz Dokumentation und Hausarzt informieren"],
        correct: 1,
        fillTemplate: "Zur Sturzprophylaxe gehören Risikoerfassung, ___ (z.B. Handläufe), Hilfsmittel und ___.",
        fillAnswers: ["Umgebungsanpassung","Gleichgewichtstraining"],
      },
      {
        q: "Was ist eine Kontraktur und wie wird sie verhindert?",
        a: "Kontraktur = dauerhafte Verkürzung von Muskeln, Sehnen oder Gelenkkapseln durch fehlende Bewegung. Prophylaxe: regelmäßige passive und aktive Bewegungsübungen (Mobilisation), korrekte Lagerung, frühzeitige Physiotherapie.",
        options: ["Akute Gelenkentzündung durch Infektion oder Autoimmunprozesse, behandelt mit entzündungshemmenden Medikamenten","Dauerhafte Gelenkversteifung durch Bewegungsmangel; verhindert durch Mobilisation und Lagerung","Fortschreitende degenerative Gelenkerkrankung ähnlich der Arthrose, behandelt mit Physiotherapie","Flüssigkeitsansammlung in den Gelenkkapseln durch Kreislaufstörungen, die Kompressionstherapie erfordert"],
        correct: 1,
        fillTemplate: "Eine Kontraktur entsteht durch fehlende ___ und führt zu dauerhafter ___. Prophylaxe: regelmäßige Mobilisation.",
        fillAnswers: ["Bewegung","Gelenkversteifung"],
      },
      {
        q: "Wann ist ein Verbandwechsel durchzuführen und was ist dabei zu beachten?",
        a: "Laut ärztlicher Anordnung oder wenn der Verband durchfeuchtet, verschmutzt oder gelöst ist. Aseptisches Vorgehen (Sterilhandschuhe, steriles Material), Wunde von innen nach außen reinigen, Beobachtung und Dokumentation der Wunde.",
        options: ["Täglich nach festen Zeiten; mit sterilen Handschuhen, Wunde von außen nach innen reinigen","Nach ärztlicher Anordnung oder bei Bedarf; aseptisch, Wunde beobachten, dokumentieren","Bei jeder Pflegevisite; mit Einmalhandschuhen, Wundränder mit Desinfektionsmittel behandeln","Grundsätzlich nach 72 Stunden; Wundzustand mündlich im Pflegebericht zusammenfassen"],
        correct: 1,
        fillTemplate: "Ein Verbandwechsel erfolgt nach ___ Anordnung oder bei Bedarf. Es ist ___ vorzugehen.",
        fillAnswers: ["ärztlicher","aseptisch"],
      },
      {
        q: "Was versteht man unter Basaler Stimulation in der Pflege?",
        a: "Basale Stimulation (Prof. Andreas Fröhlich) ist ein Pflegekonzept zur Förderung von Wahrnehmung, Kommunikation und Bewegung bei schwerstbeeinträchtigten Menschen durch gezielte sensorische Reize (z.B. Berührung, Vibration, Vestibulär).",
        options: ["Ein physiotherapeutisches Konzept mit geführten aktiven Bewegungen zur neurologischen Rehabilitation","Förderung von Wahrnehmung bei schwerstbeeinträchtigten Menschen durch sensorische Reize","Ein strukturiertes Schmerzerfassungs- und Behandlungskonzept für Palliativpatienten","Ein kognitives Trainingsprogramm mit Gedächtnisübungen und Umgebungsorientierungstechniken"],
        correct: 1,
        fillTemplate: "Basale Stimulation fördert ___ und Kommunikation durch gezielte ___ Reize.",
        fillAnswers: ["Wahrnehmung","sensorische"],
      },
    ],
  },

  // ── 2. PFLEGEPROZESS & DOKUMENTATION ─────────────────────────────────────
  "Pflegeprozess & Dokumentation": {
    color: "#f0c070", icon: "📋",
    questions: [
      {
        q: "Wie viele Schritte hat der Pflegeprozess nach Fiechter und Meier?",
        a: "6 Schritte: 1. Informationssammlung, 2. Erkennen von Problemen und Ressourcen, 3. Festlegen der Pflegeziele, 4. Planung der Pflegemaßnahmen, 5. Durchführung, 6. Evaluation.",
        options: ["4 Schritte wie im WHO-Modell (Assessment, Planning, Implementation, Evaluation)","5 Schritte wie im NANDA-basierten Pflegeprozess (inkl. Pflegediagnose)","6 Schritte","7 Schritte einschließlich Zieldokumentation als separatem Schritt"],
        correct: 2,
        fillTemplate: "Das Pflegeprozessmodell nach Fiechter und Meier hat ___ Schritte. Es beginnt mit der ___ und endet mit der Evaluation.",
        fillAnswers: ["6","Informationssammlung"],
      },
      {
        q: "Was ist die Strukturierte Informationssammlung (SIS®)?",
        a: "Die SIS® ist das Kernelement des Strukturmodells in der Pflegedokumentation. Sie erfasst in einem Gespräch mit dem Bewohner Informationen zu Selbstbild, Themenfelder (Mobilität, Kognition, Selbstversorgung etc.) und individuelle Risiken.",
        options: ["Ein standardisierter ärztlicher Aufnahmebogen, der bei Einzug vom Hausarzt ausgefüllt wird","Das Kerndokument der Pflegedokumentation zur individuellen Bedarfserfassung","Ein Risikoassessmentbogen speziell für Dekubitus, Sturz und Ernährungszustand","Das zentrale Pflegeplanungsdokument, in dem Pflegeziele und Maßnahmen festgehalten werden"],
        correct: 1,
        fillTemplate: "Die SIS® ist das Kernelement des ___ in der Pflegedokumentation. Sie erfasst individuelle Informationen in einem ___ mit dem Bewohner.",
        fillAnswers: ["Strukturmodells","Gespräch"],
      },
      {
        q: "Was sind AEDL/ABEDL nach Monika Krohwinkel?",
        a: "ABEDL steht für Aktivitäten, Beziehungen und existentielle Erfahrungen des Lebens (13 Bereiche z.B. Kommunizieren, Atmen, Waschen, Essen, Schlafen, Soziale Bereiche sichern). Grundlage für ganzheitliche Pflegeplanung.",
        options: ["Ein Pflegediagnose-Klassifikationssystem basierend auf standardisierten medizinischen Diagnosekriterien","13 Lebensbereiche als Grundlage für die Pflegeplanung","Ein siebenstufiges Assessmentmodell zur Identifikation und Priorisierung pflegerischer Probleme","Ein Dokumentationssystem mit allen gesetzlich vorgeschriebenen Pflegemaßnahmen und ihrer Häufigkeit"],
        correct: 1,
        fillTemplate: "ABEDL steht für Aktivitäten, Beziehungen und ___ Erfahrungen des Lebens. Es gibt ___ Lebensbereiche als Basis der Pflegeplanung.",
        fillAnswers: ["existentielle","13"],
      },
      {
        q: "Was ist ein Pflegeproblem, Pflegeziel und eine Pflegemaßnahme?",
        a: "Pflegeproblem: Ist-Zustand mit Einschränkung (z.B. 'Patient kann nicht selbst aufstehen'). Pflegeziel: angestrebter Zustand (SMART formuliert). Pflegemaßnahme: konkrete Handlungen zur Zielerreichung.",
        options: ["Problem = Diagnose des Bewohners; Ziel = ärztlich verordnete Behandlung; Maßnahme = pflegerische Aktivität","Problem = Ist-Zustand, Ziel = angestrebter Zustand, Maßnahme = konkrete Handlung","Problem = Pflegeaufgabe; Ziel = der zu erreichende Pflegestandard; Maßnahme = die Häufigkeit der Durchführung","Alle drei beschreiben Aspekte des ärztlichen Behandlungsplans, der von Ärzten dokumentiert wird"],
        correct: 1,
        fillTemplate: "Das Pflegeproblem beschreibt den ___-Zustand. Das Pflegeziel ist der angestrebte Zustand und sollte ___ formuliert sein.",
        fillAnswers: ["Ist","SMART"],
      },
      {
        q: "Was bedeutet das Kürzel 'SMART' bei der Pflegezielformulierung?",
        a: "S = Spezifisch, M = Messbar, A = Attraktiv/Akzeptiert, R = Realistisch, T = Terminiert (zeitlich begrenzt).",
        options: ["Standardisiert, Messbar, Angemessen, Realistisch, Terminiert","Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert","Strukturiert, Medizinisch, Abgestimmt, Regelmäßig überprüft, Terminiert","Spezifisch, Monitoring-geeignet, Abgesprochen, Realistisch, Tätigkeitsbezogen"],
        correct: 1,
        fillTemplate: "SMART steht für Spezifisch, ___, Attraktiv, Realistisch und ___.",
        fillAnswers: ["Messbar","Terminiert"],
      },
      {
        q: "Welche Bedeutung hat die Pflegedokumentation rechtlich?",
        a: "Die Pflegedokumentation dient als Nachweis erbrachter Leistungen, Beweissicherung bei Haftungsfragen, Kommunikationsmittel im Team und Grundlage für Qualitätsprüfungen (MDK/Heimaufsicht).",
        options: ["Ein internes Verwaltungsinstrument ohne rechtliche Gültigkeit in Haftungsfragen","Sie dient als rechtlicher Nachweis, Kommunikationsmittel und Qualitätsgrundlage","Ein Kommunikationsmittel für die Schichtübergabe, jedoch ohne rechtliche Bedeutung vor Gericht","Ein Abrechnungsdokument für die Pflegeversicherung mit eingeschränkter Relevanz für die Pflegequalität"],
        correct: 1,
        fillTemplate: "Die Pflegedokumentation dient als ___ erbrachter Leistungen und ist Grundlage für ___ (MDK/Heimaufsicht).",
        fillAnswers: ["Nachweis","Qualitätsprüfungen"],
      },
      {
        q: "Was sind 'Ressourcen' in der Pflegedokumentation?",
        a: "Ressourcen sind Fähigkeiten und Stärken des Pflegebedürftigen, die er noch selbstständig ausführen kann und die die Pflege nutzen soll (innere Ressourcen: eigene Fähigkeiten; äußere Ressourcen: Familie, Hilfsmittel).",
        options: ["Pflegerische Hilfsmittel der Einrichtung wie Rollator, Rollstuhl und Orthesen","Fähigkeiten und Stärken des Patienten, die in der Pflege genutzt werden","Der formale Leistungsanspruch laut Pflegegrad-Begutachtung und Pflegeversicherung","Persönliche Vorlieben und Tagesrituale aus der Biografie des Bewohners"],
        correct: 1,
        fillTemplate: "Ressourcen sind ___ und Stärken des Patienten, die er noch selbst einsetzen kann. Man unterscheidet ___ und äußere Ressourcen.",
        fillAnswers: ["Fähigkeiten","innere"],
      },
      {
        q: "Welche Assessments werden in der Altenpflege häufig zur Risikoerfassung eingesetzt?",
        a: "Braden-Skala (Dekubitusrisiko), Sturz-Assessment (z.B. nach Morse oder Hendrich), Mini-Mental-Status-Test (MMST) für Kognition, Mini Nutritional Assessment (MNA) für Ernährung, Schmerzskala (NRS).",
        options: ["Braden-Skala, Barthel-Index und Geriatric Depression Scale für alle Risikobereiche","Braden-Skala, Sturz-Assessment, MMST, MNA, Schmerzskala","Assessments werden bundesweit einheitlich durch den MDK erstellt und an Einrichtungen übermittelt","Ersteinschätzung bei Aufnahme; danach nur Braden-Skala und Schmerzskala alle sechs Monate"],
        correct: 1,
        fillTemplate: "Die ___ erfasst das Dekubitusrisiko. Der ___ (MMST) bewertet die kognitive Leistungsfähigkeit.",
        fillAnswers: ["Braden-Skala","Mini-Mental-Status-Test"],
      },
      {
        q: "Was ist eine Pflegeplanung und wer erstellt sie?",
        a: "Die Pflegeplanung legt schriftlich fest, welche Pflegeprobleme, Ziele und Maßnahmen für einen Bewohner gelten. Sie wird von der Pflegefachkraft erstellt, aber der Bewohner und ggf. Angehörige werden einbezogen.",
        options: ["Ein Dienstplan, der festlegt, welcher Mitarbeiter für welchen Bewohner in der Schicht zuständig ist","Schriftliche Festlegung von Problemen, Zielen und Maßnahmen für den Bewohner","Ein Pflegevertrag zwischen Einrichtung und Bewohner über den Umfang der Pflegeleistungen","Ein ärztliches Dokument, in dem Diagnosen und Behandlungsanordnungen festgehalten werden"],
        correct: 1,
        fillTemplate: "Die Pflegeplanung legt ___, Ziele und Maßnahmen für den Bewohner fest. Sie wird von der ___ erstellt.",
        fillAnswers: ["Pflegeprobleme","Pflegefachkraft"],
      },
      {
        q: "Was gehört in einen Pflegebericht (Pflegetagebuch)?",
        a: "Datum/Uhrzeit, Name des Pflegenden, Beobachtungen zum Zustand des Bewohners, besondere Ereignisse, durchgeführte Maßnahmen, Reaktionen des Bewohners, Veränderungen.",
        options: ["Ausschließlich besondere Ereignisse, Stürze und Arztbesuche mit Datum und Ergebnis","Datum, Beobachtungen, besondere Ereignisse, Maßnahmen und Reaktionen","Durchgeführte Maßnahmen, Uhrzeit und verantwortliche Pflegeperson ohne Bewohnerzustand","Vitalzeichen, Medikamentengaben und Befunde gemäß ärztlicher Anordnung und Pflegestandard"],
        correct: 1,
        fillTemplate: "Ein Pflegebericht enthält Datum, Name, ___ zum Zustand des Bewohners, besondere Ereignisse und ___.",
        fillAnswers: ["Beobachtungen","Reaktionen"],
      },
      {
        q: "Was ist der Unterschied zwischen subjektiven und objektiven Daten in der Pflegeerfassung?",
        a: "Subjektive Daten: Angaben des Patienten selbst (was er fühlt, wahrnimmt, berichtet). Objektive Daten: messbare Befunde, die die Pflegeperson beobachtet (Blutdruck, Wundaussehen, Verhalten).",
        options: ["Subjektive Daten werden von Pflegenden erhoben; objektive Daten stammen ausschließlich von Ärzten","Subjektiv = Patientenaussagen, Objektiv = messbare Befunde durch Pflegende","Subjektive Daten umfassen Vitalzeichen und Wundmessungen; objektive Daten sind Schmerzangaben des Patienten","Beide Arten sind austauschbar und bezeichnen jede Information, die im Pflegekontakt gesammelt wird"],
        correct: 1,
        fillTemplate: "___ Daten sind Angaben des Patienten selbst. ___ Daten sind messbare Befunde, die die Pflegeperson erhebt.",
        fillAnswers: ["Subjektive","Objektive"],
      },
      {
        q: "Warum ist die Evaluation (Auswertung) im Pflegeprozess wichtig?",
        a: "Die Evaluation prüft, ob die Pflegeziele erreicht wurden. Sie ist Grundlage für die Anpassung der Pflegeplanung und sichert die Qualität der Pflege.",
        options: ["Sie dokumentiert abgeschlossene Maßnahmen für Abrechnungszwecke und findet quartalsweise statt","Sie prüft die Zielerreichung und ist Basis für Anpassungen der Pflegeplanung","Sie ist Aufgabe des Medizinischen Dienstes bei externen Qualitätsprüfungen","Sie fasst den Fortschritt des Bewohners für die jährliche Fallbesprechung und Angehörige zusammen"],
        correct: 1,
        fillTemplate: "Die Evaluation prüft, ob ___ erreicht wurden. Sie ist die Basis für ___ der Pflegeplanung.",
        fillAnswers: ["Pflegeziele","Anpassungen"],
      },
      {
        q: "Welche Aufbewahrungsfrist gilt für Pflegedokumentationen?",
        a: "In der Regel 10 Jahre. Bei Minderjährigen bis 10 Jahre nach Volljährigkeit. Die genaue Frist kann je nach Bundesland variieren.",
        options: ["5 Jahre entsprechend der zivilrechtlichen Verjährungsfrist für vertragliche Ansprüche","6 Jahre nach den handelsrechtlichen Aufbewahrungsvorschriften gemäß Steuerrecht","10 Jahre","30 Jahre, da Ansprüche bei Behandlungsfehlern in der Pflege nicht verjähren"],
        correct: 2,
        fillTemplate: "Pflegedokumentationen müssen in der Regel ___ Jahre aufbewahrt werden. Bei Minderjährigen gilt eine besondere ___.",
        fillAnswers: ["10","Regelung"],
      },
      {
        q: "Was bedeutet das Vier-Phasen-Pflegeprozessmodell der WHO (Yura & Walsh)?",
        a: "1. Assessment (Einschätzung), 2. Planning (Planung), 3. Implementation (Durchführung), 4. Evaluation. Es ist ein kontinuierlicher Kreislauf.",
        options: ["Assessment, Pflegediagnose, Intervention, Ergebnis – entspricht dem fünfstufigen NANDA-Modell","Assessment, Planning, Implementation, Evaluation","Assessment, Planung, Intervention, Ergebnis – das APIO-Modell nach Alfaro-LeFevre","Informationssammlung, Problemerfassung, Pflegeplanung, Durchführung – nach dem Fiechter/Meier-Modell"],
        correct: 1,
        fillTemplate: "Das WHO-Pflegeprozessmodell besteht aus vier Phasen: Assessment, ___, Implementation und ___.",
        fillAnswers: ["Planning","Evaluation"],
      },
      {
        q: "Was ist eine Pflegediagnose (z.B. nach NANDA)?",
        a: "Eine Pflegediagnose beschreibt einen Pflegezustand oder ein Pflegeproblem in standardisierter Form (z.B. 'Beeinträchtigte körperliche Mobilität'). NANDA ist ein internationales Klassifikationssystem.",
        options: ["Eine ärztliche Diagnose, die in den Pflegeplan übernommen und pflegerisch umgesetzt wird","Standardisierte Beschreibung eines Pflegezustands (z.B. NANDA-System)","Ein kurzfristiges Pflegeziel, das als Reaktion auf eine akute Verschlechterung formuliert wird","Eine konkrete Pflegemaßnahme mit Häufigkeit und verantwortlicher Person im Maßnahmenplan"],
        correct: 1,
        fillTemplate: "Eine Pflegediagnose beschreibt einen Pflegezustand in ___ Form. NANDA ist ein internationales ___.",
        fillAnswers: ["standardisierter","Klassifikationssystem"],
      },
      {
        q: "Welche Phasen enthält eine vollständige Pflegevisite?",
        a: "Vorbereitung (Dokumentation sichten), Durchführung (Bewohnergespräch, Begutachtung), Nachbereitung (Anpassung der Pflegeplanung, Dokumentation der Ergebnisse).",
        options: ["Eine unangemeldete Kontrolle durch die Pflegeleitung ohne vorherige Dokumentationssichtung","Vorbereitung, Durchführung am Bewohner und Nachbereitung mit Plananpassung","Ein Angehörigengespräch zur Besprechung des Pflegeplans und der Wünsche des Bewohners","Eine formale Prüfung durch den Medizinischen Dienst im Rahmen der jährlichen Qualitätsprüfung"],
        correct: 1,
        fillTemplate: "Eine Pflegevisite umfasst ___, Durchführung am Bewohner und ___ mit Anpassung der Pflegeplanung.",
        fillAnswers: ["Vorbereitung","Nachbereitung"],
      },
      {
        q: "Was ist das Strukturmodell und wie unterscheidet es sich von der klassischen Pflegeplanung?",
        a: "Das Strukturmodell (Entbürokratisierung) vereinfacht die Pflegedokumentation: Kernstück ist die SIS® (Strukturierte Informationssammlung), ergänzt durch einen individuellen Maßnahmenplan und Berichtsblatt. Weniger Formulare, mehr Individualität.",
        options: ["Ein digitales Pflegemanagementsystem, das Dokumentation bundesweit in Pflegeeinrichtungen vereinheitlicht","Vereinfachte Dokumentation mit SIS® als Kern – weniger Formulare, mehr Individualität","Eine Weiterentwicklung des klassischen Pflegeprozesses mit zusätzlichen Pflichtassessmentinstrumenten","Ein rechtlicher Rahmen, der Mindestdokumentationsstandards des Medizinischen Dienstes festlegt"],
        correct: 1,
        fillTemplate: "Das Strukturmodell basiert auf der ___ (SIS®) und einem individuellen Maßnahmenplan. Es reduziert den ___aufwand.",
        fillAnswers: ["Strukturierten Informationssammlung","Dokumentations"],
      },
      {
        q: "Was bedeutet 'Biografiearbeit' in der Altenpflege?",
        a: "Biografiearbeit erfasst die Lebensgeschichte des Bewohners (Herkunft, Beruf, Vorlieben, wichtige Erlebnisse, Rituale). Sie bildet die Grundlage für individualisierte, bedürfnisorientierte Pflege, besonders bei Demenz.",
        options: ["Eine therapeutische Schreibmethode, bei der Bewohner ihre Autobiografie verfassen oder diktieren","Erfassung der Lebensgeschichte als Grundlage für individualisierte Pflege","Eine reminiszenzbasierte Gruppenaktivität, die von Sozialarbeitern für kognitiv intakte Bewohner geleitet wird","Eine formale psychologische Persönlichkeitsbewertung, die bei der Aufnahme durchgeführt wird"],
        correct: 1,
        fillTemplate: "Biografiearbeit erfasst die ___ des Bewohners. Sie ist besonders wichtig bei ___ und für individuelle Pflege.",
        fillAnswers: ["Lebensgeschichte","Demenz"],
      },
      {
        q: "Was ist Qualitätssicherung in der Altenpflege und welche externen Prüfungen gibt es?",
        a: "Qualitätssicherung umfasst interne Maßnahmen (Pflegevisiten, Fallbesprechungen, Pflegestandards) und externe Prüfungen durch den Medizinischen Dienst (MD/MDK), die Heimaufsicht und andere Behörden. Ergebnisse werden veröffentlicht.",
        options: ["Jährliche Bewohnerbefragungen, die von einem unabhängigen externen Institut ausgewertet werden","Interne Maßnahmen + externe Prüfungen durch MD/MDK und Heimaufsicht","Prüfungen ausschließlich durch das Gesundheitsamt, nur wenn Beschwerden eingereicht wurden","Ein freiwilliges Zertifizierungsverfahren, das Einrichtungen zur Qualitätsdemonstration beantragen können"],
        correct: 1,
        fillTemplate: "Externe Qualitätsprüfungen werden durch den ___ und die ___ durchgeführt.",
        fillAnswers: ["Medizinischen Dienst","Heimaufsicht"],
      },
    ],
  },

  // ── 3. ANATOMIE & PHYSIOLOGIE ────────────────────────────────────────────
  "Anatomie & Physiologie": {
    color: "#7ca8e8", icon: "🫀",
    questions: [
      {
        q: "Welche Hauptaufgabe hat das Herz-Kreislauf-System?",
        a: "Transport von Sauerstoff, Nährstoffen, Hormonen und Abfallstoffen durch den Körper. Das Herz als Pumpe treibt das Blut durch den Blutkreislauf.",
        options: ["Körpertemperatur durch Erweiterung und Verengung der Hautblutgefäße regulieren","Sauerstoff und Nährstoffe transportieren","Hormone über das Blut produzieren und an Zielorgane verteilen","Stoffwechselabbauprodukte über die Leber filtern und ausscheiden"],
        correct: 1,
        fillTemplate: "Das Herz-Kreislauf-System transportiert ___, Nährstoffe und Abfallstoffe. Das Herz wirkt dabei als ___.",
        fillAnswers: ["Sauerstoff","Pumpe"],
      },
      {
        q: "Was ist der Unterschied zwischen Puls und Blutdruck?",
        a: "Puls = Herzschlagfrequenz (normal: 60–80/min). Blutdruck = Druck des Blutes in den Gefäßen (normal: 120/80 mmHg).",
        options: ["Puls ist die Druckwelle in den Venen; Blutdruck ist die Rate der Ventrikelkontraktionen pro Minute","Puls = Herzfrequenz, Blutdruck = Druck in den Gefäßen","Puls misst die arterielle Sauerstoffsättigung; Blutdruck misst das Herzzeitvolumen","Blutdruck misst nur den Druck im Augenblick des Herzschlags; Puls misst sowohl Systole als auch Diastole"],
        correct: 1,
        fillTemplate: "Ein normaler Puls liegt bei ___ bis 80 Schlägen pro Minute. Ein normaler Blutdruck beträgt ___/80 mmHg.",
        fillAnswers: ["60","120"],
      },
      {
        q: "Was sind die vier Herzkammern und ihre Funktion?",
        a: "Rechter Vorhof und rechte Kammer pumpen sauerstoffarmes Blut zur Lunge (kleiner Kreislauf). Linker Vorhof und linke Kammer pumpen sauerstoffreiches Blut in den Körper (großer Kreislauf).",
        options: ["Alle vier Kammern pumpen gleichzeitig Blut in den Körper- und Lungenkreislauf","Rechts: Blut zur Lunge, Links: Blut in den Körper","Die linke Kammer pumpt sauerstoffarmes Blut zur Lunge; die rechte Kammer in den Körperkreislauf","Das Herz hat nur eine Pumpkammer, die durch das Septum in eine rechte und linke Seite geteilt wird"],
        correct: 1,
        fillTemplate: "Die rechte Herzkammer pumpt sauerstoffarmes Blut zur ___. Die linke Kammer pumpt sauerstoffreiches Blut in den ___ Kreislauf.",
        fillAnswers: ["Lunge","großen"],
      },
      {
        q: "Welche Organe gehören zum Verdauungssystem?",
        a: "Mund, Speiseröhre, Magen, Dünndarm, Dickdarm, Leber, Gallenblase, Bauchspeicheldrüse, Mastdarm und After.",
        options: ["Mund, Speiseröhre, Magen, Darm, Leber, Gallenblase – ohne Bauchspeicheldrüse","Mund, Magen, Darm, Leber, Bauchspeicheldrüse","Mund, Magen, Leber, Bauchspeicheldrüse, Niere – letztere scheidet Endprodukte der Verdauung aus","Speiseröhre, Magen, Dünndarm, Leber – Dickdarm und After gehören nicht zum Verdauungssystem"],
        correct: 1,
        fillTemplate: "Zum Verdauungssystem gehören Mund, ___, Magen, Dünndarm, Dickdarm, ___ und Bauchspeicheldrüse.",
        fillAnswers: ["Speiseröhre","Leber"],
      },
      {
        q: "Was sind die Aufgaben der Nieren?",
        a: "Filterung des Blutes, Ausscheidung von Harnstoff und Abfallstoffen, Regulation des Wasserhaushalts und Blutdrucks, Produktion von Erythropoetin und Renin.",
        options: ["Gallensalze und Verdauungsenzyme produzieren, um die Aufnahme von Fetten und fettlöslichen Vitaminen zu unterstützen","Blut filtern, Abfallstoffe ausscheiden, Wasserhaushalt regulieren","Medikamente und Stoffwechselprodukte über das hepatische Enzymsystem entgiften","Kalzium- und Phosphatstoffwechsel durch Aktivierung von Vitamin D in der Haut regulieren"],
        correct: 1,
        fillTemplate: "Die Nieren filtern das ___ und scheiden Harnstoff aus. Sie regulieren außerdem den ___ und Blutdruck.",
        fillAnswers: ["Blut","Wasserhaushalt"],
      },
      {
        q: "Was versteht man unter dem autonomen (vegetativen) Nervensystem?",
        a: "Der Teil des Nervensystems, der unwillkürliche Körperfunktionen steuert (Herzschlag, Atmung, Verdauung). Besteht aus Sympathikus (aktivierend) und Parasympathikus (entspannend).",
        options: ["Der Teil des Nervensystems, der willkürliche Bewegungen und die sensorische Verarbeitung steuert","Das System für unwillkürliche Funktionen (Sympathikus/Parasympathikus)","Das periphere Nervensystem, das Sinnesimpulse von Haut und Muskeln zum Gehirn weiterleitet","Das zentrale Nervensystem bestehend aus Gehirn und Rückenmark"],
        correct: 1,
        fillTemplate: "Das autonome Nervensystem steuert ___ Körperfunktionen wie Herzschlag. Es besteht aus ___ und Parasympathikus.",
        fillAnswers: ["unwillkürliche","Sympathikus"],
      },
      {
        q: "Was ist Osteoporose und welche Risikofaktoren gibt es?",
        a: "Osteoporose = Knochenschwund: Abnahme der Knochendichte, erhöhte Bruchgefahr. Risikofaktoren: Alter, Östrogenmangel (Frauen nach den Wechseljahren), Kalziummangel, Bewegungsmangel, Kortisontherapie.",
        options: ["Fortschreitender Gelenkknorpelabbau mit chronischen Schmerzen und eingeschränkter Mobilität","Knochenschwund mit erhöhtem Bruchrisiko; Risiken: Alter, Östrogenmangel, Kalziummangel","Autoimmune Gelenkentzündung mit Schwellung, Schmerz und systemischen Begleiterscheinungen","Muskelabbau durch verminderte körperliche Aktivität und reduzierte Proteinzufuhr im Alter"],
        correct: 1,
        fillTemplate: "Osteoporose bedeutet Abnahme der ___ mit erhöhtem Bruchrisiko. Typische Risikofaktoren sind Alter, ___ und Kalziummangel.",
        fillAnswers: ["Knochendichte","Östrogenmangel"],
      },
      {
        q: "Welche Funktion hat die Haut als größtes Organ?",
        a: "Schutzfunktion (gegen Keime, Verletzungen), Wärmeregulation (Schwitzen, Blutgefäßerweiterung), Sinnesorgan (Tastsinn, Schmerz, Temperatur), Vitamin-D-Synthese, Kommunikation (Röte, Schweiß).",
        options: ["Ausschließlich mechanischer Schutz und Vitamin-D-Synthese; keine Sinnesfunktionen","Schutz, Wärmeregulation, Sinnesorgan, Vitamin-D-Synthese","Hauptsächlich Abwehr von Krankheitserregern durch Immunzellen in der Dermis","Hauptsächlich Hormonproduktion über Talg- und Schweißdrüsen"],
        correct: 1,
        fillTemplate: "Die Haut übernimmt Schutz-, ___ und Sinnesfunktionen. Sie ist auch zuständig für die ___-D-Synthese.",
        fillAnswers: ["Wärmeregulations","Vitamin"],
      },
      {
        q: "Was sind normale Vitalzeichen (Normwerte) beim Erwachsenen?",
        a: "Blutdruck: 120/80 mmHg. Puls: 60–80/min. Atemfrequenz: 12–18/min. Körpertemperatur: 36,5–37,4°C. SpO2: >95%.",
        options: ["Blutdruck 130/85, Puls 70–90, Atmung 16–20/min, Temperatur 36,8–37,8°C","Blutdruck 120/80, Puls 60–80, Atmung 12–18/min, Temperatur 36,5–37,4°C","Blutdruck 110/70, Puls 50–70, Atmung 10–14/min, Temperatur 36,0–36,8°C","Blutdruck 100/60 gilt als Normalwert, alles darüber ist leicht erhöht"],
        correct: 1,
        fillTemplate: "Normaler Blutdruck: ___/80 mmHg. Normaler Puls: 60–___ Schläge/min. Normale Körpertemperatur: 36,5–37,4°C.",
        fillAnswers: ["120","80"],
      },
      {
        q: "Welche Veränderungen am Bewegungsapparat treten im Alter typischerweise auf?",
        a: "Abnahme der Muskelmasse (Sarkopenie), Verminderung der Knochendichte (Osteoporose), Abnutzung der Gelenke (Arthrose), eingeschränkte Beweglichkeit und Gleichgewichtsstörungen.",
        options: ["Verbesserte Gelenkbeweglichkeit und Propriozeption durch jahrzehntelange körperliche Aktivität","Sarkopenie, Osteoporose, Arthrose, eingeschränkte Beweglichkeit","Knochendichte nimmt nach dem 60. Lebensjahr zu, da der Körper durch Kortikalverdickung kompensiert","Muskeln werden im Alter effizienter durch selektive motorische Einheitenaktivierung"],
        correct: 1,
        fillTemplate: "Im Alter nimmt die Muskelmasse ab (___)  und die Knochendichte nimmt ab (___). Auch Gelenkabnutzung (Arthrose) ist häufig.",
        fillAnswers: ["Sarkopenie","Osteoporose"],
      },
      {
        q: "Was ist der Unterschied zwischen Arterie und Vene?",
        a: "Arterien führen Blut vom Herzen weg (meistens sauerstoffreich). Venen führen Blut zum Herzen hin (meistens sauerstoffarm). Ausnahme: Lungenarterie/-vene.",
        options: ["Arterien transportieren sauerstoffarmes Blut zum Herzen; Venen führen sauerstoffreiches Blut aus der Lunge","Arterien führen Blut vom Herzen weg, Venen zum Herzen hin","Arterien transportieren Blut mit niedrigem Druck; Venen mit hohem Druck durch die Herzpumpe","Arterien befinden sich nur in Brust und Bauch; Venen versorgen die Extremitäten und peripheres Gewebe"],
        correct: 1,
        fillTemplate: "___ führen Blut vom Herzen weg (meist sauerstoffreich). ___ führen Blut zum Herzen hin (meist sauerstoffarm).",
        fillAnswers: ["Arterien","Venen"],
      },
      {
        q: "Welche Hormone produziert die Bauchspeicheldrüse und welche Funktion haben sie?",
        a: "Insulin (senkt Blutzucker), Glukagon (hebt Blutzucker). Außerdem Verdauungsenzyme (exokriner Anteil). Bei Diabetes mellitus ist die Insulinproduktion gestört.",
        options: ["Glukagon senkt den Blutzucker, Insulin hebt ihn – umgekehrt zu den gängigen Annahmen","Insulin (senkt Blutzucker) und Glukagon (hebt Blutzucker)","Insulin und Amylase; Amylase ist der wichtigste Blutzuckerregulator der endokrinen Bauchspeicheldrüse","Somatostatin und Gastrin koordinieren die Verdauung; Insulin wird in der Leber produziert"],
        correct: 1,
        fillTemplate: "Die Bauchspeicheldrüse produziert ___ (senkt Blutzucker) und Glukagon. Bei Diabetes ist die ___produktion gestört.",
        fillAnswers: ["Insulin","Insulin"],
      },
      {
        q: "Was versteht man unter Demenz aus neurologischer Sicht?",
        a: "Demenz ist eine erworbene Hirnleistungsstörung mit Abbau kognitiver Funktionen (Gedächtnis, Sprache, Orientierung, Urteilsvermögen) durch Nervenzelluntergang. Häufigste Form: Alzheimer-Demenz.",
        options: ["Ein reversibler kognitiver Abbau durch Vitamin-B12-Mangel, der der Demenz sehr ähnelt","Erworbene Hirnleistungsstörung durch Nervenzelluntergang, häufigste Form ist Alzheimer","Ein primär psychiatrisches Syndrom wie die Depression mit vorübergehendem Gedächtnisverlust","Eine normale altersbedingte Hirnleistungsminderung, die jeden Menschen im Alter betrifft"],
        correct: 1,
        fillTemplate: "Demenz ist eine erworbene ___ durch Nervenzelluntergang. Die häufigste Form ist die ___-Demenz.",
        fillAnswers: ["Hirnleistungsstörung","Alzheimer"],
      },
      {
        q: "Wie funktioniert die Atmung und was ist Gasaustausch?",
        a: "Beim Einatmen gelangt Sauerstoff (O2) über die Lunge ins Blut; beim Ausatmen wird Kohlendioxid (CO2) abgegeben. Der Gasaustausch findet in den Lungenbläschen (Alveolen) statt.",
        options: ["O2 und CO2 werden gleichzeitig in den Bronchiolen während jedes Atemzugs ausgetauscht","O2 wird eingeatmet und ins Blut aufgenommen; CO2 abgeatmet; Gasaustausch in den Alveolen","Der Gasaustausch findet in den Bronchien statt, wo Blutgefäße Sauerstoff durch die Atemwegswände aufnehmen","O2 gelangt über das Lymphsystem zu den Zellen; CO2 wird von den Nieren ausgeschieden"],
        correct: 1,
        fillTemplate: "Beim Einatmen wird ___ (O2) ins Blut aufgenommen. Der Gasaustausch findet in den ___ statt.",
        fillAnswers: ["Sauerstoff","Alveolen"],
      },
      {
        q: "Was ist Bluthochdruck (Hypertonie) und ab wann ist er behandlungsbedürftig?",
        a: "Hypertonie = dauerhaft erhöhter Blutdruck. Behandlungsbedürftig ab ≥140/90 mmHg (WHO). Risiko: Herzinfarkt, Schlaganfall, Niereninsuffizienz. Bei älteren Menschen häufig.",
        options: ["Erhöhter Blutdruck über 130/85 mmHg, der sofortige Behandlung und stationäre Aufnahme erfordert","Dauerhaft erhöhter Blutdruck ab ≥140/90 mmHg mit Risiken für Herz, Gefäße, Nieren","Ein vorübergehend erhöhter Blutdruck über 160/100 mmHg bei körperlicher Belastung oder Stress","Nur systolische Werte über 180 mmHg sind behandlungsbedürftig; darunter gilt alles als normal bei Älteren"],
        correct: 1,
        fillTemplate: "Hypertonie bedeutet dauerhaft erhöhter Blutdruck ab ___ mmHg systolisch. Risiken sind Herzinfarkt und ___.",
        fillAnswers: ["140","Schlaganfall"],
      },
      {
        q: "Welche altersbedingten Veränderungen betreffen die Verdauung?",
        a: "Verlangsamte Darmperistaltik (Obstipation häufiger), verminderte Speichelproduktion, Appetitlosigkeit, reduzierte Magensäure, Schluckstörungen (Dysphagie) häufiger.",
        options: ["Gesteigerte Darmperistaltik mit häufigeren Stuhlgängen und lockerem Stuhl durch Alterung","Verlangsamte Peristaltik, weniger Speichel, Obstipationneigung, Schluckstörungen häufiger","Verbesserte Nährstoffresorption durch längere Passagezeit im Dünndarm im Alter","Gesteigerte Magensäureproduktion, die zu höheren Raten von Magengeschwüren bei Älteren führt"],
        correct: 1,
        fillTemplate: "Im Alter verlangsamt sich die Darmperistaltik, was ___ begünstigt. Auch ___ (Schluckstörungen) kommen häufiger vor.",
        fillAnswers: ["Obstipation","Dysphagie"],
      },
      {
        q: "Was versteht man unter Inkontinenz und welche Formen gibt es?",
        a: "Inkontinenz = unfreiwilliger Harnverlust. Formen: Belastungsinkontinenz (Husten, Niesen), Dranginkontinenz (plötzlicher Harndrang), Überlaufinkontinenz, gemischte Inkontinenz. Im Alter häufig durch schwache Beckenbodenmuskulatur.",
        options: ["Willkürliches, aber häufiges Wasserlassen durch Blasenentzündungen oder harntreibende Medikamente","Unfreiwilliger Harnverlust; Formen: Belastungs-, Drang-, Überlaufinkontinenz","Eine altersbedingte Erkrankung, die ausschließlich Frauen durch Beckenbodenschwäche nach Geburten betrifft","Reduzierte Blasenkapazität mit häufigem, aber vollständig kontrolliertem Wasserlassen im Alter"],
        correct: 1,
        fillTemplate: "Inkontinenz bezeichnet unfreiwilligen ___. Eine häufige Form im Alter ist die ___, oft durch schwache Beckenbodenmuskulatur.",
        fillAnswers: ["Harnverlust","Belastungsinkontinenz"],
      },
      {
        q: "Was ist der Unterschied zwischen systolischem und diastolischem Blutdruck?",
        a: "Systolisch = Druck beim Herzschlag (Herzkontraktion) – oberer Wert. Diastolisch = Druck in der Entspannungsphase des Herzens – unterer Wert. Normal: 120 (systolisch) / 80 (diastolisch) mmHg.",
        options: ["Systolisch ist der untere Ruhewert in der Entspannungsphase; diastolisch ist der Spitzendruck beim Herzschlag","Systolisch = oberer Wert (Herzschlag), diastolisch = unterer Wert (Entspannung)","Beide Werte spiegeln das Herzzeitvolumen wider, gemessen zu unterschiedlichen Zeitpunkten im Atemzyklus","Der diastolische Wert ist klinisch bedeutsamer, da er den Basisgefäßdruck in der Ruhephase widerspiegelt"],
        correct: 1,
        fillTemplate: "Der ___ Blutdruck ist der obere Wert beim Herzschlag. Der ___ Blutdruck ist der untere Wert in der Ruhephase.",
        fillAnswers: ["systolische","diastolische"],
      },
      {
        q: "Welche Auswirkungen hat Immobilität auf den Körper?",
        a: "Muskelabbau (Sarkopenie), Dekubitusrisiko, Thrombose-/Emboliegefahr, Pneumoniegefahr, Kontrakturen, Obstipation, psychische Beeinträchtigungen (Depressionen), Orientierungsverlust.",
        options: ["Nur Muskelabbau und Dekubitus sind relevant; alle anderen Folgen werden von Fachteams behandelt","Muskelabbau, Dekubitus, Thrombose, Pneumonie, Kontrakturen, Obstipation, Depressionen","Körperliche Folgen sind die einzigen Konsequenzen; Psyche und Kognition sind durch Immobilität nicht betroffen","Immobilität führt primär zu Herzrhythmusstörungen und reduziertem Herzzeitvolumen, weil das Herz weniger arbeitet"],
        correct: 1,
        fillTemplate: "Immobilität führt zu Muskelabbau, erhöhtem ___ Risiko und ___ Gefahr. Auch psychische Beeinträchtigungen sind möglich.",
        fillAnswers: ["Dekubitus","Thrombose"],
      },
    ],
  },

  // ── 4. KRANKHEITSBILDER ───────────────────────────────────────────────────
  "Krankheitsbilder": {
    color: "#e87c9a", icon: "🏥",
    questions: [
      {
        q: "Was ist Diabetes mellitus Typ 2 und wie äußert er sich?",
        a: "Typ 2: Insulinresistenz und relative Insulinmangel. Symptome: Müdigkeit, Durst, häufiges Wasserlassen, langsame Wundheilung, Sehstörungen. Häufig bei Übergewicht, Bewegungsmangel, im Alter.",
        options: ["Absoluter Insulinmangel, der bei Erstmanifestation unabhängig vom Alter sofortige Insulintherapie erfordert","Insulinresistenz; Symptome: Müdigkeit, Durst, häufiges Wasserlassen, langsame Wundheilung","Ein metabolisches Syndrom durch übermäßigen Kohlenhydratkonsum, das durch Diät vollständig reversibel ist","Eine Autoimmunzerstörung der insulinproduzierenden Betazellen, mechanistisch identisch mit Typ-1-Diabetes"],
        correct: 1,
        fillTemplate: "Diabetes Typ 2 entsteht durch Insulinresistenz. Typische Symptome sind Müdigkeit, ___ und langsame ___.",
        fillAnswers: ["Durst","Wundheilung"],
      },
      {
        q: "Was ist Hypoglykämie und wie wird sie sofort behandelt?",
        a: "Hypoglykämie = Unterzuckerung (Blutzucker < 70 mg/dl). Symptome: Zittern, Schwitzen, Herzrasen, Verwirrtheit, Bewusstlosigkeit. Sofortmaßnahme: schnell wirkende Kohlenhydrate geben (Traubenzucker, Saft, Cola).",
        options: ["Erhöhter Blutzucker mit Schwindel; behandelt durch Auslassen der nächsten Insulindosis","Unterzuckerung; sofort schnell wirkende Kohlenhydrate (Traubenzucker, Saft) geben","Niedriger Blutdruck durch Insulinüberdosierung; behandelt durch Flachlagerung mit erhöhten Beinen","Gefährlich hoher Blutzucker, der sofortige Gabe von kurzwirkendem Insulin erfordert"],
        correct: 1,
        fillTemplate: "Hypoglykämie bedeutet ___. Sofortmaßnahme: schnell wirkende ___ wie Traubenzucker geben.",
        fillAnswers: ["Unterzuckerung","Kohlenhydrate"],
      },
      {
        q: "Was ist ein Schlaganfall (Apoplex/Insult) und welche Warnsymptome gibt es?",
        a: "Schlaganfall = plötzlicher Ausfall von Hirnfunktionen durch Durchblutungsstörung oder Blutung. FAST-Test: Face (einseitige Gesichtslähmung), Arms (Armlähmung), Speech (Sprachstörung), Time (sofort Notruf).",
        options: ["Ein kardialer Notfall mit schwerem Brustschmerz und Ausstrahlung in den Arm und Kiefer","Plötzlicher Hirnfunktionsausfall; FAST: Gesichtslähmung, Armlähmung, Sprachstörung, sofort 112","Eine hypertensive Krise mit plötzlichem Kopfschmerz, Sehstörungen und Nackensteife","Eine transitorische ischämische Attacke (TIA), die kurze Symptome verursacht und sich binnen 24 h löst"],
        correct: 1,
        fillTemplate: "Beim Schlaganfall gilt der FAST-Test: ___ (Gesicht), Arms, Speech und Time – sofort ___.",
        fillAnswers: ["Face","Notruf 112"],
      },
      {
        q: "Was ist Herzinsuffizienz und welche typischen Symptome treten auf?",
        a: "Herzinsuffizienz = Pumpschwäche des Herzens. Symptome: Atemnot (besonders bei Belastung und im Liegen), Ödeme (Beine), Müdigkeit, nächtlicher Harndrang, Husten.",
        options: ["Herzrhythmusstörungen mit Herzklopfen und Synkopen, die antiarrhythmische Medikamente erfordern","Pumpschwäche; Atemnot bei Belastung/Liegen, Beinödeme, Müdigkeit, Husten","Koronare Herzerkrankung mit Angina pectoris, aber ohne Flüssigkeitsretention oder Ruhedyspnoe","Hypertensive Kardiomyopathie mit ausschließlich erhöhtem Blutdruck und gelegentlichem Kopfschmerz"],
        correct: 1,
        fillTemplate: "Herzinsuffizienz ist eine Pumpschwäche des Herzens. Typisch sind ___ bei Belastung, ___ an den Beinen und Müdigkeit.",
        fillAnswers: ["Atemnot","Ödeme"],
      },
      {
        q: "Was ist Morbus Parkinson und welche Hauptsymptome hat er?",
        a: "Parkinson = neurodegenerative Erkrankung durch Dopaminmangel. Kardinalsymptome: Tremor (Ruhetremor), Rigor (Muskelsteife), Akinese/Hypokinese (Bewegungsarmut), posturale Instabilität (Gleichgewichtsstörung).",
        options: ["Eine Demenzform mit progressivem Gedächtnisverlust durch kortikale Lewy-Körper-Ablagerungen","Neurodegenerativ durch Dopaminmangel; Tremor, Rigor, Akinese, Gleichgewichtsstörung","Eine zerebelläre Erkrankung mit Intentionstremor, Ataxie und Koordinationsstörungen","Eine Motoneuronerkrankung mit progredientem Muskelschwund und Lähmung"],
        correct: 1,
        fillTemplate: "Parkinson entsteht durch Mangel an ___. Die vier Kardinalsymptome sind Tremor, Rigor, ___ und posturale Instabilität.",
        fillAnswers: ["Dopamin","Akinese"],
      },
      {
        q: "Was ist COPD und welche Pflegebesonderheiten gibt es?",
        a: "COPD = chronisch obstruktive Lungenerkrankung (meist durch Rauchen). Symptome: Husten, Auswurf, Atemnot (pink puffer / blue bloater). Pflege: Atemübungen, Oberkörperhochlagerung, Sauerstofftherapie beachten, keine hohe Sauerstoffgabe.",
        options: ["Reversible Atemwegsverengung; Pflege: hohe Sauerstoffgabe, Flachlagerung, Inhalation vor dem Schlafen","Chronisch obstruktive Lungenerkrankung; Atemübungen, Oberkörperhochlagerung, kein hoher O2-Spiegel","Restriktive Lungenerkrankung (Fibrose); Pflege: Bauchlagerung und hoher Sauerstofffluss nach Bedarf","Chronisches Asthma; Pflege: Beruhigung, frische Luft, Bronchodilatator-Spray bereithalten"],
        correct: 1,
        fillTemplate: "COPD ist eine chronisch ___ Lungenerkrankung. In der Pflege sind Atemübungen und ___ wichtig.",
        fillAnswers: ["obstruktive","Oberkörperhochlagerung"],
      },
      {
        q: "Was sind Druckgeschwüre (Dekubitus) und wie werden sie nach Graden eingeteilt?",
        a: "Dekubitus entsteht durch anhaltenden Druck. Grad 1: Rötung. Grad 2: Oberflächlicher Defekt bis zur Dermis. Grad 3: Tiefer Defekt bis zur Subkutis. Grad 4: Defekt bis Muskeln/Knochen.",
        options: ["Eine Hautkomplikation in 3 Graden von oberflächlich bis tief, die immer antibiotische Behandlung erfordert","Druckbedingte Wunden; Grad 1–4 nach Tiefe (Rötung bis Knochen)","Eine Wunde, die sich nur bei bettlägerigen Patienten entwickelt und ausschließlich Knochenvorsprünge betrifft","Eine Hautreaktion durch Feuchtigkeit bei Inkontinenz, die getrennt von druckbedingten Wunden klassifiziert wird"],
        correct: 1,
        fillTemplate: "Dekubitus entsteht durch anhaltenden ___. Grad 1 zeigt nicht wegdrückbare ___; Grad 4 reicht bis zu Knochen.",
        fillAnswers: ["Druck","Rötung"],
      },
      {
        q: "Was ist eine Harnwegsinfektion (HWI) und welche Symptome zeigen ältere Menschen?",
        a: "HWI = Infektion der Harnwege durch Bakterien (meist E. coli). Bei älteren Menschen oft atypische Symptome: Verwirrtheit, Unruhe, Stürze, Appetitlosigkeit. Klassisch: Brennen beim Wasserlassen, Häufigkeit.",
        options: ["Eine virale Entzündung des Nierenbeckens mit Fieber und Flankenschmerzen, die mit Virostatika behandelt wird","Bakterieninfektion; bei Älteren oft Verwirrtheit, Unruhe, Stürze statt typischer Symptome","Eine Pilzinfektion der Harnblase, die bei älteren Frauen mit Katheterversorgung häufig vorkommt","Ein chronisch-entzündlicher Blasenzustand, der eine dauerhafte Antibiotikaprophylaxe erfordert"],
        correct: 1,
        fillTemplate: "Bei einer Harnwegsinfektion zeigen ältere Menschen oft ___ Symptome wie Verwirrtheit und Unruhe statt des typischen ___.",
        fillAnswers: ["atypische","Brennens"],
      },
      {
        q: "Was ist Arthrose und wie unterscheidet sie sich von Arthritis?",
        a: "Arthrose = degenerativ (Gelenkverschleiß durch Abnutzung). Arthritis = entzündlich (z.B. rheumatoide Arthritis, durch Immunreaktion). Bei Arthrose Schmerzen bei Belastung; bei Arthritis auch in Ruhe und morgens.",
        options: ["Arthrose ist entzündlich durch Autoimmunreaktion; Arthritis degenerativ durch Knorpelabnutzung","Arthrose = Gelenkverschleiß (degenerativ); Arthritis = Gelenksentzündung (entzündlich)","Arthritis betrifft nur die kleinen Fingergelenke; Arthrose nur die großen Gelenke wie Knie und Hüfte","Arthrose verursacht typischerweise Ruheschmerzen; bei Arthritis treten Schmerzen nur bei Belastung auf"],
        correct: 1,
        fillTemplate: "Arthrose ist ein ___ bedingter Gelenkverschleiß. Arthritis ist eine ___ Gelenkerkrankung.",
        fillAnswers: ["degenerativ","entzündliche"],
      },
      {
        q: "Was ist Pneumonie (Lungenentzündung) und welche Risikofaktoren erhöhen das Risiko in der Pflege?",
        a: "Pneumonie = Entzündung des Lungengewebes (meist bakteriell). Pflegebezogene Risikofaktoren: Bettlägerigkeit, Schluckstörungen (Aspirationsgefahr), Immobilisation, hohes Alter, Immunschwäche.",
        options: ["Eine Bronchialentzündung der Atemwege ohne Beteiligung der Alveolen oder des Lungengewebes","Entzündung des Lungengewebes; Risikofaktoren: Bettlägerigkeit, Schluckstörungen, Immunschwäche","Ausschließlich eine virale Infektion, die nur immungeschwächte Pflegebedürftige in Intensivpflege betrifft","Ein reversibler obstruktiver Lungenzustand, ausgelöst durch Allergene oder Kaltluftexposition"],
        correct: 1,
        fillTemplate: "Pneumonie ist eine ___ des Lungengewebes. Pflegebezogene Risiken sind ___ und Schluckstörungen.",
        fillAnswers: ["Entzündung","Bettlägerigkeit"],
      },
      {
        q: "Was ist eine Thrombose und welche Prophylaxemaßnahmen gibt es?",
        a: "Thrombose = Blutgerinnsel in einem Blutgefäß (meist Beinvene). Prophylaxe: Bewegung/Mobilisation, Kompressionsstrümpfe, ausreichend Flüssigkeit, medikamentöse Antikoagulation, Hochlagern der Beine.",
        options: ["Venenwandentzündung (Phlebitis); Prophylaxe: Kühlung, Hochlagern und Antiphlogistika oral","Blutgerinnsel in einem Blutgefäß; Prophylaxe: Mobilisation, Kompressionsstrümpfe, Flüssigkeit","Arterieller Gefäßverschluss; Prophylaxe: Blutverdünner und Blutdruckkontrolle täglich","Varikosis (Krampfadern) durch Klappeninsuffizienz; Prophylaxe: Stützstrümpfe und Gewichtsreduktion"],
        correct: 1,
        fillTemplate: "Eine Thrombose ist ein ___ in einem Blutgefäß. Zur Prophylaxe gehören Mobilisation und ___.",
        fillAnswers: ["Blutgerinnsel","Kompressionsstrümpfe"],
      },
      {
        q: "Was ist Delir (akuter Verwirrtheitszustand) und wie unterscheidet es sich von Demenz?",
        a: "Delir ist akut, fluktuierend (Stunden bis Tage), oft reversibel (durch Infektion, Medikamente, Dehydration). Demenz ist chronisch, schleichend, progredient. Delir bei Demenzerkrankten häufiger.",
        options: ["Delir entsteht schleichend über Wochen und ist dauerhaft wie eine Demenz","Delir ist akut und oft reversibel; Demenz ist chronisch und schleichend","Demenz ist die Ursache jedes Delirs; ohne Demenz kann kein Delir entstehen","Delir und Demenz erfordern die gleichen Maßnahmen: Orientierung fördern und Reize reduzieren"],
        correct: 1,
        fillTemplate: "Delir ist ein ___ Verwirrtheitszustand, der oft ___ ist. Demenz ist dagegen chronisch und schleichend.",
        fillAnswers: ["akuter","reversibel"],
      },
      {
        q: "Was sind typische Symptome eines Herzinfarkts?",
        a: "Heftiger Brustschmerz (Vernichtungsschmerz), Ausstrahlung in linken Arm/Kiefer/Rücken, Atemnot, Übelkeit, Schweißausbruch, Todesangst. Bei Frauen/älteren Menschen oft untypisch (Oberbauchschmerzen, Übelkeit).",
        options: ["Plötzlicher reißender Brustschmerz mit Ausstrahlung in den Rücken und gleichem Pulsstatus beider Arme","Vernichtungsschmerz, Ausstrahlung, Atemnot, Schweißausbruch; bei Frauen oft untypisch","Belastungsabhängiges Engegefühl in der Brust, das sich in Ruhe innerhalb von 10 Minuten löst","Atemabhängiger Brustschmerz beim tiefen Einatmen, kombiniert mit Husten und Fieber"],
        correct: 1,
        fillTemplate: "Typische Symptome des Herzinfarkts sind ___ und Ausstrahlung in den linken Arm. Bei Frauen sind die Symptome oft ___.",
        fillAnswers: ["Vernichtungsschmerz","untypisch"],
      },
      {
        q: "Was ist Dysphagie und welche Pflegemaßnahmen sind erforderlich?",
        a: "Dysphagie = Schluckstörung (häufig nach Schlaganfall, bei Demenz, Parkinson). Risiko: Aspiration (Eindringen von Speisen/Flüssigkeiten in die Lunge). Maßnahmen: Konsistenzanpassung (angedickte Flüssigkeiten), aufrechte Sitzposition, Logopädie.",
        options: ["Schluckstörung nach Schlaganfall; Maßnahmen: dünne Flüssigkeiten geben und Oberkörper tief lagern","Schluckstörung mit Aspirationsrisiko; Konsistenzanpassung, aufrechte Haltung, Logopädie","Schluckstörung bei Demenz; Maßnahmen: weiche Kost, Bettruhe nach dem Essen und Mundhygiene","Pharyngitis mit Schluckschmerzen; Maßnahmen: kühle Flüssigkeiten, Lutschtabletten, Schmerzmittel"],
        correct: 1,
        fillTemplate: "Dysphagie ist eine ___ mit Aspirationsrisiko. Pflegerische Maßnahmen sind ___ von Flüssigkeiten und aufrechte Sitzhaltung.",
        fillAnswers: ["Schluckstörung","Konsistenzanpassung"],
      },
      {
        q: "Was ist Kontrakturprophylaxe und warum ist sie wichtig?",
        a: "Kontrakturprophylaxe verhindert die dauerhafte Verkürzung von Muskeln und Sehnen durch regelmäßige Bewegungsübungen (aktiv und passiv), Lagerungswechsel und physiotherapeutische Maßnahmen.",
        options: ["Verhindert Muskelatrophie (Sarkopenie) durch Krafttraining bei bettlägerigen Patienten","Verhindert Muskel-/Sehnenverkürzung durch regelmäßige Bewegungsübungen und Lagerung","Behandelt bestehende Kontrakturen durch passive Dehnung und Wärmetherapie","Kontrakturprophylaxe ist allein Aufgabe der Physiotherapie und nicht pflegerisch durchzuführen"],
        correct: 1,
        fillTemplate: "Kontrakturprophylaxe verhindert die dauerhafte Verkürzung von Muskeln und ___ durch regelmäßige ___ (aktiv und passiv).",
        fillAnswers: ["Sehnen","Bewegungsübungen"],
      },
      {
        q: "Was versteht man unter Wundversorgung nach dem Prinzip der feuchten Wundbehandlung?",
        a: "Feuchte Wundbehandlung hält das Wundbett feucht, fördert Granulation und Epithelisierung, reduziert Schmerzen und Infektionsrisiko. Moderne Wundauflagen (Hydrokolloid, Alginat) halten das feuchte Milieu aufrecht.",
        options: ["Wunden heilen zuverlässiger, wenn sie trocken gehalten und der Luft ausgesetzt werden, um Bakterien zu verhindern","Feuchte Wundbehandlung fördert Heilung durch feuchtes Milieu und moderne Auflagen","Tägliche antiseptische Spülung ist der Goldstandard zur Wundinfektionsprophylaxe in der Pflege","Mit Kochsalz getränkte Gazen alle 4 Stunden gewechselt bieten die beste Feuchtigkeitsbalance"],
        correct: 1,
        fillTemplate: "Feuchte Wundbehandlung hält das ___ feucht und fördert Granulation. Moderne Wundauflagen wie ___ halten dieses Milieu aufrecht.",
        fillAnswers: ["Wundbett","Hydrokolloid"],
      },
      {
        q: "Was ist eine Herzinsuffizienz und welche Symptome zeigt sie?",
        a: "Herzinsuffizienz = Herzschwäche: Das Herz kann nicht mehr ausreichend Blut pumpen. Symptome: Belastungsdyspnoe (Atemnot bei Anstrengung), Ruhedyspnoe, Ödeme (Knöchel, Beine), Erschöpfung, nächtliches Aufwachen durch Atemnot.",
        options: ["Koronare Herzerkrankung mit belastungsabhängiger Angina pectoris","Herzschwäche mit Atemnot, Ödemen und Erschöpfung; Herzleistung unzureichend","Dilatative Kardiomyopathie mit erhaltener systolischer Funktion","Aortenstenose mit schmalem Herzventil und niedrigem Auswurfvolumen"],
        correct: 1,
        fillTemplate: "Bei Herzinsuffizienz ist die ___ des Herzens unzureichend. Typisch sind ___ (Beine) und Belastungsdyspnoe.",
        fillAnswers: ["Pumpleistung","Ödeme"],
      },
      {
        q: "Was ist Morbus Parkinson und wie beeinflusst er die Pflege?",
        a: "Morbus Parkinson = Erkrankung des ZNS durch Dopaminmangel. Symptome: Rigor (Muskelsteife), Tremor (Zittern in Ruhe), Bradykinese (Verlangsamung), posturale Instabilität. Pflegeaspekte: Sturzprophylaxe, Schluckstörungen beachten, Zeit lassen.",
        options: ["Multiple Sklerose; Pflege: Hitzevermeidung, Energiemanagement, Blasenkatheter bei Bedarf","ZNS-Erkrankung mit Rigor, Tremor, Bradykinese; Pflege: Sturzprophylaxe, Zeit lassen","Amyotrophe Lateralsklerose; Pflege: Kommunikationshilfen, Beatmungsunterstützung, Ernährungssonde","Essenzieller Tremor; Pflege: Hilfsmittel beim Essen, keine Sturzprophylaxe nötig"],
        correct: 1,
        fillTemplate: "Morbus Parkinson führt durch ___ Mangel zu Rigor, Tremor und ___. In der Pflege ist besonders Sturzprophylaxe wichtig.",
        fillAnswers: ["Dopamin","Bradykinese"],
      },
      {
        q: "Was ist eine MRSA-Infektion und wie schützt man sich und andere?",
        a: "MRSA = Methicillin-resistenter Staphylococcus aureus. Antibiotika-resistenter Keim. Übertragung: Kontakt, Tröpfchen. Schutz: strikte Kontaktprophylaxe (Handschuhe, Kittel, Maske), Zimmersolierung, eigenes Pflegematerial, Händedesinfektion.",
        options: ["Methicillin-sensitiver Staphylokokkus (MSSA) der wie MRSA durch Kontakt übertragen wird","Antibiotikaresistenter Keim; Schutz durch Kontaktprophylaxe, Isolierung, Händedesinfektion","Keim, der nur Wunden besiedelt; keine Übertragung durch bloßen Körperkontakt möglich","Multiresistenter gramnegativer Keim (MRGN), der wie MRSA mit Vancomycin behandelt wird"],
        correct: 1,
        fillTemplate: "MRSA ist ein ___ resistenter Keim. Schutz: ___ Kontaktprophylaxe und strenge Händedesinfektion.",
        fillAnswers: ["Antibiotika","strikte"],
      },
    ],
  },

  // ── 5. ERNÄHRUNG & FLÜSSIGKEIT ───────────────────────────────────────────
  "Ernährung & Flüssigkeit": {
    color: "#7ce8c8", icon: "🍽️",
    questions: [
      {
        q: "Wie hoch ist der tägliche Flüssigkeitsbedarf eines Erwachsenen?",
        a: "Etwa 30–35 ml pro Kilogramm Körpergewicht, d.h. bei 70 kg ca. 2.100–2.450 ml/Tag. Bei Fieber, Hitze oder erhöhter Aktivität mehr.",
        options: ["25–28 ml/kg Körpergewicht, da der Bedarf im Alter durch vermindertes Durstgefühl sinkt","20–25 ml/kg Körpergewicht entsprechend der DGE-Empfehlung für Senioren","30–35 ml/kg Körpergewicht (ca. 2–2,5 l täglich)","40–45 ml/kg Körpergewicht, weil Ältere mehr Flüssigkeit zum Ausscheiden von Schadstoffen benötigen"],
        correct: 2,
        fillTemplate: "Der tägliche Flüssigkeitsbedarf beträgt ___ ml pro Kilogramm Körpergewicht. Bei 70 kg entspricht das ca. ___ ml.",
        fillAnswers: ["30–35","2100"],
      },
      {
        q: "Was ist Mangelernährung (Malnutrition) und wie erkennt man sie?",
        a: "Mangelernährung = unzureichende Aufnahme von Energie und Nährstoffen. Zeichen: Gewichtsverlust, Muskelschwund, trockene Haut, Müdigkeit, geschwächtes Immunsystem. Erfassung z.B. mit dem MNA (Mini Nutritional Assessment).",
        options: ["Ausschließlicher Vitaminmangel ohne Auswirkung auf Körpergewicht oder Muskelkraft","Unzureichende Nährstoffaufnahme; Zeichen: Gewichtsverlust, Muskelschwund, Müdigkeit","Vorübergehender Gewichtsverlust durch Krankheit, der sich meist erholt","Ernährungsdefizit, das nur durch Blutuntersuchungen erkennbar ist"],
        correct: 1,
        fillTemplate: "Mangelernährung bedeutet unzureichende Aufnahme von Energie und ___. Sie wird z.B. mit dem ___ erfasst.",
        fillAnswers: ["Nährstoffen","MNA"],
      },
      {
        q: "Was sind Zeichen von Dehydration (Austrocknung) bei älteren Menschen?",
        a: "Mundtrockenheit, eingefallene Augen, reduzierte Urinmenge (dunkel gefärbt), Verwirrtheit, Schwindel, Obstipation, Hautelastizität vermindert (Hautfaltentest positiv).",
        options: ["Erhöhte Urinmenge mit hellem Urin und feuchten Schleimhäuten","Mundtrockenheit, dunkler Urin, Verwirrtheit, Schwindel, Hautelastizitätsverlust","Gerötete Haut und leicht erhöhte Körpertemperatur durch Wärmerückhaltung","Geschwollene Knöchel und Gewichtszunahme durch Wassereinlagerungen"],
        correct: 1,
        fillTemplate: "Zeichen der Dehydration bei Älteren sind Mundtrockenheit, ___ Urin, Verwirrtheit und verminderter ___.",
        fillAnswers: ["dunkler","Hautelastizität"],
      },
      {
        q: "Welche besonderen Ernährungsrisiken haben ältere Menschen?",
        a: "Verminderter Appetit, Kau-/Schluckprobleme, Medikamentennebenwirkungen, verminderte Sinneswahrnehmung (Geschmack/Geruch), soziale Isolation, Depression, eingeschränkte Mobilität beim Einkaufen/Kochen.",
        options: ["Kaum veränderte Ernährungsbedürfnisse im Vergleich zu jüngeren Erwachsenen","Verminderter Appetit, Kau-/Schluckprobleme, Medikamentenwirkungen, Isolation","Höherer Energiebedarf und verstärkter Appetit im Alter","Ausschließlich körperliche Einschränkungen beim Einkaufen und Kochen"],
        correct: 1,
        fillTemplate: "Besondere Ernährungsrisiken im Alter sind verminderter Appetit, ___ und Medikamentennebenwirkungen. Auch ___ spielt eine Rolle.",
        fillAnswers: ["Schluckprobleme","soziale Isolation"],
      },
      {
        q: "Was versteht man unter einer Sondenkost/enteralen Ernährung?",
        a: "Enterale Ernährung = Nährstoffzufuhr über eine Sonde (nasogastral, PEG) bei Personen, die nicht ausreichend oral essen können. Pflegerisch: Lage der Sonde prüfen, Hygiene, Restmenge kontrollieren, Aspirationsrisiko beachten.",
        options: ["Hochkalorische Trinknahrung (oral nutritional supplement), die oral eingenommen wird","Nährstoffzufuhr über eine Sonde bei Menschen, die nicht oral essen können","Angereicherte Breikost, die mit Schluckhelfern für Menschen mit Dysphagie oral verabreicht wird","Parenterale Ernährung über einen zentralen Venenkatheter bei schwerem Ileus"],
        correct: 1,
        fillTemplate: "Enterale Ernährung erfolgt über eine ___ (z.B. PEG). Pflegerisch ist besonders das ___ zu beachten.",
        fillAnswers: ["Sonde","Aspirationsrisiko"],
      },
      {
        q: "Welche Nährstoffgruppen sind für eine ausgewogene Ernährung im Alter wichtig?",
        a: "Proteine (Muskelerhalt), Kalzium und Vitamin D (Knochenschutz), Ballaststoffe (Darmgesundheit), B-Vitamine (Nervensystem), Flüssigkeit. Bei Älteren oft zu wenig Protein und Vitamin D.",
        options: ["Kohlenhydrate und Fette genügen, da der Energiebedarf im Alter sinkt","Proteine, Kalzium, Vitamin D, Ballaststoffe, B-Vitamine und ausreichend Flüssigkeit","Nur Vitamin C und E als relevante Mikronährstoffe im Alter","Flüssigkost und Nahrungsergänzungsmittel ersetzen feste Mahlzeiten"],
        correct: 1,
        fillTemplate: "Im Alter sind besonders ___ für den Muskelerhalt und Kalzium plus ___ für den Knochenschutz wichtig.",
        fillAnswers: ["Proteine","Vitamin D"],
      },
      {
        q: "Wie sollte man bei Patienten mit Schluckstörungen (Dysphagie) bei der Nahrungsgabe vorgehen?",
        a: "Oberkörper auf mindestens 45–90° aufrechten, angedickte Flüssigkeiten verwenden, kleine Bissen/Schlucke, nicht ablenken, Zeit lassen, auf Stimmveränderung nach dem Schlucken achten, bei Problemen Logopädie einschalten.",
        options: ["Flüssige Nahrung ist bei Dysphagie immer unbedenklich, feste Kost meiden","Oberkörper aufrecht, angedickte Flüssigkeiten, kleine Bissen, Zeit lassen, Logopädie","Patienten in leicht zurückgelehnter Position (ca. 30°) ernähren","Ausschließlich Sondenernährung, bis eine logopädische Abklärung erfolgt ist"],
        correct: 1,
        fillTemplate: "Bei Dysphagie sollte der Oberkörper ___ sein und ___ Flüssigkeiten verwendet werden.",
        fillAnswers: ["aufrecht","angedickte"],
      },
      {
        q: "Was ist der Body-Mass-Index (BMI) und welche Werte gelten für Erwachsene?",
        a: "BMI = Körpergewicht (kg) / Körpergröße² (m²). Untergewicht: < 18,5. Normalgewicht: 18,5–24,9. Übergewicht: 25–29,9. Adipositas: ≥ 30. Bei älteren Menschen ab 65 J. leicht höhere Werte toleriert.",
        options: ["Verhältnis von Taillenumfang zu Körpergröße (waist-to-height ratio); Normalwert < 0,5","Gewicht/Größe²; Normalgewicht 18,5–24,9; Untergewicht <18,5; Adipositas ≥30","Verhältnis Körperfett zu Muskelmasse in Prozent; Normalwert für ältere Frauen 25–35 %","Laborwert aus Albumin und Transferrin zur Einschätzung des Ernährungszustands"],
        correct: 1,
        fillTemplate: "Der BMI wird berechnet: Gewicht in kg durch ___ in m². Normalgewicht liegt bei 18,5–___.",
        fillAnswers: ["Körpergröße²","24,9"],
      },
      {
        q: "Was sollte bei der Unterstützung bei der Nahrungsaufnahme beachtet werden?",
        a: "Würde und Selbstbestimmung des Bewohners wahren, angenehme Atmosphäre schaffen, Essen anpassen, Hunger-/Sättigungssignale beachten, ausreichend Zeit, Hilfestellung nur dort wo nötig (aktivierend), Lieblingsspeisen ermitteln.",
        options: ["Zügig anreichen, Portionen standardisieren, Umgebungsgeräusche reduzieren und Mahlzeiten dokumentieren","Würde wahren, Zeit lassen, Lieblingsspeisen, angenehme Atmosphäre, aktivierend unterstützen","Hilfe vollständig übernehmen, Mahlzeiten pürieren, Kaloriengehalt streng überwachen","Kalorien zählen, Flüssigkeit einschränken, feste Speisen bei Schluckstörungen immer vermeiden"],
        correct: 1,
        fillTemplate: "Bei der Nahrungsaufnahme muss die ___ des Bewohners gewahrt werden. Hilfe sollte ___ geleistet werden (nur wo nötig).",
        fillAnswers: ["Würde","aktivierend"],
      },
      {
        q: "Was ist ein Ernährungsprotokoll und wann wird es eingesetzt?",
        a: "Ein Ernährungsprotokoll dokumentiert alle Mahlzeiten und Flüssigkeitsmengen (Art, Menge, Zeitpunkt). Eingesetzt bei Mangelernährungsrisiko, zur Kontrolle der Nahrungsaufnahme und als Grundlage für Interventionen.",
        options: ["Ärztliches Dokument zur Anordnung von Diätmaßnahmen und Spezialnahrung","Dokumentation aller Mahlzeiten/Flüssigkeiten bei Mangelernährungsrisiko","Pflegerische Notiz über bekannte Lebensmittelallergien und Unverträglichkeiten","Standardisierter Wochenplan für ausgewogene Mahlzeiten in der Einrichtung"],
        correct: 1,
        fillTemplate: "Ein Ernährungsprotokoll dokumentiert Mahlzeiten und ___ bei Bewohnern mit ___risiko.",
        fillAnswers: ["Flüssigkeitsmengen","Mangelernährungs"],
      },
      {
        q: "Wie viele Mahlzeiten und welche Zeitabstände sind in der Altenpflege empfehlenswert?",
        a: "5–6 Mahlzeiten täglich (3 Hauptmahlzeiten + 2–3 Zwischenmahlzeiten), Abstände nicht länger als 4–6 Stunden, nachts nicht länger als 11 Stunden ohne Nahrung. Fördert Blutzuckerstabilität.",
        options: ["3 Hauptmahlzeiten täglich sind ausreichend, Zwischenmahlzeiten führen zu Übergewicht","5–6 Mahlzeiten täglich, Abstände max. 4–6 Stunden, nachts max. 11 Stunden ohne Nahrung","4 Mahlzeiten täglich mit gleichmäßigen Abständen von 5–6 Stunden sind ideal","3 Hauptmahlzeiten täglich; die Länge der nächtlichen Nahrungspause spielt keine Rolle"],
        correct: 1,
        fillTemplate: "Empfohlen werden ___ Mahlzeiten täglich mit Abständen von max. ___ Stunden.",
        fillAnswers: ["5–6","4–6"],
      },
      {
        q: "Welche Vitamine und Mineralstoffe sind bei älteren pflegebedürftigen Menschen häufig mangelhaft?",
        a: "Vitamin D (Lichtmangel), Vitamin B12 (verminderte Resorption), Folsäure, Kalzium, Magnesium, Eisen, Zink. Mangel durch verminderte Aufnahme, eingeschränkte Sonnenexposition und Medikamentenwechselwirkungen.",
        options: ["Mangelzustände sind bei ausgewogener Ernährung im Alter kaum möglich","Vitamin D, B12, Kalzium, Magnesium; durch Lichtmangel, vermin. Resorption, Medikamente","Nur Vitamin C und Eisen durch einseitige Ernährungsgewohnheiten","Vitaminmangel tritt ausschließlich bei bettlägerigen Pflegebedürftigen auf"],
        correct: 1,
        fillTemplate: "Bei älteren Menschen ist häufig ___ durch Lichtmangel und ___ durch verminderte Resorption mangelhaft.",
        fillAnswers: ["Vitamin D","Vitamin B12"],
      },
      {
        q: "Was ist Aspirationspneumonie und wie wird sie verhindert?",
        a: "Aspirationspneumonie entsteht, wenn Speise- oder Flüssigkeitsreste in die Lunge gelangen (Aspiration). Prävention: aufrechte Sitzposition beim Essen, Konsistenzanpassung, Schlucktraining, nach dem Essen 30 Minuten aufrecht sitzen.",
        options: ["Lungenentzündung durch Bakterien der Mundflora bei mangelnder Mundhygiene","Aspiration von Speiseresten in die Lunge; verhindert durch aufrechte Haltung, Konsistenzanpassung","Entzündung der Speiseröhre durch aufsteigenden Magensäurereflux","Pneumonie durch unzureichende Flüssigkeitszufuhr und Sekretanstauung"],
        correct: 1,
        fillTemplate: "Aspirationspneumonie entsteht durch ___ von Speiseresten in die Lunge. Wichtig: ___ Sitzposition beim Essen und Konsistenzanpassung.",
        fillAnswers: ["Aspiration","aufrechte"],
      },
      {
        q: "Wie erkennt man Exsikkose (Austrocknung) und was ist zu tun?",
        a: "Exsikkose: trockene Schleimhäute, verminderter Hautturgor (Hautfalte bleibt stehen), Verwirrtheit, Schwäche, konzentrierter Urin. Maßnahmen: Flüssigkeitsaufnahme dokumentieren, trinken animieren, ggf. ärztliche Anordnung für Infusion.",
        options: ["Übermäßiges Schwitzen und gerötete Haut; kühlen und Elektrolytlösungen verabreichen","Trockene Schleimhäute, verminderter Hautturgor, Verwirrtheit; Flüssigkeit geben, Arzt informieren","Geschwollene Knöchel und erhöhter Blutdruck; Beine hochlagern und Diuretikum nach Anordnung geben","Fieberhaftes Erscheinungsbild mit erhöhter Urinproduktion; Temperatur senken und Flüssigkeit einschränken"],
        correct: 1,
        fillTemplate: "Exsikkose zeigt sich durch trockene ___ und verminderten ___. Sofortmaßnahme: Flüssigkeitsaufnahme fördern.",
        fillAnswers: ["Schleimhäute","Hautturgor"],
      },
      {
        q: "Was ist bei der Arzneimittelgabe und Ernährung zu beachten?",
        a: "Viele Medikamente sollten mit ausreichend Wasser (mindestens 100–200 ml) eingenommen werden, einige nicht mit Milch oder Grapefruitsaft. Manche Medikamente beeinflussen Appetit, Geschmack oder Nährstoffresorption.",
        options: ["Alle Medikamente sollten mit einem Glas Milch eingenommen werden","Mit ausreichend Wasser; Wechselwirkungen mit Milch/Grapefruitsaft; Einfluss auf Appetit/Resorption","Medikamente grundsätzlich zu den Mahlzeiten, um Magenprobleme zu vermeiden","Mahlzeiten verzögern immer die Aufnahme und sollten bei Medikamentengabe vermieden werden"],
        correct: 1,
        fillTemplate: "Medikamente sollten mit mindestens ___ ml Wasser eingenommen werden. Wechselwirkungen mit ___ oder Grapefruitsaft sind zu beachten.",
        fillAnswers: ["100–200","Milch"],
      },
      {
        q: "Was versteht man unter einer Schluckstörung (Dysphagie) und welche Maßnahmen helfen?",
        a: "Dysphagie = erschwerte oder schmerzhafte Schluckfähigkeit, häufig bei Schlaganfall, Parkinson, Demenz. Maßnahmen: Oberkörper erhöht, Speisen andicken, kleine Bissen, langsames Essen, Logopädie, Aspirationsrisiko beachten.",
        options: ["Schluckbeschwerden nur bei fester Nahrung; Flüssigkeiten sind stets unbedenklich","Schluckschwierigkeiten; Hilfe: Oberkörper erhöhen, Eindicken, Logopädie, langsam essen","Schmerzhaftes Schlucken durch Ösophagusspasmen, das nur durch Endoskopie diagnostiziert wird","Vorübergehende Schluckbeschwerden bei Heiserkeit ohne Aspirationsrisiko"],
        correct: 1,
        fillTemplate: "Bei Dysphagie sollte der Oberkörper ___ sein. Oft werden Speisen ___ und in kleinen Portionen gereicht.",
        fillAnswers: ["erhöht","eingedickt"],
      },
      {
        q: "Welche fünf Hauptnährstoffgruppen gibt es und welche Aufgaben haben sie?",
        a: "Kohlenhydrate (Energie), Eiweiß/Protein (Aufbau/Reparatur), Fette (Energie, Hormonsynthese), Vitamine (Regulationsfunktionen), Mineralstoffe/Spurenelemente (Knochen, Nervenfunktion). Dazu Wasser als lebensnotwendige Grundlage.",
        options: ["Nur Makronährstoffe zählen; Vitamine werden vom Körper selbst hergestellt","Kohlenhydrate, Eiweiß, Fette, Vitamine, Mineralstoffe – jeweils mit spezifischer Funktion","Vier Gruppen: Kohlenhydrate, Eiweiß, Fette und Flüssigkeit","Sechs Gruppen einschließlich Alkohol und Koffein als Energielieferanten"],
        correct: 1,
        fillTemplate: "___ liefern Energie. ___ sind wichtig für den Aufbau und die Reparatur von Gewebe.",
        fillAnswers: ["Kohlenhydrate","Eiweiß"],
      },
    ],
  },

  // ── 6. NOTFALLMANAGEMENT ─────────────────────────────────────────────────
  "Notfallmanagement": {
    color: "#e87c7c", icon: "🚨",
    questions: [
      {
        q: "Wie lange maximal prüft man die Atmung bei einem Kreislaufstillstand bevor die Reanimation beginnt?",
        a: "Maximal 10 Sekunden. Ist die Person bewusstlos und atmet nicht normal → sofort Notruf 112 und Herzdruckmassage beginnen.",
        options: ["30 Sekunden, um auch vereinzelte Schnappatmung sicher zu erkennen","20 Sekunden nach dem Look-Listen-Feel-Prinzip","10 Sekunden","5 Sekunden, damit keine wertvolle Reanimationszeit verloren geht"],
        correct: 2,
        fillTemplate: "Die Atmung wird maximal ___ Sekunden geprüft. Bei Bewusstlosigkeit und fehlender Atmung → sofort ___ wählen.",
        fillAnswers: ["10","112"],
      },
      {
        q: "Wie lautet die korrekte Technik der Herzdruckmassage (CPR)?",
        a: "Druckpunkt: Mitte des Brustkorbs. Drucktiefe: 5–6 cm. Frequenz: 100–120/min. Verhältnis: 30 Kompressionen : 2 Beatmungen (30:2). Arme gestreckt, Druckkraft auf die Arme übertragen.",
        options: ["Druckpunkt Mitte Brustkorb, 3–4 cm tief, 80–100/min, 15:2 wie beim Kindernotfall","Druckpunkt Mitte Brustkorb, 5–6 cm tief, 100–120/min, 30:2","Druckpunkt unteres Sternum (Xiphoid), 5–6 cm tief, 100–120/min, 30:2","Druckpunkt Mitte Brustkorb, 5–6 cm tief, 60–80/min für ältere Patienten"],
        correct: 1,
        fillTemplate: "Bei der Herzdruckmassage: Druckpunkt Mitte Brustkorb, Tiefe ___ cm, Frequenz ___/min, Verhältnis 30:2.",
        fillAnswers: ["5–6","100–120"],
      },
      {
        q: "Was bedeutet das ABCDE-Schema in der Notfallbeurteilung?",
        a: "A = Airway (Atemweg), B = Breathing (Atmung), C = Circulation (Kreislauf), D = Disability (Bewusstsein/Neurologie), E = Exposure (Entkleiden/Umgebung). Systematische Ersteinschätzung.",
        options: ["Assessment, Blutdruck, Cardiac output, Diagnose, Notfallplan","Airway, Breathing, Circulation, Disability, Exposure","Alert, Breathing, Cardiovascular, Distress, Extremitäten","Appearance, Breathing, Colour, Decisiveness, Evaluation"],
        correct: 1,
        fillTemplate: "ABCDE steht für Airway, ___, Circulation, ___ und Exposure.",
        fillAnswers: ["Breathing","Disability"],
      },
      {
        q: "Welche Sofortmaßnahmen gelten beim FAST-Verdacht auf Schlaganfall?",
        a: "Notruf 112 sofort. Patient beruhigen und hinlegen (Oberkörper leicht erhöht). Nichts zu essen/trinken geben (Aspirationsgefahr). Zeit notieren (für Lyse-Therapie wichtig). Patient nicht allein lassen.",
        options: ["Bewohner aufrecht hinsetzen und Blutdruck messen, dann Arzt anrufen","Sofort 112, hinlegen, nichts zu essen/trinken, Zeit notieren, nicht allein lassen","Einen niedrig dosierten Blutdrucksenker geben, um Hirnblutung zu verhindern","Bewohner beruhigen und 30 Minuten beobachten, ob Symptome abklingen"],
        correct: 1,
        fillTemplate: "Bei Schlaganfallverdacht sofort ___ anrufen. Dem Patienten nichts zu ___ geben (Aspirationsgefahr).",
        fillAnswers: ["112","essen/trinken"],
      },
      {
        q: "Wie erkennt man einen anaphylaktischen Schock und was ist zu tun?",
        a: "Anaphylaxie: plötzliche allergische Reaktion. Symptome: Hautausschlag/Quaddeln, Atemnot, Schwellung (Gesicht/Mund), Blutdruckabfall, Bewusstlosigkeit. Sofort: Notruf 112, stabile Seitenlage oder Schocklagerung, Allergenexposition stoppen.",
        options: ["Lokale Urtikaria durch Nahrungsmittelallergie ohne systemische Symptome; Antihistaminikum oral geben","Lebensbedrohliche Reaktion: Ausschlag, Atemnot, Blutdruckabfall; Notruf 112, Seitenlage","Allergische Reaktion mit Hautrötung und Juckreiz; kühlen und Adrenalin-Pen bereithalten","Vagale Synkope durch Schmerz oder Erschrecken mit kurzem Bewusstseinsverlust"],
        correct: 1,
        fillTemplate: "Anaphylaxie zeigt sich durch Hautausschlag, ___ und Blutdruckabfall. Sofort ___ rufen.",
        fillAnswers: ["Atemnot","112"],
      },
      {
        q: "Was tun bei einem Sturz mit Verdacht auf Fraktur?",
        a: "Patient nicht bewegen (Fraktur kann sich verschlimmern). Notruf 112. Patient beruhigen, warmhalten. Betroffenes Körperteil ruhigstellen (nicht richten). Vitalzeichen beobachten. Sturzereignis dokumentieren.",
        options: ["Patienten vorsichtig in stabile Seitenlage bringen, um Aspiration zu verhindern","Patient nicht bewegen, 112 rufen, ruhigstellen, beruhigen, Vitalzeichen beobachten","Fraktur kühlen, hochlagern und mit Druckverband versorgen","Patienten zum Aufstehen animieren, um eine Versteifung zu verhindern"],
        correct: 1,
        fillTemplate: "Bei Sturz mit Frakturverdacht: Patient ___, 112 rufen und das Körperteil ___.",
        fillAnswers: ["nicht bewegen","ruhigstellen"],
      },
      {
        q: "Was sind die Maßnahmen bei Bewusstlosigkeit mit normaler Atmung?",
        a: "Stabile Seitenlage. Notruf 112. Atemwege freimachen und sichern. Regelmäßige Atemkontrolle. Wärme erhalten. Patient nicht allein lassen. Nie etwas in den Mund geben.",
        options: ["Bewohner wachrütteln und laut ansprechen, bis er reagiert","Stabile Seitenlage, 112 rufen, Atemwege sichern, Atmung kontrollieren","In Rückenlage belassen und Beine leicht erhöhen (Schocklagerung)","Sofort mit Herzdruckmassage beginnen, auch wenn Atmung noch vorhanden"],
        correct: 1,
        fillTemplate: "Bei Bewusstlosigkeit mit normaler Atmung: ___ anlegen, ___ rufen und Atemwege sichern.",
        fillAnswers: ["Stabile Seitenlage","112"],
      },
      {
        q: "Woran erkennt man eine Hypoglykämie und wie reagiert man als Pflegeperson?",
        a: "Symptome: Zittern, Schwitzen, Blässe, Herzrasen, Verwirrtheit, Hunger. BZ < 70 mg/dl. Sofort: schnell wirkende Kohlenhydrate (Traubenzucker, gesüßter Saft) geben, wenn Patient schlucken kann. Bei Bewusstlosigkeit: Notruf.",
        options: ["Langwirkende Kohlenhydrate (Brot, Kekse) geben, da der Blutzucker sonst zu schnell wieder sinkt","Traubenzucker geben wenn schluckfähig; bei Bewusstlosigkeit 112 rufen","Nächste Insulindosis auslassen und eine Hauptmahlzeit vorziehen","Zucker messen; erst wenn Wert unter 50 mg/dl liegt, Notfallmedikament verabreichen"],
        correct: 1,
        fillTemplate: "Bei Hypoglykämie (Zittern, Schwitzen) sofort ___ geben, wenn der Patient schlucken kann. Bei Bewusstlosigkeit ___ rufen.",
        fillAnswers: ["Traubenzucker","112"],
      },
      {
        q: "Was sind die Maßnahmen bei einem Herzinfarkt bis der Rettungsdienst kommt?",
        a: "Notruf 112 sofort. Patient hinsetzen oder hinlegen (keine Anstrengung). Enge Kleidung lockern. Patient beruhigen. Vitalzeichen beobachten. Notfallkoffer/Defibrillator holen lassen. Bei Kreislaufstillstand: CPR.",
        options: ["Nitro-Spray aus dem Medikamentenschrank geben und Hausarzt benachrichtigen","Sofort 112, hinsetzen, Kleidung lockern, beruhigen, Defi holen, bei Stillstand CPR","Patienten in stabile Seitenlage bringen und Atemwege freihalten","300 mg Aspirin geben und Patienten mit erhöhtem Oberkörper lagern"],
        correct: 1,
        fillTemplate: "Beim Herzinfarkt sofort ___ rufen, Patienten ___ und Kleidung lockern.",
        fillAnswers: ["112","hinsetzen"],
      },
      {
        q: "Was ist ein Defibrillator (AED) und wie wird er eingesetzt?",
        a: "AED = Automatischer Externer Defibrillator. Gerät erkennt Herzrhythmusstörungen und gibt elektrischen Schock. Einsatz: Gerät einschalten, Elektroden anlegen (wie abgebildet), Sprachanweisungen folgen, vor Schock alle wegtreten lassen.",
        options: ["Ein Pulsoximeter zur Messung der Sauerstoffsättigung bei Herzstillstand","Gerät zur Behandlung von Herzrhythmusstörungen; Elektroden anlegen, Anweisungen folgen","Nur bei Asystolie (Null-Linie) einsetzen, nicht bei Kammerflimmern","Gerät, das ausschließlich in Anwesenheit von medizinischem Fachpersonal angewendet werden darf"],
        correct: 1,
        fillTemplate: "Ein AED erkennt ___ und gibt elektrische Schocks. Vor dem Schock müssen alle ___ zurücktreten.",
        fillAnswers: ["Herzrhythmusstörungen","Personen"],
      },
      {
        q: "Was sind Symptome eines Lungenembolismus und wie handelt man?",
        a: "Lungenembolie: plötzliche Atemnot, Brustschmerzen, Bluthusten, Herzrasen, Bewusstseinstrübung. Ursache: meist Blutgerinnsel (Thrombose). Sofort: Notruf 112, Ruhe, keine Belastung, aufrechte Position.",
        options: ["Zunehmendem Husten und Auswurf bei chronischer Bronchitis; Inhalation und Physiotherapie","Plötzliche Atemnot, Brustschmerzen, Bluthusten; Notruf 112, Ruhe, aufrechte Position","Langsam zunehmende Atemnot durch Pleuraerguss; Drainageanlage und Lagerung auf betroffener Seite","Beidseitige Knöchelödeme und Belastungsdyspnoe; Flüssigkeitsbilanz und Diuretika nach Anordnung"],
        correct: 1,
        fillTemplate: "Lungenembolie zeigt sich durch plötzliche ___ und Brustschmerzen. Sofort ___ rufen.",
        fillAnswers: ["Atemnot","112"],
      },
      {
        q: "Was bedeutet die stabile Seitenlage und wann wird sie angewendet?",
        a: "Stabile Seitenlage sichert die Atemwege bei bewusstlosen, aber atmenden Personen. Verhindert Aspiration von Erbrochenem. Anwendung: Atemweg freimachen, Patient auf die Seite drehen, oben liegender Arm und Bein als Stütze.",
        options: ["Lagerung bei bewusstlosen Patienten mit Verdacht auf Wirbelsäulenverletzung","Sicherung der Atemwege bei Bewusstlosigkeit mit Atmung; verhindert Aspiration","Standardlagerung für alle Notfallsituationen, auch bei Herzstillstand","Schocklagerung für kreislaufinstabile Patienten mit Beinerhöhung"],
        correct: 1,
        fillTemplate: "Die stabile Seitenlage sichert die ___ bei bewusstlosen, aber atmenden Personen und verhindert ___.",
        fillAnswers: ["Atemwege","Aspiration"],
      },
      {
        q: "Was ist bei einem Krampfanfall (Epilepsie) zu beachten?",
        a: "Verletzungen verhindern (Umgebung freimachen), nichts in den Mund stecken, Patienten nicht festhalten, nach dem Anfall stabile Seitenlage, Zeit messen, Notruf wenn Anfall >5 Min oder Patient sich nicht erholt. Ruhig bleiben.",
        options: ["Kopf seitlich drehen und Zunge manuell nach vorne ziehen","Umgebung freimachen, nichts in den Mund, Zeit messen, danach Seitenlage, bei >5 Min 112","Weichen Gegenstand zwischen die Zähne legen, um Zungenbiss zu verhindern","Patienten festhalten, damit keine unkontrollierten Bewegungen entstehen"],
        correct: 1,
        fillTemplate: "Beim Krampfanfall: Umgebung freimachen, nichts in den ___ stecken, ___ messen. Nach dem Anfall: Seitenlage.",
        fillAnswers: ["Mund","Zeit"],
      },
      {
        q: "Was versteht man unter Schocklagerung und wann wird sie eingesetzt?",
        a: "Schocklagerung = Rückenlage mit erhöhten Beinen (ca. 30–45°) zur Verbesserung der Durchblutung lebenswichtiger Organe. Eingesetzt bei: Blutdruckabfall, Kreislaufschock (außer kardiogenem Schock und Lungenödem).",
        options: ["Oberkörperhochlagerung bei 30° zur Verbesserung der Herzfüllung bei Kreislaufschwäche","Rückenlage mit erhöhten Beinen bei Kreislaufschock (nicht bei Herzschock/Lungenödem)","Stabile Seitenlage mit erhöhten Beinen, um Aspiration und Kreislaufversagen zu verhindern","Flache Rückenlage ohne Beinerhöhung, da Beinerhöhung die Atemarbeit erschwert"],
        correct: 1,
        fillTemplate: "Schocklagerung bedeutet erhöhte ___ bei Rückenlage. Sie verbessert die Durchblutung und wird bei ___ eingesetzt.",
        fillAnswers: ["Beine","Kreislaufschock"],
      },
      {
        q: "Warum ist die korrekte Benachrichtigung beim Notruf wichtig?",
        a: "5 W-Regel: Wo ist der Notfall? Was ist passiert? Wie viele Verletzte/Betroffene? Welche Verletzungen/Symptome? Warten auf Rückfragen. Niemals vor dem Disponenten auflegen.",
        options: ["Nur Name und Adresse nennen, dann auf Rückfragen warten","5-W-Regel: Wo, Was, Wie viele, Welche Verletzungen, Warten; nicht vor Disponenten auflegen","Sofort alle Informationen nennen und dann selbst auflegen","Nur die Anzahl der Verletzten nennen und den Disposenten entscheiden lassen"],
        correct: 1,
        fillTemplate: "Beim Notruf gilt die 5-W-Regel: ___, Was, Wie viele, Welche Verletzungen, ___.",
        fillAnswers: ["Wo","Warten"],
      },
      {
        q: "Wie erkennt man einen Schlaganfall mit der FAST-Methode?",
        a: "F = Face (Gesichtslähmung, schiefes Lächeln), A = Arms (ein Arm sinkt ab beim Hochheben), S = Speech (verwaschene Sprache), T = Time (sofort 112 rufen). Jede Minute zählt für die Behandlung.",
        options: ["FAST: Fieber, Auge (Sehstörung), Sprache, Taumel","FAST: Face (Lähmung), Arms (sinkt ab), Speech (verwaschen), Time (sofort 112)","FAST: Fall, Atemnot, Schwäche, Taubheit","FAST: Fotophobie, Aphasie, Schwindel, Tinnitus"],
        correct: 1,
        fillTemplate: "FAST steht für Face (___, Arms, ___ (Sprache) und Time (sofort 112 rufen).",
        fillAnswers: ["Gesichtslähmung)","Speech"],
      },
      {
        q: "Was sind die Maßnahmen bei einem diabetischen Notfall mit Bewusstlosigkeit?",
        a: "Bei Bewusstlosigkeit NIEMALS etwas in den Mund geben (Erstickungsgefahr). Sofort 112 rufen. Stabile Seitenlage. Vitalzeichen beobachten. Notarzt injiziert Glukose oder Glukagon i.v./s.c.",
        options: ["Gel-Traubenzucker auf die Wangenschleimhaut auftragen","Sofort 112, stabile Seitenlage, nichts in den Mund, Vitalzeichen überwachen","Schnell aufsitzen lassen und Saft in kleinen Schlucken geben","Insulinpen bereitstellen, bis der Arzt die Dosierung festgelegt hat"],
        correct: 1,
        fillTemplate: "Bei Bewusstlosigkeit durch Diabetes: ___ rufen, ___ anlegen und NICHTS in den Mund geben.",
        fillAnswers: ["112","Seitenlage"],
      },
    ],
  },

  // ── 7. RECHTLICHES, ETHIK & KOMMUNIKATION ────────────────────────────────
  "Rechtliches & Ethik": {
    color: "#7ce8a8", icon: "⚖️",
    questions: [
      {
        q: "Welche fünf Pflegegrade gibt es und was unterscheidet sie?",
        a: "Pflegegrad 1 (geringe Beeinträchtigung) bis Pflegegrad 5 (schwerste Beeinträchtigung mit besonderem Pflegebedarf). Basis: Neues Begutachtungsassessment (NBA) misst Selbstständigkeit in sechs Lebensbereichen.",
        options: ["3 Pflegestufen nach dem alten Begutachtungsverfahren, die bis 2017 galten","5 Pflegegrade (1 = gering, 5 = schwerste Beeinträchtigung); Grundlage ist das NBA","4 Pflegegrade, da Pflegegrad 5 nur für Menschen im Wachkoma vorgesehen ist","6 Pflegestufen einschließlich einer Einstufung 0 für Menschen mit Alltagseinschränkungen"],
        correct: 1,
        fillTemplate: "Es gibt ___ Pflegegrade von 1 (gering) bis 5 (schwerste Beeinträchtigung). Bewertet wird durch das ___.",
        fillAnswers: ["5","NBA"],
      },
      {
        q: "Was ist die Schweigepflicht in der Pflege und wann darf sie gebrochen werden?",
        a: "Pflegekräfte dürfen keine Patientendaten an Unbefugte weitergeben (§ 203 StGB). Ausnahmen: Einwilligung des Patienten, gesetzliche Auskunftspflichten (z.B. Meldepflicht bei Infektionskrankheiten), unmittelbare Gefahr für Dritte.",
        options: ["Die Schweigepflicht gilt nur gegenüber Externen; alle Teammitglieder dürfen alle Daten frei einsehen","Keine Weitergabe ohne Einwilligung; Ausnahme: gesetzliche Pflichten, akute Gefahr für Dritte","Die Schweigepflicht kann von Angehörigen als gesetzliche Vertreter aufgehoben werden","Die Schweigepflicht schützt nur medizinische Diagnosen, nicht allgemeine Pflegebeobachtungen"],
        correct: 1,
        fillTemplate: "Die Schweigepflicht (§ 203 ___) verbietet die Weitergabe von Patientendaten. Ausnahmen sind gesetzliche Pflichten oder ___ für Dritte.",
        fillAnswers: ["StGB","akute Gefahr"],
      },
      {
        q: "Was regelt das Pflegeberufegesetz (PflBG) von 2020?",
        a: "Das PflBG vereinheitlichte die Ausbildungen Alten-, Kranken- und Kinderkrankenpflege zur 'Pflegefachmann/-frau'. 3-jährige generalistische Ausbildung mit optionaler Spezialisierung im dritten Jahr.",
        options: ["Regelung verbindlicher Personalschlüssel in stationären Pflegeeinrichtungen aller Bundesländer","Vereinheitlichung der Pflegeausbildungen zur 3-jährigen generalistischen Ausbildung","Einführung eines bundesweit einheitlichen Tarifsystems für Pflegefachkräfte in öffentlichen Einrichtungen","Festlegung von Pflichtweiterbildungen für Pflegefachkräfte alle fünf Jahre"],
        correct: 1,
        fillTemplate: "Das PflBG vereinheitlichte die Pflegeausbildungen zur ___ Ausbildung. Es ermöglicht im dritten Jahr eine optionale ___.",
        fillAnswers: ["generalistischen","Spezialisierung"],
      },
      {
        q: "Was bedeutet 'freiheitsentziehende Maßnahmen' (FEM) und wann sind sie zulässig?",
        a: "FEM = Maßnahmen, die die Bewegungsfreiheit einschränken (Bettgitter, Fixierungen, abschließbare Türen). Zulässig nur mit richterlicher Genehmigung (Betreuungsgericht) oder als kurzfristige Notfallmaßnahme. Dokumentationspflicht.",
        options: ["Jederzeit zulässig, solange die Pflegefachkraft die klinische Begründung im Pflegeplan dokumentiert","Nur mit richterlicher Genehmigung oder im Notfall; Dokumentation notwendig","Mit schriftlicher Einwilligung eines Angehörigen oder Bevollmächtigten des Bewohners","Im Heimvertrag können FEM ohne weitere rechtliche Genehmigung vereinbart werden"],
        correct: 1,
        fillTemplate: "Freiheitsentziehende Maßnahmen sind nur mit ___ Genehmigung oder als ___ erlaubt.",
        fillAnswers: ["richterlicher","Notfallmaßnahme"],
      },
      {
        q: "Was ist eine Patientenverfügung und was regelt sie?",
        a: "Schriftliche Vorausverfügung einer Person für den Fall, dass sie nicht mehr entscheidungsfähig ist. Regelt, welche medizinischen Maßnahmen gewünscht oder abgelehnt werden (z.B. keine Reanimation, keine künstliche Ernährung).",
        options: ["Ein rechtliches Dokument, das einem Angehörigen finanzielle und medizinische Entscheidungsbefugnis überträgt","Vorausverfügung für medizinische Wünsche bei Entscheidungsunfähigkeit","Eine ärztliche Anordnung, die Behandlungen bei Einwilligungsunfähigkeit regelt","Eine notarielle Erklärung, die eine Vertrauensperson mit allen Entscheidungen bevollmächtigt"],
        correct: 1,
        fillTemplate: "Eine Patientenverfügung ist eine ___ Vorausverfügung für den Fall der ___. Sie regelt Wünsche zu medizinischen Maßnahmen.",
        fillAnswers: ["schriftliche","Entscheidungsunfähigkeit"],
      },
      {
        q: "Was ist das Autonomieprinzip in der Pflege?",
        a: "Autonomie = Recht auf Selbstbestimmung. Patienten haben das Recht, Entscheidungen über ihre Pflege und Behandlung selbst zu treffen, auch wenn die Pflegefachkraft anderer Meinung ist. Pflege hat informierend und beratend zu unterstützen.",
        options: ["Das Recht der Pflegefachkraft, Pflegeziele auf Basis klinischer Evidenz eigenständig festzulegen","Das Recht des Patienten auf Selbstbestimmung, auch gegen den Rat der Pflegekraft","Die Verantwortung von Angehörigen, Pflegeentscheidungen für ältere Bewohner zu treffen","Das Prinzip, dass Ärzte bei allen Pflege- und Behandlungsentscheidungen das letzte Wort haben"],
        correct: 1,
        fillTemplate: "Autonomie bedeutet das Recht auf ___. Patienten dürfen Entscheidungen selbst treffen, die Pflege hat ___ zu unterstützen.",
        fillAnswers: ["Selbstbestimmung","beratend"],
      },
      {
        q: "Was versteht man unter dem Stufenmodell der palliativen Pflege?",
        a: "Palliative Pflege zielt auf Lebensqualität, nicht auf Heilung. Stufen: allgemeine Palliativversorgung (überall), spezialisierte ambulante Palliativversorgung (SAPV), stationäre Palliativ-/Hospizversorgung. Symptomkontrolle, Würde, psychosoziale Begleitung.",
        options: ["Heilungsorientierte Behandlung zur Verlangsamung der Krankheitsprogression und Verlängerung der Lebenserwartung","Lebensqualitätsorientierte Versorgung: allgemein, SAPV, stationär; Symptomkontrolle und Würde","Spezialisierte medizinische Versorgung ausschließlich auf Schmerztherapie mit Opioidmedikamenten","Rückzug aller aktiven Maßnahmen und Einleitung einer reinen Komfortsedierung in den letzten Lebenstagen"],
        correct: 1,
        fillTemplate: "Palliative Pflege zielt auf ___, nicht auf Heilung. Die spezialisierte ambulante Variante heißt ___.",
        fillAnswers: ["Lebensqualität","SAPV"],
      },
      {
        q: "Welche Dokumentationspflichten hat eine Pflegekraft?",
        a: "Dokumentation aller erbrachten Pflegemaßnahmen, Beobachtungen, Veränderungen des Zustands, besondere Ereignisse, Vitalzeichen, Medikamente. Zeitnah und wahrheitsgemäß. Kein Löschen, Fehler durchstreichen.",
        options: ["Nur bedeutsame Ereignisse wie Stürze, akute Erkrankungen und Familienkontakte müssen dokumentiert werden","Alle Maßnahmen, Beobachtungen, Ereignisse zeitnah und wahrheitsgemäß; keine Löschungen","Routinemaßnahmen werden in der Wochenzusammenfassung dokumentiert; Einzelereignisse im Ereignisprotokoll","Vitalzeichen und Medikamentengabe müssen dokumentiert werden; subjektive Beobachtungen sind optional"],
        correct: 1,
        fillTemplate: "Pflegekräfte müssen alle Maßnahmen und ___ zeitnah dokumentieren. Fehler werden ___, nicht gelöscht.",
        fillAnswers: ["Beobachtungen","durchgestrichen"],
      },
      {
        q: "Was ist der Unterschied zwischen Delegation und eigenverantwortlicher Tätigkeit in der Pflege?",
        a: "Eigenverantwortlich: Pflegekraft plant und führt selbst durch (z.B. Grundpflege). Delegation: Eine Pflegefachkraft überträgt eine Aufgabe an eine Hilfskraft. Der Delegierende trägt die Anordnungsverantwortung, der Ausführende die Durchführungsverantwortung.",
        options: ["Beide Begriffe beschreiben dieselbe Verantwortungsart, die zwischen Fachkraft und Helfer gleichmäßig geteilt wird","Eigenverantwortlich: selbst geplant und durchgeführt; Delegation: Aufgabe übertragen; Verantwortung geteilt","Eigenverantwortliches Handeln bedeutet jede Aufgabe, die ein Pflegehelfer ohne Nachfrage erledigt","Bei Delegation ist eine schriftliche Einwilligung des Bewohners erforderlich, bevor die Aufgabe übertragen wird"],
        correct: 1,
        fillTemplate: "Bei einer Delegation trägt der Delegierende die ___, der Ausführende die ___.",
        fillAnswers: ["Anordnungsverantwortung","Durchführungsverantwortung"],
      },
      {
        q: "Was versteht man unter DNQP-Expertenstandards in der Pflege?",
        a: "Das Deutsche Netzwerk für Qualitätsentwicklung in der Pflege (DNQP) entwickelt evidenzbasierte Expertenstandards zu wichtigen Pflegethemen (z.B. Dekubitusprophylaxe, Sturzprophylaxe, Schmerzmanagement). Sie beschreiben Mindestanforderungen an gute Pflege.",
        options: ["Eine staatliche Behörde, die bei MDK-Prüfungen rechtlich bindende Qualitätsvorgaben erlässt","Evidenzbasierte Mindeststandards für Pflegethemen (z.B. Dekubitus, Sturz, Schmerz)","Eine MDK-Untereinheit, die Pflegedokumentation begutachtet und genehmigt","Ein verpflichtetes Zertifizierungssystem für alle nach SGB XI zugelassenen Pflegeeinrichtungen"],
        correct: 1,
        fillTemplate: "DNQP-Expertenstandards sind ___ Mindestanforderungen an gute Pflege, z.B. für Dekubitus- und ___.",
        fillAnswers: ["evidenzbasierte","Sturzprophylaxe"],
      },
      {
        q: "Was bedeutet professionelle Kommunikation in der Pflege?",
        a: "Aktives Zuhören, Empathie zeigen, klare verständliche Sprache, nonverbale Kommunikation beachten, keine Bewertungen, Ich-Botschaften, kulturelle Besonderheiten berücksichtigen, Schweigepflicht einhalten.",
        options: ["Fachliche Terminologie verwenden, damit Bewohner die Ernsthaftigkeit der Situation einschätzen können","Aktives Zuhören, Empathie, klare Sprache, nonverbale Kommunikation, Ich-Botschaften","Probleme direkt und bestimmt ansprechen, um ohne Umwege zur Lösung zu kommen","Professionelle Distanz wahren und Emotionen in Pflegegesprächen vollständig ausblenden"],
        correct: 1,
        fillTemplate: "Professionelle Kommunikation beinhaltet ___ Zuhören, Empathie und den Einsatz von ___-Botschaften.",
        fillAnswers: ["aktives","Ich"],
      },
      {
        q: "Was ist Personalverantwortung und Aufsichtspflicht in der Heimeinrichtung?",
        a: "Heimleitung und Pflegedienstleitung tragen Verantwortung für Personalplanung, Qualifikation, Einarbeitung und Dienstaufsicht. Pflegefachkräfte haben Aufsichtspflicht gegenüber Pflegehilfskräften bei delegierten Aufgaben.",
        options: ["Die Verantwortung liegt vollständig beim Träger der Einrichtung, nicht bei der Pflegedienstleitung","Leitungsebene trägt Personalverantwortung; Fachkräfte haben Aufsicht bei delegierten Aufgaben","Die Aufsichtspflicht entfällt, sobald eine Pflegehilfskraft eine einjährige Ausbildung abgeschlossen hat","Die Aufsichtspflicht der Fachkraft gilt ausschließlich bei ärztlich verordneten Behandlungsmaßnahmen"],
        correct: 1,
        fillTemplate: "Die ___ trägt Personalverantwortung. Pflegefachkräfte haben ___ gegenüber Hilfskräften bei delegierten Aufgaben.",
        fillAnswers: ["Pflegedienstleitung","Aufsichtspflicht"],
      },
      {
        q: "Was ist eine Vorsorgevollmacht und wer darf sie ausstellen?",
        a: "Mit einer Vorsorgevollmacht bevollmächtigt man eine Vertrauensperson, im Falle der eigenen Entscheidungsunfähigkeit in bestimmten Bereichen (Gesundheit, Finanzen, Behörden) zu entscheiden. Jeder einwilligungsfähige Erwachsene kann sie ausstellen.",
        options: ["Ein vom Arzt ausgestelltes Dokument, das Angehörige zur Einsicht in die Krankenakte berechtigt","Schriftliche Vollmacht an Vertrauensperson; kann jeder einwilligungsfähige Erwachsene ausstellen","Eine formale Regelung, die notariell beglaubigt und vom Betreuungsgericht genehmigt werden muss","Ein Rechtsdokument, das sofort bei Unterzeichnung gilt, auch wenn die Person noch entscheidungsfähig ist"],
        correct: 1,
        fillTemplate: "Mit einer Vorsorgevollmacht bevollmächtigt man eine ___, bei eigener Entscheidungsunfähigkeit zu handeln. Jeder ___ Erwachsene kann sie ausstellen.",
        fillAnswers: ["Vertrauensperson","einwilligungsfähige"],
      },
      {
        q: "Was versteht man unter dem Grundsatz der Verhältnismäßigkeit in der Pflege?",
        a: "Pflegemaßnahmen müssen in einem angemessenen Verhältnis zum Pflegeziel stehen. Belastungen/Risiken einer Maßnahme dürfen den Nutzen nicht übersteigen. Gilt besonders am Lebensende.",
        options: ["Je mehr Pflegemaßnahmen angewendet werden, desto besser das Ergebnis für den Bewohner","Maßnahmen müssen zum Ziel verhältnismäßig sein; Risiken dürfen Nutzen nicht übersteigen","Verhältnismäßigkeit bedeutet, dass alle Bewohner unabhängig von individuellen Bedürfnissen gleich versorgt werden","Verhältnismäßigkeit betrifft ausschließlich Medikamentendosierungen, nicht pflegerische Interventionen"],
        correct: 1,
        fillTemplate: "Verhältnismäßigkeit bedeutet, dass ___ einer Maßnahme den Nutzen nicht übersteigen dürfen. Dies gilt besonders am ___.",
        fillAnswers: ["Risiken","Lebensende"],
      },
      {
        q: "Welche Rechte haben Bewohner in einer stationären Pflegeeinrichtung?",
        a: "Recht auf Würde und Selbstbestimmung, individuelle Pflege, Privatsphäre, Informationsrecht, Beschwerderecht, Teilnahme an Heimmitwirkung (Heimbeirat), Wahlfreiheit bei Arzt/Krankenhaus.",
        options: ["Nur Grundversorgung gemäß Pflegeplan; weitere Rechte müssen im Heimvertrag einzeln vereinbart werden","Würde, Selbstbestimmung, Privatsphäre, Informations- und Beschwerderecht, Heimbeirat","Rechte gelten nur für einwilligungsfähige Bewohner; bei gesetzlicher Betreuung übernimmt der Betreuer diese","Das Recht auf Einzelzimmer, individuelle Mahlzeiten und uneingeschränkten Besuch zu jeder Tageszeit"],
        correct: 1,
        fillTemplate: "Bewohner haben ein Recht auf ___ und Selbstbestimmung. Beschwerden können im ___ geäußert werden.",
        fillAnswers: ["Würde","Heimbeirat"],
      },
      {
        q: "Was ist der Unterschied zwischen Betreuungsrecht und Vorsorgevollmacht?",
        a: "Vorsorgevollmacht: selbst erteilt, solange einwilligungsfähig. Betreuungsrecht: wird vom Gericht angeordnet, wenn keine Vollmacht vorliegt und ein Betreuer bestellt wird. Betreuer handelt im Interesse des Betroffenen.",
        options: ["Beide sind identische Dokumente, die vom Gericht zum Schutz einwilligungsunfähiger Personen erstellt werden","Vollmacht selbst erteilt; Betreuung durch Gericht angeordnet wenn keine Vollmacht vorhanden","Eine Vorsorgevollmacht wird proaktiv vom Gericht ausgestellt, um ältere gefährdete Menschen zu schützen","Betreuung und Vollmacht müssen beide jährlich beim Betreuungsgericht verlängert werden"],
        correct: 1,
        fillTemplate: "Eine Vorsorgevollmacht wird selbst erteilt. Wenn keine vorliegt, kann das ___ einen Betreuer ___.",
        fillAnswers: ["Gericht","bestellen"],
      },
      {
        q: "Was versteht man unter dem Prinzip der 'Informed Consent' (informierten Einwilligung)?",
        a: "Informed Consent = Patienten müssen vor jeder Maßnahme ausreichend informiert worden sein und freiwillig eingewilligt haben. Einwilligung kann jederzeit widerrufen werden. Gilt auch für Pflege.",
        options: ["Eine bei Aufnahme erteilte Einwilligung gilt dauerhaft für alle folgenden Maßnahmen des Aufenthalts","Patienten müssen informiert sein und freiwillig einwilligen; Widerruf jederzeit möglich","Informed Consent ist nur für medizinische Eingriffe erforderlich; Routinepflege benötigt keine Einwilligung","Die schriftliche Einwilligung eines gesetzlichen Vertreters ist stets vor jeder Pflegemaßnahme erforderlich"],
        correct: 1,
        fillTemplate: "Informed Consent bedeutet, dass Patienten ___ informiert und ___ eingewilligt haben müssen.",
        fillAnswers: ["ausreichend","freiwillig"],
      },
    ],
  },

  // ── 8. DEMENZ & GERONTOLOGIE ─────────────────────────────────────────────
  "Demenz & Gerontologie": {
    color: "#e8d07c", icon: "🧠",
    questions: [
      {
        q: "Welche drei häufigsten Demenzformen gibt es?",
        a: "1. Alzheimer-Demenz (60–70%, neurodegenerativ). 2. Vaskuläre Demenz (durch Durchblutungsstörungen). 3. Lewy-Körper-Demenz (mit Halluzinationen, Parkinsonzeichen). Mischformen möglich.",
        options: ["Alzheimer, Parkinson-Demenz und frontotemporale Demenz","Alzheimer, vaskuläre Demenz, Lewy-Körper-Demenz","Alzheimer, Korsakow-Syndrom, senile Demenz als eigenständige Formen","Alzheimer, Multi-Infarkt-Demenz, Binswanger-Erkrankung"],
        correct: 1,
        fillTemplate: "Die drei häufigsten Demenzformen sind Alzheimer, ___ Demenz und ___-Körper-Demenz.",
        fillAnswers: ["vaskuläre","Lewy"],
      },
      {
        q: "Was sind typische Frühzeichen der Alzheimer-Demenz?",
        a: "Kurzeitgedächtnissprobleme (Gespräche vergessen, Termine verpassen), Wortfindungsstörungen, Orientierungsprobleme in neuen Umgebungen, Stimmungsveränderungen, Rückzug. Langzeitgedächtnis zunächst erhalten.",
        options: ["Plötzlicher Verlust des Langzeitgedächtnisses mit erhaltener Kurzzeiterinnerung","Kurzzeitgedächtnis betroffen, Wortfindungsstörungen, Orientierungsprobleme; Langzeitgedächtnis zunächst erhalten","Auffällige Persönlichkeitsveränderungen und enthemmtes Verhalten als erste Zeichen","Halluzinationen und starke Schwankungen der Wachheit von Tag zu Tag"],
        correct: 1,
        fillTemplate: "Frühzeichen der Alzheimer-Demenz sind ___ und Wortfindungsstörungen. Das ___ ist zunächst noch erhalten.",
        fillAnswers: ["Kurzzeitgedächtnisprobleme","Langzeitgedächtnis"],
      },
      {
        q: "Was ist Validation nach Naomi Feil und wie wird sie angewendet?",
        a: "Validation ist eine Kommunikationsmethode für Menschen mit Demenz. Grundprinzip: Gefühle und subjektive Realität der Person akzeptieren, nicht korrigieren, auf emotionaler Ebene begegnen. Technik: Augenkontakt, sanfte Stimme, eigene Sprache des Betroffenen aufgreifen.",
        options: ["Realitätsorientierungstraining (ROT) mit Tagesstruktur und Orientierungstafeln","Akzeptanz der subjektiven Realität; keine Korrekturen; auf emotionaler Ebene begegnen","Reminiszenzarbeit mit Fotos und Musik zur Aktivierung des Langzeitgedächtnisses","Basale Stimulation mit sensorischen Reizen zur Wahrnehmungsförderung"],
        correct: 1,
        fillTemplate: "Validation akzeptiert die ___ Realität der demenzerkrankten Person. Man ___ die Person nie, sondern begegnet ihr emotional.",
        fillAnswers: ["subjektive","korrigiert"],
      },
      {
        q: "Was sind die Grundprinzipien der personzentrierten Demenzpflege (nach Tom Kitwood)?",
        a: "Person = wertvolles Individuum (Personenstatus erhalten). Fünf psychologische Bedürfnisse: Liebe/Verbundenheit, Identität, Beschäftigung, Einbeziehung/Trost, Bindung. Demenz allein erklärt nicht das Verhalten – Pflegequalität beeinflusst die Erfahrung.",
        options: ["Kognitive Stimulation und Gedächtnisübungen stehen im Mittelpunkt der Betreuung","Personenstatus erhalten; fünf Bedürfnisse: Liebe, Identität, Beschäftigung, Einbeziehung, Bindung","Sicherheit durch feste Tagesstruktur und medikamentöse Beruhigung","Demenzgerechte Umgebungsgestaltung ohne individuelle Biografie"],
        correct: 1,
        fillTemplate: "Nach Kitwood werden fünf Bedürfnisse unterschieden: Liebe, ___, Beschäftigung, Einbeziehung und ___.",
        fillAnswers: ["Identität","Bindung"],
      },
      {
        q: "Wie unterscheidet man normales Altern von Demenz?",
        a: "Normales Altern: gelegentlich Dinge vergessen, aber Hauptereignis bleibt erinnerbar; Alltag bleibt bewältigbar. Demenz: ganze Erlebnisse vergessen; Alltagsaktivitäten zunehmend eingeschränkt; Persönlichkeitsveränderungen; kein Krankheitseinsicht.",
        options: ["Demenz ist im Frühstadium kaum von normaler Vergesslichkeit zu unterscheiden","Normales Altern: Hauptereignis erinnerbar, Alltag bewältigbar. Demenz: Alltag eingeschränkt, Persönlichkeitsveränderung","Normale Vergesslichkeit betrifft vor allem das Langzeitgedächtnis, Demenz das Kurzzeitgedächtnis","Demenz beginnt immer mit Persönlichkeitsveränderungen, normales Altern mit Merkfähigkeitsproblemen"],
        correct: 1,
        fillTemplate: "Beim normalen Altern bleibt das ___ erinnerbar. Bei Demenz werden ganze ___ vergessen und der Alltag ist eingeschränkt.",
        fillAnswers: ["Hauptereignis","Erlebnisse"],
      },
      {
        q: "Welche Tests werden zur Demenzdiagnostik eingesetzt?",
        a: "Mini-Mental-Status-Test (MMST): 30 Punkte, ab 24 Punkte Demenz möglich. DemTect (14 Punkte). MoCA (Montreal Cognitive Assessment). Uhrentest. Diese Tests ergänzen ärztliche Diagnostik.",
        options: ["Braden-Skala und Barthel-Index als kombinierte Messinstrumente für kognitive Beeinträchtigung","MMST, DemTect, MoCA, Uhrentest; ergänzen ärztliche Diagnostik","MMST allein reicht für eine gesicherte Demenzdiagnose aus, wenn unter 20 Punkte","GDS (Geriatric Depression Scale) ist das vorrangige Instrument zur Demenzerkennung"],
        correct: 1,
        fillTemplate: "Beim ___ (MMST) zeigt ein Wert unter ___ Punkten mögliche kognitive Beeinträchtigung.",
        fillAnswers: ["Mini-Mental-Status-Test","24"],
      },
      {
        q: "Was versteht man unter 'herausforderndem Verhalten' bei Demenz und wie geht man damit um?",
        a: "Herausforderndes Verhalten: Agitation, Aggression, Weglaufen, Schreien, Schlafstörungen. Meist Ausdruck von unerfüllten Bedürfnissen, Schmerz oder Angst. Umgang: Auslöser suchen, Bedürfnis erfüllen, Ablenkung, ruhige Atmosphäre, keine Konfrontation.",
        options: ["Sedierung nach ärztlicher Absprache als erste Reaktion auf Agitation, um Verletzungen zu vermeiden","Ausdruck unerfüllter Bedürfnisse; Auslöser suchen, Bedürfnis erfüllen, ruhige Atmosphäre","Realitätsorientierungstraining einsetzen, um die Verwirrung direkt zu korrigieren und Orientierung herzustellen","Bettgitter oder Sitzhose als Schutzmaßnahme einsetzen, bis der Auslöser bekannt ist"],
        correct: 1,
        fillTemplate: "Herausforderndes Verhalten ist oft Ausdruck unerfüllter ___. Man sollte den ___ suchen und das Bedürfnis erfüllen.",
        fillAnswers: ["Bedürfnisse","Auslöser"],
      },
      {
        q: "Was ist biografisches Arbeiten in der Demenzpflege?",
        a: "Gezieltes Einbeziehen der Lebensgeschichte eines Menschen mit Demenz in die Pflege und Betreuung. Wichtig: Beruf, Hobbys, Familie, Rituale, Vorlieben. Stärkt Identität, ermöglicht bedeutungsvolle Aktivitäten.",
        options: ["Ein therapeutisches Schreibverfahren, bei dem der Bewohner seine Autobiografie selbst verfasst oder diktiert","Lebensgeschichte einbeziehen: Beruf, Hobbys, Rituale; stärkt Identität und ermöglicht passende Aktivitäten","Eine formale psychologische Persönlichkeitsbewertung, die bei der Aufnahme durchgeführt wird","Eine Gruppenaktivität, bei der Bewohner Schulkindern und Besuchern Geschichten aus ihrem Leben erzählen"],
        correct: 1,
        fillTemplate: "Biografisches Arbeiten bezieht die ___ in die Pflege ein. Es stärkt die ___ und ermöglicht bedeutungsvolle Aktivitäten.",
        fillAnswers: ["Lebensgeschichte","Identität"],
      },
      {
        q: "Was ist Sundowning-Syndrom bei Demenz?",
        a: "Sundowning = verstärkte Verwirrung, Unruhe oder Agitation bei Menschen mit Demenz am Nachmittag/Abend. Ursachen: gestörter Tag-Nacht-Rhythmus, Erschöpfung, verminderte Orientierungspunkte in der Dunkelheit. Maßnahmen: Strukturierung, Licht, Aktivitäten tagsüber.",
        options: ["Ein morgendliches Phänomen, bei dem Menschen mit Demenz verwirrt aufwachen und die Umgebung verkennen","Verstärkte Verwirrung und Unruhe am Abend/Nachmittag; Strukturierung und Licht helfen","Störungen des REM-Schlafs mit lebhaften Alpträumen und nächtlicher Agitation als Ursache","Ein Zustand, bei dem helles Sonnenlicht Desorientierung auslöst und daher tagsüber gemieden werden sollte"],
        correct: 1,
        fillTemplate: "Beim Sundowning-Syndrom verstärkt sich die ___ am Abend und Nachmittag. Hilfreiche Maßnahmen sind Strukturierung und ausreichend ___.",
        fillAnswers: ["Verwirrung","Licht"],
      },
      {
        q: "Wie kann die Sturzgefahr bei Menschen mit Demenz reduziert werden?",
        a: "Umgebungsanpassung (rutschfeste Böden, Handläufe, Nachtlicht), sichere Schuhe, Hilfsmittel bereitstellen, Toilettengang regelmäßig anbieten, Medikamente überprüfen (Sedativa!), Gleichgewichtstraining, Sturzrisiko regelmäßig erfassen.",
        options: ["Bettgitter, Sitzgurte und Rückhaltestühle verwenden; alle Gehversuche nur noch unter Aufsicht erlauben","Umgebungsanpassung, sichere Schuhe, Hilfsmittel, Toilettenangebot, Medikamentenkontrolle, Gleichgewichtstraining","Mobilität auf Physiotherapiestunden beschränken und zu anderen Zeiten ausschließlich den Rollstuhl einsetzen","Niedrig dosierte Sedativa verordnen, Bettgitter verwenden und nachts kontinuierliche Überwachung sicherstellen"],
        correct: 1,
        fillTemplate: "Sturzprophylaxe bei Demenz umfasst ___ (z.B. Handläufe), sichere Schuhe und Überprüfung von ___ (besonders Sedativa).",
        fillAnswers: ["Umgebungsanpassung","Medikamenten"],
      },
      {
        q: "Was ist Realitätsorientierungstraining (ROT) und für wen ist es geeignet?",
        a: "ROT bietet strukturierte Orientierungshilfen zu Zeit, Ort und Person (Datum, Wochentag, Wetter nennen, Orientierungstafeln). Geeignet bei leichter bis mittelschwerer Demenz. Bei schwerer Demenz kann es Stress verursachen und Validation ist besser.",
        options: ["Eine intensive Therapie, die Fehlorientierungen bei allen Demenzschweregraden direkt korrigiert","Orientierungshilfen zu Zeit/Ort/Person; geeignet bei leichter Demenz; bei schwerer Demenz eher Validation","Ein körperliches Übungsprogramm mit räumlichen Orientierungsaufgaben zur Verbesserung von Balance und Koordination","Ein reminiszenzbasierter Ansatz mit Fotos der Vergangenheit zur Verbesserung des Langzeitgedächtnisses"],
        correct: 1,
        fillTemplate: "ROT bietet Orientierungshilfen zu Zeit, ___ und Person. Bei schwerer Demenz ist ___ besser geeignet.",
        fillAnswers: ["Ort","Validation"],
      },
      {
        q: "Was ist beim Sterbebegleitung in der Altenpflege wichtig?",
        a: "Würde und Selbstbestimmung bis zum Ende, Schmerzfreiheit (palliative Sedierung wenn nötig), spirituelle/religiöse Bedürfnisse berücksichtigen, Angehörige einbeziehen, Abschied ermöglichen, Wünsche aus Patientenverfügung beachten.",
        options: ["Maximale Interventionen, künstliche Ernährung, Krankenhausverlegung zur Intensivüberwachung","Würde, Schmerzfreiheit, spirituelle Bedürfnisse, Angehörige einbeziehen, Patientenverfügung beachten","Verlegung ins Krankenhaus, Beginn intravenöser Infusionen und Monitoringmaßnahmen alle 30 Minuten","Kontinuierliche Sedierung, Reduktion sensorischer Reize und Einschränkung der Besuchszeiten"],
        correct: 1,
        fillTemplate: "In der Sterbebegleitung stehen ___ und Schmerzfreiheit im Mittelpunkt. Die ___ muss berücksichtigt werden.",
        fillAnswers: ["Würde","Patientenverfügung"],
      },
      {
        q: "Was versteht man unter gerontologischen Alternstheorien (Aktivitätstheorie, Disengagementtheorie)?",
        a: "Aktivitätstheorie: Lebensqualität durch aktive Teilhabe erhalten. Disengagementtheorie (veraltet): natürlicher Rückzug im Alter. Heute gilt: individuelle Ressourcen und Präferenzen bestimmen das erfolgreiche Altern.",
        options: ["Kontinuitätstheorie: Ältere müssen denselben Lebensstil wie im mittleren Erwachsenenalter beibehalten","Aktivitätstheorie: Teilhabe fördert Lebensqualität; Disengagement: Rückzug; heute: individuell","Selektivitätstheorie: Erfolgreiches Altern erfordert Reduktion aller Aktivitäten zur Energieschonung","Rollentheorie: Ältere altern nur erfolgreich, wenn sie die gesellschaftlich erwartete Rolle annehmen"],
        correct: 1,
        fillTemplate: "Die Aktivitätstheorie besagt, dass ___ die Lebensqualität fördert. Die Disengagementtheorie beschreibt den natürlichen ___ im Alter.",
        fillAnswers: ["aktive Teilhabe","Rückzug"],
      },
      {
        q: "Welche sozialen Risiken begleiten das Altern häufig?",
        a: "Verlust des Lebenspartners (Trauer, Einsamkeit), Renteneintritt (Rollenveränderung), Einschränkung der Mobilität, Wegfall sozialer Netzwerke, finanzielle Einschränkungen, mögliche Pflegebedürftigkeit.",
        options: ["Renteneintritt stärkt die soziale Teilhabe und reduziert das Einsamkeitsrisiko erheblich","Verlust Partner, Rollenveränderung durch Rente, Mobilität, Netzwerkverlust, finanzielle Einschränkungen","Soziale Risiken werden erst ab Pflegegrad 3 klinisch relevant und beeinflussen dann die Lebensqualität","Die finanzielle Situation verbessert sich nach dem Renteneintritt durch Rentenzahlungen und geringere Ausgaben"],
        correct: 1,
        fillTemplate: "Typische soziale Risiken im Alter sind Verlust des ___, Einsamkeit und eingeschränkte ___.",
        fillAnswers: ["Lebenspartners","Mobilität"],
      },
      {
        q: "Was ist Reminiszenzarbeit in der Altenpflege?",
        a: "Reminiszenzarbeit = gezieltes Erinnern und Erzählen aus der Vergangenheit. Nutzt Langzeitgedächtnis (das bei Demenz länger erhalten bleibt). Fördert Identität, Wohlbefinden und soziale Interaktion. Bilder, Musik, Gegenstände als Mittel.",
        options: ["Ein strukturiertes Gedächtnistraining mit neuen Informationen und Rätseln zur kognitiven Aktivierung","Gezieltes Erinnern an die Vergangenheit; nutzt Langzeitgedächtnis, fördert Identität und Wohlbefinden","Ein zukunftsorientierter Lebensplanungsansatz mit Fokus auf persönliche Ziele und soziale Teilhabe","Ein kognitiv-verhaltenstherapeutisches Verfahren zur Aufarbeitung negativer Erinnerungen"],
        correct: 1,
        fillTemplate: "Reminiszenzarbeit nutzt das ___, das bei Demenz länger erhalten bleibt. Sie fördert ___ und Wohlbefinden.",
        fillAnswers: ["Langzeitgedächtnis","Identität"],
      },
      {
        q: "Was sind 'herausfordernde Verhaltensweisen' bei Demenz und wie begegnet man ihnen?",
        a: "Herausfordernde Verhaltensweisen: Aggression, Unruhe, Wandern, Rufen, Schlafstörungen. Meist Ausdruck unerfüllter Bedürfnisse, Schmerzen oder Angst. Reaktion: Auslöser finden, Bedürfnis erfüllen, Ablenkung, ruhige Atmosphäre, keine Konfrontation.",
        options: ["Sedierung nach ärztlicher Anordnung als primärer Schritt zur Verringerung des Verletzungsrisikos","Ausdruck unerfüllter Bedürfnisse; Auslöser suchen, Bedürfnis erfüllen, ruhige Atmosphäre","Klare verbale Korrektur und ruhige Wiederholung der Erklärung zur Wiederherstellung der Orientierung","Bettgitter oder Rückhaltestuhl als Schutzmaßnahme einsetzen, bis die Fallbesprechung stattgefunden hat"],
        correct: 1,
        fillTemplate: "Herausforderndes Verhalten ist oft Ausdruck unerfüllter ___. Man sucht den ___ und erfüllt das Bedürfnis.",
        fillAnswers: ["Bedürfnisse","Auslöser"],
      },
      {
        q: "Was ist milieuorientierte Pflege bei Demenz?",
        a: "Milieuorientierte Pflege gestaltet das Wohnumfeld demenzgerecht: feste Tagesstrukturen, bekannte Gegenstände aus der Biografie, ruhige Atmosphäre, klare Orientierungshilfen (Bilder, Farben, Namen an Türen), Sicherheit ohne Freiheitsentzug.",
        options: ["Häufig wechselnde Raumgestaltung mit neuen Reizen zur Vorbeugung kognitiven Abbaus","Demenzgerechte Gestaltung des Umfelds: Struktur, Vertrautes, Orientierungshilfen, Sicherheit","Professionell gestaltete Räume mit farbcodierten Zonen und minimalen persönlichen Gegenständen","Strikte Tagesstruktur nach Einheitsplan ohne individuelle Ausnahmen, um Vorhersehbarkeit für alle zu schaffen"],
        correct: 1,
        fillTemplate: "Milieuorientierte Pflege schafft eine ___ Umgebung mit Orientierungshilfen. ___ aus der Biografie geben Sicherheit.",
        fillAnswers: ["demenzgerechte","Bekannte Gegenstände"],
      },
    ],
  },

  // ── 9. PROPHYLAXEN ─────────────────────────────────────────────────────────
  "Prophylaxen": {
    color: "#c8e87c", icon: "🛡️",
    questions: [
      {
        q: "Was sind die sechs wichtigsten Prophylaxen in der stationären Altenpflege?",
        a: "Dekubitusprophylaxe, Sturzprophylaxe, Kontrakturprophylaxe, Thromboseprophylaxe, Pneumonieprophylaxe und Intertrigoprophylaxe. Alle dienen der Vorbeugung von Komplikationen durch Immobilität oder Pflegebedürftigkeit.",
        options: ["Dekubitus-, Pneumonie- und Thromboseprophylaxe als die drei wichtigsten","Dekubitus, Sturz, Kontraktur, Thrombose, Pneumonie und Intertrigo","Prophylaxen erst ab Pflegegrad 3 erforderlich","Dekubitus- und Aspirationsprophylaxe als Pflichtmaßnahmen, Rest optional"],
        correct: 1,
        fillTemplate: "Zu den wichtigsten Prophylaxen gehören Dekubitus, Sturz, Kontraktur, ___, ___ und Intertrigo.",
        fillAnswers: ["Thrombose","Pneumonie"],
      },
      {
        q: "Was ist die Dekubitusprophylaxe und welche Maßnahmen umfasst sie?",
        a: "Prophylaxe gegen Druckgeschwüre. Maßnahmen: regelmäßige Umlagerung (alle 2 Std.), Druckentlastung (Spezialmatratzen), Hautinspektion, Hautzustand dokumentieren, Ernährungsoptimierung, Mobilisation.",
        options: ["Druckentlastungsmatratze, Wundverband, Nahrungsergänzungsmittel und tägliche ärztliche Beurteilung","Umlagerung alle 2 Std., Druckentlastung, Hautinspektion, Ernährung, Mobilisation","Umlagerung alle 4 Stunden, da Antidekubitusmatratzen bei Braden-Wert unter 18 ausreichend Schutz bieten","Hautpflege und Inkontinenzversorgung sind die einzigen pflegerischen Pflichmaßnahmen der Dekubitusprophylaxe"],
        correct: 1,
        fillTemplate: "Dekubitusprophylaxe umfasst regelmäßige Umlagerung (alle ___ Stunden), ___ und Hautinspektion.",
        fillAnswers: ["2","Druckentlastung"],
      },
      {
        q: "Was ist die Thromboseprophylaxe und warum ist sie wichtig?",
        a: "Schutz vor Blutgerinnseln in den Venen (TVT – tiefe Venenthrombose), die zur Lungenembolie führen können. Maßnahmen: Bewegungsübungen, Kompressionsstrümpfe, ausreichend Flüssigkeit, frühe Mobilisation, ggf. Heparin nach ärztl. Anordnung.",
        options: ["Prophylaxe arterieller Plaquebildung durch Ernährungsumstellung, Bewegung und Cholesterinmedikamente","Schutz vor Venenthrombose; Maßnahmen: Bewegung, Kompressionsstrümpfe, Flüssigkeit, Mobilisation","Prophylaxe von Vorhofflimmern zur Reduktion des Risikos kardioembolischer Schlaganfälle","Prävention von oberflächlichen Venenentzündungen durch Hochlagerung der Beine und Wärmekompressen"],
        correct: 1,
        fillTemplate: "Thromboseprophylaxe schützt vor ___ in den Venen. Maßnahmen sind ___, Kompressionsstrümpfe und Mobilisation.",
        fillAnswers: ["Blutgerinnseln","Bewegungsübungen"],
      },
      {
        q: "Was sind die Maßnahmen der Pneumonieprophylaxe?",
        a: "Pneumonieprophylaxe bei liegenden Patienten: Atemübungen (tiefes Ein- und Ausatmen, Lippenbremse), regelmäßige Mobilisation, Oberkörperhochlagerung, Inhalationen, Mundpflege, ausreichend Trinken, Rückklopfen/Vibrationsmassage.",
        options: ["Pneumokokken-Impfung, Antibiotika bei Risiko, Isolierung von infizierten Personen, tägl. Fiebermessen","Atemübungen, Mobilisation, Oberkörperhochlagerung, Mundpflege, Flüssigkeit","Ausschließlich Inhalation und Flüssigkeit; Atemübungen und Mundpflege sind nicht belegt","Mundpflege, Schmerzmittel, Hustenstiller und Bettenruhe als Kernmaßnahmen"],
        correct: 1,
        fillTemplate: "Pneumonieprophylaxe umfasst ___, Mobilisation und ___. Der Oberkörper sollte erhöht gelagert werden.",
        fillAnswers: ["Atemübungen","Mundpflege"],
      },
      {
        q: "Was ist die Kontrakturprophylaxe und welche Maßnahmen gehören dazu?",
        a: "Prophylaxe gegen dauerhafte Muskel- und Gelenkverkürzung. Maßnahmen: regelmäßige aktive und passive Bewegungsübungen aller Gelenke (Physiotherapie), korrekte Lagerung in Funktionsstellung, frühzeitige Mobilisation.",
        options: ["Anwendung von Wärmekompressen und muskelentspannenden Salben zur Erhaltung der Gelenkbeweglichkeit","Bewegungsübungen aller Gelenke, korrekte Lagerung, frühzeitige Mobilisation","Ruhigstellung der betroffenen Gelenke mit Schienen, um verkürzte Muskeln vor weiterer Schädigung zu schützen","Kontrakturprophylaxe liegt ausschließlich in der Verantwortung der Physiotherapie und ist keine Pflegeaufgabe"],
        correct: 1,
        fillTemplate: "Kontrakturprophylaxe beinhaltet ___ und passive Bewegungsübungen. Die korrekte ___ in Funktionsstellung ist wichtig.",
        fillAnswers: ["aktive","Lagerung"],
      },
      {
        q: "Was ist die Intertrigoprophylaxe und welche Körperstellen sind besonders gefährdet?",
        a: "Intertrigo = Wundreiben in Hautfalten durch Feuchtigkeit und Reibung. Gefährdet: Leisten, unter Brüsten, Achseln, zwischen Zehen. Prophylaxe: Hautfalten trocken halten, luftdurchlässige Kleidung, Zinkpaste/Hautschutzprodukte, tägl. Inspektion.",
        options: ["Ausschließlich Sakral- und Fersenbereich, da diese die häufigsten Dekubitusprävalenzzonen darstellen","Hautfalten (Leisten, unter Brüsten, Achseln); trocken halten, Schutzmittel, tägl. Inspektion","Nur Fußsohlen und Zehenzwischenräume, wo Reibung beim Laufen zu Hautschäden führt","Bauch und unterer Rücken, wo Inkontinenzvorlagen am häufigsten Hautfeuchtigkeit verursachen"],
        correct: 1,
        fillTemplate: "Intertrigo entsteht in ___ durch Feuchtigkeit und Reibung. Prophylaxe: ___ halten und täglich inspizieren.",
        fillAnswers: ["Hautfalten","trocken"],
      },
      {
        q: "Was ist die Sturzprophylaxe und welche drei Risikobereiche unterscheidet man?",
        a: "Sturzprophylaxe verhindert Stürze durch: personenbezogene Faktoren (Gleichgewicht, Kraft, Sehvermögen, Medikamente), umgebungsbedingte Faktoren (Stolperfallen, schlechte Beleuchtung, nasse Böden), tätigkeitsbezogene Faktoren (Aufstehen ohne Hilfe, ungeeignetes Schuhwerk).",
        options: ["Kognitive Einschränkung allein als stärkster Einzelprädiktor für das Sturzrisiko bei Pflegebedürftigen","Personenbezogen (Gleichgewicht, Medikamente), umgebungsbedingt (Stolperfallen), tätigkeitsbezogen (Aufstehen)","Ausschließlich Umgebungsgefahren, da körperliche Risikofaktoren von der Physiotherapie bearbeitet werden","Medikamentennebenwirkungen allein, da alle anderen Faktoren außerhalb des Einflussbereichs der Pflege liegen"],
        correct: 1,
        fillTemplate: "Sturzrisikofaktoren umfassen personenbezogene (z.B. ___ und Medikamente), umgebungsbedingte und ___ Faktoren.",
        fillAnswers: ["Gleichgewicht","tätigkeitsbezogene"],
      },
      {
        q: "Was ist das Sturz-Assessment und welche Skalen werden verwendet?",
        a: "Das Sturz-Assessment erfasst das Sturzrisiko systematisch. Häufig verwendete Skalen: Sturz-Risikoeinschätzung nach Morse (0–125 Punkte), Hendrich-II-Sturzrisikomodell, hausinterne Assessmentbögen. Ergebnis: Risikokategorisierung und individuelle Maßnahmenplanung.",
        options: ["Einmalige Risikoerfassung bei Aufnahme reicht, da das Sturzrisiko sich kaum verändert","Systematische Risikobewertung; Skalen: Morse, Hendrich; ergibt Risikokategorie und Maßnahmenplan","Braden-Skala als primäres Instrument, da sie alle relevanten Sturzrisiken abdeckt","Klinisches Urteil der Pflegefachkraft ohne standardisiertes Assessment ist ausreichend"],
        correct: 1,
        fillTemplate: "Das Sturz-Assessment erfasst ___ systematisch. Häufig genutzte Skalen sind die ___ Skala und Hendrich-II.",
        fillAnswers: ["Sturzrisiko","Morse"],
      },
      {
        q: "Was ist eine Lagerungs- und Umlagerungsplanung?",
        a: "Individueller Lagerungsplan für bettlägerige Bewohner. Legt Häufigkeit (i.d.R. alle 2 Std.), Lagerungsarten (Rücken-, Seiten-, Bauchlagern, Speziallagen wie 30°-Kippung, Weichlagerung) und verantwortliche Pflegeperson fest. Wird dokumentiert.",
        options: ["Standardlagerungsplan für alle bettlägerigen Bewohner; individuelle Anpassung nur auf Anweisung","Individueller Plan: Häufigkeit (2 Std.), Lagerungsarten, verantwortliche Person, Dokumentation","Lagerungsplan wird vom Arzt verordnet; pflegerische Dokumentation ist nicht erforderlich","Antidekubitusmatratze erlaubt Verlängerung auf 4-stündliche Umlagerungsintervalle"],
        correct: 1,
        fillTemplate: "Ein Lagerungsplan legt ___ (alle 2 Stunden) und ___ der Lagerung fest. Jede Umlagerung wird dokumentiert.",
        fillAnswers: ["Häufigkeit","Lagerungsarten"],
      },
      {
        q: "Welche Maßnahmen der Mundpflege verhindern Aspirationspneumonie?",
        a: "Regelmäßige Mundpflege entfernt Keime (Streptokokken, Keime), die aspiriert und zur Pneumonie führen. Maßnahmen: 2x tägl. Zähne/Prothesen reinigen, Schleimhäute feucht halten, Mundspülungen, auf Soor achten, bei Sondenernährung besonders wichtig.",
        options: ["Mundpflege beugt primär Karies vor und hat keinen klinisch relevanten Effekt auf das Pneumonierisiko","Regelmäßige Mundpflege entfernt Keime; 2x täglich, Prothesen reinigen, Mundspülungen","Antiseptische Mundspülung zweimal täglich ist die wirksamste Maßnahme zur Pneumonieprophylaxe","Mundpflege reduziert das Pneumonierisiko nur bei beatmeten Intensivpatienten, nicht in der Altenpflege"],
        correct: 1,
        fillTemplate: "Regelmäßige Mundpflege entfernt ___, die aspiriert werden können. Sie sollte ___ täglich durchgeführt werden.",
        fillAnswers: ["Keime","zweimal"],
      },
      {
        q: "Was ist eine Wechseldruck- oder Antidekubitusmatratze und wann wird sie eingesetzt?",
        a: "Spezialmatratzen, die durch Luftkammern (Wechseldruck) oder Schaumstoffkerne (Weichlagerung) Auflagedruck verteilen und Druckspitzen verringern. Eingesetzt bei erhöhtem Dekubitusrisiko (Braden < 18) als ergänzende Maßnahme zur Umlagerung.",
        options: ["Eine Standard-Hochdichte-Schaumstoffmatratze, die für alle Bewohner ausreichende Unterstützung bietet","Spezialmatratze mit Druckentlastung; bei erhöhtem Dekubitusrisiko als Ergänzung zur Umlagerung","Eine Therapiematratze, die bei hohem Dekubitusrisiko den Umlagerungsplan vollständig ersetzen kann","Eine beheizte Spezialmatratze zur Verbesserung der Durchblutung bei peripheren Gefäßerkrankungen"],
        correct: 1,
        fillTemplate: "Antidekubitusmatratzen verteilen ___ und reduzieren Druckspitzen. Sie ergänzen die ___, ersetzen sie aber nicht.",
        fillAnswers: ["Auflagedruck","Umlagerung"],
      },
      {
        q: "Was ist ein Ernährungs-Screening und wann wird es in der Pflege eingesetzt?",
        a: "Ernährungs-Screening = Kurzerfassung des Mangelernährungsrisikos. Instrument: MNA-SF (Mini Nutritional Assessment Short Form) oder NRS-2002. Eingesetzt bei Aufnahme und regelmäßig bei Risikogruppen (Gewichtsverlust, verminderter Appetit).",
        options: ["Eine vollständige Ernährungsbeurteilung mit Blutuntersuchungen durch eine Diätassistentin auf ärztliche Überweisung","Kurzerfassung des Mangelernährungsrisikos; Instrumente: MNA-SF, NRS-2002; bei Aufnahme und regelmäßig","Ein einmaliges Assessment bei Aufnahme, das für die gesamte Pflegedauer Gültigkeit behält","Eine dreitägige Ernährungsanamnese, die monatlich durchgeführt wird, um Kalorienbedarf zu berechnen"],
        correct: 1,
        fillTemplate: "Das Ernährungs-Screening erfasst das ___ Risiko. Instrument: ___ (MNA-SF), eingesetzt bei Aufnahme und regelmäßig.",
        fillAnswers: ["Mangelernährungs","Mini Nutritional Assessment"],
      },
      {
        q: "Was ist Kompressionstherapie (Kompressionsstrümpfe) und welche Hinweise sind zu beachten?",
        a: "Kompressionsstrümpfe üben Druck auf die Beine aus und fördern den venösen Rückfluss. Einsatz: Thrombose- und Ödemprophylaxe. Hinweise: korrekte Größe, täglich morgens anlegen (vor dem Aufstehen), auf Druckstellen achten, kontraindiziert bei Arterienerkrankungen.",
        options: ["Verbesserung des arteriellen Zustroms durch gleichmäßigen Druck auf die Beinvenen","Druck auf Venen → venöser Rückfluss; morgens anlegen, Größe beachten, bei Arterienerkrankung kontraindiziert","Abends anlegen bevor man ins Bett geht, morgens nach dem Aufstehen ausziehen","Kompressionsstrümpfe sind bei jeder Form von Herzinsuffizienz ohne Einschränkung indiziert"],
        correct: 1,
        fillTemplate: "Kompressionsstrümpfe fördern den ___ Rückfluss. Sie sollten ___ angelegt werden (vor dem Aufstehen).",
        fillAnswers: ["venösen","morgens"],
      },
      {
        q: "Was ist die Flüssigkeitsbilanzierung und wann wird sie durchgeführt?",
        a: "Flüssigkeitsbilanzierung erfasst Flüssigkeitszufuhr (Trinken, Infusionen, Sondenkost) und -ausscheidung (Urin, Erbrechen, Drainage). Ziel: Über-, Unterwässerung oder Exsikkose frühzeitig erkennen. Angewendet bei: Herzinsuffizienz, Niereninsuffizienz, Exsikkosegefahr.",
        options: ["Die tägliche Gewichtsmessung des Bewohners als einzig verlässlicher Indikator für Flüssigkeitsretention","Erfassung von Zufuhr und Ausscheidung; erkennt Über-/Unterwässerung; bei Herz-/Niereninsuffizienz","Ein Protokoll, das ausschließlich die Urinausscheidung zur Überwachung der Nierenfunktion bei Katheterversorgung erfasst","Messung der Blutelektrolyte zur Beurteilung des Flüssigkeitsstatus, die der Arzt auf Anfrage anordnet"],
        correct: 1,
        fillTemplate: "Die Flüssigkeitsbilanzierung erfasst ___ (Trinken, Infusionen) und ___ (Urin). Sie erkennt Exsikkose frühzeitig.",
        fillAnswers: ["Zufuhr","Ausscheidung"],
      },
      {
        q: "Was ist das DNQP und welche Expertenstandards sind besonders relevant?",
        a: "DNQP = Deutsches Netzwerk für Qualitätsentwicklung in der Pflege. Entwickelt evidenzbasierte Expertenstandards. Relevante Standards: Dekubitusprophylaxe, Sturzprophylaxe, Schmerzmanagement, Kontinenzförderung, Pflege von Menschen mit Demenz, Beziehungsgestaltung.",
        options: ["Eine staatliche Aufsichtsbehörde, die Qualitätsprüfungen in Pflegeeinrichtungen durchführt","Netzwerk für pflegewissenschaftliche Standards; Standards: Dekubitus, Sturz, Schmerz, Demenz u.a.","Eine Registrierungsstelle, die für die Zulassung von Pflegefachkräften in Deutschland zuständig ist","Ein Forschungsinstitut, das klinische Studien zur Arzneimittelsicherheit bei älteren Patienten veröffentlicht"],
        correct: 1,
        fillTemplate: "DNQP steht für ___ Netzwerk für Qualitätsentwicklung in der Pflege. Es entwickelt ___ Expertenstandards.",
        fillAnswers: ["Deutsches","evidenzbasierte"],
      },
      {
        q: "Was ist eine Pneumonieprophylaxe mit der 'Lippenbremse' und wie wird sie angewendet?",
        a: "Lippenbremse = Atemtechnik: langsam durch leicht geöffnete Lippen ausatmen. Verlangsamt die Ausatmung, erhöht den Druck in den Atemwegen und verhindert das Kollabieren kleiner Bronchien. Für bettlägerige und COPD-Patienten.",
        options: ["Eine Atemübung, bei der Luft kräftig durch gespitzte Lippen eingeatmet wird, um die Zwerchfellmuskulatur zu stärken","Ausatmen durch leicht geöffnete Lippen; verhindert Bronchialkollaps bei Bettlägerigen","Eine Technik, bei der der Patient schnell durch die Nase atmet, um Sekret aus den Atemwegen zu mobilisieren","Eine Atemtechnik, bei der die Luft kurz angehalten wird, bevor man ausatmet, um die Sauerstoffaufnahme zu verbessern"],
        correct: 1,
        fillTemplate: "Bei der Lippenbremse atmet man durch leicht geöffnete ___ aus. Sie verhindert das ___ kleiner Bronchien.",
        fillAnswers: ["Lippen","Kollabieren"],
      },
      {
        q: "Was ist die Pneumonieprophylaxe durch Atemstimulierende Einreibung (ASE)?",
        a: "ASE = Pflegemethode: rhythmisches Einreiben des Rückens zur Atemvertiefung, Entspannung und Sekretmobilisation. Stimuliert die Atemmuskulatur und fördert die Eigenatmung. Besonders bei immobilen, beatmeten oder komatösen Patienten.",
        options: ["Eine klassische oberflächliche Massagetechnik, die Muskelverspannungen löst und zur allgemeinen Entspannung beiträgt","Rhythmisches Einreiben des Rückens zur Atemvertiefung und Sekretmobilisation","Eine kräftige Perkussionsmassage des Brustkorbs zur Lösung von konsolidiertem Sekret bei Pneumonie","Eine passive Dehntechnik, die aktive Atembewegungen bei gelähmten Patienten imitiert"],
        correct: 1,
        fillTemplate: "Die ASE ist ein rhythmisches ___ des Rückens. Sie fördert ___ und Sekretmobilisation.",
        fillAnswers: ["Einreiben","Atemvertiefung"],
      },
      {
        q: "Welche Maßnahmen sind Bestandteil der Dekubitusprophylaxe laut DNQP-Expertenstandard?",
        a: "Risikoerfassung (Braden-Skala), Umlagerung und Mikrolagerung, Druckentlastende Hilfsmittel, Hautpflege und -inspektion, Ernährungsoptimierung, Mobilisierung, Schulung von Pflegenden und Angehörigen. Dokumentation aller Maßnahmen.",
        options: ["Braden-Skala, 2-stündliche Umlagerung, Spezialmatratze und Wunddokumentation als Kernelement","Risikoerfassung, Umlagerung, Hilfsmittel, Hautpflege, Ernährung, Mobilisierung, Schulung, Dokumentation","Risikoerfassung, Hautpflege und Ernährungsoptimierung; Umlagerung nur bei Braden unter 12","Wunddokumentation, Verbandswechsel, Wundbeobachtung und Schmerzmanagement als Pflichtmaßnahmen"],
        correct: 1,
        fillTemplate: "Der DNQP-Standard Dekubitusprophylaxe umfasst Risikoerfassung mit der ___, Umlagerung, Druckentlastung und ___.",
        fillAnswers: ["Braden-Skala","Hautpflege"],
      },
    ],
  },

  // ── 10. BERUFSROLLE & TEAMARBEIT ─────────────────────────────────────────────
  "Berufsrolle & Teamarbeit": {
    color: "#7cc8e8", icon: "👥",
    questions: [
      {
        q: "Was ist der Unterschied zwischen Durchführungsverantwortung und Steuerungsverantwortung?",
        a: "Durchführungsverantwortung: Pflegefachhelfer führen Maßnahmen eigenverantwortlich durch. Steuerungsverantwortung: Pflegefachkraft plant, überwacht und steuert die Pflege. In stabilen Pflegesituationen können Pflegefachhelfer selbstständig handeln.",
        options: ["Beide Begriffe beschreiben dieselbe Verantwortung, die Helfer und Fachkraft gleichermaßen teilen","Durchführung: Helfer führt durch; Steuerung: Fachkraft plant und überwacht","Die Durchführungsverantwortung liegt beim Arzt, der die Pflegemaßnahme angeordnet hat","Steuerungsverantwortung bedeutet, dass der Helfer seine eigene Arbeit kontrolliert und keine Fachaufsicht benötigt"],
        correct: 1,
        fillTemplate: "Pflegefachhelfer tragen ___ für ihre Maßnahmen. Die Pflegefachkraft trägt ___.",
        fillAnswers: ["Durchführungsverantwortung","Steuerungsverantwortung"],
      },
      {
        q: "Was ist Delegation und welche Voraussetzungen müssen erfüllt sein?",
        a: "Delegation = Übertragung einer ärztlichen oder pflegerischen Aufgabe an eine andere Berufsgruppe. Voraussetzungen: delegierende Person stellt sicher, dass der Empfänger qualifiziert ist; Anordnungsverantwortung bleibt beim Delegierenden; Empfänger trägt Durchführungsverantwortung.",
        options: ["Jede Aufgabe kann frei delegiert werden, solange die delegierende Person im selben Gebäude anwesend ist","Übertragung von Aufgaben bei sichergestellter Qualifikation; Anordnungsverantwortung bleibt beim Delegierenden","Bei Delegation geht die vollständige Verantwortung auf den Ausführenden über; der Delegierende haftet nicht mehr","Der Ausführende trägt sowohl Anordnungs- als auch Durchführungsverantwortung, sobald er die Aufgabe übernimmt"],
        correct: 1,
        fillTemplate: "Bei der Delegation trägt der Delegierende die ___. Der Ausführende trägt die ___.",
        fillAnswers: ["Anordnungsverantwortung","Durchführungsverantwortung"],
      },
      {
        q: "Welche Aufgaben darf ein Altenpflegehelfer NICHT eigenständig durchführen?",
        a: "Vorbehaltsaufgaben der Pflegefachkraft: Pflegeplanung/-assessment erstellen, Pflegediagnosen stellen, selbstständige Medikamentengabe (ärztl. Delegierung nötig), i.v.-Injektionen, hochkomplexe Pflege. Pflegefachhelfer nur in stabilen Pflegesituationen.",
        options: ["Pflegefachhelfer dürfen alle Aufgaben übernehmen, die eine Pflegefachkraft ihnen mindestens einmal gezeigt hat","Keine Pflegeplanung, keine Pflegediagnosen, keine eigenständige Medikamentengabe ohne Delegation","Grundpflege und Umlagerung dürfen ausschließlich von examinierten Pflegefachkräften durchgeführt werden","Alle Pflegetätigkeiten erfordern eine ärztliche schriftliche Anordnung, bevor ein Pflegefachhelfer sie ausführen darf"],
        correct: 1,
        fillTemplate: "Pflegefachhelfer dürfen keine ___ erstellen und keine Medikamente ohne ___ eigenständig verabreichen.",
        fillAnswers: ["Pflegeplanung","Delegation"],
      },
      {
        q: "Was ist berufliche Selbstreflexion und warum ist sie in der Pflege wichtig?",
        a: "Berufliche Selbstreflexion = kritische Auseinandersetzung mit eigenen Handlungen, Haltungen, Emotionen und Fehlern. Wichtig für: Qualitätssicherung, Burnoutprävention, professionelles Wachstum, Erkennen eigener Grenzen.",
        options: ["Eine Leistungsbeurteilung durch die Teamleitung zur Bewertung individueller Kompetenzen","Kritische Auseinandersetzung mit eigenem Handeln; fördert Qualität, verhindert Burnout, erkennt Grenzen","Ein formales Beurteilungsverfahren, das die eigene Leistung mit einrichtungsinternen Standards vergleicht","Vergleich der eigenen Vorgehensweise mit der eines Kollegen, um die beste Praxis zu identifizieren"],
        correct: 1,
        fillTemplate: "Berufliche Selbstreflexion ist die kritische Auseinandersetzung mit dem eigenen ___. Sie hilft, eigene ___ zu erkennen.",
        fillAnswers: ["Handeln","Grenzen"],
      },
      {
        q: "Was ist eine Fallbesprechung und welchen Zweck hat sie?",
        a: "Interdisziplinäres Gespräch über einen Bewohner (Pflege, Arzt, Therapeuten, Sozialarbeit). Zweck: Pflegesituation gemeinsam analysieren, Maßnahmen abstimmen, Pflege individualisieren, Ressourcen nutzen. Regelmäßig oder bei Problemen.",
        options: ["Monatliches Teambriefing zu allgemeinen Betriebsthemen ohne Fallbezug","Interdisziplinäre Fallanalyse zur Abstimmung von Maßnahmen und Individualisierung der Pflege","Ausschließlich ein Arzt-Pflege-Gespräch über Medikamente und Behandlung","Pflegeleitung bespricht Problemfälle ohne Beteiligung der ausführenden Pflegekräfte"],
        correct: 1,
        fillTemplate: "Eine Fallbesprechung ist ein ___ Gespräch über einen Bewohner. Ziel ist die Abstimmung von ___ und individuelle Pflege.",
        fillAnswers: ["interdisziplinäres","Maßnahmen"],
      },
      {
        q: "Was bedeutet Teamarbeit in der Altenpflege und was sind Voraussetzungen?",
        a: "Gute Teamarbeit: offene Kommunikation, klare Aufgabenverteilung, gegenseitiger Respekt, konstruktiver Umgang mit Fehlern, gemeinsame Ziele. Voraussetzungen: regelmäßige Teambesprechungen, Übergaben, Kollegialität.",
        options: ["Jeder Mitarbeiter trägt eigenverantwortlich für seine Bewohner, informiert die Leitung täglich schriftlich","Offene Kommunikation, klare Rollen, Respekt, konstruktiver Fehlerumgang, gemeinsame Ziele","Teamarbeit bedeutet hauptsächlich, Aufgaben gleichmäßig nach Dienstplan aufzuteilen und zu dokumentieren","Hierarchische Strukturen mit klaren Weisungsbefugnissen, festen Verantwortungsbereichen und Dienstplänen"],
        correct: 1,
        fillTemplate: "Gute Teamarbeit erfordert offene ___ und klare ___. Regelmäßige Teambesprechungen sind wichtig.",
        fillAnswers: ["Kommunikation","Aufgabenverteilung"],
      },
      {
        q: "Was ist eine Pflegeübergabe und was muss sie beinhalten?",
        a: "Pflegeübergabe = systematische Weitergabe pflegerisch relevanter Informationen beim Schichtwechsel. Inhalt: Zustand der Bewohner, besondere Ereignisse, durchgeführte und ausstehende Maßnahmen, Anordnungen, Veränderungen. Mündlich, schriftlich oder per Übergabeprotokoll.",
        options: ["Mündliche Zusammenfassung der durchgeführten Maßnahmen, Vitalzeichen und Neuaufnahmen ohne Bewohnerzustand","Systematische Weitergabe: Bewohnerzustand, Ereignisse, Maßnahmen, Anordnungen, Veränderungen","Übergabe beschränkt sich auf außergewöhnliche Ereignisse, Neuaufnahmen und Arztbesuche des Tages","Schriftliches Protokoll der Vitalzeichen, Medikamentengaben und geplanten Maßnahmen des Folgetages"],
        correct: 1,
        fillTemplate: "Die Pflegeübergabe informiert über ___, besondere Ereignisse und ___ Maßnahmen.",
        fillAnswers: ["Bewohnerzustand","ausstehende"],
      },
      {
        q: "Was versteht man unter kollegialer Beratung und Supervision?",
        a: "Kollegiale Beratung: strukturiertes Gespräch unter Kollegen zur Lösungsfindung bei beruflichen Problemen ohne externe Fachkraft. Supervision: professionell geleitete Reflexion des beruflichen Handelns durch externe Fachkraft (Supervisor). Beide fördern Qualität und Gesundheit.",
        options: ["Kollegiale Beratung wird von einem externen Supervisor geleitet; Supervision ist ein informelles Teamgespräch","Kollegiale Beratung: unter Kollegen; Supervision: mit externem Fachmann; beide fördern Reflexion und Qualität","Supervision ist ein Pflichttreffen zur Bewertung von Mitarbeiterleistung durch die Pflegeleitung","Kollegiale Beratung und Supervision sind gesetzlich vorgeschrieben und monatlich durchzuführen"],
        correct: 1,
        fillTemplate: "Kollegiale Beratung findet ___ Fachkraft statt. Bei der Supervision leitet eine ___ Fachkraft.",
        fillAnswers: ["ohne externe","externe"],
      },
      {
        q: "Was sind Pflegestandards und welche Funktion haben sie?",
        a: "Pflegestandards beschreiben verbindliche Minimalanforderungen an die Qualität von Pflegemaßnahmen (z.B. Standard für Dekubitusprophylaxe, Sturz, Sondenernährung). Basis: Expertenstandards (DNQP), aktuelle Pflegewissenschaft, rechtliche Vorgaben. Rechtlich relevant.",
        options: ["Einrichtungsinterne Arbeitsanweisungen ohne rechtliche Relevanz, die jederzeit geändert werden können","Verbindliche Qualitätsminima für Pflegemaßnahmen; Basis: Expertenstds., Wissenschaft, Recht; rechtlich relevant","Empfehlungen des MDK, die individuell an Bewohnerwünsche und Ressourcen angepasst werden","Freiwillige Qualitätsziele ohne rechtliche Bindung, die zur Profilierung gegenüber Wettbewerbern dienen"],
        correct: 1,
        fillTemplate: "Pflegestandards beschreiben ___ Anforderungen an die Pflegequalität. Sie basieren auf ___ (DNQP).",
        fillAnswers: ["verbindliche Minimal","Expertenstandards"],
      },
      {
        q: "Was ist Burnout in der Pflege und welche Faktoren begünstigen ihn?",
        a: "Burnout = Zustand emotionaler, mentaler und körperlicher Erschöpfung durch chronischen Arbeitsstress. Risikofaktoren: hohe Arbeitslast, Schichtarbeit, emotionale Belastung (Tod, Leid), mangelnde Anerkennung, fehlende Erholungszeiten.",
        options: ["Kurzfristige Ermüdung nach einer stressreichen Woche, die sich in der Freizeit vollständig erholt","Erschöpfungszustand durch chronischen Stress; Risiken: Arbeitslast, Schicht, emotionale Belastung, mangelnde Anerkennung","Akute psychische Reaktion auf ein einzelnes traumatisches Ereignis im Pflegealltag (Trauma)","Klinische Depression mit somatischen Beschwerden, die ausschließlich die Privatperson betrifft"],
        correct: 1,
        fillTemplate: "Burnout ist ein Erschöpfungszustand durch chronischen ___. Risikofaktoren sind hohe Arbeitslast und mangelnde ___.",
        fillAnswers: ["Arbeitsstress","Anerkennung"],
      },
      {
        q: "Was ist berufliche Kommunikation mit schwierigen Bewohnern oder Angehörigen?",
        a: "Professionelle Kommunikation bei Konflikten: ruhig bleiben, aktiv zuhören, Empathie zeigen, eigene Grenzen klar formulieren (Ich-Botschaften), keine Vorwürfe, Eskalation vermeiden, bei Bedarf Vorgesetzte einbeziehen.",
        options: ["Forderungen von Angehörigen vollständig erfüllen, Protokoll führen und Leitung nach jedem Gespräch informieren","Ruhig bleiben, zuhören, Empathie, Ich-Botschaften, Grenzen setzen, Vorgesetzte einbeziehen","Schwierige Gespräche schriftlich führen, Zeugen hinzuziehen und alle Aussagen sofort dokumentieren","Du-Botschaften einsetzen, unakzeptables Verhalten benennen und Konsequenzen klar formulieren"],
        correct: 1,
        fillTemplate: "Bei schwierigen Gesprächen hilft es, ruhig zu bleiben und ___ anzuwenden. ___ helfen, eigene Gefühle klar auszudrücken.",
        fillAnswers: ["aktives Zuhören","Ich-Botschaften"],
      },
      {
        q: "Was bedeutet beobachten, wahrnehmen und beurteilen in der Pflege?",
        a: "Beobachten = systematische Wahrnehmung mit allen Sinnen (Haut, Atmung, Verhalten, Urin, Wunden). Beurteilen = Einschätzung der Beobachtung (normal/auffällig). Dokumentieren und ggf. Fachkraft informieren. Basis für Pflegeentscheidungen.",
        options: ["Subjektive Einschätzung des allgemeinen Befindens aus dem Bauchgefühl heraus ohne systematisches Vorgehen","Systematische Wahrnehmung mit allen Sinnen, Beurteilung (normal/auffällig), Dokumentation, Fachkraft informieren","Messung von Vitalzeichen und Dokumentation, da andere Wahrnehmungen zu subjektiv sind","Beobachtungsergebnisse werden erst bei der nächsten Pflegeplanung berücksichtigt"],
        correct: 1,
        fillTemplate: "Pflegebeobachtung nutzt alle ___ des Körpers. Auffälligkeiten werden ___ und der Fachkraft gemeldet.",
        fillAnswers: ["Sinne","dokumentiert"],
      },
      {
        q: "Was ist die Schweigepflicht im Betrieb (interne und externe Schweigepflicht)?",
        a: "Intern: nur dienstlich notwendige Informationen weitergeben – nicht an Kollegen ohne Pflegebezug. Extern: Kein Gespräch über Bewohner/Patienten außerhalb der Einrichtung (Familie, Freunde). Datenschutz (DSGVO) auch für Pflegedokumentation.",
        options: ["Interne Schweigepflicht gilt nur gegenüber Personen außerhalb der Pflegeabteilung, nicht zwischen Kollegen","Intern: nur dienstlich notwendig; extern: kein Gespräch außerhalb Einrichtung; DSGVO gilt","Bewohnerdaten dürfen an Angehörige weitergegeben werden, da diese ein natürliches Auskunftsrecht haben","Schweigepflicht betrifft ausschließlich medizinische Diagnosen, nicht allgemeine Pflegeinformationen"],
        correct: 1,
        fillTemplate: "Intern gilt: nur ___ notwendige Infos weitergeben. Extern: ___ über Bewohner außerhalb der Einrichtung ist verboten.",
        fillAnswers: ["dienstlich","Gespräch"],
      },
      {
        q: "Was ist interdisziplinäre Zusammenarbeit in der Altenpflege?",
        a: "Zusammenarbeit aller am Pflegeprozess beteiligten Berufsgruppen: Pflege, Ärzte, Physiotherapeuten, Ergotherapeuten, Logopäden, Sozialarbeiter, Seelsorge. Ziel: ganzheitliche Versorgung. Koordination durch Pflegefachkraft.",
        options: ["Zusammenarbeit von Pflegefachkräften und Ärzten unter Koordination des Medizinischen Dienstes","Alle Berufsgruppen (Pflege, Ärzte, Therapien, Sozialarbeit, Seelsorge) für ganzheitliche Versorgung","Kooperation zwischen Pflege und Therapeuten, wobei die Ärzte eigenständig und unabhängig handeln","Zusammenarbeit innerhalb der Pflegeabteilung zwischen examinierten Kräften und Hilfskräften"],
        correct: 1,
        fillTemplate: "Interdisziplinäre Zusammenarbeit umfasst ___, Ärzte, Therapeuten und Sozialarbeit. Ziel ist ___ Versorgung.",
        fillAnswers: ["Pflege","ganzheitliche"],
      },
      {
        q: "Was versteht man unter dem Pflegeleitbild einer Einrichtung?",
        a: "Das Pflegeleitbild beschreibt die Grundwerte, Ziele und das Menschenbild, das einer Pflegeeinrichtung zugrunde liegt (z.B. Würde, Autonomie, Aktivierung). Es leitet das tägliche Handeln aller Mitarbeiter und ist Grundlage für Qualitätsstandards.",
        options: ["Das Organigramm der Einrichtung mit Zuständigkeiten und Stellenbeschreibungen aller Mitarbeiter","Grundwerte, Menschenbild und Ziele der Einrichtung; leitet tägliches Handeln und Qualitätsstandards","Das Qualitätshandbuch mit konkreten Pflegeanweisungen und Verfahrensanweisungen","Das gesetzlich vorgeschriebene Konzept zur Umsetzung des Pflegeberufegesetzes"],
        correct: 1,
        fillTemplate: "Das Pflegeleitbild beschreibt ___, Ziele und das ___ der Einrichtung. Es leitet das tägliche Handeln.",
        fillAnswers: ["Grundwerte","Menschenbild"],
      },
      {
        q: "Was sind 'Vorbehaltsaufgaben' nach dem Pflegeberufegesetz?",
        a: "Vorbehaltsaufgaben dürfen nur von Pflegefachkräften (nicht von Pflegehelfern) eigenständig durchgeführt werden: Pflegeassessment und -planung, Evaluation der Pflege, Anleitung und Beratung von pflegebedürftigen Menschen. Schützt Sicherheit der Pflegebedürftigen.",
        options: ["Aufgaben, die nach zweimaliger Einweisung auch von Pflegehilfskräften eigenständig übernommen werden können","Assessment, Planung und Evaluation dürfen nur Pflegefachkräfte eigenständig übernehmen","Ausschließlich ärztliche Tätigkeiten wie i.v.-Injektionen, die auch nicht delegiert werden dürfen","Alle pflegerischen Tätigkeiten einschließlich Grundpflege, die stets von examinierten Kräften durchzuführen sind"],
        correct: 1,
        fillTemplate: "Vorbehaltsaufgaben sind u.a. Pflegeassessment, -___ und Evaluation. Nur ___ dürfen diese eigenständig durchführen.",
        fillAnswers: ["planung","Pflegefachkräfte"],
      },
      {
        q: "Was ist ein Einarbeitungskonzept und warum ist es in der Pflege wichtig?",
        a: "Einarbeitungskonzept = strukturierter Plan zur Einführung neuer Mitarbeitender in Aufgaben, Abläufe und Kultur einer Einrichtung. Wichtig: Sicherheit für Berufsanfänger, Fehlervermeidung, Qualitätssicherung, Integration ins Team.",
        options: ["Eine Checkliste der Hausregeln und Hygienevorschriften, die neue Mitarbeiter unterschreiben müssen","Strukturierter Einführungsplan für neue Mitarbeiter; sichert Qualität und Fehlervermeidung","Das Probezeit-Beurteilungsformular, das zur Entscheidung über Weiterbeschäftigung dient","Ein Orientierungsgespräch am ersten Arbeitstag zur Vorstellung der Einrichtung und der Kollegen"],
        correct: 1,
        fillTemplate: "Das Einarbeitungskonzept ist ein strukturierter Plan zur Einführung ___ Mitarbeitender. Es sichert ___ und Fehlervermeidung.",
        fillAnswers: ["neuer","Qualität"],
      },
      {
        q: "Was versteht man unter 'Resilienz' in der Pflege und wie kann man sie stärken?",
        a: "Resilienz = psychische Widerstandsfähigkeit gegenüber Belastungen und Krisen. In der Pflege wichtig aufgrund hoher Belastungen (Tod, Schichtarbeit, Personalmangel). Stärkung durch: Pausen, soziale Unterstützung, Selbstreflexion, Sport, Supervision.",
        options: ["Emotionale Distanzierung von Bewohnern, regelmäßige Pausen und Wechsel in administrative Tätigkeiten","Psychische Widerstandsfähigkeit; gestärkt durch Pausen, soziale Unterstützung, Selbstreflexion, Supervision","Fähigkeit, Belastungen zu ignorieren und Stressoren durch Aufgabenteilung und Schichtplanung zu reduzieren","Persönlichkeitseigenschaft, die durch Kindheitserfahrungen geprägt und im Erwachsenenalter kaum veränderbar ist"],
        correct: 1,
        fillTemplate: "Resilienz ist die psychische ___ gegenüber Belastungen. Sie kann durch Pausen, ___ und Supervision gestärkt werden.",
        fillAnswers: ["Widerstandsfähigkeit","soziale Unterstützung"],
      },
    ],
  },
};

// ─── ENGLISH TOPICS ───────────────────────────────────────────────────────────
const TOPICS_EN = {
  "Basic Care & Hygiene": {
    color: "#e8a87c", icon: "🧼",
    questions: [
      {
        q: "What does the principle 'as much help as necessary, as little as possible' mean?",
        a: "It means promoting the independence of the person in care (activating care) rather than taking over all tasks. Only help where genuine support is needed.",
        options: ["Provide maximum assistance so residents feel safe and well cared for at all times","Promote independence and only help where needed","Take over all tasks to make care more efficient and ensure consistent quality","Offer help only at the resident's explicit verbal request"],
        correct: 1,
        fillTemplate: "This principle means promoting the ___ of the person in care. Only help where genuine ___ is needed.",
        fillAnswers: ["independence","support"],
      },
      {
        q: "How often should a bedridden patient be repositioned at minimum?",
        a: "Every 2 hours, unless an individual repositioning plan is in place. More frequently for high-risk patients.",
        options: ["Every 4 hours when a pressure-relieving mattress is in use, which reduces the need for repositioning","Every 2 hours","Every 3 hours according to standard nursing home protocols for all care levels","Every 2 hours for high-risk patients only; others can wait up to 6 hours"],
        correct: 1,
        fillTemplate: "A bedridden patient should be repositioned every ___ hours unless an individual ___ plan is in place.",
        fillAnswers: ["2","repositioning"],
      },
      {
        q: "What is the difference between disinfection and sterilisation?",
        a: "Disinfection reduces pathogens to a safe level. Sterilisation destroys all microorganisms including spores completely.",
        options: ["No difference – both methods achieve complete freedom from all microorganisms including spores","Disinfection kills all germs including spores; sterilisation only targets bacteria and viruses","Disinfection reduces germs, sterilisation destroys all microorganisms","Sterilisation uses chemical agents while disinfection uses heat to eliminate microorganisms"],
        correct: 2,
        fillTemplate: "___ reduces pathogens to a safe level. ___ destroys all microorganisms including spores completely.",
        fillAnswers: ["Disinfection","Sterilisation"],
      },
      {
        q: "How long must hand disinfectant be left to work?",
        a: "At least 30 seconds. Palms, backs of hands, finger spaces, fingertips and thumbs must all be covered.",
        options: ["15 seconds if the correct 6-step rubbing technique is applied thoroughly","30 seconds","60 seconds is required after contact with body fluids or excreta","20 seconds, following the same duration as handwashing with soap and water"],
        correct: 1,
        fillTemplate: "Hand disinfectant must work for at least ___ seconds. Palms, backs of hands and ___ must all be covered.",
        fillAnswers: ["30","finger spaces"],
      },
      {
        q: "What is a pressure ulcer (decubitus) and what causes it?",
        a: "A pressure ulcer is a wound of the skin and underlying tissue caused by prolonged pressure or shear forces that interrupt blood supply.",
        options: ["A wound caused by bacterial infection of fragile skin in elderly persons","A pressure wound caused by prolonged pressure interrupting blood supply","A skin lesion resulting from allergic reaction to care products or incontinence pads","A wound caused by oedema and venous insufficiency in immobile patients"],
        correct: 1,
        fillTemplate: "A pressure ulcer is caused by prolonged ___ that interrupts ___.",
        fillAnswers: ["pressure","blood supply"],
      },
      {
        q: "What are the four grades of pressure ulcers?",
        a: "Grade 1: non-blanchable redness. Grade 2: superficial skin defect to dermis. Grade 3: deep defect to subcutis. Grade 4: defect to bone/tendon/muscle.",
        options: ["Two grades: superficial and deep, based on clinical appearance","Grades 1–4 by depth of tissue damage","Three grades: erythema, open wound, and deep tissue destruction","Five grades including a preliminary stage for at-risk skin"],
        correct: 1,
        fillTemplate: "Grade 1 pressure ulcer shows non-blanchable ___. Grade 4 extends as deep as ___ or tendons.",
        fillAnswers: ["redness","bone"],
      },
      {
        q: "What are the WHO's five moments of hand hygiene?",
        a: "1. Before patient contact. 2. Before aseptic procedures. 3. After body fluid contact. 4. After patient contact. 5. After contact with the patient's surroundings.",
        options: ["Three moments: before patient contact, after body fluid exposure and after removing gloves","Before and after each direct care task, and after using the toilet","Five situations: before/after patient contact, before aseptic procedures, after body fluids","Only when hands are visibly soiled or after contact with high-risk patients"],
        correct: 2,
        fillTemplate: "The five moments include: before ___, after body fluid contact, and after ___.",
        fillAnswers: ["patient contact","patient surroundings contact"],
      },
      {
        q: "What personal protective equipment (PPE) must be worn during direct care contact?",
        a: "Disposable gloves as a minimum. When splashing is possible, additionally a protective gown and if needed a surgical mask or FFP2 mask.",
        options: ["Gloves are only required when there is visible blood or excreta present","Only gloves for direct wound care; no additional protection for routine care","Disposable gloves, gown if splashing, mask if needed","Standard care always requires an FFP2 mask, gown and gloves regardless of task"],
        correct: 2,
        fillTemplate: "During direct care contact, ___ must be worn as a minimum. When splashing is possible, add a ___ and mask.",
        fillAnswers: ["disposable gloves","protective gown"],
      },
      {
        q: "What is meant by 'activating care'?",
        a: "Activating care promotes and maintains the abilities of the person in care. Skills are practised together rather than done for the person.",
        options: ["Complete all care tasks efficiently to allow maximum rest and comfort for the resident","Promote abilities by practising together rather than doing for the person","Motivate residents to do physiotherapy and physical activity as the primary form of care","Carry out only those care tasks documented in the care plan"],
        correct: 1,
        fillTemplate: "Activating care promotes the ___ of the person in care by practising skills ___ rather than taking over.",
        fillAnswers: ["abilities","together"],
      },
      {
        q: "What are the key tasks of basic care (body care)?",
        a: "Washing/bathing, hair care, oral/dental care, nail care, shaving, dressing/undressing, repositioning, assistance with eating and elimination.",
        options: ["Wound dressing, medication administration and blood pressure monitoring as part of daily body care","Washing, hair care, oral care, nail care, dressing, repositioning, eating and elimination support","Care planning, documentation and observation of vital signs as the core basic care activities","Infusion monitoring, catheter care and subcutaneous injections as delegated basic care tasks"],
        correct: 1,
        fillTemplate: "Basic care tasks include washing, ___, oral care and assistance with ___ and elimination.",
        fillAnswers: ["hair care","eating"],
      },
      {
        q: "What is Basal Stimulation and what is it used for?",
        a: "Basal Stimulation (Prof. Andreas Fröhlich) is a care concept for promoting perception and communication in people with severe impairments through targeted sensory stimuli.",
        options: ["A physiotherapy technique focused on passive joint mobilisation to prevent contractures","Promoting perception in severely impaired people through sensory stimuli","An occupational therapy programme to improve fine motor skills and cognitive function","A palliative care approach for pain management in end-of-life situations"],
        correct: 1,
        fillTemplate: "Basal Stimulation promotes ___ and communication in people with severe impairments through targeted ___ stimuli.",
        fillAnswers: ["perception","sensory"],
      },
      {
        q: "What are the most important prophylaxes in residential elderly care?",
        a: "Pressure ulcer, falls, contracture, thrombosis, pneumonia and intertrigoprophylaxis. All aim to prevent complications from immobility or care dependency.",
        options: ["Falls and pressure ulcer prophylaxis only, as required by SGB XI and the DNQP expert standard","Pressure ulcer, falls, contracture, thrombosis, pneumonia prophylaxis and more","Thrombosis, pneumonia and wound prophylaxis; contracture prevention is exclusively physiotherapy's task","Incontinence management, wound care and oral care only; other prophylaxes are physician-ordered"],
        correct: 1,
        fillTemplate: "Key prophylaxes include pressure ulcer, falls, contracture, thrombosis and ___.",
        fillAnswers: ["pneumonia"],
      },
      {
        q: "What does falls prophylaxis involve?",
        a: "Risk assessment (e.g. falls assessment tool), environmental adaptation (non-slip floors, handrails, lighting), mobility aids, checking footwear, reviewing medications, balance training.",
        options: ["Using bed rails and fixed seating restraints to prevent unsupervised movement","Risk assessment, safe environment, aids, balance training","Ensuring 24-hour supervision so staff can physically support residents at all times","Administering sedating medication to reduce restlessness and wandering behaviour"],
        correct: 1,
        fillTemplate: "Falls prophylaxis includes risk assessment, environmental adaptation (e.g. ___), and ___.",
        fillAnswers: ["handrails","balance training"],
      },
      {
        q: "What principles guide incontinence care?",
        a: "Regular product changes, skin care to prevent maceration, preserving dignity, working towards activating continence promotion.",
        options: ["Use continence products throughout the day and change them on a fixed schedule regardless of soiling","Regular changes, skin protection, dignity","Focus primarily on scheduled toileting every 4 hours; continence products are a last resort","Record continence events in the care report but defer skin care to the next morning wash"],
        correct: 1,
        fillTemplate: "Incontinence care requires regular changes and ___ to prevent maceration. The resident's ___ must always be maintained.",
        fillAnswers: ["skin care","dignity"],
      },
      {
        q: "What should be considered for oral care in people needing care?",
        a: "Teeth or dentures cleaned at least twice daily, mucous membranes kept moist, check for inflammation or oral thrush (fungal infection), aspiration protection for swallowing difficulties.",
        options: ["Once daily in the morning is sufficient; dentures should be cleaned once per week","At least 2x daily, keep mucous membranes moist, watch for changes","Oral care is only necessary for residents who still have natural teeth","Rinsing the mouth with water after meals is sufficient for residents with dentures"],
        correct: 1,
        fillTemplate: "Oral care should be carried out at least ___ daily. For swallowing difficulties, ___ must be considered.",
        fillAnswers: ["twice","aspiration"],
      },
      {
        q: "What is pneumonia prophylaxis and what measures does it include?",
        a: "Measures to prevent pneumonia in at-risk patients: deep breathing exercises, early mobilisation, encouraging coughing, adequate fluid intake, positioning (upper body elevated), oral care.",
        options: ["Prophylactic antibiotics, pneumococcal vaccination, isolation and regular fever monitoring for at-risk residents","Breathing exercises, early mobilisation, coughing, fluids, upper body elevation, oral care","Inhalation therapy as the primary measure; breathing exercises and oral care are only supplementary","Mask use, hand disinfection, single-room isolation and restriction of visitors with respiratory symptoms"],
        correct: 1,
        fillTemplate: "Pneumonia prophylaxis includes ___ exercises, early mobilisation and ___ of the upper body.",
        fillAnswers: ["breathing","elevation"],
      },
      {
        q: "What is a contracture and how is it prevented?",
        a: "Contracture = permanent shortening of muscles, tendons or joint capsules due to lack of movement. Prevention: regular active and passive movement exercises (mobilisation), correct positioning, early physiotherapy.",
        options: ["Acute joint inflammation caused by infection or autoimmune processes, treated with anti-inflammatory medication","Permanent joint stiffening from immobility; prevented by mobilisation and positioning","Progressive degenerative joint disease similar to osteoarthritis, treated with physiotherapy","Fluid accumulation in joint capsules due to poor circulation, requiring compression therapy"],
        correct: 1,
        fillTemplate: "A contracture develops from insufficient ___ and leads to permanent ___. Prevention: regular mobilisation.",
        fillAnswers: ["movement","joint stiffening"],
      },
      {
        q: "When should a wound dressing be changed and what must be observed?",
        a: "According to medical orders or when the dressing is soaked, soiled or detached. Aseptic technique (sterile gloves, sterile materials), clean wound from inside outwards, observe and document wound appearance.",
        options: ["On a fixed weekly schedule regardless of wound condition to maintain routine consistency","As medically ordered or when needed; aseptic technique, observe and document wound","Only when the wound shows signs of infection such as redness, swelling or discharge","Every 24 hours for all wound types, using clean rather than sterile technique"],
        correct: 1,
        fillTemplate: "A dressing change follows ___ orders or as needed. ___ technique must always be used.",
        fillAnswers: ["medical","Aseptic"],
      },
      {
        q: "What is moist wound healing and what are its benefits?",
        a: "Moist wound healing keeps the wound bed moist, promotes granulation and epithelialisation, reduces pain and infection risk. Modern wound dressings (hydrocolloid, alginate) maintain the moist environment.",
        options: ["Wounds heal fastest when kept dry and exposed to air to prevent bacterial growth","Moist wound healing promotes healing through a moist environment and modern dressings","Antiseptic solutions applied daily create the optimal wound environment for healing","Traditional gauze dressings with antiseptic cream remain the gold standard for all wounds"],
        correct: 1,
        fillTemplate: "Moist wound healing keeps the wound ___ moist and promotes ___. Modern dressings like hydrocolloid maintain this environment.",
        fillAnswers: ["bed","granulation"],
      },
      {
        q: "What is Basal Stimulation in nursing care?",
        a: "Basal Stimulation (Prof. Andreas Fröhlich) is a care concept for promoting perception, communication and movement in people with severe impairments through targeted sensory stimuli (e.g. touch, vibration, vestibular).",
        options: ["A physiotherapy concept focused on guided active movement for neurological rehabilitation","Promoting perception in severely impaired people through targeted sensory stimuli","A structured pain assessment and management approach for palliative care patients","A cognitive training programme using memory exercises and environmental orientation techniques"],
        correct: 1,
        fillTemplate: "Basal Stimulation promotes ___ and communication through targeted ___ stimuli.",
        fillAnswers: ["perception","sensory"],
      },
    ],
  },

  "Nursing Process & Documentation": {
    color: "#f0c070", icon: "📋",
    questions: [
      {
        q: "How many steps does the nursing process model by Fiechter and Meier have?",
        a: "6 steps: 1. Information gathering, 2. Identifying problems and resources, 3. Setting nursing goals, 4. Planning nursing measures, 5. Implementation, 6. Evaluation.",
        options: ["4 steps, matching the simpler WHO nursing process model (Yura & Walsh)","5 steps, as in the NANDA nursing process which includes a separate diagnosis step","6 steps","8 steps as described in the expanded Alfaro-LeFevre model with re-assessment phases"],
        correct: 2,
        fillTemplate: "The Fiechter and Meier nursing process model has ___ steps. It begins with ___ gathering and ends with evaluation.",
        fillAnswers: ["6","information"],
      },
      {
        q: "What is the SIS® (Structured Information Collection)?",
        a: "The SIS® is the core element of the Structure Model in care documentation. It captures information about the resident's self-image, thematic areas and individual risks through a conversation.",
        options: ["A standardised medical intake form completed by physicians at the time of admission","Core document for care assessment capturing individual needs through conversation","A risk assessment checklist covering pressure ulcers, falls and nutritional status","The central care plan document where nursing goals and measures are formally recorded"],
        correct: 1,
        fillTemplate: "The SIS® is the core element of the ___ Model. It captures individual information through a ___ with the resident.",
        fillAnswers: ["Structure","conversation"],
      },
      {
        q: "What are the AEDLs / ABEDLs according to Krohwinkel?",
        a: "ABEDLs = Activities, Relationships and Existential Experiences of Life (13 areas, e.g. communicating, breathing, washing, eating, sleeping). Foundation for holistic care planning.",
        options: ["A nursing diagnosis classification based on standardised medical diagnostic criteria","13 areas of life as basis for care planning","A seven-step assessment model used to identify and prioritise complex nursing problems","A documentation system listing all legally required nursing interventions and their frequency"],
        correct: 1,
        fillTemplate: "ABEDLs stands for Activities, Relationships and ___ Experiences. There are ___ life areas as a basis for care planning.",
        fillAnswers: ["Existential","13"],
      },
      {
        q: "What is a nursing problem, nursing goal and nursing measure?",
        a: "Nursing problem: a deficit or risk identified in the resident (e.g. risk of pressure ulcer). Nursing goal: the desired outcome, formulated SMART. Nursing measure: the concrete action taken to reach the goal (e.g. repositioning every 2 hours).",
        options: ["Problem = the resident's diagnosis; Goal = the treatment prescribed by the doctor; Measure = care activity","Problem = identified deficit/risk; Goal = desired outcome (SMART); Measure = concrete action","Problem = care task; Goal = the standard of care to be met; Measure = the frequency of intervention","All three describe different aspects of the medical treatment plan, documented by physicians"],
        correct: 1,
        fillTemplate: "A nursing ___ is an identified deficit or risk. A nursing goal is formulated ___ and describes the desired outcome.",
        fillAnswers: ["problem","SMART"],
      },
      {
        q: "What does SMART mean in nursing goal formulation?",
        a: "S = Specific, M = Measurable, A = Achievable/Accepted, R = Realistic, T = Time-bound.",
        options: ["Standardised, Measurable, Achievable, Recorded, Time-bound","Specific, Measurable, Achievable, Realistic, Time-bound","Structured, Medical, Assessed, Reviewed, Timed","Specific, Monitored, Agreed, Realistic, Targeted"],
        correct: 1,
        fillTemplate: "SMART stands for Specific, ___, Achievable, Realistic and ___.",
        fillAnswers: ["Measurable","Time-bound"],
      },
      {
        q: "What is the legal significance of care documentation?",
        a: "Documentation serves as evidence of services provided, proof in liability cases, communication tool within the team and basis for quality checks (inspection bodies).",
        options: ["An internal administrative tool with no legal validity in liability proceedings","Legal proof, communication tool and quality basis for inspections","A communication aid for team handovers, but without legal standing in court","A record kept primarily for billing purposes, with limited relevance to care quality"],
        correct: 1,
        fillTemplate: "Care documentation serves as legal ___ of services provided and is the basis for ___ checks.",
        fillAnswers: ["proof","quality"],
      },
      {
        q: "What are 'resources' in care documentation?",
        a: "Resources are abilities and strengths the person in care can still use independently (inner resources: own abilities; outer resources: family, aids).",
        options: ["Physical aids provided by the facility, such as walking frames, wheelchairs and orthotics","Abilities and strengths the patient can still use; inner and outer resources","The formal support entitlements under the care insurance level (Pflegegrad) assessment","Personal preferences and daily routines documented in the resident's biography"],
        correct: 1,
        fillTemplate: "Resources are ___ and strengths of the patient they can still use. We distinguish ___ and outer resources.",
        fillAnswers: ["abilities","inner"],
      },
      {
        q: "Which assessment tools are commonly used in elderly care?",
        a: "Braden Scale (pressure ulcer risk), Falls Assessment (e.g. Morse/Hendrich), Mini Mental State Examination (MMSE) for cognition, Mini Nutritional Assessment (MNA) for nutrition, pain scale (NRS).",
        options: ["The Braden Scale, Barthel Index and GDS together cover all relevant risk areas without further tools","Braden Scale, Falls Assessment, MMSE, MNA, pain scale","Assessments are created by the MDK, transmitted to the facility and updated at each inspection","Initial assessment at admission; Braden Scale and pain scale repeated every six months for stable residents"],
        correct: 1,
        fillTemplate: "The ___ Scale assesses pressure ulcer risk. The MMSE assesses ___ function.",
        fillAnswers: ["Braden","cognitive"],
      },
      {
        q: "What is a care plan and who creates it?",
        a: "A care plan sets out in writing the care problems, goals and measures for a resident. Created by the nursing professional, but the resident and family should be involved.",
        options: ["A timetable showing which staff member is responsible for which resident during each shift","Written record of problems, goals and measures; created by nursing professional","A medical record written by the attending physician detailing diagnoses and treatment","A formal agreement between the facility and the resident's family about care scope"],
        correct: 1,
        fillTemplate: "A care plan documents care ___, goals and measures. It is created by the ___ professional.",
        fillAnswers: ["problems","nursing"],
      },
      {
        q: "What goes in a care report (care diary)?",
        a: "Date/time, name of carer, observations about the resident's condition, special events, measures taken, resident's reactions, changes.",
        options: ["Name, date and completed care tasks only; further detail is recorded in the care plan","Date, observations, special events, measures and reactions","Only significant events such as falls, acute illness or family visits require documentation","Vital signs and medication administered; subjective observations are not part of the report"],
        correct: 1,
        fillTemplate: "A care report contains date, name, ___ about the resident, special events and ___.",
        fillAnswers: ["observations","reactions"],
      },
      {
        q: "What is the difference between subjective and objective data in care assessment?",
        a: "Subjective data: the patient's own statements (what they feel, perceive, report). Objective data: measurable findings observed by the carer (blood pressure, wound appearance, behaviour).",
        options: ["Subjective data is collected by nurses; objective data is collected exclusively by physicians","Subjective = patient's statements; Objective = measurable findings by carers","Subjective data includes vital signs and wound measurements; objective data includes patient-reported pain","Both types are interchangeable and refer to any information gathered during care contact"],
        correct: 1,
        fillTemplate: "___ data is the patient's own statements. ___ data is measurable findings collected by the carer.",
        fillAnswers: ["Subjective","Objective"],
      },
      {
        q: "Why is evaluation important in the nursing process?",
        a: "Evaluation checks whether nursing goals were achieved. It is the basis for adjusting the care plan and ensures care quality.",
        options: ["It documents completed nursing tasks for billing and is conducted at the end of each quarter","Checks goal achievement and is the basis for care plan adjustments","Evaluation is the responsibility of the medical review board during external inspections","It summarises the resident's progress for the annual case conference and family review"],
        correct: 1,
        fillTemplate: "Evaluation checks whether ___ were achieved and is the basis for ___ of the care plan.",
        fillAnswers: ["nursing goals","adjustments"],
      },
      {
        q: "How long must care documentation be retained?",
        a: "Generally 10 years. For minors, until 10 years after coming of age. The exact period may vary by federal state.",
        options: ["5 years, matching the standard civil law statute of limitations for contractual claims","6 years, following the commercial record-keeping requirements under tax law","10 years","30 years, because there is no time limit for medical negligence claims in Germany"],
        correct: 2,
        fillTemplate: "Care documentation must generally be retained for ___ years. Special rules apply for ___.",
        fillAnswers: ["10","minors"],
      },
      {
        q: "What is the WHO four-phase nursing process model (Yura & Walsh)?",
        a: "1. Assessment, 2. Planning, 3. Implementation, 4. Evaluation. It is a continuous cycle.",
        options: ["Assessment, Nursing Diagnosis, Intervention, Outcome – matching the five-step NANDA model","Assessment, Planning, Implementation, Evaluation","Assessment, Planning, Intervention, Outcome – the APIO model by Alfaro-LeFevre","Information gathering, Problem identification, Care planning, Implementation – as in the Fiechter/Meier model"],
        correct: 1,
        fillTemplate: "The WHO model consists of four phases: Assessment, ___, Implementation and ___.",
        fillAnswers: ["Planning","Evaluation"],
      },
      {
        q: "What is a nursing diagnosis (e.g. NANDA)?",
        a: "A nursing diagnosis describes a care state or problem in standardised form (e.g. 'Impaired Physical Mobility'). NANDA is an international classification system.",
        options: ["A physician's medical diagnosis transferred into the care plan for nursing purposes","Standardised description of a care state (e.g. NANDA system)","A short-term nursing goal formulated in response to an acute change in the resident's condition","A specific care intervention documented in the action plan with frequency and responsible staff"],
        correct: 1,
        fillTemplate: "A nursing diagnosis describes a care state in ___ form. NANDA is an international ___ system.",
        fillAnswers: ["standardised","classification"],
      },
      {
        q: "What phases make up a complete care review visit?",
        a: "Preparation (review documentation), implementation (resident conversation, assessment), follow-up (adjust care plan, document outcomes).",
        options: ["An unannounced check conducted by the team leader to assess care quality without prior documentation review","Preparation, implementation with resident, and follow-up with plan adjustment","A family meeting to review the care plan and discuss the resident's needs and wishes","A formal audit conducted by the medical review board as part of the annual quality check"],
        correct: 1,
        fillTemplate: "A care review visit includes ___, implementation with the resident and ___ with plan adjustment.",
        fillAnswers: ["preparation","follow-up"],
      },
      {
        q: "What is the structural model (Strukturmodell) and how does it simplify documentation?",
        a: "The structural model (debureaucratisation) simplifies care documentation: the core is the SIS® (Structured Information Collection), supplemented by an individual action plan and reporting sheet. Fewer forms, more individuality.",
        options: ["A digital care management system that standardises documentation across all German care facilities","Simplified documentation with SIS® as core – fewer forms, more individuality","An advanced version of the classical nursing process with additional mandatory assessment tools","A legal framework defining minimum documentation standards set by the Medical Review Board"],
        correct: 1,
        fillTemplate: "The structural model is based on the ___ (SIS®) and an individual action plan. It reduces ___.",
        fillAnswers: ["Structured Information Collection","documentation burden"],
      },
      {
        q: "What is biography work (Biografiearbeit) in elderly care?",
        a: "Biography work records a resident's life history (origin, profession, preferences, important events, rituals). It forms the basis for individualised, needs-oriented care, especially in dementia.",
        options: ["A therapeutic writing method used to help residents process grief and life transitions","Recording life history as the basis for individualised care","A reminiscence group activity facilitated by social workers for cognitively intact residents","A formal psychological assessment of personality development conducted at admission"],
        correct: 1,
        fillTemplate: "Biography work records the ___ of the resident. It is especially important in ___ and for individualised care.",
        fillAnswers: ["life history","dementia"],
      },
      {
        q: "What is quality assurance in elderly care and what external reviews exist?",
        a: "Quality assurance includes internal measures (care visits, case conferences, care standards) and external checks by the Medical Review Board (MD/MDK), home supervision authority and other bodies. Results are published.",
        options: ["Annual resident satisfaction surveys evaluated by an independent external institute","Internal measures plus external checks by MD/MDK and home supervision","Inspections conducted exclusively by the health department when complaints are received","A voluntary certification process facilities can apply for to demonstrate quality standards"],
        correct: 1,
        fillTemplate: "External quality checks are carried out by the ___ (MD/MDK) and the ___.",
        fillAnswers: ["Medical Review Board","home supervision authority"],
      },
    ],
  },

  "Anatomy & Physiology": {
    color: "#7ca8e8", icon: "🫀",
    questions: [
      {
        q: "What is the main function of the cardiovascular system?",
        a: "Transport of oxygen, nutrients, hormones and waste products throughout the body. The heart acts as a pump driving blood through the circulation.",
        options: ["Regulate body temperature primarily through skin blood vessel dilation and constriction","Transport oxygen and nutrients","Produce hormones and distribute them to target organs throughout the body","Filter metabolic waste from the blood via the hepatic portal system"],
        correct: 1,
        fillTemplate: "The cardiovascular system transports ___, nutrients and waste products. The heart acts as a ___.",
        fillAnswers: ["oxygen","pump"],
      },
      {
        q: "What is the difference between pulse and blood pressure?",
        a: "Pulse = heart rate (normal: 60–80/min). Blood pressure = pressure of blood in vessels (normal: 120/80 mmHg).",
        options: ["Pulse is the pressure wave measured in veins; blood pressure is the rate of ventricular contractions","Pulse = heart rate, blood pressure = pressure in vessels","Pulse measures arterial oxygen saturation; blood pressure measures cardiac output","Blood pressure only measures pressure at the moment of heartbeat; pulse measures both systole and diastole"],
        correct: 1,
        fillTemplate: "Normal pulse is ___ to 80 beats per minute. Normal blood pressure is ___/80 mmHg.",
        fillAnswers: ["60","120"],
      },
      {
        q: "What are the four chambers of the heart and their functions?",
        a: "Right atrium and right ventricle pump deoxygenated blood to the lungs (pulmonary circulation). Left atrium and left ventricle pump oxygenated blood to the body (systemic circulation).",
        options: ["All four chambers pump blood simultaneously into both the systemic and pulmonary circulations","Right side: blood to lungs; Left side: blood to body","The left ventricle pumps deoxygenated blood to the lungs; the right ventricle to the body","The heart has a single pumping chamber divided by the septum into right and left sections"],
        correct: 1,
        fillTemplate: "The right ventricle pumps deoxygenated blood to the ___. The left ventricle pumps oxygenated blood into the ___ circulation.",
        fillAnswers: ["lungs","systemic"],
      },
      {
        q: "Which organs belong to the digestive system?",
        a: "Mouth, oesophagus, stomach, small intestine, large intestine, liver, gallbladder, pancreas, rectum and anus.",
        options: ["Mouth, oesophagus, stomach, intestines, liver and gallbladder – without the pancreas","Mouth, stomach, intestines, liver, pancreas","Mouth, oesophagus, stomach, liver, pancreas – but the large intestine and rectum are not included","Oesophagus, stomach, small intestine and liver only; the large intestine belongs to the urinary system"],
        correct: 1,
        fillTemplate: "The digestive system includes: mouth, ___, stomach, small intestine, large intestine, ___ and pancreas.",
        fillAnswers: ["oesophagus","liver"],
      },
      {
        q: "What are the functions of the kidneys?",
        a: "Filtering blood, excreting urea and waste, regulating fluid balance and blood pressure, producing erythropoietin and renin.",
        options: ["Produce bile salts and digestive enzymes to assist absorption of fats and fat-soluble vitamins","Filter blood, excrete waste, regulate fluid balance","Detoxify medications and metabolic by-products via the hepatic enzyme system","Regulate calcium and phosphate metabolism by activating vitamin D in the skin"],
        correct: 1,
        fillTemplate: "The kidneys filter the ___ and excrete urea. They also regulate the ___ and blood pressure.",
        fillAnswers: ["blood","fluid balance"],
      },
      {
        q: "What is the autonomic (vegetative) nervous system?",
        a: "The part of the nervous system controlling involuntary functions (heartbeat, breathing, digestion). Consists of the sympathetic (activating) and parasympathetic (relaxing) divisions.",
        options: ["The part of the nervous system controlling deliberate movement and sensory processing","The system for involuntary functions (sympathetic/parasympathetic)","The peripheral nervous system conducting sensory impulses from skin and muscles to the brain","The central nervous system consisting of the brain and spinal cord"],
        correct: 1,
        fillTemplate: "The autonomic nervous system controls ___ functions like heartbeat. It consists of the ___ and parasympathetic divisions.",
        fillAnswers: ["involuntary","sympathetic"],
      },
      {
        q: "What is osteoporosis and what are its risk factors?",
        a: "Osteoporosis = bone loss: reduced bone density, increased fracture risk. Risk factors: age, oestrogen deficiency, calcium deficiency, lack of exercise, corticosteroid therapy.",
        options: ["Progressive degeneration of joint cartilage leading to chronic pain and restricted mobility","Bone loss with increased fracture risk; risks: age, oestrogen deficiency, calcium deficiency","Autoimmune inflammation of joints causing swelling, pain and systemic symptoms","Muscle wasting due to reduced physical activity and reduced protein intake in old age"],
        correct: 1,
        fillTemplate: "Osteoporosis means reduced bone ___ with increased fracture risk. Typical risks are age, ___ deficiency and calcium deficiency.",
        fillAnswers: ["density","oestrogen"],
      },
      {
        q: "What are normal vital signs for an adult?",
        a: "Blood pressure: 120/80 mmHg. Pulse: 60–80/min. Respiratory rate: 12–18/min. Body temperature: 36.5–37.4°C. SpO2: >95%.",
        options: ["BP 130/85, Pulse 70–90, RR 16–20/min, Temp 36.8–37.8°C, SpO2 >93%","BP 120/80, Pulse 60–80, RR 12–18/min, Temp 36.5–37.4°C","BP 110/70, Pulse 50–70, RR 10–14/min, Temp 36.0–36.8°C, SpO2 >92%","BP 100/60 is normal resting value; anything higher indicates mild hypertension"],
        correct: 1,
        fillTemplate: "Normal blood pressure: ___/80 mmHg. Normal pulse: 60–___ beats/min. Normal body temperature: 36.5–37.4°C.",
        fillAnswers: ["120","80"],
      },
      {
        q: "What is the difference between an artery and a vein?",
        a: "Arteries carry blood away from the heart (usually oxygenated). Veins carry blood towards the heart (usually deoxygenated). Exception: pulmonary artery/vein.",
        options: ["Arteries carry deoxygenated blood from the tissues back to the heart; veins carry oxygenated blood from the lungs","Arteries carry blood away from heart; veins carry blood towards heart","Arteries carry blood at low pressure; veins carry blood at high pressure driven by the heart's force","Arteries are found only in the thorax and abdomen; veins supply the limbs and peripheral tissues"],
        correct: 1,
        fillTemplate: "___ carry blood away from the heart (usually oxygenated). ___ carry blood towards the heart (usually deoxygenated).",
        fillAnswers: ["Arteries","Veins"],
      },
      {
        q: "What age-related changes affect the musculoskeletal system?",
        a: "Reduced muscle mass (sarcopenia), reduced bone density (osteoporosis), joint wear (osteoarthritis), reduced mobility and balance impairment.",
        options: ["Increased joint flexibility and improved proprioception due to lifelong physical activity","Sarcopenia, osteoporosis, osteoarthritis, reduced mobility","Bone density increases after age 60 as the body compensates by thickening cortical bone","Muscles become more efficient with age due to selective motor unit activation"],
        correct: 1,
        fillTemplate: "With age, muscle mass decreases (___)  and bone density decreases (___). Joint wear (osteoarthritis) is also common.",
        fillAnswers: ["sarcopenia","osteoporosis"],
      },
      {
        q: "What hormones does the pancreas produce and what do they do?",
        a: "Insulin (lowers blood sugar), glucagon (raises blood sugar). Also digestive enzymes (exocrine part). In diabetes mellitus, insulin production is impaired.",
        options: ["Glucagon lowers blood sugar and insulin raises it – opposite to what is commonly believed","Insulin (lowers blood sugar) and glucagon (raises blood sugar)","Insulin and amylase; amylase is the key blood sugar regulator in the endocrine pancreas","Somatostatin and gastrin, which coordinate digestion; insulin is produced by the liver"],
        correct: 1,
        fillTemplate: "The pancreas produces ___ (lowers blood sugar) and glucagon. In diabetes, ___ production is impaired.",
        fillAnswers: ["insulin","insulin"],
      },
      {
        q: "How does breathing work and what is gas exchange?",
        a: "When inhaling, oxygen (O2) from the lungs enters the blood; when exhaling, carbon dioxide (CO2) is released. Gas exchange takes place in the alveoli (lung vesicles).",
        options: ["Oxygen and carbon dioxide are both exchanged simultaneously in the bronchioles during each breath","O2 is inhaled and absorbed into the blood; CO2 is exhaled; gas exchange in the alveoli","Gas exchange occurs in the bronchi, where blood vessels absorb oxygen through the airway walls","O2 travels to cells via the lymphatic system; CO2 is removed by the kidneys and excreted in urine"],
        correct: 1,
        fillTemplate: "When inhaling, ___ (O2) is absorbed into the blood. Gas exchange takes place in the ___.",
        fillAnswers: ["oxygen","alveoli"],
      },
      {
        q: "What is hypertension and when does it require treatment?",
        a: "Hypertension = persistently elevated blood pressure. Treatment required from ≥140/90 mmHg (WHO). Risks: heart attack, stroke, kidney failure. Common in older people.",
        options: ["Elevated blood pressure above 130/85 mmHg requiring immediate treatment and hospitalisation","Persistently elevated BP ≥140/90 mmHg with risks for heart, vessels, kidneys","A temporary blood pressure rise above 160/100 mmHg during physical exertion or stress","Systolic pressure above 180 mmHg only; readings below this are considered normal in older people"],
        correct: 1,
        fillTemplate: "Hypertension means persistently elevated blood pressure from ___ mmHg systolic. Risks include heart attack and ___.",
        fillAnswers: ["140","stroke"],
      },
      {
        q: "What skin changes are typical with ageing?",
        a: "Reduced skin thickness and elasticity, reduced sebum production (dry skin), slower wound healing, increased sensitivity to pressure (pressure ulcer risk), reduced sweating.",
        options: ["Increased skin thickness and collagen density as a natural protective response to ageing","Thinner/less elastic skin, drier, slower healing, increased pressure sensitivity","Skin becomes oilier due to increased sebaceous gland activity in advanced age","Improved wound healing due to thicker dermis and higher concentration of growth factors"],
        correct: 1,
        fillTemplate: "Aged skin is ___ and drier. Wound healing is ___ and pressure ulcer risk increases.",
        fillAnswers: ["thinner","slower"],
      },
      {
        q: "What age-related changes affect digestion?",
        a: "Slower intestinal motility (constipation more common), reduced saliva production, reduced appetite, reduced stomach acid, swallowing difficulties (dysphagia) more frequent.",
        options: ["Increased intestinal motility leading to more frequent bowel movements and looser stools","Slower motility, less saliva, constipation tendency, swallowing difficulties more common","Improved nutrient absorption due to longer food transit time in the small intestine","Increased gastric acid secretion causing higher rates of gastric ulcers in older adults"],
        correct: 1,
        fillTemplate: "With age, intestinal motility slows, favouring ___. ___ (swallowing difficulties) also becomes more common.",
        fillAnswers: ["constipation","Dysphagia"],
      },
      {
        q: "What is incontinence and what types exist?",
        a: "Incontinence = involuntary loss of urine. Types: stress incontinence (coughing, sneezing), urge incontinence (sudden urge), overflow incontinence, mixed incontinence. Common in older age due to weak pelvic floor muscles.",
        options: ["Voluntary but frequent urination caused by urinary tract infections or diuretic medication","Involuntary urine loss; types: stress, urge, overflow, mixed","An age-related condition affecting only women due to pelvic floor weakness after childbirth","Reduced bladder capacity causing frequent but fully controlled urination in older adults"],
        correct: 1,
        fillTemplate: "Incontinence means involuntary ___ loss. A common type in older age is ___ incontinence.",
        fillAnswers: ["urine","stress"],
      },
      {
        q: "What is the difference between systolic and diastolic blood pressure?",
        a: "Systolic = pressure during the heartbeat (contraction) – upper value. Diastolic = pressure during the heart's relaxation phase – lower value. Normal: 120 (systolic) / 80 (diastolic) mmHg.",
        options: ["Systolic is the lower value measured during the resting phase; diastolic is the peak pressure during contraction","Systolic = upper value (heartbeat), diastolic = lower value (relaxation)","Both values reflect cardiac output measured at different times during the respiratory cycle","The diastolic value is more clinically significant as it reflects baseline vascular pressure"],
        correct: 1,
        fillTemplate: "___ blood pressure is the upper value during the heartbeat. ___ blood pressure is the lower value at rest.",
        fillAnswers: ["Systolic","Diastolic"],
      },
      {
        q: "What are the effects of immobility on the body?",
        a: "Muscle wasting (sarcopaenia), increased pressure ulcer risk, thrombosis/embolism risk, pneumonia risk, contractures, constipation, psychological effects (depression), disorientation.",
        options: ["Only muscle wasting and pressure ulcers are relevant; other effects are managed by specialist teams","Muscle wasting, pressure ulcers, thrombosis, pneumonia, contractures, constipation, depression","Physical effects are the only consequences; mental health and cognitive function are unaffected by immobility","Immobility primarily causes cardiac arrhythmias and reduced cardiac output, as the heart works less hard"],
        correct: 1,
        fillTemplate: "Immobility leads to muscle wasting, increased ___ risk and ___ risk. Psychological effects are also possible.",
        fillAnswers: ["pressure ulcer","thrombosis"],
      },
      {
        q: "What is dementia from a neurological perspective?",
        a: "Dementia is a syndrome of progressive decline in cognitive functions (memory, thinking, orientation, language, judgement) due to brain disease or damage. It is not a normal part of ageing. The most common cause is Alzheimer's disease.",
        options: ["An accelerated form of normal cognitive ageing that affects all people beyond age 80","Syndrome of progressive cognitive decline due to brain disease; not normal ageing","A psychiatric disorder caused by social isolation, depression or severe anxiety in older people","A reversible condition resulting from vitamin deficiency, medication side effects or hypothyroidism"],
        correct: 1,
        fillTemplate: "Dementia is a ___ decline in cognitive functions caused by brain ___. It is not a normal part of ageing.",
        fillAnswers: ["progressive","disease"],
      },
    ],
  },

  "Common Conditions": {
    color: "#e87c9a", icon: "🏥",
    questions: [
      {
        q: "What is type 2 diabetes and how does it present?",
        a: "Type 2: insulin resistance and relative insulin deficiency. Symptoms: fatigue, thirst, frequent urination, slow wound healing, visual disturbances. Common with obesity, inactivity, older age.",
        options: ["Absolute insulin deficiency requiring immediate insulin therapy at onset, regardless of age","Insulin resistance; symptoms: fatigue, thirst, frequent urination, slow wound healing","A metabolic syndrome caused by excessive carbohydrate intake that is fully reversible with diet alone","An autoimmune destruction of insulin-producing beta cells, identical in mechanism to type 1 diabetes"],
        correct: 1,
        fillTemplate: "Type 2 diabetes is caused by insulin ___. Typical symptoms are fatigue, ___ and slow wound healing.",
        fillAnswers: ["resistance","thirst"],
      },
      {
        q: "What is hypoglycaemia and how is it treated immediately?",
        a: "Hypoglycaemia = low blood sugar (<70 mg/dl). Symptoms: trembling, sweating, rapid heartbeat, confusion, loss of consciousness. Immediate action: give fast-acting carbohydrates (glucose tablets, juice, cola).",
        options: ["Elevated blood sugar causing dizziness; treated by withholding the next insulin dose","Low blood sugar; immediately give fast-acting carbohydrates (glucose, juice)","Low blood pressure from insulin overdose; treated by positioning flat with legs elevated","Dangerously high blood sugar requiring immediate administration of short-acting insulin"],
        correct: 1,
        fillTemplate: "Hypoglycaemia means low ___. Immediate action: give fast-acting ___ such as glucose tablets.",
        fillAnswers: ["blood sugar","carbohydrates"],
      },
      {
        q: "What is a stroke and what are the warning signs (FAST)?",
        a: "Stroke = sudden loss of brain function due to impaired blood supply or bleeding. FAST: Face (facial drooping), Arms (arm weakness), Speech (speech problems), Time (call emergency immediately).",
        options: ["A cardiac event causing severe chest pain and radiating discomfort to the arm and jaw","Sudden brain function loss; FAST: facial drooping, arm weakness, speech problems, call 999","A hypertensive crisis causing sudden headache, visual disturbances and neck stiffness","A transient ischaemic attack that causes brief symptoms resolving within 24 hours without treatment"],
        correct: 1,
        fillTemplate: "For a stroke, use the FAST test: ___ (face), Arms, Speech and Time – call ___ immediately.",
        fillAnswers: ["Face","emergency services"],
      },
      {
        q: "What is heart failure and what are typical symptoms?",
        a: "Heart failure = pump weakness of the heart. Symptoms: breathlessness (especially on exertion and lying flat), oedema (legs), fatigue, nocturnal urination, cough.",
        options: ["Heart rhythm disturbances causing palpitations and syncope, requiring antiarrhythmic medication","Pump weakness; breathlessness on exertion/lying, leg oedema, fatigue, cough","Coronary artery disease causing angina pectoris but no fluid retention or breathlessness at rest","Hypertensive cardiomyopathy presenting only with elevated blood pressure and occasional headache"],
        correct: 1,
        fillTemplate: "Heart failure is pump weakness of the heart. Typical signs are ___ on exertion, leg ___ and fatigue.",
        fillAnswers: ["breathlessness","oedema"],
      },
      {
        q: "What is Parkinson's disease and what are its cardinal symptoms?",
        a: "Parkinson's = neurodegenerative disease caused by dopamine deficiency. Cardinal symptoms: tremor (resting tremor), rigidity (muscle stiffness), akinesia/hypokinesia (reduced movement), postural instability.",
        options: ["A form of dementia causing progressive memory loss due to cortical Lewy body deposits","Neurodegenerative due to dopamine deficiency; tremor, rigidity, akinesia, balance impairment","A cerebellar disorder causing intention tremor, ataxia and coordination difficulties","A motor neurone disease causing progressive muscle weakness and paralysis"],
        correct: 1,
        fillTemplate: "Parkinson's is caused by ___ deficiency. The four cardinal symptoms are tremor, rigidity, ___ and postural instability.",
        fillAnswers: ["dopamine","akinesia"],
      },
      {
        q: "What is COPD and what are the care considerations?",
        a: "COPD = chronic obstructive pulmonary disease (mostly from smoking). Symptoms: cough, sputum, breathlessness. Care: breathing exercises, upper body elevation, oxygen therapy awareness (do not give high O2).",
        options: ["A reversible obstructive airways disease similar to asthma, fully reversible with bronchodilators","Chronic obstructive lung disease; breathing exercises, upper body elevation, careful with high O2","A restrictive lung disease caused by pulmonary fibrosis, where obstruction is not the primary problem","Chronic bronchial asthma with similar symptoms; high-flow oxygen is always safe in asthma"],
        correct: 1,
        fillTemplate: "COPD is a chronic ___ lung disease. In care, ___ exercises and upper body elevation are important.",
        fillAnswers: ["obstructive","breathing"],
      },
      {
        q: "What are pressure ulcers (decubitus) and how are they graded?",
        a: "Pressure ulcers form from prolonged pressure reducing blood supply. Grades: 1 = non-blanchable redness (skin intact), 2 = superficial skin defect, 3 = deep defect into subcutaneous tissue, 4 = necrosis down to bone/muscle/tendon.",
        options: ["A skin condition classified in 3 grades from superficial to deep, always requiring antibiotic treatment","Tissue damage from pressure; 4 grades from redness (1) to bone-deep necrosis (4)","A wound that only develops in bedridden patients and exclusively affects bony prominences","A skin reaction to moisture from incontinence, classified separately from pressure-related wounds"],
        correct: 1,
        fillTemplate: "Pressure ulcer Grade 1 shows non-blanchable ___. Grade 4 reaches down to ___ or tendons.",
        fillAnswers: ["redness","bone"],
      },
      {
        q: "What is a urinary tract infection (UTI) and how does it present in older people?",
        a: "UTI = infection of the urinary tract (usually E. coli). In older people, often atypical symptoms: confusion, restlessness, falls, reduced appetite. Classic: burning on urination, frequency.",
        options: ["A viral inflammation of the kidney pelvis causing fever and flank pain, treated with antiviral agents","Bacterial infection; in older people often atypical: confusion, restlessness, falls","A fungal infection of the bladder common in elderly women with catheter care","A chronic inflammatory condition of the bladder requiring long-term antibiotic prophylaxis"],
        correct: 1,
        fillTemplate: "In older people, a UTI often causes ___ symptoms like confusion and restlessness rather than the typical ___.",
        fillAnswers: ["atypical","burning"],
      },
      {
        q: "What is Arthritis and how does it differ from Arthrosis?",
        a: "Arthritis = inflammatory joint disease (e.g. rheumatoid arthritis, reactive arthritis), often systemic with warmth, swelling, redness. Arthrosis = non-inflammatory joint wear and tear (degenerative). Both common in older age, different treatment approaches.",
        options: ["Arthritis is degenerative wear through cartilage breakdown; arthrosis is an autoimmune joint inflammation","Arthritis = inflammatory; Arthrosis = degenerative wear; different causes and treatment","Arthritis affects only small hand joints; arthrosis only affects large joints like the knee and hip","Arthrosis typically causes rest pain at night; arthritis causes pain only during physical activity"],
        correct: 1,
        fillTemplate: "Arthritis is ___ joint disease with warmth and swelling. Arthrosis is ___ wear and tear of the joint.",
        fillAnswers: ["inflammatory","degenerative"],
      },
      {
        q: "What is pneumonia in a care context and what are the risk factors?",
        a: "Pneumonia = inflammation of lung tissue (usually bacterial). Care-related risk factors: immobility, swallowing difficulties (aspiration), immobilisation, older age, immunosuppression.",
        options: ["A bronchial inflammation limited to the airways without involvement of the alveoli or lung tissue","Lung tissue inflammation; risks: immobility, swallowing difficulties, immunosuppression","Exclusively a viral infection that only affects immunocompromised residents in intensive care","A reversible obstructive lung condition triggered by allergens or cold air exposure"],
        correct: 1,
        fillTemplate: "Pneumonia is ___ of lung tissue. Care-related risks include immobility and ___ difficulties.",
        fillAnswers: ["inflammation","swallowing"],
      },
      {
        q: "What is a thrombosis and what prophylaxis measures are used?",
        a: "Thrombosis = blood clot in a blood vessel (usually leg vein). Prophylaxis: mobilisation, compression stockings, adequate fluid intake, anticoagulant medication, leg elevation.",
        options: ["Inflammation of a superficial vein causing redness and localised pain, treated with ice packs","Blood clot in a vessel; prophylaxis: mobilisation, compression stockings, fluids","A blockage of a coronary artery caused by atherosclerotic plaque rupture","An arterial clot forming in the left heart chamber, detected by echocardiogram"],
        correct: 1,
        fillTemplate: "Thrombosis is a blood ___ in a vessel. Prophylaxis includes mobilisation and ___ stockings.",
        fillAnswers: ["clot","compression"],
      },
      {
        q: "What is delirium and how does it differ from dementia?",
        a: "Delirium is acute, fluctuating (hours to days), often reversible (caused by infection, medication, dehydration). Dementia is chronic, gradual and progressive. Delirium is more common in people with dementia.",
        options: ["Delirium develops slowly over weeks and is permanent, similar in progression to dementia","Delirium is acute and often reversible; dementia is chronic and gradual","Dementia is the underlying cause of every delirium episode; delirium cannot occur without dementia","Both require identical management: orientation training and minimising sensory stimulation"],
        correct: 1,
        fillTemplate: "Delirium is an ___ confusional state that is often ___. Dementia is chronic and gradual.",
        fillAnswers: ["acute","reversible"],
      },
      {
        q: "What are the typical symptoms of a heart attack?",
        a: "Severe chest pain (crushing), radiating to left arm/jaw/back, breathlessness, nausea, sweating, sense of doom. In women/older people often atypical (upper abdominal pain, nausea).",
        options: ["Sudden tearing chest pain radiating to the back, with equal pulse strength in both arms","Crushing chest pain, radiation, breathlessness, sweating; atypical in women","Intermittent chest tightness triggered by exertion that resolves with rest within 10 minutes","Pleuritic chest pain worsening on deep inspiration, combined with cough and fever"],
        correct: 1,
        fillTemplate: "A heart attack typically causes ___ chest pain and radiation to the left ___. In women, symptoms are often atypical.",
        fillAnswers: ["crushing","arm"],
      },
      {
        q: "What is dysphagia and what care measures are needed?",
        a: "Dysphagia = swallowing disorder (common after stroke, in dementia, Parkinson's). Risk: aspiration. Measures: texture-modified foods/thickened fluids, upright sitting, speech therapy.",
        options: ["Swallowing difficulties primarily after stroke; liquid diets are always safe and require no thickening","Swallowing disorder with aspiration risk; texture modification, upright position, speech therapy","Dysphagia occurs exclusively in neurological conditions such as stroke and Parkinson's disease","Texture modification is only a temporary measure and can be discontinued after speech therapy"],
        correct: 1,
        fillTemplate: "Dysphagia is a ___ disorder with aspiration risk. Care includes ___ of fluids and upright sitting position.",
        fillAnswers: ["swallowing","thickening"],
      },
      {
        q: "What is contracture prophylaxis and why is it important?",
        a: "Contracture prophylaxis prevents permanent shortening of muscles and tendons through regular movement exercises (active and passive), repositioning and physiotherapy.",
        options: ["Prevents muscle atrophy (sarcopenia) through targeted strengthening exercises in bedridden patients","Prevents muscle/tendon shortening through regular movement exercises and repositioning","Treats existing contractures through passive stretching and heat therapy once they develop","Contracture prophylaxis is exclusively the physiotherapist's responsibility and not a nursing task"],
        correct: 1,
        fillTemplate: "Contracture prophylaxis prevents permanent shortening of ___ and tendons through regular ___ exercises.",
        fillAnswers: ["muscles","movement"],
      },
      {
        q: "What is moist wound treatment and why is it preferred?",
        a: "Moist wound treatment keeps the wound bed moist, promotes granulation and epithelialisation, reduces pain and infection risk. Modern dressings (hydrocolloid, alginate) maintain the moist environment.",
        options: ["Wounds heal more reliably when kept dry and exposed to air to prevent bacterial colonisation","Moist treatment promotes healing; modern dressings maintain moist environment","Daily antiseptic irrigation is the gold standard for preventing wound infections in care settings","Saline-soaked gauze changed every 4 hours provides optimal moisture balance for wound healing"],
        correct: 1,
        fillTemplate: "Moist wound treatment promotes ___ and epithelialisation. Modern ___ dressings maintain this environment.",
        fillAnswers: ["granulation","hydrocolloid"],
      },
      {
        q: "What is heart failure and what are its symptoms?",
        a: "Heart failure = the heart cannot pump enough blood. Symptoms: breathlessness on exertion, breathlessness at rest, oedema (ankles, legs), exhaustion, waking at night with breathlessness.",
        options: ["An acute myocardial infarction causing permanent damage to the heart muscle after arterial blockage","Heart weakness with breathlessness, oedema and exhaustion; pumping capacity insufficient","Hypertrophic cardiomyopathy causing thickening of the heart wall and obstruction of blood flow","Chronic coronary artery disease causing stable angina pectoris without fluid retention"],
        correct: 1,
        fillTemplate: "In heart failure the heart's ___ capacity is insufficient. Typical signs are ___ (legs) and breathlessness.",
        fillAnswers: ["pumping","oedema"],
      },
      {
        q: "What is Parkinson's disease and how does it affect care?",
        a: "Parkinson's disease = CNS condition from dopamine deficiency. Symptoms: rigidity (muscle stiffness), tremor (resting tremor), bradykinesia (slowness), postural instability. Care aspects: falls prophylaxis, swallowing difficulties, allow extra time.",
        options: ["A cerebellar disorder causing intention tremor and gait ataxia without any cognitive impairment","CNS condition with rigidity, tremor, bradykinesia; care: falls prophylaxis, allow extra time","Lewy body dementia which presents with cognitive decline and visual hallucinations as primary symptoms","Multiple system atrophy with autonomic failure requiring mainly cardiovascular monitoring in care"],
        correct: 1,
        fillTemplate: "Parkinson's disease leads to rigidity, tremor and ___ due to ___ deficiency. Falls prophylaxis is especially important in care.",
        fillAnswers: ["bradykinesia","dopamine"],
      },
      {
        q: "What is MRSA and how are staff and residents protected?",
        a: "MRSA = methicillin-resistant Staphylococcus aureus – antibiotic-resistant bacteria. Transmission: contact, droplets. Protection: strict contact precautions (gloves, gown, mask), room isolation, individual care equipment, hand disinfection.",
        options: ["Methicillin-sensitive Staphylococcus aureus (MSSA) transmitted by contact like MRSA but treatable with penicillin","Antibiotic-resistant bacteria; protection through contact precautions, isolation, hand disinfection","A pathogen that only colonises wounds and is not transmissible through everyday skin contact","A multi-drug resistant gram-negative bacteria (MRGN) treated with vancomycin like MRSA"],
        correct: 1,
        fillTemplate: "MRSA is ___ resistant bacteria. Protection requires ___ contact precautions and strict hand disinfection.",
        fillAnswers: ["antibiotic","strict"],
      },
    ],
  },

  "Nutrition & Fluids": {
    color: "#7ce8c8", icon: "🍽️",
    questions: [
      {
        q: "What is the daily fluid requirement for an adult?",
        a: "About 30–35 ml per kilogram of body weight, i.e. for 70 kg approximately 2,100–2,450 ml/day. More with fever, heat or increased activity.",
        options: ["25–28 ml/kg body weight, as the requirement decreases in older adults due to reduced thirst sensation","20–25 ml/kg body weight, in line with German Nutrition Society recommendations for elderly","30–35 ml/kg body weight (approx. 2–2.5 l daily)","40–45 ml/kg body weight, since older kidneys need more fluid to excrete waste products"],
        correct: 2,
        fillTemplate: "The daily fluid requirement is ___ ml per kilogram of body weight. For 70 kg this is approximately ___ ml.",
        fillAnswers: ["30–35","2100"],
      },
      {
        q: "What is malnutrition and how is it recognised?",
        a: "Malnutrition = insufficient intake of energy and nutrients. Signs: weight loss, muscle wasting, dry skin, fatigue, weakened immune system. Assessed e.g. with the MNA (Mini Nutritional Assessment).",
        options: ["Exclusive vitamin deficiency without impact on body weight or muscle strength","Insufficient nutrient intake; signs: weight loss, muscle wasting, fatigue","Temporary weight loss during illness that usually resolves on its own","Nutritional deficit detectable only through blood tests"],
        correct: 1,
        fillTemplate: "Malnutrition means insufficient intake of energy and ___. It is assessed with tools like the ___.",
        fillAnswers: ["nutrients","MNA"],
      },
      {
        q: "What are the signs of dehydration in older people?",
        a: "Dry mouth, sunken eyes, reduced urine output (dark colour), confusion, dizziness, constipation, reduced skin elasticity (skin turgor test positive).",
        options: ["Increased urine output with pale urine and moist mucous membranes","Dry mouth, dark urine, confusion, dizziness, reduced skin elasticity","Flushed skin and mildly elevated body temperature due to impaired heat dissipation","Swollen ankles and weight gain caused by fluid retention and oedema formation"],
        correct: 1,
        fillTemplate: "Signs of dehydration include dry mouth, ___ urine, confusion and reduced skin ___.",
        fillAnswers: ["dark","elasticity"],
      },
      {
        q: "What nutrients are particularly important for older people?",
        a: "Proteins (muscle maintenance), calcium and vitamin D (bone protection), fibre (bowel health), B vitamins (nervous system), fluid. Older people often have insufficient protein and vitamin D.",
        options: ["Carbohydrates and fats are sufficient since energy needs decrease with age","Proteins, calcium, vitamin D, fibre, B vitamins and adequate fluid","Only vitamins C and E as the relevant micronutrients in old age","Liquid diet and supplements replace solid meals most effectively"],
        correct: 1,
        fillTemplate: "Older people particularly need ___ for muscle maintenance and calcium plus ___ for bone protection.",
        fillAnswers: ["proteins","vitamin D"],
      },
      {
        q: "What is enteral nutrition and what care considerations apply?",
        a: "Enteral nutrition = nutrient supply via tube (nasogastric, PEG) for people unable to eat orally sufficiently. Care: check tube position, hygiene, control residual volume, monitor aspiration risk.",
        options: ["High-calorie oral nutritional supplements (ONS) taken in small sips to boost intake","Nutrient supply via tube for people unable to eat orally","Texture-modified thickened foods given orally to residents with swallowing difficulties","Parenteral nutrition via a central venous catheter when gastrointestinal function is absent"],
        correct: 1,
        fillTemplate: "Enteral nutrition is delivered via a ___ (e.g. PEG). In care, ___ risk must be closely monitored.",
        fillAnswers: ["tube","aspiration"],
      },
      {
        q: "How should feeding assistance be provided for people with swallowing difficulties?",
        a: "Upper body at least 45–90° upright, use thickened fluids, small bites/sips, no distractions, allow time, monitor for voice changes after swallowing, involve speech therapy.",
        options: ["Thin liquids are easiest to swallow and should always be preferred","Upright position, thickened fluids, small sips, allow time, involve speech therapy","Position the patient at 30° reclined to reduce regurgitation risk","Withhold all oral food until a formal swallowing assessment is completed"],
        correct: 1,
        fillTemplate: "For dysphagia, the upper body should be ___ and ___ fluids used.",
        fillAnswers: ["upright","thickened"],
      },
      {
        q: "What is the BMI and what values are used for adults?",
        a: "BMI = body weight (kg) / height² (m²). Underweight: <18.5. Normal: 18.5–24.9. Overweight: 25–29.9. Obesity: ≥30. Slightly higher values tolerated in people over 65.",
        options: ["Ratio of waist circumference to height (waist-to-height ratio); normal value below 0.5","Weight/height²; normal weight 18.5–24.9; underweight <18.5; obesity ≥30","Percentage of body fat to muscle mass; normal range for older women is 25–35%","A blood-based albumin-to-transferrin ratio used to assess nutritional and metabolic status"],
        correct: 1,
        fillTemplate: "BMI = weight in kg divided by ___ in m². Normal weight is between 18.5 and ___.",
        fillAnswers: ["height²","24.9"],
      },
      {
        q: "What is a nutrition protocol and when is it used?",
        a: "A nutrition protocol documents all meals and fluid amounts (type, amount, time). Used when there is a risk of malnutrition, to monitor intake and plan interventions.",
        options: ["A medical document prescribing dietary restrictions and therapeutic diets","Documents meals and fluids when malnutrition risk is present","A care note recording food allergies and intolerances","A standardised weekly meal plan for balanced nutrition in the facility"],
        correct: 1,
        fillTemplate: "A nutrition protocol documents meals and ___ amounts when there is a ___ risk.",
        fillAnswers: ["fluid","malnutrition"],
      },
      {
        q: "What is aspiration pneumonia and how is it prevented?",
        a: "Aspiration pneumonia occurs when food or fluid enters the lungs. Prevention: upright sitting position during eating, texture modification, swallowing training, remain upright for 30 minutes after eating.",
        options: ["Lung infection caused by oral bacteria due to poor mouth hygiene","Aspiration of food into lungs; prevented by upright position, texture modification","Inflammation of the oesophagus caused by stomach acid reflux","Pneumonia from insufficient fluid intake and mucus build-up"],
        correct: 1,
        fillTemplate: "Aspiration pneumonia is caused by food entering the ___. Prevention: ___ sitting during eating and texture modification.",
        fillAnswers: ["lungs","upright"],
      },
      {
        q: "What special nutritional risks do older people have?",
        a: "Reduced appetite, chewing/swallowing problems, medication side effects, reduced senses (taste/smell), social isolation, depression, reduced mobility for shopping/cooking.",
        options: ["Nutritional needs change very little compared to younger adults","Reduced appetite, chewing/swallowing issues, medication effects, isolation","Increased appetite and higher energy requirements due to medication","Exclusively physical limitations with shopping and cooking"],
        correct: 1,
        fillTemplate: "Nutritional risks in older age include reduced appetite, ___ problems and medication side effects. ___ isolation also plays a role.",
        fillAnswers: ["swallowing","Social"],
      },
      {
        q: "How should assistance with eating be provided to preserve dignity?",
        a: "Preserve dignity and self-determination, create a pleasant atmosphere, respect food preferences, allow sufficient time, activating approach (only help where needed), identify favourite foods.",
        options: ["Complete the meal efficiently to stay within scheduled care time, maintaining a calm atmosphere","Allow time, respect preferences, pleasant atmosphere, activating approach, identify favourite foods","Always take full control of feeding to prevent any risk of choking or aspiration","Focus on meeting nutritional targets; ensure the resident finishes the full portion each meal"],
        correct: 1,
        fillTemplate: "When assisting with eating, the resident's ___ must be preserved. Help should be provided in an ___ way (only where needed).",
        fillAnswers: ["dignity","activating"],
      },
      {
        q: "What vitamins and minerals are commonly deficient in older care-dependent people?",
        a: "Vitamin D (lack of sunlight), vitamin B12 (reduced absorption), folate, calcium, magnesium, iron, zinc. Deficiency from reduced intake, sunlight restriction and medication interactions.",
        options: ["Deficiencies rarely occur in older adults with a varied diet","Vitamin D, B12, calcium, magnesium; from lack of sunlight, reduced absorption, medications","Only vitamin C and iron from dietary habits","Vitamin deficiencies only affect those in full-time residential care"],
        correct: 1,
        fillTemplate: "Older people often lack ___ due to reduced sunlight and ___ due to impaired absorption.",
        fillAnswers: ["vitamin D","vitamin B12"],
      },
      {
        q: "How many meals are recommended per day in elderly care?",
        a: "5–6 meals daily (3 main meals + 2–3 snacks), intervals not longer than 4–6 hours, not longer than 11 hours without food overnight. Promotes blood sugar stability.",
        options: ["3 main meals daily are sufficient; snacks increase the risk of overweight and dental problems","5–6 meals daily, intervals max 4–6 hours, max 11 hours overnight without food","4 meals per day at equal intervals of 5–6 hours provides optimal blood sugar stability","3 main meals daily; the length of the overnight fasting period has no clinical relevance"],
        correct: 1,
        fillTemplate: "___ meals per day are recommended with intervals of maximum ___ hours.",
        fillAnswers: ["5–6","4–6"],
      },
      {
        q: "How is dehydration (exsiccosis) identified and treated?",
        a: "Signs: dry mucous membranes, reduced skin turgor (skin fold remains), confusion, weakness, concentrated urine. Action: document fluid intake, encourage drinking, medical order for infusion if needed.",
        options: ["Increased urine output and moist skin; restrict fluids and monitor blood pressure closely","Dry mucous membranes, reduced skin turgor, confusion; encourage fluid intake, inform doctor","Swollen ankles and elevated blood pressure; elevate legs and administer a diuretic as ordered","Flushed warm skin and increased urine volume; apply cooling measures and reduce salt intake"],
        correct: 1,
        fillTemplate: "Dehydration shows as dry ___ and reduced skin ___. Encourage fluid intake and inform the doctor.",
        fillAnswers: ["mucous membranes","turgor"],
      },
      {
        q: "What should be considered when taking medication with food?",
        a: "Many medications should be taken with enough water (at least 100–200 ml); some not with milk or grapefruit juice. Some medications affect appetite, taste or nutrient absorption.",
        options: ["All medications should be taken with a large glass of milk","With sufficient water; interactions with milk/grapefruit juice; effects on appetite/absorption","Medications should always be taken with meals to prevent stomach upset","Meals always delay absorption and should be avoided when taking medication"],
        correct: 1,
        fillTemplate: "Medications should be taken with at least ___ ml of water. Interactions with ___ or grapefruit juice must be considered.",
        fillAnswers: ["100–200","milk"],
      },
      {
        q: "What is dysphagia and what measures help?",
        a: "Dysphagia = difficulty or pain when swallowing, common in stroke, Parkinson's, dementia. Measures: upper body elevated, thicken fluids, small bites, slow eating, speech therapy, monitor aspiration risk.",
        options: ["Swallowing difficulties only with solid food; liquids are always safe and require no modification","Swallowing difficulties; help: elevate upper body, thicken fluids, speech therapy, slow eating","Painful swallowing caused by oesophageal spasm, diagnosed exclusively by endoscopy","Temporary swallowing discomfort during a sore throat episode, with no aspiration risk"],
        correct: 1,
        fillTemplate: "With dysphagia the upper body should be ___ positioned. Fluids are often ___ and given in small portions.",
        fillAnswers: ["upright","thickened"],
      },
      {
        q: "What are the five main nutrient groups and their functions?",
        a: "Carbohydrates (energy), protein (building/repair), fats (energy, hormone synthesis), vitamins (regulatory functions), minerals/trace elements (bones, nerve function). Water is also essential.",
        options: ["Only macronutrients count; vitamins are synthesised by the body itself","Carbohydrates, protein, fats, vitamins, minerals – each with specific functions","Four groups: carbohydrates, protein, fats and fluids","Six groups including alcohol and caffeine as energy sources"],
        correct: 1,
        fillTemplate: "___ provide energy. ___ are important for building and repairing tissue.",
        fillAnswers: ["Carbohydrates","Protein"],
      },
    ],
  },

  "Emergency Management": {
    color: "#e87c7c", icon: "🚨",
    questions: [
      {
        q: "How long at most should breathing be checked before starting resuscitation?",
        a: "Maximum 10 seconds. If the person is unconscious and not breathing normally → call emergency services immediately and begin chest compressions.",
        options: ["30 seconds to distinguish agonal breathing from normal breathing patterns","60 seconds, applying the look-listen-feel technique at the airway and chest","10 seconds","20 seconds, including a manual pulse check at the carotid artery"],
        correct: 2,
        fillTemplate: "Breathing is checked for a maximum of ___ seconds. For unconsciousness with no breathing → call ___ immediately.",
        fillAnswers: ["10","emergency services"],
      },
      {
        q: "What is the correct technique for chest compressions (CPR)?",
        a: "Compression point: centre of the chest. Depth: 5–6 cm. Rate: 100–120/min. Ratio: 30 compressions : 2 breaths (30:2). Arms straight, transfer force through arms.",
        options: ["Centre of chest, 3–4 cm deep, 80–100/min, 15:2 as used in paediatric resuscitation","Compression point centre of chest, 5–6 cm deep, 100–120/min, 30:2","Centre of chest, 5–6 cm deep, 100–120/min, 15:2 following the older ERC guidelines","Centre of chest, 4–5 cm deep, 100–120/min, 30:2 – depth should be reduced in elderly patients"],
        correct: 1,
        fillTemplate: "CPR: centre of chest, depth ___ cm, rate ___/min, ratio 30:2.",
        fillAnswers: ["5–6","100–120"],
      },
      {
        q: "What does the ABCDE scheme mean in emergency assessment?",
        a: "A = Airway, B = Breathing, C = Circulation, D = Disability (consciousness/neurology), E = Exposure. Systematic first assessment.",
        options: ["Assessment, Blood pressure, Cardiac output, Diagnosis, Emergency plan","Airway, Breathing, Circulation, Disability, Exposure","Alert, Breathing, Cardiovascular, Distress, Extremities","Appearance, Breathing, Colour, Decisiveness, Evaluation"],
        correct: 1,
        fillTemplate: "ABCDE stands for Airway, ___, Circulation, ___ and Exposure.",
        fillAnswers: ["Breathing","Disability"],
      },
      {
        q: "What immediate actions are taken for suspected stroke (FAST)?",
        a: "Call emergency services immediately. Reassure and lay patient down (upper body slightly elevated). Nothing to eat/drink (aspiration risk). Note the time (important for thrombolysis). Do not leave alone.",
        options: ["Administer aspirin, monitor blood pressure every 5 minutes, note time and call the on-call physician","Call emergency services, lay down, nothing to eat/drink, note time, don't leave alone","Give water, apply cooling cloth to the face, reassure the patient and monitor every 10 minutes","Position the patient flat, apply limb massage and monitor closely; call emergency services only if no recovery"],
        correct: 1,
        fillTemplate: "For suspected stroke, call ___ immediately. Give nothing to ___ (aspiration risk).",
        fillAnswers: ["emergency services","eat/drink"],
      },
      {
        q: "How is anaphylaxis recognised and what should be done?",
        a: "Anaphylaxis: sudden allergic reaction. Symptoms: rash/hives, breathlessness, swelling (face/mouth), blood pressure drop, unconsciousness. Immediately: emergency services, stable side position or shock position, remove allergen.",
        options: ["Localised urticaria from food allergy without systemic symptoms; treat with oral antihistamine","Life-threatening reaction: rash, breathlessness, BP drop; call emergency services, side position","An allergic reaction with skin redness and itching; cool the skin and prepare the adrenalin pen","A vasovagal syncope triggered by pain or fright causing brief loss of consciousness"],
        correct: 1,
        fillTemplate: "Anaphylaxis presents with rash, ___ and blood pressure drop. Call ___ immediately.",
        fillAnswers: ["breathlessness","emergency services"],
      },
      {
        q: "What to do after a fall with suspected fracture?",
        a: "Do not move the patient (fracture may worsen). Call emergency services. Reassure, keep warm. Immobilise the affected area (do not realign). Monitor vital signs. Document the fall.",
        options: ["Carefully assist the patient to sit upright to prevent pressure sores from lying on hard floor","Do not move patient, call emergency services, immobilise, monitor vital signs","Gently realign the limb and apply an improvised splint to reduce pain before help arrives","Apply ice packs to reduce swelling and offer pain relief medication from the care trolley"],
        correct: 1,
        fillTemplate: "After a fall with fracture suspicion: do not ___ the patient, call emergency services and ___ the limb.",
        fillAnswers: ["move","immobilise"],
      },
      {
        q: "What should be done for unconsciousness with normal breathing?",
        a: "Recovery position. Call emergency services. Open and maintain airway. Regular breathing checks. Keep warm. Do not leave alone. Never give anything by mouth.",
        options: ["Leave on their back and place a pillow under the head to keep the airway in a neutral position","Recovery position, call emergency services, maintain airway, check breathing","Begin chest compressions since consciousness is lost and circulation may be compromised","Wake the patient by calling their name loudly and applying a sternal rub every 30 seconds"],
        correct: 1,
        fillTemplate: "For unconsciousness with normal breathing: apply ___ position, call ___ and maintain airway.",
        fillAnswers: ["recovery","emergency services"],
      },
      {
        q: "How is hypoglycaemia recognised and how should a carer respond?",
        a: "Symptoms: trembling, sweating, pallor, rapid heartbeat, confusion, hunger. BG <70 mg/dl. Immediately: fast-acting carbohydrates (glucose tablets, sweet juice) if patient can swallow. If unconscious: call emergency services.",
        options: ["Give slow-acting carbohydrates such as bread to prevent rapid blood sugar fluctuation","Give glucose if able to swallow; call emergency services if unconscious","Skip the next insulin dose and bring forward the main meal to stabilise blood glucose","Check blood sugar; only give emergency glucose if the level drops below 50 mg/dl"],
        correct: 1,
        fillTemplate: "For hypoglycaemia (trembling, sweating), immediately give ___ if the patient can swallow. If unconscious, call ___.",
        fillAnswers: ["glucose","emergency services"],
      },
      {
        q: "What measures are taken for a heart attack while waiting for emergency services?",
        a: "Call emergency services immediately. Seat or lay patient (no exertion). Loosen tight clothing. Reassure. Monitor vital signs. Fetch emergency kit/defibrillator. If cardiac arrest: CPR.",
        options: ["Administer an aspirin tablet, check blood pressure and pulse, then call the on-call physician","Call emergency services, seat/lay, loosen clothing, reassure, fetch defibrillator, CPR if needed","Assist the patient to walk slowly to a chair, loosen clothing and offer water to relieve anxiety","Check blood pressure every 5 minutes, note the readings and call emergency services if systolic falls below 90"],
        correct: 1,
        fillTemplate: "For a heart attack: call ___ immediately, ___ the patient and loosen clothing.",
        fillAnswers: ["emergency services","seat/lay"],
      },
      {
        q: "What is an AED and how is it used?",
        a: "AED = Automated External Defibrillator. Detects heart rhythm disturbances and delivers an electric shock. Use: turn on, attach pads (as illustrated), follow voice instructions, make sure everyone stands clear before shock.",
        options: ["A portable cardiac monitor that displays the ECG and alerts staff to abnormal rhythms","Device for treating heart rhythm disturbances; attach pads, follow instructions","A device exclusively operated by emergency physicians that delivers timed synchronised shocks","A defibrillator used only for ventricular tachycardia and requires specialist training to operate"],
        correct: 1,
        fillTemplate: "An AED detects heart ___ and delivers electric shocks. Before the shock, everyone must ___ back.",
        fillAnswers: ["rhythm disturbances","stand"],
      },
      {
        q: "What are the symptoms of pulmonary embolism and how should one respond?",
        a: "Pulmonary embolism: sudden breathlessness, chest pain, coughing blood, rapid heartbeat, impaired consciousness. Usually caused by a blood clot (thrombosis). Immediately: call emergency services, rest, no exertion, upright position.",
        options: ["A gradual worsening of breathlessness over days due to fluid accumulation in the lungs","Sudden breathlessness, chest pain, blood cough; call emergency services, rest, upright","A tension pneumothorax causing tracheal deviation and absent breath sounds on one side","A deep vein thrombosis presenting with leg swelling, warmth and Homan's sign"],
        correct: 1,
        fillTemplate: "Pulmonary embolism causes sudden ___ and chest pain. Call ___ immediately.",
        fillAnswers: ["breathlessness","emergency services"],
      },
      {
        q: "What is the recovery position and when is it used?",
        a: "The recovery position keeps the airway safe in unconscious people who are still breathing. Prevents aspiration of vomit. Application: open airway, roll patient onto side, use upper arm and leg as support.",
        options: ["A semi-recumbent position at 30° used for pneumonia prophylaxis and tube feeding patients","Keeps airway safe in unconscious breathing persons; prevents aspiration","A supine position with elevated legs used to maintain cerebral perfusion in fainting episodes","A positioning technique used during CPR to optimise chest compression depth and recoil"],
        correct: 1,
        fillTemplate: "The recovery position keeps the ___ safe in unconscious persons who are breathing and prevents ___.",
        fillAnswers: ["airway","aspiration"],
      },
      {
        q: "What must be considered during a seizure (epilepsy)?",
        a: "Prevent injury (clear surroundings), do not put anything in the mouth, do not hold down, recovery position after seizure, time the seizure, call emergency services if >5 min or patient does not recover. Stay calm.",
        options: ["Hold the patient's limbs firmly, place a padded object between the teeth and call the physician","Clear surroundings, nothing in mouth, time seizure, recovery position after, call if >5 min","Hold the patient, insert a bite guard between the teeth and give diazepam from the emergency trolley","Restrain the patient gently, keep the head elevated and call emergency services immediately"],
        correct: 1,
        fillTemplate: "During a seizure: clear surroundings, nothing in the ___, ___ the seizure. After: recovery position.",
        fillAnswers: ["mouth","time"],
      },
      {
        q: "What is the shock position and when is it used?",
        a: "Shock position = supine with legs elevated (approx. 30–45°) to improve blood flow to vital organs. Used for: blood pressure drop, circulatory shock (but not cardiogenic shock or pulmonary oedema).",
        options: ["Upper body elevation at 30° to improve cardiac filling and reduce preload in circulatory weakness","Supine with raised legs for circulatory shock (not for cardiac shock/pulmonary oedema)","Recovery position with raised legs to prevent both aspiration and circulatory collapse","Flat supine without leg elevation, since raising the legs impairs respiratory effort"],
        correct: 1,
        fillTemplate: "The shock position means raised ___ in supine. It improves circulation and is used for ___ shock.",
        fillAnswers: ["legs","circulatory"],
      },
      {
        q: "Why is correct reporting when calling emergency services important?",
        a: "5 W Rule: Where is the emergency? What happened? How many casualties? Which injuries/symptoms? Wait for questions. Never hang up before the dispatcher.",
        options: ["Give your facility name and postcode only; the dispatcher will ask follow-up questions","5-W Rule: Where, What, How many, Which injuries, Wait; don't hang up before dispatcher","State the patient's age, care level and current medications as the most important first information","Describe the symptoms first and only give the address if asked by the dispatcher"],
        correct: 1,
        fillTemplate: "When calling emergency services, use the 5-W rule: ___, What, How many, Which injuries, ___.",
        fillAnswers: ["Where","Wait"],
      },
      {
        q: "How is a stroke recognised using the FAST method?",
        a: "F = Face (facial drooping, asymmetric smile), A = Arms (one arm drifts down when raised), S = Speech (slurred or strange speech), T = Time (call emergency services immediately). Every minute counts.",
        options: ["FAST: Fever, Arm pain, Sudden headache, Tingling – indicators of a hypertensive emergency","FAST: Face (drooping), Arms (drifts), Speech (slurred), Time (call immediately)","FAST: Fatigue, Altered consciousness, Sweating, Tachycardia – typical of cardiac events","FAST: Facial pallor, Ataxia, Syncope, Tinnitus – key signs of a posterior circulation stroke"],
        correct: 1,
        fillTemplate: "FAST: Face (___, Arms, Speech (___ speech), Time – call emergency services immediately.",
        fillAnswers: ["drooping)","slurred"],
      },
      {
        q: "What should be done in a diabetic emergency with unconsciousness?",
        a: "If unconscious NEVER give anything by mouth (choking risk). Call emergency services immediately. Recovery position. Monitor vital signs. The paramedic injects glucose or glucagon i.v./s.c.",
        options: ["Dissolve glucose tablets in a small amount of water and administer carefully via teaspoon","Call emergency services immediately, recovery position, nothing by mouth, monitor vital signs","Administer the prescribed insulin dose to counteract potential hyperglycaemia","Apply glucagon nasal spray, which is routinely available in all care facilities"],
        correct: 1,
        fillTemplate: "For unconsciousness due to diabetes: call ___, apply ___ position and give NOTHING by mouth.",
        fillAnswers: ["emergency services","recovery"],
      },
    ],
  },

  "Law & Ethics": {
    color: "#7ce8a8", icon: "⚖️",
    questions: [
      {
        q: "What are the five care levels (Pflegegrade) in Germany?",
        a: "Care level 1 (minor impairment) to care level 5 (most severe impairment with special care needs). Based on the New Assessment Tool (NBA) measuring independence in six areas of life.",
        options: ["3 care stages (mild, moderate, severe) which were replaced in 2017","5 care levels (1 = minor, 5 = most severe); based on the NBA","6 levels including a Level 0 for people with limited everyday competence only","4 levels, as care level 5 is reserved exclusively for people in a persistent vegetative state"],
        correct: 1,
        fillTemplate: "There are ___ care levels from 1 (minor) to 5 (most severe). They are assessed using the ___.",
        fillAnswers: ["5","NBA"],
      },
      {
        q: "What is professional confidentiality in care and when may it be breached?",
        a: "Carers may not share patient data with unauthorised persons (§ 203 StGB). Exceptions: patient's consent, statutory reporting duties (e.g. infectious diseases), imminent danger to third parties.",
        options: ["Confidentiality applies only to external parties; all team members may access all patient data freely","No sharing without consent; exceptions: statutory duties, imminent danger to others","Confidentiality can be waived by family members acting as legal representatives","Confidentiality only protects medical diagnoses, not general care observations or behaviour"],
        correct: 1,
        fillTemplate: "Confidentiality prohibits sharing patient data without ___. Exceptions include statutory duties or ___ danger to others.",
        fillAnswers: ["consent","imminent"],
      },
      {
        q: "What is the Nursing Professions Act (PflBG) and what did it change?",
        a: "The PflBG (2020) unified training for adult nursing, general nursing and children's nursing into a 3-year generalist 'nursing professional' qualification with optional specialisation in the third year.",
        options: ["Regulates the staffing ratios in residential elderly care facilities across all German federal states","Unified 3 nursing training programmes into a generalist 3-year qualification","Established a national pay scale for nurses working in publicly funded care institutions","Defined mandatory continuing education requirements for nursing professionals every 5 years"],
        correct: 1,
        fillTemplate: "The PflBG unified the nursing training programmes into a ___ qualification. Optional ___ is possible in the third year.",
        fillAnswers: ["generalist","specialisation"],
      },
      {
        q: "What are liberty-restricting measures and when are they permitted?",
        a: "Measures restricting freedom of movement (bed rails, restraints, locked doors). Permitted only with court authorisation (guardianship court) or as a short-term emergency measure. Documentation required.",
        options: ["Permitted at any time if the nursing professional documents the clinical justification in the care plan","Only with court authorisation or as an emergency; documentation required","Allowed with the written consent of the resident's family member or power of attorney holder","Permitted under the nursing home contract without additional legal authorisation needed"],
        correct: 1,
        fillTemplate: "Liberty-restricting measures require ___ authorisation or are only permitted as an ___.",
        fillAnswers: ["court","emergency"],
      },
      {
        q: "What is an advance directive and what does it cover?",
        a: "A written advance statement of a person's wishes in case they can no longer decide for themselves. Specifies which medical measures are desired or refused (e.g. no resuscitation, no artificial nutrition).",
        options: ["A legal document assigning financial and property decisions to a trusted family member","Written advance wishes for medical measures when unable to decide","A medical order issued by the physician specifying treatments in the event of incapacity","A formal declaration signed by a notary granting a family member authority to make all decisions"],
        correct: 1,
        fillTemplate: "An advance directive is a ___ statement of medical wishes in case of ___.",
        fillAnswers: ["written","incapacity"],
      },
      {
        q: "What does the principle of autonomy mean in care?",
        a: "Autonomy = right to self-determination. Patients have the right to make their own decisions about their care and treatment, even against the carer's advice. Care should inform and advise.",
        options: ["The right of care professionals to define care goals independently based on clinical evidence","The patient's right to self-determination, even against the carer's advice","The responsibility of family members to make care decisions when the resident is elderly","The principle that physicians have final authority over all care and treatment decisions"],
        correct: 1,
        fillTemplate: "Autonomy means the right to ___. Patients may make decisions themselves; care should support them ___.",
        fillAnswers: ["self-determination","advisorily"],
      },
      {
        q: "What is palliative care and what are its key principles?",
        a: "Palliative care focuses on quality of life, not cure. Symptom control, dignity, psychosocial support, including family. Covers general palliative care, SAAPC (specialised ambulatory), and inpatient hospice care.",
        options: ["Curative treatment aimed at slowing disease progression and extending life expectancy","Quality-of-life focused care: symptom control, dignity, psychosocial support, family involvement","Specialised medical care focused exclusively on pain management through opioid medication","Withdrawal of all active treatment and transition to comfort-only sedation in the final days"],
        correct: 1,
        fillTemplate: "Palliative care focuses on ___, not cure. Symptom control and ___ are central.",
        fillAnswers: ["quality of life","dignity"],
      },
      {
        q: "What documentation obligations does a carer have?",
        a: "Document all care measures, observations, changes in condition, special events, vital signs, medications. Promptly and accurately. No deletions, cross out errors.",
        options: ["Only significant events such as falls, acute illness and family contact require documentation","All measures and observations promptly and accurately; no deletions, cross out errors","Routine care measures are documented in the weekly summary; individual events in the incident report","Vital signs and medications must be documented; subjective observations are optional"],
        correct: 1,
        fillTemplate: "Carers must document all measures and ___ promptly. Errors are ___ out, not deleted.",
        fillAnswers: ["observations","crossed"],
      },
      {
        q: "What is the difference between delegation and independent nursing action?",
        a: "Independent: the nursing professional plans and carries out themselves (e.g. basic care). Delegation: a nursing professional transfers a task to an auxiliary; the delegating person bears instruction responsibility, the executor bears implementation responsibility.",
        options: ["Both refer to tasks initiated by the physician and carried out under their instruction and supervision","Independent: planned and done by professional; delegation: task transferred, responsibility shared","Independent nursing action means any task a care assistant carries out without asking for help","Delegation requires written consent from the resident before any task can be transferred"],
        correct: 1,
        fillTemplate: "In delegation, the delegating person bears ___ responsibility; the person carrying it out bears ___ responsibility.",
        fillAnswers: ["instruction","implementation"],
      },
      {
        q: "What are DNQP expert standards and what do they cover?",
        a: "DNQP (German Network for Quality Development in Nursing) develops evidence-based standards for key nursing topics (e.g. pressure ulcer prevention, falls prevention, pain management). They define minimum requirements for good care.",
        options: ["A government authority that issues legally binding care quality norms under the SGB XI","Evidence-based minimum standards for care topics (e.g. pressure ulcers, falls, pain)","An MDK subunit responsible for reviewing and approving nursing care documentation","A mandatory certification system that all SGB XI-approved care facilities must complete"],
        correct: 1,
        fillTemplate: "DNQP expert standards are ___ minimum requirements for care, e.g. for pressure ulcer and ___ prevention.",
        fillAnswers: ["evidence-based","falls"],
      },
      {
        q: "What is professional communication in care?",
        a: "Active listening, showing empathy, clear understandable language, noting non-verbal communication, no judgements, I-messages, considering cultural differences, maintaining confidentiality.",
        options: ["Using clinical terminology so residents can properly assess the seriousness of the situation","Active listening, empathy, clear language, non-verbal awareness, I-messages","Addressing problems directly and firmly to reach resolution without ambiguity","Maintaining professional distance by keeping emotions out of all care conversations"],
        correct: 1,
        fillTemplate: "Professional communication involves ___ listening, empathy and the use of ___-messages.",
        fillAnswers: ["active","I"],
      },
      {
        q: "What are the principles of ethical decision-making in care?",
        a: "Four principles (Beauchamp & Childress): 1. Autonomy (self-determination), 2. Non-maleficence (do no harm), 3. Beneficence (do good), 4. Justice (fairness/equal treatment).",
        options: ["Safety, efficiency, evidence-based practice and resident satisfaction as core ethical values","Autonomy, non-maleficence, beneficence and justice (Beauchamp & Childress)","Care quality, documentation, team communication and cost-effectiveness as key ethical priorities","Respect, compassion, advocacy and accountability as defined in the nursing code of conduct"],
        correct: 1,
        fillTemplate: "The four ethical principles are autonomy, non-maleficence, ___ and ___.",
        fillAnswers: ["beneficence","justice"],
      },
      {
        q: "What is a power of attorney (Vorsorgevollmacht) and who can issue one?",
        a: "A power of attorney authorises a trusted person to make decisions in defined areas (health, finances, authorities) if the person becomes incapacitated. Any capable adult can issue one.",
        options: ["A document issued by a physician authorising family members to receive medical information","Written authority to a trusted person; any capable adult can issue it","A formal arrangement requiring notarisation and approval by a guardianship court to be valid","A legal document that takes effect immediately upon signing, even if the person remains capable"],
        correct: 1,
        fillTemplate: "A power of attorney authorises a ___ to act when the person becomes incapacitated. Any ___ adult can issue it.",
        fillAnswers: ["trusted person","capable"],
      },
      {
        q: "What is the principle of proportionality in care?",
        a: "Care measures must be proportionate to the care goal. Burdens/risks of a measure must not exceed its benefit. Particularly important at end of life.",
        options: ["The more care measures applied, the better the outcome for the resident regardless of burden","Measures must be proportionate; risks must not exceed benefit; especially important at end of life","Proportionality means all residents receive identical care irrespective of individual needs","Proportionality applies only to medication doses, not to nursing interventions or care planning"],
        correct: 1,
        fillTemplate: "___ of a measure must not exceed its benefit. This is particularly important at the ___.",
        fillAnswers: ["Risks","end of life"],
      },
      {
        q: "What rights do residents have in a care home?",
        a: "Right to dignity and self-determination, individual care, privacy, right to information, right to complain, participation in the residents' council, free choice of doctor/hospital.",
        options: ["Basic care services only; additional rights must be negotiated individually in the care contract","Dignity, self-determination, privacy, information rights, right to complain, residents' council","Rights apply only to legally competent residents; those with legal guardians are represented by their guardian","The right to a single room, personalised meal choices and unrestricted visiting hours at all times"],
        correct: 1,
        fillTemplate: "Residents have a right to ___ and self-determination. Complaints can be raised through the ___ council.",
        fillAnswers: ["dignity","residents'"],
      },
      {
        q: "What is the difference between legal guardianship and a power of attorney?",
        a: "Power of attorney: issued by the person themselves while still capable. Legal guardianship: ordered by a court when no power of attorney exists and a guardian is appointed. The guardian acts in the person's best interests.",
        options: ["Both are identical documents created by a court to protect a person with legal incapacity","Power of attorney issued by self; guardianship ordered by court when no POA exists","A power of attorney is issued by the court proactively to protect vulnerable elderly people","Guardianship and power of attorney both require annual renewal through the guardianship court"],
        correct: 1,
        fillTemplate: "A power of attorney is issued ___ by the person. If none exists, a ___ can appoint a legal guardian.",
        fillAnswers: ["personally","court"],
      },
      {
        q: "What is the principle of informed consent?",
        a: "Informed consent = patients must have received sufficient information before any care or medical procedure and have agreed freely. Consent can be withdrawn at any time. Applies to nursing care as well.",
        options: ["Consent given once at admission covers all subsequent care measures throughout the stay","Patients must be informed and agree freely; consent can be withdrawn at any time","Informed consent is only required for medical procedures; routine care does not require it","Written consent signed by a legal representative is always required before any care measure"],
        correct: 1,
        fillTemplate: "Informed consent requires that patients are sufficiently ___ and agree ___.",
        fillAnswers: ["informed","freely"],
      },
    ],
  },

  "Dementia & Gerontology": {
    color: "#e8d07c", icon: "🧠",
    questions: [
      {
        q: "What are the three most common types of dementia?",
        a: "1. Alzheimer's dementia (60–70%, neurodegenerative). 2. Vascular dementia (due to impaired blood supply). 3. Lewy body dementia (with hallucinations, Parkinson features). Mixed forms possible.",
        options: ["Alzheimer's, Parkinson's dementia and frontotemporal dementia as the primary forms","Alzheimer's, vascular dementia, Lewy body dementia","Alzheimer's, Korsakoff syndrome and senile dementia as independent diagnostic categories","Alzheimer's, multi-infarct dementia and Binswanger's disease as the three main subtypes"],
        correct: 1,
        fillTemplate: "The three most common types of dementia are Alzheimer's, ___ dementia and ___ body dementia.",
        fillAnswers: ["vascular","Lewy"],
      },
      {
        q: "What are typical early signs of Alzheimer's dementia?",
        a: "Short-term memory problems (forgetting conversations, missing appointments), word-finding difficulties, disorientation in new environments, mood changes, withdrawal. Long-term memory initially preserved.",
        options: ["Sudden onset of motor symptoms including tremor, muscle rigidity and balance difficulties","Short-term memory problems, word-finding difficulties, disorientation; long-term memory initially intact","Rapid personality change and behavioural disinhibition as the first and most prominent sign","Episodic visual hallucinations and fluctuating confusion as the earliest distinguishing symptoms"],
        correct: 1,
        fillTemplate: "Early Alzheimer's mainly affects ___ memory. ___ memory is initially still intact.",
        fillAnswers: ["short-term","Long-term"],
      },
      {
        q: "What is Validation (Naomi Feil) and how is it applied?",
        a: "Validation is a communication method for people with dementia. It accepts and affirms feelings and the person's subjective reality without correction. Techniques: eye contact, gentle voice, using the person's own language.",
        options: ["Reality orientation training that gently corrects misperceptions to keep the person grounded in the present","Accepting the subjective reality without correction; engaging on an emotional level","A cognitive stimulation technique using structured memory exercises and recall tasks","A biographical reminiscence approach that focuses on past events rather than current emotional states"],
        correct: 1,
        fillTemplate: "Validation accepts the ___ reality of the person with dementia. The person is never ___, but engaged emotionally.",
        fillAnswers: ["subjective","corrected"],
      },
      {
        q: "What are the principles of person-centred dementia care (Tom Kitwood)?",
        a: "Personhood must be maintained. Five psychological needs: love/belonging, identity, occupation, inclusion/comfort, attachment. Dementia alone does not explain behaviour – care quality influences experience.",
        options: ["Medical management of symptoms is the primary focus; behavioural approaches are secondary","Maintain personhood; five needs: love, identity, occupation, inclusion, attachment","Cognitive training and memory exercises slow the disease and are the core of person-centred care","Structured daily routines and predictability are the single most important aspect of dementia care"],
        correct: 1,
        fillTemplate: "According to Kitwood, five needs are important: love, ___, occupation, inclusion and ___.",
        fillAnswers: ["identity","attachment"],
      },
      {
        q: "How is normal ageing distinguished from dementia?",
        a: "Normal ageing: occasionally forgets details but main event is remembered; daily life manageable. Dementia: entire experiences forgotten; daily activities increasingly impaired; personality changes; no insight into illness.",
        options: ["No clinically meaningful difference; all older adults lose the same amount of memory over time","Normal: main event remembered, life manageable. Dementia: everything forgotten, daily life impaired, personality changes","Normal ageing causes the same cognitive changes as dementia but progresses more slowly","Dementia is characterised by slower thinking, while normal ageing causes complete memory loss"],
        correct: 1,
        fillTemplate: "With normal ageing, the ___ event is remembered. With dementia, entire ___ are forgotten and daily life is impaired.",
        fillAnswers: ["main","experiences"],
      },
      {
        q: "What tests are used for dementia diagnosis?",
        a: "Mini Mental State Examination (MMSE: 30 points, <24 indicates possible dementia). DemTect. MoCA (Montreal Cognitive Assessment). Clock drawing test. These complement medical diagnosis.",
        options: ["Braden Scale and Barthel Index combined provide a validated score for diagnosing dementia","MMSE, DemTect, MoCA, clock test; complement medical diagnosis","The MMSE alone provides a definitive dementia diagnosis when the score is below 20","The Geriatric Depression Scale (GDS) is the standard screening instrument for detecting dementia"],
        correct: 1,
        fillTemplate: "The ___ (MMSE) scores below ___ points may indicate cognitive impairment.",
        fillAnswers: ["Mini Mental State Examination","24"],
      },
      {
        q: "What is 'challenging behaviour' in dementia and how should it be handled?",
        a: "Challenging behaviour: agitation, aggression, wandering, calling out, sleep disturbances. Usually expresses unmet needs, pain or anxiety. Response: identify triggers, meet the need, distraction, calm atmosphere, no confrontation.",
        options: ["Administer as-needed sedation after physician consultation as the first response to agitation","Expression of unmet needs; identify triggers, meet need, calm atmosphere","Use reality orientation training to directly correct confusion and restore orientation","Apply bed rails or a tilt chair as a protective measure until the trigger has been identified"],
        correct: 1,
        fillTemplate: "Challenging behaviour often expresses unmet ___. Find the ___ and meet the need.",
        fillAnswers: ["needs","trigger"],
      },
      {
        q: "What is biographical work in dementia care?",
        a: "Deliberately incorporating a person's life history into their care and activity. Important: profession, hobbies, family, rituals, preferences. Strengthens identity and enables meaningful activities.",
        options: ["A therapeutic writing approach in which the resident writes or dictates their autobiography","Incorporating life history: profession, hobbies, rituals; strengthens identity and enables meaningful activities","A formal psychological assessment of personality and developmental history conducted at admission","A social activity programme where residents share stories with school children and other visitors"],
        correct: 1,
        fillTemplate: "Biographical work incorporates the person's ___ history into care. It strengthens ___ and enables meaningful activities.",
        fillAnswers: ["life","identity"],
      },
      {
        q: "What is sundowning syndrome in dementia?",
        a: "Sundowning = increased confusion, restlessness or agitation in people with dementia in the late afternoon/evening. Causes: disturbed day-night rhythm, fatigue, reduced orientation cues in the dark. Management: structure, light, daytime activities.",
        options: ["A morning phenomenon in which people with dementia wake confused and mistake their surroundings","Increased confusion and restlessness in the evening; structure and lighting help","Rapid eye movement sleep disturbance causing vivid nightmares and nocturnal agitation","A condition in which bright sunlight causes disorientation and should be avoided during the day"],
        correct: 1,
        fillTemplate: "In sundowning syndrome, ___ increases in the evening. Helpful measures are structure and adequate ___.",
        fillAnswers: ["confusion","light"],
      },
      {
        q: "How can fall risk be reduced in people with dementia?",
        a: "Environmental adaptation (non-slip floors, handrails, night lighting), safe footwear, mobility aids available, regular toilet offers, medication review (sedatives!), balance training, regular falls risk assessment.",
        options: ["Use bed rails, seat belts and reclining chairs; restrict all walking to supervised periods only","Environmental adaptation, safe footwear, aids, toilet offers, medication review, balance training","Limit all ambulation to physiotherapy sessions, use a wheelchair at all other times during the day","Prescribe low-dose sedatives to reduce wandering, combined with bed rails and continuous night monitoring"],
        correct: 1,
        fillTemplate: "Falls prevention for dementia includes ___ (e.g. handrails), safe footwear and review of ___ (especially sedatives).",
        fillAnswers: ["environmental adaptation","medications"],
      },
      {
        q: "What is reality orientation training (ROT) and for whom is it suitable?",
        a: "ROT provides structured orientation cues for time, place and person (date, day, weather; orientation boards). Suitable for mild to moderate dementia. In severe dementia it can cause distress and validation is preferable.",
        options: ["An intensive therapy that corrects all misperceptions firmly across all stages of dementia","Orientation cues for time/place/person; suitable for mild dementia; severe dementia: better use Validation","A physical exercise programme that uses spatial orientation tasks to improve balance and coordination","A reminiscence-based approach using photographs from the past to improve long-term memory recall"],
        correct: 1,
        fillTemplate: "ROT provides orientation cues for time, ___ and person. In severe dementia, ___ is more appropriate.",
        fillAnswers: ["place","Validation"],
      },
      {
        q: "What is reminiscence work in elderly care?",
        a: "Reminiscence work = deliberate recollection and sharing from the past. Uses long-term memory (better preserved in dementia). Promotes identity, wellbeing and social interaction using photos, music, objects.",
        options: ["A structured memory training programme using new information and puzzles to maintain cognitive function","Deliberate recollection from the past; uses long-term memory, promotes identity and wellbeing","A forward-looking life planning approach focusing on personal goals and social participation","A cognitive behavioural therapy technique helping residents process negative memories"],
        correct: 1,
        fillTemplate: "Reminiscence work uses ___ memory which is better preserved in dementia. It promotes ___ and wellbeing.",
        fillAnswers: ["long-term","identity"],
      },
      {
        q: "What is important in end-of-life care in elderly residential settings?",
        a: "Dignity and self-determination to the end, pain relief (palliative sedation if needed), considering spiritual/religious needs, involving family, allowing farewell, respecting advance directive.",
        options: ["Maximise interventions, begin artificial nutrition, arrange hospital transfer for intensive monitoring","Dignity, pain relief, spiritual needs, family involvement, respecting advance directive","Transfer to hospital, begin intravenous fluids, initiate monitoring and document every 30 minutes","Apply continuous sedation, reduce sensory stimulation and limit visiting hours to prevent distress"],
        correct: 1,
        fillTemplate: "___ and pain relief are central in end-of-life care. The ___ must be respected.",
        fillAnswers: ["Dignity","advance directive"],
      },
      {
        q: "What are gerontological theories of ageing (activity theory, disengagement theory)?",
        a: "Activity theory: quality of life maintained through active participation. Disengagement theory (outdated): natural withdrawal in old age. Today: individual resources and preferences determine successful ageing.",
        options: ["Continuity theory: older people must maintain the exact same lifestyle as in middle adulthood","Activity theory: participation promotes quality of life; disengagement: withdrawal; today: individual","Selectivity theory: successful ageing requires reducing all activities to conserve energy and avoid stress","Role theory: older people only age successfully when they adopt the social role expected of them"],
        correct: 1,
        fillTemplate: "Activity theory states that active ___ promotes quality of life. Disengagement theory describes natural ___ in old age.",
        fillAnswers: ["participation","withdrawal"],
      },
      {
        q: "What social risks commonly accompany ageing?",
        a: "Loss of partner (grief, loneliness), retirement (role change), reduced mobility, loss of social networks, financial constraints, possible care dependency.",
        options: ["Retirement increases social participation and significantly reduces the risk of loneliness","Loss of partner, role change from retirement, mobility, network loss, financial constraints","Social risks only become clinically relevant from care level 3 onwards","Financial situation improves substantially after retirement due to pension payments and lower expenses"],
        correct: 1,
        fillTemplate: "Typical social risks of ageing include loss of ___, loneliness and reduced ___.",
        fillAnswers: ["partner","mobility"],
      },
      {
        q: "What is milieu-oriented care in dementia?",
        a: "Milieu-oriented care creates a dementia-friendly environment: consistent daily routines, familiar objects from the person's biography, calm atmosphere, clear orientation aids (pictures, colours, names on doors), safety without restriction of liberty.",
        options: ["Frequently changing the environment to provide new stimuli and prevent cognitive decline","Dementia-friendly environment: routines, familiar items, orientation aids, calm, safety","Professionally designed spaces with colour-coded zones and minimal personal belongings","A strict uniform daily schedule without individual exceptions to provide predictability for all residents"],
        correct: 1,
        fillTemplate: "Milieu-oriented care creates a dementia-friendly ___ with orientation aids. ___ objects from the biography provide security.",
        fillAnswers: ["environment","Familiar"],
      },
      {
        q: "How should carers respond to challenging behaviours in dementia in practice?",
        a: "Do not take behaviour personally, understand it as an expression of need. Remain calm, use gentle voice and body language. Offer distraction (activity, music, walk). Avoid restraint and confrontation. Document to identify patterns.",
        options: ["Prescribe sedation after medical consultation as the primary step to reduce injury risk","Remain calm, understand as need expression, offer distraction, avoid confrontation, document","Provide clear verbal correction and calmly repeat the explanation to restore orientation","Use bed rails or a reclining chair as a preventive measure until the case conference meets"],
        correct: 1,
        fillTemplate: "Challenging behaviour should be understood as an expression of ___. Carers should remain ___ and offer distraction.",
        fillAnswers: ["need","calm"],
      },
    ],
  },

  "Prophylaxes": {
    color: "#c8e87c", icon: "🛡️",
    questions: [
      {
        q: "What are the six most important prophylaxes in residential elderly care?",
        a: "Pressure ulcer, falls, contracture, thrombosis, pneumonia and intertrigoprophylaxis. All aim to prevent complications from immobility or care dependency.",
        options: ["Falls and pressure ulcer prophylaxis only, as legally required by care insurance regulations","Pressure ulcer, falls, contracture, thrombosis, pneumonia and intertriго","Pneumonia and thrombosis prophylaxis only, since other measures are the physiotherapist's responsibility","Intertriго, wound care and incontinence management as the three primary nursing prophylaxes"],
        correct: 1,
        fillTemplate: "Key prophylaxes include pressure ulcer, falls, contracture, ___, ___ and intertriго.",
        fillAnswers: ["thrombosis","pneumonia"],
      },
      {
        q: "What does pressure ulcer prophylaxis involve?",
        a: "Measures: regular repositioning (every 2 hours), pressure relief (specialist mattresses), skin inspection, nutrition optimisation, and early mobilisation. Document skin condition.",
        options: ["Pressure-relieving mattress, wound dressing, nutritional supplements and daily physician assessment","Repositioning every 2 hours, pressure relief, skin inspection, nutrition, mobilisation","Repositioning every 4 hours with a pressure mattress; nutrition and mobilisation are not nursing tasks","Skin care, incontinence management and wound documentation as the sole required nursing measures"],
        correct: 1,
        fillTemplate: "Pressure ulcer prophylaxis includes repositioning every ___ hours, pressure ___ and skin inspection.",
        fillAnswers: ["2","relief"],
      },
      {
        q: "What is thrombosis prophylaxis and why is it important?",
        a: "Prevents blood clots in the veins (deep vein thrombosis), which can lead to pulmonary embolism. Measures: movement exercises, compression stockings, adequate fluids, early mobilisation, heparin if medically ordered.",
        options: ["Prevention of arterial plaque formation through diet, exercise and cholesterol medication","Prevents venous clots; measures: exercises, compression stockings, fluids, mobilisation","Prophylaxis of atrial fibrillation to reduce the risk of cardioembolic stroke","Prevention of superficial vein inflammation through leg elevation and warm compresses"],
        correct: 1,
        fillTemplate: "Thrombosis prophylaxis prevents ___ in the veins. Measures include movement exercises, ___ stockings and mobilisation.",
        fillAnswers: ["blood clots","compression"],
      },
      {
        q: "What measures are included in pneumonia prophylaxis?",
        a: "Breathing exercises (deep breathing, pursed lip breathing), regular mobilisation, upper body elevation, inhalations, oral care, adequate fluid intake, physiotherapy.",
        options: ["Pneumococcal vaccination, prophylactic antibiotics, isolation of immobile residents and daily fever monitoring","Breathing exercises, mobilisation, upper body elevation, oral care, fluids","Inhalation as the primary measure; oral care, fluids and breathing exercises are not evidence-based","Oral care and pain management; other measures are exclusively physiotherapy or physician-prescribed"],
        correct: 1,
        fillTemplate: "Pneumonia prophylaxis includes ___ exercises, mobilisation and ___. The upper body should be elevated.",
        fillAnswers: ["breathing","oral care"],
      },
      {
        q: "What is contracture prophylaxis and what does it involve?",
        a: "Preventing permanent shortening of muscles and tendons due to immobility. Measures: regular active and passive joint exercises (physiotherapy), correct positioning in functional position, early mobilisation.",
        options: ["Application of heat pads and muscle-relaxing ointments to maintain joint flexibility","Active and passive joint exercises, correct positioning, early mobilisation","Immobilising affected joints with splints to protect shortened muscles from further damage","Contracture prophylaxis is exclusively the physiotherapist's responsibility and not a nursing task"],
        correct: 1,
        fillTemplate: "Contracture prophylaxis includes ___ and passive movement exercises. Correct ___ in functional position is essential.",
        fillAnswers: ["active","positioning"],
      },
      {
        q: "What is intertrigoprophylaxis and which body areas are at risk?",
        a: "Intertriго = skin irritation in skin folds from moisture and friction. At-risk areas: groins, under breasts, armpits, between toes. Prevention: keep skin folds dry, breathable clothing, zinc paste/skin protection, daily inspection.",
        options: ["Exclusively the sacrum and heels, which are the most common pressure ulcer sites","Skin folds (groins, under breasts, armpits); keep dry, use protection products, daily inspection","Only the feet and between the toes, where friction during walking causes skin damage","The abdomen and lower back, where incontinence pads cause the most skin moisture"],
        correct: 1,
        fillTemplate: "Intertriго develops in ___ from moisture and friction. Prevention: keep ___ and inspect daily.",
        fillAnswers: ["skin folds","dry"],
      },
      {
        q: "What are the three risk areas of falls prophylaxis?",
        a: "Person-related factors (balance, strength, vision, medications), environment-related factors (tripping hazards, poor lighting, wet floors), activity-related factors (getting up without help, unsuitable footwear).",
        options: ["Cognitive impairment only, which is the single strongest predictor of fall risk in elderly care","Person-related (balance, meds), environment-related (tripping), activity-related (getting up)","Environmental hazards only, since physical risk factors are addressed by physiotherapy","Medication side effects exclusively, since all other factors are outside the care team's control"],
        correct: 1,
        fillTemplate: "Falls risk factors include person-related (e.g. ___ and medication), environment-related and ___ factors.",
        fillAnswers: ["balance","activity-related"],
      },
      {
        q: "What is a falls assessment and which tools are used?",
        a: "A falls assessment systematically measures fall risk. Common tools: Morse Fall Scale (0–125 points), Hendrich II Fall Risk Model, internal assessment forms. Result: risk category and individual action plan.",
        options: ["A single assessment at admission is sufficient since fall risk rarely changes in stable residents","Systematic risk measurement; Morse Scale, Hendrich II; result is risk category and action plan","The Braden Scale serves as the primary falls risk instrument since it covers all relevant factors","Clinical judgement by an experienced nurse is sufficient without needing a standardised scale"],
        correct: 1,
        fillTemplate: "Falls assessment measures ___ systematically. Commonly used tools include the ___ Scale and Hendrich II.",
        fillAnswers: ["fall risk","Morse"],
      },
      {
        q: "What is the DNQP and which expert standards are especially relevant?",
        a: "DNQP = German Network for Quality Development in Nursing. Develops evidence-based expert standards. Relevant standards: pressure ulcer prevention, falls prevention, pain management, continence promotion, care for people with dementia.",
        options: ["A government regulatory body that conducts inspections of residential care facilities","Network for nursing standards; standards include pressure ulcer, falls, pain, dementia care","A professional registration body responsible for licensing nursing professionals in Germany","A research institute publishing clinical trials on medication safety in elderly patients"],
        correct: 1,
        fillTemplate: "DNQP stands for German Network for Quality Development in ___. It develops ___ expert standards.",
        fillAnswers: ["Nursing","evidence-based"],
      },
      {
        q: "What are anti-decubitus (pressure-relieving) mattresses and when are they used?",
        a: "Specialist mattresses using air chambers (alternating pressure) or foam cores (soft positioning) to distribute contact pressure. Used when there is elevated pressure ulcer risk (Braden <18) as a supplement to repositioning.",
        options: ["A standard high-density foam mattress that provides adequate support for all residents","Specialist mattress for pressure distribution; used with elevated risk as supplement to repositioning","A therapeutic mattress that replaces repositioning schedules for residents with high pressure ulcer risk","A heated mattress used to improve circulation in residents with peripheral arterial disease"],
        correct: 1,
        fillTemplate: "Anti-decubitus mattresses distribute ___ pressure. They ___ repositioning but do not replace it.",
        fillAnswers: ["contact","supplement"],
      },
      {
        q: "What is fluid balance monitoring and when is it used in care?",
        a: "Fluid balance = recording intake (drinking, infusions, tube feeding) and output (urine, vomiting, drainage). Goal: detect over- or underhydration early. Used for: heart failure, renal insufficiency, dehydration risk.",
        options: ["Daily weighing of the resident, which is the only reliable indicator of fluid retention","Recording intake and output; detects over-/underhydration; used for heart/renal failure","A protocol that records only urine output to monitor kidney function in catheterised residents","Measurement of blood electrolytes to assess fluid status, conducted by the physician on request"],
        correct: 1,
        fillTemplate: "Fluid balance records ___ (drinking, infusions) and ___ (urine). It detects dehydration early.",
        fillAnswers: ["intake","output"],
      },
      {
        q: "What is compression therapy and what care points apply?",
        a: "Compression stockings apply pressure to the legs to promote venous return. Used for thrombosis and oedema prevention. Points: correct size, apply in the morning before getting up, check for pressure sores, contraindicated in arterial disease.",
        options: ["Improving arterial blood flow by exerting steady pressure on the superficial leg veins","Pressure on veins → venous return; apply in morning, correct size, contraindicated in arterial disease","Apply in the evening before bed and remove in the morning after getting up","Compression stockings are indicated for all forms of heart failure without restriction"],
        correct: 1,
        fillTemplate: "Compression stockings promote ___ return. They should be applied in the ___ before getting up.",
        fillAnswers: ["venous","morning"],
      },
      {
        q: "What is nutritional screening and when is it used in care?",
        a: "Nutritional screening = brief assessment of malnutrition risk. Tools: MNA-SF (Mini Nutritional Assessment Short Form) or NRS-2002. Applied on admission and regularly for at-risk groups (weight loss, reduced appetite).",
        options: ["A full nutritional assessment with blood tests, conducted by a dietitian on physician referral","Brief malnutrition risk assessment; MNA-SF or NRS-2002; on admission and regularly","A one-time assessment completed at admission, which remains valid for the entire care stay","A three-day dietary recall conducted monthly to calculate caloric and protein intake"],
        correct: 1,
        fillTemplate: "Nutritional screening assesses ___ risk. The ___ (MNA-SF) is commonly used on admission.",
        fillAnswers: ["malnutrition","Mini Nutritional Assessment"],
      },
      {
        q: "How does oral care link to pneumonia prophylaxis?",
        a: "Regular oral care removes bacteria (streptococci, gram-negative organisms) that can be aspirated and cause pneumonia. Especially important for tube-fed patients. At least twice daily: clean teeth/dentures, moist mucous membranes, check for thrush.",
        options: ["Oral care primarily prevents dental caries and has no clinically relevant effect on pneumonia risk","Oral care removes bacteria that could be aspirated; twice daily, clean dentures, moist membranes","Antiseptic mouthwash twice daily is the most effective oral care measure for pneumonia prevention","Oral care only reduces pneumonia risk in ventilated patients; it is not relevant in residential care"],
        correct: 1,
        fillTemplate: "Oral care removes ___ that could be aspirated. It should be done ___ daily.",
        fillAnswers: ["bacteria","twice"],
      },
      {
        q: "What is a repositioning plan and what does it contain?",
        a: "An individual repositioning plan for bedridden residents specifying: frequency (usually every 2 hours), types of position (supine, lateral, prone, 30° tilt, foam positioning), responsible person. Each repositioning is documented.",
        options: ["A standard repositioning schedule for all bedridden residents; individual adaptation only on physician instruction","Individual plan: frequency (2 hours), position types, responsible person, documentation","A physician's order for repositioning; nursing documentation of each position change is not required","An anti-decubitus mattress allows repositioning intervals to be extended to every 4 hours"],
        correct: 1,
        fillTemplate: "A repositioning plan specifies ___ (every 2 hours) and ___ of positions. Each repositioning is documented.",
        fillAnswers: ["frequency","types"],
      },
      {
        q: "What is the pursed-lip technique and how does it help in pneumonia prophylaxis?",
        a: "Pursed-lip breathing = breathing technique: exhale slowly through slightly open lips. Slows exhalation, increases airway pressure and prevents small bronchi from collapsing. Used for bedridden patients and those with COPD.",
        options: ["A breathing exercise in which air is forcefully inhaled through pursed lips to strengthen diaphragm muscles","Exhale through slightly open lips; prevents bronchial collapse in bedridden patients","A technique in which the patient breathes rapidly through the nose to clear mucus from the airways","A respiratory technique in which air is held briefly before exhalation to improve oxygen uptake"],
        correct: 1,
        fillTemplate: "With pursed-lip breathing, air is exhaled through slightly ___ lips. It prevents the ___ of small bronchi.",
        fillAnswers: ["open","collapse"],
      },
      {
        q: "What evidence-based measures does the DNQP expert standard for pressure ulcer prevention include?",
        a: "Risk assessment (Braden Scale), repositioning and micro-positioning, pressure-relieving aids, skin care and inspection, nutrition optimisation, mobilisation, training of staff and relatives. Documentation of all measures.",
        options: ["Pressure-relieving mattresses only; the standard states all other measures are physician-ordered","Risk assessment, repositioning, aids, skin care, nutrition, mobilisation, training, documentation","Risk assessment and repositioning only; nutrition and mobilisation are addressed in separate standards","Standard dressings and wound care for existing pressure ulcers as the primary preventive action"],
        correct: 1,
        fillTemplate: "The DNQP pressure ulcer standard includes risk assessment with the ___ Scale, repositioning, pressure relief and ___.",
        fillAnswers: ["Braden","skin care"],
      },
      {
        q: "What is stimulating back massage (Atemstimulierende Einreibung / ASE) as a nursing measure?",
        a: "ASE = a nursing method: rhythmic back massage to deepen breathing, promote relaxation and mobilise secretions. Stimulates the respiratory muscles and supports spontaneous breathing. Especially for immobile, ventilated or comatose patients.",
        options: ["A superficial Swedish massage technique applied to reduce muscle tension and promote relaxation","Rhythmic back massage to deepen breathing and mobilise secretions; for immobile patients","A vigorous chest percussion technique used to break up consolidated mucus in pneumonia","A passive stretching technique that mimics active breathing movements in paralysed patients"],
        correct: 1,
        fillTemplate: "ASE is a rhythmic ___ of the back. It promotes ___ and mobilises secretions.",
        fillAnswers: ["massage","deep breathing"],
      },
    ],
  },

  "Professional Role & Teamwork": {
    color: "#7cc8e8", icon: "👥",
    questions: [
      {
        q: "What is the difference between implementation responsibility and steering responsibility?",
        a: "Implementation responsibility: nursing assistants carry out measures independently. Steering responsibility: the qualified nurse plans, monitors and steers the care. In stable care situations nursing assistants can act independently.",
        options: ["Both terms describe the same form of accountability shared equally between assistant and qualified nurse","Implementation: assistant carries out; steering: nurse plans and monitors","Implementation responsibility belongs to the physician who ordered the care measure","Steering responsibility means the assistant checks their own work; no qualified oversight is needed"],
        correct: 1,
        fillTemplate: "Nursing assistants hold ___ responsibility for their actions. The qualified nurse holds ___ responsibility.",
        fillAnswers: ["implementation","steering"],
      },
      {
        q: "What is delegation and what conditions must be met?",
        a: "Delegation = transfer of a medical or nursing task to another professional. Conditions: the delegating person ensures the recipient is qualified; instruction responsibility stays with the delegator; the recipient carries implementation responsibility.",
        options: ["Any task can be delegated freely as long as the delegating person is present in the building","Task transfer when recipient is qualified; instruction responsibility stays with delegator","Delegation transfers all responsibility to the recipient; the delegating person is no longer accountable","The recipient bears both instruction and implementation responsibility once a task is accepted"],
        correct: 1,
        fillTemplate: "In delegation, the ___ responsibility stays with the delegator. The person carrying it out holds ___ responsibility.",
        fillAnswers: ["instruction","implementation"],
      },
      {
        q: "What tasks may a nursing assistant NOT carry out independently?",
        a: "Reserved nursing professional tasks: creating care plans/assessments, making nursing diagnoses, independent medication administration (medical delegation required), intravenous injections, complex high-risk care. Assistants only in stable care situations.",
        options: ["Nursing assistants may carry out all tasks that a qualified nurse has demonstrated to them at least once","No care plans, no nursing diagnoses, no independent medication without delegation","Body care and repositioning may only be carried out by qualified nursing professionals","All care tasks require a written physician's order before a nursing assistant may carry them out"],
        correct: 1,
        fillTemplate: "Nursing assistants may not create ___ and may not administer medication without ___.",
        fillAnswers: ["care plans","delegation"],
      },
      {
        q: "What is professional self-reflection and why is it important in care?",
        a: "Professional self-reflection = critical examination of one's own actions, attitudes, emotions and errors. Important for: quality assurance, burnout prevention, professional growth, recognising one's own limits.",
        options: ["A performance review conducted by the team leader to evaluate individual competencies","Critical examination of own actions; promotes quality, prevents burnout, recognises limits","A formal appraisal process comparing individual performance against facility standards","The process of comparing one's approach against a colleague's to identify best practice"],
        correct: 1,
        fillTemplate: "Professional self-reflection critically examines one's own ___. It helps to recognise one's own ___ and prevent burnout.",
        fillAnswers: ["actions","limits"],
      },
      {
        q: "What is a case conference and what is its purpose?",
        a: "Interdisciplinary discussion about a resident (nursing, doctor, therapists, social work). Purpose: jointly analyse care situation, coordinate measures, individualise care, use resources. Held regularly or when problems arise.",
        options: ["A monthly general team briefing covering operational topics without reference to individual residents","Interdisciplinary case analysis for coordinating measures and individualising care","An exclusive nursing-physician discussion about medication and medical treatment decisions","A meeting where the care manager reviews problem cases without involving hands-on care staff"],
        correct: 1,
        fillTemplate: "A case conference is an ___ discussion about a resident. It aims to coordinate ___ and individualise care.",
        fillAnswers: ["interdisciplinary","measures"],
      },
      {
        q: "What is a nursing handover and what must it include?",
        a: "Nursing handover = systematic transfer of care-relevant information at shift change. Content: resident condition, special events, completed and outstanding measures, orders, changes. Can be verbal, written or via handover protocol.",
        options: ["A verbal summary of completed care tasks without reference to current resident condition or changes","Systematic transfer: resident condition, events, measures, orders, changes","Handover is limited to extraordinary events and new admissions during the shift","A written record of vital signs passed to the next shift without verbal discussion"],
        correct: 1,
        fillTemplate: "The nursing handover reports on ___ condition, special events and ___ measures.",
        fillAnswers: ["resident","outstanding"],
      },
      {
        q: "What are nursing care standards and what function do they serve?",
        a: "Nursing standards describe binding minimum quality requirements for care measures (e.g. standard for pressure ulcer prophylaxis, falls, tube feeding). Based on expert standards (DNQP), nursing science and legal requirements. Legally relevant.",
        options: ["Internal guidelines created by the care management without scientific basis or legal relevance","Binding minimum quality requirements; based on expert standards, science and law; legally relevant","Advisory recommendations from the MDK that can be individually adapted to resident preferences","Voluntary quality targets used for external marketing and performance comparison between facilities"],
        correct: 1,
        fillTemplate: "Nursing standards describe ___ minimum requirements. They are based on ___ (DNQP) and are legally relevant.",
        fillAnswers: ["binding","expert standards"],
      },
      {
        q: "What is burnout in nursing and what factors contribute to it?",
        a: "Burnout = state of emotional, mental and physical exhaustion from chronic work stress. Risk factors: high workload, shift work, emotional burden (death, suffering), lack of recognition, insufficient recovery time.",
        options: ["Short-term fatigue following a stressful week that fully resolves during a weekend off","Exhaustion from chronic stress; risks: workload, shifts, emotional burden, lack of recognition","Acute stress reaction after a single traumatic event at work, distinct from long-term burnout","Clinical depression with physical symptoms that exclusively affects personal life outside work"],
        correct: 1,
        fillTemplate: "Burnout is exhaustion from chronic ___. Risk factors include high workload and lack of ___.",
        fillAnswers: ["work stress","recognition"],
      },
      {
        q: "What is professional communication with difficult residents or relatives?",
        a: "Professional communication in conflict: stay calm, listen actively, show empathy, state own limits clearly (I-messages), no blame, avoid escalation, involve superiors if needed.",
        options: ["Fully comply with relative demands, document the conversation and report to the manager afterwards","Stay calm, active listening, empathy, I-messages, set limits, involve superiors if needed","Document all demands in writing, involve a witness and escalate to management without attempting resolution","Use direct you-messages, state the unacceptable behaviour clearly and end the conversation if needed"],
        correct: 1,
        fillTemplate: "In difficult conversations, ___ listening and ___ messages help express feelings clearly.",
        fillAnswers: ["active","I"],
      },
      {
        q: "What does observing, perceiving and assessing mean in nursing?",
        a: "Observing = systematic perception using all senses (skin, breathing, behaviour, urine, wounds). Assessing = determining if findings are normal or abnormal. Document and inform qualified nurse if needed. Basis for nursing decisions.",
        options: ["Subjective gut-feeling assessment of general wellbeing without any systematic approach","Systematic perception using all senses, assessment (normal/abnormal), documentation, inform nurse","Measuring vital signs and documenting them, since other observations are too subjective to be reliable","Findings are noted at the next care planning review rather than reported immediately"],
        correct: 1,
        fillTemplate: "Nursing observation uses all ___ of the body. Abnormal findings are ___ and reported to the qualified nurse.",
        fillAnswers: ["senses","documented"],
      },
      {
        q: "What is confidentiality within the workplace (internal and external)?",
        a: "Internal: only pass on information that is necessary for care – not to colleagues without care relevance. External: no discussion of residents/patients outside the facility (family, friends). Data protection (GDPR) also applies to care documentation.",
        options: ["Internal confidentiality only applies to visitors; all team members may share all resident information freely","Internal: only care-relevant info; external: no conversations about residents outside; GDPR applies","Resident data may be shared with relatives acting as legal representatives without restriction","Confidentiality applies only to medical diagnoses, not to general care observations or behaviour"],
        correct: 1,
        fillTemplate: "Internally, only ___ relevant information should be shared. Externally, ___ about residents outside the facility is prohibited.",
        fillAnswers: ["care","discussion"],
      },
      {
        q: "What is interdisciplinary cooperation in elderly care?",
        a: "Cooperation of all professionals involved: nursing, doctors, physiotherapists, occupational therapists, speech therapists, social workers, pastoral care. Goal: holistic care. Coordinated by the qualified nurse.",
        options: ["Cooperation of nursing professionals and physicians under coordination of the medical services","All professions (nursing, doctors, therapies, social work, pastoral) for holistic care","Cooperation between nursing and therapists, with physicians acting independently and in parallel","Cooperation within the nursing team between qualified nurses and assistants"],
        correct: 1,
        fillTemplate: "Interdisciplinary cooperation includes ___, doctors, therapists and social workers. The goal is ___ care.",
        fillAnswers: ["nursing","holistic"],
      },
      {
        q: "What is peer consultation (kollegiale Beratung) and supervision?",
        a: "Peer consultation: structured discussion among colleagues to find solutions to professional problems, without an external facilitator. Supervision: professionally guided reflection on work with an external supervisor. Both promote quality and health.",
        options: ["Peer consultation is led by an external supervisor; supervision is an informal discussion among colleagues","Peer: among colleagues; supervision: with external professional; both promote reflection and quality","Supervision is a compulsory monthly performance review conducted by the care manager","Peer consultation and supervision are legally required and must be documented in the care plan"],
        correct: 1,
        fillTemplate: "Peer consultation takes place ___ an external professional. In supervision, an ___ expert leads.",
        fillAnswers: ["without","external"],
      },
      {
        q: "What is a care home's nursing philosophy (Pflegeleitbild)?",
        a: "The nursing philosophy describes the core values, goals and view of the person that underlies a care facility (e.g. dignity, autonomy, activation). It guides daily actions and is the basis for quality standards.",
        options: ["The organisational chart showing staff hierarchies, responsibilities and job descriptions","Core values, view of person and goals of the facility; guides daily actions and quality standards","The quality handbook containing specific care procedures and operational instructions","The legally required concept for implementing the Nursing Professions Act in the facility"],
        correct: 1,
        fillTemplate: "The nursing philosophy describes ___ values and the ___ of the person. It guides daily actions.",
        fillAnswers: ["core","view"],
      },
      {
        q: "What does teamwork mean in elderly care and what are its prerequisites?",
        a: "Good teamwork: open communication, clear task distribution, mutual respect, constructive error management, shared goals. Prerequisites: regular team meetings, handovers, collegiality.",
        options: ["Each team member works independently for assigned residents, reporting directly to management only","Open communication, clear roles, respect, constructive error management, shared goals","Teamwork primarily means dividing tasks equally by duty schedule and documenting individual outputs","Hierarchical structures, clear chains of command and formal written communication between team members"],
        correct: 1,
        fillTemplate: "Good teamwork requires open ___ and clear ___. Regular team meetings are important.",
        fillAnswers: ["communication","task distribution"],
      },
      {
        q: "What are 'reserved activities' (Vorbehaltsaufgaben) under the German Nursing Professions Act?",
        a: "Reserved activities may only be carried out independently by qualified nursing professionals (not nursing assistants): nursing assessment and care planning, evaluation of care, instruction and counselling of those in care. Protects patient safety.",
        options: ["Any task that a qualified nurse has demonstrated to an assistant at least twice is no longer reserved","Assessment, planning and evaluation may only be done independently by qualified nurses","Medical procedures such as i.v. injections, which are reserved for physicians and cannot be delegated","All care tasks including basic body care are reserved activities requiring a qualified nurse"],
        correct: 1,
        fillTemplate: "Reserved activities include nursing assessment, care ___ and evaluation. Only ___ professionals may do these independently.",
        fillAnswers: ["planning","qualified nursing"],
      },
      {
        q: "What is resilience in nursing and how can it be strengthened?",
        a: "Resilience = psychological resistance to stress and crisis. Important in nursing due to heavy demands (death, shift work, understaffing). Strengthened through: breaks, social support, self-reflection, exercise, supervision.",
        options: ["Emotional distancing from residents, reducing care involvement and requesting routine administrative shifts","Psychological resistance to stress; strengthened by breaks, social support, self-reflection, supervision","The ability to suppress stress through distraction, keeping a positive attitude and avoiding reflection","A fixed personality trait shaped by childhood; not changeable through training or professional development"],
        correct: 1,
        fillTemplate: "Resilience is the psychological ___ to stress. It can be strengthened through breaks, ___ and supervision.",
        fillAnswers: ["resistance","social support"],
      },
      {
        q: "What is an induction plan and why is it important in nursing?",
        a: "An induction plan = structured plan to introduce new staff to tasks, processes and the culture of a facility. Important for: safety for beginners, error prevention, quality assurance, team integration.",
        options: ["A checklist of house rules and hygiene regulations that new staff sign on their first day","Structured introduction plan for new staff; ensures quality and prevents errors","The probationary period appraisal form used to decide about continued employment","An introductory conversation on the first day to present the facility and introduce colleagues"],
        correct: 1,
        fillTemplate: "An induction plan is a structured plan for introducing ___ staff. It ensures ___ and helps prevent errors.",
        fillAnswers: ["new","quality"],
      },
    ],
  },
};

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// Weighted random sampling without replacement — harder questions (more wrong answers) get higher weight.
function weightedSample(pool, n, qDiff) {
  const items = pool.map(q => {
    const k = `${q._tIdx}_${q._qIdx}`;
    const s = (qDiff || {})[k];
    let w;
    if (!s || s.seen === 0) w = 1.5; // unseen: slightly above average to encourage exploration
    else w = 0.4 + 1.6 * ((s.seen - s.correct) / s.seen); // range 0.4 (all correct) → 2.0 (all wrong)
    return { q, w };
  });
  const result = [];
  for (let i = 0; i < Math.min(n, items.length); i++) {
    const total = items.reduce((a, b) => a + b.w, 0);
    let r = Math.random() * total;
    let idx = 0;
    while (idx < items.length - 1 && r > items[idx].w) { r -= items[idx].w; idx++; }
    result.push(items[idx].q);
    items.splice(idx, 1);
  }
  return result;
}

// Randomly reorder a question's options, storing the permutation so it can be
// re-applied when the language switches (keeps the same visual order).
function shuffleOptions(q) {
  const perm = shuffle(Array.from({ length: q.options.length }, (_, i) => i));
  return { ...q, options: perm.map(i => q.options[i]), correct: perm.indexOf(q.correct), _perm: perm };
}

// Re-apply a stored permutation to a freshly-translated question.
function applyPerm(raw, perm) {
  return { ...raw, options: perm.map(i => raw.options[i]), correct: perm.indexOf(raw.correct), _perm: perm };
}

function norm(s) { return (s||"").trim().toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss"); }

function FillTemplate({ template, answers, userInputs, setUserInputs, revealed }) {
  const inputRefs = useRef([]);
  const parts = template.split("___");
  return (
    <div style={{ fontSize: "17px", lineHeight: "2.4", fontFamily: "Georgia, serif" }}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < answers.length && (revealed ? (
            <span style={{
              display: "inline-block", margin: "0 4px",
              background: norm(userInputs[i]) === norm(answers[i]) ? "rgba(76,200,100,0.2)" : "rgba(220,80,80,0.2)",
              border: `1.5px solid ${norm(userInputs[i]) === norm(answers[i]) ? "#4cc864" : "#e05050"}`,
              color: norm(userInputs[i]) === norm(answers[i]) ? "#7ef09a" : "#f08080",
              borderRadius: "6px", padding: "2px 10px", minWidth: "80px", textAlign: "center",
            }}>
              {answers[i]}
              {norm(userInputs[i]) !== norm(answers[i]) && userInputs[i] && (
                <span style={{ opacity: 0.5, fontSize: "12px", marginLeft: "6px" }}>({userInputs[i]})</span>
              )}
            </span>
          ) : (
            <input
              ref={el => inputRefs.current[i] = el}
              value={userInputs[i] || ""}
              onChange={e => setUserInputs(prev => { const n=[...prev]; n[i]=e.target.value; return n; })}
              onKeyDown={e => { if (e.key==="Enter" && inputRefs.current[i+1]) inputRefs.current[i+1].focus(); }}
              placeholder="?"
              style={{
                display: "inline-block", margin: "0 4px", verticalAlign: "middle",
                background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: "6px", padding: "4px 10px", color: "#f0e6d3",
                fontFamily: "Georgia, serif", fontSize: "15px", outline: "none",
                width: `${Math.max((answers[i]||"").length * 11 + 28, 80)}px`,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}


// ─── PERSISTENT STATS HOOK ───────────────────────────────────────────────────
const STATS_KEY = "altenpflege_stats_v1";
function loadStats() { try { const r = localStorage.getItem(STATS_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } }
function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {} }

function getSuggestions(stats, topicKeys, count = 3) {
  const now = Date.now(), DAY = 86400000;
  return topicKeys.map(key => {
    const s = stats[key];
    if (!s || s.seen === 0) return { key, score: 1000, reason: "not_started" };
    const acc = s.correct / s.seen;
    const recAcc = s.recentCorrect / Math.max(s.recentSeen, 1);
    const stale = Math.min((now - (s.lastSeen || 0)) / DAY / 7, 1);
    const score = (1 - recAcc) * 60 + (1 - acc) * 30 + stale * 10;
    const reason = recAcc < 0.5 ? "struggling" : recAcc < 0.75 ? "needs_work" : stale > 0.5 ? "not_recent" : "good";
    return { key, score, reason, accuracy: Math.round(acc * 100) };
  }).sort((a, b) => b.score - a.score).slice(0, count);
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function useStats() {
  const [stats, setStats] = useState(loadStats);

  const recordAnswer = useCallback((topicKey, correct, qKey) => {
    setStats(prev => {
      // Per-topic tracking
      const e = prev[topicKey] || { seen: 0, correct: 0, recentSeen: 0, recentCorrect: 0, recentWindow: [], lastSeen: null };
      const win = [...(e.recentWindow || []), correct];
      if (win.length > 10) win.shift();
      const updatedTopic = { ...e, seen: e.seen + 1, correct: e.correct + (correct ? 1 : 0), recentWindow: win, recentSeen: win.length, recentCorrect: win.filter(Boolean).length, lastSeen: Date.now() };

      // Per-question tracking
      const qDiff = prev.__qDiff || {};
      const qe = qKey ? (qDiff[qKey] || { seen: 0, correct: 0 }) : null;
      const updatedQDiff = qKey ? { ...qDiff, [qKey]: { seen: qe.seen + 1, correct: qe.correct + (correct ? 1 : 0) } } : qDiff;

      // Streak tracking
      const today = todayStr();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const prevStreak = prev.__streak || { count: 0, lastStudy: null };
      let newCount = prevStreak.count;
      if (prevStreak.lastStudy !== today) {
        newCount = prevStreak.lastStudy === yesterday ? newCount + 1 : 1;
      }
      const updatedStreak = { count: newCount, lastStudy: today };

      const next = { ...prev, [topicKey]: updatedTopic, __qDiff: updatedQDiff, __streak: updatedStreak };
      saveStats(next);
      return next;
    });
  }, []);

  const resetStats = useCallback(() => { setStats({}); localStorage.removeItem(STATS_KEY); }, []);
  const resetTopic = useCallback((key) => setStats(prev => { const n = { ...prev }; delete n[key]; saveStats(n); return n; }), []);
  const getTopicSummary = useCallback((key) => {
    const s = stats[key];
    if (!s || s.seen === 0) return { seen: 0, accuracy: null, recentAccuracy: null };
    return { seen: s.seen, correct: s.correct, accuracy: Math.round(s.correct / s.seen * 100), recentAccuracy: Math.round(s.recentCorrect / s.recentSeen * 100), lastSeen: s.lastSeen, recentWindow: s.recentWindow || [] };
  }, [stats]);
  const getStreak = useCallback(() => {
    const s = stats.__streak;
    if (!s || s.count === 0) return { count: 0, studiedToday: false };
    return { count: s.count, studiedToday: s.lastStudy === todayStr() };
  }, [stats]);

  return { stats, recordAnswer, resetStats, resetTopic, getTopicSummary, getStreak };
}

function relativeDate(ts) {
  if (!ts) return null;
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d === 0) return "today"; if (d === 1) return "yesterday";
  if (d < 7) return d + " days ago"; if (d < 30) return Math.floor(d/7) + " week(s) ago";
  return Math.floor(d/30) + " month(s) ago";
}

function accColor(pct) { return pct === null ? "#666" : pct < 50 ? "#e05050" : pct < 70 ? "#e87a3a" : pct < 85 ? "#e8c050" : "#4cc864"; }

export default function App() {
  const [lang, setLang] = useState("de");
  const { stats, recordAnswer, resetStats, resetTopic, getTopicSummary, getStreak } = useStats();
  const T = UI[lang];
  const TOPICS = lang === "de" ? TOPICS_DE : TOPICS_EN;
  const topicKeys = Object.keys(TOPICS);

  const [mode, setMode] = useState("home");
  const [selectedTopics, setSelectedTopics] = useState(topicKeys);

  const ALL_Q = Object.entries(TOPICS).flatMap(([topic, data], tIdx) =>
    data.questions.map((q, qiIdx) => ({ ...q, topic, color: data.color, icon: data.icon, _tIdx: tIdx, _qIdx: qiIdx }))
  );
  const active = ALL_Q.filter(q => selectedTopics.includes(q.topic));

  // Quiz
  const [quizQs, setQuizQs] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  // Flashcard
  const [cards, setCards] = useState([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Fill
  const [fillQs, setFillQs] = useState([]);
  const [fillIdx, setFillIdx] = useState(0);
  const [fillInputs, setFillInputs] = useState([]);
  const [fillRevealed, setFillRevealed] = useState(false);
  const [fillScore, setFillScore] = useState(0);
  const [fillAnswered, setFillAnswered] = useState([]);
  const [fillDone, setFillDone] = useState(false);

  // Summary
  const [summaryIdx, setSummaryIdx] = useState(0);

  // Translate a single enriched question object into a new language
  const translateQ = (q, newTopicsObj) => {
    const newTopicKeys = Object.keys(newTopicsObj);
    const topicKey = newTopicKeys[q._tIdx];
    const topicData = newTopicsObj[topicKey];
    if (!topicData) return q;
    const raw = topicData.questions[q._qIdx];
    if (!raw) return q;
    const base = { ...raw, topic: topicKey, color: topicData.color, icon: topicData.icon, _tIdx: q._tIdx, _qIdx: q._qIdx };
    // Re-apply the same option order so position doesn't change on language switch
    return q._perm ? applyPerm(base, q._perm) : base;
  };

  const switchLang = (newLang) => {
    if (newLang === lang) return;
    const newTopics = newLang === "de" ? TOPICS_DE : TOPICS_EN;
    const newTopicKeys = Object.keys(newTopics);
    const oldTopicKeys = Object.keys(lang === "de" ? TOPICS_DE : TOPICS_EN);

    // Map selected topics by position
    const newSelected = selectedTopics.map(t => {
      const idx = oldTopicKeys.indexOf(t);
      return idx >= 0 ? newTopicKeys[idx] : null;
    }).filter(Boolean);
    const newActiveTopics = newSelected.length > 0 ? newSelected : newTopicKeys;

    setLang(newLang);
    setSelectedTopics(newActiveTopics);

    // Translate question sets in place — same questions, new language
    if (mode === "quiz") {
      setQuizQs(qs => qs.map(q => translateQ(q, newTopics)));
      setQuizAnswered(ans => ans.map(a => ({ ...a, q: translateQ(a.q, newTopics) })));
    } else if (mode === "flashcard") {
      setCards(cs => cs.map(q => translateQ(q, newTopics)));
      setFlipped(false);
    } else if (mode === "fill") {
      setFillQs(qs => qs.map(q => translateQ(q, newTopics)));
      // Reset inputs/revealed for current question since blanks have changed
      setFillInputs([]);
      setFillRevealed(false);
    }
  };

  const startQuiz = (topicOverride) => {
    const pool = topicOverride ? ALL_Q.filter(q => q.topic === topicOverride) : active;
    const qs = weightedSample(pool, 10, stats.__qDiff).map(shuffleOptions);
    setQuizQs(qs); setQIdx(0); setSelected(null);
    setQuizScore(0); setQuizAnswered([]); setQuizDone(false);
    setMode("quiz");
  };
  const startCards = () => {
    setCards(shuffle(active)); setCardIdx(0); setFlipped(false);
    setMode("flashcard");
  };
  const startFill = () => {
    const qs = shuffle(active.filter(q => q.fillTemplate)).slice(0, 10);
    setFillQs(qs); setFillIdx(0);
    setFillInputs(new Array(qs[0]?.fillAnswers.length || 0).fill(""));
    setFillRevealed(false); setFillScore(0); setFillAnswered([]); setFillDone(false);
    setMode("fill");
  };

  const handleQuizAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const ok = idx === quizQs[qIdx].correct;
    if (ok) setQuizScore(s => s + 1);
    setQuizAnswered(p => [...p, { ok, q: quizQs[qIdx] }]);
    recordAnswer(quizQs[qIdx].topic, ok, `${quizQs[qIdx]._tIdx}_${quizQs[qIdx]._qIdx}`);
  };
  const nextQuiz = () => {
    if (qIdx + 1 >= quizQs.length) setQuizDone(true);
    else { setQIdx(i => i + 1); setSelected(null); }
  };
  const checkFill = () => {
    const q = fillQs[fillIdx];
    const allOk = fillInputs.every((v, i) => norm(v) === norm(q.fillAnswers[i]));
    const numOk = fillInputs.filter((v, i) => norm(v) === norm(q.fillAnswers[i])).length;
    if (allOk) setFillScore(s => s + 1);
    recordAnswer(q.topic, allOk, `${q._tIdx}_${q._qIdx}`);
    setFillAnswered(p => [...p, { allOk, numOk, total: q.fillAnswers.length, q }]);
    setFillRevealed(true);
  };
  const nextFill = () => {
    if (fillIdx + 1 >= fillQs.length) { setFillDone(true); return; }
    const next = fillIdx + 1;
    setFillIdx(next); setFillRevealed(false);
    setFillInputs(new Array(fillQs[next].fillAnswers.length).fill(""));
  };
  const toggleTopic = (t) => setSelectedTopics(p =>
    p.includes(t) ? (p.length > 1 ? p.filter(x => x !== t) : p) : [...p, t]
  );

  const LangToggle = () => (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "3px", border: "1px solid rgba(255,255,255,0.15)" }}>
      {["de", "en"].map(l => (
        <button key={l} onClick={() => switchLang(l)} style={{
          padding: "5px 14px", borderRadius: "16px", border: "none", cursor: "pointer",
          fontFamily: "sans-serif", fontSize: "13px", fontWeight: "bold",
          background: lang === l ? "rgba(255,255,255,0.18)" : "transparent",
          color: lang === l ? "#f0e6d3" : "rgba(240,230,211,0.45)",
          transition: "all 0.2s",
        }}>
          {l === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
        </button>
      ))}
    </div>
  );

  const progressBar = (current, total, color) => (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: "12px", opacity: 0.5, marginBottom: "6px" }}>
        <span>{T.question} {current + 1} {T.of} {total}</span>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
        <div style={{ height: "100%", width: `${((current + 1) / total) * 100}%`, background: color, borderRadius: "2px", transition: "width 0.3s" }} />
      </div>
    </div>
  );

  const topicBadge = (q) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${q.color}22`, border: `1px solid ${q.color}44`, borderRadius: "20px", padding: "4px 12px", marginBottom: "16px", fontFamily: "sans-serif", fontSize: "12px", color: q.color }}>
      {q.icon} {q.topic}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", color: "#f0e6d3", fontFamily: "Georgia, serif", padding: "0" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", gap: "8px" }}>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: "clamp(14px, 5vw, 20px)", fontWeight: "bold", letterSpacing: "0.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{T.appTitle}</div>
            <div style={{ fontSize: "12px", fontFamily: "sans-serif", opacity: 0.45, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{T.appSub}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
            {mode !== "home" && (
              <button onClick={() => setMode("home")} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0e6d3", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px", whiteSpace: "nowrap" }}>
                {T.mainMenu}
              </button>
            )}
            <LangToggle />
          </div>
        </div>

        {/* ── HOME ── */}
        {mode === "home" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "15px", marginBottom: "4px" }}>{T.welcome}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", opacity: 0.5, marginBottom: "14px" }}>
                {T.questionsFrom(active.length, selectedTopics.length)}
              </div>
              {(() => {
                const { count, studiedToday } = getStreak();
                if (count === 0) return (
                  <div style={{ fontFamily: "sans-serif", fontSize: "11px", opacity: 0.35 }}>{T.streakNone}</div>
                );
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px", lineHeight: 1 }}>{count >= 7 ? "🔥" : "✨"}</span>
                    <div>
                      <span style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: "bold", color: count >= 7 ? "#f4a03a" : "#f0e6d3" }}>{count}</span>
                      <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: count >= 7 ? "#f4a03a" : "rgba(240,230,211,0.55)", marginLeft: "5px" }}>{T.streakDays(count)}</span>
                      {studiedToday && <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#4cc864", marginLeft: "8px" }}>{T.streakToday}</span>}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Topic selector */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", opacity: 0.45, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{T.selectTopics}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {topicKeys.map(t => {
                  const d = TOPICS[t];
                  const on = selectedTopics.includes(t);
                  return (
                    <button key={t} onClick={() => toggleTopic(t)} style={{
                      background: on ? `${d.color}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${on ? d.color+"66" : "rgba(255,255,255,0.1)"}`,
                      color: on ? d.color : "rgba(240,230,211,0.4)",
                      borderRadius: "20px", padding: "6px 14px", cursor: "pointer",
                      fontFamily: "sans-serif", fontSize: "12px", transition: "all 0.2s",
                    }}>
                      {d.icon} {t} <span style={{ opacity: 0.5 }}>({d.questions.length})</span>
                      {(() => { const s = getTopicSummary(t); return s.seen > 0 ? <span style={{ marginLeft: 4, fontSize: 10, color: accColor(s.recentAccuracy) }}>● {s.recentAccuracy}%</span> : null; })()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {Object.entries(T.modes).map(([key, m]) => (
                <button key={key} onClick={key==="quiz"?()=>startQuiz():key==="flashcard"?startCards:key==="fill"?startFill:()=>{ setSummaryIdx(0); setMode("summary"); }}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "20px 16px", cursor: "pointer", textAlign: "left", transition: "background 0.15s", color: "#f0e6d3", WebkitTapHighlightColor: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                  onTouchStart={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                  onTouchEnd={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                  onTouchCancel={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>{m.icon}</div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "12px", opacity: 0.5 }}>{m.desc}</div>
                </button>
              ))}
              {/* Stats button */}
              <button onClick={() => setMode("stats")}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "20px 16px", cursor: "pointer", textAlign: "left", transition: "background 0.15s", color: "#f0e6d3", gridColumn: "1 / -1", WebkitTapHighlightColor: "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                onTouchStart={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onTouchEnd={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                onTouchCancel={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>📊</div>
                <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>{T.statsTitle}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: "12px", opacity: 0.5 }}>{T.statsDesc}</div>
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {mode === "quiz" && !quizDone && quizQs.length > 0 && (
          <div key={qIdx}>
            {progressBar(qIdx, quizQs.length, "#7ca8e8")}
            {topicBadge(quizQs[qIdx])}
            <div style={{ fontSize: "18px", lineHeight: "1.65", marginBottom: "24px" }}>{quizQs[qIdx].q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {quizQs[qIdx].options.map((opt, i) => {
                let bg = "rgba(255,255,255,0.06)"; let border = "rgba(255,255,255,0.12)"; let col = "#f0e6d3";
                if (selected !== null) {
                  if (i === quizQs[qIdx].correct) { bg="rgba(76,200,100,0.15)"; border="#4cc864"; col="#7ef09a"; }
                  else if (i === selected) { bg="rgba(220,80,80,0.15)"; border="#e05050"; col="#f08080"; }
                }
                return (
                  <button key={i} onClick={() => handleQuizAnswer(i)} style={{ background: bg, border: `1.5px solid ${border}`, color: col, borderRadius: "12px", padding: "14px 18px", cursor: selected===null?"pointer":"default", textAlign: "left", fontFamily: "sans-serif", fontSize: "14px", lineHeight: "1.4", transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ flexShrink: 0, background: "rgba(124,168,232,0.25)", borderRadius: "6px", padding: "1px 7px", fontSize: "12px", fontWeight: "bold", opacity: 1, marginTop: "1px", color: "#7ca8e8" }}>{["A","B","C","D"][i]}</span>
                    <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.6" }}>
                  <strong>{T.explanation}</strong> <span style={{ opacity: 0.75 }}>{quizQs[qIdx].a}</span>
                </div>
                <button onClick={nextQuiz} style={{ width: "100%", background: "#7ca8e8", border: "none", color: "#1a1a2e", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", fontFamily: "sans-serif" }}>
                  {qIdx + 1 >= quizQs.length ? T.showResult : T.nextQuestion}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── QUIZ DONE ── */}
        {mode === "quiz" && quizDone && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>{quizScore >= 8 ? "🏆" : quizScore >= 6 ? "👍" : "💪"}</div>
            <h2 style={{ fontSize: "26px", marginBottom: "8px", fontWeight: "normal" }}>{T.correctOf(quizScore, quizQs.length)}</h2>
            <p style={{ opacity: 0.6, fontFamily: "sans-serif", marginBottom: "32px" }}>
              {quizScore >= 8 ? T.excellent : quizScore >= 6 ? T.good : T.keepGoing}
            </p>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "20px", marginBottom: "28px", textAlign: "left" }}>
              {quizAnswered.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: i < quizAnswered.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none", fontFamily: "sans-serif", fontSize: "13px" }}>
                  <span>{item.ok ? "✅" : "❌"}</span><span style={{ opacity: 0.75 }}>{item.q.q.substring(0, 70)}…</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => startQuiz()} style={{ background: "#7ca8e8", border: "none", color: "#1a1a2e", borderRadius: "10px", padding: "13px 28px", fontWeight: "bold", cursor: "pointer", fontFamily: "sans-serif" }}>{T.tryAgain}</button>
              <button onClick={() => setMode("home")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#f0e6d3", borderRadius: "10px", padding: "13px 28px", cursor: "pointer", fontFamily: "sans-serif" }}>{T.mainMenu.replace("← ","")}</button>
            </div>
          </div>
        )}

        {/* ── FLASHCARD ── */}
        {mode === "flashcard" && cards.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: "13px", opacity: 0.65, marginBottom: "20px" }}>
              <span>{T.cardOf(cardIdx + 1, cards.length)}</span>
              <span style={{ color: cards[cardIdx].color }}>{cards[cardIdx].icon} {cards[cardIdx].topic}</span>
            </div>
            <div onClick={() => setFlipped(!flipped)} style={{ background: flipped ? `linear-gradient(135deg,${cards[cardIdx].color}22,${cards[cardIdx].color}11)` : "rgba(255,255,255,0.07)", border: `1.5px solid ${flipped ? cards[cardIdx].color+"66" : "rgba(255,255,255,0.12)"}`, borderRadius: "20px", padding: "48px 36px", minHeight: "220px", cursor: "pointer", transition: "all 0.3s", textAlign: "center", marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <div style={{ fontSize: "11px", fontFamily: "sans-serif", opacity: 0.45, textTransform: "uppercase", letterSpacing: "1.5px" }}>{flipped ? T.answer : T.flipHint}</div>
              <div style={{ fontSize: "17px", lineHeight: "1.65", maxWidth: "580px" }}>{flipped ? cards[cardIdx].a : cards[cardIdx].q}</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setCardIdx(i => (i-1+cards.length)%cards.length); setFlipped(false); }} style={{ width: "52px", flexShrink: 0, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0e6d3", borderRadius: "10px", padding: "14px 0", cursor: "pointer", fontFamily: "sans-serif", fontSize: "18px" }}>←</button>
              <button onClick={() => setFlipped(!flipped)} style={{ flex: 1, background: `${cards[cardIdx].color}33`, border: `1px solid ${cards[cardIdx].color}66`, color: cards[cardIdx].color, borderRadius: "10px", padding: "14px 10px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "bold", fontSize: "clamp(12px, 3.5vw, 14px)" }}>{flipped ? T.showQuestion : T.revealAnswer}</button>
              <button onClick={() => { setCardIdx(i => (i+1)%cards.length); setFlipped(false); }} style={{ width: "52px", flexShrink: 0, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0e6d3", borderRadius: "10px", padding: "14px 0", cursor: "pointer", fontFamily: "sans-serif", fontSize: "18px" }}>→</button>
            </div>
          </div>
        )}

        {/* ── FILL IN THE BLANK ── */}
        {mode === "fill" && !fillDone && fillQs.length > 0 && (() => {
          const q = fillQs[fillIdx];
          const allFilled = fillInputs.every(v => v.trim().length > 0);
          return (
            <div>
              {progressBar(fillIdx, fillQs.length, "#e87ca8")}
              {topicBadge(q)}
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px 20px", marginBottom: "14px", fontFamily: "sans-serif", fontSize: "13px", opacity: 0.72, lineHeight: "1.5" }}>
                📌 {q.q}
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "28px 28px 22px", marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontFamily: "sans-serif", opacity: 0.4, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "18px" }}>{T.fillHint}</div>
                <FillTemplate template={q.fillTemplate} answers={q.fillAnswers} userInputs={fillInputs} setUserInputs={setFillInputs} revealed={fillRevealed} />
              </div>
              {fillRevealed && (
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.6" }}>
                  <strong>{T.fullAnswer}</strong> <span style={{ opacity: 0.75 }}>{q.a}</span>
                </div>
              )}
              {!fillRevealed ? (
                <button onClick={checkFill} disabled={!allFilled} style={{ width: "100%", background: allFilled ? "#e87ca8" : "rgba(255,255,255,0.08)", border: "none", color: allFilled ? "#1a1a2e" : "rgba(240,230,211,0.35)", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "bold", cursor: allFilled ? "pointer" : "default", fontFamily: "sans-serif" }}>{T.check}</button>
              ) : (
                <button onClick={nextFill} style={{ width: "100%", background: "#e87ca8", border: "none", color: "#1a1a2e", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", fontFamily: "sans-serif" }}>
                  {fillIdx + 1 >= fillQs.length ? T.showResult : T.nextTask}
                </button>
              )}
            </div>
          );
        })()}

        {/* ── FILL DONE ── */}
        {mode === "fill" && fillDone && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>{fillScore >= 8 ? "🏆" : fillScore >= 5 ? "👍" : "💪"}</div>
            <h2 style={{ fontSize: "26px", marginBottom: "8px", fontWeight: "normal" }}>{T.correctOfFull(fillScore, fillQs.length)}</h2>
            <p style={{ opacity: 0.6, fontFamily: "sans-serif", marginBottom: "32px" }}>
              {fillScore >= 8 ? T.excellent : fillScore >= 5 ? T.goodFill : T.keepGoingFill}
            </p>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "20px", marginBottom: "28px", textAlign: "left" }}>
              {fillAnswered.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 0", borderBottom: i < fillAnswered.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none", fontFamily: "sans-serif", fontSize: "13px" }}>
                  <span>{item.allOk ? "✅" : item.numOk > 0 ? "🟡" : "❌"}</span>
                  <span style={{ opacity: 0.75 }}>{item.q.q.substring(0, 60)}… <span style={{ opacity: 0.5 }}>({item.numOk}/{item.total})</span></span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={startFill} style={{ background: "#e87ca8", border: "none", color: "#1a1a2e", borderRadius: "10px", padding: "13px 28px", fontWeight: "bold", cursor: "pointer", fontFamily: "sans-serif" }}>{T.tryAgain}</button>
              <button onClick={() => setMode("home")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#f0e6d3", borderRadius: "10px", padding: "13px 28px", cursor: "pointer", fontFamily: "sans-serif" }}>{T.mainMenu.replace("← ","")}</button>
            </div>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {mode === "summary" && (() => {
          const sTopic = topicKeys[summaryIdx];
          const sData = TOPICS[sTopic];
          const navBtn = (disabled, onClick, label) => (
            <button onClick={onClick} disabled={disabled} style={{ width: "52px", flexShrink: 0, background: disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.08)", border: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)"}`, color: disabled ? "rgba(240,230,211,0.2)" : "#f0e6d3", borderRadius: "10px", padding: "13px 0", cursor: disabled ? "default" : "pointer", fontFamily: "sans-serif", fontSize: "18px" }}>{label}</button>
          );
          return (
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "normal", marginBottom: "16px" }}>{T.summary}</h2>

              {/* Topic picker — emoji dots */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {topicKeys.map((t, i) => {
                  const d = TOPICS[t];
                  const active = i === summaryIdx;
                  return (
                    <button key={t} onClick={() => { setSummaryIdx(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      title={t}
                      style={{ width: "38px", height: "38px", borderRadius: "50%", border: `2px solid ${active ? d.color : "rgba(255,255,255,0.12)"}`, background: active ? `${d.color}33` : "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>
                      {d.icon}
                    </button>
                  );
                })}
              </div>

              {/* Current topic */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${sData.color}44`, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <span style={{ fontSize: "24px" }}>{sData.icon}</span>
                  <span style={{ fontSize: "17px", color: sData.color, flex: 1 }}>{sTopic}</span>
                  <span style={{ fontSize: "12px", fontFamily: "sans-serif", opacity: 0.45 }}>{sData.questions.length} {T.questions}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {sData.questions.map((q, i) => (
                    <div key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "bold", marginBottom: "6px", opacity: 0.9 }}>{i + 1}. {q.q}</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "13px", opacity: 0.6, lineHeight: "1.6" }}>{q.a}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev / counter / Next */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {navBtn(summaryIdx === 0, () => { setSummaryIdx(i => i - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }, "←")}
                <div style={{ flex: 1, textAlign: "center", fontFamily: "sans-serif", fontSize: "13px", opacity: 0.5 }}>
                  {summaryIdx + 1} {T.of} {topicKeys.length}
                </div>
                {navBtn(summaryIdx === topicKeys.length - 1, () => { setSummaryIdx(i => i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }, "→")}
              </div>
            </div>
          );
        })()}


        {/* ── STATS / SUGGESTIONS ── */}
        {mode === "stats" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#f0e6d3", fontSize: 22, marginBottom: 24 }}>{T.suggestionsTitle}</h2>
            {getSuggestions(stats, topicKeys, 3).map(({ key, reason }) => {
              const td = TOPICS[key]; const s = getTopicSummary(key);
              const reasonLabels = { not_started: T.notStartedLbl, struggling: T.struggling, needs_work: T.needsWork, not_recent: T.notRecent, good: T.goodLbl };
              const reasonColors = { not_started: "#7ca8e8", struggling: "#e05050", needs_work: "#e8c050", not_recent: "#a87ce8", good: "#4cc864" };
              const rColor = reasonColors[reason] || "#888";
              return (
                <div key={key} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: `3px solid ${td?.color || "#888"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 22 }}>{td?.icon}</span>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontFamily: "Georgia, serif", color: "#f0e6d3", fontSize: 15, marginBottom: 4 }}>{key}</div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: rColor+"22", border: `1px solid ${rColor}66`, color: rColor, fontFamily: "sans-serif" }}>{reasonLabels[reason]}</span>
                  </div>
                  {s.seen > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, flex: 1, overflow: "hidden" }}><div style={{ height: "100%", width: s.recentAccuracy+"%", background: accColor(s.recentAccuracy), borderRadius: 3 }} /></div>
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: accColor(s.recentAccuracy), minWidth: 36 }}>{s.recentAccuracy}%</span>
                  </div>}
                  <button onClick={() => startQuiz(key)} style={{ background: (td?.color||"#888")+"22", border: `1px solid ${(td?.color||"#888")}66`, color: td?.color||"#f0e6d3", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>{T.studyNow} →</button>
                </div>
              );
            })}

            <h2 style={{ fontFamily: "Georgia, serif", color: "#f0e6d3", fontSize: 20, margin: "28px 0 16px" }}>{T.allTopics}</h2>
            {topicKeys.map(key => {
              const td = TOPICS[key]; const s = getTopicSummary(key);
              return (
                <div key={key} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 18 }}>{td?.icon}</span>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontFamily: "Georgia, serif", color: "#f0e6d3", fontSize: 14 }}>{key}</div>
                    {s.seen > 0
                      ? <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(240,230,211,0.45)", marginTop: 2 }}>{s.seen} {T.answeredLbl} · {s.correct} {T.correctLbl} · {relativeDate(s.lastSeen)}</div>
                      : <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(240,230,211,0.3)", marginTop: 2 }}>{T.notStartedYet}</div>}
                    {s.recentWindow && s.recentWindow.length > 0 && (
                      <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                        {s.recentWindow.map((ok, i) => (
                          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ok ? "#4cc864" : "#e05050", opacity: 0.75 }} title={ok ? "✓" : "✗"} />
                        ))}
                      </div>
                    )}
                  </div>
                  {s.seen > 0 && <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, flex: 1, overflow: "hidden" }}><div style={{ height: "100%", width: s.accuracy+"%", background: accColor(s.accuracy), borderRadius: 3 }} /></div>
                      <span style={{ fontFamily: "sans-serif", fontSize: 12, color: accColor(s.accuracy), minWidth: 36 }}>{s.accuracy}%</span>
                    </div>
                    <button onClick={() => { if (window.confirm("Reset stats for "+key+"?")) resetTopic(key); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(240,230,211,0.4)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 11 }}>↺</button>
                  </>}
                </div>
              );
            })}
            {topicKeys.some(k => stats[k]?.seen > 0) && (
              <div style={{ textAlign: "center", marginTop: 28 }}>
                <button onClick={() => { if (window.confirm(T.confirmReset)) resetStats(); }} style={{ background: "transparent", border: "1px solid rgba(220,80,80,0.4)", color: "rgba(220,80,80,0.7)", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>{T.resetAll}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
