import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getDatabase, onValue, ref} from "firebase/database";
import ProfileImg from "./ProfileImg.jsx";
import {activeInfo} from "../reducers/activeSlice.js";

const MesFriends = () => {
    const [friendList, setFriendList] = useState([]);
    const [loading, setLoading] = useState(false);
    const data = useSelector((state) => state.userInfo.users);
    const db = getDatabase();
    const dispatch = useDispatch();


    useEffect(() => {
        setLoading(true);
        const userListRef = ref(db, "friend/");
        onValue(userListRef, (snapshot) => {
            let friends = [];
            snapshot.forEach((item) => {
                if (
                    item.val().reciverId === data.uid ||
                    item.val().senderId === data.uid
                ) {
                    friends.push({ ...item.val(), id: item.key });
                }
            });
            setFriendList(friends);
            setLoading(false);
        });
    }, []);


    const handleActiveFriend=(item)=>{
        if (item.reciverId === data.uid) {
            const activeFriend={status: 'single', id:item.senderId, name:item.senderName};
            dispatch(activeInfo(activeFriend));
            localStorage.setItem("activeFriend", JSON.stringify(activeFriend));
        }else{
            const activeFriend={status: 'single', id:item.reciverId, name:item.reciverName};
            dispatch(activeInfo(activeFriend));
            localStorage.setItem("activeFriend", JSON.stringify(activeFriend));
        }

    }

    return (
            friendList.map((item)=> (
                <div className="user" key={item.id}>
                    <div className="img_name">
                        <div className="img">
                            <ProfileImg
                                id={data.uid === item.reciverId ? item.senderId : item.reciverId}
                            />
                        </div>

                        <div className="name">
                            {item.reciverId === data.uid ? (
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
                        <button className="button_v3" onClick={()=>handleActiveFriend(item)}>
                            Message
                        </button>
                    </div>
                </div>
            ))

    )
};

export default MesFriends;
