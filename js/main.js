document.addEventListener('DOMContentLoaded', () => {
  // ==================== MOBILE NAV & ACTIVE NAV ====================
  const body = document.body;
  const toggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelectorAll(".navmenu a");
  const sections = document.querySelectorAll("section[id]");

  if (toggle) {
    toggle.addEventListener("click", () => {
      body.classList.toggle("mobile-nav-active");
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      body.classList.remove("mobile-nav-active");
    });
  });

  function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollY >= sectionTop &&
        scrollY < sectionTop + sectionHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  // ==================== JOURNEY ====================
  const events = [
    // Education
    { type: 'education', start: 2018, end: 2021, title: 'Diploma in Business Informatics with Merit', subtitle: 'NANYANG POLYTECHNIC', description: '• Bridged business processes with IT systems and data <br> • Built early technical foundations in systems and applications <br> • Vice President of Guitar Club, leading events and coordination <br> • Awarded Diploma with Merit (top 10% of graduating cohort)' },
    { type: 'education', start: 2021, end: 2024, title: 'Bachelor of Business with Honors (Distinction) ', subtitle: 'NANYANG TECHNOLOGICAL UNIVERSITY', description: '• Specialised in Banking and Finance, FinTech <br> • Held leadership roles (Secretary & Senior Advisor) <br> • Graduated with Honours (Distinction)' },
    { type: 'education', start: 2024, end: 2026, title: 'Master of Computing', subtitle: 'NATIONAL UNIVERSITY OF SINGAPORE', description: '• Focused on deepening technical knowledge and computing concepts through hands-on projects and applied learning' },
    // Work
    { type: 'work', start: 2020, end: 2021, title: 'Software Tester Intern', subtitle: 'ACCENTURE', description: '• Designed and executed functional and system test cases <br> • Collaborated with offshore development teams to identify and resolve defects <br> • Supported end-to-end system testing across modules <br> • Strengthened software quality and release stability' },
    { type: 'work', start: 2022, end: 2022, title: 'HR and Operations Intern', subtitle: 'PROPNEX SINGAPORE PTE LTD', description: '• Supported end-to-end recruitment and onboarding processes <br> • Assisted HR operations and events <br> • Coordinated logistics for company events and internal initiatives <br> • Handled real-time issue resolution during events' },
    { type: 'work', start: 2024, end: 2024, title: 'Digital Program Intern', subtitle: 'SCHNEIDER ELECTRIC', description: '• Collaborated with regional stakeholders across SEA and APAC <br> • Identified process gaps and co-developed digital solutions <br> • Automated workflows using Microsoft Power Automate <br> • Built dashboards in Tableau and Excel to support decision-making' },
    { type: 'work', start: 2024, end: 2026, title: 'STEM Educator, Part-Time', subtitle: 'NULLSPACE ROBOTICS', description: '• Tutor robotics and programming fundamentals to young learners <br> • Simplified technical concepts into engaging, hands-on activities <br> • Adapted teaching pace to different learning abilities' }
  ];

  // ---------- Calculate year range ----------
  const allYears = events.flatMap(e => [e.start, e.end]);
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const yearSpan = maxYear - minYear;

  const PX_PER_YEAR = 260;
  const totalWidth = (yearSpan + 1) * PX_PER_YEAR;

  const content = document.getElementById('timelineContent');
  const tooltip = document.getElementById('tooltip');
  const wrapper = document.getElementById('timelineWrapper');

  // If the required elements don't exist, stop (prevents errors on pages without timeline)
  if (!content || !tooltip || !wrapper) return;

  content.innerHTML = '';
  content.style.width = totalWidth + 'px';
  content.style.position = 'relative';

  // ---------- Draw central axis ----------
  const axis = document.createElement('div');
  axis.className = 'timeline-axis';
  content.appendChild(axis);

  // ---------- Draw year ticks and labels ----------
  for (let year = minYear; year <= maxYear; year++) {
    const left = (year - minYear) * PX_PER_YEAR + PX_PER_YEAR / 2;
    const tick = document.createElement('div');
    tick.className = 'timeline-tick';
    tick.style.left = left + 'px';
    content.appendChild(tick);

    const label = document.createElement('div');
    label.className = 'timeline-tick-label';
    label.style.left = left + 'px';
    label.textContent = year;
    content.appendChild(label);
  }

  // ---------- Prepare bars with sequential placement for same start year ----------
  const BASE_OFFSET = 40; // distance from central line to first bar

  const workEvents = events.filter(e => e.type === 'work');
  const eduEvents = events.filter(e => e.type === 'education');

  // Group work events by start year
  const workByStart = {};
  workEvents.forEach(ev => {
    if (!workByStart[ev.start]) workByStart[ev.start] = [];
    workByStart[ev.start].push(ev);
  });

  // For each start year, assign sequential left offsets
  Object.keys(workByStart).forEach(year => {
    const group = workByStart[year];
    // Sort: zero-duration first, then by title
    group.sort((a, b) => {
      if ((a.end === a.start) && (b.end !== b.start)) return -1;
      if ((a.end !== a.start) && (b.end === b.start)) return 1;
      return 0;
    });
    let offset = 0;
    group.forEach(ev => {
      ev.offsetX = offset;
      if (ev.start === ev.end) {
        offset += 150; // fixed width for same-year bars
      }
    });
  });

  // Combine work and education
  const allEvents = [...workEvents, ...eduEvents];

  // ---------- Draw bars ----------
  const bars = [];

  allEvents.forEach(ev => {
    const startX = (ev.start - minYear) * PX_PER_YEAR + PX_PER_YEAR / 2;
    let width, left;

    if (ev.start === ev.end) {
      width = 150;
      left = startX + (ev.offsetX || 0);
    } else {
      width = (ev.end - ev.start) * PX_PER_YEAR;
      if (width < 60) width = 60;
      left = startX + (ev.offsetX || 0);
    }

    const bar = document.createElement('div');
    bar.className = `event-bar ${ev.type}`;
    bar.style.left = left + 'px';
    bar.style.width = width + 'px';

    if (ev.type === 'work') {
      bar.style.top = `calc(50% + ${BASE_OFFSET}px)`;
    } else {
      bar.style.bottom = `calc(50% + ${BASE_OFFSET}px)`;
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = 'bar-label';
    labelSpan.textContent = `${ev.title}`;
    bar.appendChild(labelSpan);

    content.appendChild(bar);
    bars.push({ bar, data: ev });
  });

  // ---------- Tooltip popup ----------
  let activeBar = null;

  function showTooltip(event, eventData, isClick = false) {
  const bar = event.target.closest('.event-bar');
  const barRect = bar.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();

  tooltip.innerHTML = `
    <div class="tooltip-title">${eventData.title}</div>
    <div class="tooltip-subtitle">${eventData.subtitle}</div>
    <div class="tooltip-date">${eventData.start} - ${eventData.end}</div>
    <div class="tooltip-desc">${eventData.description}</div>
  `;

  // Use viewport-relative coordinates (no window.scrollX/Y)
  let left = barRect.left;
  let top = barRect.top - 80; // 80px above the bar

  // Keep tooltip inside the wrapper's visible area (viewport-relative)
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width;
  const wrapperLeft = wrapperRect.left;
  const wrapperRight = wrapperRect.right;

  if (left + tooltipWidth > wrapperRight) {
    left = wrapperRight - tooltipWidth - 5;
  }
  if (left < wrapperLeft) {
    left = wrapperLeft + 5;
  }

  // Prevent tooltip from going above viewport
  if (top < 10) {
    top = barRect.bottom + 10; // place below bar instead
  }

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.classList.add('visible');

  if (isClick) {
    if (activeBar) activeBar.classList.remove('active');
    bar.classList.add('active');
    activeBar = bar;
  }
}

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  bars.forEach(item => {
    const bar = item.bar;

    bar.addEventListener('mouseenter', (e) => {
      if (!activeBar) showTooltip(e, item.data, false);
    });
    bar.addEventListener('mouseleave', () => {
      if (!activeBar) hideTooltip();
    });

    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeBar === bar) {
        hideTooltip();
        bar.classList.remove('active');
        activeBar = null;
      } else {
        if (activeBar) activeBar.classList.remove('active');
        showTooltip(e, item.data, true);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.event-bar') && activeBar) {
      hideTooltip();
      activeBar.classList.remove('active');
      activeBar = null;
    }
  });

  // ---------- Scroll to latest (right) ----------
  wrapper.scrollLeft = content.scrollWidth;

  // ==================== RELEVANT WORKS ====================
  const cardsContainer = document.getElementById('cardsScroll');
  if (cardsContainer) {
    // ALL PROJECTS DATA
    const projects = [
      {
        id: 1,
        category: 'development',
        categoryLabel: 'Development',
        title: 'Hawker Centre Food-Waste App',
        shortDesc: 'Developed a full-stack React sustainability platform integrating GraphQL, MongoDB Atlas, external APIs, and an LLM-powered chatbot to reduce food waste.',
        longDesc: 'This project focused on reducing food waste in hawker centres by developing a full-stack React application that connects hawkers with consumers to sell surplus food at discounted prices. The backend was implemented using GraphQL APIs with MongoDB Atlas for data storage, managing users, food listings, transactions, and achievement systems. The platform integrates external services including Google Maps and Places APIs for location discovery, Stripe for secure payment processing, and carbon emission APIs to estimate environmental impact from rescued meals. An LLM-powered chatbot using Ollama was incorporated to enhance user interaction and natural-language querying. The system was built with scalability, modular architecture, and efficient frontend-backend communication in mind.',
        skills: ['React', 'GraphQL', 'Database', 'API Integration', 'Stripe', 'LLMs', 'Ollama', 'Full-Stack Development', 'Web Development'],
        imageUrl: 'assets/project-hawker.png',
        subtitle: 'Full-Stack Web Application'
      },
      {
        id: 2,
        category: 'development',
        categoryLabel: 'Development',
        title: 'Sports Analytics Chatbot',
        shortDesc: 'Enhanced an LLM-based sports analytics chatbot to deliver accurate, data-driven insights.',
        longDesc: 'For my Final Year Project, I enhanced an existing large language model (LLM)-based sports analytics chatbot by significantly improving its logic, accuracy, and user interaction flow. I refined how the chatbot interprets user queries, retrieves relevant statistics, and generates contextual responses. The system was designed to handle complex sports-related questions, integrate structured data analysis when needed, and provide clear, insightful explanations, resulting in a more reliable and engaging user experience.',
        skills: ['Python', 'LLMs', 'Data Analytics', 'Chatbot'],
        imageUrl: 'assets/project-chatbot.png',
        subtitle: 'AI, LLMs & Sports Analytics'
      },
      {
        id: 3,
        category: 'development',
        categoryLabel: 'Development',
        title: 'HDB Resale Price Prediction Model',
        shortDesc: 'Developed a machine learning model to predict housing resale prices using advanced regression techniques and feature engineering.',
        longDesc: 'This project developed a machine learning model to predict Singapore HDB resale prices using historical transaction data enriched with geospatial features such as proximity and density of MRT stations, schools, hawker centres, shopping malls, and distance to the CBD. Extensive preprocessing was conducted, including temporal feature engineering, ordinal encoding, spatial distance computation, and target encoding to handle high-cardinality categorical variables. Multiple regression models were evaluated, from linear methods to tree-based ensembles. Feature importance analysis identified town, flat type, floor area, flat age, sale year, and distance to the CBD as the strongest drivers of resale prices. The project demonstrates end-to-end machine learning development, covering data engineering, model optimisation, and interpretability.',
        skills: ['Machine Learning', 'Python', 'Data Cleaning & Preprocessing', 'Exploratory Data Analysis', 'Tableau', 'Data Visualisation', 'Feature Engineering'],
        subtitle: 'Machine Learning & Data Science Project'
      },
    ];

    const pagination = document.getElementById('carouselPagination');
    const modalBody = document.getElementById('modalBody');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Bootstrap modal instance (ensure Bootstrap JS is loaded)
    let projectModal;
    if (typeof bootstrap !== 'undefined' && document.getElementById('projectModal')) {
      projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
    }

    let currentFilter = 'all';
    const CARDS_PER_PAGE = 3;

    function createProjectCard(project) {
      return `
        <div class="project-card" data-id="${project.id}">
          <span class="project-category">${project.categoryLabel}</span>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-short-desc">${project.shortDesc}</p>
          <div>
            ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      `;
    }

    function renderProjects() {
      const filtered = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);

      cardsContainer.innerHTML = filtered.map(createProjectCard).join('');
      updatePagination();
    }

    function updatePagination() {
      const filtered = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);
      
      const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
      let dotsHtml = '';
      for (let i = 0; i < totalPages; i++) {
        dotsHtml += `<button class="pagination-dot" data-page="${i}"></button>`;
      }
      
      pagination.innerHTML = dotsHtml;
      
      document.querySelectorAll('.pagination-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          const page = parseInt(e.target.dataset.page);
          const cards = document.querySelectorAll('.project-card');
          if (cards.length === 0) return;
          
          const cardIndex = page * CARDS_PER_PAGE;
          if (cardIndex >= cards.length) return;
          
          const targetCard = cards[cardIndex];
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
      });
      
      highlightActiveDot();
    }

    function highlightActiveDot() {
      const cards = document.querySelectorAll('.project-card');
      if (!cards.length) return;
      
      const containerRect = cardsContainer.getBoundingClientRect();
      const containerLeft = containerRect.left;
      
      let firstVisibleIndex = 0;
      for (let i = 0; i < cards.length; i++) {
        const cardRect = cards[i].getBoundingClientRect();
        if (cardRect.right > containerLeft) {
          firstVisibleIndex = i;
          break;
        }
      }
      
      const page = Math.floor(firstVisibleIndex / CARDS_PER_PAGE);
      
      document.querySelectorAll('.pagination-dot').forEach((dot, i) => {
        if (i === page) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Filter buttons
    // filterButtons.forEach(btn => {
    //   btn.addEventListener('click', () => {
    //     filterButtons.forEach(b => b.classList.remove('active'));
    //     btn.classList.add('active');
    //     currentFilter = btn.dataset.filter;
    //     renderProjects();
    //     cardsContainer.scrollTo({ left: 0, behavior: 'smooth' });
    //   });
    // });

    // Scroll event for pagination dots
    let scrollTimeout;
    cardsContainer.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(highlightActiveDot, 50);
    });

    // Drag to scroll
    let isDown = false;
    let startX;
    let scrollLeft;

    cardsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      cardsContainer.classList.add('active');
      startX = e.pageX - cardsContainer.offsetLeft;
      scrollLeft = cardsContainer.scrollLeft;
    });

    cardsContainer.addEventListener('mouseleave', () => {
      isDown = false;
    });

    cardsContainer.addEventListener('mouseup', () => {
      isDown = false;
    });

    cardsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - cardsContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      cardsContainer.scrollLeft = scrollLeft - walk;
    });

    // Mouse wheel horizontal scroll
    cardsContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      cardsContainer.scrollLeft += e.deltaY * 2;
    }, { passive: false });

    // Open popup on card click
    cardsContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card || !projectModal) return;
      const projectId = card.dataset.id;
      const project = projects.find(p => p.id == projectId);
      if (!project) return;

      modalBody.innerHTML = `
        <h4>${project.title}</h4>
        <p class="text-secondary">${project.subtitle}</p>
        <p>${project.longDesc}</p>
        <div class="mb-3">
          ${project.skills.map(s => `<span class="badge bg-secondary me-1">${s}</span>`).join('')}
        </div>
        ${project.imageUrl ? `
        <div class="ratio ratio-16x9">
          <img src="${project.imageUrl}" class="img-fluid" alt="${project.title}">
        </div>` 
        : ''
      }`;
      projectModal.show();
    });

    // Initial render
    renderProjects();
  }

  // ==================== FOOTER ====================
  document.getElementById('currentYear').textContent = new Date().getFullYear();

});