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

    var pendiente = 255 / (máximo - mínimo);        //m
    var independiente = 255 - (pendiente * máximo); //b
    for (var i = 0; i < píxeles.length; i += 4) {
        var intensidad = (píxeles[i] + píxeles[i + 1] + píxeles[i + 2]) / 3;
        intensidad = (pendiente * intensidad) + independiente;
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


function aplicarExpansionHistograma() {
    var canvasOriginal = document.getElementById('canvas-original');
    var contextoOriginal = canvasOriginal.getContext('2d');
    var canvasProcesado = document.getElementById('canvas-procesado');
    var contextoProcesado = canvasProcesado.getContext('2d');
    
    var imagen = new Image();
    imagen.onload = function() {
        var datosImagenOriginal = contextoOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
        var datosImagenExpandida = expansionHistograma(datosImagenOriginal);
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
        var datosImagenExpandida = ecualizacionHistograma(datosImagenOriginal);
        contextoProcesado.putImageData(datosImagenExpandida, 0, 0);
    };
    imagen.src = imageVariable;
}



