import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

//The code below gives users the ability to add Members (users) to a channel or a direct message chat.

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false)

    const handleSelect = () => {
        //This keeps track of which add member invite boxes have been checked (clicked) and which haven't.
        if(selected) {
            //This removes any user from the selected users that was previously selected to be invited but has now been unchecked.
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
        //If the user has been selected (the UseState determines this) when adding a member to a channel or direct message chat, the InviteIcon is shown which is a checkmark. If a user has not been selected, an empty grey circle is shown.
    )
}


const UserList = ({ setSelectedUsers }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);
            
            try {
                const response = await client.queryUsers(
                    //$ne means not equal to as we don't want to query ourselves i.e. the current user as the current user would like to add someone else to the channel.
                    { id: { $ne: client.userID } },
                    { id: 1 },
                    { limit: 8 } 
                );

                if(response.users.length) {
                    setUsers(response.users);
                    //If there are no users, setListEmpty is set to true.
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
               setError(true);
            }
            //setLoading is set back to false.
            setLoading(false);
        }

        if(client) getUsers()
    }, []);

    //If there is an error, the below is shown instead of the list of members (users) to be added.
    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    //If the user list is empty, the below is shown instead of the members (users) to be added.
    if(listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found.
                </div>
            </ListContainer>
        )
    }

    //If there is no error and there is at least one member in the user list, the members (users) are shown.
    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading users...
            </div> : (
                //Mapping over the users here so a UserItem can be returned for each user. This allows the user's avatar and full name to be shown in the list of users that can be added to a channel or direct message.
                users?.map((user, i) => (
                  <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />  
                ))
            )}
        </ListContainer>
    )
}

export default UserList;