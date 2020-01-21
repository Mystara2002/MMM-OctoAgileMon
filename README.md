# MMM-OctoMon

"Octopus Monitor", displays energy usage history for your Octopus Energy account. Unofficial!

## Example

![screenshot](screenshot.jpg)

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* An electricity and/or gas supply account with Octopus Energy

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory, to create `~/MagicMirror/modules/MMM-OctoMon`.
1. Add OctoMon configuration into `~/MagicMirror/config/config.js`:

```
	{
		module: 'MMM-OctoMon',
		position: 'bottom_right',
		header: '<img src="modules/MMM-OctoMon/public/octobw.jpg" style="width:20px;vertical-align:bottom;"/> Octopus Energy',
		config: {
				elecApiUrl: 'https://api.octopus.energy/v1/electricity-meter-points/[ELECTRIC-MPAN]/meters/[METER_SERIAL]/consumption/?group_by=day',
				gasApiUrl: 'https://api.octopus.energy/v1/gas-meter-points/[GAS-MPRN]/meters/[GAS-SERIAL]/consumption/?group_by=day',
				api_key: '[YOUR-API-KEY]',
				displayDays: 7,
				elecMedium: 10,
				elecHigh: 20,
				gasMedium: 0.5,
				gasHigh: 1,
				decimalPlaces: 1,
				showUpdateTime: true;
				updateInterval: 60000*60,
				retryDelay: 5000,
				animationSpeed: 2000,
		}
	},
```

1. Obtain your API key from the Octopus Energy website, by signing into your account, then click 'Menu' -> 'My Account' -> 'Account Information'. Scroll to bottom of page and click 'API Access'. This page will also provide you with the electricity meter's MPAN and Serial numbers, and the gas meter's MPRN and Serial numbers, which need to be replaced above.

## Configuration options

The following config.js properties can be configured.

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| 'header' | 'octobw.jpg' | other graphics available in the 'public' directory, or just remove it |
| 'displayDays' | '7' | The number of days of historical energy usage to display |
| 'elecMedium' | '10' | kWh values over this amount will be displayed in Orange |
| 'elecHigh' | '20' | kWh values over this amount will be displayed in Red |
| 'gasMedium' | '0.5' | kWh values over this amount will be displayed in Orange |
| 'gasHigh' | '1' | kWh values over this amount will be displayed in Red |
| 'decimalPlaces' | '1' | round all kWh values to this number of decimal places |
| 'showUpdateTime' | 'true' | true or false, to display the time the energy usage figures were last updated |
| 'updateInterval' | '60000\*60' | delay between refresing energy usage via the API, in milliseconds (1 hour, or 60 * 60 seconds) |
| 'retryDelay' | '5000' | kWh values over this amount will be displayed in Red |
| 'animationSpeed' | '2000' | fade in/out speed in milliseconds (2 seconds) |

## Additional customisation

See comments in the main source code for a couple of other things that could be changed.

## Disclaimer

This module has been hacked together very quickly! I've taken a bunch of shortcuts, such as inserting HTML and CSS inline styles, when there's probably a more elegant way to accomplish things. Recommendations for changes welcome! It's completely unofficial, but it is using the Octopus Energy (https://developer.octopus.energy) publicly available customer API, so as far as I'm concerned, that's permission enough. Supplied AS-IS. No warranties expressed or implied. Blah bla-blah. It works on my machine!