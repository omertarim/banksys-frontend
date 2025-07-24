import React from "react";
import "./HeroCarousel.css"; // CSS aynı kalsın, sadece birkaç ek yapacağız

const HeroSection = () => {
  const slide = {
    title: "BES başlatarak 8.000 TL bonus kazanmak mı? Birlikte yaparız!",
    desc: "Şimdi dijital kanallardan BES veya Çocuklara BES başlatın; 3.000 TL - 7.999 TL arası ödemelerde 3.000 TL bonus, 8.000 TL ve üzeri ödemelerde 8.000 TL bonus kazanın.",
    adImage: "/ads/BES-2025.png", // ✅ yeni arka plan
    primaryBtn: { text: "Detaylı Bilgi", onClick: () => {} },
    secondaryBtn: { text: "Müşterimiz Olun", onClick: () => {} },
  };

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${slide.adImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="hero-content"
        style={{
          backgroundColor: "rgba(255,255,255,0.88)",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <h1 className="hero-title">{slide.title}</h1>
        <p className="hero-desc">{slide.desc}</p>
        <div className="hero-actions">
          <button className="btn-primary">{slide.primaryBtn.text}</button>
          <button className="btn-outline">{slide.secondaryBtn.text}</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
