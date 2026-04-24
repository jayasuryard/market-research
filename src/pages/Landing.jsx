import { useEffect } from 'react';
import { Nav }             from '../components/amie/Nav.jsx';
import { Hero }            from '../components/amie/Hero.jsx';
import { MarqueeBar }      from '../components/amie/MarqueeBar.jsx';
import { Problem }         from '../components/amie/Problem.jsx';
import { HowItWorks }      from '../components/amie/HowItWorks.jsx';
import { Validation }      from '../components/amie/Validation.jsx';
import { Engine }          from '../components/amie/Engine.jsx';
import { Report }          from '../components/amie/Report.jsx';
import { Differentiation } from '../components/amie/Differentiation.jsx';
import { Audience }        from '../components/amie/Audience.jsx';
import { FAQ }             from '../components/amie/FAQ.jsx';
import { Waitlist }        from '../components/amie/Waitlist.jsx';
import { Footer }          from '../components/amie/Footer.jsx';

export default function Landing() {
  useEffect(() => {
    document.title = 'MarketIQ.ai — Autonomous Market Intelligence Engine';
  }, []);

  return (
    <div className="paper">
      <Nav />
      <main>
        <Hero />
        <MarqueeBar />
        <Problem />
        <HowItWorks />
        <Validation />
        <Engine />
        <Report />
        <Differentiation />
        <Audience />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
