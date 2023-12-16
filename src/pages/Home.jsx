import UserList from "../components/UserList";
import Friends from "../components/Friends";
import GroupList from "../components/GroupList";
import FriendRequst from "../components/FriendRequst";
import MyGroups from "../components/MyGroups";
import BlockUsers from "../components/BlockUsers";

const Home = () => {
  return (
    <div id="home">
      <div className="item">
        <GroupList />
      </div>

      <div className="item">
        <Friends />
      </div>
      <div className="item">
        <UserList />
      </div>
      <div className="item">
        <FriendRequst />
      </div>

      <div className="item">
        <MyGroups />
      </div>

      <div className="item">
        <BlockUsers />
      </div>
    </div>
  );
};

export default Home;
