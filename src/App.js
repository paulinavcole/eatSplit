import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend(friend) {
    // don't mutate array, create new array with new friend obj added so that react re-renders
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList friends={friends} onSelection={handleSelection} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

// needed to lift friends state up to parent component. did this by bringing the friends list up to the app component, then passing friends as prop to FriendsList. now accepting friends as a prop in friendslist
function FriendsList({ friends, onSelection }) {
  return (
    <h1>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} />
      ))}
    </h1>
  );
}

function Friend({ friend, onSelection }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className='black'>You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>Select</Button>
    </li>
  );
}

// steps: define state, set value to state, listen to change event with on change listener, then take the event and update the state using set state
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  // event handler function for a form always need to prevent default which is reloading the page
  // this form will create a new friend obj so that we can add that to our array
  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();

    if (!name || !image) return;

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id: id,
    };
    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>🤡 Friend name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>👻 Image URL</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend }) {
  return (
    <form className='form-split-bill'>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>💩 Bill Value</label>
      <input type='text' />

      <label>🎃 Your expense</label>
      <input type='text' />

      <label>🤖 {selectedFriend.name}'s expense</label>
      <input type='text' disabled />

      <label>☠️ Who is paying the bill?</label>
      <select>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
