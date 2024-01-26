#!/bin/bash

sudo apt-add-repository --yes ppa:mosquitto-dev/mosquitto-ppa
sudo apt-get update

sudo apt-get --assume-yes install mosquitto mosquitto-clients

cat << EOS >> mosquitto.conf
listener 1883
allow_anonymous true
EOS

mosquitto -c mosquitto.conf -d -p 1883