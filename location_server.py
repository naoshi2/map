# -*- coding:utf-8 -*-
from websocket_server import WebsocketServer


def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])


def client_left(client, server):
    print("Client(%d) disconnected" % client['id'])


def message_received(client, server, message):
    print("Client(%d) said: %s" % (client['id'], message))
    server.send_message_to_all(message)


PORT = 8082
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()
