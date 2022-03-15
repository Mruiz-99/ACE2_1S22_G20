import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Base from './Components/Base';
import './App.css';
import TopMenu from './Components/TopMenu';
import Humedad from './Components/Humedad';
import NivelAgua from './Components/NivelAgua';
import Suciedad_Pre from './Components/Suciedad_Pre';
import Suciedad_Post from './Components/Suciedad_Post';
import Tiempo from './Components/Tiempo';

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
        return <NivelAgua />
      case 4:
      // % de suciedad despues de filtrar
        return <Suciedad_Post />
      case 5:
        return <Tiempo />
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
