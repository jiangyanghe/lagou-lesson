import createElement from './heading.js';
import './main.css';
import img from './state_1.png'

const heading = createElement();
const image = new Image();
image.src = img;

const testfn = () => {
  console.log(2222)
}

document.body.append(heading);
document.body.append(image);