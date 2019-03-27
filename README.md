# flatten-vessel-data

> Signal K Node.js server plugin that make all rest data available as a flat list of keys.


## Installation

Install using the App Store or run `npm install flatten-vessel-data` in the directory of your Signal K server.


## Usage

This plugin provides a few new routes on your Signal K server:

- `/signalk/v1/flat/self/keys` => A list of all Signal K paths for the local vessel
- `/signalk/v1/flat/root/keys` => A list of all Signal K paths in the entire data tree
- `/signalk/v1/flat/self` => Local vessel data, keyed by Signal K path
- `/signalk/v1/flat/root` => All tre data, keyed by Signal K path