
//multiple video types:
// let data = {
//     "children": [{
//         "src": 'https://www.youtube.com/embed/F-eMt3SrfFU?autoplay=1&enablejsapi=1',
//         "viewcount": 21097531,
//         "v_id": "22",
//         "type": "youtube"
//     }, {
//         "src": "https://www.youtube.com/embed/XI4Na5JW1ns?autoplay=1&enablejsapi=1",
//         "viewcount": 177639,
//         "v_id": "2",
//         "type": "youtube"
//     }, {
//         "src": "https://www.youtube.com/embed/nsrOCzUwcjE?autoplay=1&enablejsapi=1",
//         "viewcount": 1073553,
//         "v_id": "3",
//         "type": "youtube"
//     }, {
//         "src": "https://player.vimeo.com/video/12868296?autopause=0",
//         "viewcount": 1507944,
//         "v_id": "4",
//         "type": "vimeo"
//     }, {
//         "src": "https://player.vimeo.com/video/12788201?autopause=0",
//         "viewcount": 26112988,
//         "v_id": "5",
//         "type": "vimeo"
//     }, {
//         "src": "http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv",
//         "viewcount": 1507944,
//         "v_id": "6",
//         "type": "video"
//     }]
// }

//demo trailer data:
let data = {
    "children": [{
        "src": 'https://www.youtube.com/embed/F-eMt3SrfFU?autoplay=1&enablejsapi=1',
        "viewcount": 21097531,
        "v_id": "22",
        "type": "youtube"
    }, {
        "src": "https://www.youtube.com/embed/XI4Na5JW1ns?autoplay=1&enablejsapi=1",
        "viewcount": 177639,
        "v_id": "2",
        "type": "youtube"
    }, {
        "src": "https://www.youtube.com/embed/nsrOCzUwcjE?autoplay=1&enablejsapi=1",
        "viewcount": 1073553,
        "v_id": "3",
        "type": "youtube"
    }, {
        "src": "https://www.youtube.com/embed/GjwfqXTebIY?autoplay=1&enablejsapi=1",
        "viewcount": 13652523,
        "v_id": "4",
        "type": "youtube"
    }, {
        "src": "https://www.youtube.com/embed/JDcAlo8i2y8?autoplay=1&enablejsapi=1",
        "viewcount": 4289574,
        "v_id": "5",
        "type": "youtube"
    }, {
        "src": "https://www.youtube.com/embed/6Vtf0MszgP8?autoplay=1&enablejsapi=1",
        "viewcount": 7972246,
        "v_id": "6",
        "type": "youtube"
    },
    {
        "src": "https://www.youtube.com/embed/39udgGPyYMg?autoplay=1&enablejsapi=1",
        "viewcount": 7424591,
        "v_id": "7",
        "type": "youtube"
    },
    {
        "src": "https://www.youtube.com/embed/cPeqNTqZNN0?autoplay=1&enablejsapi=1",
        "viewcount": 3495856,
        "v_id": "8",
        "type": "youtube"
    },
    {
        "src": "https://www.youtube.com/embed/1xv_FeBGzfk?autoplay=1&enablejsapi=1",
        "viewcount": 6522727,
        "v_id": "9",
        "type": "youtube"
    },
    {
        "src": "https://www.youtube.com/embed/euz-KBBfAAo?autoplay=1&enablejsapi=1",
        "viewcount": 19562920,
        "v_id": "10",
        "type": "youtube"
    }]
}

drawBubble(data);

function drawBubble(data) {

  const diameter = 600;
  let zoom = 2;
  let g;
  let foreignObject;
  let div;
  let video;
  let circle;

  const bubble = d3.pack(data)
      .size([diameter, diameter])
      .padding(1.5);

  const svg = d3.select("#vis")
      .append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  //calculates radius, x and y positions for all child nodes
  const root = d3.hierarchy(data)
      .sum(function (d) { return d.viewcount; });

  const node = svg.selectAll(".node")
      .data(bubble(root).descendants())
      .enter()
      //only keeps objects that don't have children property
      .filter((d) => !d.children)

  //support for firefox
  if (typeof InstallTrigger !== 'undefined') {
      g = node.append('g')
          .attr("class", "node")
          .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")

      foreignObject = g.append('foreignObject')
          .attr('width', (d) => d.r * 2)
          .attr('height', (d) => d.r * 2)
          .attr('x', (d) => -d.r)
          .attr('y', (d) => -d.r)
          .style('pointer-events', 'none');

      video = foreignObject.append((d) => {
          //check src to determine whether element should be html5 video or iframe

          return d.data.type === 'video'
              ? document.createElement('video')
              : document.createElement('iframe');
      })

          //html5 video attributes
          .property('volume', (d) => d.data.type === 'video' ? '0.0' : null)
          .attr('autoplay', (d) => d.data.type === 'video' ? '' : null)
          .attr('loop', (d) => d.data.type === 'video' ? '' : null)

          //iframe attributes
          .attr('frameborder', (d) => d.data.type === 'iframe' ? 0 : null)

          //shared attributes
          .attr('id', (d) => d.data.v_id)
          .attr('src', (d) => d.data.src)
          .style('border-radius', '50%')
          .style('object-fit', 'cover')
          .style('width', '100%')
          .style('height', '100%');

      //position circle below video bubble to handle mouse events
      circle = g.append("circle")
          .attr("r", (d) => d.r)
          .on('mouseenter', handleMouseEnter)
          .on('mouseleave', handleMouseLeave);
  }

  //support for chrome
  else {
      g = node.append('g')

      foreignObject = g.append('foreignObject')
          .attr('x', (d) => d.x - d.r)
          .attr('y', (d) => d.y - d.r)
          .style('pointer-events', 'none');

      div = foreignObject.append('xhtml:div')
          .style('width', (d) => (d.r * 2) + 'px')
          .style('height', (d) => (d.r * 2) + 'px')
          .style('border-radius', (d) => d.r + 'px')
          .style('-webkit-mask-image', '-webkit-radial-gradient(circle, white 100%, black 100%)')
          .style('position', 'relative')

      video = div.append((d) => {
          //check src to determine whether element should be html5 video or iframe
          return d.data.type === 'video'
              ? document.createElement('video')
              : document.createElement('iframe');
      })

          //html5 video attributes
          .property('volume', (d) => d.data.type === 'video' ? '0.0' : null)
          .attr('autoplay', (d) => d.data.type === 'video' ? '' : null)
          .attr('loop', (d) => d.data.type === 'video' ? '' : null)
          .style('object-fit', (d) => d.data.type === 'video' ? 'cover' : null)

          //iframe attributes
          .attr('frameborder', (d) => d.data.type === 'iframe' ? 0 : null)

           //shared attributes
          .attr('id', (d) => d.data.v_id)
          .attr("xmlns", "http://www.w3.org/1999/xhtml")
          .attr('src', (d) => d.data.src)
          .style('width', (d) => d.data.type === 'youtube' || d.data.type === 'vimeo' ? `${zoom * 100}%` : '100%')
          .style('height', (d) => d.data.type === 'youtube' || d.data.type === 'vimeo' ? `${zoom * 100}%` : '100%')
          .style('top', (d) => d.data.type === 'youtube' || d.data.type === 'vimeo' ? -((zoom - 1) * d.r) + 'px' : null)
          .style('left', (d) => d.data.type === 'youtube' || d.data.type === 'vimeo' ? -((zoom - 1) * d.r) + 'px' : null)
          .style('position', 'absolute');

      //position circle below video bubble to handle mouse events
      circle = g.append("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", (d) => d.r)
          .on('mouseenter', handleMouseEnter)
          .on('mouseleave', handleMouseLeave);
  }

  //event handlers
  function handleMouseEnter(d, i) {
      console.log('enter')
      let videoID = data.children[i].v_id;
      if (d.data.type === 'vimeo') playerStore[videoID].setVolume(1);
      else if (d.data.type === 'youtube') playerStore[videoID].unMute();
      else playerStore[videoID].volume = 1;
  }

  function handleMouseLeave(d, i) {
      console.log('leave')
      let videoID = data.children[i].v_id;
      if (d.data.type === 'vimeo') playerStore[videoID].setVolume(0);
      else if (d.data.type === 'youtube') playerStore[videoID].mute();
      else playerStore[videoID].volume = 0;
  }

}


//still needs to be refactored:
let playerStore = {};

for (let i = 0; i < data.children.length; i += 1) {
  let videoID = data.children[i].v_id;
  if (data.children[i].type === 'video') {
    playerStore[videoID] = document.getElementById(videoID);
  }
  else if (data.children[i].type === 'vimeo') {
    let vimeoPlayer = new Vimeo.Player(videoID);
    playerStore[videoID] = vimeoPlayer;

    vimeoPlayer.ready().then(function () {
        vimeoPlayer.play();
        vimeoPlayer.setVolume(0);
      });
    }
}
