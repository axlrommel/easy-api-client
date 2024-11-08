var cardsHolder = document.getElementById('past-calls');
var resultEl = document.getElementById('results');

function useLoadButton(item) {
  var savedItemsStr = localStorage.getItem('api-calls');
  const savedItems = JSON.parse(savedItemsStr);
  var savedItem = {};
  for (let i = 0; i < savedItems.length; i++) {
    if (savedItems[i].id === item.id) {
      savedItem = savedItems[i];
      break;
    }
  }
  if (savedItem.id !== undefined) {
    var urlEl = document.getElementById('target-url');
    urlEl.value = savedItem.url;
  }
}

function useRemoveButton(id) {
  var savedItemsStr = localStorage.getItem('api-calls');
  const savedItems = JSON.parse(savedItemsStr);
  const newItems = [];
  for (let i = 0; i < savedItems.length; i++) {
    if (savedItems[i].id !== id) {
      newItems.push(savedItems[i]);
    }
  }
  localStorage.setItem('api-calls', JSON.stringify(newItems));
  reload();
}

function loadPastCall(item) {
  var section = document.createElement('div');
  section.setAttribute('class', 'card');
  section.setAttribute('id', item.id);

  var title = document.createElement('h4');
  title.textContent = item.name;

  var url = document.createElement('p');
  url.textContent = `${item.method} | ${item.url}`;

  var buttonsDivEl = document.createElement('div');

  var useButtonEl = document.createElement('button');
  useButtonEl.textContent = 'Load';
  useButtonEl.addEventListener('click', function () {
    useLoadButton(item);
  });

  var removeButtonEl = document.createElement('button');
  removeButtonEl.textContent = 'Remove From Storage';
  removeButtonEl.onclick = function () {
    useRemoveButton(item.id);
  };

  buttonsDivEl.appendChild(useButtonEl);
  buttonsDivEl.appendChild(removeButtonEl);

  section.appendChild(title);
  section.appendChild(url);
  section.appendChild(buttonsDivEl);
  cardsHolder.appendChild(section);
}

function loadPastCalls() {
  try {
    const strCalls = localStorage.getItem('api-calls');
    if (strCalls && strCalls.length > 0) {
      const calls = JSON.parse(strCalls);
      for (let i = 0; i < calls.length; i++) {
        loadPastCall(calls[i]);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function reload() {
  cardsHolder.replaceChildren();
  loadPastCalls();
}

function doCall() {
  const url = document.getElementById('target-url').value;
  const method = document.getElementById('method').value;
  resultEl.textContent = '';

  fetch(url, { method })
    .then((response) => response.json())
    .then((data) => {
      const formattedData = JSON.stringify(data, null, 2);
      resultEl.textContent = formattedData;
    })
    .catch((error) => {
      resultEl.textContent = error;
    });
}

function getUniqueId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

function save() {
  const resultName = prompt('give a name to this call');
  const newItem = {
    id: getUniqueId(),
    name: resultName,
    method: document.getElementById('method').value,
    url: document.getElementById('target-url').value,
  };
  var savedItemsStr = localStorage.getItem('api-calls');
  if (savedItemsStr) {
    const savedItems = JSON.parse(savedItemsStr);
    savedItems.push(newItem);
    localStorage.setItem('api-calls', JSON.stringify(savedItems));
  } else {
    localStorage.setItem('api-calls', JSON.stringify([newItem]));
  }

  reload();
}

function clearOutput() {
  resultEl.textContent = '';
}
