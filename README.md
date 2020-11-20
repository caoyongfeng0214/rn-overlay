# rn-overlay | react-native-overlay

Overlay component for React Native, same as Modal component.

you can place it to anywhere, it will float in front of all views. it can be place to a Modal component and cover the Modal component.

Contact me: me@caoyongfeng.com

Demo:

![react-native-overlay demo](https://user-images.githubusercontent.com/14923844/99188648-ffcb7180-2797-11eb-91a3-4f5dd88eadf0.gif)

[Demo Source Code](https://github.com/caoyongfeng0214/rn-overlay/wiki/Demo-Source-Code)

# Installation

`npm install rn-overlay --save`

import the Overlay component in the lauche file （`PROJECT/index.js`）

```js
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// add follow line, import rn-overlay
import 'rn-overlay';

AppRegistry.registerComponent(appName, () => App);
```

# Usage

```js
import React from 'react';
// the Overlay is rn-overlay
import { View, Button, Overlay } from 'react-native';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    onOverlayShow() {
        console.log('Overlay shown');
    }

    onOverlayClose() {
        console.log('Overlay closed');
    }

    render() {
        return <View style={{paddingTop: 200}}>
            <Button title="Show a Overlay" onPress={() => this.overlay.show()}/>
            <Overlay
                // ref for the overlay
                ref={ele => this.overlay = ele}
                // callback function when the Overlay shown
                onShow={this.onOverlayShow}
                // callback function when the Overlay closed
                onClose={this.onOverlayClose}
                // style of the Overlay, same as View component
                style={{justifyContent:"center"}}>
                    <View style={{paddingVertical:80, backgroundColor:"white"}}>
                        <Button title="Close the Overlay" onPress={() => this.overlay.close()}/>
                    </View>
            </Overlay>
        </View>;
    }
}

export default App;
```

**Why not use prop `visible` to control the display status of Overlay ?**

> **Overlay** does not belong to any **Screen**. if allowed to do that, it will easily cause confusion.

You can also use it in js code:

```js
import React from 'react';
// the Overlay is rn-overlay
import { View, Button, Overlay } from 'react-native';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    onOverlayShowClick = () => {
        // Overlay.show() will create a instance of Overlay and show it.
        // if a Modal component is showing, the Overlay will cover the Modal component.
        let overlay = Overlay.show({
            // style of the Overlay
            style: {
                justifyContent: 'center'
            },
            // content of the Overlay
            children: <View style={{paddingVertical:80, backgroundColor:"white"}}>
                <Button title="Close the Overlay" onPress={() => { overlay.close(); }}/>
            </View>,
            // callback function when the Overlay shown
            onShow: () => {
                console.log('Overlay shown');
            },
            // callback function when the Overlay closed
            onClose: function() {
                console.log('Overlay closed');
                setTimeout(() => {
                    // the [ this ] is the instance of Overlay. this === overlay variable
                    this.show(); // show it again
                }, 3000);
            }
        });
    }

    render() {
        return <View style={{paddingTop: 200}}>
            <Button title="Show a Overlay" onPress={this.onOverlayShowClick}/>
        </View>;
    }
}

export default App;
```

if content of the Overlay contains dynamic data, then should pass a `function` to the `children` param.

```js
import React from 'react';
import { View, Button, Overlay } from 'react-native';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            n: 0
        };
    }

    onOverlayShowClick = () => {
        let overlay = Overlay.show({
            style: {
                justifyContent: 'center'
            },
            // pass a function to the children param
            children: () => <View style={{paddingVertical:80, backgroundColor:"white"}}>
                <Text style={{textAlign:"center"}}>{this.state.n}</Text>
                <Button title="Click Me" onPress={() => {
                    this.setState({ n: this.state.n + 1 });
                    // use apply() to display the latest data
                    overlay.apply();
                    }}/>
                <Button title="Close the Overlay" onPress={() => { overlay.close(); }}/>
            </View>,
            onShow: () => {
                console.log('Overlay shown');
            },
            onClose: function() {
                console.log('Overlay closed');
            }
        });
    }

    render() {
        return <View style={{paddingTop: 200}}>
            <Button title="Show a Overlay" onPress={this.onOverlayShowClick}/>
        </View>;
    }
}

export default App;
```

if the Overlay is shown in multiple **Screens**, the above code will not work properly. you can use `scopeState` to solve it.

```js
        Overlay.show({
            style: {
                justifyContent: 'center'
            },
            // scopeState: the state of the instance of Overlay
            scopeState: {
                n: 0
            },
            children: function(){
                return <View style={{paddingVertical:80, backgroundColor:"white"}}>
                    {/* this is using state of the instance of Overlay */}
                    {/* [ this ] === current instance of Overlay */}
                    <Text style={{textAlign:"center"}}>{this.scopeState.n}</Text>
                    <Button title="Click Me" onPress={() => {
                        // the usage of setScopeState() is similar to setState()
                        this.setScopeState({ n: this.scopeState.n + 1 });
                        }}/>
                    <Button title="Close the Overlay" onPress={() => { this.close(); }}/>
                </View>;
            },
            onShow: () => {
                console.log('Overlay shown');
            },
            onClose: function() {
                console.log('Overlay closed');
            }
        });
```

# Props

### style
`Object`. The style of overlay. same as [View Component](https://reactnative.dev/docs/view) .

### visible
`Boolean`. Default display status of the Overlay. default value: `false`.

### onShow
`Function`. The `onShow` prop allows passing a function that will be called once the `Overlay` has been shown.

### onClose
`Function`. The `onClose` prop allows passing a function that will be called once the `Overlay` has been closed.

# Static Methods

### show(options)
create a instance of Overlay and show it.

**params**

&emsp;&emsp;***options*** [ object ]

&emsp;&emsp;&emsp;&emsp;***style:*** `Object`. The style of overlay. same as [View Component](https://reactnative.dev/docs/view) .

&emsp;&emsp;&emsp;&emsp;***scopeState:*** `Object`. state of the instance of the Overlay.

&emsp;&emsp;&emsp;&emsp;***children:*** `Element` or `Function`. content of the Overlay.

&emsp;&emsp;&emsp;&emsp;***onShow:*** `Function`. The `onShow` prop allows passing a function that will be called once the `Overlay` has been shown.

&emsp;&emsp;&emsp;&emsp;***onClose:*** `Function`. The `onClose` prop allows passing a function that will be called once the `Overlay` has been closed.

# Instance Methods

### show()

show the Overlay.

### close()

close the Overlay.

### apply()

use apply() to display the latest data. same as [forceUpdate()](https://reactjs.org/docs/react-component.html#forceupdate).

### setScopeState(updater, [callback])

change `scopeState`. is similar to [setState()](https://reactjs.org/docs/react-component.html#setstate)

