import React, { useState, useEffect } from "react";
import "./HeroCarousel.css";

const slides = [
  {
    title: "BES başlatarak 8.000 TL bonus kazanmak mı? Birlikte yaparız!",
    desc: "Şimdi dijital kanallardan BES veya Çocuklara BES başlatın; 3.000 TL - 7.999 TL arası ödemelerde 3.000 TL bonus, 8.000 TL ve üzeri ödemelerde 8.000 TL bonus kazanın.",
    img: "/slide1.png",
    primaryBtn: { text: "Detaylı Bilgi", onClick: () => {} },
    secondaryBtn: { text: "Müşterimiz Olun", onClick: () => {} },
  },
  {
    title: "BankSys ile Kolay ve Güvenli Bankacılık",
    desc: "Tüm finansal işlemlerinizi hızlı, güvenli ve kolayca gerçekleştirin.",
    img: "/slide2.png",
    primaryBtn: { text: "Hemen Başla", onClick: () => {} },
    secondaryBtn: { text: "Daha Fazla Bilgi", onClick: () => {} },
  },
  {
    title: "Kredi ve Kart Avantajları Sizi Bekliyor!",
    desc: "BankSys ile avantajlı kredi ve kart fırsatlarını kaçırmayın.",
    img: "/slide3.png",
    primaryBtn: { text: "Kredi Başvurusu", onClick: () => {} },
    secondaryBtn: { text: "Kart Başvurusu", onClick: () => {} },
  },
];

const BankingSVG = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="90" cy="90" r="90" fill="#b3e0f7" />
    <rect x="50" y="70" width="80" height="40" rx="8" fill="#009ee3" />
    <rect x="60" y="80" width="60" height="20" rx="4" fill="#fff" />
    <rect x="70" y="90" width="40" height="6" rx="3" fill="#009ee3" />
  </svg>
);

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className="hero-carousel">
      <div className="carousel-slide">
        <div className="carousel-content">
          <h1 className="carousel-title">{slides[current].title}</h1>
          <p className="carousel-desc">{slides[current].desc}</p>
          <div className="carousel-actions">
            <button className="btn-primary">{slides[current].primaryBtn.text}</button>
            <button className="btn-outline">{slides[current].secondaryBtn.text}</button>
          </div>
        </div>
        <div className="carousel-image">
          {slides[current].img ? (
            <img src={slides[current].img} alt="slide" onError={e => (e.currentTarget.style.display = 'none')} />
          ) : (
            <BankingSVG />
          )}
        </div>
      </div>
      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={"dot" + (idx === current ? " active" : "")}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel; 