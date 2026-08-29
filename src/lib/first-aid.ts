export type FirstAidCategory =
  | "cardiac"
  | "bleeding"
  | "trauma"
  | "burns"
  | "poison"
  | "respiratory";

export type FirstAidTopic = {
  slug: string;
  category: FirstAidCategory;
  categoryName: string;
  title: string;
  summary: string;
  tone: "emergency" | "warning" | "safe";
  steps: string[];
};

export const categoryMeta: Record<FirstAidCategory, { name: string; icon: string; description: string }> = {
  cardiac: {
    name: "Cardiac & CPR",
    icon: "🫀",
    description: "Heart attacks, cardiac arrest, AED operation & chest compressions",
  },
  bleeding: {
    name: "Bleeding & Wounds",
    icon: "🩸",
    description: "Arterial bleeding, deep cuts, tourniquet application & shock",
  },
  trauma: {
    name: "Trauma & Fractures",
    icon: "🦴",
    description: "Bone fractures, spinal trauma, joint dislocations & head injuries",
  },
  burns: {
    name: "Burns & Electrical",
    icon: "🔥",
    description: "Thermal scalds, chemical exposure & high-voltage electric shocks",
  },
  poison: {
    name: "Poison & Environment",
    icon: "🐍",
    description: "Chemical ingestion, venomous bites, heat stroke & hypothermia",
  },
  respiratory: {
    name: "Respiratory & Allergy",
    icon: "🫁",
    description: "Choking, severe asthma, anaphylactic allergic reactions & choking",
  },
};

export const firstAidTopics: FirstAidTopic[] = [
  {
    slug: "cpr",
    category: "cardiac",
    categoryName: "Cardiac & CPR",
    title: "Cardiopulmonary Resuscitation (CPR)",
    summary: "For an unresponsive individual who is not breathing normally.",
    tone: "emergency",
    steps: [
      "Check responsiveness: Shake shoulders gently and shout 'Are you okay?'.",
      "Call emergency services immediately (911) or assign a bystander to call and get an AED.",
      "Position the person flat on their back on a firm, flat surface.",
      "Place the heel of one hand in the center of the chest, interlock your other hand on top.",
      "Push hard and fast: 100-120 compressions per minute, 5-6 cm deep (beat of 'Staying Alive').",
      "If trained, deliver 2 rescue breaths after every 30 compressions.",
      "Attach and power on the AED as soon as it arrives, follow voice prompts.",
      "Continue CPR until emergency medical responders arrive and take over.",
    ],
  },
  {
    slug: "heart-attack",
    category: "cardiac",
    categoryName: "Cardiac & CPR",
    title: "Heart Attack (Myocardial Infarction)",
    summary: "Chest pressure, arm/jaw pain, cold sweats, breathlessness.",
    tone: "emergency",
    steps: [
      "Call emergency services (911) immediately. Do not delay.",
      "Assist the person to sit down in a comfortable W-position (leaning back, knees bent).",
      "Loosen tight collar, belt, or clothing around the chest.",
      "If prescribed nitroglycerin, assist them in taking one dose under the tongue.",
      "If not allergic and approved by emergency dispatcher, have them chew 1 full aspirin (325mg).",
      "Stay calm, reassure the person, and monitor breathing until paramedics arrive.",
    ],
  },
  {
    slug: "bleeding",
    category: "bleeding",
    categoryName: "Bleeding & Wounds",
    title: "Severe Arterial Bleeding",
    summary: "Spurting or heavy continuous blood loss from deep lacerations.",
    tone: "emergency",
    steps: [
      "Put on protective gloves or clean barrier if available.",
      "Apply direct, firm pressure on the wound using a sterile gauze or clean cloth.",
      "If blood soaks through, DO NOT remove the original dressing; add more layers on top.",
      "Maintain continuous pressure. Elevate the wounded limb above heart level if no fracture.",
      "If severe bleeding continues on an arm or leg, apply a commercial tourniquet 2-3 inches above the wound.",
      "Keep the patient warm and lying flat to combat hemorrhagic shock.",
    ],
  },
  {
    slug: "stroke",
    category: "cardiac",
    categoryName: "Cardiac & CPR",
    title: "Stroke (FAST Evaluation)",
    summary: "Facial drooping, arm weakness, slurred speech.",
    tone: "emergency",
    steps: [
      "F - Face: Ask them to smile. Is one side of the face drooping?",
      "A - Arms: Ask them to raise both arms. Does one arm drift downward?",
      "S - Speech: Ask them to repeat a simple sentence. Is speech slurred or strange?",
      "T - Time: If you observe any of these signs, call emergency services immediately.",
      "Note the exact minute symptoms first appeared for emergency personnel.",
      "Do NOT give food, drink, or medication (including aspirin).",
    ],
  },
  {
    slug: "fractures",
    category: "trauma",
    categoryName: "Trauma & Fractures",
    title: "Bone Fractures & Dislocations",
    summary: "Deformity, intense pain, inability to move bone or joint.",
    tone: "warning",
    steps: [
      "Stop any active bleeding with clean pressure dressings.",
      "Immobilize the injured area. Do NOT try to realign or push back protruding bones.",
      "Apply an ice pack wrapped in a cloth for 15-20 minutes to reduce swelling.",
      "Support the fracture with a temporary padded splint or sling if transport is needed.",
      "Treat for shock: keep patient comfortable, still, and covered with a blanket.",
      "Call emergency responders for severe leg, hip, pelvic, head, or spine injuries.",
    ],
  },
  {
    slug: "burns",
    category: "burns",
    categoryName: "Burns & Electrical",
    title: "Thermal & Chemical Burns",
    summary: "Heat scalds, flame contact, chemical exposure.",
    tone: "warning",
    steps: [
      "Safety first: Remove victim from heat source or flush chemical off skin.",
      "Cool the burn with cool (not freezing) running water for at least 20 minutes.",
      "Gently remove jewelry or non-sticking clothes around the burn before swelling.",
      "Cover loosely with clear cling film or a sterile, non-fluffy bandage.",
      "Do NOT apply butter, oil, ice, or burst fluid blisters.",
      "Seek urgent medical evaluation for burns larger than the palm or involving face/hands.",
    ],
  },
  {
    slug: "choking",
    category: "respiratory",
    categoryName: "Respiratory & Allergy",
    title: "Choking (Heimlich Maneuver)",
    summary: "Airway obstruction; unable to talk, cough, or breathe.",
    tone: "warning",
    steps: [
      "Ask 'Are you choking?'. If they can cough loudly, encourage them to keep coughing.",
      "If cough is silent or weak, lean them forward and deliver 5 firm back blows between shoulder blades.",
      "If unblocked, stand behind them, wrap arms around waist, and make a fist above the navel.",
      "Perform 5 quick, upward abdominal thrusts (Heimlich maneuver).",
      "Alternate between 5 back blows and 5 abdominal thrusts.",
      "If person loses consciousness, lower them to the floor and initiate CPR compressions.",
    ],
  },
  {
    slug: "anaphylaxis",
    category: "respiratory",
    categoryName: "Respiratory & Allergy",
    title: "Anaphylaxis (Severe Allergy)",
    summary: "Swollen throat, hives, wheezing, low blood pressure.",
    tone: "emergency",
    steps: [
      "Call emergency services (911) immediately.",
      "Administer an EpiPen / Epinephrine auto-injector into the outer mid-thigh if available.",
      "Hold the injector firmly in place for 3 full seconds.",
      "Lay the person flat on their back with feet elevated, unless breathing is too difficult.",
      "If symptoms do not improve after 5-10 minutes, administer a second epinephrine dose if available.",
    ],
  },
  {
    slug: "poisoning",
    category: "poison",
    categoryName: "Poison & Environment",
    title: "Poisoning & Toxic Ingestion",
    summary: "Accidental swallowing of household chemicals or toxin exposure.",
    tone: "emergency",
    steps: [
      "Call Poison Control (1-800-222-1222) or emergency services immediately.",
      "If toxin was swallowed, do NOT induce vomiting unless explicitly instructed by poison control.",
      "If toxin is on skin or eyes, flush continuously with clean running water for 15-20 minutes.",
      "If toxic fumes were inhaled, move the person to fresh open air immediately.",
      "Keep the poison container or chemical bottle ready for reference when emergency team arrives.",
    ],
  },
];
