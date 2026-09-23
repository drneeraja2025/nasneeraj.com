/**
 * Saaniya Office Suite — needs scoring and country pricing.
 * Pilot guide. Prices exclude taxes. Custom software is scoped separately.
 * Saaniya Software LLC does not hold client funds.
 */
(function (global) {
  "use strict";

  var PIECES = [
    { id: "website", name: "Website", setup: 1400, care: 420 },
    { id: "front", name: "Front Office", setup: 1100, care: 340 },
    { id: "bots", name: "AI bots", setup: 1300, care: 400 },
    { id: "crm", name: "CRM", setup: 1200, care: 360 },
    { id: "custom", name: "customized business software", setup: null, care: null },
    { id: "integrations", name: "Integrations", setup: 800, care: 240 },
    { id: "portals", name: "Client portals", setup: 1600, care: 480 },
    { id: "invoices", name: "Invoices", setup: 700, care: 220 }
  ];

  var BUNDLES = [
    {
      id: "desk",
      name: "Desk",
      blurb: "Public site, daily desk, and invoices.",
      pieces: ["website", "front", "invoices"],
      discount: 0.12
    },
    {
      id: "connected",
      name: "Connected",
      blurb: "Desk, plus CRM, integrations, and a client portal.",
      pieces: ["website", "front", "crm", "integrations", "portals", "invoices"],
      discount: 0.16
    },
    {
      id: "full",
      name: "Full suite",
      blurb: "All priced pieces. Custom software is quoted after the form.",
      pieces: ["website", "front", "bots", "crm", "integrations", "portals", "invoices"],
      discount: 0.2
    }
  ];

  var BANDS = {
    india: {
      id: "india",
      label: "India",
      currency: "INR",
      factor: 0.19,
      fx: 84,
      symbol: "₹",
      locale: "en-IN",
      round: 1000,
      note: "INR · excl. GST. UPI or the buyer’s own bank details on invoices."
    },
    south_asia: {
      id: "south_asia",
      label: "South Asia",
      currency: "USD",
      factor: 0.22,
      fx: 1,
      symbol: "$",
      locale: "en-US",
      round: 10,
      note: "USD · excl. taxes. Local currency on request."
    },
    africa: {
      id: "africa",
      label: "Africa",
      currency: "USD",
      factor: 0.26,
      fx: 1,
      symbol: "$",
      locale: "en-US",
      round: 10,
      note: "USD · excl. taxes. Local currency on request."
    },
    se_asia: {
      id: "se_asia",
      label: "Southeast Asia",
      currency: "USD",
      factor: 0.38,
      fx: 1,
      symbol: "$",
      locale: "en-US",
      round: 10,
      note: "USD · excl. taxes. SGD or local currency on request."
    },
    latam: {
      id: "latam",
      label: "Latin America",
      currency: "USD",
      factor: 0.45,
      fx: 1,
      symbol: "$",
      locale: "en-US",
      round: 10,
      note: "USD · excl. taxes. BRL or local currency on request."
    },
    mena: {
      id: "mena",
      label: "Middle East",
      currency: "USD",
      factor: 0.7,
      fx: 1,
      symbol: "$",
      locale: "en-US",
      round: 10,
      note: "USD · excl. taxes. AED or SAR on request."
    },
    uk: {
      id: "uk",
      label: "United Kingdom",
      currency: "GBP",
      factor: 0.84,
      fx: 0.78,
      symbol: "£",
      locale: "en-GB",
      round: 10,
      note: "GBP · excl. VAT."
    },
    europe: {
      id: "europe",
      label: "Europe",
      currency: "EUR",
      factor: 0.82,
      fx: 0.92,
      symbol: "€",
      locale: "en-IE",
      round: 10,
      note: "EUR · excl. VAT."
    },
    high: {
      id: "high",
      label: "US, Canada, Australia, NZ, Japan, Korea, Singapore",
      currency: "USD",
      factor: 1,
      fx: 1,
      symbol: "$",
      locale: "en-US",
      round: 10,
      note: "USD · excl. taxes. CAD, AUD, NZD, JPY, or SGD on request."
    }
  };

  var COUNTRIES = [
    ["Argentina", "latam"],
    ["Australia", "high"],
    ["Bahrain", "mena"],
    ["Bangladesh", "south_asia"],
    ["Bhutan", "south_asia"],
    ["Brazil", "latam"],
    ["Canada", "high"],
    ["Chile", "latam"],
    ["Colombia", "latam"],
    ["Egypt", "africa"],
    ["Ethiopia", "africa"],
    ["France", "europe"],
    ["Germany", "europe"],
    ["Ghana", "africa"],
    ["India", "india"],
    ["Indonesia", "se_asia"],
    ["Ireland", "europe"],
    ["Israel", "high"],
    ["Italy", "europe"],
    ["Japan", "high"],
    ["Jordan", "mena"],
    ["Kenya", "africa"],
    ["Kuwait", "mena"],
    ["Malaysia", "se_asia"],
    ["Maldives", "south_asia"],
    ["Mexico", "latam"],
    ["Morocco", "africa"],
    ["Nepal", "south_asia"],
    ["Netherlands", "europe"],
    ["New Zealand", "high"],
    ["Nigeria", "africa"],
    ["Oman", "mena"],
    ["Pakistan", "south_asia"],
    ["Peru", "latam"],
    ["Philippines", "se_asia"],
    ["Qatar", "mena"],
    ["Rwanda", "africa"],
    ["Saudi Arabia", "mena"],
    ["Singapore", "high"],
    ["South Africa", "africa"],
    ["South Korea", "high"],
    ["Spain", "europe"],
    ["Sri Lanka", "south_asia"],
    ["Sweden", "europe"],
    ["Switzerland", "high"],
    ["Tanzania", "africa"],
    ["Thailand", "se_asia"],
    ["Uganda", "africa"],
    ["United Arab Emirates", "mena"],
    ["United Kingdom", "uk"],
    ["United States", "high"],
    ["Vietnam", "se_asia"]
  ];

  var BAND_ORDER = ["india", "south_asia", "africa", "se_asia", "latam", "mena", "uk", "europe", "high"];

  function pieceById(id) {
    for (var i = 0; i < PIECES.length; i++) {
      if (PIECES[i].id === id) return PIECES[i];
    }
    return null;
  }

  function formatMoney(usd, band) {
    if (usd == null) return "Scoped";
    var amount = usd * band.factor * band.fx;
    var rounded = band.round >= 100
      ? Math.round(amount / band.round) * band.round
      : Math.round(amount / band.round) * band.round;
    return band.symbol + rounded.toLocaleString(band.locale);
  }

  function sumPieces(ids, field) {
    var total = 0;
    ids.forEach(function (id) {
      var piece = pieceById(id);
      if (piece && piece[field] != null) total += piece[field];
    });
    return total;
  }

  function bundleUsd(bundle, field) {
    return sumPieces(bundle.pieces, field) * (1 - bundle.discount);
  }

  function priceSelection(ids, band) {
    var priced = ids.filter(function (id) {
      var piece = pieceById(id);
      return piece && piece.setup != null;
    });
    var custom = ids.indexOf("custom") !== -1;
    var alaSetup = sumPieces(priced, "setup");
    var alaCare = sumPieces(priced, "care");
    var best = {
      label: priced.length ? "À la carte" : "None yet",
      setupUsd: alaSetup,
      careUsd: alaCare,
      bundleId: null
    };

    BUNDLES.forEach(function (bundle) {
      var covers = bundle.pieces.every(function (id) {
        return priced.indexOf(id) !== -1;
      });
      if (!covers) return;
      var extra = priced.filter(function (id) {
        return bundle.pieces.indexOf(id) === -1;
      });
      var setup = bundleUsd(bundle, "setup") + sumPieces(extra, "setup");
      var care = bundleUsd(bundle, "care") + sumPieces(extra, "care");
      if (setup < best.setupUsd) {
        best = {
          label: bundle.name,
          setupUsd: setup,
          careUsd: care,
          bundleId: bundle.id
        };
      }
    });

    return {
      label: best.label,
      setup: formatMoney(priced.length ? best.setupUsd : null, band),
      care: formatMoney(priced.length ? best.careUsd : null, band),
      custom: custom,
      bundleId: best.bundleId,
      lines: ids.map(function (id) {
        var piece = pieceById(id);
        return {
          id: id,
          name: piece.name,
          setup: formatMoney(piece.setup, band),
          care: formatMoney(piece.care, band)
        };
      })
    };
  }

  function recommend(answers) {
    var items = [];
    function add(id, why) {
      items.push({ id: id, why: why });
    }

    if (answers.website === "none") {
      add("website", "There is no public site yet.");
    } else if (answers.website === "outdated") {
      add("website", "The current site needs a rebuild.");
    }

    if (answers.reach === "scattered") {
      add("front", "Requests still arrive across phone, chat, and mail with no shared desk.");
    }

    if (answers.repeat === "often" || answers.repeat === "sometimes") {
      add("bots", "The same questions come in often enough for an assistant, with a person still in the loop.");
    }

    if (answers.leads && answers.leads !== "crm") {
      add("crm", "Leads and follow-ups are not in a shared CRM.");
    }

    if (answers.custom === "yes") {
      add("custom", "A template will not cover a job the business already does.");
    }

    var tools = answers.tools || [];
    var toolNames = tools.filter(function (name) { return name && name !== "none"; });
    if (toolNames.length) {
      add("integrations", "Keep " + toolNames.join(", ") + " connected to the desk.");
    }

    if (answers.portal === "yes" || answers.portal === "soon") {
      add("portals", "Customers should see status, documents, or invoices themselves.");
    }

    if (answers.invoice === "chat" || answers.invoice === "sheet" || answers.invoice === "need") {
      add("invoices", "Quotes, invoices, and paid marks need a proper path. Payment stays on the buyer’s own Stripe or bank/UPI.");
    }

    return items;
  }

  function countryBand(country) {
    for (var i = 0; i < COUNTRIES.length; i++) {
      if (COUNTRIES[i][0] === country) return BANDS[COUNTRIES[i][1]];
    }
    return null;
  }

  global.SaaniyaOfficeSuite = {
    PIECES: PIECES,
    BUNDLES: BUNDLES,
    BANDS: BANDS,
    BAND_ORDER: BAND_ORDER,
    COUNTRIES: COUNTRIES,
    formatMoney: formatMoney,
    bundleUsd: bundleUsd,
    priceSelection: priceSelection,
    recommend: recommend,
    countryBand: countryBand,
    pieceById: pieceById
  };
})(window);
