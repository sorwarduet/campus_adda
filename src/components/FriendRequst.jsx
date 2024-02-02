import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfileImg from "./ProfileImg";
import { toast } from "react-toastify";

const FriendRequst = () => {
  const db = getDatabase();
  const [friendRequstList, setFriendRequstList] = useState([]);
  const data = useSelector((state) => state.userInfo.users);

  useEffect(() => {
    const friendReqRef = ref(db, "friendRequst/");

    onValue(friendReqRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().reciverId == data.uid) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequstList(list);
    });
  }, []);

  const handleAccept = (item) => {
    set(push(ref(db, "friend")), { ...item }).then(() => {
      toast.success("Accept Friend Successfully", {
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
    remove(ref(db, "friendRequst/" + item.id));
  };

  const handleDelete = (item) => {
    remove(ref(db, "friendRequst/" + item.id)).then(() => {
      toast.success("Cancel Friend Requst Successfully", {
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

  return (
    <div className="content_item">
      <div className="title">
        <h1>Friend Requst</h1>
        <BsThreeDotsVertical />
      </div>
      {friendRequstList.map((item) => (
        <div className="user" key={item.reciverId}>
          <div className="img_name">
            <div className="img">
              <ProfileImg id={item.senderId} />
            </div>
            <div className="name">
              <h1>{item.senderName}</h1>
              <p>{item.senderEmail}</p>
            </div>
          </div>
          <div className="buttons">
            <button className="button_v4" onClick={() => handleAccept(item)}>
              Accept
            </button>
            <button className="button_v3" onClick={() => handleDelete(item)}>
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequst;
