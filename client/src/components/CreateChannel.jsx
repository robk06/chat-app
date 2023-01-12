import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();

        //The channel name will be set to the name or value entered by the user.
        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    )
}

//createType and setIsCreating props are being passed from ChannelContainer. 
const CreateChannel = ({ createType, setIsCreating }) => {
    const { client, setActiveChannel } = useChatContext();
    //The useState is set to the current user by default so they are always in the chat. 
    const [selectedUsers, setSelectedUsers] = useState([client.userID || ''])
    const [channelName, setChannelName] = useState('');

    //This function is called whenever the create channel button is clicked.
    const createChannel = async (e) => {
        e.preventDefault();

        try {
            const newChannel = await client.channel(createType, channelName, {
                name: channelName, members: selectedUsers
            });

            await newChannel.watch();

            //Channel name is reset after a channel has been created.
            setChannelName('');
            //setIsCreating is set back to false after a channel has been created.
            setIsCreating(false);
            //setSelectedUsers is set back to only the current user.
            setSelectedUsers([client.userID]);
            //The active channel is set to the new channel.
            setActiveChannel(newChannel);
        } catch (error) {
            console.log(error);
        }
    }

    return ( //Once CloseCreateChannel button is clicked, setIsCreating is reset to blank as a channel is no longer being created
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
            
                <CloseCreateChannel setIsCreating={setIsCreating} />
                
            </div> 
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
            <UserList setSelectedUsers={setSelectedUsers} /> 
            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
            </div>
        </div>
        //The last few lines of code above create a channel if the type is "team" or a direct message group if the type is not "team". The function createChannel is called whenever the create channel button is clicked. 
    )
}

//The UserList is updated above to setSelectedUsers.

export default CreateChannel