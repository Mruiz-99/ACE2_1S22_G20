import axios from 'axios';
import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
import DatePicker from 'react-datepicker';
import {
    Row,
    Col
} from 'reactstrap';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;
const minimum_distance_trigger = 3 // cada cuanto cm se mide la velocidad de llenado
const Profundidad_Desde_Sensor = 22 // en cm

export default class Tiempo extends Component {

    state = {
        startDate: new Date(),
        endDate: new Date(),
        data: []
    }

    constructor(){
        super();
        this.updateChart = this.updateChart.bind(this);
        this.fillInitData = this.fillInitData.bind(this);
    }

    componentDidMount() {
        this.fillInitData();
        this.intervalID = setInterval(this.updateChart, updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    fillInitData(){
        return this.getInitDataFromAPI().then((result) => {
            result.forEach(element => {

                if(element.valve === true && !this.state.last_status){
                    this.state.last_status = true;
                    this.state.last_on = element.timestamp;
                }
                
                if(element.valve === false && this.state.last_status){
                    this.state.last_status = undefined;
                    var difference = new Date(element.timestamp).getTime() - new Date(this.state.last_on).getTime();
                    var resultInMinutes = Math.round(difference / 60000);
                    
                    this.state.data.push({
                        x: element.id,
                        y: parseFloat(resultInMinutes)
                    });

                    this.state.last_on = element.timestamp;
                }
            });
            if(this.chart !== undefined) this.chart.render();
        });
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

    updateChart() {
        this.getLatestValueFromAPI().then((result) => {

            if(result[0].valve === true && !this.state.last_status){
                this.state.last_status = true;
                this.state.last_on = result[0].timestamp;
            }
            
            if(result[0].valve === false && this.state.last_status){
                this.state.last_status = undefined;
                var difference = new Date(result[0].timestamp).getTime() - new Date(this.state.last_on).getTime();
                var resultInMinutes = Math.round(difference / 60000);
                
                this.state.data.push({
                    x: result[0].id,
                    y: parseFloat(resultInMinutes)
                });

                this.state.last_on = result[0].timestamp;
            }
            if(this.chart !== undefined) this.chart.render();
        });
    }

    getLatestValueFromAPI  = async() => {
        const response = await fetch(`${API_SERVER}/getStatusRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI = async() => {
        const response = await fetch(`${API_SERVER}/getStatusRecords/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Range = async(start, end) => {
        const response = await axios.post(`${API_SERVER}/getStatusRecords/GraphInit/`, {
            start: start,
            end: end
        });

        const result = response.data;
        this.state.data = [];

        result.forEach(element => {

            if(element.valve === true && !this.state.last_status){
                this.state.last_status = true;
                this.state.last_on = element.timestamp;
            }
            
            if(element.valve === false && this.state.last_status){
                this.state.last_status = undefined;
                var difference = new Date(element.timestamp).getTime() - new Date(this.state.last_on).getTime();
                var resultInMinutes = Math.round(difference / 60000);
                
                this.state.data.push({
                    x: element.id,
                    y: parseFloat(resultInMinutes)
                });

                this.state.last_on = element.timestamp;
            }
        });

        this.setState({
            data: this.state.data
        });
        
        if(this.chart !== undefined) this.chart.render();
    }

    setDateStart = (date) => {
        this.setState({
            startDate: date
        });

        clearInterval(this.intervalID);

        this.getInitDataFromAPI_Range(date, this.state.endDate);
    }

    setDateEnd = (date) => {
        this.setState({
            endDate: date
        });

        clearInterval(this.intervalID);
        this.getInitDataFromAPI_Range(this.state.startDate, date);
    }
    
    render(){
        const options = {
            animationEnabled:true,
            axisY : {
                title: "Minutos"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Tiempo de Uso"
            },
            data:[
                {
                    type: "line",
                    name: " min",
                    showLegend: true,
                    dataPoints: this.state.data
                }
            ]
        }
        return <div>
            <div>
                <Row className='px-3'>
                    <Col>
                        Desde: <DatePicker selected={this.state.startDate} onChange={(date) => this.setDateStart(date)} />
                    </Col>

                    <Col>
                        Hasta: <DatePicker selected={this.state.endDate} onChange={(date) => this.setDateEnd(date)} />
                    </Col>
                </Row>
            </div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}