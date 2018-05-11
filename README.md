# react-semantic-ui-range
This is a React Component range slider for Semantic UI

It is developed based on https://github.com/tyleryasaka/semantic-ui-range

The demo for the project can be found here: https://iozbeyli.github.io/react-semantic-ui-range/

The original library was using jQuery so I changed the parts that use jQuery to make it more compatible with React.

It is not fully developed yet and does not support all the functionalities that the original library provides.

```
  npm i react-semantic-ui-range
```

Sample Usage

```javascript
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'react-semantic-ui-range'
import 'semantic-ui-css/semantic.min.css';
import {Segment,Grid,Label,Input} from 'semantic-ui-react';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      value1: 4,
      value: 0
    }
  }

  handleValueChange(e, {value}){
    this.setState({
      value: value
    })
  }

  render(){
    const settings = {
      start:2,
      min:0,
      max:10,
      step:1,
    }
    return (
      <Grid padded>
        <Grid.Column width={16}>
          <Segment>
            <h1>Discrete</h1>
            <p>
              <Slider discrete color="red" inverted={false} settings={settings}/>
            </p>
          </Segment>
        </Grid.Column>
        <Grid.Column width={16}>
          <Segment>
           <h1>Callback!</h1>
            <p>
              <Slider color="red" inverted={false}
                settings={{
                start: this.state.value1,
                min:0,
                max:10,
                step:1,
                onChange: (value) => {
                  this.setState({
                    value1:value
                  })
                }
              }}/>
            </p>
            <Label color="red">{this.state.value1}</Label>
          </Segment>
        </Grid.Column>
        <Grid.Column width={16}>
          <Segment>
            <h1>Disabled!</h1>
            <p>
              <Slider color="red" disabled inverted={false} settings={{
                start: this.state.value1,
                min:0,
                max:10,
                step:1,
                onChange: (value) => {
                  this.setState({
                    value1:value
                  })
                },
              }}/>
            </p>
          </Segment>
        </Grid.Column>
        <Grid.Column width={16}>
        <Segment>
          <h1>Controlled</h1>
          <p>
              <Slider value={this.state.value} color="red" inverted={false} settings={settings}/>
            </p>
            <Input placeholder="Enter Value" onChange={this.handleValueChange.bind(this)}/>
        </Segment>
      </Grid.Column>
      <Grid.Column width={16}>
        <Segment>
          <h1>Custom Style</h1>
          <p>
              <Slider style={{width:"50%"}} color="red" inverted={false} settings={settings}/>
            </p>
        </Segment>
      </Grid.Column>
        <Grid.Column width={16}>
          <Segment>
            <h1>Colors!</h1>
            <p>
              <Slider color="red" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="orange" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="yellow" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="olive" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="green" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="teal" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="blue" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="violet" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="purple" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="pink" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="brown" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="grey" inverted={false} settings={settings}/>
            </p>
            <p>
              <Slider color="black" inverted={false} settings={settings}/>
            </p>
          </Segment>
        </Grid.Column>
        <Grid.Column width={16}>
          <Segment inverted>
            <h1>Inverted Colors!</h1>
            <p>
              <Slider color="red" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="orange" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="yellow" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="olive" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="green" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="teal" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="blue" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="violet" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="purple" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="pink" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="brown" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="grey" inverted={true} settings={settings}/>
            </p>
            <p>
              <Slider color="black" inverted={true} settings={settings}/>
            </p>
          </Segment>
        </Grid.Column>
      </Grid>
      
    );
  }
  
}


```