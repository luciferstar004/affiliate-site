    /*
      EDIT THIS SECTION FIRST
      Change the text, categories, products, prices, and links below.
      The page updates itself from these arrays, so you do not need to copy
      product-card HTML every time you add a product.
    */
const affiliateTag = "YOUR-TAG";

    const site = {
      brandName: " Curated ",
      brandAccent: " Picks ",
      nav: [
        { label: "Shop", href: "#products" },
        { label: "Deals", href: "#featured" },
        { label: "Amazon Deals", href: "https://amzn.to/4nTJnp8", cta: true }
      ],
      hero: {
        badge: "Handpicked Amazon Finds",
        titleHtml: '<span class="accent-word">Discover</span><br><em>products</em> you will<br><span class="accent-word">love</span>',
        subtitle: "Carefully curated picks across tech, fashion, home, and more - with clear pricing, useful notes, and affiliate links ready for your tracking tag.",
        buttons: [
          { label: "Browse Picks", href: "#products", style: "primary" },
          { label: "View Deals ->", href: "#featured", style: "secondary" }
        ]
      },
      stats: [
        { value: "50+", label: "curated finds" },
        { value: "4.5+", label: "average rating" },
        { value: "Daily", label: "deal checks" },
        { value: "100%", label: "affiliate disclosure" }
      ],
      featured: {
        eyebrow: "Limited Time",
        titleHtml: "Hot deals, <em>updated daily</em>",
        text: "Track price drops across your favorite categories and send shoppers straight to your affiliate links.",
        button: "See all deals"
      },
      footer: {
        intro: "Independent product recommendations with Amazon affiliate links. Replace the demo products with items you genuinely recommend.",
        disclaimer: "As an Amazon Associate I earn from qualifying purchases. Product prices and availability are subject to change.",
        columns: [
          {
            title: "Categories",
            links: ["Tech & Gadgets", "Home & Kitchen", "Fashion", "Health & Beauty", "Books"]
          },
          {
            title: "Pages",
            links: ["About Us", "Contact", "Affiliate Disclosure", "Privacy Policy", ""]
          },
          {
            title: "Follow",
            links: ["Instagram", "Pinterest", "YouTube", "Newsletter"]
          }
        ]
      }
    };

    const categories = [
      { id: "all", label: "All" },
      { id: "deals", label: "Deals" },
      { id: "tech", label: "Tech & Gadgets" },
      { id: "home", label: "Home & Kitchen" },
      { id: "fashion", label: "Fashion" },
      { id: "health", label: "Health & Beauty" },
      { id: "books", label: "Books" },
      { id: "outdoor", label: "Outdoor" }
    ];
    let products = [];
    fetch('products/products.json')
    .then(response => response.json())
    .then(data => {
    products = data;

    renderSiteShell();
    renderFeaturedCards();
    updateProductView();
    bindEvents();
    attachCustomCursor();
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
      if (!product.link) {
        return `https://www.amazon.in/?tag=${encodeURIComponent(affiliateTag)}`;
      }

      if (product.link.includes("YOUR-TAG")) {
        return product.link.replaceAll("YOUR-TAG", encodeURIComponent(affiliateTag));
      }

      return product.link;
    }

    function renderStars(rating) {
      const full = Math.max(0, Math.min(5, Number(rating) || 0));
      return `${"★".repeat(full)}${"☆".repeat(5 - full)}`;
    }

    function renderSiteShell() {
      document.title = `${site.brandName}${site.brandAccent} - Amazon Finds`;
      document.getElementById("siteLogo").innerHTML = `${escapeHtml(site.brandName)}<span>${escapeHtml(site.brandAccent)}</span>`;
      document.getElementById("heroBadge").textContent = site.hero.badge;
      document.getElementById("heroTitle").innerHTML = site.hero.titleHtml;
      document.getElementById("heroSubtitle").textContent = site.hero.subtitle;

      document.getElementById("navLinks").innerHTML = site.nav.map(item => `
        <li><a href="${escapeHtml(item.href)}" class="${item.cta ? "nav-cta" : ""}">${escapeHtml(item.label)}${item.cta ? " ->" : ""}</a></li>
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
          <span>${escapeHtml(product.price)}</span>
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
              ${column.links.map(link => `<li><a href="#">${escapeHtml(link)}</a></li>`).join("")}
            </ul>
          </div>
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
               />
            </div>
            <div class="card-body">
              <div class="card-category">${escapeHtml(product.category)}</div>
              <h3 class="card-title">${escapeHtml(product.title)}</h3>
              <p class="card-desc">${escapeHtml(product.description)}</p>
              <div class="card-stars" aria-label="${escapeHtml(`${product.rating} out of 5 stars`)}">${renderStars(product.rating)} <span>(${escapeHtml(product.reviews)})</span></div>
              <div class="card-footer">
                <div>
                  <span class="card-price">${escapeHtml(product.price)}</span>
                  ${product.oldPrice ? `<span class="card-price-old">${escapeHtml(product.oldPrice)}</span>` : ""}
                </div>
                <a href="${escapeHtml(productLink(product))}" target="_blank" rel="nofollow sponsored noopener" class="card-btn">Amazon ${externalIcon}</a>
              </div>
            </div>
          </article>
        </div>
      `).join("");

      attachCardTilt();
      revealVisibleCards();
    }

    function renderFeaturedCards() {
      const dealProducts = products.filter(product => product.tags.includes("deals")).slice(0, 4);
      document.getElementById("featuredCards").innerHTML = dealProducts.map(product => {
        const discount = product.oldPrice ? estimateDiscount(product.price, product.oldPrice) : "Deal";
        return `
          <div class="mini-card">
            <div class="mini-visual">${escapeHtml(product.imageLabel.slice(0, 2))}</div>
            <div class="mini-name">${escapeHtml(product.title)}</div>
            <div class="mini-price">${escapeHtml(discount)}</div>
          </div>
        `;
      }).join("");
    }

    function estimateDiscount(price, oldPrice) {
      const current = Number(String(price).replace(/[^0-9.]/g, ""));
      const previous = Number(String(oldPrice).replace(/[^0-9.]/g, ""));
      if (!current || !previous || current >= previous) return "Deal";
      return `-${Math.round(((previous - current) / previous) * 100)}% today`;
    }

    function getFilteredProducts() {
      const q = document.getElementById("searchInput").value.toLowerCase().trim();
      return products.filter(product => {
        const categoryMatch = activeCategory === "all" || product.tags.includes(activeCategory);
        const searchable = `${product.title} ${product.category} ${product.searchTerms}`.toLowerCase();
        const searchMatch = !q || searchable.includes(q);
        return categoryMatch && searchMatch;
      });
    }

    function updateProductView() {
      const q = document.getElementById("searchInput").value.toLowerCase().trim();
      const filtered = getFilteredProducts();
      renderFilters();
      renderProducts(filtered);
      document.getElementById("resultCount").textContent = `Showing ${filtered.length} product${filtered.length === 1 ? "" : "s"}`;
      document.getElementById("searchResultLabel").textContent = q ? `Results for "${q}"` : "";
      document.getElementById("noResults").style.display = filtered.length ? "none" : "block";
    }

    function filterCards(category) {
      activeCategory = category;
      document.getElementById("searchInput").value = "";
      updateProductView();
    }

    function doSearch() {
      activeCategory = "all";
      updateProductView();
    }

    function attachCustomCursor() {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      document.body.classList.add("has-custom-cursor");

      const cursor = document.getElementById("cursor");
      const ring = document.getElementById("cursorRing");
      let mx = 0;
      let my = 0;
      let rx = 0;
      let ry = 0;

      document.addEventListener("mousemove", event => {
        mx = event.clientX;
        my = event.clientY;
      });

      function animateCursor() {
        cursor.style.left = `${mx}px`;
        cursor.style.top = `${my}px`;
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
        requestAnimationFrame(animateCursor);
      }

      animateCursor();
    }

    function attachCardTilt() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("mousemove", event => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          const rotateX = (y / rect.height) * -12;
          const rotateY = (x / rect.width) * 12;
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });
    }

    function revealVisibleCards() {
      const reveals = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => entry.target.classList.add("visible"), index * 50);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });

      reveals.forEach(el => observer.observe(el));
    }

    function bindEvents() {
      document.getElementById("searchButton").addEventListener("click", doSearch);
      document.getElementById("searchInput").addEventListener("input", updateProductView);
      document.getElementById("searchInput").addEventListener("keydown", event => {
        if (event.key === "Enter") doSearch();
      });

      const btt = document.getElementById("backToTop");
      btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

      window.addEventListener("scroll", () => {
        document.querySelector("nav").classList.toggle("is-scrolled", window.scrollY > 10);
        btt.classList.toggle("visible", window.scrollY > 400);
      });
    }