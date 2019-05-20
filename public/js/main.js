/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// const view = document.getElementById('view');

// // set up fps monitoring
// const stats = new Stats();
// view.getElementsByClassName('stats')[0].appendChild(stats.domElement);

// // initialize rendering and set correct sizing
// const ratio = window.devicePixelRatio;
// const renderer = PIXI.autoDetectRenderer({
//   transparent: true,
//   antialias: true,
//   resolution: ratio,
//   width: view.clientWidth,
//   height: view.clientHeight,
// });
// const element = renderer.view;
// element.style.width = `${renderer.width / ratio}px`;
// element.style.height = `${renderer.height / ratio}px`;
// view.appendChild(element);

// // center stage and normalize scaling for all resolutions
// const stage = new PIXI.Container();
// stage.position.set(view.clientWidth / 2, view.clientHeight / 2);
// stage.scale.set(Math.max(renderer.width, renderer.height) / 1024);

// // load a sprite from a svg file
// const sprite = PIXI.Sprite.from('triangle.svg');
// sprite.anchor.set(0.5);
// sprite.tint = 0x00FF00; // green
// stage.addChild(sprite);

let spin = false;
let deg = 0;
const pos = {
  top: 0,
  left: 0
};

setInterval(() => {
  if (spin) {
    deg += 2;
    if (deg >= 360) {
      deg = 0;
    }
    // console.log('deg', deg);
    document.getElementById("box").style.transform = `rotate(${deg}deg)`; 
  }
  // console.log('interval running');
}, 20);

const mapToTextColor = {
  0xFF0000: '#ff0000',
  0x00FF00: '#00ff00',
  0x0000FF: '#0000ff',
}

// register assistant canvas callbacks
const callbacks = {
  onUpdate(state) {
    console.log('onUpdate', JSON.stringify(state));
    if ('tint' in state) {
      sprite.tint = state.tint;
    }
    if ('textColor' in state) {
      document.getElementById('text').style.color = state.textColor;
    }
    if ('spin' in state) {
      spin = state.spin;
    }
    if ('location' in state) {
      const location = state.location;
      console.log('location:', location);
      if (location === 'right') pos.left = 150;
      else if (location === 'left') pos.left = 0;
      else if (location === 'bottom') pos.top = 150;
      else if (location === 'top') pos.top = 0;
      else {
        pos.top = 0;
        pos.left = 0;
      }
      document.getElementById('box').style.top = `${pos.top}px`;
      document.getElementById('box').style.left = `${pos.left}px`;
    }
    if ('timer' in state) {
      setTimeout(() => {
        // trigger the assistant as if the user said "instructions"
        assistantCanvas.sendTextQuery('instructions');
      }, state.timer * 1000);
    }
  },
};
assistantCanvas.ready(callbacks);

// toggle spin on touch events of the triangle
// sprite.interactive = true;
// sprite.buttonMode = true;
// sprite.on('pointerdown', () => {
//   spin = !spin;
// });

// let last = performance.now();
// // frame-by-frame animation function
// const frame = () => {
//   stats.begin();

//   // calculate time differences for smooth animations
//   const now = performance.now();
//   const delta = now - last;

//   // rotate the triangle only if spin is true
//   if (spin) {
//     sprite.rotation += delta / 1000;
//   }

//   last = now;

//   renderer.render(stage);
//   stats.end();
//   requestAnimationFrame(frame);
// };
// frame();
