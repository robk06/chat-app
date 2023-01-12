import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from './'
import { SearchIcon } from '../assets';

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    //This helps us identify the active channels and direct message chats.
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    //This function is called every time a search query changes. If a query changes and there is no current query, both team channels and direct channels are reset to empty arrays. 
    useEffect(() => {
        if(!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query])

    //This is an async function because we have to wait for the channels to be fetched.
    const getChannels = async (text) => {
        try {
            //This searches for the channels.
            const channelResponse = client.queryChannels({
                type: 'team', 
                name: { $autocomplete: text }, 
                members: { $in: [client.userID]}
            });
            //This searches for the users and excludes the current user.
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }
            })

            //This allows us to look for the channels and users simultaneously. 
            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

            if(channels.length) setTeamChannels(channels);
            if(users.length) setDirectChannels(users);
            //The search will be reset if there is an error
        } catch (error) {
            setQuery('')
        }
    }

    const onSearch = (event) => {
        //This will prevent the page from being reloaded
        event.preventDefault();

        setLoading(true);
        setQuery(event.target.value);
        getChannels(event.target.value)
    }

    //This resets the search query.
    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-serach__input__icon">
                    <SearchIcon />
                </div>
                <input 
                    className="channel-search__input__text" 
                    placeholder="Search" 
                    type="text" 
                    value={query}  
                    onChange={onSearch}
                />
            </div>
            { query && (
                //If there is a search query, the following allows the search results to be shown. 
                <ResultsDropdown 
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    )
}

export default ChannelSearch