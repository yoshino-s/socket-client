#!/bin/sh

yarn && yarn build

cd front && yarn && yarn build && cd -

mkdir build && cd build
cp ../dist ./dist -r
cp ../front/dist ./static -r
cp ../package.json .
mkdir upload

NAME=$(cat package.json | jq .name -r)

tar -cvf $NAME.tar ./*

pkg -t node12-linux . -o 

cp $NAME.tar $NAME ../

cd -