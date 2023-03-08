client = new Paho.MQTT.Client('127.0.0.1', Number(9001), "busi_website_" + Math.floor(Math.random() * 10000));

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({onSuccess:()=>{
    console.log("onConnect");
    client.subscribe("World");

    // Sending a message 
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    client.send(message);
}});

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}


const temperature = Gauge(document.getElementById("temperature"), {
    max: 100,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "\u00B0" + "C";
    },
    value:  10,

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

const humidity = Gauge(document.getElementById("humidity"), {
    max: 100,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "%";
    },
    value: 50,
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

let _status = false;
document.getElementById('led_on').addEventListener('click', function(){
  const led = document.getElementById('led');
  const inner_led = led.children[0].children[0];
  led.classList.add("led_on");

  _status = ! _status;


  if(_status){
    led.classList.add("led_on");
    inner_led.style.opacity = 1;
  }else{
    led.classList.remove("led_on");
    inner_led.style.opacity = 0.1;
  }
})