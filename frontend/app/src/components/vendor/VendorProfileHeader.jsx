import { useState, useRef } from "react";
import {
  MapPin,
  Settings,
  Share2,
  Star,
  Link2,
  Calendar,
  ImagePlus,
} from "lucide-react";
import SubscriptionBadge from "../common/SubscriptionBadge";
import UserAvatar from "../UserAvatar";

/**
 * Twitter-style vendor profile header:
 * - Full-width cover (image or gradient), banner upload for owner
 * - Overlapping circular avatar
 * - Name, @handle, bio, location, website, joined, stats
 * - Action buttons (Settings, Share, Message)
 */
export default function VendorProfileHeader({
  vendorProfile,
  authUser,
  isOwner,
  plan,
  displayProfileImage,
  businessName,
  username,
  vendorLocation,
  onCopy,
  openEdit,
  onSettings,
  onMessage,
  onCoverUpload,
  isCoverUploading,
}) {
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const coverInputRef = useRef(null);
  const coverImage = vendorProfile?.coverImage;
  const showCoverOverlay = isOwner && (!coverImage || isHoveringCover);
  const storeDescription = vendorProfile?.storeDescription;
  const website = vendorProfile?.website;
  const products = vendorProfile?.products || [];
  const productCount = products.length;
  const rating = vendorProfile?.rating;
  const numReviews = vendorProfile?.numReviews ?? 0;
  const createdAt = vendorProfile?.createdAt;

  const joinedText = createdAt
    ? `Joined ${new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`
    : null;

  const handleCoverClick = () => {
    if (!isOwner || !onCoverUpload) return;
    coverInputRef.current?.click();
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onCoverUpload) onCoverUpload(file);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-n-3/20 shadow-sm bg-white">
      {/* Cover - responsive aspect and height; owner can upload banner */}
      <div
        className="relative w-full aspect-[3/1] min-h-[100px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] max-h-[240px] bg-gradient-to-br from-[#fdf4ef] via-[#f5e8e0] to-[#ebe2dc] overflow-hidden"
        onMouseEnter={() => isOwner && setIsHoveringCover(true)}
        onMouseLeave={() => setIsHoveringCover(false)}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#fdf4ef] via-[#f5e8e0] to-[#ebe2dc]"
            aria-hidden
          />
        )}

        {isOwner && (
            <>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverFileChange}
              disabled={isCoverUploading}
            />
            {showCoverOverlay && (
              <button
                type="button"
                onClick={handleCoverClick}
                disabled={isCoverUploading}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/40 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-3 focus:ring-offset-2 disabled:opacity-70"
                aria-label={coverImage ? "Change cover image" : "Add cover image"}
              >
                <ImagePlus className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
                <span className="text-white text-sm sm:text-base font-medium">
                  {isCoverUploading ? "Uploading…" : coverImage ? "Change cover" : "Add cover image"}
                </span>
              </button>
            )}
            {/* When cover exists, show a small "Change cover" pill for mobile (no hover) */}
            {isOwner && coverImage && !showCoverOverlay && (
              <button
                type="button"
                onClick={handleCoverClick}
                disabled={isCoverUploading}
                className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-white text-xs font-medium backdrop-blur-sm hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary-3"
                aria-label="Change cover image"
              >
                <ImagePlus className="w-4 h-4" />
                Change cover
              </button>
            )}
          </>
        )}
      </div>

      {/* Content area: avatar overlap + profile info */}
      <div className="relative px-4 sm:px-6 md:px-8 pb-6">
        {/* Row: space for avatar (absolute) + action buttons; negative margin moves this and content below up, profile image unchanged */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2 -mt-3 mb-1 sm:mb-0">
          {/* Invisible spacer so buttons don't overlap avatar; matches avatar width */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 pointer-events-none" aria-hidden />
          {/* Action buttons - wrap on very small screens */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            {isOwner && (
              <button
                onClick={onSettings}
                className="p-2 sm:p-2.5 rounded-full border border-n-3/30 hover:bg-n-2/50 text-n-7 transition-colors touch-manipulation flex-shrink-0"
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={onCopy}
              className="p-2 sm:p-2.5 rounded-full border border-n-3/30 hover:bg-n-2/50 text-n-7 transition-colors touch-manipulation flex-shrink-0"
              title="Share profile"
              aria-label="Share"
            >
              <Share2 size={18} className="sm:w-5 sm:h-5" />
            </button>
            {!isOwner && (
              <button
                onClick={onMessage}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-primary-3 hover:bg-primary-4 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation flex-shrink-0"
              >
                Message
              </button>
            )}
            {isOwner && (
              <button
                onClick={openEdit}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 border-primary-3 text-primary-3 hover:bg-primary-3/5 font-semibold text-xs sm:text-sm transition-colors touch-manipulation flex-shrink-0"
              >
                Edit profile
              </button>
            )}
          </div>
        </div>

        {/* Overlapping avatar - positioned over the spacer */}
        <div className="absolute left-4 sm:left-6 md:left-8 -top-10 sm:-top-14 md:-top-16 z-10">
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-2 sm:border-4 border-white bg-white shadow-lg overflow-hidden ring-2 ring-n-3/10">
            <UserAvatar
              profilePic={displayProfileImage}
              alt={businessName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Spacer so name/handle sit below the avatar row */}
        <div className="h-0 sm:h-2 shrink-0" />

        {/* Name + badge - full width below, no truncate on mobile so it wraps */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-n-8 min-w-0 break-words">
            {businessName || "Store"}
          </h1>
          {plan && (
            <span className="flex-shrink-0">
              <SubscriptionBadge plan={plan} size="sm" />
            </span>
          )}
        </div>

        {/* @handle */}
        <p className="text-n-5 text-sm sm:text-base mb-3 font-medium break-all">
          @{username || "vendor"}
        </p>

        {/* Bio */}
        {storeDescription && (
          <p className="text-n-6 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl whitespace-pre-wrap">
            {storeDescription}
          </p>
        )}

        {/* Meta: location, website, joined - wrap on mobile */}
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-sm text-n-5 mb-4">
          {vendorLocation && (
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="flex-shrink-0" />
              <span>{vendorLocation}</span>
            </span>
          )}
          {website && (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary-3 hover:underline"
            >
              <Link2 size={16} className="flex-shrink-0" />
              <span className="truncate max-w-[180px]">{website}</span>
            </a>
          )}
          {joinedText && (
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="flex-shrink-0" />
              {joinedText}
            </span>
          )}
        </div>

        {/* Stats row - Products, Reviews, Rating - wrap on mobile */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-n-8">{productCount}</span>
            <span className="text-n-5">Products</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-n-8">{numReviews}</span>
            <span className="text-n-5">Reviews</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={16} className="text-amber-500 fill-amber-500 flex-shrink-0" />
            <span className="font-bold text-n-8">
              {rating != null ? Number(rating).toFixed(1) : "—"}
            </span>
            <span className="text-n-5">Rating</span>
          </span>
        </div>
      </div>
    </div>
  );
}
