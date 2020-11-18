import { View, ScrollView, Modal, AppRegistry, I18nManager, StyleSheet, Platform } from 'react-native';
import RCTModalHostView from '../react-native/Libraries/Modal/RCTModalHostViewNativeComponent';
const AppContainer = require('../react-native/Libraries/ReactNative/AppContainer');

let React;
let ReactNative = require("react-native");

try { React = require("react"); } catch (e) { }
if (!React) {
    try { React = ReactNative.React; } catch (e) { }
    if (!React) {
        throw new Error("Unable to find the 'React' module.");
    }
}


if(!ReactNative.Overlay) {

    // props:
    //      visible: Boolean, 
    //      style: Object, style of Overlay, same as View
    //      onShow: Function, callback function be fire when Overlay shown
    //      onClose: Function,  callback funtion be fire where Overlay closed
    ReactNative.Overlay = class extends React.Component {
        static contextType = ScrollView.Context;

        static INDEX = 0; // for generate OverlayName

        // show a Overlay
        static show = function({ style, children, onShow, onClose }) {
            let overlay = new ReactNative.Overlay({ style, children, onShow, onClose, __noOwner__: true });
            overlay.componentDidMount();
            overlay.show();
            return overlay;
        };

      
        constructor(props) {
            super(props);

            let _name = '_overlay_' + (++ReactNative.Overlay.INDEX);
            Object.defineProperty(this, '$Name', { get: function() {return _name;} });

            let _visible = false;
            Object.defineProperty(this, 'visible', {
                get: function() { return _visible; },
                set: function(val) {
                    let old = _visible;
                    _visible = val;
                    this.$Father.addOrUpdateOverlay(this);
                    if(this.props.onClose) {
                        if(old && !val) {
                            this.props.onClose.apply(this, []);
                        }
                    }
                    if(this.props.onShow) {
                        if(!old && val) {
                            this.props.onShow.apply(this, []);
                        }
                    }
                }
            });
        }
      
        get $View() {
            let sty = {backgroundColor: 'rgba(88, 88, 88, 0.6)', ...(this.props.style || {})};
            // if not defined STYLE, or defined POSITON(left|right|top|bottom), then use default value({left:0, right:0, top:0, bottom:0})
            if(!this.props.style
                || (this.props.style.left === undefined && this.props.style.right === undefined && this.props.style.top === undefined && this.props.style.bottom === undefined)) {
                sty.left = sty.right = sty.top = sty.bottom = 0;
            }
            // style.position MUST is 'absolute'
            sty.position = 'absolute';
            sty.zIndex = 999999999;

            return <View key={this.$Name} style={sty}>{this.props.children}</View>;
        }
      
        componentDidMount() {
            let father = React.APPCMP;
            if(this.context && this.context.$MODAL) {
                father = this.context.$MODAL;
                // let onDismiss = father.onDismiss;
                // let _this = this;
                // father.onDismiss = function() {
                //     _this.close();
                //     if(onDismiss) {
                //         onDismiss.apply(father, arguments);
                //     }
                // };
            }
            Object.defineProperty(this, '$Father', {
                get: function() {
                    return this.props.__noOwner__ === true ? (Modals[0] || React.APPCMP) : father;
                }
            });
            this.visible = !!this.props.visible;
        }
      
        componentDidUpdate() {
            this.visible = !!this.props.visible;
        }

        close() {
            this.visible = false;
        }

        show() {
            this.visible = true;
        }
      
      
        render() {
            return <></>;
        }
      
    }



    // use OverlayContainer to display OverlayList
    class OverlayContainer extends React.Component {
        constructor(props) {
            super(props);
      
            this.state = {
                childKeys: [] // [ OverlayName.... ]
            };
      
            this.childs = {}; // Overlay instances
        }
      
        addOrUpdateChild(overlay) {
            this.setState((state) => {
                let idx = state.childKeys.indexOf(overlay.$Name);
                if(overlay.visible) {
                    if(idx < 0) {
                        state.childKeys.push(overlay.$Name);
                    }
                    this.childs[overlay.$Name] = overlay;
                } else {
                    if(idx >= 0) {
                        state.childKeys.splice(idx, 1);
                        delete this.childs[overlay.$Name];
                    }
                }
                
                return state;
            });
        }
      
        render() {
            return <>
                {
                    this.state.childKeys.map(K => this.childs[K].$View)
                }
            </>;
        }
    }



    // re-write AppRegistry.registerComponent
    let _registerComponent = AppRegistry.registerComponent;
    AppRegistry.registerComponent = function(appKey, componentProvider) {
        let Cmp = componentProvider();

        let newCmp = class extends React.Component {
            constructor(props) {
              super(props);
              
              React.APPCMP = this;
            }
        
            addOrUpdateOverlay(overlay) {
                if(this.overlayContainer) {
                    this.overlayContainer.addOrUpdateChild(overlay);
                }
            }
        
            render() {
                return <>
                    {
                        Platform.OS === 'ios'
                        &&
                        <OverlayContainer ref={ele => this.overlayContainer = ele}/>
                    }
                    <Cmp/>
                    { // on Android, [ zIndex ] behaves strangely. OverlayContainer must be place to last 
                        Platform.OS === 'android'
                        &&
                        <OverlayContainer ref={ele => this.overlayContainer = ele}/>
                    }
                </>;
            }
        };
        
        // replace Start-Component
        arguments[1] = () => newCmp;
        _registerComponent.apply(this, arguments);
    };


    let Modals = [];

    let newModal = function(modal) {
        let idx = Modals.findIndex((T) => T == modal);
        if(idx < 0) {
            Modals.push(modal);
        }
    };

    let delModal = function(modal) {
        let idx = Modals.findIndex((T) => T == modal);
        if(idx >= 0) {
            Modals.splice(idx, 1);
        }
    };


    // add Function addOrUpdateOverlay to Modal
    // Add Or Update a Overlay
    Modal.prototype.addOrUpdateOverlay = function(overlay) {
        this.overlayContainer.addOrUpdateChild(overlay);
    };


    // fixed a issue of Modal => props.onDismiss can not fire
    // issue: https://github.com/facebook/react-native/issues/29319
    let _modalComponentDidUpdate = Modal.prototype.componentDidMount;
    Modal.prototype.componentDidUpdate = function(prevProps) {
        if(!!!this.props.visible && !!prevProps.visible && this.props.onDismiss) {
            if(this.props.onDismiss) {
                this.props.onDismiss.apply(this, []);
            }
        }
        if(_modalComponentDidUpdate) {
            _modalComponentDidUpdate.apply(this, arguments);
        }
    };

    // re-write Modal's render()
    Modal.prototype.render = function() {
        if (this.props.visible !== true) {
            delModal(this);
            return null;
        } else {
            newModal(this);
        }
      
        const containerStyles = {
            backgroundColor: this.props.transparent ? 'transparent' : 'white',
        };
    
        let animationType = this.props.animationType || 'none';
    
        let presentationStyle = this.props.presentationStyle;
        if (!presentationStyle) {
            presentationStyle = 'fullScreen';
            if (this.props.transparent) {
                presentationStyle = 'overFullScreen';
            }
        }
      
        const innerChildren = __DEV__ ? (
            <AppContainer rootTag={this.context.rootTag}>
                {this.props.children}
            </AppContainer>
        ) : (
            this.props.children
        );
      
        return (
            <RCTModalHostView
                animationType={animationType}
                presentationStyle={presentationStyle}
                transparent={this.props.transparent}
                hardwareAccelerated={this.props.hardwareAccelerated}
                onRequestClose={this.props.onRequestClose}
                onShow={this.props.onShow}
                statusBarTranslucent={this.props.statusBarTranslucent}
                identifier={this._identifier}
                style={styles.modal}
                onStartShouldSetResponder={this._shouldSetResponder}
                supportedOrientations={this.props.supportedOrientations}
                onOrientationChange={this.props.onOrientationChange}>
                <View>
                    <OverlayContainer ref={ele => this.overlayContainer = ele}/>
                    <ScrollView.Context.Provider value={{$MODAL: this}}>
                        <View style={[styles.container, containerStyles]}>
                            {innerChildren}
                        </View>
                    </ScrollView.Context.Provider>
                </View>
            </RCTModalHostView>
        );
    };


    const side = I18nManager.getConstants().isRTL ? 'right' : 'left';
    const styles = StyleSheet.create({
        modal: {
            position: 'absolute',
        },
        container: {
            /* $FlowFixMe(>=0.111.0 site=react_native_fb) This comment suppresses an
            * error found when Flow v0.111 was deployed. To see the error, delete this
            * comment and run Flow.  */
            [side]: 0,
            top: 0,
            flex: 1,
        }
    });

}


module.exports = ReactNative.Overlay;