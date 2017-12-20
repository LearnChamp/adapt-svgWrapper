# adapt-svgWrapper

This components loads svg-graphics. to improve experience for mobile users, you may have two versions of the same graphic. One for landscape orientation and one for portrait mode. 

With this component course creators can also animate svg's directly inside the [Adapt Authoring Tool](https://github.com/adaptlearning/adapt_authoring). 

![svgWrapper](https://github.com/LearnChamp/sharedAssets/blob/master/assets/adapt-svgWrapper.gif?raw=true)   

## Installation
To install the component with the [Adapt CLI](https://github.com/adaptlearning/adapt-cli), run the following from the command line:  
`adapt install adapt-svgWrapper`

Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
`"adapt-svgWrapper": "*"`  
Then running the command:  
`adapt install`  
(This second method will reinstall all plug-ins listed in *adapt.json*.)  

Use the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager) to use this component in the Adapt authoring tool.

## Settings Overview
A properly formatted JSON is available in *example.json*

## landscape and portrait images 
A landscape image is required.   
When a portrait image is available, this image is used when the device is in landscape orientation. You may have different animations for each orientaiton.

## SVG Aspect ratio  
Define the size of the svg-canvas by specifining the width and height of the svg-image. The svg-graphic is scaled to fit in the available space.   
`_width`   
`_height`   
The values for `_width` and `_heigth` will match the values defined in svg [viewBox attribute](http://tutorials.jenkov.com/svg/svg-viewport-view-box.html).   

## Initial State
The attributes from this setting are applied as soon as the svg content is loaded. This option is usually used to setup the initial state of the animation. 

#### selector 
A valid CSS-selector-string to select elments in the SVG graphic    
`#id, text, .class-name`   

#### properties 
Attributes map as json that is applied to the elements selected by the css-selector above.     

**Example:** Set opacity to 0 and transform the element. 
```json
"opacity": 0,
"transform": "t0,-50 s0.75"
```

## Animation States 
When a user clicks the button or the canvas, an animation is triggered. You can have as many animation states as needed. 

#### index
Start index of the animation state. Every click on button increments the index. You can have multiple state objects with the same index.    
**Index must start with 0 and musst be incremented by 1.**  

#### selector
CSS Selector as a string. See above.

#### animation
Attributes map as json-object.    
This object is passed to snaps [`Element.animate`](http://snapsvg.io/docs/#Element.animate) function. So you may use all attributes that can be animated by snap.svg.

#### duration 
Duration of the animation in milliseconds. 

#### delay (Optional)
Delay of the animation in milliseconds. 

#### easing 
Sets the easing funtion for the animation. Defaults to [linear](http://snapsvg.io/docs/#mina.linear). Available easing functions are: 
- linear
- easeout
- easein
- easeinout
- backin
- backout
- elastic
- bounce

## Button Text
Button text to trigger the animation. Each animation state can have a different buttton text. The index of this array should match the index of the animation states. For every state index change, the button text is updated.

If no button text is provided, the whole svg graphic acts as a button. 

## trigger on screen 
You may also trigger the initial animation when the svg-graphic scrolls into the viewport of the screen. 

### enable
`_isEnabled`   
Set to true to enable this feature.

### percentInviewVertical
`_percentInviewVertical`   
Controls what percentage of the component's height needs to be in the viewport to trigger the animation.

----------------------------
## snap.svg transform syntax 
This plugin uses [snap.svg](http://snapsvg.io/) to manipulate the svg content. so you can also use snap's transform syntax to transform the elements. 

`t100,50r45,s1.5`

| transform string | description |
|---|---|
| t100,50 | translate by 100 in x and 50 in y |
| r45 | rotate by 45° around the center of the element |
| r45,100,50 | rotate by 45° around the origin point x:100 and y:50 |
| s0.5 | scale by 0.5 across the center of the elemnt |
| s2,100,50 | scale by 2 across the origin point x:100 and y:50 |

----------------------------

## Limitations
**Caution!**   
This plugin extends from itemsModel. This model will be removed from Version 3.0.0 of the Framework. **Therefore this Version of the plugin is not compatible with Versions 3.0.0 of the Framework!** If you would like to use the plugin, you will need to include the itemsModel in the plugin directly.     
No accessibility support! 

----------------------------
**Author / maintainer:** [LearnChamp](https://github.com/LearnChamp)  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge 12, IE 11, Safari iOS 9+10, Safari OS X 9+10, Opera    