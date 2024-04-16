function expansiónHistograma(datosImagen) {
    var píxeles = datosImagen.data;
    var mínimo = 255, máximo = 0;

    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        if (intensidad < mínimo) mínimo = intensidad;
        if (intensidad > máximo) máximo = intensidad;
    }

    var pendiente = 255 / (máximo - mínimo);        //m
    var independiente = 255 - (pendiente * máximo); //b
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        intensidad = (pendiente * intensidad) + independiente;
        píxeles[i] = píxeles[i + 1] = píxeles[i + 2] = intensidad;
    }

    return datosImagen;
}

function ecualizaciónHistograma(datosImagen) {
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


function aplicarExpansiónHistograma() {
    var canvasOriginal = document.getElementById('canvas-original');
    var canvasProcesado = document.getElementById('canvas-procesado');
    var contextoOriginal = canvasOriginal.getContext('2d');
    var contextoProcesado = canvasProcesado.getContext('2d');
    
    var imagen = new Image();
    imagen.onload = function() {
        contextoOriginal.drawImage(imagen, 0, 0, canvasOriginal.width, canvasOriginal.height);
        var datosImagenOriginal = contextoOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
        var datosImagenExpandida = expansiónHistograma(datosImagenOriginal);
        contextoProcesado.putImageData(datosImagenExpandida, 0, 0);
    };
    imagen.src = 'img/example1.jpg';
}


function aplicarEcualizaciónHistograma() {
    
    var canvasOriginal = document.getElementById('canvas-original');
    var canvasProcesado = document.getElementById('canvas-procesado');
    var contextoOriginal = canvasOriginal.getContext('2d');
    var contextoProcesado = canvasProcesado.getContext('2d');
    
    var imagen = new Image();
    imagen.onload = function() {
        contextoOriginal.drawImage(imagen, 0, 0, canvasOriginal.width, canvasOriginal.height);
        var datosImagenOriginal = contextoOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
        var datosImagenEcualizada = ecualizaciónHistograma(datosImagenOriginal);
        contextoProcesado.putImageData(datosImagenEcualizada, 0, 0);
    };
    imagen.src = 'img/example1.jpg';
}