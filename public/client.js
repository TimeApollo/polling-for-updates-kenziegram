const photoContainer = document.getElementById( 'photoContainer' );

let timeStamp = Date.now();
let reconnectTries = 0;

const pollForUpdates = () => {
  fetch(`./latest` , {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'after': timeStamp })
  } )
    .then( response => {
      if( response.status === 201 ) {
        return response.json()
      }else{
        throw new Error( 'Unable to connect to the server. Please try again later')
      } 
    })
    .then( data => {
      console.log(data);
      reconnectTries = 0;

      if( data.lastPostTime > timeStamp ){
        timeStamp = data.lastPostTime;
        data.images.forEach(image => {
          let dv = document.createElement('div');
          let im = document.createElement('img');
          im.src = `uploads/${image}`;
          im.style.height = '200px';
          im.style.width = '200px';
          photoContainer.insertBefore(dv, photoContainer.firstChild);
          dv.appendChild(im);
        });
      }
      setTimeout(pollForUpdates, 5000);
    })
    .catch( error => {
      if( !reconnectTries ){
        reconnectTries++;
        setTimeout(pollForUpdates, 5000);
      }else{
        console.log(error);
        alert('unable to connect to the server. Please try again later.')
      }
    })

  
}

//call on start up to start checking
pollForUpdates();

