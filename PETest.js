var edukaidTeste = 0;
var mitteedukaidTeste = 0;

var silumistase = 2;
// Konsoolile väljastatava silumisteabe värvimiseks.
var cyan = 'color: cyan;';

// taidaTestid täidab testid.
function taidaTestid() {
  onSamatekstTestid();
  lisaTarkTestid();
  eemaldaTarkTestid();
  DOM2TekstTestid();
  tekst2DOMTestid();
  tekst2KursorTestid();
  targitestid();
  loendaTahedTestid();

  kuvaStatistika();
}

function onSamatekstTestid() {
  kuvaFunktsiooniNimetus('onSamatekst');
  test(onSamatekst(''), false, '<kursorita tühitekst>');
  test(onSamatekst('abc'), false, '<kursorita>');
  test(onSamatekst('|'), false, '<kursoriga tühitekst>');
  test(onSamatekst('c|'), true, 'c|');
  test(onSamatekst('c.|'), true, 'c.|');
  test(onSamatekst('c.|c'), true, 'c.|c');
  test(onSamatekst('c.#|c'), false, 'c.#|c');
  test(onSamatekst('a b.c. |c ba!'), true, 'a b.c. |c ba!');
  test(onSamatekst('a  b.c. |c ba!'), false, 'a  b.c. |c ba!');
  test(onSamatekst(' c.|c'), false, ' c.|c');
  test(onSamatekst(' c.|c '), false, ' c.|c ');
}

function lisaTarkTestid() {
  kuvaFunktsiooniNimetus('lisaTark');
  test(lisaTark('|amen udune ma', 'a'), 'a|amen udune maa', 'nr 1');
  test(lisaTark('aa|en udune aa', 'm'), 'aam|en udune maa', 'nr 2');
  test(lisaTark('aamen|udune maa', ' '), 'aamen |udune maa', 'nr 3');
  test(lisaTark('aamen |dne maa', 'u'), 'aamen u|dune maa', 'nr 4');
  test(lisaTark('aamen u|une maa', 'd'), 'aamen ud|dune maa', 'nr 5');
  test(lisaTark('aame udu|e maa', 'n'), 'aamen udun|e maa', 'nr 6');
  test(lisaTark('amen udune ma|', 'a'), 'aamen udune maa|', 'nr 7');
}

function eemaldaTarkTestid() {
  kuvaFunktsiooniNimetus('eemaldaTark');
  test(eemaldaTark('|aamen udune maa', false), '|amen udune ma', 'nr 1');
  test(eemaldaTark('a|amen udune maa', true), '|amen udune ma', 'nr 2');
  test(eemaldaTark('aa|men udune maa', false), 'aa|en udune aa', 'nr 3');
  test(eemaldaTark('aam|en udune maa', true), 'aa|en udune aa', 'nr 4');
  test(eemaldaTark('aamen| udune maa', false), 'aamen|udune maa', 'nr 5');
  test(eemaldaTark('aamen |udune maa', true), 'aamen|udune maa', 'nr 6');
  test(eemaldaTark('aamen |udune maa', false), 'aamen |dne maa', 'nr 7');
  test(eemaldaTark('aamen u|dune maa', true), 'aamen |dne maa', 'nr 8');
  test(eemaldaTark('aamen u|dune maa', false), 'aamen u|une maa', 'nr 9');
  test(eemaldaTark('aamen ud|une maa', true), 'aamen u|une maa', 'nr 10');
  test(eemaldaTark('aamen udu|ne maa', false), 'aame udu|e maa', 'nr 11');
  test(eemaldaTark('aamen udun|e maa', true), 'aame udu|e maa', 'nr 12');
  test(eemaldaTark('aamen udune ma|a', false), 'amen udune ma|', 'nr 13');
  test(eemaldaTark('aamen udune maa|', true), 'amen udune ma|', 'nr 14');
}

function DOM2TekstTestid() {
  kuvaFunktsiooniNimetus('DOM2Tekst');
  test(
    DOM2Tekst(
      { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" },
      { Span: "A", Pos: 2}
    ),
    "aa|men udune maa", "nr 1"
  );
  test(
    DOM2Tekst(
      { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" },
      { Span: "K1", Pos: 1 }
    ),
    "aamen ud|une maa", "nr 2"
  );
  test(
    DOM2Tekst(
      { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" },
      { Span: "B", Pos: 7 }
    ),
    "aamen udune maa|", "nr 3"
  );
  test(
    DOM2Tekst(
      { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" },
      { Span: "K2", Pos: 0 }
    ),
    "aamen ud|une maa", "nr 4"
  );
}

function tekst2KursorTestid() {
  kuvaFunktsiooniNimetus('tekst2Kursor');
  test(tekst2Kursor("|aamen udune maa").toString(),
    { Span: "A", Pos: "0" }.toString(), 'nr 1');
  test(tekst2Kursor("aa|men udune maa").toString(),
    { Span: "A", Pos: "2" }.toString(), 'nr 2');
  test(tekst2Kursor("aamen |udune maa").toString(),
    { Span: "A", Pos: "6" }.toString(), 'nr 3');
  test(tekst2Kursor("aamen u|dune maa").toString(),
    { Span: "A", Pos: "7" }.toString(), 'nr 4');
  test(tekst2Kursor("aamen ud|une maa").toString(),
    { Span: "K1", Pos: "0" }.toString(), 'nr 5');
  test(tekst2Kursor("aam | maa").toString(),
    { Span: "V", Pos: "1" }.toString(), 'nr 6');
  test(tekst2Kursor("aamen udune m|aa").toString(),
    { Span: "B", Pos: "5" }.toString(), 'nr 7');
  test(tekst2Kursor("aamen udune maa|").toString(),
    { Span: "B", Pos: "7" }.toString(), 'nr 8');
  test(tekst2Kursor("aam |maa").toString(),
    { Span: "K2", Pos: "0" }.toString(), 'nr 9');
  test(tekst2Kursor("a|gamen udune maga").toString(),
    { Span: "A", Pos: "1" }.toString(), 'nr 9');
}

function tekst2DOMTestid() {
  kuvaFunktsiooniNimetus('tekst2DOM');
  test(
    tekst2DOM('|aamen udune maa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor A alguses');
  test(
    tekst2DOM('aam|en udune maa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor A-s');
  test(
    tekst2DOM('aamen |udune maa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor A-s, tühiku järel');
  test(
    tekst2DOM('aamen| udune maa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor A-s, tühiku ees');
  test(
    tekst2DOM('aamen udune |maa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor B-s, tühiku järel');
  test(
    tekst2DOM('aamen udune| maa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor B-s, tühiku ees');
  test(
    tekst2DOM('aamen udune maa|').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "", B: "une maa" }.toString(),
    'kursor lõpus');
  test(
    tekst2DOM('aamen uddune m|aa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "d", B: "une maa" }.toString(),
    'kursor B-s, kesktäht paariti');
  test(
    tekst2DOM('aamen ud, dune m|aa').toString(),
    { A: "aamen u", K1: "d", V: "", K2: "d", B: "une maa" }.toString(),
    'kursor B-s, kesktäht paariti, vahega');
  test(
    tekst2DOM('a am ! m a|a').toString(),
    { A: "a a", K1: "m", V: " ! ", K2: "m", B: "m aa" }.toString(),
    'nr 2');
  }

function targitestid() {
  kuvaFunktsiooniNimetus('taht');
  test(taht('|'), false, '');
  test(taht('a'), true, '');
  test(taht('Ц'), true, '');
  test(taht(','), false, '');
  kuvaFunktsiooniNimetus('kirjavm');
  test(kirjavm('|'), false, '');
  test(kirjavm('a'), false, '');
  test(kirjavm('Ц'), false, '');
  test(kirjavm(','), true, '');
}

function loendaTahedTestid() {
  kuvaFunktsiooniNimetus('loendaTahed');
  test(loendaTahed('|'), 0, '|');
  test(loendaTahed('ab,.c!'), 3, 'ab,.c!');
  test(loendaTahed(''), 0, 'tühi string');
}

function kuvaFunktsiooniNimetus(fN) {
  $('<hr>')
    .appendTo('#Testitulemused');
  $('<p></p>')
    .text(fN)
    .appendTo('#Testitulemused');
}

// test raporteerib testitulemused. 
function test(testResult, expectedResult, testTitle) {
  var tulemus;
  if (isArray(expectedResult)) {
    tulemus = arraysEqual(expectedResult, testResult);
  }
  else {
    tulemus = testResult === expectedResult;
  }
  if (!tulemus) {
    console.log('oodatud: ' + expectedResult.toString() + ' saadud: ' + testResult.toString());
  }
  var tulemuserida = $('<div></div>')
    .addClass('tulemuserida')
    .addClass('d-flex justify-content-start')
    .appendTo('#Testitulemused');
  var ring = $('<div>&nbsp;</div>')
    .addClass('ring')
    .appendTo(tulemuserida);
  if (tulemus) {
    ring.addClass('edukas');
  }
  else {
    ring.addClass('ebaedukas');
  }
  var tekstiosa = $('<div></div')
    .addClass('tekstiosa')
    .text(testTitle)
    .appendTo(tulemuserida);
  if (tulemus) {
    edukaidTeste += 1;
  }
  else {
    mitteedukaidTeste = +1;
  }
}

function kuvaStatistika() {
  $('<p></p>')
    .text(
      'TESTE: edukaid: ' + 
      edukaidTeste.toString() + 
      '  mitteedukaid: ' + 
      mitteedukaidTeste.toString()
    )  
    .prependTo('#Testitulemused');
}

function arraysEqual(a, b) {
  a = Array.isArray(a) ? a : [];
  b = Array.isArray(b) ? b : [];
  return a.length === b.length && a.every((el, ix) => el === b[ix]);
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]'; 
}
