var filteredList;
var x1Streams = [];
var ps4Streams = [];
var gameStreams = [];
var gameOffset = 0;
var xb1Offset = 0;
var ps4Offset = 0;
var game = $('#game').val();
var url = 'https://api.twitch.tv/kraken/streams';

function getGameStreams() {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    data: {
      game: game,
      limit: 100,
      offset: gameOffset
    }
  }).done(function(response) {
    gameStreams = gameStreams.concat(response['streams']);
    $('#gamenumber').text(`Game Streams Loaded: ${gameStreams.length}`);
    if (response['streams'].length !== 0) {
      gameOffset += 100;
      getGameStreams();
    }
  }).fail(function(error) {
    console.log(error);
  });
}

function getX1Streams() {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    data: {
      game: game,
      xbox_heartbeat: true,
      limit: 100,
      offset: xb1Offset
    }
  }).done(function(response) {
    x1Streams = x1Streams.concat(getChannelNames(response['streams']));
    $('#xb1number').text(`Xbox Streams Loaded: ${x1Streams.length}`);
    if (response['streams'].length !== 0) {
      xb1Offset += 100;
      getX1Streams();
    }
  }).fail(function(error) {
    console.log(error);
  });
}

function getPs4Streams() {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    data: {
      game: game,
      sce_platform: 'ps4',
      limit: 100,
      offset: ps4Offset
    }
  }).done(function(response) {
    ps4Streams = ps4Streams.concat(getChannelNames(response['streams']));
    $('#ps4number').text(`PlayStation Streams Loaded: ${ps4Streams.length}`);
    if (response['streams'].length !== 0) {
      ps4Offset += 100;
      getPs4Streams();
    }
  }).fail(function(error) {
    console.log(error);
  });
}

function getChannelNames(streamObjects) {
  return streamObjects.map(function(stream) {
    return stream['channel']['display_name'];
  });
}

function filterGameStreams() {
  filteredList = [];
  gameStreams.forEach(function(streamObject) {
    if(!x1Streams.includes(streamObject['channel']['display_name']) && !ps4Streams.includes(streamObject['channel']['display_name'])) {
      filteredList.push(streamObject);
    }
    // else {
    //   console.log(streamObject)
    // }
  })
}

function listStreams() {
  $('#streams').html('');
  filterGameStreams();
  if (filteredList.length > 0) {
    filteredList.forEach(function(streamObject) {
      $('#streams').append($('<p>')).append($('<a>')
        .attr('href', streamObject['channel']['url'])
        .text(streamObject['channel']['display_name'])
      )
    })
  }
  else {
    $('#streams').append($('<h1>').text('No PC Streams'))
  }
}

function loadList() {
  getX1Streams();
  getPs4Streams();
  getGameStreams();
}
