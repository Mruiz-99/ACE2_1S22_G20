import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;
const minimum_distance_trigger = 3 // cada cuanto cm se mide la velocidad de llenado
const Profundidad_Desde_Sensor = 22 // en cm

export default class Tiempo extends Component {

    state = {
        data: [],
        last_timestamp: undefined,
        last_distance: 0
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
                let new_distance = parseFloat(Profundidad_Desde_Sensor-element.value)
                if(new_distance-this.state.last_distance >= minimum_distance_trigger){
                    if(this.state.last_timestamp == undefined) this.state.last_timestamp = element.timestamp;
                    let diff = this.getTimeDifference(this.state.last_timestamp, element.timestamp)
                    
                    if(diff > 0){
                        let d = new_distance-this.state.last_distance;
                        let speed = parseFloat((d/diff).toFixed(2));

                        this.state.data.push({
                            x: parseFloat(element.id),
                            y: speed
                        });
                    }
                }

                this.state.last_timestamp = element.timestamp;
                this.state.last_distance = new_distance;
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
            console.log("Adding new value: ",result[0].value);
            let new_distance = parseFloat(Profundidad_Desde_Sensor-result[0].value)
            if(new_distance-this.state.last_distance >= minimum_distance_trigger){
                if(this.state.last_timestamp == undefined) this.state.last_timestamp = result[0].timestamp;
                let diff = this.getTimeDifference(this.state.last_timestamp, result[0].timestamp)

                if(diff > 0){
                    let d = new_distance-this.state.last_distance;
                    let speed = parseFloat((d/diff).toFixed(2));
                    
                    this.state.last_speed = speed;
                    this.state.last_id = result[0].id

                    this.state.data.push({
                        x: parseFloat(result[0].id),
                        y: speed
                    });
                }else{
                    this.state.data.push({
                        x: parseFloat(result[0].id),
                        y: this.state.last_speed
                    });
                }
            }
            this.state.last_timestamp = result[0].timestamp;
            this.state.last_distance = new_distance;

            if(this.chart !== undefined) this.chart.render();
        });
    }

    getLatestValueFromAPI  = async() => {
        const response = await fetch(`${API_SERVER}/getDistanceRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI = async() => {
        const response = await fetch(`${API_SERVER}/getDistanceRecords/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }
    
    render(){
        const options = {
            animationEnabled:true,
            axisY : {
                title: "Velocidad"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Tiempo de Llenado"
            },
            data:[
                {
                    type: "line",
                    name: "cm/s",
                    showLegend: true,
                    dataPoints: this.state.data
                }
            ]
        }
        return <div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}