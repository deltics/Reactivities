import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import {Header, Icon, List, ListItem} from "semantic-ui-react";

class App extends Component {
  
  state = {
      values: []
  }
  
  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
        .then((response) => {
          this.setState({
            values: response.data
          })
        })
  }
    

  render() {
    return (
        <div className="App">
            <Header as='h2'>
                <Icon name='users' />
                <Header.Content>Reactivities</Header.Content>
            </Header>

            <List>
              {this.state.values.map((value: any) => (
                  <ListItem key={value.id}>{value.name}</ListItem>
              ))}
            </List>
            
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
        </div>
    )
  }
}

export default App;
