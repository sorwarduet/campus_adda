import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [friendRequstList, setFriendRequstList] = useState([]);
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.userInfo.users);
  const db = getDatabase();

  useEffect(() => {
    setLoading(true);

    const userListRef = ref(db, "users/");
    onValue(userListRef, (snapshot) => {
      let users = [];
      snapshot.forEach((item) => {
        if (item.key != data.uid) {
          users.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(users);
      setLoading(false);
    });
  }, []);

  const handleAddfriendRequst = (item) => {
    set(push(ref(db, "friendRequst")), {
      reciverId: item.id,
      reciverName: item.fullName,
      senderId: data.uid,
      senderName: data.displayName,
      senderEmail: data.email,
      senderPhotoURL: data.photoURL,
    });
  };

  useEffect(() => {
    const friendReqRef = ref(db, "friendRequst/");

    onValue(friendReqRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().reciverId + item.val().senderId);
      });
      setFriendRequstList(list);
    });
  }, []);

  return (
    <div className="content_item">
      <div className="title">
        <h1>User List</h1>
        <BsThreeDotsVertical />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Circles
            height="40"
            width="40"
            color="#F1A661"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        userList.map((user) => (
          <div className="user" key={user.id}>
            <div className="img_name">
              <div className="img">
                <img
                  src={user.photoURL}
                  className="w-full rounded-full h-full"
                />
              </div>
              <div className="name">
                <h1>{user.fullName}</h1>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="buttons">
              {friendRequstList.includes(user.id + data?.uid) ||
              friendRequstList.includes(data?.uid + user.id) ? (
                <button className="button_v1">Send Requst</button>
              ) : (
                <button
                  className="button_v2"
                  onClick={() => handleAddfriendRequst(user)}
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
