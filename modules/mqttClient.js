const mqtt = require('mqtt');
const Alarm = require('../models/Alarm');
const User = require('../models/User');
const Data = require('../models/Data');
const send_email = require('./send_email');

const mqttClient = mqtt.connect('mqtt://127.0.0.1');

mqttClient.on('connect', ()=>{
    console.log("Connected to an MQTT Broker");
    mqttClient.subscribe('updates');
});

mqttClient.on('message', async (topic, message)=>{

    if(topic == "updates"){
        console.log(message.toString())
        try{
            const data = JSON.parse(message.toString());
            const { temperature, humidity, smoke } = data;
            await handleAlarms(data);
            await Data.create({temperature, humidity, smoke});
        }catch(e){
            console.log("An error occured");
            console.log(e);
        }
    }

});




async function handleAlarms(data){
    const { temperature, humidity, temperature_led, humidity_led, smoke_led } = data; 

    if(temperature_led || humidity_led || smoke_led){
        let msg = "";
        const emails = await User.getEmails();
        if(temperature_led){
            msg += `Temeperature too high, value ${temperature}\n`
            await Alarm.create({alarm: msg});
        }
        if(humidity_led){
            msg += `Humidity too high, value ${humidity}\n`
            await Alarm.create({alarm: msg});
        }
        if(smoke_led){
            msg += `Smoke detected\n`;
            await Alarm.create({alarm: msg});
        }

        console.log(msg);

        emails.forEach( async email =>{
            try{
                await send_email(email, msg);
            }catch(e){
                console.log("An error occured while sending an email");
            }
        })
    }
}

module.exports = mqttClient;