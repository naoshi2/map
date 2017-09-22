# -*- coding: utf-8 -*-
from tweepy.streaming import StreamListener
from tweepy import Stream, OAuthHandler
import tweepy
import json
import re
import sys
import codecs
import yaml
from access import *
from websocket import create_connection

u = 'utf-8'


class BaseStdOutListener(StreamListener):
    def __init__(self):
        connection = "ws://127.0.0.1:8082"
        self.ws = create_connection(connection)

    def getJson(self, tweet):
        user = str(tweet['user']['screen_name'])
        text = tweet['text'].encode(u)
        bound = self.getBound(tweet['place']['bounding_box']['coordinates'][0])

        json = "{\"user\" : \"" + user + "\"" \
            + ", \"text\" : \"" + text + "\"" \
            + ", \"north\": " + str(bound['north']) \
            + ", \"south\" : " + str(bound['south']) \
            + ", \"east\" : " + str(bound['east']) \
            + ", \"west\" : " + str(bound['west']) \
            + "}"

        return json

    def getBound(self, coordinates):
        north = coordinates[1][1]
        south = coordinates[0][1]
        east = coordinates[2][0]
        west = coordinates[0][0]

        return {"north": north, "south": south, "east": east, "west": west}

    def on_data(self, data):
        tweet = json.loads(data)
        if tweet.has_key('user') and tweet['place']:
            print tweet['user']['screen_name']
            self.ws.send(self.getJson(tweet))

    def on_error(self, status):
        print status


class Twitter():
    def __init__(self):
        data = yaml.load(file('key.yaml'))
        CK = data['CK']
        CS = data['CS']
        AT = data['annn']['AT']
        AS = data['annn']['AS']

        self.auth = OAuthHandler(CK, CS)
        self.auth.set_access_token(AT, AS)

    def GetGeo(self):
        listener = BaseStdOutListener()
        self.stream = Stream(self.auth, listener)

        #self.stream.filter(locations=[-122.75, 36.8, -121.75, 37.8])
        self.stream.filter(locations=[139.39, 35.2, 139.70, 35.5])


if __name__ == '__main__':
    twitter = Twitter()
    twitter.GetGeo()
