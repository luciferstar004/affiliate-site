 const site = {
      brandName: " Curated ",
      brandAccent: " Picks ",
      nav: [
        { label: "Shop", href: "#products" },
        { label: "Guide", href: "best-wireless-earbuds-Under-2000.html" },
        { label: "Amazon Deals", href: "https://amzn.to/4nTJnp8", cta: true, external: true }
      ],
      hero: {
        badge: "Handpicked Amazon Finds",
        titleHtml: '<span class="accent-word">Discover</span><br><em>products</em> you will<br><span class="accent-word">love</span>',
        subtitle: "Clear product notes and buying guides that help you compare options before checking the latest details on Amazon.",
        buttons: [
          { label: "Browse Picks", href: "#products", style: "primary" },
          { label: "Read the Guide ->", href: "best-wireless-earbuds-Under-2000.html", style: "secondary" }
        ]
      },
      stats: [
        { value: "4", label: "current picks" },
        { value: "1", label: "buying guide" },
        { value: "Clear", label: "comparison notes" },
        { value: "Visible", label: "affiliate disclosure" }
      ],
      featured: {
        eyebrow: "Quick comparison",
        titleHtml: "Four picks, <em>four different strengths</em>",
        text: "Use the product notes to make a shortlist, then confirm the latest price, availability, and specifications on Amazon.",
        button: "See all picks"
      },
      footer: {
        intro: "Independent product recommendations and buying guides with clearly marked Amazon affiliate links.",
        disclaimer: "As an Amazon Associate I earn from qualifying purchases. Product prices and availability are subject to change.",
        columns: [
          {
            title: "Explore",
            links: [
              { label: "All products", href: "#products" },
              { label: "Earbuds guide", href: "best-wireless-earbuds-Under-2000.html" }
            ]
          },
          {
            title: "Pages",
            links: [
              { label: "Contact", href: "contact.html" },
              { label: "Affiliate Disclosure", href: "affiliate-disclosure.html" },
              { label: "Privacy Policy", href: "privacy-policy.html" }
            ]
          },
          {
            title: "Project",
            links: [
              { label: "GitHub", href: "https://github.com/luciferstar004/affiliate-site", external: true }
            ]
          }
        ]
      }
    };

    const categories = [
      { id: "all", label: "All" },
      { id: "tech", label: "Tech & Gadgets" },
      { id: "earbuds", label: "Earbuds" },
      { id: "gaming", label: "Gaming" },
      { id: "anc", label: "ANC" }
    ];

    let products = [];
    fetch("products/products.json")
      .then(response => {
        if (!response.ok) throw new Error(`Product data failed to load: ${response.status}`);
        return response.json();
      })
      .then(data => {
        products = data;
        renderSiteShell();
        renderFeaturedCards();
        updateProductView();
        bindEvents();
        attachCustomCursor();
      })
      .catch(error => {
        console.error(error);
        document.getElementById("productGrid").innerHTML =
          '<p class="load-error">The product list could not be loaded. Please try again later.</p>';
      });
          let activeCategory = "all";

    const externalIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
     function productLink(product) {
      return product.link || "";
    }

    function renderSiteShell() {
      document.title = "Curated Picks | Independent Product Guides";
          document.getElementById("siteLogo").innerHTML = `${escapeHtml(site.brandName)}<span>${escapeHtml(site.brandAccent)}</span>`;
      document.getElementById("heroBadge").textContent = site.hero.badge;
      document.getElementById("heroTitle").innerHTML = site.hero.titleHtml;
      document.getElementById("heroSubtitle").textContent = site.hero.subtitle;
       document.getElementById("navLinks").innerHTML = site.nav.map(item => `
        <li>
          <a href="${escapeHtml(item.href)}"
             class="${item.cta ? "nav-cta" : ""}"
             ${item.external ? 'target="_blank" rel="nofollow sponsored noopener"' : ""}>
            ${escapeHtml(item.label)}${item.cta ? " ->" : ""}
          </a>
        </li>
      `).join("");
      
      document.getElementById("heroActions").innerHTML = site.hero.buttons.map(button => {
        const cls = button.style === "primary" ? "btn-primary" : "btn-secondary";
        return `<a href="${escapeHtml(button.href)}" class="${cls}">${escapeHtml(button.label)}</a>`;
      }).join("");

      document.getElementById("statsStrip").innerHTML = site.stats.map(stat => `
        <div class="stat-item">
          <div class="stat-num">${escapeHtml(stat.value)}</div>
          <div class="stat-label">${escapeHtml(stat.label)}</div>
        </div>
      `).join("");

      const heroProducts = products.slice(0, 3);
      document.getElementById("heroCards").innerHTML = heroProducts.map(product => `
        <div class="float-card">
           <div class="float-card-image">${escapeHtml(product.imageLabel)}</div>
          <p>${escapeHtml(product.title)}</p>
          <span>${escapeHtml(product.badge)}</span>
        </div>
      `).join("");

      document.getElementById("featuredEyebrow").textContent = site.featured.eyebrow;
      document.getElementById("featuredTitle").innerHTML = site.featured.titleHtml;
      document.getElementById("featuredText").textContent = site.featured.text;
      document.getElementById("featuredButton").textContent = site.featured.button;
      document.getElementById("featuredButton").addEventListener("click", () => filterCards("deals"));

      document.getElementById("footer").innerHTML = `
        <div class="footer-brand">
          <div class="logo">${escapeHtml(site.brandName)}<span>${escapeHtml(site.brandAccent)}</span></div>
          <p>${escapeHtml(site.footer.intro)}</p>
          <p class="footer-disclaimer">${escapeHtml(site.footer.disclaimer)}</p>
        </div>
        ${site.footer.columns.map(column => `
          <div class="footer-col">
            <h4>${escapeHtml(column.title)}</h4>
            <ul>
                ${column.links.map(link => `
                <li>
                  <a href="${escapeHtml(link.href)}"
                     ${link.external ? 'target="_blank" rel="noopener"' : ""}>
                    ${escapeHtml(link.label)}
                  </a>
                </li>
              `).join("")}
                    `;
    }

    function renderFilters() {
      document.getElementById("filterPills").innerHTML = categories.map(category => `
        <button class="pill ${category.id === activeCategory ? "active" : ""}" type="button" data-category="${escapeHtml(category.id)}">
          ${escapeHtml(category.label)}
        </button>
      `).join("");

      document.querySelectorAll(".pill").forEach(button => {
        button.addEventListener("click", () => filterCards(button.dataset.category));
      });
    }

    function renderProducts(list) {
      const grid = document.getElementById("productGrid");
      grid.innerHTML = list.map(product => `
        <div class="card-wrapper reveal" data-tags="${escapeHtml(product.tags.join(" "))}" data-search="${escapeHtml(`${product.title} ${product.category} ${product.searchTerms}`.toLowerCase())}">
          <article class="product-card">
            <div class="card-image ${escapeHtml(product.color)}">
              ${product.badge ? `<div class="card-badge ${product.badge.toLowerCase() === "deal" ? "deal" : "new"}">${escapeHtml(product.badge)}</div>` : ""}
              <div class="card-shine"></div>
              <img
                src="${escapeHtml(product.image)}"
                alt="${escapeHtml(product.title)}"
                class="product-image"
                loading="lazy"
              />
            </div>
              <div class="card-body">
                <div class="card-category">${escapeHtml(product.category)}</div>
                <h3 class="card-title">${escapeHtml(product.title)}</h3>
                <p class="card-desc">${escapeHtml(product.description)}</p>
                <div class="card-stars" aria-label="${escapeHtml(`${product.rating} out of 5 stars`)}">${renderStars(product.rating)} <span>(${escapeHtml(product.reviews)})</span>
              </div>

