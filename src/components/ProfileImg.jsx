import { useState } from "react";
import profile_image from "../assets/images/profile.jpg";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
const ProfileImg = ({ id }) => {
  const [image, setImage] = useState("");
  const storage = getStorage();

  getDownloadURL(ref(storage, id)).then((url) => {
    setImage(url);
  });

  return (
    <div>
      {image ? (
        <img src={image} className="w-full rounded-full h-full" />
      ) : (
        <img src={profile_image} className="w-full rounded-full h-full" />
      )}
    </div>
  );
};

export default ProfileImg;
