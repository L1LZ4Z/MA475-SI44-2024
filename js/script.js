let imageVariable;
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imageVariable = e.target.result;
        var canvasOriginal = document.getElementById('canvas-original');
        var contextoOriginal = canvasOriginal.getContext('2d');
        var canvasProcesado = document.getElementById('canvas-procesado');
        var contextoProcesado = canvasProcesado.getContext('2d');

        var imagen = new Image();
        imagen.onload = function() {
            // Establecer el tamaño del canvas al tamaño de la imagen
            canvasOriginal.width = imagen.width;
            canvasOriginal.height = imagen.height;
            canvasProcesado.width = imagen.width;
            canvasProcesado.height = imagen.height;
            
            // Dibujar la imagen en el canvas
            contextoOriginal.clearRect(0, 0, canvasOriginal.width, canvasOriginal.height);
            contextoOriginal.drawImage(imagen, 0, 0);
            if (imagen.complete && newWidth > 0 && newHeight > 0) {
                console.log('Imagen cargada correctamente');
            } else {
                alert('Error al cargar la imagen');
            }
        };
        imagen.src = imageVariable;
    };
    reader.readAsDataURL(file);
  }
});

function expansionHistograma(datosImagen) {
    var píxeles = datosImagen.data;
    var mínimo = 255, máximo = 0;

    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        if (intensidad < mínimo) mínimo = intensidad;
        if (intensidad > máximo) máximo = intensidad;
    }

    var m = 255 / (máximo - mínimo);        //m
    var b = 255 - (m * máximo); //b
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        intensidad = (m * intensidad) + b;
        píxeles[i] = píxeles[i + 1] = píxeles[i + 2] = intensidad;
    }

    return datosImagen;
}

function ecualizacionHistograma(datosImagen) {
    var píxeles = datosImagen.data;
    var histograma = new Array(256).fill(0);
    var histogramaAcumulado = new Array(256).fill(0);

    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        histograma[Math.floor(intensidad)]++;
    }
    histogramaAcumulado[0] = histograma[0];
    for (var i = 1; i < 256; i++) {
        histogramaAcumulado[i] = histogramaAcumulado[i - 1] + histograma[i];
    }

    var escala = 255 / (píxeles.length / 4);
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        var nuevaIntensidad = Math.round(histogramaAcumulado[Math.floor(intensidad)] * escala);
        píxeles[i] = píxeles[i + 1] = píxeles[i + 2] = nuevaIntensidad;
    }

    return datosImagen;
}
/*ESTOY PROBANDO*/
function devolerArregloBNW(datosImagen) {
    var píxeles = datosImagen.data;
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
    }
    return datosImagen;
}

function obtenerValoresHistograma(datosImagen) {
    var píxeles = datosImagen.data;
    var histograma = new Array(256).fill(0);
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i]);
        histograma[Math.floor(intensidad)]++;
    }
    return histograma;
}

function aplicarExpansionHistograma() {
    var canvasOriginal = document.getElementById('canvas-original');
    var contextoOriginal = canvasOriginal.getContext('2d');
    var canvasProcesado = document.getElementById('canvas-procesado');
    var contextoProcesado = canvasProcesado.getContext('2d');
    
    var imagen = new Image();
    imagen.onload = function() {
        var datosImagenOriginal = contextoOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
        var DatosImagenBNW = devolerArregloBNW(datosImagenOriginal);
        var array_bnw = obtenerValoresHistograma(DatosImagenBNW);
        generarGraficoHistogramaOriginal(array_bnw);
        var datosImagenExpandida = expansionHistograma(datosImagenOriginal);  
        var array_histograma = obtenerValoresHistograma(datosImagenExpandida); 
        generarGraficoHistogramaFinal(array_histograma); 
        contextoProcesado.putImageData(datosImagenExpandida, 0, 0);
    };
    imagen.src = imageVariable;
}

function aplicarEcualizacionHistograma() {
    var canvasOriginal = document.getElementById('canvas-original');
    var contextoOriginal = canvasOriginal.getContext('2d');
    var canvasProcesado = document.getElementById('canvas-procesado');
    var contextoProcesado = canvasProcesado.getContext('2d');
    
    var imagen = new Image();
    imagen.onload = function() {
        var datosImagenOriginal = contextoOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
        var DatosImagenBNW = devolerArregloBNW(datosImagenOriginal);
        var array_bnw = obtenerValoresHistograma(DatosImagenBNW);
        generarGraficoHistogramaOriginal(array_bnw);
        var datosImagenExpandida = ecualizacionHistograma(datosImagenOriginal);
        var array_histograma = obtenerValoresHistograma(datosImagenExpandida);
        generarGraficoHistogramaFinal(array_histograma); 
        contextoProcesado.putImageData(datosImagenExpandida, 0, 0);
    };
    imagen.src = imageVariable;
}

function generarGraficoHistogramaFinal(array_histograma) {
    var canvas = document.getElementById('histograma');
    var ctx = canvas.getContext('2d');

    // Destruir la instancia existente si existe
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 256 }, (_, i) => i.toString()),
            datasets: [{
                label: 'Histograma',
                data: array_histograma,
                backgroundColor: '#BAD61A',
                borderColor: '#BAD61A',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


var array_bnw = obtenerValoresHistogramaBNW(datosImagenOriginal);

function obtenerValoresHistogramaBNW(datosImagen) {
    var píxeles = datosImagen.data;
    var histograma = new Array(256).fill(0);
    var cantidad_píxeles = píxeles.length/ 4;
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        histograma[Math.floor(intensidad)]++;
    }
    return histograma;
}
function generarGraficoHistogramaOriginal(array_bnw) {
    var canvas = document.getElementById('histograma-original');
    var ctx = canvas.getContext('2d');

    // Destruir la instancia existente si existe
    if (window.myChart2) {
        window.myChart2.destroy();
    }

    window.myChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 256 }, (_, i) => i.toString()),
            datasets: [{
                label: 'Histograma',
                data: array_bnw,
                backgroundColor: '#BAD61A',
                borderColor: '#BAD61A',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}