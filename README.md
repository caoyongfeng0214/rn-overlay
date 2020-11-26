# rn-overlay | react-native-overlay

Overlay component for React Native, same as [Modal component](https://reactnative.dev/docs/modal). contains: [Overlay](https://github.com/caoyongfeng0214/rn-overlay#usage)(fixed View), [Toast](https://github.com/caoyongfeng0214/rn-overlay/wiki/Toast)(message), [Picker](https://github.com/caoyongfeng0214/rn-overlay/wiki/Picker)(select), DateTime, Dialog.

you can place it to anywhere, it will float in front of all views. it can be place to a Modal component and cover the Modal component.

Contact me: me@caoyongfeng.com

---

**Why create this package ?**

> * [Modal component](https://reactnative.dev/docs/modal) is not applicable in some scenarios.
> * Why some UI components need to reference native modules ? e.g. [Toast](https://reactnative.dev/docs/toastandroid)、[Picker](https://github.com/react-native-picker/picker) ......
> * Why are the development and experience of Android and iOS inconsistent ? e.g. [Picker](https://github.com/react-native-picker/picker) ......
> * I want to make some things easier and consistent.

---

Demo:

![react native overlay demo](https://user-images.githubusercontent.com/14923844/99891471-06c91700-2ca5-11eb-8573-10f15b954b02.gif)
![react native Toast demo](https://user-images.githubusercontent.com/14923844/99892158-fae15300-2cac-11eb-9f54-7c0736498e1c.gif)
![react native picker demo select](https://user-images.githubusercontent.com/14923844/100351944-37071180-3027-11eb-80ea-312228f480b2.gif)

[Demo Source Code](https://github.com/caoyongfeng0214/rn-overlay/wiki/Demo-Source-Code)

# TODOs

* ~~Toast~~ (done)
* Dialog
* ~~Picker~~ (done)
* DateTime

# Installation

`npm install rn-overlay --save`

import the `rn-overlay` package in the lauche file （`PROJECT/index.js`）

```js
// import rn-overlay in the first line, this will save some trouble.
import 'rn-overlay';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

# Usage

* **[Toast](https://github.com/caoyongfeng0214/rn-overlay/wiki/Toast)**
* **Dialog**
* **[Picker](https://github.com/caoyongfeng0214/rn-overlay/wiki/Picker)**
* **DateTime**

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

---
**Why not use prop `visible` to control the display status of Overlay ?**

> **Overlay** does not belong to any **Screen**. if allowed to do that, it will easily cause confusion.
---


You can also use it in js code:

```js
import React from 'react';
// the [ Overlay ] is rn-overlay
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
import { View, Button, Text, Overlay } from 'react-native';

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

![React Native Overlay - shown in multiple Screens](https://user-images.githubusercontent.com/14923844/99847015-5975d680-2bb2-11eb-83c0-2e48abbdf61e.gif)

---


# Props

### style
`Object`. The style of overlay. same as [View Component](https://reactnative.dev/docs/view) .

### visible
`Boolean`. Default display status of the Overlay. default value: `false`.

### onShow
`Function`. The `onShow` prop allows passing a function that will be called once the `Overlay` has been shown.

### onClose
`Function`. The `onClose` prop allows passing a function that will be called once the `Overlay` has been closed.

### enableBackPress
`Boolean`. if `true`, allow press Back Nav at bottom of Android. default value: `false`.

### scopeState
`Object`. state of the instance of the Overlay.


---


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

&emsp;&emsp;&emsp;&emsp;***enableBackPress:*** `Boolean`. if `true`, allow press Back Nav at bottom of Android. default value: `false`.


---


# Instance Methods

### show()

show the Overlay.

### close()

close the Overlay.

### apply()

use apply() to display the latest data. same as [forceUpdate()](https://reactjs.org/docs/react-component.html#forceupdate).

### setScopeState(updater, [callback])

change `scopeState`. is similar to [setState()](https://reactjs.org/docs/react-component.html#setstate)

