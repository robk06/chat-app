import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';

import '@stream-io/stream-chat-css/dist/css/index.css';
import './App.css';

const cookies = new Cookies();

const apiKey = '5775emsqh6ht';

const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

if(authToken) {
  //This will connect our user and we'll be able to get all of their messages.
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'),
        phoneNumber: cookies.get('phoneNumber'),
    }, authToken)
}


const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  //If there is no auth token, return Auth. 
  if(!authToken) return <Auth />

  //If there is an auth token, show the following. 
  return (
      <div className="app__wrapper">
          <Chat client={client} theme="team light">
              <ChannelListContainer 
                  isCreating={isCreating}
                  setIsCreating={setIsCreating}
                  setCreateType={setCreateType}
                  setIsEditing={setIsEditing}
              />
              <ChannelContainer 
                  isCreating={isCreating}
                  setIsCreating={setIsCreating}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  createType={createType}
              />
          </Chat>
      </div>
  );
}

export default App;