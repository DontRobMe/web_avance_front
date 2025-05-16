import React from 'react';

interface Props {
    users: { id: string; username: string }[];
    selectedUserId: string | null;
    onSelect: (id: string) => void;
}

const UserSelector: React.FC<Props> = ({ users, selectedUserId, onSelect }) => (
    <div className="user-selector">
        <h3>Choisir un utilisateur</h3>
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    <button
                        className={user.id === selectedUserId ? 'selected' : ''}
                        onClick={() => onSelect(user.id)}
                        aria-pressed={user.id === selectedUserId}
                    >
                        {user.username}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

export default UserSelector;
