/* ============================================================
   קיקו שיווק · נתוני הקטלוג
   להוספת מוצר: מעתיקים שורה, משנים id (ייחודי), שם, פירוט ותמונה (מתיקיית img).
   units = יחידות ההזמנה שהלקוח יכול לבחור. האפשרות הראשונה היא ברירת המחדל.
   strength = דרגת חוזק (קפה בלבד). sku = מק״ט, מצורף להודעה ליוסי.
   ============================================================ */
window.KIKO = {
  phone: "972543512622",
  contact: "יוסי",
  phoneText: "054-3512622",

  worlds: [
    {
      id: "coffee", title: "עולם הקפה", short: "קפה", wall: ["קפה"], band: ["עולם", "הקפה"],
      lead: "קפסולות אספרסו מור למכונות Nespresso",
      hero: ["coffee_colombia", "coffee_gold"],
      groups: [
        { id: "alu", title: "קפסולות אלומיניום" },
        { id: "classic", title: "סדרת החוזק" },
        { id: "drinks", title: "טעמים ומשקאות" },
        { id: "boxes", title: "מארזים גדולים" }
      ]
    },
    {
      id: "sweets", title: "עולם המתוקים", short: "מתוקים", wall: ["מתוקים"], band: ["עולם", "המתוקים"],
      lead: "ממתקי Yaams ו־ZED Candy, במארז או בקרטון",
      hero: ["sweet_tornado", "sweet_gumball"],
      groups: [
        { id: "lolly", title: "לקקנים" },
        { id: "gum", title: "גומי לעיסה" },
        { id: "sour", title: "חמוצים וסוכריות" }
      ]
    },
    {
      id: "soda", title: "עולם הסודה ו־BRITA", short: "סודה ו־BRITA", wall: ["סודה", "BRITA"], band: ["עולם הסודה", "ו־BRITA"],
      lead: "מכשירים, גז, טעמים, קנקנים ומסננים",
      hero: ["soda_terra_white", "soda_brita_blue"],
      groups: [
        { id: "gas", title: "מכשירים וגז" },
        { id: "bottles", title: "בקבוקים" },
        { id: "flavors", title: "טעמים 440 מ״ל" },
        { id: "brita", title: "BRITA" }
      ]
    }
  ],

  products: (function () {
    var cap = ["מארז 10 קפסולות"];
    var pk = function (n, c) { return ["מארז (" + n + " יח׳)", "קרטון (" + c + " מארזים)"]; };
    var six = ["יחידה", "מארז 6"];
    var gasU = ["החלפת בלון", "בלון חדש"];
    return [
      /* ---------- קפה ---------- */
      { id: "c01", w: "coffee", g: "alu", name: "קפסולות Mor Gold", spec: "ערביקה ורובוסטה, קרמה קטיפתית", strength: 10, img: "coffee_gold", units: cap },
      { id: "c02", w: "coffee", g: "alu", name: "קפסולות Forte", spec: "חזק במיוחד, קלייה איטית", strength: 11, img: "coffee_forte", units: cap },
      { id: "c03", w: "coffee", g: "alu", name: "קפסולות Cremoso", spec: "גוף מלא, קלייה כהה", strength: 12, img: "coffee_cremoso", units: cap },
      { id: "c04", w: "coffee", g: "alu", name: "קפסולות Classico", spec: "מעודן, גוף בינוני וסיומת חלקה", strength: 8, img: "coffee_classico", units: cap },
      { id: "c05", w: "coffee", g: "alu", name: "קפסולות House Blend", spec: "מאוזן, ארומה עדינה", strength: 9, img: "coffee_house", units: cap },
      { id: "c06", w: "coffee", g: "alu", name: "קפסולות קפה עם הל", spec: "אספרסו ים־תיכוני עם הל קלוי", strength: 8, img: "coffee_hel", units: cap },
      { id: "c07", w: "coffee", g: "alu", name: "קפסולות Roaster's Choice", spec: "עמוק, גוף מודגש וסיומת ארוכה", strength: 11, img: "coffee_roasters", units: cap },
      { id: "c08", w: "coffee", g: "alu", name: "קפסולות Terra Verde", spec: "מאוזן, לאספרסו קצר או ארוך", strength: 9, img: "coffee_terra_verde", units: cap },

      { id: "c11", w: "coffee", g: "classic", name: "קפסולות Crema", spec: "תערובת מעודנת וקטיפתית", strength: 6, img: "coffee_crema", units: cap },
      { id: "c12", w: "coffee", g: "classic", name: "קפסולות Aroma", spec: "לקפוצ׳ינו, הפוך ואספרסו", strength: 7, img: "coffee_aroma", units: cap },
      { id: "c13", w: "coffee", g: "classic", name: "קפסולות Alto", spec: "לקפוצ׳ינו, הפוך ואספרסו מעודן", strength: 8, img: "coffee_alto", units: cap },
      { id: "c14", w: "coffee", g: "classic", name: "קפסולות Arabika", spec: "100% ערביקה", strength: 9, img: "coffee_arabica", units: cap },
      { id: "c15", w: "coffee", g: "classic", name: "קפסולות Intenso", spec: "לאוהבי האספרסו החזק", strength: 10, img: "coffee_intenso", units: cap },
      { id: "c16", w: "coffee", g: "classic", name: "קפסולות Ristretto", spec: "חזקה וארומטית", strength: 12, img: "coffee_ristretto", units: cap },
      { id: "c17", w: "coffee", g: "classic", name: "קפסולות Premium", spec: "תערובת עוצמתית", strength: 13, img: "coffee_premium", units: cap },
      { id: "c18", w: "coffee", g: "classic", name: "קפסולות Napoli", spec: "קלייה כהה, ארומה גבוהה", strength: 14, img: "coffee_napoli", units: cap },
      { id: "c19", w: "coffee", g: "classic", name: "קפסולות Strong", spec: "חזק מאוד, קלייה כהה", strength: 15, img: "coffee_strong", units: cap },

      { id: "c21", w: "coffee", g: "drinks", name: "קפסולות וניל", spec: "אספרסו בטעם וניל, פרווה", img: "coffee_vanilla", units: cap },
      { id: "c22", w: "coffee", g: "drinks", name: "קפסולות אגוזי לוז", spec: "אספרסו בטעם אגוזי לוז, פרווה", img: "coffee_hazelnut", units: cap },
      { id: "c23", w: "coffee", g: "drinks", name: "קפסולות קפוצ׳ינו", spec: "משקה חלבי", img: "coffee_cappuccino", units: cap },
      { id: "c24", w: "coffee", g: "drinks", name: "קפסולות קפוצ׳ינו וניל", spec: "משקה חלבי", img: "coffee_cap_vanilla", units: cap },
      { id: "c25", w: "coffee", g: "drinks", name: "קפסולות קפוצ׳ינו אגוזים", spec: "משקה חלבי", img: "coffee_cap_hazelnut", units: cap },
      { id: "c26", w: "coffee", g: "drinks", name: "קפסולות שוקו", spec: "משקה חלבי", img: "coffee_choco", units: cap },
      { id: "c27", w: "coffee", g: "drinks", name: "קפסולות שוקולד ואגוזי לוז", spec: "משקה חלבי", img: "coffee_choco_hazelnut", units: cap },

      { id: "c31", w: "coffee", g: "boxes", name: "מארז Mix", spec: "4 תערובות: India, Ethiopia, Costa Rica, Colombia", img: "coffee_mix100", units: ["מארז 100", "מארז 200"] },
      { id: "c32", w: "coffee", g: "boxes", name: "מארז Euro Premium", spec: "מהדורת EURO 2024", strength: 10, img: "coffee_euro", units: ["מארז 100"] },
      { id: "c33", w: "coffee", g: "boxes", name: "מארז Colombia", spec: "מתקתק, קרמה עשירה וגוף מלא", strength: 10, img: "coffee_colombia", units: ["מארז 50", "מארז 100"] },
      { id: "c34", w: "coffee", g: "boxes", name: "מארז Costa Rica", spec: "טעם עמוק וארומה אקזוטית", strength: 8, img: "coffee_costarica", units: ["מארז 50", "מארז 100"] },
      { id: "c35", w: "coffee", g: "boxes", name: "מארז Ethiopia", spec: "חמיצות נמוכה וגוף חזק", strength: 7, img: "coffee_ethiopia", units: ["מארז 50", "מארז 100"] },
      { id: "c36", w: "coffee", g: "boxes", name: "מארז India", spec: "ארומה חזקה וטעם פירותי", strength: 6, img: "coffee_india", units: ["מארז 50", "מארז 100"] },
      { id: "c37", w: "coffee", g: "boxes", name: "מארז Italia Intenso", spec: "קלייה איטלקית עוצמתית", strength: 10, img: "coffee_italia_intenso", units: ["מארז 50"] },
      { id: "c38", w: "coffee", g: "boxes", name: "מארז Italia Pieno", spec: "מאוזן, קלייה איטלקית", strength: 8, img: "coffee_italia_piano", units: ["מארז 50"] },
      { id: "c39", w: "coffee", g: "boxes", name: "מארז Italia Cappuccino", spec: "משקה חלבי", img: "coffee_italia_cap", units: ["מארז 50"] },
      { id: "c40", w: "coffee", g: "boxes", name: "מארז Italia Chocolate", spec: "משקה קקאו חלבי", img: "coffee_italia_choco", units: ["מארז 50"] },
      { id: "c41", w: "coffee", g: "boxes", name: "קפסולות נטול קפאין", spec: "10 שרוולים של 10 קפסולות", img: "coffee_decaf", units: ["מארז 100"] },

      /* ---------- מתוקים ---------- */
      { id: "s01", w: "sweets", g: "lolly", name: "לקקן Roller פטל", spec: "Yaams · 20 גרם ליחידה", img: "sweet_roller", units: pk(24, 8) },
      { id: "s02", w: "sweets", g: "lolly", name: "לקקן בולדוזר", spec: "Yaams · 64 גרם ליחידה", img: "sweet_bulldozer", units: pk(24, 8) },
      { id: "s03", w: "sweets", g: "lolly", name: "לקקן טורנדו", spec: "ZED Candy · 18.4 גרם ליחידה", img: "sweet_tornado", units: pk(50, 6) },
      { id: "s04", w: "sweets", g: "gum", name: "חבל מסטיק Mega Sour", spec: "ZED Candy · חמוץ, 15 ס״מ, 17 גרם", img: "sweet_sour", units: pk(40, 12) },
      { id: "s05", w: "sweets", g: "gum", name: "גומי Bubble Gum", spec: "ZED Candy · רביעיות פירות, 19.6 גרם", img: "sweet_bubble", units: pk(50, 12) },
      { id: "s06", w: "sweets", g: "gum", name: "מכונת מיני מסטיק", spec: "ZED Candy · 20 גרם ליחידה", img: "sweet_minigum", units: pk(12, 6) },
      { id: "s07", w: "sweets", g: "gum", name: "גומי Super Gumball", spec: "כדורי 28 מ״מ בטעמי פירות", img: "sweet_gumball", units: ["צנצנת 1 ק״ג"] },
      { id: "s08", w: "sweets", g: "sour", name: "סוכריות Fruity Yaams חמוצות", spec: "Yaams · 15 גרם ליחידה", img: "sweet_fruity", units: pk(30, 12) },
      { id: "s09", w: "sweets", g: "sour", name: "ממתק Rainbow Roll פירות", spec: "Yaams · 15 גרם ליחידה", img: "sweet_rainbow", units: pk(20, 8) },
      { id: "s10", w: "sweets", g: "sour", name: "ממתק רולאפ", spec: "Yaams · תות שדה ואוכמניות, 14 גרם", img: "sweet_rollup", units: pk(50, 6) },
      { id: "s11", w: "sweets", g: "sour", name: "ספריי אבן נייר ומספריים", spec: "Yaams · דובדבן, אוכמניות, תות ופירות, 18 גרם", img: "sweet_rps", units: pk(24, 8) },

      /* ---------- סודה ---------- */
      { id: "d01", w: "soda", g: "gas", name: "מכשיר TERRA לבן", spec: "כולל בלון גז ורוד ובקבוק 1 ליטר", img: "soda_terra_white", units: six, sku: "1012811720" },
      { id: "d02", w: "soda", g: "gas", name: "מכשיר TERRA שחור", spec: "כולל בלון גז ורוד ובקבוק 1 ליטר", img: "soda_terra_black", units: six, sku: "1012811721" },
      { id: "d03", w: "soda", g: "gas", name: "בלון גז ורוד", spec: "חיבור מהיר, עד 60 ליטר", img: "soda_gas_pink", units: gasU },
      { id: "d04", w: "soda", g: "gas", name: "בלון גז כחול", spec: "הברגה, עד 60 ליטר", img: "soda_gas_blue", units: gasU },
      { id: "d11", w: "soda", g: "bottles", name: "צמד בקבוקים 1 ליטר, לבן", spec: "מתאים למדיח", img: "soda_b1_white", units: ["צמד", "מארז 6"], sku: "1741261720" },
      { id: "d12", w: "soda", g: "bottles", name: "צמד בקבוקים 1 ליטר, שחור", spec: "מתאים למדיח", img: "soda_b1_black", units: ["צמד", "מארז 6"], sku: "1741260720" },
      { id: "d13", w: "soda", g: "bottles", name: "צמד בקבוקים 0.5 ליטר, לבן", spec: "מתאים למדיח", img: "soda_b05_white", units: ["צמד", "מארז 6"], sku: "1748216720" },
      { id: "d14", w: "soda", g: "bottles", name: "צמד בקבוקים 0.5 ליטר, שחור", spec: "מתאים למדיח", img: "soda_b05_black", units: ["צמד", "מארז 6"], sku: "1748224720" },
      { id: "d21", w: "soda", g: "flavors", name: "טעם Pepsi", spec: "עד 9 ליטר משקה", img: "soda_pepsi", units: six, sku: "1924202720" },
      { id: "d22", w: "soda", g: "flavors", name: "טעם Pepsi Zero", spec: "ללא סוכר", img: "soda_pepsi_zero", units: six, sku: "1924201720" },
      { id: "d23", w: "soda", g: "flavors", name: "טעם 7UP", spec: "עד 9 ליטר משקה", img: "soda_sevenup", units: six, sku: "1924203720" },
      { id: "d24", w: "soda", g: "flavors", name: "טעם 7UP Zero", spec: "ללא סוכר", img: "soda_sevenup_zero", units: six, sku: "1924206720" },
      { id: "d25", w: "soda", g: "flavors", name: "טעם Mirinda", spec: "עד 9 ליטר משקה", img: "soda_mirinda", units: six, sku: "1924204720" },
      { id: "d26", w: "soda", g: "flavors", name: "טעם Mirinda Zero", spec: "ללא סוכר", img: "soda_mirinda_zero", units: six, sku: "1924207720" },
      { id: "d27", w: "soda", g: "flavors", name: "טעם לימונדה", spec: "ללא תוספת סוכר", img: "soda_lemonade", units: six, sku: "1024268720" },
      { id: "d28", w: "soda", g: "flavors", name: "טעם פסיפלורה", spec: "ללא תוספת סוכר", img: "soda_passion", units: six, sku: "1024243720" },
      { id: "d29", w: "soda", g: "flavors", name: "טעם אשכולית אדומה", spec: "קלאסי", img: "soda_grapefruit", units: six, sku: "1024201721" },
      { id: "d30", w: "soda", g: "flavors", name: "טעם אשכולית אדומה ללא סוכר", spec: "ללא תוספת סוכר", img: "soda_grapefruit_zero", units: six, sku: "1024256721" },
      { id: "d31", w: "soda", g: "flavors", name: "טעם פטל ופירות יער", spec: "ללא תוספת סוכר", img: "soda_berries", units: six, sku: "1524210720" },
      { id: "d32", w: "soda", g: "flavors", name: "טעם משקה אנרגיה", spec: "עד 9 ליטר משקה", img: "soda_energy", units: six, sku: "1424271721" },
      { id: "d41", w: "soda", g: "brita", name: "קנקן Style Essential לבן", spec: "כולל מסנן MAXTRA PRO אחד", img: "soda_brita_white", units: ["יחידה"], sku: "1071258720" },
      { id: "d42", w: "soda", g: "brita", name: "קנקן Style Essential כחול סערה", spec: "כולל מסנן MAXTRA PRO אחד", img: "soda_brita_blue", units: ["יחידה"], sku: "1071259720" },
      { id: "d43", w: "soda", g: "brita", name: "קנקן Style Essential חול ים", spec: "כולל 3 מסנני MAXTRA PRO", img: "soda_brita_sand", units: ["יחידה"], sku: "1071260720" },
      { id: "d44", w: "soda", g: "brita", name: "קנקן Glass מזכוכית", spec: "כולל מסנן MAXTRA PRO אחד", img: "soda_brita_glass", units: ["יחידה"], sku: "1071261720" },
      { id: "d45", w: "soda", g: "brita", name: "מסנני MAXTRA PRO", spec: "Taste & Protect Expert, שלישייה", img: "soda_brita_filter2", units: ["חבילת 3 מסננים"], sku: "1071262720" }
    ];
  })()
};
