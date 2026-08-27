const projectForm = document.querySelector('#project-form');
const formStatus = document.querySelector('#form-status');

projectForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(projectForm);
  const lines = [
    'Hello ONEMARK, I would like to discuss a project.',
    `Name: ${data.get('name')}`,
    `Company: ${data.get('company')}`,
    `Email: ${data.get('email')}`,
    `Country / region: ${data.get('country')}`,
    `Product: ${data.get('product')}`,
    `Screen size: ${data.get('size') || 'To be confirmed'}`,
    `Touch: ${data.get('touch')}`,
    `Operating system: ${data.get('os')}`,
    `Estimated quantity: ${data.get('quantity') || 'To be confirmed'}`,
    `Project details: ${data.get('details') || 'To be discussed'}`
  ];
  formStatus.textContent = 'Opening WhatsApp with your project brief. You can review it before sending.';
  window.open(`https://wa.me/8613027590517?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});
