const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'פתיחת תפריט' : 'סגירת תפריט');
  navigation.classList.toggle('open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'פתיחת תפריט');
  });
});

document.querySelectorAll('.accordion details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const form = document.querySelector('#appointment-form');
const status = document.querySelector('#form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.querySelector('#full-name');
  const phone = form.querySelector('#phone');
  const nameError = form.querySelector('#name-error');
  const phoneError = form.querySelector('#phone-error');
  let valid = true;

  name.removeAttribute('aria-invalid');
  phone.removeAttribute('aria-invalid');
  nameError.textContent = '';
  phoneError.textContent = '';
  status.textContent = '';

  if (name.value.trim().length < 2) {
    name.setAttribute('aria-invalid', 'true');
    nameError.textContent = 'נא לכתוב שם מלא.';
    valid = false;
  }

  if (!/^0[2-9]\d{7,8}$/.test(phone.value.replace(/[\s-]/g, ''))) {
    phone.setAttribute('aria-invalid', 'true');
    phoneError.textContent = 'נא להזין מספר טלפון ישראלי תקין.';
    valid = false;
  }

  if (!valid) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'שולחת…';

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = 'שליחת פרטים';
    status.textContent = 'תודה! הפרטים התקבלו ואחזור אליך בהקדם.';
    form.reset();
  }, 650);
});
