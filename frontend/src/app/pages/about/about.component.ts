import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about-page">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-inner">
          <div class="hero-badge">À propos du projet</div>
          <h1>Cloud<span class="accent">Mart</span></h1>
          <p class="hero-sub">
            Une marketplace moderne full-stack, conçue pour démontrer l'architecture
            microservices en action — de la commande en temps réel à la gestion admin.
          </p>
          <div class="hero-chips">
            <span class="chip chip-green">✓ Open Source</span>
            <span class="chip chip-blue">✓ Microservices</span>
            <span class="chip chip-purple">✓ Full Stack</span>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">6</div>
            <div class="stat-label">Microservices</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">100+</div>
            <div class="stat-label">Produits</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">3</div>
            <div class="stat-label">Bases de données</div>
          </div>
          <div class="stat-card accent">
            <div class="stat-num">∞</div>
            <div class="stat-label">Possibilités</div>
          </div>
        </div>
      </section>

      <!-- Description -->
      <section class="content-section">
        <div class="section-grid">

          <div class="info-card">
            <div class="card-icon">🎯</div>
            <h3>Le projet</h3>
            <p>
              CloudMart est une plateforme e-commerce complète construite sur une architecture
              microservices. Elle intègre la gestion des utilisateurs, des produits, des commandes
              et des notifications — le tout orchestré via une API Gateway et un service discovery Eureka.
            </p>
            <p>
              L'objectif : démontrer comment des services indépendants communiquent en temps réel
              dans un environnement Docker Compose, avec une interface Angular moderne côté client.
            </p>
          </div>

          <div class="info-card">
            <div class="card-icon">⚡</div>
            <h3>Fonctionnalités clés</h3>
            <ul class="feature-list">
              <li><span class="dot green"></span> Catalogue de produits dynamique (API DummyJSON)</li>
              <li><span class="dot green"></span> Authentification utilisateur & rôles (ADMIN / CUSTOMER)</li>
              <li><span class="dot green"></span> Panier persistant & passage de commande</li>
              <li><span class="dot green"></span> Tableau de bord admin — CRUD produits en temps réel</li>
              <li><span class="dot green"></span> Notifications asynchrones via RabbitMQ</li>
              <li><span class="dot green"></span> Sessions isolées par onglet (sessionStorage)</li>
              <li><span class="dot green"></span> Design responsive & thème sombre</li>
            </ul>
          </div>

        </div>
      </section>

      <!-- Stack technique -->
      <section class="stack-section">
        <h2 class="section-title">Stack technique</h2>
        <div class="stack-grid">
          <div class="stack-group">
            <div class="stack-label">Backend</div>
            <div class="stack-tags">
              <span class="tag">Spring Boot 3.5</span>
              <span class="tag">Spring Cloud Gateway</span>
              <span class="tag">Netflix Eureka</span>
              <span class="tag">RabbitMQ</span>
              <span class="tag">Java 17</span>
            </div>
          </div>
          <div class="stack-group">
            <div class="stack-label">Bases de données</div>
            <div class="stack-tags">
              <span class="tag tag-blue">PostgreSQL 15</span>
              <span class="tag tag-blue">MongoDB 7</span>
              <span class="tag tag-blue">H2 (tests)</span>
            </div>
          </div>
          <div class="stack-group">
            <div class="stack-label">Frontend</div>
            <div class="stack-tags">
              <span class="tag tag-red">Angular 21</span>
              <span class="tag tag-red">TypeScript</span>
              <span class="tag tag-red">RxJS</span>
              <span class="tag tag-red">Nginx</span>
            </div>
          </div>
          <div class="stack-group">
            <div class="stack-label">Infrastructure</div>
            <div class="stack-tags">
              <span class="tag tag-orange">Docker</span>
              <span class="tag tag-orange">Docker Compose</span>
              <span class="tag tag-orange">Maven</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Architecture -->
      <section class="arch-section">
        <h2 class="section-title">Architecture</h2>
        <div class="arch-diagram">
          <div class="arch-layer">
            <div class="arch-node frontend-node">Angular 21<br/><small>:4200</small></div>
          </div>
          <div class="arch-arrow">↓ HTTP</div>
          <div class="arch-layer">
            <div class="arch-node gateway-node">API Gateway<br/><small>:8090</small></div>
          </div>
          <div class="arch-arrow">↓ lb:// (Eureka)</div>
          <div class="arch-layer services-layer">
            <div class="arch-node svc-node">User<br/><small>:8082</small></div>
            <div class="arch-node svc-node">Product<br/><small>:8083</small></div>
            <div class="arch-node svc-node">Order<br/><small>:8084</small></div>
            <div class="arch-node svc-node mq-node">Notification<br/><small>RabbitMQ</small></div>
          </div>
          <div class="arch-arrow">↓</div>
          <div class="arch-layer services-layer">
            <div class="arch-node db-node">PostgreSQL</div>
            <div class="arch-node db-node db-mongo">MongoDB</div>
          </div>
        </div>
      </section>

      <!-- Auteur -->
      <section class="author-section">
        <div class="author-card">
          <div class="author-avatar">WU</div>
          <div class="author-info">
            <div class="author-role">Développeur & Concepteur</div>
            <h2 class="author-name">Wisdom Uzochi</h2>
            <p class="author-bio">
              Passionné par l'architecture logicielle, le développement full-stack et
              les systèmes distribués. CloudMart est un projet de démonstration conçu
              pour explorer les microservices Java avec Spring Boot et Angular.
            </p>
            <div class="author-links">
              <a href="mailto:uzochiwisdom72@gmail.com" class="contact-btn">
                <span class="contact-icon">✉️</span>
                uzochiwisdom72&#64;gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <section class="cta-section">
        <div class="cta-inner">
          <p>Vous êtes sur CloudMart — découvrez le catalogue</p>
          <a routerLink="/" class="btn-cta">Voir les produits →</a>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .about-page {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem 5rem;
    }

    /* ─── Hero ─── */
    .hero {
      position: relative;
      text-align: center;
      padding: 4rem 2rem 3rem;
      overflow: hidden;
    }

    .hero-glow {
      position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(ellipse at 30% 0%, rgba(0,168,89,0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 70% 0%, rgba(51,85,238,0.07) 0%, transparent 60%);
    }

    .hero-inner { position: relative; z-index: 1; }

    .hero-badge {
      display: inline-block;
      background: var(--green-dim); color: var(--green-dark);
      border: 1px solid rgba(0,168,89,0.3);
      padding: 0.3rem 1rem; border-radius: 999px;
      font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 1.2rem;
    }

    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 900; letter-spacing: -0.05em;
      color: var(--text); line-height: 1.05;
      margin-bottom: 1rem;
    }

    .accent { color: var(--green); }

    .hero-sub {
      max-width: 580px; margin: 0 auto 1.5rem;
      color: var(--muted); font-size: 1.05rem; line-height: 1.7;
    }

    .hero-chips { display: flex; justify-content: center; gap: 0.6rem; flex-wrap: wrap; }

    .chip {
      padding: 0.35rem 1rem; border-radius: 999px;
      font-size: 0.78rem; font-weight: 600;
    }
    .chip-green { background: var(--green-dim); color: var(--green-dark); border: 1px solid rgba(0,168,89,0.25); }
    .chip-blue  { background: var(--blue-dim);  color: var(--blue);       border: 1px solid rgba(51,85,238,0.25); }
    .chip-purple{ background: rgba(120,80,255,0.08); color: #7855ff; border: 1px solid rgba(120,80,255,0.2); }

    /* ─── Stats ─── */
    .stats-section { padding: 0 0 2.5rem; }

    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    .stat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.4rem;
      text-align: center; transition: var(--transition);
    }
    .stat-card:hover { border-color: rgba(0,168,89,0.3); transform: translateY(-2px); box-shadow: var(--shadow); }
    .stat-card.accent { border-color: rgba(0,168,89,0.3); background: var(--green-dim); }

    .stat-num {
      font-size: 2rem; font-weight: 900;
      color: var(--green); letter-spacing: -0.04em;
    }
    .stat-label { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.2rem; }

    /* ─── Content ─── */
    .content-section { padding: 0 0 3rem; }

    .section-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 640px) { .section-grid { grid-template-columns: 1fr; } }

    .info-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.8rem;
      transition: var(--transition);
    }
    .info-card:hover { border-color: rgba(51,85,238,0.2); box-shadow: var(--shadow); }

    .card-icon { font-size: 1.8rem; margin-bottom: 0.8rem; }

    .info-card h3 {
      font-size: 1rem; font-weight: 700; color: var(--text);
      letter-spacing: -0.02em; margin-bottom: 0.8rem;
    }

    .info-card p {
      font-size: 0.88rem; color: var(--muted); line-height: 1.7;
      margin-bottom: 0.8rem;
    }
    .info-card p:last-child { margin-bottom: 0; }

    .feature-list { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }

    .feature-list li {
      display: flex; align-items: center; gap: 0.7rem;
      font-size: 0.85rem; color: var(--muted);
    }

    .dot {
      width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    }
    .dot.green { background: var(--green); box-shadow: 0 0 4px var(--green); }

    /* ─── Stack ─── */
    .stack-section { padding: 0 0 3rem; }

    .section-title {
      font-size: 1.3rem; font-weight: 800; letter-spacing: -0.03em;
      color: var(--text); margin-bottom: 1.5rem;
    }

    .stack-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 1.2rem;
    }
    @media (max-width: 640px) { .stack-grid { grid-template-columns: 1fr; } }

    .stack-group {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.2rem 1.4rem;
    }

    .stack-label {
      font-size: 0.68rem; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem;
    }

    .stack-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

    .tag {
      padding: 0.25rem 0.7rem; border-radius: 999px;
      font-size: 0.75rem; font-weight: 600;
      background: var(--surface2); color: var(--muted);
      border: 1px solid var(--border);
    }
    .tag-blue   { background: var(--blue-dim); color: var(--blue); border-color: rgba(51,85,238,0.2); }
    .tag-red    { background: rgba(224,40,66,0.08); color: #c01; border-color: rgba(224,40,66,0.2); }
    .tag-orange { background: rgba(255,140,0,0.08); color: #b35000; border-color: rgba(255,140,0,0.2); }

    /* ─── Architecture ─── */
    .arch-section { padding: 0 0 3rem; }

    .arch-diagram {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 2rem;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    }

    .arch-layer { display: flex; justify-content: center; }
    .services-layer { gap: 0.8rem; flex-wrap: wrap; }

    .arch-arrow { font-size: 0.78rem; color: var(--muted); font-weight: 600; }

    .arch-node {
      padding: 0.6rem 1.1rem; border-radius: var(--radius-sm);
      font-size: 0.78rem; font-weight: 600; text-align: center;
      border: 1.5px solid var(--border); background: var(--surface2);
      color: var(--text); line-height: 1.4;
    }
    .arch-node small { display: block; font-size: 0.68rem; color: var(--muted); font-weight: 400; }

    .frontend-node { border-color: rgba(224,40,66,0.35); background: rgba(224,40,66,0.05); }
    .gateway-node  { border-color: rgba(51,85,238,0.35); background: rgba(51,85,238,0.05); }
    .svc-node      { border-color: rgba(0,168,89,0.3); background: rgba(0,168,89,0.04); }
    .mq-node       { border-color: rgba(255,140,0,0.3); background: rgba(255,140,0,0.05); }
    .db-node       { border-color: rgba(120,80,255,0.3); background: rgba(120,80,255,0.05); color: #7855ff; }
    .db-mongo      { border-color: rgba(0,168,89,0.3); color: var(--green-dark); background: var(--green-dim); }

    /* ─── Auteur ─── */
    .author-section { padding: 0 0 3rem; }

    .author-card {
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 2.5rem; display: flex; gap: 2rem; align-items: flex-start;
      position: relative; overflow: hidden;
    }

    .author-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--green), var(--blue));
    }

    @media (max-width: 640px) { .author-card { flex-direction: column; align-items: center; text-align: center; } }

    .author-avatar {
      width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 900; color: #fff;
      box-shadow: 0 0 0 4px rgba(0,168,89,0.15), 0 0 24px rgba(0,168,89,0.1);
    }

    .author-role {
      font-size: 0.72rem; font-weight: 700; color: var(--green);
      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.3rem;
    }

    .author-name {
      font-size: 1.7rem; font-weight: 900; color: var(--text);
      letter-spacing: -0.04em; margin-bottom: 0.8rem;
    }

    .author-bio {
      font-size: 0.9rem; color: var(--muted); line-height: 1.7;
      max-width: 520px; margin-bottom: 1.2rem;
    }

    .author-links { display: flex; gap: 0.8rem; flex-wrap: wrap; }

    .contact-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: var(--surface); border: 1.5px solid var(--border);
      border-radius: 999px; text-decoration: none;
      color: var(--text); font-size: 0.85rem; font-weight: 600;
      transition: var(--transition);
    }
    .contact-btn:hover {
      border-color: var(--blue); color: var(--blue);
      background: var(--blue-dim);
    }
    .contact-icon { font-size: 1rem; }

    /* ─── CTA ─── */
    .cta-section {
      background: linear-gradient(135deg, #1a1a38 0%, #0f2040 100%);
      border-radius: var(--radius); padding: 2rem;
      margin-top: 1rem;
    }

    .cta-inner {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem;
    }

    .cta-inner p { color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; }

    .btn-cta {
      padding: 0.7rem 1.6rem;
      background: linear-gradient(135deg, var(--green), var(--green-dark));
      color: #fff; border-radius: var(--radius-sm);
      text-decoration: none; font-weight: 700; font-size: 0.9rem;
      transition: var(--transition); box-shadow: 0 2px 12px rgba(0,168,89,0.3);
    }
    .btn-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,168,89,0.45); }
  `]
})
export class AboutComponent {}
