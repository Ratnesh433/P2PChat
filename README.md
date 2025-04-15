# P2PChat

A simple, browser-based peer-to-peer video chat application that enables users to create or join rooms for real-time video communication.

![P2PChat Interface](https://img.shields.io/badge/P2PChat-Video%20Communication-blueviolet)

## Features

- Real-time peer-to-peer video and audio communication
- Create or join rooms via unique room IDs
- Toggle camera on/off
- Toggle microphone on/off
- Responsive design that works on both desktop and mobile devices
- Simple, user-friendly interface

## Technology Stack

- HTML5, CSS3, JavaScript
- WebRTC for peer-to-peer media connections
- Agora RTM SDK for signaling
- STUN servers for NAT traversal

## How It Works

P2PChat uses WebRTC technology to establish direct peer-to-peer connections between users, allowing for low-latency, high-quality video and audio communication without the need for your data to go through a central server.

1. Users create or join a room using a unique room ID
2. When a second user joins, WebRTC connection is established using STUN servers
3. Video and audio streams are shared directly between peers
4. Users can control their camera and microphone during the call

## Setup and Installation

1. Clone the repository
   ```
   git clone https://github.com/Ratnesh433/P2PChat.git
   ```

2. Navigate to the project directory
   ```
   cd P2PChat
   ```

3. Open `main.js` and replace the `APP_ID` with your own Agora App ID
   ```javascript
   let APP_ID = "YOUR_AGORA_APP_ID"
   ```

4. Serve the application using a local web server
   ```
   // Using Python 3
   python -m http.server
   
   // Using Node.js
   npx serve
   ```

5. Access the application through your browser at `http://localhost:8000` (or whatever port your server is using)

## Usage

1. Open the application in your browser
2. Create a new room by entering a room ID or join an existing room using a shared room ID
3. Allow browser permissions for camera and microphone access
4. Begin your video chat
5. Use the control buttons at the bottom to toggle camera and microphone
6. Click the red phone button or close the browser tab to leave the chat

## Requirements

- Modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- Camera and microphone access
- Internet connection with sufficient bandwidth for video calling

## License

[MIT License](LICENSE)

## Acknowledgements

- Agora for providing the RTM SDK for signaling
- Google and Mozilla for STUN servers
