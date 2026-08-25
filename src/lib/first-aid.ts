export type FirstAidTopic = {
  slug: string;
  title: string;
  summary: string;
  tone: "emergency" | "warning" | "safe";
  steps: string[];
};

export const firstAidTopics: FirstAidTopic[] = [
  {
    slug: "heart-attack",
    title: "Heart Attack",
    summary: "Chest pain or pressure, breathlessness, pain in arm or jaw.",
    tone: "emergency",
    steps: [
      "Call your local emergency number immediately.",
      "Help the person sit down, keep them calm and loosen tight clothing.",
      "If they are prescribed nitroglycerin, help them take it.",
      "If not allergic and advised by a dispatcher, give one aspirin to chew slowly.",
      "Stay with them and monitor breathing until help arrives.",
      "If they become unresponsive and are not breathing normally, start CPR.",
    ],
  },
  {
    slug: "cpr",
    title: "CPR",
    summary: "For an unresponsive person who is not breathing normally.",
    tone: "emergency",
    steps: [
      "Check responsiveness and shout for help; ask someone to call emergency services and fetch an AED.",
      "Place the person flat on their back on a firm surface.",
      "Put the heel of one hand in the centre of the chest, other hand on top, fingers interlocked.",
      "Push hard and fast: about 5-6 cm deep, 100-120 compressions per minute.",
      "If trained, give 2 rescue breaths after every 30 compressions.",
      "Use an AED as soon as it arrives and follow its voice prompts.",
      "Continue until the person recovers or professional help takes over.",
    ],
  },
  {
    slug: "burns",
    title: "Burns",
    summary: "Thermal, scald or contact burns to skin.",
    tone: "warning",
    steps: [
      "Move the person away from the heat source safely.",
      "Cool the burn under cool (not ice-cold) running water for 20 minutes.",
      "Remove jewellery or tight clothing near the burn before swelling starts.",
      "Cover loosely with cling film or a clean non-fluffy cloth.",
      "Do not apply creams, butter, ice or burst blisters.",
      "Seek emergency care for large, deep, facial, or airway burns.",
    ],
  },
  {
    slug: "bleeding",
    title: "Severe Bleeding",
    summary: "Heavy or continuous blood loss from a wound.",
    tone: "emergency",
    steps: [
      "Protect yourself: use gloves or a clean barrier if available.",
      "Apply firm, direct pressure on the wound with a clean pad or cloth.",
      "Keep pressing; add more layers on top instead of removing soaked ones.",
      "Raise the injured limb above heart level if there is no fracture.",
      "Call emergency services if bleeding is heavy or does not stop.",
      "Watch for shock: pale skin, rapid breathing, confusion. Keep them warm and lying down.",
    ],
  },
  {
    slug: "stroke",
    title: "Stroke",
    summary: "Use FAST: Face, Arms, Speech, Time.",
    tone: "emergency",
    steps: [
      "Face: ask them to smile - is one side drooping?",
      "Arms: can they raise both arms and keep them up?",
      "Speech: is it slurred or confused?",
      "Time: call emergency services immediately and note the time symptoms started.",
      "Keep the person still, supported and reassured; do not give food or drink.",
      "Monitor breathing and be ready to start CPR if they stop breathing normally.",
    ],
  },
  {
    slug: "choking",
    title: "Choking",
    summary: "Airway blocked; unable to speak, cough or breathe.",
    tone: "warning",
    steps: [
      "Ask 'Are you choking?' - if they can cough forcefully, encourage coughing.",
      "If the cough is weak, give up to 5 firm back blows between the shoulder blades.",
      "If unsuccessful, give up to 5 abdominal thrusts (Heimlich manoeuvre).",
      "Alternate 5 back blows and 5 abdominal thrusts.",
      "Call emergency services if the blockage does not clear.",
      "If they become unresponsive, begin CPR.",
    ],
  },
];
