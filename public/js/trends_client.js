async function update(){
    const res = await fetch('/get_trends');
    if(res.status == 200){
        const {temperature, humidity} = await res.json();

        console.log(temperature)
        create_graph('temperature', temperature);
        create_graph('humidity', humidity);
    }

}

function create_graph(id, data){

    const cxt = document.getElementById(id);
    console.log(cxt);
    const chart = new Chart(document.getElementById(id), {
      type: 'line',
      data: {
        datasets: [{
          data: data
        }]
      },
      options: {
        scales:{
            x: {
                ticks: {
                    display: false
               }
            }
        },
        plugins:{
            legend: {
                display: false
            }
        }
      }
    });
}


update()
.catch(e => console.log(e));