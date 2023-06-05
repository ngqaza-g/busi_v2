const fan_switch = document.getElementById('fan_switch');

var fan_manual = false;
var fan_value = false;
var alarm_settings;

fan_switch.addEventListener('change', ()=>{
  const message = new Paho.MQTT.Message(JSON.stringify({value: fan_switch.checked}));
  message.destinationName = "fan_control";
  client.send(message);
})

var client = new Paho.MQTT.Client('127.0.0.1', Number(9001), "busi_website_" + Math.floor(Math.random() * 10000));

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({onSuccess:()=>{
    console.log("onConnect");
    client.subscribe("updates");
    client.subscribe('alarm_settings')
    // // Sending a message 
    // message = new Paho.MQTT.Message("Hello");
    // message.destinationName = "World";
    // client.send(message);
}});

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
    console.log(message.destinationName)

    if(message.destinationName === "updates"){
      try{
        const {temperature, humidity, smoke_led, fan, temperature_led, humidity_led} = JSON.parse(message.payloadString);
    
        change_led_status("smoke_led", smoke_led);
        // change_led_status("fire_led", fire_led);
        change_led_status("humidity_led", humidity_led);
        change_led_status("temperature_led", temperature_led);
        fan_switch.checked = fan;
        fan_value = fan
        temperature_gauge.setValue(Number(temperature));
        humidity_gauge.setValue(Number(humidity));
        // console.log("temperature: ", temperature)
        // console.log("humidity: ", humidity)
    
      }catch(e){
        console.error(e)
      }

    }

    if(message.destinationName === "alarm_settings"){
      alarm_settings = JSON.parse(message.payloadString);
      fan_manual = alarm_settings.fan_manual;
      fan_switch.disabled = !fan_manual;
    }
}


var temperature_gauge = Gauge(document.getElementById("temperature"), {
    max: 100,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "\u00B0" + "C";
    },
    value:  0,

    color: function(value) {
      if(value < 20) {
        return "#5ee432"; // green
      }else if(value < 40) {
        return "#fffa50"; // yellow
      }else if(value < 60) {
        return "#f7aa38"; // orange
      }else {
        return "#ef4655"; // red
      }
    }
});

var humidity_gauge = Gauge(document.getElementById("humidity"), {
    max: 100,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "%";
    },
    value: 0,
    // Custom dial colors (Optional)
    color: function(value) {
      if(value < 20) {
        return "#5ee432"; // green
      }else if(value < 40) {
        return "#fffa50"; // yellow
      }else if(value < 60) {
        return "#f7aa38"; // orange
      }else {
        return "#ef4655"; // red
      }
    }
});

change_led_status("smoke_led", false)

function change_led_status(led_id, _status){
    const led = document.getElementById(led_id);
    const inner_led = led.children[0].children[0];
    led.classList.add("led_on");

    if(_status){
      led.classList.add("led_on");
      inner_led.style.opacity = 1;
    }else{
      led.classList.remove("led_on");
      inner_led.style.opacity = 0.1;
    }
}