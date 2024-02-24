import { BsThreeDotsVertical } from "react-icons/bs";
import { FaLocationArrow } from "react-icons/fa";
import { BsFillChatLeftFill } from "react-icons/bs";
import { BsChatRightFill } from "react-icons/bs";
import MesFriends from "../components/MesFriends.jsx";
import MesGroups from "../components/MesGroups.jsx";
import Chatting from "../components/Chatting.jsx";

const Chat = () => {
  return (
    <div
      id="chat"
      className="container px-[10px] md:px-[200px] flex justify-between flex-wrap  mt-5"
    >
      <div className="w-full md:w-[40%] flex flex-col justify-center items-center">
        <div className="item">
          <div className="content_item">
            <div className="title">
              <h1>Friend</h1>
              <BsThreeDotsVertical />
            </div>
            <MesFriends />
          </div>
        </div>

        <div className="item">
          <div className="content_item">
            <div className="title">
              <h1>Groups</h1>
              <BsThreeDotsVertical />
            </div>
            <MesGroups />
          </div>
        </div>
      </div>

      <div
        id="right_chat"
        className="right w-[100%] md:w-[55%] h-[500px]  relative  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
      >
        <Chatting />
      </div>
    </div>
  );
};

export default Chat;
