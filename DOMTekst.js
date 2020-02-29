'use strict';

// Samateksti teisendamine DOM-kujust ja DOM-kursorist tekstikujule ja vastupidi.

// onSamatekst kontrollib, kas t on tekstikujul, nõuetele vastav samatekst.
function onSamatekst(t) {
  // Puuduv kursor?
  if (t.indexOf('|') < 0) { return false; }
  // Eemalda kursor ('|').
  t = t.replace(/\|/g, "");
  // Tühitekst?
  if (t.length == 0) {
    return false;
  }
  // Algab tühikuga?
  if (t[0] == ' ') { return false; }
  // Lõpeb tühikuga?
  if (t[t.length - 1] == ' ') { return false; }
  // Kaks järjestikust tühikut?
  if (t.indexOf('  ') >= 0) { return false; }

  // Esimese ja viimase tärgi positsioon vaatlusaluses sõne lõigus.  
  var e = 0;
  var v = t.length - 1;
  do {
    // Veakaitse.
    if (e > v) { return false; }

    // Läbi kv-märgid eesotsast. 
    while (e < t.length && kirjavm(t[e])) { e++; }
    // Läbi kv-märgid tagaotsast.
    while (0 <= v && kirjavm(t[v])) { v--; }

    // Ei sisalda tähti
    if (e > v) { return true; }

    // Viimane tärk?
    if (e == v) {
      if (taht(t[e]) || kirjavm(t[e])) {
        return true;
      }    
      return false;
    }    

    // Siin peavad esimene ja viimane tärk olema üks ja sama täht. (Lugedes
    // suur- ja väiketähe samaks.)
    if (t[e].toUpperCase() !== t[v].toUpperCase()) { return false; }
    // Tähepaar.
    e++;
    v--;
  } while (true); 
}

// DOM2Tekst tagastab DOM-kujule s ja kursorile k vastava, tekstikujul samateksti.
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
function tekst2DOM(t) {
  if (silumistase > 0) {
    console.log('tekst->DOM: tekst: %c' + t, cyan);
  }
  var s = { A: "", K1: "", V: "", K2: "", B: "" };
  // Puuduv kursor?
  if (t.indexOf('|') < 0) {
    console.log('tekst->DOM: %cVIGA: Tekstis puudub kursor', 'color: red;');
    return s;
  }

  // Tühitekst.
  if (t.length == 1) {
    if (silumistase > 0) {
      console.log('tekst->DOM: DOM: ' + JSON.stringify(s));
    }
    return s;
  }

  // Eemalda kursor ('|').
  t = t.replace(/\|/g, "");

  // Ettevalmistused kesktähtede äratundmiseks.
  var tl = 0; // Läbitud tähti
  var ta = loendaTahed(t);

  // Esimese ja viimase tärgi positsioon vaatlusaluses sõne lõigus.  
  var e = 0;
  var v = t.length - 1;
  do {

    // Veakaitse.
    if (e > v) {
      console.log('tekst->DOM: %cVIGA: e > v', 'color: red;');
    }

    // Kanna kv-märgid eesotsast span-elementi A. 
    while (e < t.length && kirjavm(t[e])) {
      s.A = s.A + t[e];
      e++;
    }

    // Kanna kv-märgid tagaotsast span-elementi B.
    while (0 <= v && kirjavm(t[v])) {
      s.B = t[v] + s.B;
      v--;
    }

    // Viimane tärk?
    if (e == v) {
      if (taht(t[e])) {
        // Üksiku kesktähe loeme vasakpoolseks.
        s.K1 = t[e];
        if (silumistase > 0) {
          console.log('tekst->DOM: %c' + JSON.stringify(s), cyan);
        }    
        return s;
      }    
      // Viimane tärk ei saa olla kv-märk.
      if (silumistase > 0) {
        console.log('tekst->DOM: %cVIGA: Viimane tärk ei saa olla kv-märk.',
          'color: red;');
      }    
      return undefined;
    }    

    // Siin peavad esimene ja viimane tärk olema üks ja sama täht. (Lugedes
    // suur- ja väiketähe samaks.)
    if (t[e].toUpperCase() !== t[v].toUpperCase()) {
      if (silumistase > 0) {
        console.log('tekst->DOM: %cVIGA: Tähed ei ole paariti', 'color: red;');
      }
      return undefined;
    }

    // Kas juba kesktähtede paar?
    if (tl + 2 == ta) {
      // Kesktähtede paar.
      s.K1 = t[e];
      s.K2 = t[v];
      e++;
      v--;
      s.V = t.substring(e, v + 1);
      if (silumistase > 0) {
        console.log('tekst->DOM: %cDOM: ' + JSON.stringify(s), 'color: cyan;');
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
// Kutsub välja ja kasutab tekst2DOM. 
function tekst2Kursor(t) {
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
    console.log("tekst->Kursor: %c" + JSON.stringify(k), cyan);
  }
  return k;
}
