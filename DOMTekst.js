'use strict';

// Samateksti teisendamine DOM-kujust tekstikujule ja vastupidi.
// Tekstikujul samatekst on sõne, milles tärgiga '|' on tähistatud kursori
// asukoht.
// Tekstikujus teeme tärkide lisamised-kustutamised.
// Nt. DOM-kuju:
//    s = { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }
// Kursor:
//    k = { Span: "A", Pos: 2}
// Vastav tekstikuju:
//    t = "aa|men udune maa"

// DOM2Tekst tagastab DOM-kujule s ja kursorile k vastava teksti,
// kus tärgiga '|' on märgitud kursori asukoht.
function DOM2Tekst(s, k) {
  var koguja = "";

  ['A', 'K1', 'V', 'K2', 'B'].forEach(tootle);

  function tootle(spanId) {
    if (spanId == k.Span) {
      koguja = koguja +
        s[spanId].substring(0, k.Pos) + '|' + 
        s[spanId].substring(k.Pos);
    } else {
      koguja = koguja + s[spanId]
    }
  }

  return koguja; 
}

// tekst2DOM tagastab tekstikujul samateksti t DOM-kuju.
// Tärgiga '|' on tekstis tähistatud kursori asukoht.
function tekst2DOM(t) {
  if (silumistase > 0) {
    console.log('tekst2DOM: tekst: ' + t);
  }
  var s = { A: "", K1: "", V: "", K2: "", B: "" };
  // Puuduv kursor?
  if (t.indexOf('|') < 0) {
    if (silumistase > 0) {
      console.log('tekst2DOM: VIGA: Tekstis puudub kursor');
    }
    return s;
  }

  // Tühitekst.
  if (t.length == 1) {
    if (silumistase > 0) {
      console.log('tekst2DOM: s: ' + JSON.stringify(s));
    }
    return s;
  }

  // Eemalda kursor ('|').
  t = t.replace(/\|/g, "");
  console.log('Kursor eemaldatud: ' + t);

  // Ettevalmistused kesktähtede äratundmiseks.
  var tl = 0; // Läbitud tähti
  var ta = loendaTahed(t);

  // Esimese ja viimase tärgi positsioon vaatlusaluses sõne lõigus.  
  var e = 0;
  var v = t.length - 1;
  do {

    // Viimane tärk?
    if (e == v) {
      if (taht(t[e])) {
        // Üksiku kesktähe loeme vasakpoolseks.
        s.K1 = t[e];
        if (silumistase > 0) {
          console.log('tekst2DOM: s: ' + JSON.stringify(s));
        }
        return s;
      }
      // Vahetärgid eeldavad kaksikkesktähte ja peavad olema juba töödeldud.
      if (silumistase > 0) {
        console.log('tekst2DOM: s: undefined');
      }
      return undefined;
    }

    // Esimene tärk sõnes on kv-märk?
    while (kirjavm(t[e])) {
      s.A = s.A + t[e];
      e++;
    }

    // Viimane tärk sõnes on kv-märk?
    while (kirjavm(t[v])) {
      s.B = t[v] + s.B;
      v--;
    }

    // Siin peavad esimene ja viimane tärk olema üks ja sama täht.
    if (t[e] !== t[v]) {
      if (silumistase > 0) {
        console.log('tekst2DOM: s: undefined');
      }
      return undefined;
    }

    // Kas juba kesktäht?
    if (tl + 2 == ta) {
      // Kesktähtede paar.
      s.K1 = t[e];
      s.K2 = t[e];
      e++;
      v--;
      s.V = t.substring(e, v + 1);
      if (silumistase > 0) {
        console.log('tekst2DOM: s: ' + JSON.stringify(s));
      }
      return s;
    }

    // Tähepaar, mis ei ole keskmine.
    s.A = s.A + t[e];
    s.B = t[v] + s.B;
    tl = tl + 2;
    e++;
    v--;

  } while (true); 
}

// tekst2Kursor tagastab tekstikujul samatekstile t vastava DOM-kuju kursori.
// Tärgiga '|' on tekstis tähistatud kursori asukoht.
// Kutsub välja ja kasutab tekst2DOM. 
function tekst2Kursor(t) {
  if (silumistase > 0) {
    console.log("tekst2Kursor: tekst: " + t);
  }
  var k = { Span: 'A', Pos: 0 };
  var s = tekst2DOM(t);
  var ti = t.indexOf('|');
  var cumul = 0;
  var spanIDs = ['A', 'K1', 'V', 'K2', 'B'];
  for (var i = 0; i < spanIDs.length; i++) {
    // span-elemendi pikkus.
    var sl = s[spanIDs[i]].length;
    if (sl > 0) {
      if (cumul + sl < ti) {
        cumul = cumul + sl;
      } else {
        k.Span = spanIDs[i];
        k.Pos = ti - cumul;
        break;
      }
    }
  }
  if (silumistase > 0) {
    console.log("tekst2Kursor: k: " + JSON.stringify(k));
  }
  return k;
}
