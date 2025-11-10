import React from "react";

export default function ProfileHeader({ profile }) {
  const { profileImage, fullName, username, preferredCategory } = profile || {};

  return (
    <aside className="w-full md:w-72 lg:w-80 p-6 bg-white border rounded-md shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-lg overflow-hidden mb-4">
          <img
            src={profileImage || "/public/avatar-placeholder.png"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold text-n-9">
          {fullName || "No name"}
        </h2>
        <p className="text-sm text-n-6">@{username || "username"}</p>
        {preferredCategory && (
          <p className="mt-2 text-[13px] px-3 py-1 rounded-full bg-primary-2 text-n-1">
            {preferredCategory}
          </p>
        )}
      </div>

      <div className="mt-6 text-sm text-n-7 space-y-3">
        {preferredCategory && (
          <div>
            <div className="text-xs text-n-6">Preferred category</div>
            <div className="mt-1">{preferredCategory}</div>
          </div>
        )}

        <div>
          <div className="text-xs text-n-6">Member since</div>
          <div className="mt-1">
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : "-"}
          </div>
        </div>

        <div>
          <div className="text-xs text-n-6">Last login</div>
          <div className="mt-1">
            {profile?.lastLogin
              ? new Date(profile.lastLogin).toLocaleString()
              : "-"}
          </div>
        </div>
      </div>
    </aside>
  );
}
