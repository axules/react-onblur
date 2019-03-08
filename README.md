# react-onblur
HOC for Blur (Unfocus) event handling of React component

## Installation

```
npm i --save react-onblur
```

## What is it?

It is simple HOC function

```javascript
import withOnBlur from "react-onblur";
// ...
export default withOnBlur(/* args */)(YourReactCompoenent);
```

which put in your component two extra props
```
setBlurListener: function (callback: function(event), once: bool)
```

```
unsetBlurListener: function ()
```

### `setBlurListener` should be called when you want add events to document.

* `callback` - function will be called (with event arg) once your component is unfocused or user will click outside of your component.
* `once` - bool, if true then `unsetBlurListener` will be called after `callback` once your component is unfocused or user will click outside of your component.

### `unsetBlurListener` should be called when your want to remove events from document.

`unsetBlurListener` will be called in `componentWillUnmount` always.

## How can you use it?

You should create new component:
```javascript
import React, { PureComponent } from "react";
import withOnBlur from "react-onblur";

class DemoComponent extends PureComponent {
  state = {
    isOpened: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { isOpened } = this.state;
    // `setBlurListener` and `unsetBlurListener` props were added by withOnBlur
    const { setBlurListener, unsetBlurListener } = this.props;
        
    if (isOpened !== prevState.isOpened) {

      // if our list was opened, then we will add listeners,
      if (isOpened) setBlurListener(this.onBlur);
      // else we will remove listeners
      else unsetBlurListener();

      //or just 
      // if (isOpened) setBlurListener(this.onBlur, true);
    }
  }

  onClickOpen = () => this.setState({ isOpened: true });
  onBlur = () => this.setState({ isOpened: false });

  render() {
    return (
      <div>
        <button onClick={this.onClickOpen}>
          Open list
        </button>
        {this.state.isOpened && (
          <ul>
            // ... list items
          </ul>
        )}
      </div>
    );
  }
}

export default withOnBlur({ debug: true })(DemoComponent);
```

Next, you can use this component in your App:
```javascript
  function App() {
    return (
      <div className="App">
        <div>
          <button>Outside button</button>
        </div>
        <DemoComponent />
        <div>
          <button>Second outside button</button>
        </div>
      </div>
    );
  }
```

## HOC function arguments
| args  | type | default | description |
| - | - | - | - |
| `listenClick` | bool | true | when `true` will add `mousedown` event for document
| `listenTab` | bool | true | when `true` will add `keyup` and `keydown` listeners for document to check Tab key press
| `listenEsc` | bool | true | when `true` will add `keydown` event for document to check Esc key is pressed
| `debug` | bool | false | when `true` will write debug messages to console
| `autoUnset` | bool | false | if `true` then `unsetBlurListener` will be called after callback action call once your component is unfocused or user will click outside of your component 

### Example
```javascript
import withOnBlur from "react-onblur";
// ...
export default withOnBlur({
  listenClick: true,
  listenTab: false,
  debug: true,
  autoUnset: true
})(YourReactCompoenent);
```

## Demo GIF
![Alt Text](https://api.monosnap.com/rpc/file/download?id=lwfucbiDfpNR5lFegxxYpdH5WSnlfY)

## Demo video
https://monosnap.com/file/gUeMnlLBE29xKzytdXsxBcZOtkpEtm

## Example sandbox
https://codesandbox.io/embed/n9r236n2xl

## Live Demo
https://n9r236n2xl.codesandbox.io/