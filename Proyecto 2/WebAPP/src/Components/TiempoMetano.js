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

export default class TiempoMetano extends Component {

    state = {
        startDate: new Date(),
        endDate: new Date(),
        data_casa: [],
        data_pozo: []
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
        this.getInitDataFromAPI_Casa().then((result) => {
            result.forEach(element => {
                this.state.data_casa.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.value)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
        
        this.getInitDataFromAPI_Pozo().then((result) => {
            result.forEach(element => {
                this.state.data_pozo.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.value)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI_Casa().then((result) => {
            this.state.data_casa.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].value)
            });              
            if(this.chart !== undefined) this.chart.render();
        });

        this.getLatestValueFromAPI_Pozo().then((result) => {
            this.state.data_pozo.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].value)
            });              
            if(this.chart !== undefined) this.chart.render();
        });                
    }

    getLatestValueFromAPI_Casa  = async() => {
        const response = await fetch(`${API_SERVER}/getTempRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_Pozo  = async() => {
        const response = await fetch(`${API_SERVER}/getMethaneRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Casa = async() => {
        const response = await fetch(`${API_SERVER}/getTempRecords/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Pozo = async() => {
        const response = await fetch(`${API_SERVER}/getMethaneRecords/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_CasaR = async(start, end) => {
        const response = await axios.post(`${API_SERVER}/getTempRecords/GraphInit/`, {
            start: start,
            end: end
        });

        const result = response.data;
        let nD = [];
        result.forEach(element => {
            nD.push({
                x: parseFloat(element.id),
                y: parseFloat(element.value)
            });              
        });

        this.setState({
            data_casa: nD
        });
    }

    getInitDataFromAPI_PozoR = async(start, end) => {
        const response = await axios.post(`${API_SERVER}/getMethaneRecords/GraphInit/`, {
            start: start,
            end: end
        });

        const result = response.data;
        let nD = [];
        result.forEach(element => {
            nD.push({
                x: parseFloat(element.id),
                y: parseFloat(element.value)
            });              
        });

        this.setState({
            data_pozo: nD
        });
    }

    setDateStart = (date) => {
        this.setState({
            startDate: date
        });

        clearInterval(this.intervalID);

        this.getInitDataFromAPI_CasaR(date, this.state.endDate);
        this.getInitDataFromAPI_PozoR(date, this.state.endDate);
    }

    setDateEnd = (date) => {
        this.setState({
            endDate: date
        });

        clearInterval(this.intervalID);
        this.getInitDataFromAPI_CasaR(this.state.startDate, date);
        this.getInitDataFromAPI_PozoR(this.state.startDate, date);
    }

    render(){
        const options = {
            animationEnabled:true,
            axisY : {
                title: "Temperatura/Metano"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Metano vs Temperatura"
            },
            data:[
                {
                    type: "line",
                    name: " grados",
                    showLegend: true,
                    dataPoints: this.state.data_casa
                },
                {
                    type: "line",
                    name: " metano",
                    showLegend: true,
                    dataPoints: this.state.data_pozo
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