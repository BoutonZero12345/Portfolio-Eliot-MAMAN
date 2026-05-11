/* =========================================================
   Portfolio Eliot MAMAN — JavaScript
   - Canvas Swarm (particles réactives souris)
   - Glow border dynamique sur cartes (mouse position)
   - Navbar scroll behavior
   - Mobile menu toggle
   ========================================================= */

// ── SWARM CANVAS ──────────────────────────────────────────
(function initSwarm() {
  const canvas = document.getElementById('swarm-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, mouse = { x: -9999, y: -9999 };
  const NODES = 80;
  const CONN_DIST = 130;
  const MOUSE_DIST = 160;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Create nodes
  const nodes = Array.from({ length: NODES }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Gentle mouse repulsion
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.6;
        n.vx += (dx / dist) * force * 0.05;
        n.vy += (dy / dist) * force * 0.05;
        // Speed cap
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 1.5) { n.vx = n.vx / speed * 1.5; n.vy = n.vy / speed * 1.5; }
      }
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN_DIST) {
          const alpha = (1 - d / CONN_DIST) * 0.25;
          ctx.strokeStyle = `rgba(0,240,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,240,255,0.5)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


// ── GLOW BORDER (mouse position CSS vars) ─────────────────
document.querySelectorAll('.glow-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});


// ── NAVBAR — shrink on scroll ──────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.padding = '0';
    } else {
      navbar.style.padding = '';
    }
  }, { passive: true });
})();


// ── MOBILE MENU TOGGLE ─────────────────────────────────────
(function initMobileMenu() {
  const burger   = document.getElementById('burger');
  const navMobile = document.getElementById('nav-mobile');
  if (!burger || !navMobile) return;

  burger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    const isOpen = navMobile.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  // Close on link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '1';
      });
    });
  });
})();


// ── SCROLL-IN ANIMATIONS ───────────────────────────────────
(function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.bento-card, .info-card, .skills-group, .contact-item'
  );

  // Add CSS class first so transition is defined in CSS, not inline
  targets.forEach(el => el.classList.add('anim-ready'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();
