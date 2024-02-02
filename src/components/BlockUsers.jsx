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
const BlockUsers = () => {
  const [blockList, setBlockList] = useState([]);
  const data = useSelector((state) => state.userInfo.users);
  const db = getDatabase();
  useEffect(() => {
    const userListRef = ref(db, "block/");
    onValue(userListRef, (snapshot) => {
      let blocks = [];
      snapshot.forEach((item) => {
        if (item.val().blockById == data.uid) {
          blocks.push({ ...item.val(), id: item.key });
        }
      });
      setBlockList(blocks);
    });
  }, []);

  const handleUnblock = (item) => {
    set(push(ref(db, "friend")), {
      senderId: item.blockFriendId,
      senderName: item.blockFriendName,
      reciverId: item.blockById,
      reciverName: item.blockByName,
    }).then(() => {
      toast.success("Unblock Successfully", {
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
    remove(ref(db, "block/" + item.id));
  };
  return (
    <div className="content_item">
      <div className="title">
        <h1>Block Users</h1>
        <BsThreeDotsVertical />
      </div>

      {blockList.map((item) => (
        <div className="user" key={item.id}>
          <div className="img_name">
            <div className="img">
              <ProfileImg id={item.blockFriendId} />
            </div>
            <div className="name">
              <h1>{item.blockFriendName}</h1>
            </div>
          </div>
          <div className="buttons">
            <button className="button_v2" onClick={() => handleUnblock(item)}>
              Unblock
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockUsers;
