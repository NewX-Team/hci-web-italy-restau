const MENU = [
  { cat:'Primi Piatti', name:'Black Truffle Risotto',        desc:'Arborio rice + Parmigiano + truffle',     price:285000, value:'truffle-risotto'  },
  { cat:'Primi Piatti', name:'Lobster Linguine',             desc:'Handmade pasta + lobster + brandy',       price:325000, value:'lobster-linguine' },
  { cat:'Primi Piatti', name:'Pappardelle al Cinghiale',     desc:'Wild boar ragù + Chianti wine',           price:265000, value:'pappardelle'  },
  { cat:'Primi Piatti', name:'Gnocchi al Gorgonzola',        desc:'Potato gnocchi + Gorgonzola cream',       price:195000, value:'gnocchi'   },
  { cat:'Primi Piatti', name:'Spaghetti alle Vongole',       desc:'Clams + white wine + peperoncino',        price:245000, value:'vongole' },
  { cat:'Secondi Piatti', name:'Beef Carpaccio',             desc:'Wagyu tenderloin + arugula + parmesan',   price:195000, value:'carpaccio'},
  { cat:'Secondi Piatti', name:'Osso Buco alla Milanese',    desc:'Braised veal shank + saffron risotto',    price:385000, value:'osso-buco'   },
  { cat:'Secondi Piatti', name:'Branzino al Forno',          desc:'Roasted sea bass + artichokes',           price:345000, value:'branzino'      },
  { cat:'Secondi Piatti', name:'Bistecca alla Fiorentina',   desc:'Chianina T-bone + rosemary potatoes',     price:495000, value:'bistecca'   },
  { cat:'Dolci', name:'Truffle Tiramisu',                    desc:'Mascarpone + espresso + truffle oil',     price:145000, value:'tiramisu'        },
  { cat:'Dolci', name:'Panna Cotta al Pistacchio',           desc:'Bronte pistachio + raspberry coulis',     price:125000, value:'panna-cotta' },
  { cat:'Dolci', name:'Tortino al Cioccolato',               desc:'Dark chocolate lava + vanilla gelato',    price:155000, value:'tortino'      },
  { cat:'Dolci', name:'Cannoli Siciliani',                   desc:'Ricotta cream + candied citrus',          price:135000, value:'cannoli'   },
  { cat:'Bevande', name:'Espresso Doppio',                   desc:'Double shot + Ethiopian Arabica',          price:55000,  value:'espresso' },
  { cat:'Bevande', name:'Negroni Sbagliato',                 desc:'Campari + vermouth + Prosecco',            price:165000, value:'negroni'   },
  { cat:'Bevande', name:'Limoncello Spritz',                 desc:'Homemade limoncello + Prosecco',           price:145000, value:'limoncello'      },
  { cat:'Bevande', name:'Acqua di Toscana',                  desc:'Tuscan mineral water + rosemary',          price:45000,  value:'acqua'   },
];

const CATS = [...new Set(MENU.map(m => m.cat))];
const fmt  = n => 'Rp ' + n.toLocaleString('id-ID');

const lines  = {};
let uid    = 0;
let openId = null;

const showErr  = (id, msg) => { const e = document.getElementById(id); if (e) e.textContent = msg; };
const clearErr = (id)      => { const e = document.getElementById(id); if (e) e.textContent = ''; };
const setInv   = (el, v)   => el && el.classList.toggle('invalid', v);

function updateBill() {
  const billItems = document.getElementById('billItems');
  const billEmpty = document.getElementById('billEmpty');
  const billSubEl = document.getElementById('billSubtotal');
  const billTaxEl = document.getElementById('billTax');
  const billTotEl = document.getElementById('billTotal');
  if (!billItems) return;

  const selected = Object.values(lines).filter(l => l.selected);

  if (!selected.length) {
    billItems.innerHTML = '';
    if (billEmpty) billEmpty.style.display = 'flex';
    if (billSubEl) billSubEl.textContent = '—';
    if (billTaxEl) billTaxEl.textContent = '—';
    if (billTotEl) billTotEl.textContent = '—';
    return;
  }

  if (billEmpty) billEmpty.style.display = 'none';

  let subtotal = 0;
  billItems.innerHTML = selected.map(l => {
    const total = l.selected.price * l.qty;
    subtotal += total;
    return `
      <div class="bill-item">
        <span class="bill-item-name">${l.selected.name}</span>
        <span class="bill-item-qty">×${l.qty}</span>
        <span class="bill-item-price">${fmt(total)}</span>
      </div>`;
  }).join('');

  const tax   = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  if (billSubEl) billSubEl.textContent = fmt(subtotal);
  if (billTaxEl) billTaxEl.textContent = fmt(tax);
  if (billTotEl) billTotEl.textContent = fmt(total);
}

function lineHTML(id) {
  const s      = lines[id];
  const sel    = s.selected;
  const isOpen = openId === id;

  const dropItems = CATS.map(cat => {
    const items = MENU.filter(m => m.cat === cat).map(m => `
      <div class="drop-item${sel && sel.value === m.value ? ' active' : ''}"
           data-action="pick" data-id="${id}" data-val="${m.value}">
        <span class="drop-info">
          <span class="drop-name">${m.name}</span>
          <span class="drop-desc">${m.cat}</span>
        </span>
        <span class="drop-price">${fmt(m.price)}</span>
      </div>`).join('');
    return `<div class="drop-group">${cat}</div>${items}`;
  }).join('');

  const canRemove = Object.keys(lines).length > 1;

  return `
  <div class="order-line" id="row-${id}">
    <div class="order-line-fields">
      <div class="selector-wrap">
        <button type="button" class="selector-btn${isOpen ? ' open' : ''}" data-action="toggle" data-id="${id}">
          <span class="sel-text">
            <span class="sel-name${sel ? '' : ' muted'}">${sel ? sel.name : 'Select a dish'}</span>
            <span class="sel-sub">${sel ? sel.cat : 'Choose from our menu'}</span>
          </span>
          ${sel ? `<span class="sel-price">${fmt(sel.price)}</span>` : ''}
          <span class="sel-chevron${isOpen ? ' open' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
        <div class="sel-dropdown${isOpen ? ' open' : ''}">
          <div class="drop-search-wrap">
            <svg class="drop-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="drop-search-input" type="text" placeholder="Search menu…"
                   data-action="search" data-id="${id}" autocomplete="off"/>
          </div>
          <div class="drop-list" id="droplist-${id}">${dropItems}</div>
        </div>
      </div>

      <div class="qty-stepper">
        <button type="button" class="qty-btn" data-action="minus" data-id="${id}">−</button>
        <span class="qty-val" id="qty-${id}">${s.qty}</span>
        <button type="button" class="qty-btn" data-action="plus" data-id="${id}">+</button>
      </div>

      ${canRemove ? `
      <button type="button" class="btn-remove-line" data-action="remove" data-id="${id}" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>` : ''}
    </div>
  </div>`;
}

function renderLines() {
  const container = document.getElementById('orderLines');
  if (!container) return;
  container.innerHTML = Object.keys(lines).map(id => lineHTML(id)).join('');
  updateBill();
}

function renderOne(id) {
  const existing = document.getElementById('row-' + id);
  if (!existing) { renderLines(); return; }
  const tmp = document.createElement('div');
  tmp.innerHTML = lineHTML(id);
  existing.replaceWith(tmp.firstElementChild);
  updateBill();
}

function addLine() {
  const id = 'l' + (uid++);
  lines[id] = { selected: null, qty: 1 };
  renderLines();
}

function closeDropdown() {
  if (!openId) return;
  const prev = openId;
  openId = null;
  renderOne(prev);
}

function filterList(id, q) {
  const list = document.getElementById('droplist-' + id);
  if (!list) return;
  const term = q.toLowerCase();
  list.querySelectorAll('.drop-item').forEach(el => {
    const name = el.querySelector('.drop-name').textContent.toLowerCase();
    el.style.display = name.includes(term) ? '' : 'none';
  });
  list.querySelectorAll('.drop-group').forEach(grp => {
    let sib = grp.nextElementSibling;
    let vis = false;
    while (sib && !sib.classList.contains('drop-group')) {
      if (sib.style.display !== 'none') vis = true;
      sib = sib.nextElementSibling;
    }
    grp.style.display = vis ? '' : 'none';
  });
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');

  if (!el) {
    closeDropdown();
    return;
  }

  const action = el.dataset.action;
  const id     = el.dataset.id;

  if (!el.closest('.selector-wrap') && action !== 'minus' && action !== 'plus' && action !== 'remove') {
    closeDropdown();
    return;
  }

  if (action === 'toggle') {
    e.stopPropagation();
    if (openId && openId !== id) closeDropdown();
    openId = (openId === id) ? null : id;
    renderOne(id);
    if (openId === id) {
      setTimeout(() => {
        document.querySelector(`.drop-search-input[data-id="${id}"]`)?.focus();
      }, 30);
    }
    return;
  }

  if (action === 'pick') {
    e.stopPropagation();
    lines[id].selected = MENU.find(m => m.value === el.dataset.val) || null;
    openId = null;
    renderOne(id);
    clearErr('err-menu');
    return;
  }

  if (action === 'minus') {
    lines[id].qty = Math.max(1, lines[id].qty - 1);
    const el2 = document.getElementById('qty-' + id);
    if (el2) el2.textContent = lines[id].qty;
    updateBill();
    return;
  }

  if (action === 'plus') {
    lines[id].qty = Math.min(20, lines[id].qty + 1);
    const el2 = document.getElementById('qty-' + id);
    if (el2) el2.textContent = lines[id].qty;
    updateBill();
    return;
  }

  if (action === 'remove') {
    delete lines[id];
    renderLines();
    return;
  }
});

document.addEventListener('input', e => {
  const el = e.target.closest('[data-action="search"]');
  if (!el) return;
  filterList(el.dataset.id, el.value);
});

function validateService() {
  const sel = document.querySelector('input[name="service"]:checked');
  if (!sel) { showErr('err-service', 'Please choose a service option.'); return false; }
  clearErr('err-service'); return true;
}

function validateAddress() {
  const service = document.querySelector('input[name="service"]:checked');
  if (!service || service.value !== 'delivery') return true;
  const el = document.getElementById('address');
  const v  = el.value.trim();
  if (!v)          { showErr('err-address', 'Please enter your delivery address.'); setInv(el, true); return false; }
  if (v.length<10) { showErr('err-address', 'Address is too short.'); setInv(el, true); return false; }
  clearErr('err-address'); setInv(el, false); return true;
}

function validateName() {
  const el = document.getElementById('name');
  const v  = el.value.trim();
  if (!v) { showErr('err-name', 'Please enter your full name.'); setInv(el, true); return false; }
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c >= 48 && c <= 57) { showErr('err-name', 'Name should not contain numbers.'); setInv(el, true); return false; }
  }
  if (v.split(' ').filter(w => w).length < 2) { showErr('err-name', 'Please enter first and last name.'); setInv(el, true); return false; }
  clearErr('err-name'); setInv(el, false); return true;
}

function validatePhone() {
  const el = document.getElementById('phone');
  const v  = el.value.trim();
  if (!v) { showErr('err-phone', 'Please enter your phone number.'); setInv(el, true); return false; }
  if (v[0] !== '0' && v[0] !== '+') { showErr('err-phone', 'Must start with 0 or +.'); setInv(el, true); return false; }
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (v[i] !== '+' && (c < 48 || c > 57)) { showErr('err-phone', 'Digits only.'); setInv(el, true); return false; }
  }
  const digits = v.startsWith('+') ? v.slice(1) : v;
  if (digits.length < 9 || digits.length > 13) { showErr('err-phone', '9–13 digits required.'); setInv(el, true); return false; }
  clearErr('err-phone'); setInv(el, false); return true;
}

function validateMenu() {
  const any = Object.values(lines).some(l => l.selected);
  if (!any) { showErr('err-menu', 'Please select at least one menu item.'); return false; }
  clearErr('err-menu'); return true;
}

function validatePayment() {
  const sel   = document.querySelector('input[name="payment"]:checked');
  const pills = document.querySelector('.payment-pills');
  if (!sel) { showErr('err-payment', 'Please select a payment method.'); pills?.classList.add('invalid'); return false; }
  clearErr('err-payment'); pills?.classList.remove('invalid'); return true;
}

document.addEventListener('DOMContentLoaded', () => {

  addLine();

  document.getElementById('addItem')?.addEventListener('click', () => addLine());

  const paymentDetail = document.getElementById('paymentDetail');
  const payInfos = document.querySelectorAll('.pay-info');

  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      paymentDetail.classList.remove('hidden');

      payInfos.forEach(el => el.classList.remove('active'));

      const target = document.getElementById('pay-' + radio.value);
      if (target) target.classList.add('active');

      clearErr('err-payment');
      document.querySelector('.payment-pills')?.classList.remove('invalid');
    });
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.pay-copy-btn');
    if (!btn) return;
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      const original = btn.innerHTML;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = original;
      }, 2000);
    });
  });

  const deliverySection = document.getElementById('deliverySection');
  document.querySelectorAll('input[name="service"]').forEach(r => {
    r.addEventListener('change', () => {
      deliverySection?.classList.toggle('hidden', r.value !== 'delivery');
      clearErr('err-service');
    });
  });

  const notesEl   = document.getElementById('notes');
  const noteCount = document.getElementById('noteCount');
  notesEl?.addEventListener('input', () => {
    if (noteCount) noteCount.textContent = notesEl.value.length;
  });

  document.getElementById('name')?.addEventListener('blur',    validateName);
  document.getElementById('phone')?.addEventListener('blur',   validatePhone);
  document.getElementById('address')?.addEventListener('blur', validateAddress);

  document.getElementById('orderForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const ok = [validateService(), validateAddress(), validateName(), validatePhone(), validateMenu(), validatePayment()].every(Boolean);
    if (!ok) {
      document.querySelector('.invalid, .field-error:not(:empty)')?.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('.btn-submit-text').textContent = 'Placing Order…';
    setTimeout(() => document.getElementById('successModal')?.classList.remove('hidden'), 600);
  });

  document.getElementById('modalClose')?.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });
});