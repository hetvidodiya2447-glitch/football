<div align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdhp-a2aYjMJ9HlFq-cgaPJQ2RYId7XLKYL8n1gMuUf_-_8yidAD03RDTdWGa2tIp82htJ7x0xwl0Vxrkt9MTmrMfos6J1BniCFqyJohGyUK-QUOf4fjEoUdlFuOhbqVZ1CkSfOJvtocehQEY-sGh9PXWWvDoqxVd0Njk_jFYfcpbcGb6pZniEra1snMAFZxINC6e3F7MLRtJHz-puBuVlUbcsAcwxYFk3SiYIF7igx4zZlJTH3x6evw" alt="Stadium Buddy Logo" width="120" />

  # ⚡ STADIUM BUDDY ⚡

  <p><b>Your Next-Generation Smart Venue Operating System</b></p>
  
  <a href="https://stadium-buddy.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Stadium_Buddy-primary?style=for-the-badge&color=DFFF00&labelColor=000000" alt="Live Demo" />
  </a>
  <br><br>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-Ready-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E.svg?style=for-the-badge&logo=supabase)](https://supabase.com/)

  *Command center telemetry. Fan-first experiences. 1,820+ global arenas.* 🌍
</div>

---

## 🎮 What is Stadium Buddy?

Ever wondered what it feels like to run a massive stadium with the push of a button? 🏟️ 

**Stadium Buddy** is a fully dynamic, role-based platform that brings venue management into the future. Whether you're an **Organizer** preventing a crowd bottleneck, a **Staff** member handling a medical emergency, or a **Fan** grabbing a pre-match burger combo—Stadium Buddy handles it all in real-time.

<details>
<summary><b>✨ Click here to see the Magic behind the curtain!</b></summary>
<br>
We use a <b>Live Telemetry Crowd Engine</b> to simulate wait times, a <b>Multilingual GenAI Translation Engine</b> to localize the app into 5+ languages instantly, and <b>OSM Live Data</b> to let you deploy this OS into literally *any* major stadium in the world.
</details>

---

## 🚀 Epic Features

### 👨‍✈️ Choose Your Role:
- 👑 **Organizers / Admins:** Step into the Command Center. View live crowd heatmaps, intercept alerts, and deploy staff with a click.
- 🛡️ **Staff / Operations:** Your boots-on-the-ground view. Get live assignments, handle incidents, and keep the venue safe.
- 🎉 **Fans:** Live scores, digital wayfinding, weather updates, and VIP merchandise drops! 

### 🌍 Global Stadium Deployment
> Search for **Wembley**, **Camp Nou**, or *any* local stadium using our live OpenStreetMap integration. One click deploys a custom OS instance for that exact location. Boom. 💥

### 🤖 Smart GenAI Translations
Bonjour? Hola? العربية?
The app dynamically translates everything—from UI buttons to live emergency announcements—using a locale-aware translation helper (with full RTL support!).

### 🌦️ Hyper-Local Weather
Is it going to rain on the pitch? The **OpenWeather API** keeps fans and admins informed with live metrics right on the dashboard.

---

## 🎨 Visual Identity & Design System

The aesthetic follows a **Cyber-Athletic** movement: a fusion of futuristic Neo-Brutalism and Glassmorphism. The interface evokes a sense of "digital precision" and "kinetic energy." It utilizes high-contrast visuals, data-dense layouts, and technical flourishes like scanlines and neon glows.

- **Background**: Midnight Black (`#000000`) base to maximize contrast and power efficiency.
- **Primary Accent (Cyber Volt)**: A high-visibility neon yellow-green (`#DFFF00`) used exclusively for critical actions, success states, and primary data points.
- **Secondary Accent (Electric Violet)**: An energetic purple (`#DCB8FF`) for interactive actions, highlights, and secondary sets.
- **Typography**: The variable font family **Anybody** is used exclusively to create a technical, high-performance atmosphere. Headlines utilize Bold and Italic Expanded weights to command attention, while body text remains in cased normal weight.
- **CRT Scanlines**: A subtle, horizontal scanline pattern overlay on the viewport enhances the futuristic monitor HUD aesthetic.
- **Glassmorphism**: Translucent Slate Grey containers (`rgba(26, 26, 26, 0.7)`) with background blurs and thin muted borders act as the structural frames of all cards.

---

## 🛠️ The Tech Arsenal

| Category | Tech |
| :--- | :--- |
| **Core** | React 18, Vite |
| **Styling** | Tailwind CSS (Cyber-Athletic Theme) |
| **Backend & Auth** | Supabase Client v2 |
| **APIs** | Nominatim (OSM Map coordinates), OpenWeather API |
| **Icons** | Lucide React |

---

## 🏎️ Start Your Engines (Setup Guide)

Ready to launch? Follow these steps to get your local environment running:

### 1️⃣ Clone it down
```bash
git clone https://github.com/your-username/stadium-buddy.git
cd stadium-buddy
```

### 2️⃣ Install the gear
```bash
npm install
```

### 3️⃣ Hook up the APIs
Create a `.env` file in the root folder and drop in your secret keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```
*(Psst! Make sure your Supabase project has a `profiles` table to handle the role-based routing!)*

### 4️⃣ Ignite!
```bash
npm run dev
```
Open up `http://localhost:5173` and prepare to be amazed. ✨

---

<div align="center">
  <p>Built with ❤️ and way too much ☕.</p>
  <b><a href="#">Report a Bug</a> • <a href="#">Request a Feature</a></b>
</div>
