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
// the Overlay is rn-overlay
import { View, Button, Overlay } from 'react-native';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayVisible: false // control visible of Overlay
        };
    }

    onOverlayShow() {
        console.log('Overlay shown');
    }

    onOverlayClose() {
        console.log('Overlay closed');
    }

    render() {
        return <View style={{paddingTop: 200}}>
            <Button title="Show a Overlay" onPress={() => this.setState({ overlayVisible: true })}/>
            <Overlay
                // visible or hide the Overlay
                visible={this.state.overlayVisible}
                // callback function when the Overlay shown
                onShow={this.onOverlayShow}
                // callback function when the Overlay closed
                onClose={this.onOverlayClose}
                // style of the Overlay, like View component
                style={{justifyContent:"center"}}>
                    <View style={{paddingVertical:80, backgroundColor:"white"}}>
                        <Button title="Close the Overlay" onPress={() => this.setState({ overlayVisible: false })}/>
                    </View>
            </Overlay>
        </View>;
    }
}

export default App;
```

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
        // Overlay.show() will create a instance of Overlay and show it
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

# Props

### style
`Object`. The style of overlay. like [View Component](https://reactnative.dev/docs/view)

### visible
`Boolean`. The `visible` prop determines whether your `Overlay` is visible. default value: `false`.

### onShow
`Function`. The `onShow` prop allows passing a function that will be called once the `Overlay` has been shown.

### onClose
`Function`. The `onClose` prop allows passing a function that will be called once the `Overlay` has been closed.
