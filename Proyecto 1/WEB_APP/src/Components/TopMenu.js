import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Row,
    Col,
    Navbar,
    NavbarBrand,
    Collapse,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

export default class TopMenu extends Component {
    
    constructor(props){
        super(props);
    }


    render(){
        return <Row>
                <Navbar className="m-4" color="light" light expand="xs">
                    <NavbarBrand href="#" onClick={() => this.props.menuHandler(0)}>
                    Prototipo: <br className='d-sm-none d-md-block'/> Jardin Filtrante
                    </NavbarBrand>
                    <Col xs={0} sm={1} md={2} lg={5}></Col>
                    <Collapse navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="#" onClick={() => this.props.menuHandler(1)}>
                                    Suciedad (Pre)
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={() => this.props.menuHandler(2)}>
                                    Humedad
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={() => this.props.menuHandler(3)}>
                                    Cantidad de Agua
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={() => this.props.menuHandler(4)}>
                                    Suciedad (Post)
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" onClick={() => this.props.menuHandler(5)}>
                                    Tiempo de Filtrado
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </Row>
    }
}