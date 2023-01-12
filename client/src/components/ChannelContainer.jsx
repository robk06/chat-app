import React from 'react';
import { Channel, MessageSimple } from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
    if(isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }

    if(isEditing) {
        return (
            <div className="channel__container">
                <EditChannel setIsEditing={setIsEditing} />
            </div> 
        )
    }

    //This is the state where a chat has been created and there are no messages.
    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history.</p>
            <p className="channel-empty__second">Send messages, attachments, links, emojis, and more!</p>
        </div>
    )

    return (
        <div className=" channel__container">
            <Channel //This will display messages that the users have sent.
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, i) => <MessageSimple key={i} {...messageProps} />}
            >
                <ChannelInner setIsEditing={setIsEditing} />
            </Channel>
        </div>
    );
}

export default ChannelContainer;