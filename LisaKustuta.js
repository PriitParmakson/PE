'use strict';

// Tärkide eemaldamine ja lisamine samateksti.

// eemaldaTyhikud: 1) eemaldab sõnest t algustühiku (kui see eksisteerib);
// 2) lõputühiku (kui see eksisteerib); 2) asendab iga kahest või enamast tühikust
// koosneva jada (kursorit ei arvesta) ühe tühikuga.
function eemaldaTyhikud(t) {
  t = t.replace(/  /g, ' ');
  t = t.replace(/ \| /g, '| ');
  t = t.replace(/^ /, '');
  t = t.replace(/ $/, '');
  return t;
}

// eemaldaTark eemaldab samatekstist t kursori ees või järel oleva tärgi.
// Parameeter b (Backspace) väärtus true nõuab eemaldamist kursori
// eest; false nõuab eemaldamist kursori järelt (Delete).
// Tähe eemaldamisel eemaldab ka selle peegeltähe.
// Kui eemaldada ei saa, siis tagastab muutmata teksti.
// Kui t ei ole korrektne samatekst, siis tagastab muutmata teksti.
function eemaldaTark(t, b) {
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
