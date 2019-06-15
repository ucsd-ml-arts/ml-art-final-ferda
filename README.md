# Final Project

Raul Pegan, rpegan@ucsd.edu

## Abstract Proposal

For the final project I plan to iterate on the generative music assignment, where we created an interface for musicians to interact with magenta models. I desire to make a musical partner that is accessible for any musician, so as a result, I aim to make the interactivity more open, with diverse instruments, scales, and tempos. Consequently, I will have to tweak the magenta models in order to adapt to these changes. The concept I have found the most interesting and impactful during this class has been an AI functioning as a co-creator, and I wish to explore that idea further. I wish to present my final as a live perfomance of sorts, since the model does have some latency unfortunately.

## Model/Data

Briefly describe the files that are included with your repository:
- chord_pitches_improv.mag - pretrained models for improv_rnn

## Code

Your code for generating your project:
- app.py - Pyramid webabb
- banjos.html - Main static page
- public/ - directory containing all the JS and CSS files necessary for the project
- requirements.txt - required models

## Results

Habib.mov - My friend habib going back and forth with the product
Juan.mov - My uncle Juan interacting with the product
UI_closeup.mov - Me interacting with the product, I am not a musician so the generated audio is not good, but this serves as a closer look at the UI

https://drive.google.com/open?id=1xVCapmBD75m5soVq5m3X85zKQ5PnchDl


## Technical Notes

This project requires two main packages: 
- pyramid - web app
- magenta - music generation models

Additionally, this only works on Google Chrome due to the fact that it is the only browser that currently supports the necessary JS libraries.

## Reference

[1] Google AI
https://magenta.tensorflow.org/ 

[2] Melody RNN
https://github.com/tensorflow/magenta/tree/master/magenta/models/melody_rnn

[3] Performance RN
https://github.com/tensorflow/magenta/tree/master/magenta/models/performance_rnn 

[4] Improv RNN
https://github.com/tensorflow/magenta/tree/master/magenta/models/improv_rnn 

[5] MIDI.js
https://github.com/mudcube/MIDI.js/

[6] MIDIjs
https://www.midijs.net/ 

[7] Tonal JS
https://github.com/tonaljs/tonal 