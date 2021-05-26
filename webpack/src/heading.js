export default () => {
  const element = document.createElement('h2');

  element.textContent = 'hello world123';
  element.addEventListener('click', () => {
    alert('Hello webpack123');
  })

  return element;
}