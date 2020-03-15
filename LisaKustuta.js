'use strict';

// Tärkide eemaldamine ja lisamine samateksti.

// eemaldaTyhikud: 1) eemaldab sõnest t algustühiku (kui see eksisteerib);
// 2) lõputühiku (kui see eksisteerib); 3) asendab iga kahest või enamast tühikust
// koosneva jada (kursorit ei arvesta) ühe tühikuga.
function eemaldaTyhikud(t) {
  t = t.replace(/^ /, '');
  t = t.replace(/^\| /, '|');
  t = t.replace(/ $/, '');
  t = t.replace(/ \|$/, '|');
  t = t.replace(/  /g, ' ');
  t = t.replace(/ \| /g, '| ');
  return t;
}

// eemaldaTark eemaldab samatekstist t kursori ees või järel oleva tärgi.
// Parameeter b (Backspace) väärtus true nõuab eemaldamist kursori
// eest; false nõuab eemaldamist kursori järelt (Delete).
// Tähe eemaldamisel eemaldab ka selle peegeltähe.
// Kui eemaldada ei saa, siis tagastab muutmata teksti.
// Kui t ei ole korrektne samatekst, siis tagastab muutmata teksti.
function eemaldaTark(t, b) {
  if (!onSamatekst(t)) {
    console.log('eemaldaTark: VIGA: ei ole samatekst: %c', t); 
    kuvaTeade('VIGA: Ei ole samatekst');
    return t;
  }
  var kpos = t.indexOf('|');
  // Eemaldatava tärgi positsioon.
  var rpos;
  // Kontrolli äärjuhte, leia eemaldatava tärgi positsioon.
  if (b) {
    // Teksti alguses oleva kursori eest ei saa eemaldada.
    if (kpos == 0) return t;
    rpos = kpos - 1;
  } else {
    // Teksti lõpus oleva kursori järelt ei saa eemaldada.
    if (kpos == t.length - 1) return t;
    rpos = kpos + 1;
  }
  // Kirjavahemärgi eemaldamine.
  if (kirjavm(t[rpos])) {
    return eemaldaTyhikud(t.substring(0, rpos) + t.substring(rpos + 1));
  }
  // Tähe eemaldamine. Läbi tekst mõlemast otsast, tähepaari kaupa.
  // Esimese ja viimase tärgi positsioon vaadeldavas sõnelõigus.
  var e = 0;
  var v = t.length - 1;
  do {
    // Liigu üle kv-märkide ja '|', kuni nii esimene kui ka viimane vaadeldav
    // tärk on saanud täheks.
    while (kirjavm(t[e]) || t[e] == '|') {
      e++;
    }
    while (kirjavm(t[v]) || t[v] == '|') {
      v--;
    }
    // Siin peab olema jõutud tähepaarini (või üksiku kesktäheni).
    if (e == v) {
      // Jõutud üksiku kesktäheni; see peabki olema eemaldatav täht. 
      return  eemaldaTyhikud(t.substring(0, e) + t.substring(e + 1));
    }
    // Kas eemaldatav tähepaar?
    if (e == rpos || v == rpos) {
      return  eemaldaTyhikud(
        t.substring(0, e) + t.substring(e + 1, v) + t.substring(v + 1)
      );
    }
    e++;
    v--;
  } while (e < v);
  return t;
}

// lisaTark lisab samateksti t, kursori ette, tärgi c.
// Tähe lisamisel lisab ka selle peegeltähe.
// Kui lisada ei saa, siis tagastab muutmata teksti.
function lisaTark(t, c) {
  if (!onSamatekst(t)) {
    console.log('lisaTark: %cVIGA: ei ole samatekst: ' + t, 'color: red;');
    kuvaTeade('VIGA: Ei ole samatekst');
    return t;
  }
  var kpos = t.indexOf('|')
  if (kirjavm(c)) {
    return eemaldaTyhikud(
      t.substring(0, kpos) + c + '|' + t.substring(kpos + 1)
    );
  }
  // Tähe lisamine. Läbi tekst mõlemast otsast, tähepaari kaupa.
  // Esimese ja viimase tärgi positsioon vaadeldavas sõnelõigus.
  var e = 0;
  var v = t.length - 1;
  do {
    // Tekst on läbitud, kursorit ei leitud - ebakorrektne sisend. 
    if (e > v) { return t; }

    // Üksik tärk?
    if (e == v) {
      // Täht?
      if (taht(t[e])) {
        // Tekstis ei ole kursorit.
        return t
      }
      // Üksik '|'?
      if (t[e] == '|') {
        return eemaldaTyhikud(
          t.substring(0, e) + c + '|' + c + t.substring(v + 1)
        );
      }
      // Tekst on läbitud, kursorit ei leitud - ebakorrektne sisend.
      return t;
    }

    // Kursor leitud?
    if (t[e] == '|') {
      return eemaldaTyhikud(
        t.substring(0, e) + c + '|' + t.substring(e + 1, v + 1) + c +
        t.substring(v + 1)
      );
    }
    if (t[v] == '|') {
      return eemaldaTyhikud(
        t.substring(0, e) + c + t.substring(e, v) + c + '|' +
        t.substring(v + 1)
      );
    }

    // Tähepaar?
    if (taht(t[e]) && taht(t[v]) && t[e] == t[v]) {
      e++;
      v--;
    } else {
      // Liigu kirjavahemärkidest üle, konservatiivselt. Ebakorrektse sisendi - 
      // kursorita teksti - juhul väldi lõputut tsüklit.
      if (kirjavm(t[e]) && e < t.length) {
        e++;
      }
      if (kirjavm(t[v]) && v >= 0) {
        v--;
      }
    }
  } while(e <= v)
  return t;
}

// muudaKtYhekordseks muudab samateksti t kesktähe ühekordseks,
// kui see seda juba ei ole.
function muudaKtYhekordseks(t) {
  if (!onSamatekst(t)) {
    console.log(
      'muudaKtYhekordseks: %cProgrammiviga: ei ole samatekst: ' + t,
     'color: red;'
    );
    // kuvaTeade('Programmiviga (Ei ole samatekst)');
    return t;
  }
  // Tühitekst tagasta samal kujul.
  if (t.length == 1) {
    return t;
  }

  var ta = loendaTahed(t);
  // Kui on juba ühekordne, siis tagasta samal kujul.
  if (ta % 2 == 1) {
    return t;
  }

  // Tähepaaride arv.
  var p = ta / 2;
  // Leitud tähepaaride arv.
  var pl = 0;

  // Läbi tekst, liikudes mõlemast otsast, leia keskmine tähepaar ja eemalda 
  // keskmise tähepaari tagumine täht.
  var e = 0;
  var v = t.length - 1;
  // Lõputu tsükli kaitse.
  var g = 0;
  do {
    g++;
    // Liigu kirjavahemärkidest ja kursorist üle. Tulemusena võivad e ja v 
    // saada võrdseks.
    if (kirjavm(t[e]) || t[e] == '|') {
      // Kaitseks programmivigade vastu.
      if (e < v && (e < t.length - 1)) {
        e++;
      }
    }
    if (kirjavm(t[v]) || t[v] == '|') {
      // Kaitseks programmivigade vastu.
      if (e < v && v >= 0) {
        v--;
      }
    }

    // Tähepaar?
    if (taht(t[e]) && taht(t[v])) {
      // Kaitse programmivea vastu.
      if (e == v) {
        console.log('muudaKtYhekordseks: %cProgrammiviga', 'color: red;');
        // kuvaTeade('Programmi viga');
        return t;
      }
      pl++;
      // Keskmine tähepaar?
      if (pl == p) {
        // Eemalda keskmise tähepaari tagumine täht. Ühtlasi eemalda keskmise
        // tähepaari vahel olevad kirjavahemärgid, kuid mitte kursor.
        return eemaldaTyhikud(
          t.substring(0, e + 1) +
          (t.substring(e + 1, v).indexOf('|') >= 0 ? '|' : '') +
          t.substring(v + 1)
        );
      }
      // Kui ei ole keskmine tähepaar, siis liigu edasi.
      else {
        e++;
        v--;
      }
    }

  } while(e <= v && g < 100)
  console.log(
    'muudaKtYhekordseks: %cProgrammiviga: Tsüklikordade piirarv ületatud',
    'color: red;'
  );
  return t;
}