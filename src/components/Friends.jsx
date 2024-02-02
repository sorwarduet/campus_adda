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
import { Circles } from "react-loader-spinner";
import Processor from "postcss/lib/processor";
import ProfileImg from "./ProfileImg";
import { toast } from "react-toastify";

const Friends = () => {
  const [loading, setLoading] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const data = useSelector((state) => state.userInfo.users);
  const db = getDatabase();
  useEffect(() => {
    setLoading(true);
    const userListRef = ref(db, "friend/");
    onValue(userListRef, (snapshot) => {
      let friends = [];
      snapshot.forEach((item) => {
        if (
          item.val().reciverId == data.uid ||
          item.val().senderId == data.uid
        ) {
          friends.push({ ...item.val(), id: item.key });
        }
      });
      setFriendList(friends);
      setLoading(false);
    });
  }, []);

  const handleBlock = (item) => {
    if (item.senderId == data.uid) {
      set(push(ref(db, "block")), {
        blockId: item.id,
        blockFriendId: item.reciverId,
        blockFriendName: item.reciverName,
        blockById: item.senderId,
        blockByName: item.senderName,
      });
    } else {
      set(push(ref(db, "block")), {
        blockId: item.id,
        blockFriendId: item.senderId,
        blockFriendName: item.senderName,
        blockById: item.reciverId,
        blockByName: item.reciverName,
      });
    }
    remove(ref(db, "friend/" + item.id)).then(() => {
      toast.success("Block Friend Successfully", {
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

  const handleUnfriend = (item) => {
    remove(ref(db, "friend/" + item.id));
  };
  return (
    <div className="content_item">
      <div className="title">
        <h1>Friends</h1>
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
        friendList.map((item) => (
          <div className="user" key={item.id}>
            <div className="img_name">
              <div className="img">
                <ProfileImg
                  id={
                    data.uid == item.reciverId ? item.senderId : item.reciverId
                  }
                />
              </div>
              <div className="name">
                {item.reciverId == data.uid ? (
                  <div>
                    <h1>{item.senderName}</h1>
                    <p>{item.senderEmail}</p>
                  </div>
                ) : (
                  <div>
                    <h1>{item.reciverName}</h1>
                  </div>
                )}
              </div>
            </div>
            <div className="buttons">
              <button className="button_v3" onClick={() => handleBlock(item)}>
                Block
              </button>
              <button
                onClick={() => handleUnfriend(item)}
                className="button_v4"
              >
                Unfriend
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Friends;
