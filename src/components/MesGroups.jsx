import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getDatabase, onValue, ref} from "firebase/database";
import {activeInfo} from "../reducers/activeSlice.js";


const MesGroups = () => {
    const [gropupsList, setGropupsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const data = useSelector((state) => state.userInfo.users);
    const db = getDatabase();
    const dispatch=useDispatch();

    const handleActiveGroup=(item)=>{
        const activeFriend={status: 'group', id:item.groupId, name:item.groupName};
        dispatch(activeInfo(activeFriend));
        localStorage.setItem("activeFriend", JSON.stringify(activeFriend));
    }

    useEffect(() => {
        setLoading(true);
        const groupsListRef = ref(db, "groups/");
        onValue(groupsListRef, (snapshot) => {
            let list = [];
            snapshot.forEach((item) => {
                list.push({ ...item.val(), id: item.key });
            });
            setGropupsList(list);
            setLoading(false);
        });
    }, []);

    return (
        gropupsList.map((item)=> (
            <div className="user" key={item.id}>
                <div className="img_name">
                    <div className="img">

                    </div>

                    <div className="name">
                        <div>
                            <h3>Admin:{item.adminName}</h3>
                            <p>Group:{item.groupName}</p>
                            <p>Group Intro:{item.groupIntro}</p>
                        </div>

                    </div>

                </div>
                <div className="buttons">
                    <button className="button_v3" onClick={()=>handleActiveGroup(item)}>
                        Message
                    </button>
                </div>
            </div>
        ))

    )
};

export default MesGroups;
