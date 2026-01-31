/* ==============================
   Main JS - 中国非遗宣传官网（静态）
   - 移动端抽屉导航
   - 页面过渡（卷轴/印章）
   - 滚动进度条
   - 点击水墨涟漪
   - 画廊过滤
   - 第三方库初始化：AOS / Swiper / GLightbox / VanillaTilt / GSAP
   ============================== */

(function(){
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  function setYear(){
    const y = qs('[data-year]');
    if(y) y.textContent = new Date().getFullYear();
  }

  function setActiveNav(){
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    qsa('.nav a, .drawer a').forEach(a => {
      const href = (a.getAttribute('href')||'').toLowerCase();
      if(!href || href.startsWith('http')) return;
      const normalized = href.split('#')[0] || 'index.html';
      if(normalized === path) a.classList.add('active');
    });
  }

  function initDrawer(){
    const drawer = qs('.drawer');
    const openBtn = qs('[data-menu]');
    const closeBtn = qs('[data-close-drawer]');
    const backdrop = qs('.drawer .backdrop');
    if(!drawer || !openBtn) return;

    const open = () => drawer.classList.add('open');
    const close = () => drawer.classList.remove('open');

    openBtn.addEventListener('click', open);
    (closeBtn || backdrop)?.addEventListener?.('click', close);
    backdrop?.addEventListener('click', close);

    qsa('.drawer a').forEach(a => a.addEventListener('click', close));
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
  }

  function initScrollProgress(){
    const bar = qs('.scroll-progress');
    if(!bar) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? (doc.scrollTop / max) : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  function ripple(el, x, y){
    const r = document.createElement('span');
    r.className = 'ink-ripple';
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.15;
    r.style.width = r.style.height = `${size}px`;
    r.style.left = `${x - rect.left - size/2}px`;
    r.style.top  = `${y - rect.top  - size/2}px`;
    el.appendChild(r);
    setTimeout(()=> r.remove(), 650);
  }

  function initRipples(){
    const style = document.createElement('style');
    style.textContent = `
      .btn, .card{overflow:hidden}
      .ink-ripple{
        position:absolute; border-radius:999px;
        pointer-events:none;
        background:radial-gradient(circle, rgba(20,20,20,.22), rgba(20,20,20,.06) 40%, transparent 70%);
        transform:scale(.15);
        animation: inkRipple .65s ease-out forwards;
        mix-blend-mode:multiply;
      }
      @keyframes inkRipple{
        to{transform:scale(1); opacity:0}
      }`;
    document.head.appendChild(style);

    qsa('.btn, .card').forEach(el=>{
      el.addEventListener('click', (e)=> ripple(el, e.clientX, e.clientY));
    });
  }

  function initFilters(){
    const wrap = qs('[data-filter-wrap]');
    if(!wrap) return;
    const btns = qsa('.filters button', wrap);
    const cards = qsa('[data-cat]', wrap);

    function apply(filter){
      cards.forEach(c=>{
        const cats = (c.getAttribute('data-cat')||'').split(',').map(s=>s.trim());
        const show = filter==='all' || cats.includes(filter);
        c.style.display = show ? '' : 'none';
      });
    }

    btns.forEach(b=>{
      b.addEventListener('click', ()=>{
        btns.forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        apply(b.getAttribute('data-filter') || 'all');
      });
    });

    const first = btns.find(b=>b.classList.contains('active')) || btns[0];
    apply(first?.getAttribute('data-filter') || 'all');
  }

  function initThirdParty(){
    // AOS
    if(window.AOS){
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 70
      });
    }

    // Swiper
    if(window.Swiper){
      qsa('.swiper').forEach(node=>{
        // Avoid re-init
        if(node.swiper) return;
        new Swiper(node, {
          loop: true,
          speed: 650,
          grabCursor: true,
          autoplay: { delay: 3200, disableOnInteraction:false },
          pagination: { el: node.querySelector('.swiper-pagination'), clickable:true },
          navigation: {
            nextEl: node.querySelector('.swiper-button-next'),
            prevEl: node.querySelector('.swiper-button-prev')
          },
          breakpoints: {
            0: { slidesPerView: 1.08, spaceBetween: 14 },
            640: { slidesPerView: 2.05, spaceBetween: 16 },
            980: { slidesPerView: 3.05, spaceBetween: 18 }
          }
        });
      });
    }

    // Lightbox
    if(window.GLightbox){
      GLightbox({ selector: '.glightbox', touchNavigation:true, loop:true });
    }

    // Tilt
    if(window.VanillaTilt){
      VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 7,
        speed: 450,
        glare: true,
        "max-glare": 0.18
      });
    }

    // GSAP micro-animations
    if(window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      qsa('[data-parallax]').forEach(el=>{
        gsap.to(el, {
          y: -24,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }
  }

  function initCurtainTransition(){
    const curtain = qs('.page-curtain');
    if(!curtain) return;

    const isInternalHref = (href) =>
      href &&
      !href.startsWith('http') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('#');

    const isAssetFile = (href) => /\.(jpg|jpeg|png|webp|gif|svg|mp4|pdf)$/i.test(href || '');

    qsa('a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      if(a.classList.contains('glightbox')) return;
      if(a.hasAttribute('data-no-transition')) return;
      if(!isInternalHref(href)) return;
      if(isAssetFile(href)) return;

      a.addEventListener('click', (e)=>{
        // ctrl/cmd click open new tab
        if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        curtain.classList.add('show');
        setTimeout(()=> { location.href = href; }, 180);
      });
    });

    // When coming in
    window.addEventListener('pageshow', ()=> curtain.classList.remove('show'));
  }

  function initContactForm(){
    const form = qs('[data-contact-form]');
    if(!form) return;
    const toast = (msg) => {
      let t = qs('.toast');
      if(!t){
        t = document.createElement('div');
        t.className = 'toast';
        t.style.cssText = `
          position:fixed; left:50%; bottom:20px; transform:translateX(-50%);
          background:rgba(20,20,20,.92); color:#fff;
          padding:10px 12px; border-radius:999px;
          font-size:13px; z-index:3000; opacity:0;
          transition:opacity .18s var(--ease);
        `;
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      setTimeout(()=> t.style.opacity = '0', 1700);
    };

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = qs('[name="name"]', form)?.value.trim();
      const phone = qs('[name="phone"]', form)?.value.trim();
      const msg = qs('[name="message"]', form)?.value.trim();

      if(!name || !phone || !msg){
        toast('请完整填写姓名、联系电话与需求描述。');
        return;
      }

      toast('已提交（演示版）。接入后端接口后即可真实发送。');
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setYear();
    setActiveNav();
    initDrawer();
    initScrollProgress();
    initRipples();
    initFilters();
    initThirdParty();
    initCurtainTransition();
    initContactForm();
  });
})();