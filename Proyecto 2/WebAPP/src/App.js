import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Base from './Components/Base';
import './App.css';
import TopMenu from './Components/TopMenu';
import Metano from './Components/Metano';
import Temperatura from './Components/Temperatura';
import TiempoMetano from './Components/TiempoMetano';
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
        return <img style={{display: 'block',margin: 'auto'}} src="https://upload.wikimedia.org/wikipedia/commons/5/55/Biodigestor.JPG" />;
      case 1:
        return <Metano />;
      case 2:
        return <Temperatura />
      case 3:
      // Cantidad de Agua TODO
        return <TiempoMetano />
      case 4:
      // % de suciedad despues de filtrar
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
