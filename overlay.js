import { View, ScrollView, Modal, BackHandler, Platform, AppRegistry, I18nManager, StyleSheet } from 'react-native';
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
    //      visible: Boolean, Default display status of the Overlay. default value: false.
    //      style: Object, style of Overlay, same as View
    //      onShow: Function, callback function be fire when Overlay shown
    //      onClose: Function,  callback funtion be fire where Overlay closed
    //      enableBackPress: Boolean, if true, allow press Back Nav at bottom of Android. default value: false
    ReactNative.Overlay = class extends React.Component {
        static contextType = ScrollView.Context;

        static INDEX = 0; // for generate OverlayName

        // show a Overlay
        static show = function({ style, scopeState, children, onShow, onClose, enableBackPress, onInit, data }) {
            let overlay = new ReactNative.Overlay({ style, scopeState, children, onShow, onClose, enableBackPress, onInit, data, __noOwner__: true });
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
                    if(val) {
                        this.disableBackPress();
                    } else {
                        this.removeDisableBackPress();
                    }

                    // fire onClose | onShow be moved to OverlayItem.componentDidMount | OverlayItem.componentWillUnmount
                    // if(this.props.onClose) {
                    //     if(old && !val) {
                    //         this.props.onClose.apply(this, []);
                    //     }
                    // }
                    // if(this.props.onShow) {
                    //     if(!old && val) {
                    //         this.props.onShow.apply(this, []);
                    //     }
                    // }
                }
            });

            let _hardwareBackPressHandler = undefined;

            // disable BackPress
            this.disableBackPress = () => {
                if(this.props.enableBackPress !== true && !_hardwareBackPressHandler) {
                    _hardwareBackPressHandler = BackHandler.addEventListener("hardwareBackPress", () => {
                        return true;
                    });
                }
            };

            // remove disable BackPress
            this.removeDisableBackPress = () => {
                if(_hardwareBackPressHandler) {
                    _hardwareBackPressHandler.remove();
                    _hardwareBackPressHandler = undefined;
                }
            };
        }

        get scopeState() {
            if(this._overlayItem) {
                return this._overlayItem.state;
            }
            return {};
        }

        setScopeState(a, b) {
            if(this._overlayItem) {
                this._overlayItem.setState(a, b);
            }
            return this;
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
            this.visible = this.visible;
        }

        close() {
            this.visible = false;
        }

        show() {
            this.visible = true;
        }

        apply() {
            this.visible = this.visible;
        }
      
      
        render() {
            return <></>;
        }
      
    }


    // this is really displayed
    class OverlayItem extends React.Component {
        constructor(props) {
            super(props);

            if(props.overlay) {
                props.overlay._overlayItem = this;
            }

            this.state = props.scopeState ? {...props.scopeState} : {};

            if(props.onInit && props.onInit instanceof Function) {
                props.onInit.apply(this, []);
            }
        }

        componentDidMount() {
            if(this.props.overlay && this.props.overlay.props.onShow) {
                this.props.overlay.props.onShow.apply(this.props.overlay, []);
            }
        }

        componentWillUnmount() {
            if(this.props.overlay && this.props.overlay.props.onClose) {
                this.props.overlay.props.onClose.apply(this.props.overlay, []);
            }
        }

        render() {
            let sty = {backgroundColor: 'rgba(88, 88, 88, 0.5)', ...(this.props.style || {})};
            // if not defined STYLE, or defined POSITON(left|right|top|bottom), or defined size(width|height), then use default value({left:0, right:0, top:0, bottom:0})
            if(!this.props.style) {
                sty.left = sty.right = sty.top = sty.bottom = 0;
            } else {
                if(this.props.style.width === undefined && this.props.style.left === undefined && this.props.style.right === undefined) {
                    sty.left = sty.right = 0;
                }
                if(this.props.style.height === undefined && this.props.style.top === undefined && this.props.style.bottom === undefined) {
                    sty.top = sty.bottom = 0;
                }
            }
            // style.position MUST is 'absolute'
            sty.position = 'absolute';
            sty.zIndex = sty.elevation = 999999999;
            // style.overflow MUST is 'hidden'
            sty.overflow = 'hidden';

            return <View key={this.$Name} style={sty}>
                {this.props.children instanceof Function ? this.props.children.apply(this.props.overlay, []) : this.props.children}
            </View>;
        }

    }



    // use OverlayContainer to display OverlayList
    class OverlayContainer extends React.Component {
        constructor(props) {
            super(props);
      
            this.state = {
                childKeys: [] // [ OverlayName.... ]
            };

            this.childs = {};
        }
      
        addOrUpdateChild(overlay) {
            this.setState((state) => {
                let idx = state.childKeys.indexOf(overlay.$Name);
                if(overlay.visible) {
                    if(idx < 0) {
                        state.childKeys.push(overlay.$Name);
                        this.childs[overlay.$Name] = overlay;
                    }
                    
                } else {
                    if(idx >= 0) {
                        state.childKeys.splice(idx, 1);
                        delete this.childs[overlay.$Name];
                    }
                }
                
                return state;
            });
        }

        clear() {
            let ks = this.state.childKeys.map((K) => K);
            // this.setState((state) => {
            //     state.childKeys.splice(0, state.childKeys.length);
            // });
            ks.forEach((K) => {
                if(this.childs[K]) {
                    this.childs[K].close();
                }
            });
        }
      
        render() {
            return <>
                {
                    this.state.childKeys.map(K => {
                        let overlay = this.childs[K];
                        if(overlay) {
                            return <OverlayItem
                                key={overlay.$Name}
                                name={overlay.$Name}
                                scopeState={overlay.props.scopeState}
                                onInit={overlay.props.onInit}
                                style={overlay.props.style}
                                children={overlay.props.children}
                                overlay={overlay}
                                ></OverlayItem>;
                        }
                        return null;
                    })
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
            let overlayContainer = modal.overlayContainer || modal._overlayContainer;
            // remove all hardwareBackPress handler
            if(overlayContainer) {
                let ks = Object.keys(overlayContainer.childs);
                ks.forEach((K) => {
                    overlayContainer.childs[K].removeDisableBackPress();
                });

                // overlayContainer.clear();
            }
        }
    };


    // add Function addOrUpdateOverlay to Modal
    // Add Or Update a Overlay
    Modal.prototype.addOrUpdateOverlay = function(overlay) {
        (this.overlayContainer || this._overlayContainer).addOrUpdateChild(overlay);
    };


    // fixed a issue of Modal => props.onDismiss can not fire
    // issue: https://github.com/facebook/react-native/issues/29319
    let _modalComponentDidUpdate = Modal.prototype.componentDidMount;
    Modal.prototype.componentDidUpdate = function(prevProps) {
        if (this.props.visible !== true) {
            delModal(this);
        } else {
            newModal(this);
        }
        this._overlayContainer = this.overlayContainer;
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
            // delModal(this);
            return null;
        } else {
            // newModal(this);
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