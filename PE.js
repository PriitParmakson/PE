'use strict';

// Mida suurem, seda rohkem teavet konsoolile kuvatakse.
// 0 - ei kuvata midagi
var silumistase = 2;

// Peaprogramm. Mitmesugused algväärtustamised
function init() {

  seaInfopaaniKasitlejad();
  seaRedaktoriKasitlejad();
  seaTekstinupukasitlejad();

  // Algustekst (kursor)
  kuvaTekst(
    {
      A: 'aamen u',
      K1: 'd',
      V: '',
      K2: '',
      B: 'une maa'
    },
    { Span: 'A', Pos: 0 });
  $('#Tekst').focus();

}

// Infopaani käsitlejad: avamine, sulgemine
function seaInfopaaniKasitlejad() {
  $('#Info').click(() => {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(() => {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

// Sea sisestatava teksti käsitlejad ('Uus', 'Vaheta pooled', 'Salvesta')
function seaTekstinupukasitlejad() {

  $('#Uusnupp').click(() => {
    kuvaTekst(
      {
        A: '',
        K1: '',
        V: '',
        K2: '',
        B: ''
      },
      { Span: 'A', Pos: 0 });
    $('#Tekst').focus();
  });

  $('#Poolednupp').click(() => {
    var s = loeDOM();
    var j = s.A;
    s.A = s.B;
    s.B = j;
    s.K2 = s.K1;
    kuvaTekst(s, { Span: 'A', Pos: 0 });
    $('#Tekst').focus();
  });

  $('#Salvestanupp').click(() => {
    var s = loeDOM();
    $('#St').prepend(
      '<p>' +
      s.A + '<b>' + s.K1 + '</b>' + s.V + '<b>' + s.K2 + '</b>' + s.B + 
      '</p>'
    );
  });
}

// Samatekstiredaktori töötsükkel
//
// Samatekst kuvatakse HTML div-elemendis 'Tekst'. Elemendil on atribuut 
// contenteditable.
//
// Teksti muutvaid klahvivajutusi käsitletakse sündmuste KEYDOWN, KEYPRESS ja
// PASTE kaudu.
// Sündmus 'keydown' tekib klahvi vajutamisel esimesena.
// Seejärel tekib 'keypress'.
// Teksti navigeerivaid kursorit (caret) muutvaid sündmusi (vasakule, paremale)
// otseselt ei töötle, välja arvatud see, et nende toime blokeeritakse 
// veateaterežiimis.
// Kursori positsioon selgitatakse välja siis, kui kasutaja vajutab klahvi, mida
// töödeldakse. 
function seaRedaktoriKasitlejad() {
  $('#Tekst').on('keydown', (e) => keydownKasitleja(e));
  $('#Tekst').on('keypress', (e) => keypressKasitleja(e));
  $('#Tekst').on('paste', (e) => pasteKasitleja(e));
}

// loeDOM loeb samateksti sirviku DOM-st DOM-kujusse.
function loeDOM() {
  var s = new Object();
  s.A = $('#A').text();
  s.K1 = $('#K1').text();
  s.V = $('#V').text();
  s.K2 = $('#K2').text();
  s.B = $('#B').text();
  // Eemalda 0-pikkusega tühik, mis pannakse span-elementi A tühja samateksti
  // korral.
  if (s.A == '&#8203;') {
    s.A = '';
  }
  if (silumistase > 0) {
    console.log('loeDOM: ' + JSON.stringify(s));
  }
  return s;
}

// kuvatekst moodustab DOM-kujul samatekstist HTML-kuju, väljastab selle DOM-i
// ja seab kursori (caret). Vastavalt teksti pikkusele (de)aktiveerib
// tekstitöötlusnupud.
// Parameetrid:
//   s - DOM-kujul samatekst
//     s.A   - vasakpoolne tekst;
//     s.K1  - vasakpoolne kesktäht;
//     s.V   - vaheosa (kirjavahemärgid);
//     s.K2  - parempoolne kesktäht (võib olla tühi);
//     s.B   - parempoolne tekst.
//   kursor - kuhu panna kursor
//     kursor.Span - span-element
//     kursor.Pos - positsioon span-elemendis.
// span-elementide id-d: 'A', 'K1', 'V', 'K2', 'B'.
// Tühja teksti korral lisa 0-pikkusega tühik. See on vajalik kursori
// positsioneerimiseks.
function kuvaTekst(s, kursor) {
  if (
    s.A.length == 0 &&
    s.K1.length == 0 &&
    s.V.length == 0 &&
    s.K2.length == 0 &&
    s.B.length == 0
  ) {
    s.A = '&#8203;';
  }

  // Lisa HMTL-markeering.
  var m =
    "<span id='A'>" + s.A + "</span>" +
    "<span id='K1' class='kesk'>" + s.K1 + "</span>" +
    "<span id='V'>" + s.V + "</span>" +
    "<span id='K2' class='kesk'>" + s.K2 + "</span>" +
    "<span id='B'>" + s.B + "</span>";

  // Väljasta tekst DOM-i.
  $('#Tekst').html(m);

  // Sea kursor (caret).
  var range = document.createRange();
  var el = document.getElementById(kursor.Span);
  range.setStart(el.childNodes[0], kursor.Pos);
  range.collapse(true); // Lõpp ühtib algusega
  var valik = document.getSelection();
  valik.removeAllRanges();
  valik.addRange(range);

  if (silumistase > 0) {
    console.log(
      'kuvaTekst:' + ' caret seatud tippu ' +
      kursor.Span + ', positsiooni ' + kursor.Pos
    );
  }

  // Uuenda täheloendurit
  var tahti = loendaTahed(s.A) * 2 +
    s.K1.length + s.K2.length;
  var loenduritekst;
  if (tahti == 0) {
    loenduritekst = '&nbsp;&nbsp;&nbsp;'
  }
  else {
    loenduritekst = tahti.toString();
  }
  $('#Taheloendur').html(loenduritekst);

  // Jälgi, et tühiteksti puhul mõtet mitteomavad nupud
  // on visuaalselt deaktiveeritud.
  if (loeDOM().K1.length == 0) {
    $('#Poolednupp').addClass('disabled');
    $('#Uusnupp').addClass('disabled');
    $('#Salvestanupp').addClass('disabled');
  }
  else {
    $('#Poolednupp').removeClass('disabled');
    $('#Uusnupp').removeClass('disabled');
    $('#Salvestanupp').removeClass('disabled');
  }

  // Väljasta silumiseks konsoolile.
  var tekstKonsoolile = m
    .replace(/<span id='/gi, ' ')
    .replace(/'>/gi, '(')
    .replace(/' class='kesk/gi, '')
    .replace(/<\/span>/gi, ')');
  if (silumistase > 0) {
    console.log('kuvaTekst: ' + tekstKonsoolile);
  }
}

// keydownKasitleja käsitleb sündmuse KEYDOWN. Püüab kinni eriklahvide vajutused,
// mida tahame töödelda: 8 (Backspace), 46 (Delete), 33 (PgUp), 34 (PgDn),
// 38 (Up), 40 (Down). Nende vaikimisi toiming tühistatakse ja vajutusi
// käsitletakse spetsiifiliselt. Muud klahvivajutused lähevad edasi KEYPRESS
// käsitlejasse.
// Ctrl + klahv vajutustest tekib kaks KEYDOWN sündmust:
// esimene keyCode = 17 (Ctrl), seejärel keyCode = klahvi kood. Tõeväärtus 
// ctrlDown on mõlemal juhul tõene.
function keydownKasitleja(e) {
  var keyCode = e.keyCode;
  var ctrlDown = e.ctrlKey || e.metaKey // Mac-i tugi

  if (silumistase > 1) {
    console.log(
      'keydownKasitleja: klahvivajutus: ' +
      (ctrlDown ? ' Ctrl + ' : ' ') +
      keyCodeToHumanReadable(keyCode) + '(' + keyCode + ')'
    );
  }

  // Kui Ctrl+c (keyCode 67) või Ctrl+v (keyCode 86), siis lase seda käsitleda
  // vastavatel süsteemsetel sündmusekäsitlejatel.
  if (ctrlDown && [67, 86].includes(keyCode)) { return }

  if ([8, 46, 33, 34, 38, 40].includes(keyCode)) {
    e.preventDefault();
    tootleEriklahv(keyCode);
  }
}

// keypressKasitleja käsitleb sündmuse KEYPRESS. Kui klahvivajutusest tekkis
// tärgikood, siis suunatakse tähe või punktuatsioonimärgi töötlusele. Kontroll,
// kas märgikood on lubatute hulgas, tehakse lisaTahtVoiPunktuatsioon-is. 
// Vaikimisi toiming tõkestatakse.
// Sündmus KEYPRESS tekib ka Ctrl-kombinatsioonide vajutamisel.
// Kui Teatepaan on avatud, siis klahvivajutust ignoreeritakse.
function keypressKasitleja(e) {
  var charCode = e.charCode;
  var ctrlDown = e.ctrlKey || e.metaKey // Mac-i tugi

  // Võte reavahetuse (enter, keyCode 13) kinnipüüdmiseks ja töötlemiseks
  if (e.keyCode == 13) {
    charCode = 13;
  }

  // Logimine
  if (silumistase > 1) {
    if (ctrlDown) {
      console.log('keypressKasitleja: klahvivajutus Ctrl');
    }
    else {
      console.log(
        'keypressKasitleja: klahvivajutus ' +
        String.fromCharCode(charCode) +
        ' (tärgikood: ' + charCode + ')'
      );
    }
  }

  // Ctrl-kombinatsioone tähesisestuseks ei loe
  if (!ctrlDown && charCode != null && charCode != 0) {
    e.preventDefault();
    lisaTahtVoiPunktuatsioon(charCode);
  }
}

// tootleEriklahv töötleb 'keydown' kaudu kinnipüütud huvipakkuvaid klahvivajutusi.
function tootleEriklahv(keyCode) {
  switch (keyCode) {
    case 8: // Backspace
      tootleBackspace();
      break;
    case 46: // Delete
      tootleDelete();
      break;
    case 33: // PgUp
      kuvaKesktahtYhekordselt(true);
      break;
    case 34: // PgDn
      kuvaKesktahtYhekordselt(false);
      break;
    case 38: // Up
      muudaTaheregister(true);
      break;
    case 40: // Down
      muudaTaheregister(false);
      break;
  }
}

// lisaTahtVoiPunktuatsioon lisab kasutaja sisestatud tähe või kirjavahemärgi.
// Tähe lisamisel lisatakse ka peegeltäht.
// Kui lisamisel tekib korduv tühik, siis 
function lisaTahtVoiPunktuatsioon(charCode) {
  // Kas märgikood on lubatute hulgas?
  if (!(tahtKood(charCode) || kirjavmKood(charCode))) {
    return
  }
  // Enter vajutus asenda siseesituses tärgiga '/'.
  var charTyped = charCode == 13 ? '/' : String.fromCharCode(charCode);
  // Silumisteade
  var k = loeKursor(); // Kursor
  var s = loeDOM(); // Samatekst DOM-kujul

  var t = DOM2Tekst(s, k);
  t = lisaTark(t, charTyped);
  t = t.replace(/  /g, " ");

  s = tekst2DOM(t);
  k = tekst2Kursor(t);

  kuvaTekst(s, k);
}

// loeKursor selgitab välja caret positsiooni, sest kasutaja 
// võib olnud seda muutnud.
// Tühja teksti puhul NO OP.
// Tühja teksti puhul on esimeses span-elemendis 0-pikkusega tühik (et hoida
// div-elemendi mõõtmeid).
// Tagastab kursori positsiooni kujul:
//   { Span: <span Id>, Pos: ... }
function loeKursor() {
  // Leia span element, kus valik algab ja valiku alguspositsioon selles 
  // elemendis.
  var r = document.getSelection().getRangeAt(0);
  var kursorSpan = r.startContainer.parentNode.id;
  var kursorPos = r.startOffset;
  if (silumistase > 0) {
    console.log(
      'loeKursor: kursor: ' +
      kursorSpan.toString() +
      ', pos ' + kursorPos.toString()
    );
  }
  return { Span: kursorSpan, Pos: kursorPos }
}

// muudaTaheregister muudab kursori järel oleva tähe suurtäheks.
// Loeb DOM-st ja kirjutab tagasi.
// Parameeter: suurtaheks - boolean.
function muudaTaheregister(suurtaheks) {
  var k = loeKursor(); // Kursor
  var s = DOM2Sise(); // Samatekst DOM-kujul
  // Kursori järel olev tärk.
  var kj = s[k.Span].charAt(k.Pos);

  if (silumistase > 0) {
    console.log('Kursori järel on: ' + kj);
  }

  // Suur- või väiketäheks.
  s[k.Span] = s[k.Span].substring(0, k.Pos) +
    (suurtaheks ? kj.toUpperCase() : kj.toLowerCase()) +
    s[k.Span].substring(k.Pos + 1);

  if (silumistase > 0) {
    console.log('Muudatud span-element: ' + s[k.Span]);
  }

  kuvaTekst(s, k);
}

// kuvaKesktahtYhekordselt lülitab, vastavalt parameetrile mode, sisse v välja
// kesktähe ühekordse kuvamise.
function kuvaKesktahtYhekordselt(mode) {
  var s = loeDOM(); // Samatekst DOM-kujul
  var k = loeKursor(); // Kursor

  // Lülita ühekordne kuvamine sisse/välja.
  if (mode) {
    s.K2 = '';
    if (k.Span == 'K2') {
      k.Span = 'K1';
    }
  } else {
    s.K2 = s.K1;
  }

  kuvaTekst(s, k);
}

// tootleBackspace eemaldab kursori ees oleva tärgi.
// Eemaldab ka eemaldamise tulemusena võimalikult tekkivad korduvad tühikud.
function tootleBackspace() {
  var k = loeKursor(); // Kursor
  var s = loeDOM(); // Samatekst DOM-kujul

  var t = DOM2Tekst(s, k);
  t = eemaldaTark(t, true);
  t = t.replace(/  /g, " ");

  s = tekst2DOM(t);
  k = tekst2Kursor(t);

  kuvaTekst(s, k);
}

// tootleDelete eemaldab kursori järel oleva tärgi.
// Kui eemaldamise tulemus tekkis korduv tühik, siis eemaldab ka selle.
function tootleDelete() {
  var k = loeKursor(); // Kursor
  var s = loeDOM(); // Samatekst DOM-kujul

  var t = DOM2Tekst(s, k);
  t = eemaldaTark(t, false);
  t = t.replace(/  /g, " ");

  s = tekst2DOM(t);
  k = tekst2Kursor(t);

  kuvaTekst(s, k);
}



