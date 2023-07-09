#!/bin/bash

args="--silent"

for arg in "$@"
do
  args+=" $arg"
done

rootDir=$(pwd)
for dir in lambda webapp
do
  cd ${rootDir}/${dir}
  npm install || true
  jest ${args}
  cd ${rootDir}
done