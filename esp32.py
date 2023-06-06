from umqttsimple import MQTTClient
from servo import Servo
import time
import machine
import dht
import ubinascii
import json


# Alarm Limits 
temperature_higher_limit = 17
temperature_lower_limit = 27
humidity_limit = 60
fan_manual = False

# Setting up input output pins 
dht_sensor = dht.DHT11(machine.Pin(15))
smoke_sensor = machine.Pin(13, machine.Pin.IN)
buzzer = machine.Pin(12, machine.Pin.OUT)
fan = machine.Pin(14, machine.Pin.OUT)
heater = machine.Pin(27, machine.Pin.OUT)
servo_motor = Servo(22)
servo_motor.move(0) # Initial position. adjust this value

# MQTT Stuff
client_id = ubinascii.hexlify(machine.unique_id())
mqtt_server ="192.168.137.1"
last_message = 0
message_interval = 2 # send messages every 30s
counter = 0
client = None


# Measure Temperature and Humidity
def get_temp_hum():
    global dht_sensor
    dht_sensor.measure()
    temperature = dht_sensor.temperature()
    humidity = dht_sensor.humidity()
    
    print(f"Temperature: {temperature} \nHumidity: {humidity}")
    
    return (temperature, humidity)

# This function  runs when an MQTT message is received 
def sub_cb(topic, msg):
    global fan_manual, temperature_higher_limit, temperature_lower_limit, humidity_limit
    rcvd_data = None
    try:
        topic = topic.decode('utf-8')
        msg = msg.decode('utf-8')
        rcvd_data = json.loads(msg)
    except OSError as e:
        print(e)
    else:
        if topic == "alarm_settings":
            temperature_higher_limit = int(rcvd_data["temperature_higher_limit"])
            temperature_lower_limit = int(rcvd_data["temperature_lower_limit"])
            humidity_limit = int(rcvd_data["humidity_limit"])
            fan_manual = rcvd_data["fan_manual"]
            print(rcvd_data)
        
        if topic == "fan_control":
            if fan_manual == True:
                fan_control = rcvd_data["value"]
                fan.value(fan_control)
    finally:
        print((topic, msg))
        

# This function runs after connecting to an MQTT broker and subscribes to control topics

def connect_and_subscribe():
    global client_id, mqtt_server
    
    client = MQTTClient(client_id, mqtt_server, keepalive=60)
    client.set_callback(sub_cb)
    client.connect()
    client.subscribe("alarm_settings")
    client.subscribe("fan_control")
    print(f"Connected to {mqtt_server} broker")
    return client

# Connecting to an MQTT broker
try:
    client = connect_and_subscribe()
    print("Conneceted to MQTT")
except OSError as e:
    print("Failed to connect to mqtt broker")
    print("Press reset button")


while True:
    try:
        client.check_msg()
        # Calculating 30s to send the next message
        if( time.time() - last_message) > message_interval:
            temperature, humidity = get_temp_hum()
#             temperature = 30
#             humidity = 30
            smoke_led = bool(not smoke_sensor.value())
            
            if(temperature > temperature_higher_limit):
                temperature_led = True
                servo_motor.move(90) # Pressed position. Adjust this value
                time.sleep(2)
                servo_motor.move(0) # Initial Position
            elif temperature < temperature_lower_limit:
                temperature_led = False
                heater.value(1)
            else:
                heater.value(0)
                temperature_led = False
            
            
            if(humidity > humidity_limit):
                humidity_led = True
            else:
                humidity_led = False

            
            if not fan_manual:
                if(temperature > temperature_higher_limit or humidity > humidity_limit):
                    fan_led = True
                    fan.value(1)
                else:
                    fan_led = False
                    fan.value(0)
                
            if(temperature_led or humidity_led or smoke_led):
               buzzer.value(1)
            else:
                buzzer.value(0)
            
            # Send an MQTT message to the web page
            msg = json.dumps({"temperature" : temperature, "humidity" : humidity, "smoke_led" : smoke_led, "temperature_led": temperature_led, "humidity_led": humidity_led, "fan" : bool(fan.value())})
            print(msg)
            msg = msg.encode()
            client.publish(b'updates', msg, retain=True)
            last_message = time.time()
        
    except OSError as e:
        print("An error occured")
        print(e)
