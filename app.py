from wsgiref.simple_server import make_server # the wsgiref webserver (default with Python)
from pyramid.config import Configurator
from pyramid.view import view_config

from pyramid.response import Response
from pyramid.response import FileResponse
from pyramid.renderers import render_to_response

import json
import os
import glob

''' Routes '''
def banjos_route(req):
  return FileResponse('banjos.html')

@view_config(request_method='POST')
def melody_route(req):
  melody_body = json.loads(req.body)
  mag_command = "improv_rnn_generate \
--config=chord_pitches_improv \
--bundle_file=chord_pitches_improv.mag \
--output_dir=./public/outputs \
--num_outputs=1 \
--primer_melody=\"" + str(melody_body["element"]) + "\" \
--backing_chords=\"" + melody_body["progression"] + "\" \
--render_chords"
  print(mag_command)
  os.system("rm ./public/outputs/*")
  os.system(mag_command)

  midi_file = glob.glob("./public/outputs/*.mid")
  midi_file = midi_file[0]
  midi_file = "." + midi_file[8:]
  print(midi_file)
  print("finished the call")
  return Response(body=midi_file, content_type='text/plain')

''' Main Application '''
def main() :
  with Configurator() as config:

    # basic_route
    config.add_route('root', '/')
    config.add_view(banjos_route, route_name='root')

    # banjos_route
    config.add_route('banjos_route', '/banjos')
    config.add_view(banjos_route, route_name='banjos_route')

    # for template_route / template_route2
    config.include('pyramid_jinja2')
    config.add_jinja2_renderer('.html')

    # melody route
    config.add_route('melody_route', '/melody')
    config.add_view(melody_route, route_name='melody_route')

    # add static folder to search path
    config.add_static_view(name='/', path='./public', cache_max_age=3600)

    # create the webserver config
    app = config.make_wsgi_app()

  # run the server
  server = make_server('127.0.0.1', 8080, app)
  print("The server is now running on: http://127.0.0.1:8080")

  try:
    server.serve_forever()
  except KeyboardInterrupt:
    print("\nExiting...")
    exit(0)

if __name__ == '__main__':
  main()
