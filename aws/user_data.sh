#!/bin/bash

## Install dependencies
sudo apt-add-repository --yes ppa:mosquitto-dev/mosquitto-ppa
sudo apt-get update

sudo apt-get --assume-yes install mosquitto mosquitto-clients

## Set Up and Launch Mosquitto
cat << EOS >> mosquitto.conf
listener 1883
allow_anonymous true
EOS

mosquitto -c mosquitto.conf -d -p 1883

## Install NodeJs
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

## Install node process manager
sudo npm install pm2@latest -g

## Install and Configure aws-connector
git clone https://github.com/PedroArs99/smart-home.git
cd smart-home/aws-connector

## Build aws-connector
npm install
npm run build --prod

## TODO: Fetch .env from SST

pm2 start dist/main.js 


