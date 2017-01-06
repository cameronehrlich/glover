var replaceDict =  {
  trump: 'glover'
};

var map = {};
var maps = [ replaceDict ];
for (var i = 0; i < maps.length; i++) {
  for (attr in maps[i]) {
    map[attr] = maps[i][attr];
  }
}

var concatString = function(obj) {
  var parts = [];
  for (key in obj) {
    parts.push(key);
  }
  return parts.join('|');
};

var regex = '^(' + concatString(replaceDict) + ')';

var searchFor = new RegExp(regex, 'i');

function capitalize(word) {
  var first = word.charAt(0);
  var rest = word.slice(1);

  return first.toUpperCase() + rest.toLowerCase();
}

function matchCase(old_word, replacement) {
  if (replacement.toLowerCase() == old_word.toLowerCase()) return old_word;

  var first = old_word.charAt(0);
  var second = old_word.charAt(1);

  if (/[a-z]/.test(first)) return replacement.toLowerCase();
  if (/[A-Z]/.test(second)) return replacement.toUpperCase();

  return capitalize(replacement);
}

function findMatch(word) {
  return map[word];
}

function swapWord(word) {
  return matchCase(word, word.toLowerCase().replace(searchFor, findMatch));
}

function nameSwap(text) {
  return text.replace(/\b([a-z][\w']+)\b/gi, swapWord);
}

function processPage(node){
  var treeWalker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      null,
      false
  );
  while(treeWalker.nextNode()) {
    var current = treeWalker.currentNode;
    current.textContent = nameSwap(current.textContent);
  }
}

chrome.runtime.sendMessage({name: "isPaused?"}, function(response) {
    processPage(document.body);
    document.body.addEventListener('DOMNodeInserted', function(event) {
        processPage(event.target);
    });
});
