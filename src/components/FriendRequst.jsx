import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

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
          list.push(item.val());
        }
      });
      setFriendRequstList(list);
    });
  }, []);

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
              <img
                src={item.senderPhotoURL}
                className="w-full rounded-full h-full"
              />
            </div>
            <div className="name">
              <h1>{item.senderName}</h1>
              <p>{item.senderEmail}</p>
            </div>
          </div>
          <div className="buttons">
            <button className="button_v4">Accept</button>
            <button className="button_v3">Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequst;
