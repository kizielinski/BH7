const avengersNames = [
    "Thor",
    "Cap",
    "Tony Stark",
    "Black Panther",
    "Black Widow",
    "Hulk",
    "Spider-Man",
]
let randomName = avengersNames[Math.floor(Math.random() * avengersNames.length)]

const main = async () => {
    VoxeetSDK.initialize("ybMMRur_W-pAPHWbaq1ixw==", "viaCCOZx5hNXaXukEb-b02OjGxiwKpW39FiiCkzY7iw=")
    try {
        // Open the session here !!!!
        await VoxeetSDK.session.open({ name: randomName })
        initUI();
    } catch (e) {
        alert('Something went wrong : ' + e)
    }

    VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
        if (stream.type === 'ScreenShare') return;
    
        if (stream.getVideoTracks().length) {
          addVideoNode(participant, stream);
        }

        addParticipantNode(participant)
      });
      VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
        if (stream.type === 'ScreenShare') return;
    
        if (stream.getVideoTracks().length) {
          addVideoNode(participant, stream);
        } else {
          removeVideoNode(participant);
        }
      });

    VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
        removeVideoNode(participant)
        })
  }


  
  main()