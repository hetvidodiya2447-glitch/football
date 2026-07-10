import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { simulateChatQuery } from "../utils/aiSimulator";

const WELCOME_MESSAGES = {
  english: "⚽ **Welcome to the FIFA World Cup 2026 Assistant!**\n\nI can help you with:\n- **Seat Wayfinding** (e.g., 'Where is Section 112?')\n- **Transit & Shuttle Info** (e.g., 'Next shuttle schedule?')\n- **Accessibility Services** (e.g., 'ADA entrance ramp locations')\n- **Stadium Regulations** (e.g., 'Clear bag size policy')\n- **Sustainability Initiatives** (e.g., 'How to claim Eco points')\n\nWhat can I assist you with today?",
  spanish: "⚽ **¡Bienvenido al Asistente de la Copa Mundial FIFA 2026!**\n\nPuedo ayudarle con:\n- **Cómo llegar a su asiento** ('¿Dónde está la Sección 112?')\n- **Transporte y Autobuses** ('¿A qué hora sale el autobús?')\n- **Servicios de Accesibilidad** ('Accesos para sillas de ruedas')\n- **Reglas del Estadio** ('Política de bolsas transparentes')\n- **Sostenibilidad** ('Cómo registrar puntos ecológicos')\n\n¿En qué puedo ayudarle hoy?",
  french: "⚽ **Bienvenue sur l'assistant de la Coupe du Monde FIFA 2026 !**\n\nJe peux vous guider pour :\n- **Trouver votre siège** (ex: « Où est la Section 112 ? »)\n- **Transports et Navettes** (ex: « Horaires de la navette »)\n- **Services d'Accessibilité** (ex: « Accès fauteuil roulant »)\n- **Règlement du Stade** (ex: « Taille limite des sacs »)\n- **Initiatives Éco** (ex: « Gagner des points écologiques »)\n\nComment puis-je vous aider ?",
  arabic: "⚽ **مرحباً بك في مساعد كأس العالم لكرة القدم 2026!**\n\nيمكنني مساعدتك في:\n- **تحديد المقاعد والممرات** (مثال: 'أين يقع القسم 112؟')\n- **النقل والحافلات** (مثال: 'جدول الحافلات القادمة؟')\n- **خدمات ذوي الاحتياجات الخاصة** (مثال: 'مواقع ممرات الكراسي المتحركة')\n- **قوانين الملعب** (مثال: 'سياسة الحقائب الشفافة')\n- **مبادرة الاستدامة** (مثال: 'كيفية تسجيل النقاط البيئية')\n\nكيف يمكنني مساعدتك اليوم؟"
};

const PROMPT_SUGGESTIONS = {
  english: [
    { label: "♿ ADA Access", query: "ADA entrance ramp locations" },
    { label: "🚌 Shuttle Hubs", query: "Shuttle bus schedule and transit parking" },
    { label: "🎒 Bag Policy", query: "Clear bag size restrictions and lockers" },
    { label: "🍔 Vegan Food", query: "Where to buy vegan food and water refill" }
  ],
  spanish: [
    { label: "♿ Acceso ADA", query: "Accesos para sillas de ruedas y rampas" },
    { label: "🚌 Autobuses", query: "Horario de transbordadores y metro" },
    { label: "🎒 Bolsas", query: "Reglamento de mochilas y bolsas transparentes" },
    { label: "🍔 Comida Vegana", query: "Comida vegana y recarga de agua" }
  ],
  french: [
    { label: "♿ Accès ADA", query: "Accès fauteuil roulant et rampes" },
    { label: "🚌 Navettes", query: "Horaires des navettes et transports" },
    { label: "🎒 Sacs", query: "Taille des sacs et consigne" },
    { label: "🍔 Végan", query: "Plats végans et recharge bouteille d'eau" }
  ],
  arabic: [
    { label: "♿ ممرات ADA", query: "مواقع ممرات الكراسي المتحركة" },
    { label: "🚌 الحافلات", query: "جدول الحافلات والنقل" },
    { label: "🎒 الحقائب", query: "سياسة الحقائب الشفافة والمحفوظات" },
    { label: "🍔 طعام نباتي", query: "أين أجد طعام نباتي ومحطات المياه" }
  ]
};

export default function AIConcierge({ stadiumKey, language }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Initialize/Reset welcome message on language change
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES["english"]
      }
    ]);
  }, [language]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Append User Message
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Call GenAI Simulator
    const responseText = await simulateChatQuery(stadiumKey, text, language);
    
    // Append Bot Message
    const botMsg = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: responseText
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  // Helper to format bot markdown text to simple HTML structures safely
  const renderMarkdown = (text) => {
    return text.split("\n").map((line, idx) => {
      let formattedLine = line;

      // Bold text formatting **bold**
      const boldRegex = /\*\*(.*?)\*\*/g;
      formattedLine = formattedLine.replace(boldRegex, "<strong>$1</strong>");

      // Bullet points
      if (formattedLine.startsWith("- ")) {
        return (
          <li key={idx} style={{ marginLeft: "16px", marginBottom: "4px" }} dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />
        );
      }
      
      // Inline icons or details
      if (formattedLine.trim() === "") {
        return <div key={idx} style={{ height: "8px" }} />;
      }

      return <p key={idx} style={{ marginBottom: "6px" }} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  const suggestions = PROMPT_SUGGESTIONS[language] || PROMPT_SUGGESTIONS["english"];

  return (
    <div className="chat-window card" style={{ height: "100%", minHeight: "500px" }}>
      <div className="card-header" style={{ borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ padding: "6px", backgroundColor: "var(--success-bg)", color: "var(--success)", borderRadius: "50%" }}>
            <Sparkles size={16} />
          </div>
          <div>
            <span className="card-title">GenAI Assistant</span>
            <div style={{ fontSize: "10px", color: "var(--success)" }}>
              ● Multilingual Concierge (Gemini 3.5 Active)
            </div>
          </div>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-bubble ${msg.sender === "bot" ? "bot" : "user"}`}
          >
            {msg.sender === "bot" ? renderMarkdown(msg.text) : <p>{msg.text}</p>}
          </div>
        ))}

        {isTyping && (
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
      </div>

      {/* Quick suggestions row */}
      <div className="quick-prompts-container">
        {suggestions.map((sug, idx) => (
          <div 
            key={idx} 
            className="quick-prompt-pill"
            onClick={() => handleSend(sug.query)}
          >
            {sug.label}
          </div>
        ))}
      </div>

      {/* Input row */}
      <form 
        className="chat-input-area"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
      >
        <input 
          type="text" 
          className="input" 
          placeholder={
            language === "spanish" ? "Escribe tu pregunta aquí..." :
            language === "french" ? "Écrivez votre question ici..." :
            language === "arabic" ? "اكتب سؤالك هنا..." :
            "Ask about parking, seats, food, rules..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: "38px", height: "38px", padding: 0, borderRadius: "50%", flexShrink: 0 }}
          disabled={!inputText.trim() || isTyping}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
