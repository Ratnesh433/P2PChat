
P2PChat
P2PChat is a peer-to-peer video chat application that allows users to create or join rooms for video communication.

Preview
Features
Create or Join Rooms: Users can create a new room or join an existing one using an invite link.

Video Chat: The application supports peer-to-peer video chat between two users.

Controls: Users have controls to toggle their camera and microphone on or off.

Leave Room: Users can leave the chat room and return to the lobby.

How it Works
The application uses WebRTC for peer-to-peer communication, facilitated by Agora's RTM (Real-Time Messaging) SDK for signaling.

Lobby: Users start in the lobby where they can create a room or join one using an invite code.

Joining a Room: When a user joins a room, they are assigned a unique user ID and a connection is established to the Agora RTM channel.

Signaling: When a new user joins, an "offer" is created and sent to the other user in the channel via Agora RTM. The receiving user creates an "answer" and sends it back. This exchange of session descriptions (offer/answer) is necessary to establish the WebRTC connection.

ICE Candidates: During the connection process, ICE (Interactive Connectivity Establishment) candidates are exchanged between the peers to find the best path for communication.

Peer-to-Peer Connection: Once the offer/answer exchange is complete and ICE candidates have been successfully exchanged, a direct peer-to-peer connection is established between the users' browsers.

Media Streams: The local user's video and audio stream is sent to the remote user, and vice versa.

Leaving the Channel: When a user leaves the channel, the other user is notified and the video of the user who left is hidden.

Technologies Used
HTML: The structure of the web pages.

CSS: Styling of the application.

JavaScript: The core logic of the application.

Agora RTM SDK: Used for real-time messaging and signaling to establish the WebRTC connection.

WebRTC: Enables peer-to-peer video and audio communication directly between browsers.

How to Run the Application
Clone the repository:

git clone https://github.com/ratnesh433/p2pchat.git
Open lobby.html in your browser.

Create a room: Enter a room name and click "Join Room".

Share the invite link: Share the generated URL with another user to have them join the room.
