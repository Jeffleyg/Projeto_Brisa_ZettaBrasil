
// Cria uma visualização
var view = new ol.View({
    center: ol.proj.fromLonLat([-38.529, -3.717]),
    zoom: 12
  });
  
  // Cria um marcador para a localização do usuário
  var userMarker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-38.529, -3.717]))
  });
  
  // Define um estilo para o marcador
  var markerStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: 'blue' }),
      stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    })
  });
  userMarker.setStyle(markerStyle);
  
  // Cria uma camada de vetor para o marcador
  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [userMarker]
    })
  });

  // Camada de imagens de satélite do MapTiler
var satelliteLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
      url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      maxZoom: 20
  })
});

// Cria um mapa
var map = new ol.Map({
  target: 'map',
  layers: [
      satelliteLayer, // Adiciona a camada de satélite primeiro
      new ol.layer.Tile({
          source: new ol.source.OSM()
      }),
      vectorLayer
  ],
  view: view
});
  
  
  var source = new ol.source.Vector({
    url: '/data/layers/7day-M2.5.json',
    format: new ol.format.GeoJSON()
  });
  var style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
        fill: new ol.style.Fill({
        color: [0, 153, 255, 1]
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 0.75],
        width: 1.5
      })
    }),
    zIndex: 100000
  });
  var select = new ol.interaction.Select({style: style});
  var modify = new ol.interaction.Modify({
    features: select.getFeatures()
  });
  

  map.on('click', function(event) {
    showLocationDetails(event.coordinate); // Passa as coordenadas do clique para a função
});

  
  // Função para mostrar a localização do usuário
  function showUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var userPosition = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
        userMarker.getGeometry().setCoordinates(userPosition);
        view.setCenter(userPosition);
        view.setZoom(12); // Defina o zoom conforme necessário
      });
    } else {
      alert('Geolocalização não suportada pelo navegador.');
    }
  }
  
  // Chame a função para mostrar a localização do usuário
  showUserLocation();

  document.getElementById('infoContent').innerHTML = detailsHtml;
  
  // Função para exibir detalhes da localização do usuário
  function showLocationDetails() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var accuracy = position.coords.accuracy; // Precisão da localização em metros
  
        // Chamada à API de geocodificação reversa
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            var detailsHtml = `
              <p>Latitude: ${latitude}</p>
              <p>Longitude: ${longitude}</p>
              <p>Precisão: ${accuracy} metros</p>
              <p>Endereço: ${data.display_name}</p>
              <p>CEP: ${data.address.postcode || 'Não disponível'}</p>
              <p>Rua: ${data.address.road || 'Não disponível'}</p>
            `;
            document.getElementById('infoContent').innerHTML = detailsHtml;
          })
          .catch(error => {
            console.error('Erro ao obter endereço:', error);
            alert('Não foi possível obter informações do endereço.');
          });
      }, function(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Permissão para geolocalização negada pelo usuário.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Informações de localização não disponíveis.");
            break;
          case error.TIMEOUT:
            alert("Tempo expirado ao obter a localização do usuário.");
            break;
          case error.UNKNOWN_ERROR:
            alert("Erro desconhecido ao obter a localização do usuário.");
            break;
        }
      });
    } else {
      alert('Geolocalização não suportada pelo navegador.');
    }
  }
  

  document.addEventListener('DOMContentLoaded', function() {
    var map = new ol.Map({
        // inicialização do mapa e outras configurações
    });

    map.on('click', function(event) {
        showLocationDetails(event.coordinate);
    });

    // Outras funções que dependem do DOM
});

  // Função para calcular a distância entre dois pontos no mapa
  function calculateDistance(point1, point2) {
    var line = new ol.geom.LineString([point1, point2]);
    var distance = line.getLength();
    return distance;
  }
  
  
  const blur = document.getElementById('blur');
  const radius = document.getElementById('radius');
  
  const vector = new HeatmapLayer({
    source: new VectorSource({
      url: 'data/kml/2012_Earthquakes_Mag5.kml',
      format: new KML({
        extractStyles: false,
      }),
    }),
    blur: parseInt(blur.value, 10),
    radius: parseInt(radius.value, 10),
    weight: function (feature) {
      // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
      // standards-violating <magnitude> tag in each Placemark.  We extract it from
      // the Placemark's name instead.
      const name = feature.get('name');
      const magnitude = parseFloat(name.substr(2));
      return magnitude - 5;
    },
  });
  
  const raster = new TileLayer({
    source: new StadiaMaps({
      layer: 'stamen_toner',
    }),
  });
  
  
  blur.addEventListener('input', function () {
    vector.setBlur(parseInt(blur.value, 10));
  });
  
  radius.addEventListener('input', function () {
    vector.setRadius(parseInt(radius.value, 10));
  });

 


document.getElementById('filterType').addEventListener('change', function() {
  var selection = this.value;
  var cityInput = document.getElementById('cityInput');
  if (selection === 'by_city') {
    cityInput.style.display = 'block';
  } else {
    cityInput.style.display = 'none';
  }
});

function applyFilter() {
  var filterType = document.getElementById('filterType').value;
  var cityName = document.getElementById('cityName').value;

  switch (filterType) {
    case 'near_me':
      // Implemente a lógica para encontrar clientes perto do usuário
      console.log('Filtrando clientes perto de mim');
      break;
    case 'by_city':
      // Implemente a lógica para filtrar clientes pela cidade
      console.log('Filtrando clientes na cidade:', cityName);
      break;
    default:
      console.log('Seleção de filtro desconhecida');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var formElement = document.querySelector('.filter-form');
  var dragging = false;
  var startY, startTop;

  // Função para iniciar o arrasto
  formElement.addEventListener('mousedown', function(e) {
    dragging = true;
    startY = e.clientY;
    startTop = parseInt(window.getComputedStyle(formElement).top, 10);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault(); // Prevenir seleção de texto ou outros comportamentos indesejados
  });

  // Função para processar o movimento do mouse
  function onMouseMove(e) {
    if (dragging) {
      var dy = e.clientY - startY;
      formElement.style.top = (startTop + dy) + 'px';
    }
  }

  // Função para finalizar o arrasto
  function onMouseUp() {
    dragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
});
/*
function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              const location = ol.proj.fromLonLat([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
              addMarkerToMap(location, data[0]); // Passar todas as informações de endereço
              map.getView().setCenter(location);
              map.getView().setZoom(15); // Ajuste o zoom conforme necessário
          } else {
              alert('Endereço não encontrado.');
          }
      })
      .catch(error => {
          console.error('Erro ao geocodificar o endereço:', error);
          alert('Erro ao buscar as coordenadas para o endereço.');
      });
}

function addMarkerToMap(location, addressInfo) {
  var marker = new ol.Feature({
      geometry: new ol.geom.Point(location),
      addressInfo: addressInfo // Armazenar informações do endereço no marcador
  });

  marker.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({ color: 'red' }),
          stroke: new ol.style.Stroke({ color: 'white', width: 2 })
      })
  }));

  var vectorSource = new ol.source.Vector({
      features: [marker]
  });

  var vectorLayer = new ol.layer.Vector({
      source: vectorSource
  });

  map.addLayer(vectorLayer);

  // Adicionar evento de clique ao marcador
  map.on('click', function(event) {
      map.forEachFeatureAtPixel(event.pixel, function(feature) {
          var info = feature.get('addressInfo');
          if (info) {
              alert(`Endereço: ${info.display_name}\nLatitude: ${info.lat}\nLongitude: ${info.lon}\nCEP: ${info.address.postcode || 'Não disponível'}`);
          }
      });
  });
}
*/

function fullAddressGeocode() {
  const street = document.getElementById('streetInput').value;
  const neighborhood = document.getElementById('neighborhoodInput').value;
  const city = document.getElementById('cityInput').value;
  const state = document.getElementById('stateInput').value;
  const zipCode = document.getElementById('zipCodeInput').value;

  const address = `${street}, ${neighborhood}, ${city}, ${state}, ${zipCode}`;
  geocodeAddress(address);
}

function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              const location = ol.proj.fromLonLat([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
              addMarkerToMap(location, data[0]); // Passar todas as informações de endereço
              map.getView().setCenter(location);
              map.getView().setZoom(15); // Ajuste o zoom conforme necessário
          } else {
              alert('Endereço não encontrado.');
          }
      })
      .catch(error => {
          console.error('Erro ao geocodificar o endereço:', error);
          alert('Erro ao buscar as coordenadas para o endereço.');
      });
}

function addMarkerToMap(location, addressInfo) {
  var marker = new ol.Feature({
      geometry: new ol.geom.Point(location),
      addressInfo: addressInfo // Armazenar informações do endereço no marcador
  });

  marker.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({ color: 'red' }),
          stroke: new ol.style.Stroke({ color: 'white', width: 2 })
      })
  }));

  var vectorSource = new ol.source.Vector({
      features: [marker]
  });

  var vectorLayer = new ol.layer.Vector({
      source: vectorSource
  });

  map.addLayer(vectorLayer);

  map.on('click', function(event) {
      map.forEachFeatureAtPixel(event.pixel, function(feature) {
          var info = feature.get('addressInfo');
          if (info) {
              alert(`Endereço: ${info.display_name}\nLatitude: ${info.lat}\nLongitude: ${info.lon}\nCEP: ${info.address.postcode || 'Não disponível'}`);
          }
      });
  });
}


document.getElementById('addressButton').addEventListener('click', function() {
  const address = document.getElementById('addressInput').value;
  geocodeAddress(address);
});

