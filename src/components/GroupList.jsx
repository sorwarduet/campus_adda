import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const GroupList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const [groupIntro, setGroupIntro] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [groupIntroError, setGroupIntroError] = useState("");

  const [groupList, setGroupList] = useState([]);
  const [joinGroupList, setJoinGroupList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const data = useSelector((state) => state.userInfo.users);
  const db = getDatabase();

  useEffect(() => {
    const groupRef = ref(db, "groups/");

    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().adminId != data.uid) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  useEffect(() => {
    const groupJoinRef = ref(db, "joinGroupRequest/");

    onValue(groupJoinRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().requestId == data.uid) {
          list.push(item.val().requestId + item.val().groupId);
        }
      });
      setJoinGroupList(list);
    });
  }, []);

  useEffect(() => {
    const groupMember = ref(db, "joinGroups/");

    onValue(groupMember, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().requestId === data.uid) {
          list.push(item.val().requestId + item.val().groupId);
        }
      });
      setGroupMembers(list);
    });
  }, []);


  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setGroupNameError("");
  };

  const handleGroupIntro = (e) => {
    setGroupIntro(e.target.value);
    setGroupIntroError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (groupName == "") {
      setGroupNameError("Emtpy Group Name");
    }
    if (groupIntro == "") {
      setGroupIntroError("Emtpy Group Name Intro");
    }

    if (groupNameError == "" && groupIntroError == "") {
      set(push(ref(db, "groups/")), {
        groupName: groupName,
        groupIntro: groupIntro,
        adminId: data.uid,
        adminName: data.displayName,
      }).then(() => {
        toast.success("Group Created  Successfully", {
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

      setIsModalOpen(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //Join Requst
  const handleJoinRequst = (item) => {
    set(push(ref(db, "joinGroupRequest/")), {
      groupId: item.id,
      groupName: item.groupName,
      groupIntro: item.groupIntro,
      adminId: item.adminId,
      adminName: item.adminName,
      requestId: data.uid,
      requestname: data.displayName,
    }).then(() => {
      toast.success("Join Request Successfully", {
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
        <h1>Group List</h1>
        <button className="button_v4 mr-2" onClick={openModal}>
          Create
        </button>
      </div>

      {groupList.map((item) => (
        <div className="user" key={item.id}>
          <div className="img_name">
            <div className="img"></div>
            <div className="name">
              <h1>{item.groupName}</h1>
              <p>{item.groupIntro}</p>
            </div>
          </div>
          <div className="buttons">
            {joinGroupList.includes(data.uid + item.id) ? (
              <button className="button_v3">Sent Request</button>
            ) : (
                groupMembers.includes(data.uid + item.id) ? (
                        <button
                            className="button_v2"
                        >
                          Member
                        </button>
                    ):
              <button
                className="button_v2"
                onClick={() => handleJoinRequst(item)}
              >
                Join
              </button>
            )}
          </div>
        </div>
      ))}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              className="input_v1"
              onChange={handleGroupName}
              placeholder="Enter Group Name"
            />
            <p className="error">{groupNameError}</p>
            <input
              className="input_v1 mt-3"
              onChange={handleGroupIntro}
              placeholder="Enter Group Intro"
            />
            <p className="error">{groupIntroError}</p>
          </div>
          <div className="flex justify-center">
            <button className="button_v1 ">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupList;
