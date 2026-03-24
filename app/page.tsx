import Link from "next/link";
import RevealObserver from "./components/RevealObserver";
import PixelTracker from "./components/PixelTracker";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <PixelTracker />

      {/* Sticky nav */}
      <nav className="site-nav">
        <a href="/" className="site-nav-logo">
          <img src="/images/icon.png" alt="Zeno Arete" />
          <span>Zeno Arete</span>
        </a>
        <div className="site-nav-links">
          <Link href="/gallery">Gallery</Link>
          <a
            href="https://app-apac.thebookingbutton.com/properties/villazenoaretedirect"
            target="_blank"
            rel="noopener"
            className="btn btn-fill site-nav-book"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* Fixed parallax background */}
      <div className="parallax-bg" />

      {/* HERO */}
      <header className="hero">
        <div className="hero-content">
          <img
            src="/images/logo.png"
            alt="Zeno Arete"
            className="hero-logo"
          />
          <h1 className="sr-only">Zeno Arete</h1>
          <p className="subtitle">
            A Private Sanctuary for Training, Recovery, and Luxury Living
          </p>
          <p className="tagline">
            6 Ultra-Luxe Suites · Sonos Throughout · 2 Pools · Ice Bath · Sauna
            · Gym · Full-Time Chef
          </p>
          <p className="managed">
            Managed exclusively by Nusa Nova Group.
          </p>
          <p className="location">Pererenan, Bali 🌴</p>
          <div className="cta-group">
            <Link href="/gallery" className="btn">
              View Gallery
            </Link>
            <a
              href="https://www.airbnb.com/rooms/1409091642899578717?guests=1&adults=1&s=67&unique_share_id=bdc6c906-7419-49f1-8c45-10325513785a"
              target="_blank"
              className="btn"
            >
              Book on Airbnb
            </a>
            <a
              href="https://app-apac.thebookingbutton.com/properties/villazenoaretedirect"
              target="_blank"
              className="btn btn-fill"
            >
              Book Direct
            </a>
          </div>
        </div>
        <div className="scroll-hint">
          <svg viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      {/* Philosophy */}
      <div className="split-section" id="philosophy">
        <div className="split-img">
          <img
            src="/images/villa-exterior.jpg"
            alt="Villa Zeno Arete exterior"
            className="reveal reveal-scale"
          />
        </div>
        <div className="split-text">
          <span className="section-label reveal reveal-fade">
            A Retreat for the Disciplined
          </span>
          <blockquote className="reveal">
            &ldquo;To move the world, you must first move yourself.&rdquo;
          </blockquote>
          <div
            className="divider reveal reveal-fade"
            style={{ marginLeft: 0 }}
          />
          <p className="reveal">
            This villa was born from philosophy — not trend. Zeno Arete is a
            1,400m² private sanctuary built for transformation. A home for
            warriors, creators, and thinkers. Here, beauty meets intention,
            indulgence meets structure. Every feature supports your rise — in
            body, mind, and spirit.
          </p>
        </div>
      </div>

      {/* Highlights */}
      <div className="split-section reverse">
        <div className="split-img">
          <img
            src="/images/pool-lounge.jpg"
            alt="Villa Zeno Arete poolside lounge"
            className="reveal reveal-scale"
          />
        </div>
        <div className="split-text alt-bg">
          <span className="section-label reveal reveal-fade">
            The Highlights
          </span>
          <h2 className="reveal">Crafted for Peak Living</h2>
          <div
            className="divider reveal reveal-fade"
            style={{ marginLeft: 0 }}
          />
          <div className="highlights-list stagger">
            <p className="reveal">
              🛏 6 suites that feel like 5-star hotel rooms
            </p>
            <p className="reveal">
              🌊 2 pools — including glass-bottom plunge + slide from master
            </p>
            <p className="reveal">
              🔊 Sonos in every room, Arc Ultra &amp; Era300 in master + cinema
            </p>
            <p className="reveal">🧊 Ice bath · 🔥 Sauna · 💦 Jacuzzi</p>
            <p className="reveal">
              💪 Private gym · 🧘‍♂️ Yoga-ready outdoor spaces
            </p>
            <p className="reveal">
              🍳 Full-time chef (guests just cover food costs)
            </p>
            <p className="reveal">
              🎉 Indoor-outdoor entertainment areas + swim-up bar
            </p>
            <p className="reveal">
              📸 Hyper-photogenic architecture + lighting throughout
            </p>
          </div>
        </div>
      </div>

      {/* Gym */}
      <div className="split-section">
        <div className="split-img">
          <img
            src="/images/gym.jpg"
            alt="Villa Zeno Arete private gym"
            className="reveal reveal-scale"
          />
        </div>
        <div className="split-text">
          <span className="section-label reveal reveal-fade">The Gym</span>
          <h2 className="reveal">Your Private Iron Temple</h2>
          <div
            className="divider reveal reveal-fade"
            style={{ marginLeft: 0 }}
          />
          <p className="reveal">
            No waiting. No distractions. No excuses. The Zeno Arete gym is a
            fully equipped private training space designed for those who
            don&apos;t take rest days lightly. Whether you&apos;re pushing heavy
            compound lifts, sharpening mobility, or keeping your routine locked
            in while traveling — this isn&apos;t a hotel &ldquo;fitness
            corner.&rdquo; It&apos;s a proper gym, built for people who actually
            train.
          </p>
          <p className="reveal">
            Start your morning with sunrise reps, end your evening with a brutal
            finisher — then walk straight to recovery. Your body. Your schedule.
            Your standards.
          </p>
        </div>
      </div>

      {/* Recovery */}
      <div className="split-section reverse">
        <div className="split-img">
          <img
            src="/images/recovery.jpg"
            alt="Villa Zeno Arete ice bath and sauna"
            className="reveal reveal-scale"
          />
        </div>
        <div className="split-text alt-bg">
          <span className="section-label reveal reveal-fade">
            Ice Bath, Sauna &amp; Jacuzzi
          </span>
          <h2 className="reveal">The Recovery Protocol</h2>
          <div
            className="divider reveal reveal-fade"
            style={{ marginLeft: 0 }}
          />
          <p className="reveal">
            Train hard. Recover harder. Zeno Arete&apos;s full recovery suite is
            built for those who understand that growth happens between sessions.
          </p>
          <p className="reveal">
            Plunge into the ice bath to crush inflammation and sharpen your mind.
            Sweat it out in the sauna to detox, destress, and reset. Then ease
            into the jacuzzi and let everything melt away.
          </p>
          <p className="reveal">
            This isn&apos;t spa-day fluff — it&apos;s a deliberate recovery
            protocol, steps from your bedroom, available whenever you want it.
            Cold. Heat. Release. Repeat.
          </p>
        </div>
      </div>

      {/* Live Intentionally */}
      <div className="split-section">
        <div className="split-img">
          <img
            src="/images/extra.jpg"
            alt="Villa Zeno Arete lifestyle"
            className="reveal reveal-scale"
          />
        </div>
        <div className="split-text">
          <span className="section-label reveal reveal-fade">
            Live Intentionally
          </span>
          <h2 className="reveal">Train, Recover, Repeat</h2>
          <div
            className="divider reveal reveal-fade"
            style={{ marginLeft: 0 }}
          />
          <p className="reveal">
            This isn&apos;t just a luxury villa — it&apos;s your private dojo,
            your content haven, your temple of play and purpose. Crush workouts
            in the private gym. Detox in the sauna. Host intimate dinners under
            the stars. Slide into the pool from your bedroom. Wake up every day
            feeling 1% more powerful.
          </p>
          <Link href="/gallery" className="btn reveal" style={{ alignSelf: "flex-start" }}>
            Explore 200+ Photos
          </Link>
        </div>
      </div>

      {/* Instagram Feed */}
      <div
        className="card"
        style={{ padding: "5rem 2rem 2rem", textAlign: "center" }}
      >
        <span className="section-label reveal reveal-fade">
          Follow the Journey
        </span>
        <h2 className="reveal" style={{ marginBottom: ".5rem" }}>
          @villazenoarete
        </h2>
        <p
          className="reveal"
          style={{ maxWidth: 500, margin: "0 auto 2.5rem" }}
        >
          See the villa through the eyes of our guests and team.
        </p>
        <div className="reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* @ts-expect-error behold web component */}
          <behold-widget feed-id="f8BymEqdqKHo4aHbH4p0"></behold-widget>
        </div>
      </div>

      {/* Booking */}
      <div className="book-section">
        <div className="book-content">
          <span className="section-label reveal reveal-fade">
            Book the Villa
          </span>
          <h2 className="reveal">Your Move</h2>
          <div className="divider reveal reveal-fade" />
          <p
            className="reveal"
            style={{ maxWidth: 600, margin: "0 auto 2.5rem" }}
          >
            Zeno Arete is available for private bookings, retreats, and
            content-focused getaways. Full-time staff, chef-prepared meals, and
            zero distractions. Just you, your crew, and the kind of energy that
            realigns everything. Contact the reservations team at Nusa Nova on
            the WhatsApp booking button and we&apos;ll get you settled in.
          </p>
          <div className="cta-group reveal">
            <a
              href="https://www.airbnb.com/rooms/1409091642899578717?guests=1&adults=1&s=67&unique_share_id=bdc6c906-7419-49f1-8c45-10325513785a"
              target="_blank"
              className="btn"
            >
              Book on Airbnb
            </a>
            <a
              href="https://app-apac.thebookingbutton.com/properties/villazenoaretedirect"
              target="_blank"
              className="btn btn-fill"
            >
              Book Direct
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <img
          src="/images/icon.png"
          alt="Zeno Arete emblem"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            margin: "0 auto 1.5rem",
            display: "block",
            opacity: 0.8,
          }}
        />
        <div className="links">
          <Link href="/gallery">Gallery</Link>
          <a href="https://instagram.com/villazenoarete" target="_blank">
            Instagram
          </a>
          <a
            href="https://www.airbnb.com/rooms/1409091642899578717"
            target="_blank"
          >
            Airbnb
          </a>
          <a href="https://maps.app.goo.gl/9tZLgd64rmGjhHrM8" target="_blank" rel="noopener">
            Location
          </a>
          <a href="mailto:reservations@nusanova.com">Email</a>
        </div>
        <p className="copy">
          &copy; 2026 Zeno Arete · Managed by Nusa Nova Group
        </p>
      </footer>

      <WhatsAppButton />
    </>
  );
}
