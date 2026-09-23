/**
 * Saaniya EMR static site helpers:
 * - IntersectionObserver reveal
 * - Sticky header scroll class (transparent over home hero)
 * - Regional pricing tabs (India default; USA excluded)
 */
(function () {
  "use strict";

  var STORAGE_KEY = "saaniya-emr-region";
  var DEFAULT_REGION = "india";

  var REGIONS = {
    india: {
      id: "india",
      label: "India",
      shortLabel: "India",
      currencyNote: "INR · excl. taxes",
      detail:
        "Primary market — outpatient / OPD clinics and multi-specialty private practices",
      complianceNote:
        "DPDP-aligned processor terms. Clinical notes stay on clinic hardware.",
      tiers: [
        {
          name: "Starter",
          audience: "Solo doctor or single-room clinic",
          license: "₹20,000 – ₹25,000 one-time",
          website: "₹8,000 setup + ₹4,000 / year",
          maintenance: "₹6,000 – ₹8,000 / year",
          includes: [
            "Desktop EMR licence (Service A)",
            "Payment display for your own QR (Service C)",
            "Optional managed clinic website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-doctor or multi-specialty practice",
          license: "₹40,000 – ₹50,000 one-time",
          website: "₹15,000 setup + ₹8,000 / year",
          maintenance: "₹12,000 – ₹18,000 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed clinic website recommended",
            "Priority support under maintenance",
          ],
        },
        {
          name: "Enterprise",
          audience: "Hospital, multi-branch, or custom compliance",
          license: "Custom licence",
          website: "Custom multi-branch build",
          maintenance: "Custom annual contract",
          includes: [
            "Multi-site licences",
            "Custom branding and domains",
            "Roadmap modules — inventory, therapy, connectors",
            "Dedicated onboarding",
          ],
        },
      ],
    },
    southeast_asia: {
      id: "southeast_asia",
      label: "Southeast Asia",
      shortLabel: "SE Asia",
      currencyNote: "USD · excl. taxes",
      detail:
        "Singapore, Malaysia, Thailand, Indonesia, Philippines, and neighbours",
      complianceNote:
        "Local privacy notices and DPA-style contracts before first sale. Local payment display (QR / bank).",
      tiers: [
        {
          name: "Starter",
          audience: "Solo or boutique wellness clinic",
          license: "$280 – $360 one-time",
          website: "$120 setup + $60 / year",
          maintenance: "$90 – $120 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned QR / pay instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-doctor or multi-specialty practice",
          license: "$550 – $720 one-time",
          website: "$200 setup + $110 / year",
          maintenance: "$160 – $230 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support under maintenance",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-branch or custom compliance",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: [
            "Multi-site licences",
            "Custom domains and branding",
            "Dedicated onboarding",
          ],
        },
      ],
    },
    europe: {
      id: "europe",
      label: "Europe",
      shortLabel: "Europe",
      currencyNote: "USD · excl. taxes · EUR on request",
      detail: "UK, EU, and EEA private / wellness / integrative clinics",
      complianceNote:
        "GDPR-ready architecture with Art. 28 processor terms. Not marketed as certified. EU/UK hosting option on roadmap.",
      tiers: [
        {
          name: "Starter",
          audience: "Niche / wellness / integrative practice",
          license: "$400 – $550 one-time",
          website: "$200 setup + $120 / year",
          maintenance: "$150 – $200 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned payment instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-clinician private practice",
          license: "$800 – $1,100 one-time",
          website: "$350 setup + $200 / year",
          maintenance: "$300 – $400 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site or custom contracts",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: [
            "Multi-site licences",
            "Regional hosting discussion",
            "Dedicated onboarding",
          ],
        },
      ],
    },
    australia: {
      id: "australia",
      label: "Australia & New Zealand",
      shortLabel: "AU / NZ",
      currencyNote: "USD · excl. taxes · AUD on request",
      detail:
        "Private, allied, and wellness clinics — English sales, privacy-first story",
      complianceNote:
        "Cross-border disclosure handled by contract (APP 8 / NZ Health Code expectations). Local-first clinical DB is the sales point.",
      tiers: [
        {
          name: "Starter",
          audience: "Boutique / wellness clinic",
          license: "$400 – $550 one-time",
          website: "$200 setup + $120 / year",
          maintenance: "$150 – $200 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned payment instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-clinician practice",
          license: "$800 – $1,100 one-time",
          website: "$350 setup + $200 / year",
          maintenance: "$300 – $400 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: ["Multi-site licences", "Dedicated onboarding"],
        },
      ],
    },
    south_america: {
      id: "south_america",
      label: "South America",
      shortLabel: "LATAM",
      currencyNote: "USD · excl. taxes · BRL on request",
      detail: "Brazil first, then selective Spanish-speaking markets",
      complianceNote:
        "LGPD-style controller/processor terms for Brazil. Positioned as multi-specialty local-first — not Ayurveda-only.",
      tiers: [
        {
          name: "Starter",
          audience: "Solo or small private clinic",
          license: "$300 – $400 one-time",
          website: "$150 setup + $80 / year",
          maintenance: "$100 – $140 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned PIX / bank / QR display",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-doctor practice",
          license: "$600 – $800 one-time",
          website: "$250 setup + $150 / year",
          maintenance: "$200 – $280 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site or residency-sensitive hosting",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: [
            "Multi-site licences",
            "Hosting residency discussion",
            "Dedicated onboarding",
          ],
        },
      ],
    },
    south_asia: {
      id: "south_asia",
      label: "South Asia",
      shortLabel: "South Asia",
      currencyNote: "USD · excl. taxes",
      detail: "Nepal, Bangladesh, Sri Lanka, Bhutan, Maldives, and Pakistan",
      complianceNote: "Local privacy terms before first sale. Clinic-owned payment display.",
      tiers: [
        {
          name: "Starter",
          audience: "Solo doctor or single-room clinic",
          license: "$240 – $320 one-time",
          website: "$100 setup + $50 / year",
          maintenance: "$70 – $95 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned QR / pay instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-doctor or multi-specialty practice",
          license: "$480 – $620 one-time",
          website: "$180 setup + $95 / year",
          maintenance: "$145 – $210 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support under maintenance",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-branch or custom compliance",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: ["Multi-site licences", "Dedicated onboarding"],
        },
      ],
    },
    africa: {
      id: "africa",
      label: "Africa",
      shortLabel: "Africa",
      currencyNote: "USD · excl. taxes",
      detail: "Kenya, Nigeria, Ghana, South Africa, Egypt, and neighbours",
      complianceNote: "Local privacy terms before first sale. Clinic-owned payment display.",
      tiers: [
        {
          name: "Starter",
          audience: "Solo or small private clinic",
          license: "$260 – $350 one-time",
          website: "$110 setup + $55 / year",
          maintenance: "$80 – $110 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned QR / bank display",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-doctor practice",
          license: "$520 – $700 one-time",
          website: "$200 setup + $110 / year",
          maintenance: "$160 – $230 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: ["Multi-site licences", "Dedicated onboarding"],
        },
      ],
    },
    mena: {
      id: "mena",
      label: "Middle East",
      shortLabel: "Middle East",
      currencyNote: "USD · excl. taxes · AED or SAR on request",
      detail: "UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, and Jordan",
      complianceNote: "Local privacy terms before first sale. Clinic-owned payment display.",
      tiers: [
        {
          name: "Starter",
          audience: "Solo or boutique clinic",
          license: "$350 – $480 one-time",
          website: "$170 setup + $100 / year",
          maintenance: "$130 – $180 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned payment instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-doctor practice",
          license: "$700 – $960 one-time",
          website: "$300 setup + $170 / year",
          maintenance: "$260 – $350 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: ["Multi-site licences", "Dedicated onboarding"],
        },
      ],
    },
    uk: {
      id: "uk",
      label: "United Kingdom",
      shortLabel: "UK",
      currencyNote: "GBP · excl. VAT",
      detail: "Private and wellness clinics in the United Kingdom",
      complianceNote: "GDPR-ready architecture with processor terms. Not marketed as certified.",
      tiers: [
        {
          name: "Starter",
          audience: "Niche / wellness / integrative practice",
          license: "£310 – £430 one-time",
          website: "£160 setup + £90 / year",
          maintenance: "£120 – £160 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned payment instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-clinician private practice",
          license: "£620 – £860 one-time",
          website: "£270 setup + £160 / year",
          maintenance: "£230 – £310 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site or custom contracts",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: ["Multi-site licences", "Dedicated onboarding"],
        },
      ],
    },
    other_high: {
      id: "other_high",
      label: "Canada, Japan, Korea, Singapore, Switzerland, Israel",
      shortLabel: "Other",
      currencyNote: "USD · excl. taxes",
      detail: "Same pilot band as Australia and New Zealand. Local currency on request.",
      complianceNote: "Contract terms confirmed before first sale. This is not a United States price.",
      tiers: [
        {
          name: "Starter",
          audience: "Boutique / wellness clinic",
          license: "$400 – $550 one-time",
          website: "$200 setup + $120 / year",
          maintenance: "$150 – $200 / year",
          includes: [
            "Desktop EMR licence",
            "Clinic-owned payment instructions",
            "Optional managed website",
            "Optional annual maintenance",
          ],
        },
        {
          name: "Professional",
          audience: "Multi-clinician practice",
          license: "$800 – $1,100 one-time",
          website: "$350 setup + $200 / year",
          maintenance: "$300 – $400 / year",
          featured: true,
          includes: [
            "Everything in Starter",
            "Multi-user roles and optional specialty chart packs",
            "Managed website recommended",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          audience: "Multi-site",
          license: "Custom",
          website: "Custom",
          maintenance: "Custom",
          includes: ["Multi-site licences", "Dedicated onboarding"],
        },
      ],
    },
    united_states: {
      id: "united_states",
      label: "United States",
      shortLabel: "United States",
      currencyNote: "Not offered",
      detail: "Deferred until a HIPAA / BAA-backed offering exists.",
      complianceNote: "No public US price list.",
      unavailable: true,
      tiers: [],
    },
  };

  var COUNTRIES = [
    ["Argentina", "south_america"],
    ["Australia", "australia"],
    ["Bahrain", "mena"],
    ["Bangladesh", "south_asia"],
    ["Bhutan", "south_asia"],
    ["Brazil", "south_america"],
    ["Canada", "other_high"],
    ["Chile", "south_america"],
    ["Colombia", "south_america"],
    ["Egypt", "africa"],
    ["Ethiopia", "africa"],
    ["France", "europe"],
    ["Germany", "europe"],
    ["Ghana", "africa"],
    ["India", "india"],
    ["Indonesia", "southeast_asia"],
    ["Ireland", "europe"],
    ["Israel", "other_high"],
    ["Italy", "europe"],
    ["Japan", "other_high"],
    ["Jordan", "mena"],
    ["Kenya", "africa"],
    ["Kuwait", "mena"],
    ["Malaysia", "southeast_asia"],
    ["Maldives", "south_asia"],
    ["Mexico", "south_america"],
    ["Morocco", "africa"],
    ["Nepal", "south_asia"],
    ["Netherlands", "europe"],
    ["New Zealand", "australia"],
    ["Nigeria", "africa"],
    ["Oman", "mena"],
    ["Pakistan", "south_asia"],
    ["Peru", "south_america"],
    ["Philippines", "southeast_asia"],
    ["Qatar", "mena"],
    ["Rwanda", "africa"],
    ["Saudi Arabia", "mena"],
    ["Singapore", "other_high"],
    ["South Africa", "africa"],
    ["South Korea", "other_high"],
    ["Spain", "europe"],
    ["Sri Lanka", "south_asia"],
    ["Sweden", "europe"],
    ["Switzerland", "other_high"],
    ["Tanzania", "africa"],
    ["Thailand", "southeast_asia"],
    ["Uganda", "africa"],
    ["United Arab Emirates", "mena"],
    ["United Kingdom", "uk"],
    ["United States", "united_states"],
    ["Vietnam", "southeast_asia"],
  ];

  var REGION_ORDER = [
    "india",
    "south_asia",
    "africa",
    "southeast_asia",
    "south_america",
    "mena",
    "uk",
    "europe",
    "australia",
    "other_high",
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getStoredRegion() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && REGIONS[saved]) return saved;
    } catch (e) {
      /* ignore */
    }
    return DEFAULT_REGION;
  }

  function setStoredRegion(id) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------- Reveal ---------- */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Header scroll ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var onScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add("is-solid");
      } else {
        header.classList.remove("is-solid");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Region pricing ---------- */
  function renderTeaserRows(region, container) {
    if (region.unavailable) {
      container.innerHTML =
        '<p class="region-chooser__excluded">United States is not offered. No public US price list.</p>';
      return;
    }
    container.innerHTML = region.tiers
      .map(function (tier, index) {
        return (
          '<div class="pricing-teaser__row reveal" style="--reveal-delay:' +
          index * 90 +
          'ms">' +
          '<div class="pricing-teaser__grid">' +
          "<div>" +
          "<h3>" +
          escapeHtml(tier.name) +
          "</h3>" +
          '<p class="text-muted" style="margin:0.25rem 0 0;font-size:0.875rem;line-height:1.35">' +
          escapeHtml(tier.audience) +
          "</p>" +
          "</div>" +
          "<div>" +
          '<p class="price-cell__label">Software licence</p>' +
          '<p class="price-cell__value price-cell__value--strong">' +
          escapeHtml(tier.license) +
          "</p>" +
          "</div>" +
          "<div>" +
          '<p class="price-cell__label">Website</p>' +
          '<p class="price-cell__value">' +
          escapeHtml(tier.website) +
          "</p>" +
          "</div>" +
          "<div>" +
          '<p class="price-cell__label">Maintenance</p>' +
          '<p class="price-cell__value">' +
          escapeHtml(tier.maintenance) +
          "</p>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    container.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function renderPricingCards(region, container) {
    if (region.unavailable) {
      container.innerHTML =
        '<p class="region-chooser__excluded">United States is not offered. Deferred until a HIPAA / BAA-backed offering exists. No public US price list.</p>';
      return;
    }
    container.innerHTML = region.tiers
      .map(function (tier, index) {
        var includes = tier.includes
          .map(function (item) {
            return (
              '<li><span class="dot dot--accent" aria-hidden="true"></span><span>' +
              escapeHtml(item) +
              "</span></li>"
            );
          })
          .join("");

        return (
          '<article class="pricing-card reveal' +
          (tier.featured ? " pricing-card--featured" : "") +
          '" style="--reveal-delay:' +
          index * 100 +
          'ms">' +
          (tier.featured
            ? '<p class="pricing-card__badge">Most clinics choose this</p>'
            : "") +
          "<h3>" +
          escapeHtml(tier.name) +
          "</h3>" +
          '<p class="pricing-card__audience">' +
          escapeHtml(tier.audience) +
          "</p>" +
          "<dl>" +
          "<div><dt>A · Software (one-time)</dt><dd class=\"strong\">" +
          escapeHtml(tier.license) +
          "</dd></div>" +
          "<div><dt>B · Website</dt><dd>" +
          escapeHtml(tier.website) +
          "</dd></div>" +
          "<div><dt>C · Payment display</dt><dd>Included with software</dd></div>" +
          "<div><dt>D · Maintenance (annual)</dt><dd>" +
          escapeHtml(tier.maintenance) +
          "</dd></div>" +
          "</dl>" +
          "<ul>" +
          includes +
          "</ul>" +
          "</article>"
        );
      })
      .join("");

    container.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function updateChooserMeta(region, root) {
    var currency = root.querySelector("[data-region-currency]");
    var detail = root.querySelector("[data-region-detail]");
    if (currency) currency.textContent = region.currencyNote;
    if (detail) {
      detail.innerHTML =
        "<strong>" +
        escapeHtml(region.label) +
        ".</strong> " +
        escapeHtml(region.detail) +
        " " +
        escapeHtml(region.complianceNote);
    }

    root.querySelectorAll(".region-tab").forEach(function (btn) {
      var active = btn.getAttribute("data-region") === region.id;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  function updateSurveyLabels(region) {
    document.querySelectorAll("[data-survey-region-label]").forEach(function (el) {
      var base = el.getAttribute("data-survey-region-label") || "Share clinic needs";
      el.textContent = base + " (" + region.shortLabel + ")";
    });
  }

  function updateFullPricingLinks(region) {
    document.querySelectorAll("[data-full-pricing-label]").forEach(function (el) {
      el.textContent = "Full pricing for " + region.shortLabel;
    });
  }

  function applyRegion(id) {
    var region = REGIONS[id] || REGIONS[DEFAULT_REGION];
    setStoredRegion(region.id);

    document.querySelectorAll("[data-region-chooser]").forEach(function (root) {
      updateChooserMeta(region, root);
    });

    document.querySelectorAll("[data-pricing-teaser]").forEach(function (el) {
      renderTeaserRows(region, el);
    });

    document.querySelectorAll("[data-pricing-cards]").forEach(function (el) {
      renderPricingCards(region, el);
    });

    document.querySelectorAll("[data-country-select]").forEach(function (select) {
      var match = COUNTRIES.filter(function (row) {
        return row[1] === region.id && row[0] === select.value;
      });
      if (!match.length) {
        var first = COUNTRIES.filter(function (row) {
          return row[1] === region.id;
        })[0];
        if (first) select.value = first[0];
      }
    });

    updateSurveyLabels(region);
    updateFullPricingLinks(region);
  }

  function initCountrySelect() {
    var selects = document.querySelectorAll("[data-country-select]");
    if (!selects.length) return;

    selects.forEach(function (select) {
      COUNTRIES.forEach(function (row) {
        var opt = document.createElement("option");
        opt.value = row[0];
        opt.textContent = row[0];
        select.appendChild(opt);
      });
      select.addEventListener("change", function () {
        var row = COUNTRIES.filter(function (item) {
          return item[0] === select.value;
        })[0];
        if (row) applyRegion(row[1]);
      });
    });
  }

  function initPricingMatrix() {
    var body = document.querySelector("[data-emr-matrix]");
    if (!body) return;
    REGION_ORDER.forEach(function (id) {
      var region = REGIONS[id];
      if (!region || region.unavailable) return;
      var starter = region.tiers[0] ? region.tiers[0].license : "";
      var professional = region.tiers[1] ? region.tiers[1].license : "";
      var names = COUNTRIES.filter(function (row) {
        return row[1] === id;
      })
        .map(function (row) {
          return row[0];
        })
        .join(", ");
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        escapeHtml(region.label) +
        "</td><td>" +
        escapeHtml(names) +
        '</td><td class="num">' +
        escapeHtml(starter) +
        '</td><td class="num">' +
        escapeHtml(professional) +
        "</td>";
      body.appendChild(tr);
    });
  }

  function initRegionChooser() {
    var choosers = document.querySelectorAll("[data-region-chooser]");
    if (!choosers.length) return;

    var current = getStoredRegion();

    choosers.forEach(function (root) {
      root.addEventListener("click", function (e) {
        var btn = e.target.closest(".region-tab");
        if (!btn || !root.contains(btn)) return;
        var id = btn.getAttribute("data-region");
        if (id && REGIONS[id]) applyRegion(id);
      });
    });

    applyRegion(current);
  }

  function initPrintButtons() {
    document.querySelectorAll("[data-print]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.print();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initReveal();
    initCountrySelect();
    initRegionChooser();
    initPricingMatrix();
    initPrintButtons();
  });

  window.SaaniyaEmrRegions = {
    REGIONS: REGIONS,
    REGION_ORDER: REGION_ORDER,
    COUNTRIES: COUNTRIES,
    getStoredRegion: getStoredRegion,
    applyRegion: applyRegion,
  };
})();
