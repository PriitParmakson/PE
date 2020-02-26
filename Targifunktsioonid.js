'use strict';

// taht kontrollib, kas tärk on täht.
function taht(char) {
  return tahtKood(char.charCodeAt(0))
}

// kirjavm kontrollib, kas tärk on kirjavahemärk.
function kirjavm(char) {
  return kirjavmKood(char.charCodeAt(0))
}

// tahtKood kontrollib, kas argument on ladina täht, täpitäht või vene täht.
function tahtKood(charCode) {
  return ladinaTahtKood(charCode) ||
    tapiTahtKood(charCode) ||
    veneTahtKood(charCode)
}

// loendaTahed(s) loendab stringis s olevad tähed.
function loendaTahed(s) {
  return s
    .split("")
    .reduce(
      function (total, elem) {
        return total +
          (taht(elem) ? 1 : 0);
      },
      0
    )
}

// Tähele panna, et argument p.o. tärgikood, mitte tärk. Tärgiga kutsu välja
// charCodeAt() abi: taht(string.charCodeAt(j))

// ladinaTaht selgitab välja, kas tegu on ladina tähega.
// Ladina täht on tärk, mille charCode on vahemikus
// 97..122 (a..z) või 65..90 (A..Z).
function ladinaTahtKood(charCode) {
  return (
    (charCode >= 97 && charCode <= 122) ||
    (charCode >= 65 && charCode <= 90)
  )
}

// tapiTaht kontrollib, kas charCode on vahemikus
// õ ö ä ü 245 246 228 252
// Õ Ö Ä Ü 213 214 196 220
// š 353, Š 352
// ž 382, Ž 381 
function tapiTahtKood(charCode) {
  return ([245, 246, 228, 252, 213, 214, 196,
    220, 353, 352, 382, 381].indexOf(charCode)
    != -1)
}

// veneTaht kontrollib, kas charCode on vahemikus 1024-1279.
function veneTahtKood(charCode) {
  return (charCode >= 1024 && charCode <= 1279)
}

// kirjavmKood kontrollib, kas charCode esitab lubatud kirjavahemärki:
// reavahetus 47, tühik 32  , 44  . 46  - 45  ! 33  ? 63
// ( 40  ) 41  : 58  ; 59  " 34 / 47
// Kirjavahemärgiks loeme ka reavahetusmärki '/'.
function kirjavmKood(charCode) {
  var p = [47, 32, 46, 44, 45, 33, 63, 40, 41, 58, 59, 34, 47];
  var r = p.indexOf(charCode);
  return (r >= 0)
}

// keyCodeToHumanReadable tagastab reale erisümbolitele inimloetava tekstikuju.
// Kui erisümbolit ei leia, siis tagastab tühisõne.
function keyCodeToHumanReadable(keyCode) {
  var keycodes = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause',
    20: 'caps_lock',
    27: 'esc',
    32: 'space',
    33: 'page_up',
    34: 'page_down',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    91: 'command',
    93: 'right_click',
    106: 'numpad_*',
    107: 'numpad_+',
    109: 'numpad_-',
    110: 'numpad_.',
    111: 'numpad_/',
    144: 'num_lock',
    145: 'scroll_lock',
    182: 'my_computer',
    183: 'my_calculator',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'"
  }
  return (keycodes[keyCode] || '')
}

// Märkmed
// Javascript Array reduce()
// https://www.w3schools.com/jsref/jsref_reduce.asp
