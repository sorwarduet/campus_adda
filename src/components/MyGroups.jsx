import {getDatabase, onValue, push, ref, remove, set} from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfileImg from "./ProfileImg.jsx";
import {toast} from "react-toastify";
const MyGroups = () => {
  const [groupList, setGroupList] = useState([]);
  const [joinGroupList, setJoinGroupList] = useState([]);
  const [groupJoinRequestList, setGroupJoinRequestList] = useState([]);
  const data = useSelector((state) => state.userInfo.users);
  const db = getDatabase();
  const [showInfo, setShowInfo] = useState(false);
  const [showRequest, setRequestInfo] = useState(false);

  useEffect(() => {
    const groupRef = ref(db, "groups/");

    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().adminId === data.uid) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  const handleGroupInfo = (group) => {
    setShowInfo(true);
    const joinGroupRef=ref(db, "joinGroups/");
    onValue(joinGroupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().groupId === group.id) {
          list.push({ ...item.val(), id: item.key });
        }
      })
      setJoinGroupList(list)
    })

  };


  const handleGroupRequest = (group) => {
    setRequestInfo(true);
    const joinGroupRef=ref(db, "joinGroupRequest/");
   onValue(joinGroupRef, (snapshot) => {
     let list = [];
     snapshot.forEach((item) => {
       if (item.val().groupId === group.id) {
         list.push({ ...item.val(), id: item.key });
       }
     })
     setGroupJoinRequestList(list)
   })

  };
const handleCancelGroupRequest = (group_id) => {

 remove(ref(db, "joinGroupRequest/"+ group_id)).then(()=>{
   toast.success("Cancel  Request Successfully", {
     position: "top-right",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "light",
   });
 })
}

  const handleAccept = (item) => {
    set(push(ref(db, "joinGroups/")), { ...item }).then(() => {
      toast.success("Accept Request Successfully", {
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
    remove(ref(db, "joinGroupRequest/"+ item.id))
  };

  return (
    <div className="content_item">
      <div className="title">
        <h1> {groupList.length <= 1 ? "My Group" : "My Groups"}</h1>

        {showInfo ? (
          <button className="button_v4" onClick={() => setShowInfo(false)}>
            Back
          </button>
        ) : showRequest ? (
          <button className="button_v4" onClick={() => setRequestInfo(false)}>
            Back
          </button>
        ) : (
          <BsThreeDotsVertical />
        )}
      </div>

      {groupList.length <= 0 ? (
        <h2 className="font-bold text-center text-fourth">No Group</h2>
      ) : showInfo ? (
          joinGroupList.length <= 0 ? (
              <h2 className="font-bold text-center text-fourth">No Group Member</h2>
              ):
            joinGroupList.map((item) => (
              <div className="user" key={item.id}>
                <div className="img_name">
                  <div className="img">
                    <ProfileImg id={item.requestId
                    } />
                  </div>
                  <div className="name">
                    <h1>{item.requestname}</h1>
                  </div>
                </div>
                <div className="buttons">
                  <button className="button_v3" >
                    Remove
                  </button>
                </div>
              </div>
          ))
      ) : showRequest ? (
          groupJoinRequestList.length <= 0 ? (
              <h2 className="font-bold text-center text-fourth">No Group Request</h2>
              ):
            groupJoinRequestList.map((item) => (
                <div className="user" key={item.id}>
                  <div className="img_name">
                    <div className="img">
                      <ProfileImg id={item.requestId
                      } />
                    </div>
                    <div className="name">
                      <h1>{item.requestname}</h1>
                    </div>
                  </div>
                  <div className="buttons">
                    <button className="button_v4" onClick={()=>handleAccept(item)} >
                      Accept
                    </button>
                    <button className="button_v3" onClick={()=>handleCancelGroupRequest(item.id)} >
                      Cancel
                    </button>
                  </div>
                </div>
            ))
      ) : (
        groupList.map((item) => (
          <div className="user" key={item.id}>
            <div className="img_name">
              <div className="img"></div>
              <div className="name">
                <h1>{item.groupName}</h1>
                <p>{item.groupIntro}</p>
              </div>
            </div>
            <div className="buttons">
              <button
                className="button_v3"
                onClick={() => handleGroupInfo(item)}
              >
                Info
              </button>
              <button
                className="button_v4"
                onClick={() => handleGroupRequest(item)}
              >
                Request
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyGroups;
