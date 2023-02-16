var token =''
var flag = 1;

//recupero el token al cargar la página
document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById('bienvenido').style.display = "block";
    document.getElementById('strapiTable').style.display = "none";
    document.getElementById('graf').style.display = "none";
    $.ajax({
        url: "https://gestionweb.frlp.utn.edu.ar/api/auth/local",
        method: "POST",
        data: {
            identifier: 'martinlunasco@gmail.com',
            password: 'Strapi2022'
        },
        success: function (response) {
            token = response.jwt;
            console.log(token)
            initChart();
        },
        error: function (req, status, err) {
            alert("Error al traer la informacion de Strapi");
            console.log(err);
        }
    });
});

//cargo los datos a la strapi
function cargarDatos() {
    document.getElementById('bienvenido').style.display = "block";
    document.getElementById('strapiTable').style.display = "none";
    document.getElementById('graf').style.display = "none";
    $.ajax({
        url: "https://rickandmortyapi.com/api/character",
        method: "GET",
        dataType: "json",
        success: function (response) {
            lugares = response;
            enviarDatos(lugares);
        },
        error: function (req, status, err) {
            alert('Error al intentar consumir la api');
            console.log(err);
        }
    });
}

function enviarDatos(lugares) {
    let datoslugares = [];
    for (k=1; k<=9; k=k+2){
        datoslugares.push(
            {
                NOMBRE_LUGAR: lugares[k].name,
                TIPO_LUGAR: lugares[k].type,
                CANT_RESIDENTES: lugares[k].residents,
                //fechaFinal : fecha.slice(-2)+"/"+fecha.substring(5,7)
            }
        );
    }
    datoslugares.forEach(dolar => {
        $.ajax({
            url: "https://gestionweb.frlp.utn.edu.ar/api/G11_RickAndMorty",
            method: "POST",
            dataType: "json",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                data: JSON.parse(JSON.stringify(lugares)),
            },
            success: function (response) {

            },
            error: function (req, status, err) {
                console.log(err);
            }
        });
    });
}


function initChart() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
}

//muestro los datos de la strapi en la página
function drawChart(repe, cant) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Los generos de peliculas mas vistos del momento');

    for (let i = 0; i < cant; i++) {
        data.addRow([repe[i][0], repe[i][1]]);
    }
    // Set chart options
    var options = {
        'title': 'Los generos de peliculas mas vistos del momento',
    }
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}