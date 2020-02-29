// Tekstikujul samatekst on sõne, mis vastab tingimustele:
// 
// 1.  Tekst koosneb tähtedest, kirjavahemärkidest ja kursorist.
//
// 2.  Täht on kas ladina täht, täpitäht või vene täht.
//
// 3.  Ladina täht on tärk, hulgast: a..z (97..122), A..Z (65..90).
//     Märkus. Sulgudes on tärgi kood.
//
// 4.  Täpitäht on tärk hulgast: õ (245), ö (246), ä (228), ü (252), Õ (213),
//     Ö (214), Ä (196), Ü (220), š (353), Š (352), ž (382), Ž (381).
//
// 5.  Vene täht on tärk, mille kood on vahemikus 1024..1279.
//
// 6.  Kirjavahemärk on kas / (47), tühik (32), koma (44), punkt (46), - 45,
//     ! (33), ? 63, ( (40), ) (41), : (58), ; (59) või " (34).
//     Märkus. / esitab reavahetust.
//
// 7.  Kursor on tärk '|'.
//
// 8.  Tekstis kahte või enamat järjestikust tühikut. Seejuures ka kursori ees 
//     ja järel ei ole üheaegselt tühikud.
//
// 9.  Tekst ei alga ega lõpe tühikuga.
//
// 10. Tekstis sisalduv tähejada on - kui suur- ja väiketäht lugeda samaks - 
//     sama nii algusest kui ka lõpust lugedes.
//
// Samateksti DOM-kuju ja DOM-kursor on Javascripti objektid, mis hoiavad samateksti
// sirviku DOM-s esitamiseks vajalikke väärtusi.
//
// Samateksti DOM-kuju väljad on (muutuja s korral):
//
//     s.A   - vasakpoolne tekst;
//     s.K1  - vasakpoolne kesktäht;
//     s.V   - vaheosa (kirjavahemärgid);
//     s.K2  - parempoolne kesktäht (võib olla tühi);
//     s.B   - parempoolne tekst.
//
// Märkus. Kesktäht (kesktähed) on samateksti keskel olev täht või samadest 
// tähtedest koosnev tähepaar.
//
// Samateksti DOM-kursori väljad on (muutuja k korral):
// 
//     k.Span - span-elemendi id ('A', 'K1', 'V', 'K2', 'B')
//     k.Pos - kursori positsioon span-elemendis.
//
// Nt tekstikujule t = "aa|men udune maa"
//
// vastavad DOM-kuju (s) ja DOM-kursor (k):
//
//    s = { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }
// 
//    k = { Span: "A", Pos: 2}
//
