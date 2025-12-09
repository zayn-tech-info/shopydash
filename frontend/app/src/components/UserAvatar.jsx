import React from "react";
import { User } from "lucide-react";

const UserAvatar = ({ profilePic, alt, className = "" }) => {
  if (profilePic) {
    return (
      <img
        src={profilePic}
        alt={alt || "User"}
        className={`object-cover rounded-full ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-[#FF5A1F] rounded-full ${className}`}
    >
      <User className="text-white w-1/2 h-1/2" strokeWidth={3} />
    </div>
  );
};

export default UserAvatar;
