// GenAI Stadium Operations & Fan Assistant Simulator for FIFA World Cup 2026

const STADIUM_DATA = {
  metlife: {
    name: "MetLife Stadium (New York/New Jersey)",
    gates: {
      G1: { name: "MetLife Gate", waitTime: "12 mins", status: "Nominal" },
      G2: { name: "Verizon Gate", waitTime: "35 mins", status: "Heavy Congestion" },
      G3: { name: "Pepsi Gate", waitTime: "8 mins", status: "Nominal" },
      G4: { name: "HCLTech Gate", waitTime: "18 mins", status: "Moderate Flow" }
    },
    shuttles: "Departs every 5 minutes to Secaucus Junction. Current queue wait is 15 minutes.",
    wheelchairGates: "MetLife Gate (G1) and Verizon Gate (G2) feature dedicated ADA lanes with low-incline ramps.",
    sensoryRoom: "Located on the Plaza Level, adjacent to Section 101. Soundproofed with sensory bags available."
  },
  sofi: {
    name: "SoFi Stadium (Los Angeles)",
    gates: {
      G1: { name: "Gate 1 (Northwest)", waitTime: "10 mins", status: "Nominal" },
      G2: { name: "Gate 5 (South)", waitTime: "40 mins", status: "Heavy Congestion" },
      G3: { name: "Gate 8 (East)", waitTime: "15 mins", status: "Nominal" },
      G4: { name: "Gate 11 (West)", waitTime: "5 mins", status: "Nominal" }
    },
    shuttles: "Metro C Line shuttle buses run continuously from Hawthorne/Lennox Station. Wait is 10 minutes.",
    wheelchairGates: "All entries (1, 5, 8, 11) have dedicated accessible lanes. Elevators are accessible from the main concourse.",
    sensoryRoom: "Located on the Level 6 concourse, behind Section 230. Quiet zone equipped with weighted blankets."
  },
  azteca: {
    name: "Estadio Azteca (Mexico City)",
    gates: {
      G1: { name: "Acceso A (Principal)", waitTime: "25 mins", status: "Moderate Flow" },
      G2: { name: "Acceso B (Norte)", waitTime: "45 mins", status: "Heavy Congestion" },
      G3: { name: "Acceso C (Sur)", waitTime: "15 mins", status: "Nominal" },
      G4: { name: "Acceso D (Oriente)", waitTime: "10 mins", status: "Nominal" }
    },
    shuttles: "Tren Ligero (Light Rail) runs to Tasqueña Station. Special shuttle buses depart from Gate A every 8 mins.",
    wheelchairGates: "Acceso A (Principal) has specialized ramps and direct elevator access to wheelchair platforms.",
    sensoryRoom: "Located in the Lower Suite Level, Suite 12. Soft lighting and calming activities are provided."
  }
};

const SAMPLE_BOT_RESPONSES = [
  {
    keywords: ["wheelchair", "disabled", "accessible", "access", "ramp", "elevator", "ada"],
    english: "♿ **Accessibility Services:**\n\nAll stadium levels are accessible by ramps and elevators. \n- **Dedicated ADA Gates:** Special priority lanes are at **Gate G1** and **Gate G4**.\n- **Sensory Rooms:** Available on the Plaza Level near **Section 101/102**.\n- **Need assistance?** Alert any staff member in a teal jacket for mobility escorts.",
    spanish: "♿ **Servicios de Accesibilidad:**\n\nTodos los niveles son accesibles por rampas y elevadores.\n- **Accesos ADA:** Hay carriles prioritarios en el **Acceso A** y **Acceso C**.\n- **Salas Sensoriales:** Disponibles en el Nivel Plaza junto a la **Sección 101**.\n- **¿Necesita ayuda?** Avise a cualquier miembro del personal con chaleco verde.",
    french: "♿ **Services d'Accessibilité:**\n\nTous les niveaux sont accessibles par des rampes et des ascenseurs.\n- **Portes ADA dédiées:** Des files d'attente prioritaires sont disponibles à la **Porte G1**.\n- **Salles Sensorielles:** Situées au niveau Plaza, près de la **Section 101**.\n- **Besoin d'aide?** Informez un agent en veste verte pour un accompagnement.",
    arabic: "♿ **خدمات ذوي الاحتياجات الخاصة:**\n\nجميع مستويات الملعب سهلة الوصول عن طريق المصاعد والممرات.\n- **البوابات المخصصة:** توجد مسارات مخصصة عند **البوابة G1**.\n- **غرفة الحواس:** متوفرة في مستوى الساحة بجوار **القسم 101**.\n- **هل تحتاج مساعدة؟** تواصل مع أي موظف يرتدي السترة الخضراء."
  },
  {
    keywords: ["shuttle", "bus", "train", "transit", "transport", "parking", "uber", "taxi", "seacaucus"],
    english: "🚌 **Transportation & Shuttle Info:**\n\n- **Shuttles:** Free shuttle buses connect to local transit hubs (e.g. Secaucus Junction for MetLife, Hawthorne for SoFi) departing every **5 minutes** after the match.\n- **Rideshare (Uber/Lyft):** Dedicated pickup zones are active in **Lot E** (follow the yellow signs). Anticipated rideshare wait time: 20-30 mins.\n- **Public Transit:** Taking the light rail or metro is highly recommended to bypass parking exit lines.",
    spanish: "🚌 **Información de Transporte y Shuttles:**\n\n- **Autobuses:** Los transbordadores gratuitos conectan con el transporte local y salen cada **5 minutos** tras el partido.\n- **Viajes Compartidos (Uber/Didi):** Las zonas de recogida están activas en el **Estacionamiento E**.\n- **Tránsito Público:** Recomendamos usar el Tren Ligero para evitar el tráfico de salida.",
    french: "🚌 **Transport et Navettes:**\n\n- **Navettes:** Navettes gratuites vers les hubs de transport en commun toutes les **5 minutes** après le match.\n- **Covoiturage (Uber/Lyft):** Les zones de dépose/reprise sont situées au **Parking E**.\n- **Transport public:** Métro/RER fortement recommandé pour éviter les bouchons de sortie.",
    arabic: "🚌 **معلومات النقل والحافلات:**\n\n- **الحافلات:** تنطلق الحافلات المجانية إلى محطات النقل كل **5 دقائق** بعد انتهاء المباراة.\n- **أوبر/تاكسي:** منطقة التجمع المحددة في **الموقف E** (اتبع اللافتات الصفراء).\n- **النقل العام:** يوصى بشدة باستخدام المترو أو القطار الخفيف لتفادي الازدحام."
  },
  {
    keywords: ["bag", "backpack", "purse", "size", "clear bag", "prohibited", "items", "bottle", "camera"],
    english: "🎒 **Stadium Bag Policy & Prohibited Items:**\n\n- **Bag Policy:** Only clear bags smaller than **12\" x 6\" x 12\"** or small clutches under **4.5\" x 6.5\"** are allowed inside the stadium.\n- **Prohibited Items:** Professional cameras (detachable lenses), weapons, glass bottles, and large umbrellas are strictly forbidden.\n- **Bag Storage:** Storage lockers are available outside Gates G1 and G3 for a small fee ($10).",
    spanish: "🎒 **Política de Bolsas y Objetos Prohibidos:**\n\n- **Bolsas:** Solo se permiten bolsas transparentes de menos de **30x15x30 cm** o carteras pequeñas.\n- **Objetos Prohibidos:** Cámaras profesionales, botellas de vidrio, armas y paraguas grandes.\n- **Casilleros:** Hay consigna de equipaje fuera de los Accesos A y C por $200 MXN.",
    french: "🎒 **Politique des Sacs et Objets Interdits:**\n\n- **Sacs:** Seuls les sacs transparents de moins de **30x15x30 cm** sont autorisés.\n- **Objets interdits:** Appareils photo professionnels, bouteilles en verre, armes, grands parapluies.\n- **Consigne:** Des casiers sont disponibles à l'extérieur des Portes G1 et G3 pour 10$.",
    arabic: "🎒 **سياسة الحقائب والمواد المحظورة:**\n\n- **الحقائب:** يُسمح فقط بالحقائب الشفافة التي يقل حجمها عن **12 × 6 × 12 بوصة**.\n- **المواد المحظورة:** الكاميرات الاحترافية، الزجاجات، والأسلحة، والمظلات الكبيرة.\n- **خزائن الحفظ:** تتوفر خزائن خارج البوابات G1 و G3 مقابل رسوم رمزية."
  },
  {
    keywords: ["vegan", "food", "concession", "beer", "water", "drink", "eat", "gluten", "kosher", "halal"],
    english: "🍔 **Food & Beverage Guide:**\n\n- **Vegan/Vegetarian:** Plant-based burgers and vegan hot dogs are available at **Section 117** and **Section 224**.\n- **Gluten-Free:** Options (including GF buns) can be found at the Market Stand in **Section 108**.\n- **Water Refill:** Complimentary water bottle refill stations are located near **Sections 110, 140, 215, and 242**. Fans may bring one empty reusable water bottle (max 20oz, plastic).\n- **Halal/Kosher:** Specialty concessions are located near **Section 130**.",
    spanish: "🍔 **Guía de Comida y Bebidas:**\n\n- **Vegano/Vegetariano:** Hamburguesas veganas disponibles en la **Sección 117** y **Sección 224**.\n- **Sin Gluten (GF):** Opciones en el puesto de comida de la **Sección 108**.\n- **Estaciones de Agua:** Rellene gratis sus botellas de agua cerca de las **Secciones 110 y 215**. Se permite una botella de plástico vacía.\n- **Halal/Kosher:** Alimentos especializados cerca de la **Sección 130**.",
    french: "🍔 **Restauration et Boissons:**\n\n- **Végan/Végétarien:** Burgers végétaux disponibles aux **Sections 117** et **224**.\n- **Sans Gluten:** Options disponibles au stand du marché de la **Section 108**.\n- **Fontaines d'eau:** Des stations gratuites de recharge sont situées près des **Sections 110 et 215**.\n- **Halal/Casher:** Concessions spécialisées près de la **Section 130**.",
    arabic: "🍔 **دليل الأطعمة والمشروبات:**\n\n- **نباتي:** تتوفر وجبات برجر نباتية في **القسم 117** و **القسم 224**.\n- **خالٍ من الجلوتين:** متوفر في كشك السوق بالقسم **108**.\n- **محطات مياه مجانية:** متوفرة بجوار الأقسام **110 و 215**. يُسمح بزجاجة بلاستيكية فارغة واحدة.\n- **حلال:** أكشاك متخصصة بجوار **القسم 130**."
  },
  {
    keywords: ["sustainability", "green", "recycle", "eco", "points", "badge", "carbon", "offset"],
    english: "🌱 **Sustainability & Green Goals Initiative:**\n\nFIFA World Cup 2026 is aiming for zero waste! \n- **Sort Your Waste:** Use the **Blue** bins for plastics/cans, **Green** for compostable food waste, and **Black** for landfill.\n- **Transit Points:** Check in on your app when boarding the shuttle or train to claim **50 Green Points**!\n- **Water Refill:** Avoid single-use plastics. Refill your empty bottle at any stadium water kiosk for **20 Green Points**.\n- **Badges:** Earn the *Eco-Warrior* badge by collecting 150 points during the tournament!",
    spanish: "🌱 **Iniciativa de Sostenibilidad:**\n\n¡La Copa Mundial de la FIFA 2026 apunta al desperdicio cero!\n- **Clasifique Basura:** Contenedores **Azules** para plásticos, **Verdes** para composta y **Negros** para basura general.\n- **Puntos de Tránsito:** Registre su viaje en autobús/tren para ganar **50 Puntos Verdes**.\n- **Recargas de Agua:** Use las estaciones de recarga para evitar plásticos y gane **20 Puntos Verdes**.",
    french: "🌱 **Initiative de Durabilité:**\n\nLa Coupe du Monde de la FIFA 2026 vise le zéro déchet !\n- **Triez vos déchets:** Bacs **Bleus** (plastiques), **Verts** (compost) et **Noirs** (déchets non-recyclables).\n- **Points Transit:** Scannez votre billet de transport public pour recevoir **50 Points Verts**.\n- **Recharge d'eau:** Évitez le plastique à usage unique et gagnez **20 Points Verts** à chaque recharge.",
    arabic: "🌱 **مبادرة الاستدامة البيئية:**\n\nتسعى بطولة كأس العالم 2026 إلى صفر نفايات!\n- **فرز النفايات:** الصناديق **الزرقاء** للبلاستيك، **الخضراء** للسماد، **السوداء** للنفايات العامة.\n- **نقاط النقل:** سجل وصولك في الحافلة أو القطار لتحصل على **50 نقطة خضراء**!\n- **إعادة تعبئة المياه:** تجنب البلاستيك وحصل على **20 نقطة خضراء** عند التعبئة."
  }
];

const DEFAULT_RESPONSES = {
  english: "⚽ **Welcome to the FIFA World Cup 2026 Assistant!**\n\nI can help you with:\n- **Seat Wayfinding** (e.g., 'Where is Section 112?')\n- **Transit & Shuttle Info** (e.g., 'Next shuttle schedule?')\n- **Accessibility Services** (e.g., 'ADA entrance ramp locations')\n- **Stadium Regulations** (e.g., 'Clear bag size policy')\n- **Sustainability Initiatives** (e.g., 'How to claim Eco points')\n\nWhat can I assist you with today?",
  spanish: "⚽ **¡Bienvenido al Asistente de la Copa Mundial FIFA 2026!**\n\nPuedo ayudarle con:\n- **Cómo llegar a su asiento** ('¿Dónde está la Sección 112?')\n- **Transporte y Autobuses** ('¿A qué hora sale el autobús?')\n- **Servicios de Accesibilidad** ('Accesos para sillas de ruedas')\n- **Reglas del Estadio** ('Política de bolsas transparentes')\n- **Sostenibilidad** ('Cómo registrar puntos ecológicos')\n\n¿En qué puedo ayudarle hoy?",
  french: "⚽ **Bienvenue sur l'assistant de la Coupe du Monde FIFA 2026 !**\n\nJe peux vous guider pour :\n- **Trouver votre siège** (ex: « Où est la Section 112 ? »)\n- **Transports et Navettes** (ex: « Horaires de la navette »)\n- **Services d'Accessibilité** (ex: « Accès fauteuil roulant »)\n- **Règlement du Stade** (ex: « Taille limite des sacs »)\n- **Initiatives Éco** (ex: « Gagner des points écologiques »)\n\nComment puis-je vous aider ?",
  arabic: "⚽ **مرحباً بك في مساعد كأس العالم لكرة القدم 2026!**\n\nيمكنني مساعدتك في:\n- **تحديد المقاعد والممرات** (مثال: 'أين يقع القسم 112؟')\n- **النقل والحافلات** (مثال: 'جدول الحافلات القادمة؟')\n- **خدمات ذوي الاحتياجات الخاصة** (مثال: 'مواقع ممرات الكراسي المتحركة')\n- **قوانين الملعب** (مثال: 'سياسة الحقائب الشفافة')\n- **مبادرة الاستدامة** (مثال: 'كيفية تسجيل النقاط البيئية')\n\nكيف يمكنني مساعدتك اليوم؟"
};

// Simulated LLM API response delay
export function simulateChatQuery(stadiumKey, queryText, language = "english") {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedQuery = queryText.toLowerCase();
      
      // Look for keywords in bot responses
      const match = SAMPLE_BOT_RESPONSES.find(response =>
        response.keywords.some(keyword => normalizedQuery.includes(keyword))
      );

      let text = "";
      if (match) {
        text = match[language] || match["english"];
      } else {
        // Fallback or customized stadium answer
        const stadium = STADIUM_DATA[stadiumKey] || STADIUM_DATA.metlife;
        if (normalizedQuery.includes("gate") || normalizedQuery.includes("entrad") || normalizedQuery.includes("accès")) {
          text = `🚧 **Gate Throughput Info at ${stadium.name}:**\n\n`;
          Object.keys(stadium.gates).forEach(key => {
            const gate = stadium.gates[key];
            text += `- **${gate.name} (${key}):** Current Wait: **${gate.waitTime}** — status is *${gate.status}*\n`;
          });
          text += `\n*AI Recommendation:* If entering via Verizon Gate, divert to Pepsi Gate (8 min wait) to save time.`;
        } else if (normalizedQuery.includes("section") || normalizedQuery.includes("sección") || normalizedQuery.includes("siège") || normalizedQuery.includes("seat")) {
          const sectionNum = normalizedQuery.match(/\d+/);
          const num = sectionNum ? sectionNum[0] : "100";
          text = `🗺️ **Wayfinding Assist for Section ${num}:**\n\n- **Nearest Entry:** Enter via **Gate G1** (West Plaza).\n- **Directions:** Take the escalator next to Gate G1 to Level 1. Turn left and Section ${num} will be 50 meters ahead.\n- **Concessions nearby:** Classic Burgers is behind Sec ${num}, and restrooms are located 3 gates to the right.\n- **Accessibility:** Elevators are located directly opposite Section ${num} behind the main concourse pillars.`;
        } else {
          text = DEFAULT_RESPONSES[language] || DEFAULT_RESPONSES["english"];
        }
      }

      resolve(text);
    }, 800); // 800ms artificial latency to mimic LLM generation
  });
}

// GenAI Operations incident resolution logic
const INCIDENT_DATABASE = {
  "INC-001": {
    id: "INC-001",
    title: "Gate 2 Heavy Congestion",
    type: "Crowd Management",
    stadium: "MetLife Stadium",
    severity: "High",
    description: "Gate 2 (Verizon Gate) queue time has peaked at 35 minutes. Ticket scanning scanner unit C is malfunctioning.",
    timestamp: "14:15",
    assignedTo: "Volunteer Group Delta",
    status: "Active",
    aiReport: {
      mitigation: [
        "**Deploy Backup Hardware:** Dispatch Technical Support Team A to Gate 2 with 3 replacement handheld scanners immediately.",
        "**Divert Crowd Inflow:** Activate perimeter digital signage boards to direct arriving transit passengers toward Gate 3 (Pepsi Gate, 8-minute wait).",
        "**Broadcast App Alerts:** Push geo-fenced push notifications to fans within 500m of Gate 2 suggesting they use Gates G1 or G3.",
        "**Adjust Staffing:** Reassign 4 volunteers from VIP Gate to assist with crowd management and manual ticket inspections at Gate 2."
      ],
      dispatch: "🚨 **URGENT DISPATCH - COORDINATION COMMAND:** Technical Support Team A & Volunteers Delta: Please proceed to Gate 2 (Verizon Gate). Scanner Unit C is down, causing queue spikes. Re-routing signage has been enabled. Support technicians bring 3 spares. Volunteers assist with directing overflow to Gate 3. Over.",
      translation: {
        spanish: "⚠️ **Desvío de Flujo (Puerta 2 -> Puerta 3):** 'Estimados aficionados, la Puerta 2 presenta alta afluencia. Por favor utilicen la Puerta 3 para un acceso más rápido. El tiempo estimado de espera es de solo 8 minutos.'",
        french: "⚠️ **Alerte Trafic (Porte 2 -> Porte 3):** 'Chers supporters, la Porte 2 est très encombrée. Veuillez vous diriger vers la Porte 3 pour entrer plus rapidement. L'attente y est de 8 minutes.'"
      }
    }
  },
  "INC-002": {
    id: "INC-002",
    title: "Water Spill near Section 112",
    type: "Logistics & Maintenance",
    stadium: "MetLife Stadium",
    severity: "Medium",
    description: "Large soda/water spill reported on concourse near Section 112 exit. Posing slip hazard.",
    timestamp: "14:22",
    assignedTo: "Unassigned",
    status: "Active",
    aiReport: {
      mitigation: [
        "**Isolate Hazard:** Place wet floor warning cones at Section 112 exit immediately.",
        "**Dispatch Sanitation Crew:** Notify Sanitation Shift Bravo to bring a wet vacuum and mop to Section 112.",
        "**Deploy Volunteers:** Instruct nearest steward to stand by the spill to warn fans walking out of the section until cleanup is completed."
      ],
      dispatch: "🧹 **CLEANUP REQUEST:** Sanitation Crew Bravo and Steward Section 112: Spill reported on concrete concourse near Section 112 exit. High hazard during halftime rush. Position warnings and clear immediately. Confirmed.",
      translation: {
        spanish: "⚠️ **Cuidado Piso Mojado (Sección 112):** 'Tenga cuidado, piso mojado en la salida.'",
        french: "⚠️ **Attention Sol Glissant (Section 112):** 'Attention, sol glissant près de la sortie.'"
      }
    }
  },
  "INC-003": {
    id: "INC-003",
    title: "Language Support Request at Section 204",
    type: "Fan Experience",
    stadium: "MetLife Stadium",
    severity: "Low",
    description: "Group of Japanese-speaking fans looking for accessible shuttle departure locations, unable to communicate with section staff.",
    timestamp: "14:25",
    assignedTo: "Unassigned",
    status: "Active",
    aiReport: {
      mitigation: [
        "**Deploy Interpreter:** Locate Japanese-speaking volunteer on duty and coordinate dispatch via app.",
        "**Utilize Translation Devices:** Instruct Section 204 supervisor to use the 'FanAssist 360' voice-translator mode set to Japanese.",
        "**Print Information Sheet:** Direct fans to Guest Services Desk A where multilingual maps and shuttle guides are available."
      ],
      dispatch: "🗣️ **TRANSLATOR DISPATCH:** Multilingual Vol Team (Japanese Speakers): Please contact Supervisor Section 204. Guest group needs directions to accessible shuttle zones. Provide assistance and route to shuttle station E. Copy.",
      translation: {
        japanese: "🚌 **シャトルバスのご案内 (日本語):** 'シャトルバスはゲートAの正面駐車場Eから5分ごとに出発し、セコーカス・ジャンクション駅へ直行します。車椅子対応車もございます。'",
        spanish: "🗣️ **Ayuda Multilingüe (Japonés):** 'Se solicita voluntario con idioma japonés en la Sección 204 para guiar afición hacia el transbordador.'"
      }
    }
  }
};

export function simulateIncidentAnalysis(incidentId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const incident = INCIDENT_DATABASE[incidentId];
      if (incident) {
        resolve(incident.aiReport);
      } else {
        // Dynamic generation for custom/new incidents
        resolve({
          mitigation: [
            "**Evaluate Incident Area:** Assess surroundings to identify immediate dangers.",
            "**Deploy Staff:** Alert nearby volunteers/staff to assist and cordon off the site.",
            "**Log Details:** Document the event for post-match review and operations intelligence."
          ],
          dispatch: "🚨 **OPERATIONS NOTIFICATION:** General dispatch. Assist with reported incident. Monitor channel 2.",
          translation: {
            spanish: "⚠️ **Atención:** Se está atendiendo una incidencia en la zona. Siga las instrucciones del personal.",
            french: "⚠️ **Attention:** Un incident est en cours de traitement dans la zone. Veuillez suivre les instructions."
          }
        });
      }
    }, 1000); // 1000ms delay for "GenAI processing" effect
  });
}
