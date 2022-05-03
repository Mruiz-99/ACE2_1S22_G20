import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Wave from 'react-wavify';
import Humidity from '../Images/Humidity.svg';
import Filtro from '../Images/Filtro.svg';
import {
    Row,
    Col,
    Card,
    CardSubtitle,
    CardBody,
    CardTitle
} from 'reactstrap';
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;
const clean_water_values = [43,54,33];
const dirty_water_values = [131,155,120];
const minimum_distance_trigger = 3;
const Profundidad_Desde_Sensor = 22; // en cm
const ProfundidadAnimation = 140;

const WaterColor = 
[
    "#3F2813", // <10%
    "#404013", // <20%
    "#2B4013", // <30%
    "#194013", // <40%
    "#134025", // <50%
    "#134040", // <60%
    "#237575", // <70%
    "#2C7594", // <80%
    "#3A93B9", // <90%
    "#6EC2E6"  // <100%
];

export default class Base extends Component {
    state = {
        preFilterColor: "#FFFFFF",
        preFilterPercentage: 20,
        updateColor: true,

        lastDisplacemendRed: 0,
        lastDisplacemendGreen: 0,
        lastDisplacemendBlue: 0,

        distance: 0,
        animationDistance: 130,
        postFilterColor: "#FFFFFF",
        postFilterPercentage: 20,

        humedad: 0.0,
        last_timestamp: undefined,
        last_distance: 0,
        speed: 0
    }

    constructor(){
        super();
        this.updateChart = this.updateChart.bind(this);
        this.getLatestValueFromAPI_PreFilter = this.getLatestValueFromAPI_PreFilter.bind(this);
    }

    componentDidMount() {
        this.intervalID = setInterval(this.updateChart, updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    getTimeDifference(timestamp1, timestamp2){
        var difference = new Date(timestamp2).getTime() - new Date(timestamp1).getTime();

        var daysDifference = Math.floor(difference/1000/60/60/24);
        difference -= daysDifference*1000*60*60*24

        var hoursDifference = Math.floor(difference/1000/60/60);
        difference -= hoursDifference*1000*60*60

        var minutesDifference = Math.floor(difference/1000/60);
        difference -= minutesDifference*1000*60

        var secondsDifference = Math.floor(difference/1000);

        if(daysDifference > 0){
            return -1
        }

        return (hoursDifference*60*60)+(minutesDifference*60)+secondsDifference;
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    updateChart() {
        this.getLatestValueFromAPI_PreFilter()
        .then((result) => {
            let diffRed = dirty_water_values[0]-clean_water_values[0];
            let diffGreen = dirty_water_values[1]-clean_water_values[1];
            let diffBlue = dirty_water_values[2]-clean_water_values[2];

            let valuePPRed = diffRed/100;
            let valuePPGreen = diffGreen/100;
            let valuePPBlue = diffBlue/100;

            let displacedRed = result[0].r - clean_water_values[0];
            let displacedGreen = result[0].g - clean_water_values[1];
            let displacedBlue = result[0].b - clean_water_values[2];

            if(displacedRed < 0) displacedRed = result[0].r;
            if(displacedGreen < 0) displacedGreen = result[0].g;
            if(displacedBlue < 0) displacedBlue = result[0].b;

            if(displacedRed < this.state.lastDisplacemendRed) displacedRed = result[0].r;
            if(displacedGreen < this.state.lastDisplacemendGreen) displacedGreen = result[0].g;
            if(displacedBlue < this.state.lastDisplacemendBlue) displacedBlue = result[0].b;

            let percentageRed = 100-(displacedRed*valuePPRed);
            let percentageGreen = 100-(displacedGreen*valuePPGreen);
            let percentageBlue = 100-(displacedBlue*valuePPBlue);

            let overallPercentage = ((percentageRed+percentageGreen+percentageBlue)/3).toFixed(2);

            let color = "#000000";

            if(overallPercentage < 0) overallPercentage = 0.0;
            if(overallPercentage > 100) overallPercentage = 100.0;

            if(overallPercentage > 0){
                let i = parseInt(overallPercentage/10)-1
                if(i < 0) i =0
                color = WaterColor[i];
            }else{
                color = WaterColor[0];
            }

            this.setState({
                preFilterColor: color,
                preFilterPercentage: parseFloat(overallPercentage),
                updateColor: !this.state.updateColor
            });                     
        });

        this.getLatestValueFromAPI_PostFilter()
        .then((result) => {
            let diffRed = dirty_water_values[0]-clean_water_values[0];
            let diffGreen = dirty_water_values[1]-clean_water_values[1];
            let diffBlue = dirty_water_values[2]-clean_water_values[2];

            let valuePPRed = diffRed/100;
            let valuePPGreen = diffGreen/100;
            let valuePPBlue = diffBlue/100;

            let displacedRed = result[0].r - clean_water_values[0];
            let displacedGreen = result[0].g - clean_water_values[1];
            let displacedBlue = result[0].b - clean_water_values[2];

            if(displacedRed < 0) displacedRed = result[0].r;
            if(displacedGreen < 0) displacedGreen = result[0].g;
            if(displacedBlue < 0) displacedBlue = result[0].b;

            this.state.lastDisplacemendRed = displacedRed;
            this.state.lastDisplacemendGreen = displacedGreen;
            this.state.lastDisplacemendBlue = displacedBlue;

            let percentageRed = 100-(displacedRed*valuePPRed);
            let percentageGreen = 100-(displacedGreen*valuePPGreen);
            let percentageBlue = 100-(displacedBlue*valuePPBlue);
            
            let overallPercentage = ((percentageRed+percentageGreen+percentageBlue)/3).toFixed(2);

            let color = "#000000";

            if(overallPercentage < 0) overallPercentage = 0.0;
            if(overallPercentage > 100) overallPercentage = 100.0;

            if(overallPercentage > 0){
                let i = parseInt(overallPercentage/10)-1
                if(i < 0) i =0
                color = WaterColor[i];
            }else{
                color = WaterColor[0];
            }

            this.setState({
                postFilterColor: color,
                postFilterPercentage: parseFloat(overallPercentage),
                updateColor: !this.state.updateColor
            });                     
        });

        this.getLatestValueFromAPI_Distance().then((result) => {
            let nivel = parseInt(result[0].value/(Profundidad_Desde_Sensor/ProfundidadAnimation));
            let distance = parseFloat((Profundidad_Desde_Sensor-result[0].value).toFixed(2));
            
            let new_distance = parseFloat(Profundidad_Desde_Sensor-result[0].value)
            if(new_distance-this.state.last_distance >= minimum_distance_trigger){
                if(this.state.last_timestamp == undefined) this.state.last_timestamp = result[0].timestamp;
                let diff = this.getTimeDifference(this.state.last_timestamp, result[0].timestamp)

                if(diff > 0){
                    let d = new_distance-this.state.last_distance;
                    let speed = parseFloat((d/diff).toFixed(2));
                    
                    this.setState({
                        speed: speed
                    });
                }
            }
            this.state.last_timestamp = result[0].timestamp;
            this.state.last_distance = new_distance;
            
            this.setState({
                distance: distance,
                animationDistance: parseInt(nivel),
                updateColor: !this.state.updateColor
            });
        });

        this.getLatestValueFromAPI_Humidity().then((result) => {
            this.setState({
                humedad: parseFloat(result[0].value)
            });
        });
    }

    getLatestValueFromAPI_PreFilter  = async() => {
        const response = await fetch(`${API_SERVER}/getPreFilterRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_PostFilter  = async() => {
        const response = await fetch(`${API_SERVER}/getPostFilterRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_Distance  = async() => {
        const response = await fetch(`${API_SERVER}/getDistanceRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_Humidity  = async() => {
        const response = await fetch(`${API_SERVER}/getHumidityRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    render() {
        return <div>
                    <Row className='px-5'>
                        <Col>
                            <Card>
                                <CardBody className='m-auto'>
                                    <CardTitle tag="h3">
                                        {this.state.preFilterPercentage}%
                                    </CardTitle>
                                    <CardSubtitle
                                        className="mb-2 text-muted"
                                        tag="h6"
                                    >
                                        Pureza del Agua (PreFiltrado)
                                    </CardSubtitle>
                                    <Wave fill={this.state.preFilterColor}
                                            options={{
                                                height: 0,
                                                amplitude: 20,
                                                speed: 0.15,
                                                points: 3
                                            }}/>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col>
                            <Card>
                                <CardBody className='m-auto'>
                                <CardTitle tag="h3">
                                        {this.state.humedad}%
                                </CardTitle>
                                <CardSubtitle 
                                    className="mb-2 text-muted"
                                    tag="h6">
                                    Humedad
                                </CardSubtitle>
                                    <img src={Humidity} width={150} />
                                </CardBody>
                            </Card>
                        </Col>

                        <Col>
                            <Card>
                                <CardBody className='m-auto'>
                                    <CardTitle tag="h3">
                                        {this.state.postFilterPercentage}%  ({this.state.distance} cm)
                                    </CardTitle>
                                    <CardSubtitle
                                        className="mb-2 text-muted"
                                        tag="h6"
                                    >
                                        Nivel y Pureza (PostFiltrado)
                                    </CardSubtitle>
                                    <Wave fill={this.state.postFilterColor}
                                            options={{
                                                height: this.state.animationDistance,
                                                amplitude: 20,
                                                speed: 0.15,
                                                points: 3
                                            }}/>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className='p-5'>
                        <Col>
                            <Card className='ml-3'>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <CardTitle tag="h3">
                                            Velocidad de Llenado
                                            </CardTitle>
                                            <CardSubtitle
                                                className="mb-2 text-muted"
                                                tag="h6">
                                                Cambio de altura respecto al tiempo                                
                                            </CardSubtitle>
                                        </Col>
                                        <Col className='text-center my-auto' tag="h3">
                                                {this.state.speed} cm/s
                                        </Col>
                                        <Col className='text-right'>
                                            <img src={Filtro} width={100}/>
                                        </Col>
                                    </Row>
                                </CardBody>                                
                            </Card>     
                        </Col>
                    </Row>
                                                            
               </div>
    }
}