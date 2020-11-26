import React from 'react';
import { View, Text, Button, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing } from 'react-native';

let ReactNative = require("react-native");



// Fixed_....._Style    cannot be changed

const Fixed_Item_Style = {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    borderLeftWitdh: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    display: 'flex',
    position: 'absolute'
};

const Fixed_Container_Style = {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
};

const ItemsBox_Style = {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
};

const ContainerOuter_Style = {
    flexGrow: 1,
    flexShrink: 1,
    height: 200
};

const ScrollView_Style = {
    position:"absolute",
    left:0,
    top:0,
    right:0,
    bottom:0
};

const ContainerFrame_Style = {
    flexGrow:0, flexShrink:0
};

// min height of select option
const Item_Min_Height = 32;

const Angle = 22;
const AngleSin = Math.sin(Angle / 2 * Math.PI / 180);


// props:
//      inputStyle: style of input box. same as Text component. https://reactnative.dev/docs/text
//      placeholder: String. display the text when has not nothing be selected.
//      placeholderColor: placeholder color.
//      itemStyle: style of select option. same as View component. https://reactnative.dev/docs/view
//      itemTextStyle: style of option text. same as Text component. https://reactnative.dev/docs/text
//      containerStyle: style of container. same as View component. https://reactnative.dev/docs/view
//      headStyle: style of head. same as View component. https://reactnative.dev/docs/view
//      closeTextStyle: style of closeText. same as Text component. https://reactnative.dev/docs/text
//      confirmTextStyle: style of confirmText. same as Text component. https://reactnative.dev/docs/text
//      closeText: String.
//      confirmText: String.
//      focusBoxBorderColor: String(color). borderColor of container of current selected item
//      head: Component or function.
//      items: Array. item: { label: 'xxxxx', value: 9 }
//      onShow: function. callback funtion on shown
//      onClose: function. callback function on closed
//      onConfirm: function. fire when click confirm button
//      onChange: function. fire when value changed
class Picker extends React.Component {

    static defaultInputStyle = {
        textAlign: 'center',
        padding: 12,
        fontSize: 16,
        color: '#0865b7',
        borderWidth: 1,
        borderColor:'#dae2e4',
        backgroundColor:'#fafefe'
    };

    static defaultItemStyle = {
        height: 32,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    };

    static defaultItemTextStyle = {
        textAlign: 'center',
        fontSize: 15,
        color: '#f6fdb7'
    };

    static defaultContainerStyle = {
        backgroundColor: '#232831'
    };

    static defaultHeadStyle = {
        backgroundColor: '#16191f',
        paddingVertical: 12,
        flexDirection:"row",
        justifyContent:"space-between",
        borderWidth:1,
        borderColor:"#000",
        borderBottomWidth:0,
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
        paddingHorizontal: 5
    };

    static defaultFocusBoxBorderColor = '#0088dd55';

    static defaultCloseText = 'Close';

    static defaultConfirmText = 'Confirm';

    static defaultCloseTextStyle = {
        paddingHorizontal: 5,
        color: '#aaa',
        fontSize: 18
    };

    static defaultConfirmTextStyle = {
        paddingHorizontal: 5,
        color: '#00de1d',
        fontSize: 18
    };


    constructor(props) {
        super(props);
    }

    // style of input box
    get inputStyle() {
        return {...Picker.defaultInputStyle, ...(this.props.inputStyle || {})};
    }

    // display text in input
    get displayText() {
        if(this.props.items && this.props.value !== undefined) {
            let item = this.props.items.find(T => T.value === this.props.value);
            if(item) {
                return item.label;
            }
        }
        // if(this.props.placeholder) {
        //     return this.props.placeholder;
        // }
        return '';
    }

    // style of item option
    get itemStyle() {
        let sty = {...Picker.defaultItemStyle, ...(this.props.itemStyle || {}), ...Fixed_Item_Style};
        if(!sty.height || sty.height < Item_Min_Height) {
            sty.height = Item_Min_Height;
        }
        return sty;
    }

    // style of item text
    get itemTextStyle() {
        return {...Picker.defaultItemTextStyle, ...(this.props.itemTextStyle || {})};
    }

    // style of container
    get containerStyle() {
        let sty = {...Picker.defaultContainerStyle, ...(this.props.containerStyle || {}), ...Fixed_Container_Style};
        delete sty.height;
        return sty;
    }

    // style of head
    get headStyle() {
        return {...Picker.defaultHeadStyle, ...(this.props.headStyle || {})};
    }

    // focus-box borderColor. borderColor of container of current selected item
    get focusBoxBorderColor() {
        return this.props.focusBoxBorderColor || Picker.defaultFocusBoxBorderColor;
    }

    // close text
    get closeText() {
        return this.props.closeText || Picker.defaultCloseText;
    }

    // confirm text
    get confirmText() {
        return this.props.confirmText || Picker.defaultConfirmText;
    }

    // style of closeText
    get closeTextStyle() {
        return {...Picker.defaultCloseTextStyle, ...(this.props.closeTextStyle || {})};
    }

    // style of confirmText
    get confirmTextStyle() {
        return {...Picker.defaultConfirmTextStyle, ...(this.props.confirmTextStyle || {})};
    }

    show = () => {
        let _this = this;
        let itemStyle = _this.itemStyle, itemHeight = itemStyle.height,
            itemTextStyle = _this.itemTextStyle,
            containerStyle = _this.containerStyle,
            items = _this.props.items || [],
            itemsBoxHeight = 7 * itemHeight,
            circleR = Math.ceil(itemHeight / 2 / AngleSin), perspective = circleR * 5,
            scrollLen = itemsBoxHeight / 18 * items.length, scrollContentH = itemsBoxHeight + scrollLen,
            scrollStep = scrollLen / (items.length - 1);

        let selectedIdx = _this.props.value === undefined ? 0 : items.findIndex(T => T.value === _this.props.value),
            subAngle = 0, startIdx = 0, endIdx = 0;
        if(selectedIdx < 0) {
            selectedIdx = 0;
            endIdx = 3;
        } else {
            startIdx = selectedIdx - 3;
            if(startIdx < 0) {
                startIdx = 0;
            }
            endIdx = selectedIdx + 3;
        }
        _this.overlay = ReactNative.Overlay.show({
            style: { backgroundColor: 'rgba(188, 188, 188, 0.2)' },
            children: function() {
                return <>
                    <View style={ContainerOuter_Style}>
                        <TouchableWithoutFeedback style={{flex:1}} onPress={() => _this.close()}>
                            <View style={{flex:1}}></View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Animated.View style={ContainerFrame_Style, {transform:[{translateY:this.scopeState.fadeInY}]}}
                        onLayout={(e) => {
                            this.height = e.nativeEvent.layout.height;
                            this.scopeState.fadeInY.setValue(this.height);
                            Animated.timing(this.scopeState.fadeInY, {
                                toValue: 0,
                                easing: Easing.linear,
                                duration: 250,
                                useNativeDriver: true
                            }).start(() => {
                                if(_this.props.onShow && _this.props.onShow instanceof Function) {
                                    _this.props.onShow.apply(_this, []);
                                }
                            });
                            if(selectedIdx > 0 && this.scrollView) {
                                this.scrollView.scrollTo({y: scrollStep * selectedIdx, animated: false});
                            }
                        }}>
                        {
                            _this.props.head
                            &&
                            (
                                _this.props.head instanceof Function
                                &&
                                _this.props.head.apply(_this, [])
                                ||
                                _this.props.head
                            )
                            ||
                            <View style={_this.headStyle}>
                                <TouchableOpacity onPress={() => _this.close()}>
                                    <Text style={_this.closeTextStyle}>{_this.closeText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    _this.fireConfirm();
                                }}>
                                    <Text style={_this.confirmTextStyle}>{_this.confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={containerStyle}>
                            <View style={{...ItemsBox_Style, height: itemsBoxHeight}}>
                                {
                                    items.map((T, I) => (I >= this.scopeState.startIdx && I <= this.scopeState.endIdx) ? <Animated.View key={I} style={{...itemStyle, opacity: I == selectedIdx ? 1 : 0.55, transform: [
                                        { perspective: perspective },
                                        { rotateX: (I * -Angle + 90 + subAngle) + 'deg'},
                                        this.scopeState.rotateX,
                                        { translateY: circleR },
                                        { rotateX: '-90deg' }
        
                                    ]}}>
                                        {
                                            _this.props.item
                                            &&
                                            (
                                                _this.props.item instanceof Function
                                                &&
                                                _this.props.item.apply(_this, [T])
                                                ||
                                                _this.props.item
                                            )
                                            ||
                                            <Text style={itemTextStyle}>{T.label}</Text>
                                        }
                                    </Animated.View> : null)
                                }
                                <View style={{borderWidth:0.5, borderColor:_this.focusBoxBorderColor, borderLeftWidth:0, borderRightWidth:0, position:'absolute', width:'100%', height:itemHeight + 6, transform:[
                                    { perspective: perspective },
                                    { rotateX: '90deg'},
                                    { translateY: circleR },
                                    { rotateX: '-90deg' }
                                ]}}></View>
                            </View>    
                            <Animated.ScrollView ref={ele => !this.scrollView && (this.scrollView = ele)} style={ScrollView_Style} showsVerticalScrollIndicator={false}
                                onScroll={
                                    Animated.event([
                                        {
                                            nativeEvent: {
                                                contentOffset: {
                                                    y: this.scopeState.rv
                                                }
                                            }
                                        }
                                    ], {
                                        useNativeDriver: true,
                                        listener: (e) => {
                                            let n = parseInt(e.nativeEvent.contentOffset.y / scrollStep),
                                                lave = e.nativeEvent.contentOffset.y - n * scrollStep;
                                            if(lave >= scrollStep / 2) {
                                                n++;
                                            }
                                            startIdx = n - 3;
                                            endIdx = n + 3;
                                            selectedIdx = n;
                                            this.setScopeState({
                                                startIdx: startIdx,
                                                endIdx: endIdx
                                            });
                                        }
                                    })
                                }
                                onScrollEndDrag = {(e) => {
                                    let n = parseInt(e.nativeEvent.contentOffset.y / scrollStep),
                                        lave = e.nativeEvent.contentOffset.y - n * scrollStep;
                                    if(lave >= scrollStep / 2) {
                                        n++;
                                    }
                                    let _target = e.target;
                                    e.__detectEndTimer__ = setTimeout(() => {
                                        if(e.__detectEndTimer__) {
                                            _target.scrollTo({y:n * scrollStep, animated:false});
                                            if(_this.props.onChange && _this.props.onChange instanceof Function) {
                                                let selectedItem = items[n], selectedVal = undefined;
                                                if(selectedItem) {
                                                    selectedVal = selectedItem.value;
                                                }
                                                _this.props.onChange.apply(_this, [selectedVal, n, selectedItem]);
                                            }
                                        }
                                    }, 0);
                                }}
                                onMomentumScrollBegin = {(e) => {
                                    clearTimeout(e.nativeEvent.__detectEndTimer__);
                                    e.__detectEndTimer__ = undefined;
                                }}
                                onMomentumScrollEnd = {(e) => {
                                    let n = parseInt(e.nativeEvent.contentOffset.y / scrollStep),
                                        lave = e.nativeEvent.contentOffset.y - n * scrollStep;
                                    if(lave >= scrollStep / 2) {
                                        n++;
                                    }
                                    e.target.scrollTo({y:n * scrollStep, animated:false});
                                    if(_this.props.onChange && _this.props.onChange instanceof Function) {
                                        let selectedItem = items[n], selectedVal = undefined;
                                        if(selectedItem) {
                                            selectedVal = selectedItem.value;
                                        }
                                        _this.props.onChange.apply(_this, [selectedVal, n, selectedItem]);
                                    }
                                }}
                            >
                                <View style={{height: scrollContentH}}></View>
                            </Animated.ScrollView>
                        </View>
                    </Animated.View>
                </>;
            },
            onInit: function() {
                let _state = {
                    startIdx: startIdx,
                    endIdx: endIdx,
                    fadeInY: new Animated.Value(1000),
                    rv: new Animated.Value(0)
                };
        
                let xv = _state.rv.interpolate({
                    inputRange: [0, scrollLen],
                    outputRange: ['0deg', (Angle * (items.length - 1)) + 'deg']
                });
        
                _state.rotateX = {rotateX: xv};
        
                this.state = _state;
            },
            onClose: function() {
                if(_this.props.onClose && _this.props.onClose instanceof Function) {
                    _this.props.onClose.apply(_this, []);
                }
            }
        });
        _this.overlay.fireConfirm = () => {
            if(_this.props.onConfirm && _this.props.onConfirm instanceof Function) {
                let selectedItem = items[selectedIdx], selectedVal = undefined;
                if(selectedItem) {
                    selectedVal = selectedItem.value;
                }
                _this.props.onConfirm.apply(_this, [selectedVal, selectedIdx, selectedItem]);
            }
            _this.close();
        };
    }

    close = () => {
        if(this.overlay && this.overlay.height) {
            Animated.timing(this.overlay.scopeState.fadeInY, {
                toValue: this.overlay.height,
                easing: Easing.linear,
                duration: 220,
                useNativeDriver: true
            }).start(() => {
                this.overlay.close();
            });
        }
    }

    fireConfirm = () => {
        if(this.overlay) {
            this.overlay.fireConfirm();
        }
    }


    render() {
        let inputStyle = this.inputStyle,
            displayText = this.displayText;
        if(!displayText) {
            let textColor = this.props.placeholderColor;
            if(textColor) {
                inputStyle.color = textColor;
            }
            if(this.props.placeholder) {
                displayText = this.props.placeholder;
            }
        }

        return <>
            <TouchableOpacity onPress={this.show}>
                {
                    this.props.input
                    &&
                    (
                        this.props.input instanceof Function
                        &&
                        this.props.input.apply(this, [])
                        ||
                        this.props.input
                    )
                    ||
                    <Text style={inputStyle}>{displayText}</Text>
                }
            </TouchableOpacity>
        </>;
    }
}


module.exports = Picker;