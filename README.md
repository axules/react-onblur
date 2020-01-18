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

which puts in your component two extra props
```
setBlurListener: function (callbackOrOptions: Function(event) or Object[, once: Boolean])
```

```
unsetBlurListener: function ()
```

### **`setBlurListener`** should be called when you want add events to document.

* `callbackOrOptions`: Function or Object.
  * If it is *Function*, then it will be called (with event arg) once your component is unfocused or a user clicks outside of your component.
  * If it is *Object of options*, then it can contain there options:
    * `onBlur`: Function(event), required. It will be called once your component is unfocused or a user clicks outside of your component.
    * `once`: Boolean, optional. The same that second argument of this function.
    * `checkInOutside`: Function(domNode, isOutside): Boolean, optional. This function will be called always, when each of selected events are fired (e.g. when a user clicks on element on page or press key). It takes dom element target of an event  and a Boolean sign that this element is outside. It should return *Boolean* value as sign that this element is outside. If it returns true then `onBlur` will be called. More information in next part of this doc.
* `once`: Boolean. If true then `unsetBlurListener` will be called after `callback` once your component is unfocused or a user clicks outside of your component.

### **`unsetBlurListener`** should be called when your want to remove events from document.

(!!!) `unsetBlurListener` will be called in `componentWillUnmount` always.

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

      // or
      // if (isOpened) setBlurListener(this.onBlur, true);

      // or
      // if (isOpened) setBlurListener({ onBlur: this.onBlur, once: true })
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

## What is `checkInOutside`? And why you should use it?

If you use `ReactDOM.createPortal` then you can put element to another parent and it will not be child by DOM tree. But you can use `checkInOutside` to say about it to `react-onblur`.

```js
import React, { PureComponent } from "react";
import ReactDOM from 'react-dom';
import withOnBlur, { isDomElementChild } from "react-onblur";

class DemoPortalComponent extends PureComponent {
  state = {
    isOpened: false
  };

  domMenu = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    const { isOpened } = this.state;
    const { setBlurListener, unsetBlurListener } = this.props;
    if (isOpened && isOpened !== prevState.isOpened) {
      setBlurListener({
        checkInOutside: this.checkInOutside,
        onBlur: this.onBlur,
        once: true
      })
    }
  }

  onClickOpen = () => this.setState({ isOpened: true });

  onBlur = () => this.setState({ isOpened: false });

  checkInOutside = (element, isOutside) => (
    // if it is in outside then we should check that it is not in our list,
    // which was moved to body by createPortal
    // For it we can use `isDomElementChild(parent, node)` from `react-onblur`
    // and if element is child of list then it returns false.
    isOutside && !isDomElementChild(this.domMenu.current, element)
  );

  render() {
    return (
      <div>
        <button onClick={this.onClickOpen}>
          Open list
        </button>
        {this.state.isOpened && (
          ReactDom.createPortal(
            <ul ref={this.domMenu}>
              // ... list items
            </ul>,
            document.querySelector('body')
          )
        )}
      </div>
    );
  }
}

export default withOnBlur()(DemoPortalComponent);
```

## isDomElementChild

Check that `node` is child of `parent`.

```
isDomElementChild: Function(parent: DomNode, node: DomNode): Boolean
```

```js
import withOnBlur, { isDomElementChild } from "react-onblur";

isDomElementChild(document.querySelector('body'), document.querySelector('div'));
// true for <body><div>1</div></body>
```

## Demo GIF
![Alt Text](https://api.monosnap.com/rpc/file/download?id=lwfucbiDfpNR5lFegxxYpdH5WSnlfY)

## Demo video
https://monosnap.com/file/gUeMnlLBE29xKzytdXsxBcZOtkpEtm

## Example sandbox
https://codesandbox.io/embed/n9r236n2xl

## Live Demo
https://n9r236n2xl.codesandbox.io/