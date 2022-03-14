import React, {Component} from 'react';
import logo from '../Images/Pozo_front.png';



export default class Base extends Component {
    render() {
        return <div>
                    <img src={logo} width="100%"></img>
               </div>
    }
}