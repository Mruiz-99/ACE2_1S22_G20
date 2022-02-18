import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Base from './Components/Base';
import './App.css';
import TopMenu from './Components/TopMenu';
import Exp1 from './Components/Exp1';
import Exp2 from './Components/Exp2';
import Exp3 from './Components/Exp3';

export default class App extends Component {
  state = {
    location: 0
  }

  menuHandler = (new_location) => {
    this.setState({
      location: parseInt(new_location)
    });
  }

  renderContent(location){
    switch(location){
      case 0:
        // Main Menu for Experiment Select
        return <Base />;
      case 1:
      // Experiment 1
        return <Exp1 />;
      case 2:
      // Experiment 2
        return <Exp2 />;
      case 3:
      // Experiment 3
        return <Exp3 />;
      default:
          return <Base />;
    }
  }

  render(){
    return <div>
      <TopMenu menuHandler={this.menuHandler} />
      { this.renderContent(this.state["location"]) }
    </div>
  }
}
