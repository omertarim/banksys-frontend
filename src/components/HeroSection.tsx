import React from "react";
import "./HeroSection.css";

const HeroSection = () => (
  <section className="hero-section">
    <div className="hero-content">
      <h1 className="hero-title">BankSys'e Hoş Geldiniz</h1>
      <p className="hero-desc">Güvenli ve kolay bankacılık deneyimi</p>
      <div className="hero-actions">
        <button className="btn-primary">Müşteri Ol</button>
        <button className="btn-outline">Detaylı Bilgi</button>
      </div>
    </div>
    <div className="hero-image">
      <img src="/bank-image.png" alt="Bank Illustration" />
    </div>
  </section>
);

export default HeroSection; 