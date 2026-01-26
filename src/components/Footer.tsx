import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* Columna 1: Marca */}
        <div className="footer-col">
          <h3 className="footer-brand">
            ⚡ Electricidad Mattos
          </h3>
          <p className="footer-text">
            Tu socio confiable en materiales eléctricos e iluminación. Asesoramiento técnico especializado.
          </p>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="footer-col">
          <h4 className="footer-title">Navegación</h4>
          <ul className="footer-list">
            <li><span className="footer-link">Inicio</span></li>
            <li><span className="footer-link">Catálogo Completo</span></li>
            <li><span className="footer-link">Ofertas Especiales</span></li>
            <li><span className="footer-link">Contacto</span></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-col">
          <h4 className="footer-title">Contacto</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <HiLocationMarker className="footer-icon" />
              <span>French y Beruti 2871, San Francisco, Cba.</span>
            </li>
            <li className="footer-contact-item">
              <HiPhone className="footer-icon" />
              <span>+54 3564 62-2216</span>
            </li>
            <li className="footer-contact-item">
              <HiMail className="footer-icon" />
              <span>ventas.electricidadmattos@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-copyright">
        © {new Date().getFullYear()} Electricidad Mattos. Todos los derechos reservados.
      </div>
    </footer>
  );
}