# P2PChat

P2PChat is a peer-to-peer video chat application that allows users to create or join rooms for real-time video communication using WebRTC.



## Features
- **Create or Join Rooms:** Start a new room or join using an invite link.
- **Peer-to-Peer Video Chat:** Direct browser-to-browser video communication.
- **Media Controls:** Toggle your camera and microphone on/off.
- **Leave Room:** Exit the room and return to the lobby.

## How it Works
The app uses **WebRTC** for peer-to-peer media transfer, with **Agora RTM** providing signaling.

1. **Lobby:** User creates or joins a room.  
2. **Signaling via Agora RTM:** Exchange of offers/answers and ICE candidates.  
3. **WebRTC Connection:** Direct peer-to-peer channel is established.  
4. **Media Streams:** Audio/video streams are exchanged between peers.  
5. **Leaving Room:** User exits, and the peer is notified.

## Technologies Used
- **HTML, CSS, JavaScript**
- **Agora RTM SDK** (signaling)
- **WebRTC** (video/audio streaming)

## How to Run the Application
1. Clone the repository:
   ```bash
   git clone https://github.com/ratnesh433/p2pchat.git
