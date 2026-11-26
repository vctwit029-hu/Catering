import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChefHat, Clock3, Instagram, Leaf, Menu, Phone, Sparkles, Utensils, X } from 'lucide-react';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const dishes = [
  { name:'Banana chips', sub:'Golden & crisp', type:'chips', x:18, y:24 },
  { name:'Salt & pickle', sub:'A little tang', type:'pickle', x:77, y:23 },
  { name:'Avial', sub:'Garden vegetables', type:'avial', x:17, y:54 },
  { name:'Poriyal', sub:'Coconut tempered', type:'poriyal', x:77, y:53 },
  { name:'Sambar', sub:'Slow simmered', type:'sambar', x:31, y:76 },
  { name:'Rice', sub:'Steamed to perfection', type:'rice', x:50, y:49 },
  { name:'Rasam', sub:'Pepper & spice', type:'rasam', x:69, y:77 },
  { name:'Payasam', sub:'A sweet finish', type:'payasam', x:50, y:17 },
  { name:'Appalam', sub:'Light & crunchy', type:'appalam', x:89, y:37 },
];

function Food({type}) {
  const colors = {chips:['#d79a31','#f0c36d'],pickle:['#a33d24','#d37a31'],avial:['#d9c48c','#71964d'],poriyal:['#8eaa54','#d8d29a'],sambar:['#b75b25','#e6a044'],rice:['#fff4d8','#fffdf1'],rasam:['#9d4325','#d27a38'],payasam:['#e9b96c','#fff0bf'],appalam:['#d9a44f','#f0cb7d']};
  return <div className={'food food-'+type}><span style={{'--food-a':colors[type][0],'--food-b':colors[type][1]}} /></div>;
}

function LeafFeast() {
  const scene = useRef(null);
  const video = useRef(null);
  const triggerRef = useRef(null);
  const playingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = video.current;
    const section = scene.current;
    if (!el || !section) return;
    let trigger;
    let disposed = false;

    const blockScroll = event => {
      if (playingRef.current) event.preventDefault();
    };
    const blockKeys = event => {
      if (playingRef.current && ['ArrowDown','ArrowUp','PageDown','PageUp','Space',' '].includes(event.key)) event.preventDefault();
    };
    const finishPlayback = () => {
      playingRef.current = false;
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('keydown', blockKeys);
      setProgress(1);
      if (trigger) {
        trigger.scroll(trigger.end);
        ScrollTrigger.update();
      }
    };
    const startPlayback = () => {
      if (playingRef.current || el.ended) return;
      playingRef.current = true;
      setStarted(true);
      window.addEventListener('wheel', blockScroll, { passive: false });
      window.addEventListener('touchmove', blockScroll, { passive: false });
      window.addEventListener('keydown', blockKeys);
      el.play().catch(() => {
        playingRef.current = false;
        window.removeEventListener('wheel', blockScroll);
        window.removeEventListener('touchmove', blockScroll);
        window.removeEventListener('keydown', blockKeys);
      });
    };
    const onTime = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) setProgress(el.currentTime / el.duration);
    };
    const setup = () => {
      if (disposed || !Number.isFinite(el.duration) || !el.duration) return;
      setReady(true);
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=1200',
        pin: true,
        scrub: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: startPlayback,
        onEnterBack: () => {
          if (el.ended) {
            el.currentTime = 0;
            setProgress(0);
          }
          startPlayback();
        }
      });
      triggerRef.current = trigger;
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', finishPlayback);
    if (el.readyState >= 1) setup();
    else el.addEventListener('loadedmetadata', setup, { once: true });
    return () => {
      disposed = true;
      playingRef.current = false;
      el.pause();
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', finishPlayback);
      el.removeEventListener('loadedmetadata', setup);
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('keydown', blockKeys);
      trigger?.kill();
      triggerRef.current = null;
    };
  }, []);

  const chapter = progress < 0.14 ? 'THE BANANA LEAF' : progress < 0.36 ? 'CHICKEN BIRYANI' : progress < 0.56 ? 'CHILLI CHICKEN' : progress < 0.76 ? 'THE SIGNATURE SIDES' : progress < 0.91 ? 'THE GRAND FEAST' : 'SERVED WITH LOVE';

  return <section className="feast-scroll video-feast" ref={scene} id="experience">
    <video
      ref={video}
      className="feast-video"
      src="https://raw.githubusercontent.com/vctwit029-hu/Catering/main/feast.mp4"
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-label="Cinematic South Indian non-vegetarian banana leaf feast"
    />
    <div className="video-feast-shade" />
    <div className="video-feast-top">
      <p className="eyebrow light">A FEAST, REIMAGINED</p>
      <span>{started ? 'YOUR FEAST IS BEING SERVED' : 'SCROLL ONCE TO BEGIN'}</span>
    </div>
    <div className="video-chapter"><span>NOW SERVING</span><strong>{chapter}</strong></div>
    <div className="video-feast-bottom">
      <div>
        <span className="finish-line">THE SARA CATERING EXPERIENCE</span>
        <h2>{progress > 0.88 ? <>A grand feast,<br/><em>served with love.</em></> : <>Every leaf tells<br/><em>a delicious story.</em></>}</h2>
      </div>
      <div className="feast-progress"><span>{String(Math.round(progress * 100)).padStart(2,'0')}%</span><i><b style={{width:(progress*100)+'%'}} /></i></div>
    </div>
    {!ready && <div className="video-loading">Preparing the feast…</div>}
  </section>;
}

function App(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [form,setForm]=useState({name:'',phone:'',event:'',date:'',guests:''});
  const [sent,setSent]=useState(false);
  const update=(e)=>setForm({...form,[e.target.name]:e.target.value});
  const submit=(e)=>{e.preventDefault();const msg=`Hello Sara Catering! I'd like to enquire about catering.\nName: ${form.name}\nPhone: ${form.phone}\nEvent: ${form.event}\nDate: ${form.date}\nGuests: ${form.guests}`;window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');setSent(true);};
  useEffect(()=>{gsap.fromTo('.hero-title span',{y:70,opacity:0},{y:0,opacity:1,stagger:.15,duration:1.1,ease:'power3.out',delay:.2});gsap.fromTo('.hero-visual',{opacity:0,scale:1.08},{opacity:1,scale:1,duration:1.4,ease:'power2.out'});},[]);
  return <main>
    <header className="nav"><a className="brand" href="#home"><span className="brand-mark"><Leaf size={20}/></span><span>SARA <small>CATERING</small></span></a><nav className={menuOpen?'nav-links open':'nav-links'}><a href="#story" onClick={()=>setMenuOpen(false)}>Our story</a><a href="#experience" onClick={()=>setMenuOpen(false)}>The feast</a><a href="#services" onClick={()=>setMenuOpen(false)}>Services</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></nav><a className="nav-cta" href="#contact">Plan your event <ArrowUpRight size={15}/></a><button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button></header>
    <LeafFeast/>
    <section className="hero" id="home"><div className="hero-text"><p className="eyebrow"><span/> MADE FOR MOMENTS THAT MATTER</p><h1 className="hero-title"><span>The joy of</span><span><em>a grand</em> feast.</span></h1><p className="hero-desc">Rooted in tradition. Made with heart. We bring people together with beautiful South Indian food and generous hospitality.</p><div className="hero-actions"><a href="#contact" className="btn-primary">Make it memorable <ArrowUpRight size={17}/></a><a href="#experience" className="text-link">Explore the feast <ArrowDown size={16}/></a></div><div className="hero-note"><span className="note-rule"/> A LITTLE MORE LOVE IN EVERY SERVING</div></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85" alt="A beautifully arranged traditional Indian meal"/><div className="image-stamp"><span>THE SARA</span><strong>FEAST</strong><small>EST. WITH LOVE</small></div><div className="hero-image-caption">A table full of stories <span>01 / 04</span></div></div><div className="hero-side">TASTE THAT BRINGS US TOGETHER</div></section>
    <section className="intro" id="story"><div className="intro-top"><p className="eyebrow">A WARM WELCOME</p><span>01 — OUR PHILOSOPHY</span></div><div className="intro-grid"><h2>Good food.<br/><em>Great company.</em><br/>Always together.</h2><div className="intro-body"><p className="large-copy">Some moments deserve more than a meal. They deserve a feast that feels like home.</p><p>At Sara Catering, every dish begins with fresh ingredients, time-honoured recipes and the belief that food tastes better when it is shared. From intimate family gatherings to grand celebrations, we make every table feel special.</p><a className="under-link" href="#services">Discover our approach <ArrowRight size={16}/></a></div></div><div className="intro-values"><div><Sparkles/><strong>Made with care</strong><span>Thoughtful in every detail</span></div><div><Leaf/><strong>Fresh by nature</strong><span>Good ingredients, always</span></div><div><Utensils/><strong>Rooted in tradition</strong><span>Flavours that feel like home</span></div></div></section>
    <section className="services" id="services"><div className="section-heading"><div><p className="eyebrow">MADE FOR YOUR MOMENT</p><h2>Every occasion,<br/><em>beautifully served.</em></h2></div><p>From the first welcome to the final sweet bite, we take care of the food so you can be part of the moment.</p></div><div className="service-grid"><article className="service-card service-one"><img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80" alt="Wedding celebration dining"/><div><span>01 / CELEBRATIONS</span><h3>Weddings<br/>& engagements</h3><p>A beautiful beginning deserves a beautiful feast.</p></div></article><article className="service-card service-two"><img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80" alt="Elegant event table"/><div><span>02 / GATHERINGS</span><h3>Family occasions<br/>& celebrations</h3><p>Big milestones, little get-togethers, all made special.</p></div></article><article className="service-card service-three"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" alt="Restaurant dining setup"/><div><span>03 / CORPORATE</span><h3>Business events<br/>& occasions</h3><p>Hospitality that makes a lasting impression.</p></div></article></div></section>
    <section className="quote-band"><span>✳</span><p>“The best memories are made<br/>around a table.”</p><small>THE SARA CATERING BELIEF</small></section>
    <section className="contact" id="contact"><div className="contact-copy"><p className="eyebrow light">LET'S MAKE A FEAST</p><h2>Your occasion.<br/><em>Our pleasure.</em></h2><p>Tell us a little about your celebration. We'll get back to you and start planning something delicious.</p><div className="contact-detail"><Phone size={17}/><span>Let's talk about your event<br/><strong>Connect with us on WhatsApp</strong></span></div><div className="contact-detail"><Clock3 size={17}/><span>Thoughtful planning<br/><strong>From first call to final serving</strong></span></div></div><form className="enquiry-form" onSubmit={submit}><p className="form-kicker">EVENT ENQUIRY <span>01 — 05</span></p><h3>Let's get to know<br/>your celebration.</h3><label>Your name<input name="name" value={form.name} onChange={update} placeholder="How should we call you?" required/></label><div className="form-row"><label>Phone number<input name="phone" value={form.phone} onChange={update} placeholder="+91" required/></label><label>Event date<input type="date" name="date" value={form.date} onChange={update}/></label></div><label>What are we celebrating?<select name="event" value={form.event} onChange={update}><option value="">Choose an occasion</option><option>Wedding / Engagement</option><option>Family celebration</option><option>Corporate event</option><option>Other occasion</option></select></label><label>Approximate guests<input name="guests" value={form.guests} onChange={update} placeholder="e.g. 250"/></label><button className="btn-primary form-submit" type="submit">{sent?'Send another enquiry':'Start a conversation'} <ArrowUpRight size={17}/></button><small className="form-note">This opens WhatsApp with your enquiry details. No payment or booking is made here.</small></form></section>
    <footer><a className="brand footer-brand" href="#home"><span className="brand-mark"><Leaf size={20}/></span><span>SARA <small>CATERING</small></span></a><p>Good food. Great company. Always together.</p><div className="footer-right"><a href="#home">BACK TO TOP ↑</a><span>© {new Date().getFullYear()} SARA CATERING</span></div></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>);