const functions = require('firebase-functions');
const {dialogflow, ImmersiveResponse} = require('actions-on-google');

const app = dialogflow({debug: true});
app.intent('welcome', (conv) => {
  conv.ask('Welcome! Do you want me to change color or pause spinning?');
  conv.ask(new ImmersiveResponse({
    url: 'https://firstaction-41bd7.firebaseapp.com/',
  }));
});

// map of human speakable colors to color values
const tints = {
  red: 0xFF0000,
  green: 0x00FF00,
  blue: 0x0000FF,
};

const colorSet = ['red','blue','green'];

app.intent('color', (conv, {color}) => {
  if (color in tints) {
    conv.ask(`Ok, I changed my color to ${color}. What else?`);
    conv.ask(new ImmersiveResponse({
      state: {
        tint: tints[color],
        tc: color
      },
    }));
    return;
  }
  conv.ask(`Sorry, I don't know that color. What else?`);
  conv.ask(new ImmersiveResponse({
    state: {
      query: conv.query,
    },
  }));
});
app.intent('start', (conv) => {
  conv.ask(`Ok, I'm spinning. What else?`);
  conv.ask(new ImmersiveResponse({
    state: {
      spin: true,
    },
  }));
});

app.intent('textColor', (conv, {textColor}) => {
  if (colorSet.includes(textColor)) {
    conv.ask(`Ok, I changed my text color to ${textColor}. What else?`);
    conv.ask(new ImmersiveResponse({
    state: {
      textColor
    },
    }));
    return;
  }
  conv.ask(`Sorry, I don't know that color. What else?`);
  conv.ask(new ImmersiveResponse({
    state: {
      query: conv.query,
    },
  }));
});

app.intent('pause', (conv) => {
  conv.ask(`Ok, I paused spinning. What else?`);
  conv.ask(new ImmersiveResponse({
    state: {
      spin: false,
    },
  }));
});

app.intent('move', (conv, {location}) => {
  conv.ask(`Sure, the box now... moving to ${location}`);
  conv.ask(new ImmersiveResponse({
    state: {
      location
    },
  }));
});

exports.conversation = functions.https.onRequest(app);