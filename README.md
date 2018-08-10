# react-onblur
HOC for Blur (Unfocus) event handling of React component

## What is it?

It is just HOC function

```javascript
import withOnBlur from "react-onblur";
// ...
export default withOnBlur(/* args */)(YourReactCompoenent);
```

which put in your component two extra props
```
setBlurListener: function (callback: function(event))
```

```
unsetBlurListener: function ()
```

`setBlurListener` should be called when you want add events to document.

`callback` function will be called (with event arg) once your component is unfocused or user clicked outside your component.

`unsetBlurListener` should be called when your want to remove events from document.

`unsetBlurListener` will be called always in `componentWillUnmount`.

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
    }
  }

  onClickOpen = () => this.setState({ isOpened: true });
  // if component was unfocused then we will close list
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
| `ifClick` | bool | true | when `true` will add `click` event for document
| `ifKeyUpDown` | bool | true | when `true` will add `keyup` and `keydown` events for document
| `debug` | bool | false | when `true` will write debug messages to console

### Example
```javascript
import withOnBlur from "react-onblur";
// ...
export default withOnBlur({
  ifClick: true,
  ifKeyUpDown: false,
  debug: true
})(YourReactCompoenent);
```

## Demo GIF
![Alt Text](https://api.monosnap.com/rpc/file/download?id=lwfucbiDfpNR5lFegxxYpdH5WSnlfY)

## Demo video
https://monosnap.com/file/gUeMnlLBE29xKzytdXsxBcZOtkpEtm

# Example sandbox
https://codesandbox.io/embed/n9r236n2xl

