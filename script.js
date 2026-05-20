// script.js
document.querySelectorAll('.anime').forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault();
    const target = event.target.closest('a').getAttribute('data-target');
    const modal = document.getElementById(`modal-${target}`);
    if (modal) modal.style.display = 'block';
  });
});

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const modal = btn.closest('.modal');
    if (modal) modal.style.display = 'none';
  });
});

window.addEventListener('click', function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) modal.style.display = 'none';
  });
});
