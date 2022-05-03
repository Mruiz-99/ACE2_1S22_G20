import axios from 'axios';
import React, {Component, useState, useRef} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
import DatePicker from 'react-datepicker';
import {
    Row,
    Col
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;

export default class Metano extends Component {

    state = {
        data: [],
        startDate: new Date(),
        endDate: new Date()
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
        this.getInitDataFromAPI().then((result) => {
            result.forEach(element => {
                this.state.data.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.value)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI().then((result) => {
            this.state.data.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].value)
            });              
            if(this.chart !== undefined) this.chart.render();
        });
    }

    getLatestValueFromAPI  = async() => {
        const response = await fetch(`${API_SERVER}/getMethaneRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI = async() => {
        const response = await fetch(`${API_SERVER}/getMethaneRecords/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Range = async(start, end) => {
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
            data: nD
        });
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
                title: "Metano"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Metano"
            },
            data:[
                {
                    type: "line",
                    name: " Metano",
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
            <br/>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}