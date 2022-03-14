import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Base from './Components/Base';
import './App.css';
import TopMenu from './Components/TopMenu';
import Humedad from './Components/Humedad';
import Suciedad_Pre from './Components/Suciedad_Pre';
import Suciedad_Post from './Components/Suciedad_Post';

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
        // DashBoard TODO
        return <Base />;
      case 1:
      // % de suciedad antes de filtrar
        return <Suciedad_Pre />;
      case 2:
      // % de humedad
        return <Humedad />
      case 3:
      // Cantidad de Agua TODO
        return <Humedad />
      case 4:
      // % de suciedad despues de filtrar
      return <Suciedad_Post />
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
