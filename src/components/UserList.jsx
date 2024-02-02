import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import ProfileImg from "./ProfileImg";
import { toast } from "react-toastify";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [friendRequstList, setFriendRequstList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [blockList, setBlockList] = useState([]);
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
    }).then(() => {
      toast.success("Sent Friend Request Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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

  useEffect(() => {
    const friendRef = ref(db, "friend/");

    onValue(friendRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().reciverId + item.val().senderId);
      });
      setFriendList(list);
    });
  }, []);

  useEffect(() => {
    const friendBlockRef = ref(db, "block/");

    onValue(friendBlockRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().blockFriendId + item.val().blockById);
      });
      setBlockList(list);
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
                <ProfileImg id={user.id} />
              </div>
              <div className="name">
                <h1>{user.fullName}</h1>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="buttons">
              {friendList.includes(user.id + data?.uid) ||
              friendList.includes(data?.uid + user.id) ? (
                <button className="button_v3">Friend</button>
              ) : friendRequstList.includes(user.id + data?.uid) ||
                friendRequstList.includes(data?.uid + user.id) ? (
                <button className="button_v4">Send Requst</button>
              ) : blockList.includes(user.id + data?.uid) ||
                blockList.includes(data?.uid + user.id) ? (
                <button className="button_v2">Block</button>
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
