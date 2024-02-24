import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { BsChatRightFill, BsFillChatLeftFill } from "react-icons/bs";
import { AiFillPicture } from "react-icons/ai";
import { FaLocationArrow } from "react-icons/fa";
import { useSelector } from "react-redux";
import ProfileImg from "./ProfileImg.jsx";
import {
  getDatabase,
  set,
  push,
  ref,
  onValue,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import ModalImage from "react-modal-image";

const Chatting = () => {
  const db = getDatabase();
  const activeInfo = useSelector((state) => state.activeFriend.activeStatus);
  const data = useSelector((state) => state.userInfo.users);

  const [message, setMessage] = useState("");
  const [messagelist, setMessageList] = useState([]);
  const [messageGrouplist, setMessageGroupList] = useState([]);

  //image upload related
  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage();

  const handleImage = (e) => {
    const image = e.target.files[0];

    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setImageUrl(base64String);
      };
      reader.readAsDataURL(image);
    }
  };
  // Image input show for
  const handleButtonClick = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  // End Image Related works

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = () => {
    const options = {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Use 12-hour clock with AM/PM
    };
    const formattedTime = new Date().toLocaleString("en-US", options);

    const messageData = {
      receiverId: activeInfo.id,
      receiverName: activeInfo.name,
      senderId: data.uid,
      senderName: data.displayName,
      msg: message,
      status: activeInfo.status,
      date: formattedTime,
    };

    if (imageUrl) {
      const imageStorageRef = storageRef(storage, uuidv4());

      uploadString(imageStorageRef, imageUrl, "data_url").then((snapshot) => {
        getDownloadURL(imageStorageRef).then((downloadURL) => {
          messageData.imageUrl = downloadURL;

          set(push(ref(db, "singleMessages")), { ...messageData })
            .then(() => {
              setMessage("");
              setImageUrl("");
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
        });
      });
    } else {
      set(push(ref(db, "singleMessages")), { ...messageData })
        .then(() => {
          setMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  const handleGroupMessage = () => {
    const options = {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Use 12-hour clock with AM/PM
    };
    const formattedTime = new Date().toLocaleString("en-US", options);

    const messageData = {
      groupId: activeInfo.id,
      groupName: activeInfo.name,
      senderId: data.uid,
      senderName: data.displayName,
      msg: message,
      status: activeInfo.status,
      date: formattedTime,
    };

    if (imageUrl) {
      const imageStorageRef = storageRef(storage, uuidv4());

      uploadString(imageStorageRef, imageUrl, "data_url").then((snapshot) => {
        getDownloadURL(imageStorageRef).then((downloadURL) => {
          messageData.imageUrl = downloadURL;

          set(push(ref(db, "groupMessages")), { ...messageData })
            .then(() => {
              setMessage("");
              setImageUrl("");
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
        });
      });
    } else {
      set(push(ref(db, "groupMessages")), { ...messageData })
        .then(() => {
          setMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  useEffect(() => {
    const messageRef = ref(db, "singleMessages/");
    onValue(messageRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          (item.val().senderId === data.uid &&
            item.val().receiverId === activeInfo?.id) ||
          (item.val().receiverId === data.uid &&
            item.val().senderId === activeInfo?.id)
        ) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setMessageList(list);
    });
  }, [activeInfo?.id]);

  useEffect(() => {
    const messageRef = ref(db, "groupMessages/");
    onValue(messageRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          item.val().senderId === data.uid &&
          item.val().groupId === activeInfo?.id
        ) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setMessageGroupList(list);
    });
  }, [activeInfo?.id]);

  if (activeInfo !== null) {
    return (
      <div>
        <div className="user">
          <div className="img_name">
            <div className="img">
              {activeInfo.status === "group" ? (
                <h1 className="flex items-center justify-center mt-2 text-4xl text-red-600 font-bold ">
                  {activeInfo.name[0]}
                </h1>
              ) : (
                <ProfileImg id={activeInfo?.id} />
              )}
            </div>
            <div className="name">
              <h1>{activeInfo?.name}</h1>
            </div>
          </div>
        </div>
        <div className=" h-[370px] sticky top-0 left-0 overflow-y-scroll px-3">
          {activeInfo.status === "single"
            ? messagelist.map((item) =>
                item.senderId === activeInfo?.id ? (
                  <div className="text-left" key={item.id}>
                    <div className="px-4 mt-2 mb-2 relative inline-block bg-secondary rounded-md">
                      <BsFillChatLeftFill className="absolute left-[-5px] bottom-[-3px] text-secondary" />
                      {item.imageUrl ? (
                        <ModalImage
                          small={item.imageUrl}
                          large={item.imageUrl}
                          alt="Hello World!"
                        />
                      ) : (
                        ""
                      )}

                      <p className=" relative font-semibold">{item.msg}</p>
                    </div>
                    <p>{item.date}</p>
                  </div>
                ) : (
                  <div className="text-right" key={item.id}>
                    <div className="px-4 mt-2 mb-2 relative inline-block bg-fourth rounded-md">
                      <BsChatRightFill className="absolute right-[-5px] bottom-[-3px] text-fourth" />
                      {item.imageUrl ? (
                        <ModalImage
                          className="w-[100px]"
                          small={item.imageUrl}
                          large={item.imageUrl}
                          alt="Hello World!"
                        />
                      ) : (
                        ""
                      )}
                      <p className=" relative font-semibold">{item.msg}</p>
                    </div>
                    <p>{item.date}</p>
                  </div>
                )
              )
            : messageGrouplist.map((item) =>
                item.senderId !== data.uid ? (
                  <div className="text-left" key={item.id}>
                    <div className="px-4 mt-2 mb-2 relative inline-block bg-secondary rounded-md">
                      <BsFillChatLeftFill className="absolute left-[-5px] bottom-[-3px] text-secondary" />
                      {item.imageUrl ? (
                        <ModalImage
                          small={item.imageUrl}
                          large={item.imageUrl}
                          alt="Hello World!"
                        />
                      ) : (
                        ""
                      )}

                      <p className=" relative font-semibold">{item.msg}</p>
                    </div>
                    <p>{item.date}</p>
                  </div>
                ) : (
                  <div className="text-right" key={item.id}>
                    <div className="px-4 mt-2 mb-2 relative inline-block bg-fourth rounded-md">
                      <BsChatRightFill className="absolute right-[-5px] bottom-[-3px] text-fourth" />
                      {item.imageUrl ? (
                        <ModalImage
                          className="w-[100px]"
                          small={item.imageUrl}
                          large={item.imageUrl}
                          alt="Hello World!"
                        />
                      ) : (
                        ""
                      )}
                      <p className=" relative font-semibold">{item.msg}</p>
                    </div>
                    <p>{item.date}</p>
                  </div>
                )
              )}
        </div>

        {activeInfo.status === "single" ? (
          <div className="absolute bottom-2 px-2 left-0 flex justify-between items-center">
            <div className="relative">
              <input
                className="input_v2 w-[420px] "
                value={message}
                onChange={handleChange}
              />
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                className="hidden"
                onChange={handleImage}
              />
              <AiFillPicture
                onClick={handleButtonClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-fourth"
              />
            </div>
            {message !== "" || imageUrl !== "" ? (
              <button
                className="border ml-2 p-2 font-semibold rounded-md border-fourth text-fourth"
                onClick={handleSendMessage}
              >
                <FaLocationArrow />
              </button>
            ) : (
              <button className="border ml-2 p-2 font-semibold rounded-md border-fourth text-fourth cursor-not-allowed opacity-25">
                <FaLocationArrow />
              </button>
            )}
          </div>
        ) : (
          <div className="absolute bottom-2 px-2 left-0 flex justify-between items-center">
            <div className="relative">
              <input
                className="input_v2 w-[420px] "
                value={message}
                onChange={handleChange}
              />
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                className="hidden"
                onChange={handleImage}
              />
              <AiFillPicture
                onClick={handleButtonClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-fourth"
              />
            </div>
            {message !== "" || imageUrl !== "" ? (
              <button
                className="border ml-2 p-2 font-semibold rounded-md border-fourth text-fourth"
                onClick={handleGroupMessage}
              >
                <FaLocationArrow />
              </button>
            ) : (
              <button className="border ml-2 p-2 font-semibold rounded-md border-fourth text-fourth cursor-not-allowed opacity-25">
                <FaLocationArrow />
              </button>
            )}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-2xl text-fourth"> No Active Friend or Group</h1>
      </div>
    );
  }
};

export default Chatting;
