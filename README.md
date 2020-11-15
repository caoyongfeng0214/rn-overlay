# rn-overlay | react-native-overlay

Overlay component for React Native, like Modal component.

you can place it to anywhere, it will float in front of all views.

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
import { View, Button, Overlay } from 'react-native';


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          overlayVisible: false
        }
    }

    btnClick = () => {
      this.setState({
        overlayVisible: true
      });
    }

    btnHideClick = () => {
      this.setState({
        overlayVisible: false
      });
    }
    
    onOverlayShow = () => {
      console.log('Overlay shown');
    }
    
    onOverlayClose = () => {
      console.log('Overlay closed');
    }

    render() {
        return (
            <View style={{paddingVertical:100}}>
              <Button title="Show Overlay" onPress={this.btnClick}/>
              <Overlay onShow={this.onOverlayShow} onClose={this.onOverlayClose} visible={this.state.overlayVisible} style={{paddingTop:280}}>
                <View style={{backgroundColor:"white"}}>
                  <Button title="Hide Overlay" onPress={this.btnHideClick}/>
                </View>
              </Overlay>
            </View>
        );
    }
};

export default App;
```

You can also use it in js code:


# Props

### style
`Object`. The style of overlay. like [View Component](https://reactnative.dev/docs/view)

### visible
`Boolean`. The `visible` prop determines whether your `Overlay` is visible. default value: `false`.

### onShow
`Function`. The `onShow` prop allows passing a function that will be called once the `Overlay` has been shown.

### onClose
`Function`. The `onClose` prop allows passing a function that will be called once the `Overlay` has been closed.
