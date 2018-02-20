# react-semantic-ui-range
This is a React Component range slider for Semantic UI

It is developed based on https://github.com/tyleryasaka/semantic-ui-range

The demo for the project can be found here: https://iozbeyli.github.io/react-semantic-ui-range/

The original library was using jQuery so I changed the parts that use jQuery to make it more compatible with React.

It is not fully developed yet and does not support all the functionalities that the original library provides.

Sample Usage

```javascript
import { Slider } from 'react-semantic-ui-range'
export default class App extends Component{
  render(){
    return (
      <div>
        <Slider color="red" inverted={false} settings={{
          start:2,
          min:0,
          max:10,
          step:1,
          onChange:function fa(params) {
            console.log(params);
          },
        }}/>
      </div>
    );
  }
}
```