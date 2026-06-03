import { useState, useEffect, useRef } from "react";
import "./Menu.css";
import Header from "../header/header";
import { Link } from "react-router-dom";


/* ─── REVEAL  ────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── SUBCOMPONENTS ──────────────────────── */
function RevealDiv({ className, children, style }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className || ""}`} style={style}>{children}</div>;
}

function MenuItem({ item }) {
  return (
    <div className="menu-item">
      <div className="menu-item__info">
        <div className="menu-item__name">{item.name}</div>
        {item.desc && <div className="menu-item__desc">{item.desc}</div>}
      </div>
      <span className="menu-item__dots" />
      <div className="menu-item__price">{item.price}</div>
    </div>
  );
}



/* ─── MAIN COMPONENT ─────────────────────── */
export default function Menu() {
  const [activeTab, setActiveTab] = useState("alacarte");

  return (
    <>
      {/* ── NAV ── */}
 

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__line" />
        <div className="hero__bg-text">Épicurien</div>

        <p className="hero__year">Depuis 1952 · Lyon, France</p>
        <h1 className="hero__title">
          Le Festin
          <em>Épicurien</em>
        </h1>
        <p className="hero__sub">Cuisine française moderne · Table gastronomique</p>

        <div className="hero__cta">
          <Link to="/reservation"><button className="hero__btn hero__btn--primary">Réserver une table</button></Link>
          <Link to="/menu-carte"><button className="hero__btn hero__btn--outline">Découvrir les menus</button></Link>
        </div>

        <div className="hero__scroll">Descendre</div>
      </section>

      {/* ── IDENTITY ── */}
      <section id="histoire" className="identity">
        <div className="identity__inner">

          <div className="identity__left">
            <RevealDiv>
              <p className="section-label">Notre histoire</p>
              <h2 className="section-title">
                Septante ans<br />de <em>passion</em>
              </h2>
            </RevealDiv>
            <RevealDiv className="identity__stats">
              <div className="stat">
                <div className="stat__num">1952</div>
                <div className="stat__label">Année de fondation</div>
              </div>
              <div className="stat">
                <div className="stat__num">3</div>
                <div className="stat__label">Générations de Chefs</div>
              </div>
              <div className="stat">
                <div className="stat__num">42</div>
                <div className="stat__label">Couverts par service</div>
              </div>
            </RevealDiv>
          </div>

          <div className="identity__text">
            <RevealDiv>
              <p>
                Fondé en <strong>1952</strong> par Georges Vaillant, chef de formation classique revenu des brigades parisiennes avec l'ambition de porter la grande cuisine française en région lyonnaise, <strong>Le Festin Épicurien</strong> s'est imposé en quelques saisons comme une adresse de référence dans la capitale des Gaules.
              </p>
              <p>
                Transmis de père en fils, l'établissement célèbre aujourd'hui plus de <strong>sept décennies d'excellence culinaire</strong>. Chaque génération a su faire évoluer la carte tout en préservant l'âme du lieu : un attachement profond aux producteurs locaux, une exigence intransigeante sur la qualité des matières premières et le respect de la saisonnalité.
              </p>
              <p>
                La cuisine du Festin Épicurien est une <strong>cuisine française moderne</strong> : les fondamentaux de la tradition — les fonds, les sauces, les cuissons longues — y sont revisités avec une sensibilité contemporaine, sans jamais sacrifier le goût à la forme. C'est une table où l'on mange bien, vraiment, et où l'on revient.
              </p>
            </RevealDiv>

            <RevealDiv>
              <div className="identity__location">
                <div className="location__icon">📍</div>
                <div className="location__detail">
                  <div className="location__name">Le Festin Épicurien</div>
                  <div className="location__address">
                    14, rue des Marronniers · 69002 Lyon, France<br />
                    À deux pas de la place Bellecour · Presqu'île de Lyon<br />
                    <br />
                    <strong style={{ color: "var(--charcoal)", fontWeight: 500 }}>Métro :</strong> Bellecour (ligne A & D) · 5 min à pied
                  </div>
                </div>
              </div>
            </RevealDiv>
          </div>

        </div>
      </section>

      {/* ── VALUES ── */}
      <RevealDiv className="values">
        <div className="values__inner">
          <div className="value-item">
            <span className="value-item__icon">🌿</span>
            <div className="value-item__title">Produits de saison</div>
            <div className="value-item__desc">Carte renouvelée chaque trimestre, selon les arrivages des marchés et des producteurs de la région Auvergne-Rhône-Alpes.</div>
          </div>
          <div className="value-item">
            <span className="value-item__icon">🤝</span>
            <div className="value-item__title">Circuits courts</div>
            <div className="value-item__desc">Partenariats directs avec des maraîchers, éleveurs et vignerons locaux. Plus de 80 % des produits proviennent d'un rayon de 200 km.</div>
          </div>
          <div className="value-item">
            <span className="value-item__icon">🍷</span>
            <div className="value-item__title">Cave d'exception</div>
            <div className="value-item__desc">Plus de 400 références, dominante Bourgogne et Vallée du Rhône. Notre sommelier vous accompagne dans les accords mets & vins.</div>
          </div>
          <div className="value-item">
            <span className="value-item__icon">👨‍🍳</span>
            <div className="value-item__title">Savoir-faire artisanal</div>
            <div className="value-item__desc">Toutes les préparations sont réalisées en cuisine, des pains du matin aux mignardises du café. Rien n'est sous-traité.</div>
          </div>
        </div>
      </RevealDiv>
{/*
      {/* ── MENUS ── 
      <section id="menus" className="menu-section">
        <div className="menu-section__inner">

          <div className="menu-section__header">
            <RevealDiv>
              <p className="section-label">La carte</p>
              <h2 className="section-title">
                Nos <em>menus</em>
              </h2>
              <div className="menu-ornament">
                <span />
                <em>Saison Automne · Hiver</em>
                <span />
              </div>
            </RevealDiv>
          </div>
          

          <RevealDiv>
            <div className="menu-tabs">
              {Object.entries(MENUS).map(([key, m]) => (
                <button
                  key={key}
                  className={`menu-tab ${activeTab === key ? "menu-tab--active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </RevealDiv>

          <RevealDiv>
            <MenuCard menu={MENUS[activeTab]} />
          </RevealDiv>

        </div>
      </section>
      */}

      {/* ── AMBIANCE ── */}
      <section id="ambiance" className="ambiance">
        <div className="ambiance__inner">

          <div>
            <RevealDiv>
              <p className="section-label" style={{ color: "var(--gold)" }}>L'expérience</p>
              <h2 className="section-title">
                Une salle,<br /><em>une atmosphère</em>
              </h2>
            </RevealDiv>
            <RevealDiv className="ambiance__text">
              <p>
                Installé dans un hôtel particulier du XIXe siècle au cœur de la Presqu'île lyonnaise, le Festin Épicurien offre un cadre d'une élégance rare. Moulures au plafond, parquet en point de Hongrie, luminaires en laiton : la salle respire l'authenticité sans jamais verser dans le muséal.
              </p>
              <p>
                Avec seulement <strong style={{ color: "rgba(245,240,232,0.8)" }}>42 couverts</strong>, chaque service est pensé comme une expérience intime. Le silence feutré de la salle, la mise en place soignée et la discrétion du service contribuent à une atmosphère propice à la conversation et à la dégustation.
              </p>
              <p>
                Une salle privée de <strong style={{ color: "rgba(245,240,232,0.8)" }}>12 couverts</strong> est également disponible sur réservation pour vos déjeuners d'affaires, dîners de famille ou événements privés.
              </p>
            </RevealDiv>
          </div>

          <RevealDiv>
            <div className="ambiance__highlights">
              <div className="highlight">
                <span className="highlight__icon">🕯️</span>
                <div className="highlight__text">
                  <div className="highlight__title">Service en salle</div>
                  <div className="highlight__desc">Maître d'hôtel et équipe dédiée, service à la française, découpe et flambées en salle sur demande.</div>
                </div>
              </div>
              <div className="highlight">
                <span className="highlight__icon">🍾</span>
                <div className="highlight__text">
                  <div className="highlight__title">Cave & Sommellerie</div>
                  <div className="highlight__desc">Plus de 400 références. Accords mets & vins suggérés par notre sommelier, verre au verre disponible.</div>
                </div>
              </div>
              <div className="highlight">
                <span className="highlight__icon">🎂</span>
                <div className="highlight__text">
                  <div className="highlight__title">Événements privés</div>
                  <div className="highlight__desc">Salle privatisable pour 12 personnes. Menus sur-mesure, décoration et accord mets & vins personnalisés.</div>
                </div>
              </div>
              <div className="highlight">
                <span className="highlight__icon">♿</span>
                <div className="highlight__text">
                  <div className="highlight__title">Accessibilité</div>
                  <div className="highlight__desc">Établissement entièrement accessible PMR. Stationnement réservé à proximité immédiate.</div>
                </div>
              </div>
              <div className="highlight">
                <span className="highlight__icon">🌱</span>
                <div className="highlight__text">
                  <div className="highlight__title">Options végétariennes</div>
                  <div className="highlight__desc">Menus végétariens et régimes spéciaux disponibles sur demande lors de la réservation.</div>
                </div>
              </div>
            </div>
          </RevealDiv>

        </div>
      </section>

      {/* ── INFOS PRATIQUES ── */}
      <section id="infos" className="infos">
        <div className="infos__inner">

          <div className="info-block">
            <RevealDiv>
              <span className="info-block__icon">🕐</span>
              <div className="info-block__title">Horaires d'ouverture</div>
              <div className="info-block__lines">
                {[
                  { day: "Lundi", time: "Fermé", closed: true },
                  { day: "Mardi", time: "12h00 – 14h30" },
                  { day: "Mercredi", time: "12h00 – 14h30" },
                  { day: "Jeudi", time: "12h00 – 14h30  ·  19h30 – 22h00" },
                  { day: "Vendredi", time: "12h00 – 14h30  ·  19h30 – 22h00" },
                  { day: "Samedi", time: "19h30 – 22h30" },
                  { day: "Dimanche", time: "Fermé", closed: true },
                ].map((h) => (
                  <div key={h.day} className={`info-line ${h.closed ? "info-line--closed" : ""}`}>
                    <span className="info-line__day">{h.day}</span>
                    <span className="info-line__time">{h.time}</span>
                  </div>
                ))}
              </div>
            </RevealDiv>
          </div>

          <div className="info-block">
            <RevealDiv>
              <span className="info-block__icon">📍</span>
              <div className="info-block__title">Nous trouver</div>
              <div className="info-block__lines">
                <div className="info-line">
                  <span className="info-line__day">Adresse</span>
                  <span className="info-line__time">14, rue des Marronniers</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Ville</span>
                  <span className="info-line__time">69002 Lyon</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Métro</span>
                  <span className="info-line__time">Bellecour (A & D)</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Bus</span>
                  <span className="info-line__time">Lignes 28 et 31</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Parking</span>
                  <span className="info-line__time">Bellecour · 3 min</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Valet</span>
                  <span className="info-line__time">Sur réservation</span>
                </div>
              </div>
            </RevealDiv>
          </div>

          <div className="info-block">
            <RevealDiv>
              <span className="info-block__icon">📞</span>
              <div className="info-block__title">Contact & Réservations</div>
              <div className="info-block__lines">
                <div className="info-line">
                  <span className="info-line__day">Téléphone</span>
                  <span className="info-line__time">04 72 XX XX XX</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Email</span>
                  <span className="info-line__time">contact@festin-epicurien.fr</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Réservation</span>
                  <span className="info-line__time">En ligne 24h/24</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Groupe +8</span>
                  <span className="info-line__time">Sur demande</span>
                </div>
                <div className="info-line">
                  <span className="info-line__day">Annulation</span>
                  <span className="info-line__time">Jusqu'à 24h avant</span>
                </div>
              </div>
            </RevealDiv>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__logo">
          Le Festin <em>Épicurien</em>
        </div>
        <p className="footer__since">Fondé en 1952 · Lyon, France</p>
        <ul className="footer__links">
          <li><a href="#histoire">Notre histoire</a></li>
          <li><a href="#menus">Les menus</a></li>
          <li><a href="#ambiance">L'ambiance</a></li>
          <li><a href="#infos">Accès & horaires</a></li>
        </ul>
        <p className="footer__copy">
          © {new Date().getFullYear()} Le Festin Épicurien · 14, rue des Marronniers, 69002 Lyon
        </p>
      </footer>
    </>
  );
}