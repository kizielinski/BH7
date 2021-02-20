/*
* Consumer Key: ybMMRur_W-pAPHWbaq1ixw==
* Consumer Secret: viaCCOZx5hNXaXukEb-b02OjGxiwKpW39FiiCkzY7iw=
*/
// ui.js
const initUI = () => {
    const nameMessage = document.getElementById("name-message")
    nameMessage.innerHTML = `You are logged in as ${randomName}`

    const joinButton = document.getElementById('join-btn')
    const conferenceAliasInput = document.getElementById('alias-input')
    const leaveButton = document.getElementById('leave-btn')
    const startVideoBtn = document.getElementById('start-video-btn');
    const stopVideoBtn = document.getElementById('stop-video-btn')

    joinButton.disabled = false

    joinButton.onclick = () => {
        let conferenceAlias = conferenceAliasInput.value;

        /*
        1. Create a conference room with an alias
        2. Join the conference with its id
        */
        VoxeetSDK.conference.create({ alias: conferenceAlias })
            .then((conference) => VoxeetSDK.conference.join(conference, {}))
            .then(() => {
                joinButton.disabled = true;
                leaveButton.disabled = false
                startVideoBtn.disabled = false
            })
            .catch((e) => console.log('Something wrong happened : ' + e))
    };

    

    leaveButton.onclick = () => {
        VoxeetSDK.conference
            .leave()
            .then(() => {
                joinButton.disabled = false
                leaveButton.disabled = true
            })
            .catch(err => {
                console.log(err)
            })
    }

    startVideoBtn.onclick = () => {
        VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant).then(() => {
          startVideoBtn.disabled = true
          stopVideoBtn.disabled = false;
        })
      }

    stopVideoBtn.onclick = () => {
        VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant).then(() => {
            stopVideoBtn.disabled = true
            startVideoBtn.disabled = false
        })
    }
}

/*
    addVideoNode(userId, stream): void
    create a video node element on the video-container <div> for a participant with userId
    */
   const addVideoNode = (participant, stream) => {
    let videoNode = document.getElementById('video-' + participant.id);

    if (!videoNode) {
    videoNode = document.createElement('video');

    videoNode.setAttribute('id', 'video-' + participant.id);
    videoNode.setAttribute('height', 240);
    videoNode.setAttribute('width', 320);
    videoNode.setAttribute("playsinline", true);
    videoNode.setAttribute("muted", true);
    videoNode.setAttribute("autoplay", 'autoplay');

    const videoContainer = document.getElementById('video-container');
    videoContainer.appendChild(videoNode);
    }

    navigator.attachMediaStream(videoNode, stream);
};

const removeVideoNode = participant => {
    let videoNode = document.getElementById("video-" + participant.id)

    if (videoNode) {
        videoNode.parentNode.removeChild(videoNode)
    }
}

const addParticipantNode = participant => {
    const participantsList = document.getElementById("participants-list")
  
    // if the participant is the current session user, don’t add himself to the list
    if (participant.id === VoxeetSDK.session.participant.id) return
  
    let participantNode = document.createElement("li")
    participantNode.setAttribute("id", "participant-" + participant.id)
    participantNode.innerText = `${participant.info.name}`
  
    participantsList.appendChild(participantNode)
}

const removeParticipantNode = participant => {
    let participantNode = document.getElementById("participant-" + participant.id)

    if (participantNode) {
        participantNode.parentNode.removeChild(participantNode)
    }
}