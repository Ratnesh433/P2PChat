// A more secure way to manage App ID is to use a token server.
// For this example, we'll keep it here.
const APP_ID = "7fc45f8934f04d7e84403830d72f319d";

// State Management
let client;
let channel;
let peerConnection;
let localTracks = {
    video: null,
    audio: null,
};
let remoteTracks = {
    video: null,
    audio: null,
};
let uid = String(Math.floor(Math.random() * 10000));
let roomId;
let remoteMemberId;
let iceCandidatesQueue = [];

// DOM Elements
const videoStreamsContainer = document.getElementById('video-streams');
const localPlayer = document.getElementById('user-1');
const remotePlayer = document.getElementById('user-2');
const micBtn = document.getElementById('mic-btn');
const cameraBtn = document.getElementById('camera-btn');
const leaveBtn = document.getElementById('leave-btn');

const servers = {
    iceServers: [{
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
    }]
};

/**
 * Initializes the application, joins the Agora RTM channel, and sets up local media.
 */
const init = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('room');
    if (!roomId) {
        window.location = 'lobby.html';
        return;
    }

    try {
        client = await AgoraRTM.createInstance(APP_ID);
        await client.login({ uid });

        channel = client.createChannel(roomId);
        await channel.join();

        // Set up event listeners
        channel.on('MemberJoined', handleUserJoined);
        channel.on('MemberLeft', handleUserLeft);
        client.on('MessageFromPeer', handleMessageFromPeer);

        // Get local media
        [localTracks.audio, localTracks.video] = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        
        localPlayer.srcObject = new MediaStream([localTracks.video]);
        updateUIMode('local-only');
    } catch (error) {
        console.error("Initialization failed:", error);
        alert("Could not initialize video chat. Please check permissions and network.");
    }
};

/**
 * Handles the UI layout changes.
 * @param {'local-only' | 'full-room'} mode
 */
const updateUIMode = (mode) => {
    if (mode === 'local-only') {
        videoStreamsContainer.classList.remove('two-users');
        remotePlayer.style.display = 'none';
        localPlayer.style.display = 'block';
    } else if (mode === 'full-room') {
        videoStreamsContainer.classList.add('two-users');
        remotePlayer.style.display = 'block';
    }
};

/**
 * Creates and configures the RTCPeerConnection.
 */
const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection(servers);

    // Setup remote stream
    remoteTracks.video = new MediaStreamTrack();
    remoteTracks.audio = new MediaStreamTrack();
    remotePlayer.srcObject = new MediaStream([remoteTracks.video, remoteTracks.audio]);

    // Add local tracks to the connection
    if (localTracks.video) peerConnection.addTrack(localTracks.video, localPlayer.srcObject);
    if (localTracks.audio) peerConnection.addTrack(localTracks.audio, localPlayer.srcObject);

    // Listen for tracks from the remote peer
    peerConnection.ontrack = (event) => {
        if (event.track.kind === 'video') remoteTracks.video = event.track;
        if (event.track.kind === 'audio') remoteTracks.audio = event.track;
        remotePlayer.srcObject = event.streams[0];
    };

    // Listen for ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'candidate', 'candidate': event.candidate }) }, remoteMemberId);
        }
    };
};

/**
 * Handles a new user joining the channel by creating an offer.
 * @param {string} memberId - The ID of the member who joined.
 */
const handleUserJoined = async (memberId) => {
    console.log('A new user joined:', memberId);
    remoteMemberId = memberId;
    createPeerConnection();
    
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'offer', 'offer': offer }) }, memberId);
        updateUIMode('full-room');
    } catch (error) {
        console.error("Error creating offer:", error);
    }
};

/**
 * Handles a user leaving the channel.
 */
const handleUserLeft = () => {
    remoteMemberId = null;
    if(peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    updateUIMode('local-only');
};

/**
 * Handles messages from peers for WebRTC signaling.
 * @param {object} message - The message object from Agora RTM.
 * @param {string} memberId - The ID of the sender.
 */
const handleMessageFromPeer = async (message, memberId) => {
    const data = JSON.parse(message.text);

    try {
        switch (data.type) {
            case 'offer':
                remoteMemberId = memberId;
                createPeerConnection();
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'answer', 'answer': answer }) }, memberId);
                updateUIMode('full-room');
                processIceQueue();
                break;
            case 'answer':
                if (peerConnection && !peerConnection.currentRemoteDescription) {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                    processIceQueue();
                }
                break;
            case 'candidate':
                if (peerConnection && peerConnection.remoteDescription) {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                } else {
                    iceCandidatesQueue.push(data.candidate); // Queue if remote description is not set yet
                }
                break;
        }
    } catch (error) {
        console.error("Error handling message from peer:", error);
    }
};

const processIceQueue = async () => {
    while(iceCandidatesQueue.length > 0) {
        const candidate = iceCandidatesQueue.shift();
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error("Error adding queued ICE candidate", e);
        }
    }
};

/**
 * Toggles the local video track on and off.
 */
const toggleCamera = () => {
    const videoTrack = localTracks.video;
    if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        cameraBtn.classList.toggle('inactive', !videoTrack.enabled);
    }
};

/**
 * Toggles the local audio track on and off.
 */
const toggleMic = () => {
    const audioTrack = localTracks.audio;
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        micBtn.classList.toggle('inactive', !audioTrack.enabled);
    }
};

/**
 * Leaves the channel and cleans up resources.
 */
const leaveChannel = async () => {
    if (channel) await channel.leave();
    if (client) await client.logout();
    if (peerConnection) peerConnection.close();

    localTracks.video?.getTracks().forEach(track => track.stop());
    localTracks.audio?.getTracks().forEach(track => track.stop());

    window.location = 'lobby.html';
};

// Event Listeners
cameraBtn.addEventListener('click', toggleCamera);
micBtn.addEventListener('click', toggleMic);
leaveBtn.addEventListener('click', leaveChannel);
window.addEventListener('beforeunload', leaveChannel);

// Start the application
init();