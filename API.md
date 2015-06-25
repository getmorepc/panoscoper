# Panoscoper v0.2 #

There are two sets of controls for the panoscoper plugin. The first array is for the panorama settings, layout and movement. The second are for the navigational elements and other features. All settings are optional.

An example of use would be $('#element').panoscope({ cursors:false },{ enabled:false });

# API #

## Panorama Settings ##

  * **cursors:**
    * Sets cursor to left and right arrow when moving
    * True/False, default is true
  * **debug:**
    * Shows the current offset of the elements for setting bearing and direction
    * True/False, default is false
  * **width:**
    * Sets the width of the panoscoper box
    * Integer, default is 4:3 ratio of element height
  * **height:**
    * Sets the height of the panoscoper box
    * Integer, default is calculated height of the element
  * **direction:**
    * Sets the starting direction of the panorama, turn on debug for correct directional value
    * Integer, default is 0
  * **momentum:**
    * Sets the speed of motion, lower is faster
    * Numeric, default is 80

## Compass/Navigational Settings ##

  * **enabled:**
    * Turn off the compass
    * true/false, default is false
  * **url:**
    * Set the URL of the compass image
    * String, default is 'compass.png'
  * **width:**
    * Sets the width of the compass image
    * Integer, default is 100
  * **height:**
    * Sets the Height of the compass image
    * Integer, default is 100
  * **bearing:**
    * Sets the direction of north, check the debug panel for correct directional value
    * Integer, default is 0