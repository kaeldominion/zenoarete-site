import Link from "next/link";
import PixelTracker from "./components/PixelTracker";
import PropertyImage from "./components/PropertyImage";
import WhatsAppButton from "./components/WhatsAppButton";
import {
  AIRBNB_URL,
  DIRECT_BOOKING_URL,
  WHATSAPP_URL,
  sharedSpaces,
  suites,
} from "@/lib/property";

const overviewPhotos = [2, 6, 35, 90, 98];

export default function Home() {
  return (
    <>
      <PixelTracker />

      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" className="site-nav-logo" aria-label="Zeno Arete home">
          <img src="/images/icon-optimized.png" alt="" width={48} height={48} />
          <span>Zeno Arete</span>
        </Link>
        <div className="site-nav-links">
          <a href="#suites">Suites</a>
          <a href="#spaces">Spaces</a>
          <Link href="/gallery">Gallery</Link>
          <a
            href={DIRECT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-gold nav-book"
          >
            Book the villa
          </a>
        </div>
      </nav>

      <main>
        <header className="hero">
          <div className="hero-media" aria-hidden="true">
            <PropertyImage
              photoNumber={34}
              alt=""
              sizes="100vw"
              priority
            />
          </div>
          <div className="hero-shade" />
          <div className="hero-content">
            <img
              src="/images/logo-optimized.png"
              alt="Zeno Arete"
              width={640}
              height={640}
              className="hero-logo"
            />
            <h1 className="sr-only">Villa Zeno Arete</h1>
            <p className="hero-positioning">
              A private sanctuary for training, recovery and luxury living
            </p>
            <p className="hero-location">Pererenan, Bali</p>
            <div className="hero-actions">
              <Link href="/gallery" className="button button-line">
                Explore 98 photos
              </Link>
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-line"
              >
                View on Airbnb
              </a>
              <a
                href={DIRECT_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-gold"
              >
                Book direct
              </a>
            </div>
          </div>
          <a className="hero-scroll" href="#villa" aria-label="Explore the villa">
            <span>Explore</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v17M6 14l6 6 6-6" />
            </svg>
          </a>
        </header>

        <section className="villa-overview" id="villa">
          <div className="content-shell overview-heading">
            <div>
              <p className="context-line">Entire private villa in Pererenan</p>
              <h2>Built for the whole group, without sacrificing privacy.</h2>
            </div>
            <div className="overview-copy">
              <p>
                Zeno Arete is a 1,400 m² residence with six private king suites,
                two pools, expansive social spaces and a complete training and
                recovery floor. It is designed for groups who want to live,
                celebrate and reset in one place.
              </p>
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rating-link"
              >
                <span aria-hidden="true">★</span> 5.0 · Guest favourite on Airbnb
              </a>
            </div>
          </div>

          <dl className="content-shell fact-strip">
            <div>
              <dt>Guests</dt>
              <dd>12</dd>
            </div>
            <div>
              <dt>Named suites</dt>
              <dd>6</dd>
            </div>
            <div>
              <dt>Bathrooms</dt>
              <dd>6</dd>
            </div>
            <div>
              <dt>Private pools</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>Residence</dt>
              <dd>1,400 m²</dd>
            </div>
          </dl>

          <div className="overview-gallery" aria-label="Villa Zeno Arete overview">
            {overviewPhotos.map((photoNumber, index) => (
              <div className={`overview-photo overview-photo-${index + 1}`} key={photoNumber}>
                <PropertyImage
                  photoNumber={photoNumber}
                  alt={
                    [
                      "Villa Zeno Arete pool courtyard and recovery pavilion",
                      "Villa Zeno Arete main living room",
                      "Glass-bottom pool and terrace at Villa Zeno Arete",
                      "Villa Zeno Arete kitchen and dining room",
                      "Fully equipped private gym at Villa Zeno Arete",
                    ][index]
                  }
                  sizes={index === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
                />
              </div>
            ))}
            <Link href="/gallery" className="gallery-count">
              View all 98 photos
            </Link>
          </div>
        </section>

        <section className="suites-section" id="suites">
          <div className="content-shell section-intro">
            <p>Six rooms, six archetypes</p>
            <h2>Every suite has its own name, energy and point of view.</h2>
          </div>

          <div className="suite-list">
            {suites.map((suite) => (
              <article className="suite" id={suite.key} key={suite.key}>
                <div className="suite-gallery">
                  {suite.photoNumbers.map((photoNumber, photoIndex) => (
                    <div className={`suite-photo suite-photo-${photoIndex + 1}`} key={photoNumber}>
                      <PropertyImage
                        photoNumber={photoNumber}
                        alt={`${suite.name} ${suite.room.toLowerCase()} at Villa Zeno Arete, view ${photoIndex + 1}`}
                        sizes={photoIndex === 0 ? "(min-width: 900px) 46vw, 100vw" : "(min-width: 900px) 23vw, 50vw"}
                      />
                    </div>
                  ))}
                </div>
                <div className="suite-story">
                  <p className="suite-room">{suite.room}</p>
                  <p className="suite-number">{String(suite.number).padStart(2, "0")}</p>
                  <h3>{suite.name}</h3>
                  <p className="suite-meaning">{suite.meaning}</p>
                  <blockquote>“{suite.quote}”</blockquote>
                  <p className="suite-copy">{suite.copy}</p>
                  <Link href="/gallery" className="text-link">
                    View {suite.name} and the full gallery
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shared-section" id="spaces">
          <div className="content-shell section-intro shared-intro">
            <p>Beyond the suites</p>
            <h2>Spaces for movement, recovery, conversation and celebration.</h2>
          </div>
          <div className="shared-grid">
            {sharedSpaces.map((space) => (
              <article className="shared-space" key={space.category}>
                <div className="shared-photo">
                  <PropertyImage
                    photoNumber={space.photoNumber}
                    alt={`${space.title} at Villa Zeno Arete`}
                    sizes="(min-width: 900px) 50vw, 100vw"
                  />
                </div>
                <div className="shared-copy">
                  <p className="shared-detail">{space.detail}</p>
                  <h3>{space.title}</h3>
                  <p>{space.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="service-section">
          <div className="content-shell service-grid">
            <div>
              <p className="context-line">The stay</p>
              <h2>Private enough to disappear. Supported enough to relax.</h2>
            </div>
            <div className="service-copy">
              <p>
                Full-time villa staff look after the property throughout the
                stay. Chef service is available, with guests covering groceries,
                and the Nusa Nova reservations team can help organise the details
                before arrival.
              </p>
              <ul className="amenity-list">
                <li>Six king suites</li>
                <li>Sonos in every room</li>
                <li>Cinema-style TV room</li>
                <li>Private gym</li>
                <li>Sauna and ice bath</li>
                <li>Jacuzzi and outdoor shower</li>
                <li>Two pools and slide</li>
                <li>Chef and villa staff</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="booking-section" id="book">
          <div className="booking-media" aria-hidden="true">
            <PropertyImage photoNumber={56} alt="" sizes="100vw" />
          </div>
          <div className="booking-shade" />
          <div className="booking-content">
            <p>Pererenan, Bali</p>
            <h2>Your private base for the next chapter.</h2>
            <div className="hero-actions">
              <a
                href={DIRECT_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-gold"
              >
                Book direct
              </a>
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-line"
              >
                Check Airbnb
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-line"
              >
                Ask Nusa Nova
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/images/icon-optimized.png" alt="" width={72} height={72} />
          <p>Villa Zeno Arete</p>
          <span>Managed by Nusa Nova Group</span>
        </div>
        <div className="footer-links">
          <Link href="/gallery">Gallery</Link>
          <a href="https://instagram.com/villazenoarete" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer">Airbnb</a>
          <a href="https://maps.app.goo.gl/9tZLgd64rmGjhHrM8" target="_blank" rel="noopener noreferrer">Location</a>
          <a href="mailto:reservations@nusanova.com">Email</a>
        </div>
        <p className="footer-copy">© 2026 Zeno Arete · Pererenan, Bali</p>
      </footer>

      <WhatsAppButton />
    </>
  );
}
