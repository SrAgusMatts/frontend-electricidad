import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero-wrapper">
      <div className="hero-decoration" />
      
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Iluminá tus proyectos con <span className="hero-highlight">Electricidad Mattos</span>
          </h1>
          <p className="hero-desc">
            Encontrá los mejores cables, herramientas e iluminación para tu hogar o industria. Calidad garantizada y envíos a todo el país.
          </p>
          <Link href="#catalogo" className="hero-btn">
            Ver Ofertas
          </Link>
        </div>

        <div className="hero-image-wrapper">
            <div className="hero-icon-box">
                <span className="hero-icon">⚡</span>
            </div>
        </div>
      </div>
    </div>
  );
}