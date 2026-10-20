/* Content: fictional photographer "Tjorn Van Wetter". Images served from local /images folder. */
(function () {
  const u = (id, _w, folder) => {
    const file = /\.\w+$/.test(id) ? id : `${id}.jpg`;
    return `${folder}/${file}`;
  };

  const cases = [
    {
      slug: "Travel",
      title: "Travel case 1",
      kicker: "Surf / Atlantic",
      category: "travel",
      year: "2025",
      location: "Ericeira — Portugal",
      intro:
        "Duo enim genera quae erant, fecit tria. Restinguet citius, si ardentem acceperit. Haec dicuntur inconstantissime. Sed nimis multa. ",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nos commodius agimus. Non autem hoc: igitur ne illud quidem. Quacumque enim ingredimur, in aliqua historia vestigium ponimus. Et quidem, inquit, vehementer errat; Duo Reges: constructio interrete. Quae cum magnifice primo dici viderentur, considerata minus probabantur.",
      folder: "images/travel/case1",
      cover: "front",
      photos: [
        { id: "front", title: "First Light Peak", w: 3, h: 2, meta: "Canon R5 · 100–400mm · 1/2000 · f/5.6" },
        { id: "1.jpg", title: "Paddle Out", w: 2, h: 3, meta: "Canon R5 · 70–200mm · 1/1600 · f/4" },
        { id: "2.jpg", title: "Glass", w: 3, h: 2, meta: "Canon R5 · 24–70mm · 1/1000 · f/8 · water housing" },
        { id: "3.jpg", title: "The Wait", w: 3, h: 2, meta: "Canon R5 · 100–400mm · 1/2500 · f/6.3" },
        { id: "4.jpg", title: "Line Up", w: 2, h: 3, meta: "Canon R5 · 70–200mm · 1/2000 · f/4" },
        { id: "5.jpg", title: "Lip", w: 3, h: 2, meta: "Canon R5 · 24–70mm · 1/3200 · f/5.6 · water housing" },
        { id: "6.jpg", title: "Walking Home", w: 2, h: 3, meta: "Canon R5 · 35mm · 1/500 · f/2.8" },
        { id: "7.jpg", title: "Inside", w: 3, h: 2, meta: "Canon R5 · 16–35mm · 1/2000 · f/8 · water housing" }
      ]
    },
    {
      slug: "life",
      title: "Life case 1",
      kicker: "Enjoy / Coast",
      category: "life",
      year: "2024",
      location: "Brittany — France",
      intro:
        "Duo enim genera quae erant, fecit tria. Restinguet citius, si ardentem acceperit. Haec dicuntur inconstantissime. Sed nimis multa. ",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nos commodius agimus. Non autem hoc: igitur ne illud quidem. Quacumque enim ingredimur, in aliqua historia vestigium ponimus. Et quidem, inquit, vehementer errat; Duo Reges: constructio interrete. Quae cum magnifice primo dici viderentur, considerata minus probabantur.",
      folder: "images/life/case1",
      cover: "front",
      photos: [
        { id: "front", title: "Low Tide, Noon", w: 3, h: 2, meta: "Nikon FM2 · 50mm f/1.8 · Portra 400 (exp. 2009)" },
        { id: "1.jpg", title: "From Above", w: 2, h: 3, meta: "Nikon FM2 · 28mm f/2.8 · Portra 400" },
        { id: "2.jpg", title: "Towel Weather", w: 3, h: 2, meta: "Nikon FM2 · 50mm f/1.8 · Portra 400" },
        { id: "3.jpg", title: "Shoreline", w: 3, h: 2, meta: "Nikon FM2 · 35mm f/2 · Portra 160" },
        { id: "4.jpg", title: "Blue Hour Swell", w: 2, h: 3, meta: "Nikon FM2 · 50mm f/1.8 · Portra 400" },
        { id: "5.jpg", title: "Breakwater", w: 3, h: 2, meta: "Nikon FM2 · 28mm f/2.8 · Portra 160" },
        { id: "6.jpg", title: "Late Swim", w: 2, h: 3, meta: "Nikon FM2 · 50mm f/1.8 · Portra 400" }
      ]
    }
  ];

  // Teaser projects (not yet published) — fill the grid & category filter.
  const teasers = [
    { title: "Travel case 2", kicker: "Surf / North Sea", category: "travel", year: "2026", folder: "images/travel/case2", cover: "front" },
    { title: "Food case 1", kicker: "Coast / Ostend", category: "food", year: "2025", folder: "images/food/case1", cover: "front" },
    { title: "Life case 2", kicker: "35mm / Zeeland", category: "life", year: "2023", folder: "images/life/case2", cover: "front" },
    { title: "Food case 2", kicker: "Coast / Normandy", category: "food", year: "2024", folder: "images/food/case2", cover: "front" }
  ];

  window.SITE = {
    name: "Tjorn Van Wetter",
    img: u,
    cases,
    teasers,
    categories: [
      { key: "all", label: "All" },
      { key: "life", label: "Life" },
      { key: "travel", label: "Travel" },
      { key: "food", label: "Food" }
    ]
  };
})();
